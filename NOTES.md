# Assumptions & Reproduction Notes

## Source document

The authoritative source is **`reference/HPB_YourCareerSystem_v4.html`** —
identified as the latest `HPB_YourCareerSystem_v*.html` in
`…/UNBUNDLE CQ/OUTPUTS/HPB/06_Sustain_Through_Systems/`. It is copied into the
repo so validation is self-contained and reproducible.

`scripts/parse-source.mjs` extracts the `TOOLS`, `SECTIONS`, `SITUATIONS` and
`SYNONYMS` literals directly from that file and evaluates them; the
content-validation test suite diffs the app's typed data against them on every
run.

## Assumptions made

1. **Slugs are new metadata, not content.** Situation `id`/`slug` are derived
   deterministically from the situation text (`slugify()`), e.g.
   `"I have a 1:1 coming up"` → `i-have-a-1-1-coming-up`. Tool `slug`s are
   hand-authored, URL-safe aliases (e.g. `bluf`,
   `owner-mindset-6-dimension-self-diagnostic`). Tool `id`s are the original
   `TOOLS` object keys, unchanged.
2. **Chip labels vs section titles.** The source filter chips read
   *All / Mindset / People / Priorities / Visibility / Goals*; the full section
   titles (*"Mindset & Perspective"* …) come from `SECTIONS`. Both are preserved —
   `shortLabel` for chips, `title` for headers.
3. **Section 2's colour is `#FFE599`** — identical to the yellow highlight
   colour. This is from the source and kept as-is; the two uses don't visually
   collide in practice.
4. **Search behaviour is ported verbatim**, including quirks: `raise` expands to
   `comp` (a substring of *compatibility*, *competency*, *compounding*,
   *company*), and single-word queries only match via step 1 (full-phrase /
   direct-synonym substring). Multi-word queries require every token to match.
   The haystack for a situation is its text plus each linked tool's name,
   description, `m<module>`, `module <module>` and page — exactly as the source
   built it.
5. **Highlighting is reimplemented safely.** The source injects an HTML string
   via `innerHTML`; here the text is split into plain string/match segments and
   rendered by React (`<mark class="hl">`). Same visible result, no raw HTML.
6. **`<mark>` instead of `<span>`** for highlights — more semantic; the `.hl`
   class styling is identical.
7. **Result-count sentence** matches the source's `render()` logic, including
   *"45 situations across 5 sections."* as the initial/empty state and
   *"No matches for "q"."* when a query yields nothing.
8. **URL state.** Home and Tools mirror the query and filter into the URL
   (`?q=…&section=…`, `?q=…&module=…`) with `replace` history so search is
   shareable and back-button-friendly without polluting history.
9. **Icons are placeholders** generated from a simple navy + yellow "system
   bars" mark (`scripts/generate-icons.ps1`, GDI+). No proprietary HPB artwork
   was available; replace `public/pwa-*.png` with brand assets when available.
10. **Font.** *Century Gothic* is proprietary and not web-delivered. The stack
    keeps it first, then geometric-ish fallbacks
    (`Futura, Trebuchet MS, Segoe UI, system-ui, sans-serif`). Visual character
    is close but not identical on machines without Century Gothic — matching the
    source, which had the same limitation.
11. **Copyright / footer text** ("Insights Associates Pte Ltd | Copyright 2026 |
    HPB Module 6 reference") carried over verbatim.
12. **Node toolchain.** Node.js was not initially present on the authoring
    machine; Node 22.23.2 LTS was installed to
    `%LOCALAPPDATA%\Programs\node-v22.23.2-win-x64` (portable zip, on the user
    PATH). `npm install`, `npm run validate`, `npm run test` (145 passing),
    `npm run build` and a `vite preview` smoke test (`/`, deep link
    `/tools/bluf`, `/sw.js`, `/manifest.webmanifest` all 200) were then all run
    successfully.

## Verification performed

- `npm run validate` — all content invariants pass against the source HTML.
- `npm run test` — 145 tests pass (content-validation, search, filtering,
  relationships, routing, pwa).
- `tsc` (app + node projects) — clean.
- `npm run build` — succeeds; PWA precache = 24 entries / ~243 KiB; JS bundle
  211 KB (69 KB gzip).
- `vite preview` smoke test — `/`, `/tools/bluf` (SPA fallback), `/sw.js`,
  `/manifest.webmanifest` all return 200.

## From the original HTML: reproduced

- All 5 sections (titles, colours, descriptions) — verbatim
- All 45 situations (text, section, tool links, order) — verbatim
- All 22 tools (names, 3-sentence descriptions, module, page) — verbatim
- The complete synonym dictionary (85 keys) — verbatim
- The search algorithm (tokenise → synonym-expand → phrase match → multi-word
  AND) — behaviour-for-behaviour
- Search highlighting in HPB yellow
- Section filter chips with colour dots
- "No matches." empty state and reset affordance
- Initial state showing all 45 situations with the dynamic count
- Visual identity: navy headings, light cards, coloured left borders, quote
  glyph on situations, yellow CTA text on navy, rounded corners, generous
  whitespace
- The `▸` tool-name marker and dashed separators between multiple tools on a card

## From the original HTML: could NOT be reproduced (and why)

- **Actual HPB module content.** The source contains only *references*
  ("Open in HPB Module 1 · p3"), never the module material itself. Per the
  brief, no module content was invented. The reference is shown as text; the
  `ToolReference` type has optional `url` / `internalRoute` seams for adding real
  destinations later (see README §13).
- **The exact "Open in HPB Module N · p{page} →" button as a working link.**
  It rendered with `cursor: default` in the source (non-interactive). Here the
  reference badge is non-interactive text until a `url`/`internalRoute` is
  supplied; a separate **Open tool** link goes to the in-app tool detail page.
- **Century Gothic rendering** on devices without the font (see assumption 10).
- **Nothing else was omitted.** No situation, tool, synonym, description, or
  relationship from the source is missing.

## Not implemented (explicitly out of scope per the brief)

V2 personalization (favourites, recents, notes), V3 interactive tools, V4
personal career system, V5 AI coach. The architecture leaves room for all of
them: content is data-driven, the search engine is isolated and swappable, tool
references carry a link seam, and `usePWAInstall` / `registerSW` keep
platform concerns at the edges.
