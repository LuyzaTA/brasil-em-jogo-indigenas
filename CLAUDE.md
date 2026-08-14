# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository location

The git repository root is nested two levels below the folder you may open first:

```
brasil-em-jogo-indigenas/            <- outer folder, NOT a git repo
  brasil-em-jogo-indigenas/
    brasil-em-jogo-indigenas/        <- git root; package.json lives here
    brasil-em-jogo-indigenas_backup_20260305_190537/   <- untracked stale copy, do not edit
```

Always `cd` to the git root before running npm or git. The `_backup_` sibling is an
untracked snapshot; edits there have no effect on the app.

## Commands

```bash
npm install
npm run dev      # dev server on :3000
npm run build
npm run start
npm run lint
```

There is **no test framework configured** — no test runner, no test files, no test script.
Do not claim tests pass; verify changes by running the dev server and exercising the page.

Data import scripts (read `.env.local` themselves via a hand-rolled parser, so no dotenv needed):

```bash
node scripts/import_funai.mjs        # FUNAI GeoServer WFS -> territories + peoples
node scripts/import_ibge_dados.mjs   # IBGE Census 2022 -> indicators + indicator_values
ts-node scripts/import_data.ts --file=data/territories.json --table=territories
```

## Environment

`.env.local` at the git root, both vars client-exposed:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

Next.js 14 App Router + Tailwind, with **all data in Supabase Postgres, fetched from the
browser with the anon key**. There is no API layer, no server-side data access, no ORM —
components call `supabase.from(...)` directly. Schema is in `db/schema.sql`; seeds in
`db/seed_data.sql` and `db/seed_historia.sql`.

**Supabase may be null.** `src/lib/supabaseClient.ts` exports `null` when env vars are
missing, so every consumer must null-check. Two client-creation patterns coexist: that
shared singleton (used by `MapComponent`, detail pages) and inline `createClient()` calls
(in `src/app/page.tsx` and `src/app/historia/page.tsx`). Prefer the singleton for new code.

**Bilingual PT/EN without Next.js i18n routing.** Language is runtime state, not a route:
`LanguageContext` holds `'pt' | 'en'` and persists to `localStorage`; UI strings live in
`src/lib/i18n.ts` as `t[lang].<section>`; DB rows carry `_pt`/`_en` column pairs. The
convention everywhere is `lang === 'en' ? row.name_en : row.name_pt`, with PT as fallback
when the EN value is empty.

**The `/pt/*` and `/en/*` detail routes are dead code.** `next.config.js` redirects
`/pt/:path*` and `/en/:path*` to `/:path*`, but no unprefixed `territorio`/`territory`/
`povo`/`people` routes exist — so `/pt/territorio/ti-yanomami` 307s to
`/territorio/ti-yanomami` and 404s. All four page files under `src/app/pt/` and
`src/app/en/` are therefore unreachable. Removing the redirects or adding unprefixed
routes would revive them; until then, don't rely on those pages or assume edits there are
visible.

**Map layer model** (`src/components/MapComponent.tsx`): MapLibre GL, dynamically imported
with `ssr: false`. Two GeoJSON sources (`territories`, `peoples`) are loaded once, and the
four UI modes toggle **layer visibility** rather than reloading data — `territories-fill`
(Territórios), `territories-choropleth` (Dados), `territories-status` (História, colored by
a `match` on the `status` property), `peoples-point` (Aldeias). The choropleth color is
computed in JS and pushed via `setFeatureState`, not a data-driven paint expression, so it
survives only as long as the feature state does. Territories with fewer than 6 coordinates
in the first ring are filtered out as degenerate.

The territory-layer id list is duplicated in `MapComponent.tsx` and `Sidebar.tsx` (the
latter uses it to decide whether a clicked feature is a territory or a village). Adding a
territory layer means updating both.

**Styling.** Design tokens, geometric background patterns, and component classes live in
`src/app/globals.css` (the file `layout.tsx` imports). Note `src/globals.css` is a stale
orphan that nothing imports — edit the one under `app/`. In practice most components
hardcode brand hex values inline (`#1a3a2a` deep green, `#c9a94a` gold, `#2d6a4f` mid
green) rather than using the CSS variables or the `primary`/`secondary` Tailwind theme
colors, which are barely referenced.

**Favicon** is `src/app/icon.svg`, auto-detected by the App Router — Next injects the
`<link rel="icon">` itself, so `layout.tsx` needs no icon metadata.

**Audio**: `AudioContext` creates a looping background track and attempts autoplay on the
first click/keydown (browsers block it before user interaction). The mp3 filename contains
spaces and must stay URL-encoded in the `new Audio(...)` path.

## Content rules

These are project constraints from README.md, not general advice:

- Only official Brazilian government sources (IBGE, FUNAI, Iphan, government portals).
  Blogs, wikis, and unverified data are not acceptable.
- Always cite source and year/version alongside displayed data, with a link.
- When official data is missing, display "Dados oficiais indisponíveis" rather than
  guessing or filling in.
- Respectful language, no stereotypes.

Seeded DB text may contain `【...】` citation artifacts; a `clean()` helper strips them and
is currently duplicated in `src/app/page.tsx` and `src/app/historia/page.tsx`.

## Conventions

Commit messages follow a `type: lowercase summary` form (`feat:`, `fix:`, `remove:`).
History goes directly to `main`; there is no PR workflow in this repo.
