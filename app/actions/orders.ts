"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import { dictionaries, isLang, type Lang } from "@/lib/dictionaries";

export type OrderState = { error?: string };

/** Commande invitée : le back recalcule prix et total depuis la base (en ariary). */
export async function placeOrder(_prev: OrderState, form: FormData): Promise<OrderState> {
  const l = String(form.get("lang") ?? "");
  const lang: Lang = isLang(l) ? l : "fr";
  const e = dictionaries[lang].errors;

  const schema = z.object({
    nom: z.string().trim().min(1, e.nameRequired).max(100),
    prenom: z.string().trim().min(1, e.firstNameRequired).max(100),
    telephone: z.string().trim().min(6, e.phoneRequired).max(30),
    email: z.string().trim().email(e.emailInvalid).max(254).optional().or(z.literal("")),
    adresse: z.string().trim().min(5, e.addressRequired).max(300),
    ville: z.string().trim().min(2, e.cityRequired).max(100),
    instructions: z.string().trim().max(1000).optional(),
    cart: z.string(),
  });
  const cartSchema = z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(50) })).min(1, e.cartEmpty);

  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let raw: unknown;
  try {
    raw = JSON.parse(parsed.data.cart);
  } catch {
    return { error: e.cartInvalid };
  }
  const lines = cartSchema.safeParse(raw);
  if (!lines.success) return { error: lines.error.issues[0].message };

  const { cart: _cart, email, instructions, ...customer } = parsed.data;
  void _cart;

  let code: string;
  try {
    const res = await api<{ data: { trackingCode: string } }>("/commandes", {
      method: "POST",
      json: {
        customer: { ...customer, ...(email ? { email } : {}), ...(instructions ? { instructions } : {}) },
        items: lines.data.map((line) => ({ articleId: line.id, quantite: line.qty })),
      },
    });
    code = res.data.trackingCode;
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }
  redirect(`/${lang}/suivi/${code}?merci=1`);
}
