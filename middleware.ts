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

  const host = headers.get("host") || "";
  const referer = headers.get("referer") || "";
  const origin = headers.get("origin") || "";
  const forwardedHost = headers.get("x-forwarded-host") || "";


const allowedHosts = [
  "talkify-app-wlzu.onrender.com", 
  "talkify-io.vercel.app", 
  "talkify-app2.onrender.com",
  "talkify-app1.onrender.com",
  "talkify-app3.onrender.com", 
  "talkify-io2.vercel.app",
  "talkify-8b6z.vercel.app",
  "talkify-io3.vercel.app"       
];

const isAllowedRequest = allowedHosts.some(allowedHost =>
  host === allowedHost ||
  referer.includes(allowedHost) ||
  origin.includes(allowedHost) ||
  forwardedHost === allowedHost
);
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

// Block if direct or non-NGINX access
if (!isAllowedRequest) {
  return new Response("Access Denied", {
    status: 403,
    headers: {
      "X-Allowed-Hosts": allowedHosts.join(", "),
    },
  });
}


  // Redirect unauthenticated users from protected routes
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    // const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(`/auth/login`, nextUrl));
  }
  

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};