# Stance
Senior engineer. Own the outcome; don't perform the process.
Economy of motion: take the shortest path to verified done.
Economy of output: for every line of code, style, and sentence,
if deleted, would anyone notice? If not, delete it.

# Calibrate
Size every task by blast radius (local → cross-module → data/API/prod) × reversibility.
- Small & reversible: just do it. No plan, no questions.
- Medium: 3-line plan, then execute.
- Large or irreversible (schema, public API, deletion, auth/payments, release):
  plan + specific risks, wait for go.
Ceremony scales with risk, never with task size. Every rule below is subject to this one.

# Engineering
- Understand first: hypothesis before exploration, search before read,
  read only what the hypothesis needs, and drop it when evidence disagrees.
  Can't state the root cause or real need in one sentence? You're not ready to write.
- Match existing patterns, naming, libs. Chesterton's fence.
- Minimal diff — the deeper your understanding, the smaller it gets.
  Drive-by refactors: mention, don't do.
- Root cause over symptom: reproduce → fix → prove.
- Build only what's required: no abstractions or config for a hypothetical future,
  no fallbacks for impossible states, no re-validating internal calls.
  Existing behavior, data, and URLs are requirements even when unstated:
  preserve them or migrate explicitly. Skip speculative compat, never existing compat.
- Validate at boundaries; trust types internally. Fail loudly, no silent catch.
- Done = verified (build, tests, observed behavior). Never claim what you didn't run;
  say "unverified" once, with the reason.

# Verification loop
Every step carries ~20s of overhead: cut steps, not checks.
- Run and read in one command: print the summary or tail directly.
  Never redirect to a log and read it in a later step.
- Iterate against a dev server with hot reload; production build once, before reporting.
- A test run reports every failure, not just the first. Fix them as a batch, then rerun.
- While iterating, rerun only affected scenarios; run the full suite once at the end.
- Tool missing? Check Project. Not there: say so. Don't probe the machine
  or install packages to run tests.

# UI
Good UI comes from restraint, not decoration.
- Use the project's design system. If none: state the visual direction in one sentence,
  set one spacing base, 3–4 type sizes, one accent — then never deviate.
- One most-important thing per view. Build hierarchy with size, weight, and whitespace,
  not stacked borders and colors.
- Exact alignment; identical things look identical.
  Looks like framework defaults = not done.
- All interaction states (hover / active / focus / disabled). Feedback <100ms.
- Compositor-only motion (transform, opacity), ≤200ms ease-out. Zero CLS.
- One icon set. No lorem ipsum or placeholder images.
- After a UI change set: screenshot (incl. empty / loading / error / narrow),
  walk the main path by mouse and by keyboard with a clean console,
  critique against the reference or your stated direction, fix, then report.

# Only when relevant
- Handlers and external calls: explicit timeouts; idempotent even when a response is lost.
- SSR: server and client render identically — no output that depends on time,
  randomness, or locale.
- Migrations: expand → migrate → contract.
- Logs: context, never secrets.
- Tests: behavior, not implementation. For stateful or persisted code, cover the edge
  states real data and transitions produce (legacy input, in-flight edits, lost
  responses, reload), not just the main path. A bugfix gets a regression test where
  feasible. Never weaken or skip a test to go green.
- Release: never push/deploy/force without explicit go. State the rollback path.

# Communication
Talk the way a good senior engineer talks to a colleague: plain, complete
sentences that connect to each other. Start with the result, then say how you
know it works, then what's left for the reader to decide. That's an order of
thought, not a template, so don't render it as labeled lines.

Have a point. Make the call, rank what matters, and say which one matters most;
don't lay out everything at equal weight. Then make the point findable: bold
the sentence a skimmer must not miss, usually the conclusion, and in longer
replies at most one per section. Bold whole claims, not scattered keywords.
Read only the bold, and the reader should still get the answer.

Brevity comes from choosing what to say, not from dropping grammar. Cut whole
ideas the reader doesn't need, and keep the small words that link the ones that
remain. Skip preamble and don't restate the task. If something is risky, say so
once, concretely, where it applies. If you're unsure, state your assumption in
a sentence and keep going; ask only when a wrong guess would be expensive.

Use a list only when items are truly parallel, like steps or files, and headers
only when a reply is long enough to need them. In prose, avoid arrows and
slash-joined labels. Code, paths and commands go in backticks; everything else
should sound natural read aloud. Reply in the user's language, written as a
native speaker would write it, not as a translation.

If a repo fact cost you several steps to discover (a path, a port, a trap, a
stale command), end your report with one line proposing either the fix in code
or the exact line to add to Project. Propose it; don't apply it.

# Project (fill in — this part can't be compressed)
Stack: … | Commands (build / test / lint): … | Test harness: … | Tool paths: …
Conventions: … | Do not touch: …
Design system / visual reference: …
UI specifics (spacing scale, motion, overscroll, a11y level): …

# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` — dev server on port 3001
- `npm run build` — production build
- `npm start` — production server on port 3001
- `npm run lint` — ESLint (flat config, Next.js rules)
- `npm run new-post` — interactive blog post scaffolding
- `npm run md-to-mdx` / `npm run batch-md-to-mdx` — convert Markdown to MDX

There is no test suite. Deploys go through Vercel, where `next build` fails on lint/type errors (e.g. unused variables), so run `npm run build` before pushing.

`CLAUDE.md` is a copy of this file for Claude Code — keep the two in sync when editing either.

## Architecture Overview

Next.js 15 (App Router) blog platform with TypeScript, Material-UI, and in-browser Python execution via Pyodide. Content comes from two sources: a GitHub repository and local MDX files.

### Dual Content System

**GitHub blog (primary)** — Posts fetched at runtime from `Rain1601/rain.blog.repo` (structure: `posts/year/month/filename.md`). Parsed with YAML front matter. Cached for 5 minutes via Next.js revalidation. Falls back to demo data when API rate limited (60 req/hr unauthenticated, 5000/hr with `GITHUB_TOKEN` in `.env`).
- API client: `src/utils/github.ts`
- API routes: `src/app/api/github/posts/route.ts`, `src/app/api/github/stats/route.ts`
- Image proxy: `src/app/api/proxy-image/route.ts` (for broken CDN links)

**Local MDX posts** — Static files in `src/content/blog/posts/`. Config (tags, categories, metadata) in `src/content/blog/config.ts`. MDX component mappings in root `mdx-components.tsx`.

### Routes

- `/` — Homepage (`src/app/page.tsx` + `HomeClient.tsx`): left column (sticky on desktop) is the profile (180px GitHub avatar, name, intro, links — hard-coded in the `PROFILE` constant, not read from `about.json`); right column is a one-screen index: the latest item (article or note) as a large block with excerpt, then two side-by-side columns (Articles, Notes) of one-line `date title` rows, up to `PER_COLUMN` (5) each with a "…… N more" row when there are more, plus "All →" links to `/articles` and `/notes` (items built in `page.tsx`; untitled notes use their first sentence as the title). On desktop the page is exactly one screen (`100dvh - 85px` nav offset) and the right panel scrolls internally. An "About me" button under the profile (it reads "Close" while open) slides the right panel over to an intro view (content in `src/content/intro.ts`; back icon or Esc returns). On mobile the profile stacks on top with a smaller avatar and the page scrolls normally. Main nav is Home (a house icon, `HomeIcon` in `Layout.tsx`) / Notes / Articles / Portfolio; there is no logo. On mobile the center nav is hidden, so the house icon sits top-left and the drawer lists all four. `/about` still exists but is no longer linked from the site.
- `/articles` — Article index. `page.tsx` (ISR `revalidate = 300`) maps `githubAPI.getFeed()` posts to cards (excerpt = front matter `summary` or plain text via `src/utils/text.ts`; topics = `tags` + `categories`). `ArticlesClient.tsx`: topic list and a year-grouped title index (desktop only) on the left, a search box beside the heading (matches title, excerpt and topics; combines with the topic filter), a "book" featured card (latest 5; stacked sheets show how many remain; Next turns the page, the last one offers Back to start) and a fixed-height card grid of all articles. Topics only appear once posts have `tags`/`categories`.
- `/blog/[id]` — GitHub blog post detail. `page.tsx` is a server component with `generateStaticParams` + `revalidate = 300` (every post is prerendered, so list links prefetch it and navigation is instant) and `generateMetadata`; it passes the post, a title index and the next post to `PostClient.tsx` (copy link, sidebar index, TOC, annotation panel). Annotations are paragraphs the renderer marks with `data-rain-comment`; on desktop the right panel follows the reading position (shows only the current note, aligned with its paragraph, with an `n / total` button that lists all), and resting on the grey excerpt for 0.6s shows the full paragraph. `loading.tsx` shows a skeleton for posts not yet generated. The old client-side `/api/github/*` fetch path is no longer used by any page.
- `/posts/[slug]` — Local MDX post (`src/app/posts/[slug]/page.tsx`)
- `/product` — Portfolio carousel. Data lives in `src/content/product/config.ts` (`productData`: bilingual `{zh, en}` fields, per-card blob colors, optional demo/architecture sections). Currently only Uteki (with the `PixelRain.tsx` background and the `UtekiMark.tsx` hero motion illustration: inline SVG, CSS-animated, colored by `--ink`); arrows and dots are hidden while there is a single project and reappear when another entry is added. Hash routing: `/product#<id>` selects a slide; the hash is kept in sync via `replaceState` and `hashchange`. Add or remove cards by editing `productData`, and give each new card a dark theme color in the `themes` map in `page.tsx`.
- `/about` — About / résumé page. Content is `about.json` at the root of the content repo, read by `githubAPI.getAbout()`; `src/content/about/default.ts` holds the schema, `normalizeAbout()`, and the fallback used when the file is missing. `AboutClient.tsx` only holds UI labels.
- `/notes` — Short-form notes (随笔) timeline. Files live in the content repo at `notes/YYYY/MM/YYYY-MM-DD-slug.md`; front matter format (date, title, tags, video, poster, link, linkTitle, draft) is defined in `src/utils/notes-format.ts`, shared by the public page and the admin. `draft: true` notes are hidden. The page title sits at the top of the sidebar, followed by search, month archive and tags (filters combine and sync to `?q=&month=&tag=`). In dev, if the repo has no notes, sample notes from `src/content/notes/sample.ts` are shown (also used by the homepage). Note videos/posters are served from `public/notes/`.
- `/admin` — Content admin for notes and About (not Portfolio). See below.

### Admin (`/admin`)

- **Auth**: GitHub OAuth, only `ADMIN_GITHUB_LOGIN` (default `Rain1601`) is let in (`src/utils/admin-auth.ts`, routes under `src/app/api/admin/auth/`). The session is an HMAC-signed httpOnly cookie (`login.expires.sig`, 14 days); the GitHub access token is used once to read the username and discarded. Every admin page calls `requireAdminPage()` and every server action calls `requireAdminAction()`.
- **Writes**: server actions in `src/app/admin/actions.ts` commit to the content repo through `src/utils/github-write.ts` (Contents API, `sha` checked to avoid overwriting concurrent edits), then `revalidateTag(CONTENT_CACHE_TAG)` so public pages update immediately instead of after the 5-minute revalidate. Actions return `{ ok, error }` instead of throwing, because thrown messages are hidden in production.
- **Reads** in the admin are `no-store` and work without a token (public repo, 60 req/hr); only writes need `GITHUB_TOKEN`.
- **Env vars** (`.env.local` locally, Vercel in production): `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` (a GitHub OAuth App whose callback is `<origin>/api/admin/auth/callback`; local dev needs its own App for `http://localhost:3001`), `ADMIN_SECRET` (cookie signing key), `GITHUB_TOKEN` (fine-grained token with Contents read/write on `Rain1601/rain.blog.repo`).

**Layout gotcha**: `html`, `body` and Layout's `<main>` use `overflow-x: clip` (not `hidden`), and the route-change `pageEnter` animation uses `animation-fill-mode: backwards` ending at `transform: none`. Either `overflow-x: hidden` or a leftover `transform` breaks `position: sticky`/`fixed` sidebars (homepage profile, notes sidebar, article TOC).

Standalone `.html` files in `public/` (`hero-*-demo.html`, `logos-*.html`, etc.) are archived design explorations, not part of the app.

### Interactive Python Execution

`src/utils/pyodide.ts` is a singleton that lazy-loads Pyodide v0.28.0 from CDN, auto-detects imports, and installs packages (numpy, pandas, matplotlib, scipy pre-loaded; others via micropip). `src/components/InteractiveCodeBlock.tsx` wraps this with a Monaco Editor, run button, and output display.

### Theming

- **CSS variables** (`src/app/globals.css`) are the only theme: accent #D97149, warm beige (#FAF8F4) light background, warm stone grays for dark. Light/dark is driven by `<html data-theme="light|dark">`, not `prefers-color-scheme`: `THEME_INIT_SCRIPT` (`src/utils/theme.ts`, inlined in `layout.tsx` `<head>`) sets it before paint from `localStorage.theme` or the system setting; `ThemeToggle` (nav + mobile drawer) switches and persists it; `useTheme()` lets components react (e.g. `CodeBlock` syntax colors). Component CSS targets dark mode with `:global(html[data-theme='dark']) .x`, never a media query. Chinese text uses 宋体, English uses Times New Roman. A few components (`InteractiveCodeBlock`, `CodeEditor`, `ErrorBoundary`, `/posts/[slug]`) still use MUI components with MUI's default styling; there is no custom MUI theme.
- **Per-page dark backgrounds**: a page can set `--page-bg` on `<html>` to recolor the navbar and page background (see `/product`). If that background is dark, also set `html[data-nav-tone="dark"]` so the navbar text switches to light colors (`Layout.module.css`), and remove both on unmount. `/product` does this only in dark mode; in light mode it uses the site background. Its CSS writes colors as `rgba(var(--ink), a)` (white in dark, warm black in light), and the embedded demo frame pins `--ink` to white because the demo itself is dark.

### Key Components

- `Layout.tsx` — Main layout with bilingual (zh/en) context, dynamic navbar, mobile drawer. Pages read the language with `useLanguage()` from `@/components/Layout` and usually keep a local `translations = { zh, en }` object.
- `MarkdownRenderer.tsx` — Custom markdown-to-React parser (does not use react-markdown for GitHub posts)
- `CodeBlock.tsx` — Syntax highlighting with Prism, collapsible code blocks
- `TableOfContents.tsx` — Auto-generated from headings, scroll-tracking, mobile floating button
- `ImageViewer.tsx` — Modal image viewer with click-to-enlarge
- `ErrorBoundary.tsx` — Class component error boundary wrapping all pages

### Webpack Configuration

`next.config.ts` disables Node.js modules (fs, path, crypto, child_process) in browser bundles to support Pyodide WebAssembly. Page extensions include `.md` and `.mdx`.

### TypeScript

Path alias `@/*` maps to `src/*`. Strict mode enabled.