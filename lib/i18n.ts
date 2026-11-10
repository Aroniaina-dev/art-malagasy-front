import { lang as rootLang } from "next/root-params";
import { notFound } from "next/navigation";
import { dictionaries, isLang, type Dict, type Lang } from "./dictionaries";

/** Langue de la route courante (segment racine /[lang]). Composants serveur uniquement. */
export async function getLang(): Promise<Lang> {
  const l = await rootLang();
  if (!l || !isLang(l)) notFound();
  return l;
}

export async function getI18n(): Promise<{ lang: Lang; d: Dict }> {
  const lang = await getLang();
  return { lang, d: dictionaries[lang] };
}
