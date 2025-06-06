import authConfig from "./auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);

import {
  passwordReset,
  authRoute,
  apiPrefix,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./route";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, headers } = req;
  const isLoggedIn = !!req.auth;

  // Route type checks
  const isPasswordReset = nextUrl.pathname.startsWith(passwordReset);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiPrefix);
  const isAuthRoute = authRoute.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Security: Allow requests from load balancer and trusted proxies
// Allow both load balancer AND backend hosts
const allowedHosts = [
  "talkify-app-wlzu.onrender.com", // Load balancer
  // "talkify-app1.onrender.com",     // Backends
  // "talkify-app2.onrender.com",
  // "talkify-app3.onrender.com"
];

  const host = headers.get("host") || "";
  const referer = headers.get("referer") || "";
  const origin = headers.get("origin") || "";
  const forwardedHost = headers.get("x-forwarded-host") || "";
  const forwardedFor = headers.get("x-forwarded-for") || "";

  // Check if request comes from allowed source
  const isAllowedRequest = allowedHosts.some(allowedHost => 
    host.includes(allowedHost) ||
    referer.includes(allowedHost) ||
    origin.includes(allowedHost) ||
    forwardedHost.includes(allowedHost)
  );
  // const allowedReferer = 'https://talkify-app-wlzu.onrender.com';
  // // Check if request is from internal network (proxy)
  // if (!referer.startsWith(allowedReferer)) {
  //   return new NextResponse('Access Denied', { status: 403 });
  // }
  // const isFromProxy = forwardedFor && !forwardedFor.startsWith("127.0.0.1");

  // // Block unauthorized direct access
  // if (!isAllowedRequest && !isFromProxy) {
  //   console.warn(`Blocked direct access attempt from: ${host}`);
  //   return new Response("Access Denied: Direct access blocked", { 
  //     status: 403,
  //     headers: {
  //       "X-Allowed-Hosts": allowedHosts.join(", ")
  //     }
  //   });
  // }

  // Skip middleware for password reset and API routes
  if (isPasswordReset || isApiAuthRoute) {
    return;
  }

  // Redirect logged-in users away from auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Redirect unauthenticated users from protected routes
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};