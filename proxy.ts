import { NextResponse, type NextRequest } from "next/server";
import { defaultLang, isLang, type Lang } from "./lib/dictionaries";
import { COOKIE_NAME, verify } from "./lib/proxy-auth";

/** Langue du visiteur : cookie posé par le sélecteur, sinon langue du navigateur (français ou anglais). */
function pickLang(req: NextRequest): Lang {
  const saved = req.cookies.get("lang")?.value;
  if (saved && isLang(saved)) return saved;
  const accept = req.headers.get("accept-language");
  if (!accept) return defaultLang;
  const first = accept.split(",")[0].trim().toLowerCase();
  return first.startsWith("fr") ? "fr" : "en"; // tout visiteur non francophone voit l'anglais
}

// 1) Ajoute le préfixe de langue aux pages publiques. 2) Premier filtre d'accès pour /admin et /compte
//    (les pages et actions revérifient la session, et le back vérifie le rôle).
export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const session = await verify(req.cookies.get(COOKIE_NAME)?.value);
    if (session?.role === 1) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = `/${pickLang(req)}/login`;
    url.search = `?callbackUrl=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  const seg = pathname.split("/")[1] ?? "";
  if (!isLang(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${pickLang(req)}${pathname === "/" ? "" : pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
  }

  const rest = pathname.slice(seg.length + 1) || "/";
  if (rest === "/compte" || rest.startsWith("/compte/")) {
    const session = await verify(req.cookies.get(COOKIE_NAME)?.value);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = `/${seg}/login`;
      url.search = `?callbackUrl=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  // Tout sauf les fichiers internes de Next et les fichiers statiques (avec extension).
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};
