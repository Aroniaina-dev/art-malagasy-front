"use client";

import Link from "next/link";
import { useActionState, type ChangeEvent } from "react";
import type { Ref } from "@/lib/products";
import { savePost, saveProduct } from "../actions/admin";
import type { FormState } from "../actions/contact";

export type ProductValues = {
  id: string;
  titre: string;
  description: string;
  prix: number | null;
  nbrStock: number;
  idTypeProduit: string;
  idTaille: string;
  idTypeCouleur: string;
  couleur: string;
};

/** Réduit une photo à 1600 px de côté au plus et la réencode en JPEG : un envoi doit rester sous 4 Mo au total. */
async function shrink(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 400_000) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // fond blanc pour les PNG transparents
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.85));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file; // format non décodable par le navigateur : on envoie l'original
  }
}

async function shrinkPhotos(e: ChangeEvent<HTMLInputElement>) {
  const input = e.currentTarget;
  if (!input.files?.length) return;
  const out = new DataTransfer();
  for (const f of Array.from(input.files).slice(0, 10)) out.items.add(await shrink(f));
  input.files = out.files;
}

type ProductFormProps = { product?: ProductValues; types: Ref[]; sizes: Ref[]; colorTypes: Ref[] };

function Select({ name, label, options, value }: { name: string; label: string; options: Ref[]; value?: string }) {
  return (
    <label>{label}
      <select name={name} defaultValue={value ?? options[0]?.id} required>
        {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function ProductForm({ product, types, sizes, colorTypes }: ProductFormProps) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, {});
  return (
    <form className="contact-form admin-form" action={action}>
      {product && <input type="hidden" name="id" value={product.id} />}
      <label>Titre<input name="titre" defaultValue={product?.titre} required /></label>
      <label>Description<textarea name="description" rows={4} defaultValue={product?.description} required /></label>
      <div className="form-row">
        <Select name="idTypeProduit" label="Type de produit" options={types} value={product?.idTypeProduit} />
        <Select name="idTaille" label="Taille" options={sizes} value={product?.idTaille} />
        <Select name="idTypeCouleur" label="Type de couleur" options={colorTypes} value={product?.idTypeCouleur} />
      </div>
      <div className="form-row">
        <label>Prix (€)<input name="prix" type="number" min={0.01} step={0.01} inputMode="decimal" defaultValue={product?.prix ?? ""} required /></label>
        <label>Stock<input name="nbrStock" type="number" min={0} defaultValue={product?.nbrStock ?? 1} required /></label>
      </div>
      <label>Couleurs (facultatif, séparées par des virgules)<input name="couleur" defaultValue={product?.couleur} placeholder="rouge, beige" /></label>
      <label>Photos {product ? "(en choisir remplace les actuelles)" : ""}
        <input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={shrinkPhotos} />
      </label>
      <p className="muted-small">La première photo est celle affichée dans la boutique. Les photos sont réduites automatiquement avant l&apos;envoi.</p>
      <label>… ou URL d&apos;une image {product ? "(remplace les photos actuelles)" : ""}<input name="photoUrl" placeholder="https://…" /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="form-actions">
        <button className="btn" type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</button>
        <Link className="text-link" href="/admin/produits">Annuler</Link>
      </div>
    </form>
  );
}

export type PostValues = {
  id: string;
  titre: string;
  slug: string;
  resume: string;
  contenu: string;
  tempsLecture: string;
  publie: boolean;
};

export function PostForm({ post }: { post?: PostValues }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, {});
  return (
    <form className="contact-form admin-form" action={action}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <label>Titre<input name="titre" defaultValue={post?.titre} required /></label>
      <label>Slug (laisser vide pour le générer)<input name="slug" defaultValue={post?.slug} /></label>
      <label>Résumé<textarea name="resume" rows={2} defaultValue={post?.resume} required /></label>
      <label>Contenu (séparez les paragraphes par une ligne vide)<textarea name="contenu" rows={12} defaultValue={post?.contenu} required /></label>
      <label>Image {post ? "(en choisir une remplace l'actuelle)" : ""}
        <input name="photos" type="file" accept="image/jpeg,image/png,image/webp" />
      </label>
      <label>… ou URL d&apos;image<input name="image" placeholder="https://…" /></label>
      <div className="form-row">
        <label>Temps de lecture<input name="tempsLecture" defaultValue={post?.tempsLecture ?? "3 min"} required /></label>
        <label className="check"><input type="checkbox" name="publie" defaultChecked={post?.publie ?? true} /> Publié</label>
      </div>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="form-actions">
        <button className="btn" type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</button>
        <Link className="text-link" href="/admin/blog">Annuler</Link>
      </div>
    </form>
  );
}
