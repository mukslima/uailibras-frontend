import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-uailibras-locale", request.nextUrl.pathname.startsWith("/en") ? "en" : "pt-BR");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|assets|favicon.ico|robots.txt|sitemap.xml).*)"],
};
