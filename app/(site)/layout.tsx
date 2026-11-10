import type { ReactNode } from "react";
import SiteShell from "@/app/components/SiteShell";

/** Gabarit du site public (barre du haut, header, footer, panier). L'admin n'en fait pas partie. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
