"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import { requireAdmin } from "@/lib/session";
import type { FormState } from "./contact";

/** Chaque action revérifie la session ; le back revérifie aussi le rôle (JWT admin). */
const adminToken = async () => (await requireAdmin()).token;

const msg = (e: unknown) => (e instanceof ApiError ? e.message : "Une erreur est survenue.");

/** Action de liste (bouton) : en cas d'erreur, retour à la page avec un message. */
async function run(back: string, fn: () => Promise<unknown>): Promise<never> {
  try {
    await fn();
  } catch (e) {
    redirect(`${back}?erreur=${encodeURIComponent(msg(e))}`);
  }
  redirect(back);
}

const files = (form: FormData, field: string) =>
  form.getAll(field).filter((f): f is File => f instanceof File && f.size > 0);

const imageUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https:\/\//.test(v), "L'URL de l'image doit commencer par https://");

/* ------------------------------ Produits ------------------------------ */

const productSchema = z.object({
  titre: z.string().trim().min(2, "Titre requis").max(150),
  description: z.string().trim().min(3, "Description requise").max(2000),
  prix: z.coerce.number({ error: "Prix invalide" }).int("Prix invalide").min(1, "Prix invalide"),
  nbrStock: z.coerce.number({ error: "Stock invalide" }).int("Stock invalide").min(0, "Stock invalide"),
  idTypeProduit: z.string().min(1, "Type de produit requis"),
  idTaille: z.string().min(1, "Taille requise"),
  idTypeCouleur: z.string().min(1, "Type de couleur requis"),
  couleur: z.string().trim().max(200).optional(),
  photoUrl: imageUrl.optional(),
});

export async function saveProduct(_prev: FormState, form: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const parsed = productSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { photoUrl, couleur, ...d } = parsed.data;
  const couleurs = (couleur ?? "").split(",").map((c) => c.trim()).filter(Boolean);
  const uploads = files(form, "photos");
  const path = id ? `/produit/${id}?source=produit` : "/produit?source=produit";
  const method = id ? "PUT" : "POST";

  try {
    if (uploads.length) {
      // multipart : nécessite l'upload côté back (middleware multer sur /produit)
      const body = new FormData();
      for (const [k, v] of Object.entries(d)) body.append(k, String(v));
      couleurs.forEach((c) => body.append("couleur", c));
      uploads.forEach((f) => body.append("photos", f));
      await api(path, { method, token: session.token, form: body });
    } else {
      await api(path, {
        method,
        token: session.token,
        json: { ...d, couleur: couleurs, ...(photoUrl ? { photos: [photoUrl] } : {}) },
      });
    }
  } catch (e) {
    return { error: msg(e) };
  }
  redirect("/admin/produits");
}

export async function setProductArchive(form: FormData) {
  const token = await adminToken();
  const archive = form.get("archive") === "1" ? 1 : 2;
  await run("/admin/produits", () => api(`/produit/${form.get("id")}`, { method: "PUT", token, json: { archive } }));
}

export async function deleteProduct(form: FormData) {
  const token = await adminToken();
  await run("/admin/produits", () => api(`/produit/${form.get("id")}`, { method: "DELETE", token }));
}

/* ---------------- Référentiels : types de produit, tailles, types de couleur ---------------- */

const refKind = z.enum(["typeproduit", "taille", "typecouleur"]);
const REFS = "/admin/referentiels";

export async function createRef(form: FormData) {
  const token = await adminToken();
  const kind = refKind.parse(form.get("kind"));
  const nom = String(form.get("nom") ?? "").trim();
  if (!nom) redirect(`${REFS}?erreur=Nom%20requis`);
  await run(REFS, () => api(`/${kind}`, { method: "POST", token, json: { nom } }));
}

export async function renameRef(form: FormData) {
  const token = await adminToken();
  const kind = refKind.parse(form.get("kind"));
  const nom = String(form.get("nom") ?? "").trim();
  if (!nom) redirect(`${REFS}?erreur=Nom%20requis`);
  await run(REFS, () => api(`/${kind}/${form.get("id")}`, { method: "PATCH", token, json: { nom } }));
}

export async function deleteRef(form: FormData) {
  const token = await adminToken();
  const kind = refKind.parse(form.get("kind"));
  await run(REFS, () => api(`/${kind}/${form.get("id")}`, { method: "DELETE", token }));
}

/* ------------------------------ Commandes ----------------------------- */

export async function advanceOrder(form: FormData) {
  const token = await adminToken();
  const status = z.enum(["envoi", "payment"]).safeParse(form.get("status"));
  if (!status.success) redirect("/admin/commandes?erreur=Étape%20invalide");
  const note = String(form.get("note") ?? "").trim();
  await run("/admin/commandes", () =>
    api(`/commandes/${form.get("id")}/status`, { method: "PATCH", token, json: { status: status.data, note: note || undefined } }),
  );
}

export async function confirmPayment(form: FormData) {
  const token = await adminToken();
  const note = String(form.get("note") ?? "").trim();
  await run("/admin/commandes", () =>
    api(`/commandes/${form.get("id")}/payment`, { method: "PATCH", token, json: { note: note || undefined } }),
  );
}

/* -------------------------------- Blog -------------------------------- */

const postSchema = z.object({
  titre: z.string().trim().min(3, "Titre requis").max(200),
  slug: z.string().trim().max(200).optional(),
  resume: z.string().trim().min(10, "Résumé trop court").max(400),
  contenu: z.string().trim().min(20, "Contenu trop court"),
  tempsLecture: z.string().trim().min(1).max(20),
  image: imageUrl.optional(),
});

export async function savePost(_prev: FormState, form: FormData): Promise<FormState> {
  const token = await adminToken();
  const id = String(form.get("id") ?? "");
  const parsed = postSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const uploads = files(form, "photos");
  if (!id && uploads.length === 0 && !d.image) return { error: "Ajoutez une image (fichier ou URL)." };

  const body = new FormData();
  for (const [k, v] of Object.entries(d)) if (v !== undefined && v !== "" && !(k === "image" && uploads.length)) body.append(k, String(v));
  body.append("publie", form.get("publie") === "on" ? "true" : "false");
  if (uploads[0]) body.append("photos", uploads[0]);

  try {
    await api(id ? `/blog/${id}?source=blog` : "/blog?source=blog", { method: id ? "PUT" : "POST", token, form: body });
  } catch (e) {
    return { error: msg(e) };
  }
  redirect("/admin/blog");
}

export async function deletePost(form: FormData) {
  const token = await adminToken();
  await run("/admin/blog", () => api(`/blog/${form.get("id")}`, { method: "DELETE", token }));
}

/* ------------------------------- Messages ----------------------------- */

export async function setMessageRead(form: FormData) {
  const token = await adminToken();
  await run("/admin/messages", () =>
    api(`/messages/${form.get("id")}/read`, { method: "PATCH", token, json: { lu: form.get("lu") === "true" } }),
  );
}

export async function deleteMessage(form: FormData) {
  const token = await adminToken();
  await run("/admin/messages", () => api(`/messages/${form.get("id")}`, { method: "DELETE", token }));
}
