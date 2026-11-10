import { jwtVerify } from "jose";

// Version sans "server-only" ni next/headers, utilisable dans proxy.ts.
export const COOKIE_NAME = "am_token";

export async function verify(token: string | undefined): Promise<{ role: number } | null> {
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return { role: Number(payload.role) };
  } catch {
    return null;
  }
}
