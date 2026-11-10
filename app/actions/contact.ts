"use server";

import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import { dictionaries, isLang, type Dict } from "@/lib/dictionaries";

export type FormState = { ok?: boolean; error?: string };

/** Textes d'erreur dans la langue du formulaire (champ caché "lang"). */
const errorsFor = (form: FormData): Dict["errors"] => {
  const l = String(form.get("lang") ?? "");
  return dictionaries[isLang(l) ? l : "fr"].errors;
};

export async function sendContact(_prev: FormState, form: FormData): Promise<FormState> {
  const e = errorsFor(form);
  const schema = z.object({
    name: z.string().trim().min(1, e.nameRequired).max(100),
    email: z.string().trim().email(e.emailInvalid).max(200),
    subject: z.enum(["commande", "produit", "livraison", "autre"]),
    message: z.string().trim().min(5, e.messageShort).max(4000),
  });
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, subject, message } = parsed.data;
  try {
    await api("/messages", { method: "POST", json: { nom: name, email, sujet: subject, message } });
  } catch (err) {
    // route absente du back ou panne : message neutre plutôt qu'un détail technique
    return { error: err instanceof ApiError && err.status < 500 && err.status !== 404 ? err.message : e.sendFailed };
  }
  return { ok: true };
}
