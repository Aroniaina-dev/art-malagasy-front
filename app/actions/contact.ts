"use server";

import { z } from "zod";
import { api, ApiError } from "@/lib/api";

export type FormState = { ok?: boolean; error?: string };

const schema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(200),
  subject: z.enum(["commande", "produit", "livraison", "autre"]),
  message: z.string().trim().min(5, "Message trop court").max(4000),
});

export async function sendContact(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, subject, message } = parsed.data;
  try {
    await api("/messages", { method: "POST", json: { nom: name, email, sujet: subject, message } });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Envoi impossible pour le moment." };
  }
  return { ok: true };
}
