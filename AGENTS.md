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
- `/blog/[id]` — GitHub blog post detail. `page.tsx` is a server component with `generateStaticParams` + `revalidate = 300` (every post is prerendered, so list links prefetch it and navigation is instant) and `generateMetadata`; it passes the post, a title index and the next post to `PostClient.tsx` (copy link, sidebar index, TOC). `loading.tsx` shows a skeleton for posts not yet generated. The old client-side `/api/github/*` fetch path is no longer used by any page.
- `/posts/[slug]` — Local MDX post (`src/app/posts/[slug]/page.tsx`)
- `/product` — Portfolio carousel. Data lives in `src/content/product/config.ts` (`productData`: bilingual `{zh, en}` fields, per-card blob colors, optional demo/architecture sections). Currently only Uteki (with the `PixelRain.tsx` hero animation); arrows and dots are hidden while there is a single project and reappear when another entry is added. Hash routing: `/product#<id>` selects a slide; the hash is kept in sync via `replaceState` and `hashchange`. Add or remove cards by editing `productData`, and give each new card a dark theme color in the `themes` map in `page.tsx`.
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
- **Per-page dark backgrounds**: a page can set `--page-bg` on `<html>` to recolor the navbar and page background (see `/product`). If that background is dark, also set `html[data-nav-tone="dark"]` so the navbar text switches to light colors (`Layout.module.css`), and remove both on unmount.

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