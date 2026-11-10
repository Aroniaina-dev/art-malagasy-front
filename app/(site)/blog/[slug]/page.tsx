import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isOptimizable } from "@/lib/products";
import { formatDate, toParagraphs } from "@/lib/posts";
import { getPost } from "@/lib/catalog";

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="section article">
      <Link className="text-link" href="/blog">← Retour au blog</Link>
      <h1 className="article-title">{post.title}</h1>
      <small className="article-meta">{formatDate(post.date)} · {post.readTime} de lecture</small>
      <div className="article-image">
        <Image src={post.image} alt="" fill priority sizes="(max-width: 900px) 100vw, 860px" unoptimized={!isOptimizable(post.image)} />
      </div>
      {toParagraphs(post.body ?? "").map((para, i) => <p key={i}>{para}</p>)}
    </article>
  );
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="section no-result">Chargement…</p>}>
      <PostContent params={params} />
    </Suspense>
  );
}
