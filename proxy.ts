import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verify } from "./lib/proxy-auth";

// Premier filtre : redirige vers /login. Les pages et actions revérifient la session, et le back vérifie le rôle.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verify(req.cookies.get(COOKIE_NAME)?.value);
  const allowed = pathname.startsWith("/admin") ? session?.role === 1 : !!session;
  if (allowed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?callbackUrl=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
