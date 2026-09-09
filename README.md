# Your Career System — HPB Reference (PWA)

A polished, installable Progressive Web App companion to the **High Performer
Blueprint (HPB)**.

> **What's happening?** → search / browse the situation
> **What should I use?** → see the recommended HPB tool
> **Where do I find it?** → see the module & page reference

Look up your career situation, find the right framework, go to the page. Works
offline after the first visit and installs to a phone home screen like a native
app.

---

## 1. Project overview

The app turns the single-file reference document
`reference/HPB_YourCareerSystem_v4.html` into a real web application:

- **5 sections**, **45 career situations**, **22 reference tools**
- Synonym-aware instant search (a faithful port of the original engine — not a
  substring match)
- Safe search-term highlighting (HPB yellow `#FFE599`)
- Deep-linkable tool and situation pages (`/tools/bluf`,
  `/situations/i-have-a-1-1-coming-up`)
- Two-way Situation ⇄ Tool relationships
- Offline-first service worker + web app manifest
- Mobile-first responsive design with deliberate mobile / tablet / desktop
  layouts

The content is **never** rewritten, paraphrased, or invented. `npm run validate`
and the content-validation test suite check it against the source document
character-for-character.

## 2. Technology stack

| Concern        | Choice                                        |
| -------------- | --------------------------------------------- |
| UI             | React 18 + TypeScript                         |
| Build          | Vite 5                                        |
| Routing        | React Router 6 (`BrowserRouter`)              |
| PWA            | `vite-plugin-pwa` (Workbox `generateSW`)      |
| Styling        | Hand-written CSS with custom properties       |
| Tests          | Vitest + Testing Library + jsdom              |
| Icons          | Generated via `scripts/generate-icons.ps1` (GDI+) |

No backend. No login. No analytics. No runtime dependencies beyond React and the
router.

## 3. Project structure

```
reference/
  HPB_YourCareerSystem_v4.html   # SOURCE OF TRUTH (kept in-repo for validation)
scripts/
  parse-source.mjs               # extracts data literals from the source HTML
  validate-content.mjs           # `npm run validate` — content invariants
  generate-icons.ps1             # regenerates public/*.png icons
public/
  favicon.svg, pwa-*.png, maskable-icon-512x512.png, apple-touch-icon.png
  _redirects                     # SPA fallback for Netlify / Cloudflare Pages
src/
  components/    SearchBar, FilterChips, SituationCard, ToolCard,
                 SectionHeader, EmptyState, Highlight, ToolReference,
                 Layout, InstallPrompt, UpdateToast
  pages/         Home, Tools, ToolDetail, SituationDetail, About, NotFound
  data/          sections.ts, tools.ts, situations.ts, synonyms.ts, index.ts
  utils/         search.ts, highlight.ts, slugify.ts
  hooks/         useMediaQuery, usePWAInstall, useDocumentTitle
  config/        manifest.ts (shared with vite.config.ts), version.ts
  pwa/           registerSW.ts
  types/         career.ts
  styles/        global.css
  App.tsx, main.tsx
tests/           content-validation, search, filtering, relationships,
                 routing, pwa
```

**Principle: content is independent from UI.** Components never hard-code a
situation, tool, count, or synonym — everything comes from `src/data/`.

## 4. Local development

```bash
npm install
npm run dev            # opens http://localhost:5173
```

Node **18.17+** is required (see `engines` in `package.json`).

> ⚠️ **Do not open `index.html` (or `dist/index.html`) directly from disk.**
> Like every Vite/React app it must be *served over http* — opening the file via
> `file://` shows a blank page (ES module scripts and absolute asset paths are
> blocked on `file://`). Use `npm run dev`, or `npm run serve` (build + preview),
> or deploy it. The page will show a short instruction if it detects this.

The service worker is disabled in `vite dev` by default. To debug it locally set
`devOptions.enabled = true` in `vite.config.ts`, or use the production preview
(below).

## 5. Production build

```bash
npm run build          # tsc project build + vite build  ->  dist/
npm run preview         # serve dist/ at http://localhost:4173 (SW active)
```

`dist/` is a fully static bundle. Open the preview, then in DevTools →
Application check: Manifest is valid, Service Worker is activated, and toggling
**Offline** still lets you search and open every page.

## 6. PWA installation

- **Desktop Chrome / Edge:** install icon in the address bar, or menu →
  *Install Your Career System*.
- **Android Chrome:** menu → *Add to Home screen* / *Install app*. An in-app
  "Install app" banner also appears once (dismissible, never repeated).
- **iOS/iPadOS Safari:** Share → *Add to Home Screen*. iOS ignores
  `beforeinstallprompt`, so there is no in-app button there by design.

After install the app launches standalone (no browser chrome), uses the navy
theme colour for the status bar, and respects device safe areas
(`viewport-fit=cover`).

## 7. Deployment

The build is host-agnostic static output. It only needs **HTTPS** (required for
service workers everywhere except `localhost`) and an **SPA fallback** so deep
links like `/tools/bluf` resolve to `index.html`.

| Host                  | What to do                                                        |
| --------------------- | ---------------------------------------------------------------- |
| **Vercel**            | Import repo. `vercel.json` already sets the rewrite + SW headers. |
| **Netlify**           | Import repo. `netlify.toml` sets build, publish dir, redirect.    |
| **Cloudflare Pages**  | Build command `npm run build`, output `dist`. `public/_redirects` is copied in. |
| **GitHub Pages**      | Set `VITE_BASE=/<repo-name>/ npm run build`, publish `dist/`. Copy `dist/index.html` to `dist/404.html` for deep-link fallback. |

Sub-path hosting: build with `VITE_BASE="/career-system/"` — the router
`basename` and all asset URLs pick it up automatically.

## 8. Testing

```bash
npm run test          # vitest run — all suites
npm run test:watch
npm run validate      # standalone content validation against the source HTML
npm run typecheck
npm run lint
```

Suites:

- **content-validation** — 5 sections / 45 situations / 22 tools, every field
  matches the source, synonym dictionary migrated verbatim, slugs unique.
- **search** — `boss, manager, promotion, raise, feedback, stuck, overwhelmed,
  email, 1:1, visibility, goal, project, conflict, new`, synonym expansion,
  multi-word AND, "new boss" → *A new manager is starting*, no-results.
- **filtering** — All + each of the five sections.
- **relationships** — situation→tool and tool→situation symmetry, no orphans.
- **routing** — Home, Tools, tool detail, situation detail, `/situations`
  redirect, invalid routes.
- **pwa** — manifest identity + icons exist, `index.html` wiring, Workbox
  precache globs include JSON data + `navigateFallback`.

## 9. Content / data architecture

All content lives in typed modules under `src/data/`:

- `sections.ts` — `Section[]` (id, title, `shortLabel`, hex `color`, description)
- `tools.ts` — `Tool[]` (`id` = original source key, `slug`, `name`,
  `reference: { module, page, url?, internalRoute? }`, `description`)
- `situations.ts` — `Situation[]` built from a raw list; `id`/`slug` are derived
  from the text via `slugify()` so deep links are stable
- `synonyms.ts` — `Record<string, string[]>`, migrated verbatim
- `index.ts` — relationship helpers (`toolsForSituation`, `situationsForTool`,
  `sectionForSituation`, `referenceLabel`) and computed `stats`

The search engine (`src/utils/search.ts`) is pure and framework-free:
`tokenizeQuery`, `expandToken` / `expandSynonyms`, `getHighlightTerms`,
`matchesSituation`, `matchesTool`, `searchSituations`, `searchTools`.

## 10. How to add a new situation

Edit `src/data/situations.ts`, add an entry to the `raw` array in the right
section block:

```ts
{ section: 3, text: 'I need to renegotiate a deadline', tools: ['bluf', 'four_bullet'] },
```

- `section` — 1–5
- `tools` — array of existing tool `id`s (the keys in `tools.ts`)
- `id` / `slug` are generated automatically

Run `npm run test` — the relationship + validation suites will fail if a tool id
is wrong or a slug collides. (Note: the content-validation suite compares against
the source HTML, so genuinely new content beyond the source will need its
expectations updated too.)

## 11. How to add a new tool

Edit `src/data/tools.ts`:

```ts
{
  id: 'deadline_renegotiation',            // stable key, snake_case
  slug: 'deadline-renegotiation',          // URL-safe, unique
  name: 'Deadline Renegotiation Script',
  reference: { module: 5, page: 'p10' },
  description: 'Exact description text …',
}
```

Then link at least one situation to it (tools with no situations fail the
"no orphans" test). `toolModules` and the Tools page module filter update
automatically.

## 12. How to modify synonyms

Edit `src/data/synonyms.ts`. Keys and values are lowercase. Pairs are explicit
and bidirectional by convention — if you add `"deadline": ["due date"]`, also add
`"due date": ["deadline"]` if you want it to work both ways. The search engine
expands every query token through this map; no other change is needed.

## 13. How to add future HPB module links

Today every tool's `reference` is `{ module, page }` only — the source document
contains no HPB module content, so the app shows the reference as text.

To make "Open in HPB Module N" a real link later, add one of:

```ts
reference: { module: 1, page: 'p3', url: 'https://lms.example.com/hpb/m1#p3' }
// or, for a future in-app interactive version of the tool:
reference: { module: 4, page: 'p5-6', internalRoute: '/tools/4-step-prioritization/run' }
```

`<ToolReference>` and the tool detail page automatically upgrade the badge to a
link (`url` → external `↗`, `internalRoute` → in-app `→`). No component changes
required. This is the seam for V3 interactive tools, LMS deep links, PDFs, etc.

## 14. Versioning

`src/config/version.ts` exports `APP_VERSION` (shown on the About page). Bump it
per release. The service worker uses `registerType: 'prompt'` — a new deploy
shows a non-intrusive "A new version is available — Refresh" toast rather than
reloading under the user.

## 15. Assumptions & limitations

See [`NOTES.md`](./NOTES.md) for the full list of assumptions made and anything
from the original HTML that could not be reproduced.

---

Insights Associates Pte Ltd · Copyright 2026 · HPB Module 6 reference
