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

export default auth((req) => {
  const { nextUrl, headers } = req;
  const isLoggedIn = !!req.auth;

  const isPasswordReset = nextUrl.pathname.startsWith(passwordReset);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiPrefix);
  const isAuthRoute = authRoute.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // 🛡️ BLOCK DIRECT ACCESS TO THIS APP INSTANCE
  const allowedHost = "talkify-app-wlzu.onrender.com"; // main public load balancer
  const referer = headers.get("referer") || "";
  const origin = headers.get("origin") || "";
  const forwardedHost = headers.get("x-forwarded-host") || "";
  const host = headers.get("host") || "";

  const isAllowedRequest =
    [referer, origin, forwardedHost, host].some((value) =>
      value.includes(allowedHost)
    );

  if (!isAllowedRequest) {
    return new Response("Access Denied: Direct access blocked", { status: 403 });
  }

  // ✅ Existing logic preserved
  if (isPasswordReset || isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
