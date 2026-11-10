"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";

export type OrderState = { error?: string };

const schema = z.object({
  nom: z.string().trim().min(1, "Nom requis").max(100),
  prenom: z.string().trim().min(1, "Prénom requis").max(100),
  telephone: z.string().trim().min(6, "Téléphone requis").max(30),
  email: z.string().trim().email("Email invalide").max(254).optional().or(z.literal("")),
  adresse: z.string().trim().min(5, "Adresse requise").max(300),
  ville: z.string().trim().min(2, "Ville requise").max(100),
  instructions: z.string().trim().max(1000).optional(),
  cart: z.string(),
});

const cartSchema = z
  .array(z.object({ id: z.string(), qty: z.number().int().min(1).max(50) }))
  .min(1, "Votre panier est vide.");

/** Commande invitée : le back recalcule prix et total depuis la base. */
export async function placeOrder(_prev: OrderState, form: FormData): Promise<OrderState> {
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  let raw: unknown;
  try {
    raw = JSON.parse(parsed.data.cart);
  } catch {
    return { error: "Panier invalide." };
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
        items: lines.data.map((l) => ({ articleId: l.id, quantite: l.qty })),
      },
    });
    code = res.data.trackingCode;
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    throw e;
  }
  redirect(`/suivi/${code}?merci=1`);
}
