"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register } from "../actions/auth";
import type { FormState } from "../actions/contact";
import { useI18n } from "./I18nProvider";

export default function AuthForm({ mode, callbackUrl }: { mode: "login" | "register"; callbackUrl: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "login" ? login : register, {});
  const { d, lang, to } = useI18n();
  const a = d.auth;
  const isLogin = mode === "login";
  const cb = `?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <form className="contact-form auth-form" action={action}>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {!isLogin && (
        <>
          <div className="form-row">
            <label>{a.lastName}<input name="nom" required autoComplete="family-name" /></label>
            <label>{a.firstName}<input name="prenom" required autoComplete="given-name" /></label>
          </div>
          <label>{a.phone}<input name="tel" type="tel" autoComplete="tel" /></label>
        </>
      )}
      <label>{a.email}<input name="email" type="email" required autoComplete="email" /></label>
      <label>{a.password}
        <input name="password" type="password" required minLength={isLogin ? undefined : 8} autoComplete={isLogin ? "current-password" : "new-password"} />
      </label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? a.wait : isLogin ? a.login : a.register}
      </button>
      <p className="auth-alt">
        {isLogin ? (
          <>{a.noAccount} <Link href={`${to("/inscription")}${cb}`}>{a.signUp}</Link></>
        ) : (
          <>{a.haveAccount} <Link href={`${to("/login")}${cb}`}>{a.signIn}</Link></>
        )}
      </p>
    </form>
  );
}
