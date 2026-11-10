import type { Metadata } from "next";
import CartView from "@/app/components/CartView";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.cart.metaTitle };
}

export default async function CartPage() {
  const { d } = await getI18n();
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">{d.cart.eyebrow}</div>
        <h1>{d.cart.title}</h1>
      </section>
      <section className="section">
        <CartView />
      </section>
    </>
  );
}
