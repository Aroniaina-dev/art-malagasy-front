"use client";

import { useActionState } from "react";
import { sendContact, type FormState } from "../actions/contact";

export default function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendContact, {});

  if (state.ok) {
    return (
      <div className="form-done" role="status">
        <h3>Merci pour votre message !</h3>
        <p>Notre équipe vous répondra dans les meilleurs délais.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" action={action}>
      <label>Nom<input name="name" required autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Sujet
        <select name="subject" defaultValue="commande">
          <option value="commande">Une commande</option>
          <option value="produit">Un produit</option>
          <option value="livraison">Livraison & retours</option>
          <option value="autre">Autre</option>
        </select>
      </label>
      <label>Message<textarea name="message" rows={6} required /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn" type="submit" disabled={pending}>{pending ? "Envoi…" : "Envoyer le message"}</button>
    </form>
  );
}
