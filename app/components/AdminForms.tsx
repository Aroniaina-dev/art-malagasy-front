"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Category } from "@/lib/products";
import { savePost, saveProduct } from "../actions/admin";
import type { FormState } from "../actions/contact";

export type ProductValues = {
  id: string;
  titre: string;
  description: string;
  prix: number | null;
  nbrStock: number;
  idCategorie: string;
  ville: string;
  couleur: string;
};

export function ProductForm({ product, categories }: { product?: ProductValues; categories: Category[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, {});
  return (
    <form className="contact-form admin-form" action={action}>
      {product && <input type="hidden" name="id" value={product.id} />}
      <label>Titre<input name="titre" defaultValue={product?.titre} required /></label>
      <label>Description<textarea name="description" rows={4} defaultValue={product?.description} required /></label>
      <label>Catégorie
        <select name="idCategorie" defaultValue={product?.idCategorie ?? categories[0]?.id} required>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </label>
      <div className="form-row">
        <label>Prix (Ar)<input name="prix" type="number" min={1} defaultValue={product?.prix ?? ""} required /></label>
        <label>Stock<input name="nbrStock" type="number" min={0} defaultValue={product?.nbrStock ?? 1} required /></label>
      </div>
      <div className="form-row">
        <label>Ville<input name="ville" defaultValue={product?.ville ?? "Antananarivo"} required /></label>
        <label>Couleur (facultatif)<input name="couleur" defaultValue={product?.couleur} /></label>
      </div>
      <label>Photos {product ? "(en choisir remplace les actuelles)" : ""}
        <input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple />
      </label>
      {!product && <label>… ou URL d&apos;une image<input name="photoUrl" placeholder="https://…" /></label>}
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
