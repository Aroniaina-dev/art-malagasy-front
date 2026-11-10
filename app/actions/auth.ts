"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import { COOKIE, verifyToken } from "@/lib/session";
import type { FormState } from "./contact";

/** N'autorise que les redirections internes. */
const safePath = (p: FormDataEntryValue | null) => {
  const v = typeof p === "string" ? p : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/compte";
};

async function startSession(email: string, password: string): Promise<string | null> {
  try {
    const res = await api<{ access: string }>("/auth/login", { method: "POST", json: { email, password } });
    const session = await verifyToken(res.access);
    if (!session) return "Connexion impossible : configuration du secret JWT incohérente.";
    (await cookies()).set(COOKIE, res.access, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return null;
  } catch (e) {
    if (e instanceof ApiError) {
      // 400 = email ou mot de passe faux : message volontairement générique
      return e.status === 400 ? "Email ou mot de passe incorrect." : e.message;
    }
    throw e;
  }
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Email et mot de passe requis." };
  const error = await startSession(email, password);
  if (error) return { error };
  redirect(safePath(form.get("callbackUrl")));
}

const registerSchema = z.object({
  nom: z.string().trim().min(2, "Nom trop court").max(100),
  prenom: z.string().trim().min(2, "Prénom trop court").max(100),
  email: z.string().trim().toLowerCase().email("Email invalide").max(200),
  tel: z.string().trim().max(30).optional(),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum").max(200),
});

export async function register(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  try {
    await api("/utilisateur", {
      method: "POST",
      json: { nom: d.nom, prenom: d.prenom, email: d.email, tel: d.tel, password: d.password, passwordConfirm: d.password },
    });
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: /duplicate|E11000|existe/i.test(e.message) ? "Un compte existe déjà avec cet email." : e.message };
    }
    throw e;
  }
  const error = await startSession(d.email, d.password);
  if (error) return { error: "Compte créé, mais la connexion a échoué. Essayez de vous connecter." };
  redirect(safePath(form.get("callbackUrl")));
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/");
}
