import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { requireAdmin } from "@/lib/session";
import { PostForm } from "../../../components/AdminForms";

type Blog = { _id: string; titre: string; slug: string; resume: string; contenu: string; tempsLecture?: string; publie: boolean };

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { token } = await requireAdmin();
  let p: Blog;
  try {
    p = (await api<{ data: Blog }>(`/blog/${encodeURIComponent(id)}`, { token })).data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
  return (
    <>
      <h1 className="admin-title">Modifier « {p.titre} »</h1>
      <PostForm
        post={{ id: p._id, titre: p.titre, slug: p.slug, resume: p.resume, contenu: p.contenu, tempsLecture: p.tempsLecture ?? "3 min", publie: p.publie }}
      />
    </>
  );
}
