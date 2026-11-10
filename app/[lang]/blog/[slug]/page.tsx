import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPost, safe } from "@/lib/catalog";
import { href } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";
import { formatDate, toParagraphs } from "@/lib/posts";
import { isOptimizable } from "@/lib/products";

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { lang, d } = await getI18n();
  const post = await safe(getPost(slug));
  if (!post) notFound();

  return (
    <article className="section article">
      <Link className="text-link" href={href(lang, "/blog")}>{d.blog.back}</Link>
      <h1 className="article-title">{post.title}</h1>
      <small className="article-meta">{formatDate(post.date, lang)} · {post.readTime} {d.blog.readTime}</small>
      <div className="article-image">
        <Image src={post.image} alt="" fill priority sizes="(max-width: 900px) 100vw, 860px" unoptimized={!isOptimizable(post.image)} />
      </div>
      {toParagraphs(post.body ?? "").map((para, i) => <p key={i}>{para}</p>)}
    </article>
  );
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="section no-result">…</p>}>
      <PostContent params={params} />
    </Suspense>
  );
}
