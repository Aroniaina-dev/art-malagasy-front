import "server-only";

if (process.env.NODE_ENV === "production" && !process.env.API_URL) {
  console.error("[api] API_URL n'est pas défini : les appels vont vers localhost:4000. Définissez API_URL, FILES_URL et JWT_SECRET dans l'environnement de déploiement.");
}

const API_URL = (process.env.API_URL ?? "http://localhost:4000/api/v1").replace(/\/$/, "");
const FILES_URL = (process.env.FILES_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  json?: unknown;
  form?: FormData;
};

/** Appel de l'API art-malagasy-back. Lève ApiError avec le message renvoyé par le back. */
export async function api<T = unknown>(path: string, { method = "GET", token, json, form }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form) {
    body = form; // fetch ajoute lui-même le boundary multipart
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body, cache: "no-store" });
  } catch {
    throw new ApiError("Le serveur est momentanément indisponible. Réessayez dans un instant.", 503);
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const d = data as { message?: string; error?: string };
    throw new ApiError(d.message || d.error || `Erreur ${res.status}`, res.status);
  }
  return data as T;
}

/** Chemin stocké par le back (./files/article/x.jpg) ou URL absolue → URL affichable. */
export function fileUrl(p: string | undefined) {
  if (!p) return "/hero.png";
  if (/^https?:\/\//.test(p)) return p;
  if (p.startsWith("/")) return p; // ressource du front (public/) ; les fichiers du back commencent par "./files/"
  return `${FILES_URL}/${p.replace(/^\.?\//, "")}`;
}
