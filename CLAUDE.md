# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout

`artMalagasy/` holds two separate git repos: `front/` (this Next.js 16 storefront, French-language, "ArtMadagascar" handicrafts) and `art-malagasy-back/` (Express + MongoDB REST API). Run front commands from `front/`. The front has **no database of its own**: everything goes through the back's API.

## Commands

```bash
npm run dev      # next dev (http://localhost:3000)
npm run build    # next build
npm run start    # next start (needs a prior build)
npm run lint     # eslint
npx tsc --noEmit # type check
```

No test runner. To run the full stack, start the back too (`npm run dev` in `art-malagasy-back/`, port 4000, needs its git-ignored `config.env`); `node scripts/seed.js` there (with `ADMIN_EMAIL` / `ADMIN_PASSWORD`) creates categories, sample products, blog posts and the admin account.

Env (`.env.local`, git-ignored): `API_URL` (default `http://localhost:4000/api/v1`), `FILES_URL` (origin serving the back's `/files` uploads), `JWT_SECRET` (must equal the back's; used only to verify token signatures).

## Next.js version caveat

[AGENTS.md](AGENTS.md) (auto-written by `next dev`) warns that this is Next 16 / React 19 with breaking changes. Read `node_modules/next/dist/docs/01-app/` before writing Next-specific code. Notably: `middleware` is now [proxy.ts](proxy.ts); `params` / `searchParams` are Promises.

## Architecture

- **Cache Components is on** ([next.config.ts](next.config.ts)). Anything reading request data (`cookies()`, `params`, `searchParams`, `usePathname`) or fetching from the API must sit under `<Suspense>`, otherwise `next build` fails. Pattern used everywhere: a sync page renders `<Suspense><AsyncInner /></Suspense>`. [Header.tsx](app/components/Header.tsx) isolates `usePathname` in its own Suspense for that reason; [app/admin/layout.tsx](app/admin/layout.tsx) wraps the whole admin tree in one.
- **API client**: [lib/api.ts](lib/api.ts) (`api()` throws `ApiError` with the back's message; `fileUrl()` maps stored photo paths to URLs, leading `/` = front `public/` asset). [lib/catalog.ts](lib/catalog.ts) maps API shapes (`Article` → `Product`, `Blog` → `Post`, `Categorie` → `Category`). The back's vocabulary is French (`titre`, `prix`, `nbrStock`, `archive` 1 = archived). A product (`/produit`) requires `idTypeProduit`, `idTaille`, `idTypeCouleur`; the shop's "categories" are the back's `typeproduit`. The back answers 200 + a welcome JSON on unknown routes: `api()` turns that into a 404 `ApiError`, and public pages wrap calls in `safe()` to show a fallback instead of crashing.
- **Auth**: the back issues a JWT (`POST /auth/login`, role `1` = admin, `2` = client). Server actions ([app/actions/auth.ts](app/actions/auth.ts)) store it in an httpOnly cookie `am_token`. [lib/session.ts](lib/session.ts) verifies it with `jose` (`requireUser` / `requireAdmin` — call in every admin page **and** action); [proxy.ts](proxy.ts) is only a first redirect filter. The back re-checks the role on every admin route.
- **Admin** (`/admin/*`): products (JSON, or multipart when photos are uploaded — needs the back's multer on `/produit`), reference tables (`/admin/referentiels`: product types, sizes, colour types), orders, blog, messages, users. All mutations are server actions in [app/actions/admin.ts](app/actions/admin.ts) that forward the admin token.
- **Orders are guest orders** (the back has no customer↔order link): the cart is in `localStorage` ([ShopProvider.tsx](app/components/ShopProvider.tsx), via `useSyncExternalStore`); checkout posts to the back, which recomputes prices from the DB and returns a `trackingCode`; customers follow orders at `/suivi/[code]`. Stock is not auto-decremented by the back.
- **Deploy**: Vercel is linked to the `vercel` remote (`Eddy007Saive/art-malagasy-front`); `aroniaina` is the shared repo. Push to both.
- **Categories** (= product types) are dynamic (from the API); only the seven known French labels map to illustrations in `public/categories/<slug>.png` (see `lib/products.ts`).
- **Styling**: hand-written CSS in [app/globals.css](app/globals.css) (storefront) and [app/shop.css](app/shop.css) (auth/cart/admin), with CSS variables (wine/cream/gold) and `next/font` (DM Sans, Playfair Display). Tailwind v4 is only imported, not used for classes. [template-artmadagascar.html](template-artmadagascar.html) is the original static mockup.
