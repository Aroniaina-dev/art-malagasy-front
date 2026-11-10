import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getPosts, safe } from "@/lib/catalog";
import { href } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/posts";
import { isOptimizable } from "@/lib/products";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.blog.meta, description: d.blog.intro };
}

async function PostList() {
  const { lang, d } = await getI18n();
  const posts = await safe(getPosts());
  if (!posts) return <p className="no-result">{d.blog.unavailable}</p>;
  if (!posts.length) return <p className="no-result">{d.blog.empty}</p>;
  return (
    <div className="posts">
      {posts.map((p) => (
        <Link className="post-card" href={href(lang, `/blog/${p.slug}`)} key={p.id}>
          <div className="post-image">
            <Image src={p.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" unoptimized={!isOptimizable(p.image)} />
          </div>
          <div className="post-info">
            <small>{formatDate(p.date, lang)} · {p.readTime}</small>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
            <span className="text-link">{d.blog.read}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function BlogPage() {
  const { d } = await getI18n();
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">{d.blog.eyebrow}</div>
        <h1>{d.blog.title}</h1>
        <p>{d.blog.intro}</p>
      </section>
      <section className="section">
        <Suspense fallback={<p className="no-result">{d.common.loading}</p>}>
          <PostList />
        </Suspense>
      </section>
    </>
  );
}
