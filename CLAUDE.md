# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An installable PWA companion to the **High Performer Blueprint (HPB)** course: look up a
career situation → get the recommended HPB tool → see the module/page reference.
React 18 + TypeScript + Vite + `vite-plugin-pwa`. No backend, no router server, no auth.

## Environment / toolchain

- **Node is installed at a portable path**, not on the machine PATH for non-login shells.
  Prepend it in every PowerShell tool call:
  ```powershell
  $env:Path = "$env:LOCALAPPDATA\Programs\node-v22.23.2-win-x64;$env:Path"
  ```
  (New interactive terminals pick it up from the user PATH automatically.)
- `git` and `python` are **not** installed. This directory is **not a git repo**.
- A real browser is available for manual verification: Chrome at
  `C:\Program Files\Google\Chrome\Application\chrome.exe` (use `--headless=new --dump-dom`).
- PowerShell gotchas: `$home`/`$profile`/`$input` are read-only (don't use as var names);
  use `Invoke-WebRequest -UseBasicParsing` (non-interactive shell errors otherwise).

## Commands

```bash
npm run dev            # Vite dev server, opens http://localhost:5173
npm run serve          # build + preview (opens http://localhost:4173) — use this to exercise the SW/PWA
npm run build          # tsc (app + node projects) then vite build -> dist/
npm run preview         # serve an existing dist/ build
npm run test           # vitest run — all suites
npm run test:watch
npm run typecheck      # tsc on both tsconfig projects, no emit
npm run lint           # eslint (flat config)
npm run validate       # standalone content check against reference/HPB_YourCareerSystem_v4.html
npm run icons          # regenerate public/*.png icons via scripts/generate-icons.ps1 (PowerShell + GDI+)
```

Run one test file / one test:
```bash
npx vitest run tests/search.test.ts
npx vitest run -t "new boss"
```

The SW does not run under `npm run dev` (`devOptions.enabled: false` in `vite.config.ts`) —
use `npm run serve` to test install / offline behaviour.

## Content is frozen — `reference/HPB_YourCareerSystem_v4.html` is the source of truth

The 5 sections, 45 situations, 22 tools (names + descriptions), and 85 synonym keys were
transcribed **verbatim** from that file into `src/data/`. Do not rewrite, paraphrase,
simplify, reorder, or invent this content.

`scripts/parse-source.mjs` extracts the `TOOLS` / `SECTIONS` / `SITUATIONS` / `SYNONYMS`
literals straight out of the HTML. Two consumers diff against it:
- `npm run validate` (CLI, invariants + exit code)
- `tests/content-validation.test.ts` (83 assertions, character-for-character)

Because the test suite diffs `src/data/*` against the frozen HTML, **adding genuinely new
content beyond the source will fail those tests** until their expectations are updated too.
Editing wording in `src/data/` without a matching source change always fails.

## Architecture

**Data layer** (`src/data/`, `src/types/career.ts`)
- `sections.ts` / `tools.ts` / `situations.ts` / `synonyms.ts` are hand-written typed data.
- Situation `id` **and** `slug` are derived from the situation text via `slugify()`
  (`src/utils/slugify.ts`). Changing a situation's text changes its deep-link URL.
- Tool `id` = the original `TOOLS` object key (e.g. `bluf`, `owner_diag`); `slug` is a
  hand-authored URL alias in `tools.ts`.
- `data/index.ts` is the barrel: it derives the **two-way Situation⇄Tool relationship**
  once (`situationsForTool`, `toolsForSituation`), plus `referenceLabel()` and the computed
  `stats` object. Components read relationships from here, never re-walk the data.

**Search** (`src/utils/search.ts`) — a faithful port of the original vanilla-JS engine, not
a substring match. Do not "simplify" it. Behaviour:
1. `tokenizeQuery` → lowercase/trim/split.
2. `expandToken` adds a term's synonyms; the *haystack* for a situation is its text **plus
   every linked tool's** name + description + `m<n>` + `module <n>` + page.
3. Match if the full query (or a direct synonym) is a substring of the haystack; else, for
   multi-word queries, **every** token must have a synonym present (AND). Single-word
   queries that fail step-1 do not match.
- `src/utils/highlight.ts` re-implements the original highlighting **safely** — it returns
  ordered `{text, match}` segments rendered by `<Highlight>` as `<mark class="hl">`; never
  `dangerouslySetInnerHTML`.

**UI / routing** (`src/App.tsx`, `src/pages/`, `src/components/`)
- `BrowserRouter`; deep links `/tools/:slug`, `/situations/:slug`; `/situations` redirects
  to `/`; unknown routes → `NotFound`.
- On Home and Tools the **URL query string is the only UI state** (`?q=`, `?section=`,
  `?module=`) — set via `useSearchParams` with `replace`. No `useState` for search/filter.
- `Layout` renders the top nav **and** the bottom nav on every page; CSS
  (`src/styles/global.css`) shows one or the other per breakpoint — mobile ≤600 /
  tablet 601–1024 / desktop ≥1025. Section accent colours drive `--section-color`.

**PWA** (`src/config/`, `src/pwa/`, `vite.config.ts`)
- `src/config/manifest.ts` is imported by **both** `vite.config.ts` and `tests/pwa.test.ts`
  — edit the manifest there, not inline in the Vite config.
- `injectRegister: null` + `registerType: 'prompt'`: `src/pwa/registerSW.ts` does manual
  registration and exposes an event stream (`onPWAStatus`) consumed by `UpdateToast`, so a
  new deploy shows a "Refresh" prompt instead of reloading under the user.
- `index.html` contains a small inline classic `<script>` that swaps `#root` for a
  "serve this over http" message if React never mounts — the standard symptom of opening
  the file via `file://`. Keep it; it survives the build.

**Deploy config**: `base` defaults to `/`; set `VITE_BASE=/subpath/` for project-site
hosting (the router `basename` in `src/main.tsx` reads `import.meta.env.BASE_URL`).
`vercel.json` / `netlify.toml` / `public/_redirects` provide the SPA fallback.

## Adding content

- **New situation**: add to the `raw` array in `situations.ts` (right section block);
  `tools` must be existing tool `id`s. `id`/`slug` auto-generate.
- **New tool**: add to `tools.ts` with a unique `id` + `slug`; then link ≥1 situation
  (the "no orphan tools" relationship test fails otherwise).
- **Synonyms**: `synonyms.ts`, lowercase keys/values; add both directions for bidirectional
  pairs.
- **HPB module links** (future): add `url` or `internalRoute` to a tool's `reference` —
  `<ToolReference>` and `ToolDetail` upgrade the badge to a link automatically. See
  README §13.

See `NOTES.md` for the full list of assumptions and what could not be reproduced from the
original single-file HTML.
