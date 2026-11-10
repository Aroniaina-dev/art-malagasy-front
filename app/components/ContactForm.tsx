"use client";

import { useActionState } from "react";
import { sendContact, type FormState } from "../actions/contact";
import { useI18n } from "./I18nProvider";

export default function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendContact, {});
  const { d, lang } = useI18n();
  const c = d.contact;

  if (state.ok) {
    return (
      <div className="form-done" role="status">
        <h3>{c.doneTitle}</h3>
        <p>{c.doneText}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" action={action}>
      <input type="hidden" name="lang" value={lang} />
      <label>{c.name}<input name="name" required autoComplete="name" /></label>
      <label>{c.email}<input name="email" type="email" required autoComplete="email" /></label>
      <label>{c.subject}
        <select name="subject" defaultValue="commande">
          {(Object.keys(c.subjects) as (keyof typeof c.subjects)[]).map((k) => <option key={k} value={k}>{c.subjects[k]}</option>)}
        </select>
      </label>
      <label>{c.message}<textarea name="message" rows={6} required /></label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn" type="submit" disabled={pending}>{pending ? c.sending : c.send}</button>
    </form>
  );
}
