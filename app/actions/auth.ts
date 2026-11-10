"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import { dictionaries, isLang, type Dict, type Lang } from "@/lib/dictionaries";
import { COOKIE, verifyToken } from "@/lib/session";
import type { FormState } from "./contact";

const langOf = (form: FormData): Lang => {
  const l = String(form.get("lang") ?? "");
  return isLang(l) ? l : "fr";
};

/** N'autorise que les redirections internes. */
const safePath = (p: FormDataEntryValue | null, lang: Lang) => {
  const v = typeof p === "string" ? p : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : `/${lang}/compte`;
};

async function startSession(email: string, password: string, e: Dict["errors"]): Promise<string | null> {
  try {
    const res = await api<{ access: string }>("/auth/login", { method: "POST", json: { email, password } });
    const session = await verifyToken(res.access);
    if (!session) return e.jwt;
    (await cookies()).set(COOKIE, res.access, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return null;
  } catch (err) {
    if (err instanceof ApiError) {
      // 400 = email ou mot de passe faux : message volontairement générique
      return err.status === 400 ? e.credentials : err.message;
    }
    throw err;
  }
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const lang = langOf(form);
  const e = dictionaries[lang].errors;
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: e.required };
  const error = await startSession(email, password, e);
  if (error) return { error };
  redirect(safePath(form.get("callbackUrl"), lang));
}

export async function register(_prev: FormState, form: FormData): Promise<FormState> {
  const lang = langOf(form);
  const e = dictionaries[lang].errors;
  const schema = z.object({
    nom: z.string().trim().min(2, e.nameShort).max(100),
    prenom: z.string().trim().min(2, e.firstNameShort).max(100),
    email: z.string().trim().toLowerCase().email(e.emailInvalid).max(200),
    tel: z.string().trim().max(30).optional(),
    password: z.string().min(8, e.passwordShort).max(200),
  });
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  try {
    await api("/utilisateur", {
      method: "POST",
      json: { nom: d.nom, prenom: d.prenom, email: d.email, tel: d.tel, password: d.password, passwordConfirm: d.password },
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: /duplicate|E11000|existe/i.test(err.message) ? e.exists : err.message };
    }
    throw err;
  }
  const error = await startSession(d.email, d.password, e);
  if (error) return { error: e.createdButLogin };
  redirect(safePath(form.get("callbackUrl"), lang));
}

export async function logout(form?: FormData) {
  (await cookies()).delete(COOKIE);
  const l = form ? String(form.get("lang") ?? "") : "";
  redirect(isLang(l) ? `/${l}` : "/");
}
