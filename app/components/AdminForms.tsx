"use client";

import Link from "next/link";
import { useActionState, useRef, useState, type ChangeEvent } from "react";
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
  /** Photos actuelles, en URL affichables. */
  photos: string[];
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

type Preview = { name: string; url: string };

/** Colonne des photos : choix des fichiers, aperçu immédiat, retrait d'une photo avant l'envoi. */
function PhotoPanel({ current }: { current: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  // Remplace les fichiers du champ (le navigateur n'autorise pas à en retirer un seul autrement).
  const setFiles = (list: File[]) => {
    const dt = new DataTransfer();
    list.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
    setPreviews((old) => {
      old.forEach((p) => URL.revokeObjectURL(p.url));
      return list.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    });
  };

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.currentTarget.files ?? []).slice(0, 10);
    setBusy(true);
    const shrunk: File[] = [];
    for (const f of picked) shrunk.push(await shrink(f));
    setFiles(shrunk);
    setBusy(false);
  };

  const remove = (i: number) => setFiles(Array.from(inputRef.current?.files ?? []).filter((_, k) => k !== i));

  const validUrl = /^https:\/\/\S+$/.test(url.trim());
  // Ce qui sera enregistré : les nouveaux fichiers, sinon l'URL, sinon les photos actuelles.
  const shown: { key: string; src: string; removable?: number }[] = previews.length
    ? previews.map((p, i) => ({ key: p.url, src: p.url, removable: i }))
    : validUrl
      ? [{ key: url, src: url.trim() }]
      : current.map((src) => ({ key: src, src }));
  const isNew = previews.length > 0 || validUrl;

  return (
    <aside className="pf-photos">
      <h2 className="pf-h2">Photos</h2>
      {shown.length ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pf-main" src={shown[0].src} alt="Photo principale" />
          <p className="muted-small">
            {isNew ? "Aperçu des nouvelles photos" : "Photos actuelles"} · la première est celle affichée dans la boutique.
          </p>
          {shown.length > 1 || shown[0].removable !== undefined ? (
            <ul className="pf-thumbs">
              {shown.map((p, i) => (
                <li key={p.key}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={`Photo ${i + 1}`} />
                  {p.removable !== undefined && (
                    <button type="button" aria-label={`Retirer la photo ${i + 1}`} onClick={() => remove(p.removable!)}>×</button>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <div className="pf-empty">Aucune photo pour l&apos;instant</div>
      )}

      <label className="pf-pick">
        <span className="btn btn-light">{busy ? "Préparation…" : current.length || previews.length ? "Choisir d'autres photos" : "Choisir des photos"}</span>
        <input ref={inputRef} name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onPick} />
      </label>
      <p className="muted-small">JPG, PNG ou WebP, 10 au maximum. Elles sont réduites automatiquement avant l&apos;envoi.{current.length > 0 && " De nouvelles photos remplacent les actuelles."}</p>

      {/* un champ désactivé n'est pas envoyé : c'est voulu quand des fichiers sont choisis */}
      <label>… ou URL d&apos;une image
        <input name="photoUrl" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} disabled={previews.length > 0} />
      </label>
    </aside>
  );
}

export function ProductForm({ product, types, sizes, colorTypes }: ProductFormProps) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, {});
  return (
    <form className="contact-form admin-form pf" action={action}>
      {product && <input type="hidden" name="id" value={product.id} />}

      <PhotoPanel current={product?.photos ?? []} />

      <div className="pf-fields">
        <label>Titre<input name="titre" defaultValue={product?.titre} required /></label>
        <label>Description<textarea name="description" rows={5} defaultValue={product?.description} required /></label>
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
        {state.error && <p className="form-error" role="alert">{state.error}</p>}
        <div className="form-actions">
          <button className="btn" type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</button>
          <Link className="text-link" href="/admin/produits">Annuler</Link>
        </div>
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
