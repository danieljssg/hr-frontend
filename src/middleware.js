// middleware.js
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/settings", "/users"];
const authRoutes = ["/auth/login", "/auth/signup"];

export async function middleware(request) {
  const jwtCookie = request.cookies.get("jwt");
  const pathname = request.nextUrl.pathname;

  let hasToken = false;
  if (jwtCookie && jwtCookie.value) {
    hasToken = true;
    request.headers.set("Authorization", `Bearer ${jwtCookie.value}`);
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !hasToken) {
    console.warn(`Acceso denegado a ${pathname}. Redirigiendo a /auth/login`);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && hasToken) {
    console.warn(
      `Usuario ya tiene sesión en ${pathname}. Redirigiendo a /dashboard`
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  if (pathname === "/" && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
