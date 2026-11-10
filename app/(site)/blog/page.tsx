import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { isOptimizable } from "@/lib/products";
import { formatDate } from "@/lib/posts";
import { getPosts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Blog — ArtMadagascar",
  description: "Histoires d'artisans, techniques et conseils autour de l'artisanat malgache.",
};

async function PostList() {
  const posts = await getPosts();
  if (!posts.length) return <p className="no-result">Aucun article pour le moment.</p>;
  return (
    <div className="posts">
      {posts.map((p) => (
        <Link className="post-card" href={`/blog/${p.slug}`} key={p.id}>
          <div className="post-image">
            <Image src={p.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" unoptimized={!isOptimizable(p.image)} />
          </div>
          <div className="post-info">
            <small>{formatDate(p.date)} · {p.readTime}</small>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
            <span className="text-link">Lire l&apos;article →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">Le blog</div>
        <h1>Histoires &amp; savoir-faire</h1>
        <p>Techniques, rencontres et conseils pour mieux connaître l&apos;artisanat malgache.</p>
      </section>
      <section className="section">
        <Suspense fallback={<p className="no-result">Chargement…</p>}>
          <PostList />
        </Suspense>
      </section>
    </>
  );
}
