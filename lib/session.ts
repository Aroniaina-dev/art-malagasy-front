import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

import { COOKIE_NAME } from "./proxy-auth";

export const COOKIE = COOKIE_NAME;

export type Session = { id: string; email: string; role: number; token: string };

/** Vérifie la signature et l'expiration du JWT émis par le back. */
export async function verifyToken(token: string): Promise<Session | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return { id: String(payload.id), email: String(payload.email), role: Number(payload.role), token };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

export async function requireUser(callbackUrl = "/compte") {
  const s = await getSession();
  if (!s) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return s;
}

/** À appeler dans chaque page ET chaque action admin ; le back revérifie de toute façon le rôle. */
export async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== 1) redirect("/login?callbackUrl=/admin");
  return s;
}
