import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/giris";
    url.search = `?yonlendir=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/yonetim") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/panel", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/panel/:path*", "/yonetim/:path*", "/odeme/:path*"] };
