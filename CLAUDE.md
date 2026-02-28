# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` — dev server on port 3001
- `npm run build` — production build
- `npm start` — production server on port 3001
- `npm run lint` — ESLint (flat config, Next.js rules)
- `npm run new-post` — interactive blog post scaffolding
- `npm run md-to-mdx` / `npm run batch-md-to-mdx` — convert Markdown to MDX

## Architecture Overview

Next.js 15 (App Router) blog platform with TypeScript, Material-UI, and in-browser Python execution via Pyodide. Content comes from two sources: a GitHub repository and local MDX files.

### Dual Content System

**GitHub blog (primary)** — Posts fetched at runtime from `Rain1601/rain.blog.repo` (structure: `posts/year/month/filename.md`). Parsed with YAML front matter. Cached for 5 minutes via Next.js revalidation. Falls back to demo data when API rate limited (60 req/hr unauthenticated, 5000/hr with `GITHUB_TOKEN` in `.env`).
- API client: `src/utils/github.ts`
- Client wrapper: `src/utils/api.ts`
- API routes: `src/app/api/github/posts/route.ts`, `src/app/api/github/stats/route.ts`
- Image proxy: `src/app/api/proxy-image/route.ts` (for broken CDN links)

**Local MDX posts** — Static files in `src/content/blog/posts/`. Config (tags, categories, metadata) in `src/content/blog/config.ts`. MDX component mappings in root `mdx-components.tsx`.

### Routes

- `/` — Homepage with GitHub blog list, search, and timeline filtering
- `/blog/[id]` — GitHub blog post detail (`src/app/blog/[id]/page.tsx`)
- `/posts/[slug]` — Local MDX post (`src/app/posts/[slug]/page.tsx`)
- `/about` — About page

### Interactive Python Execution

`src/utils/pyodide.ts` is a singleton that lazy-loads Pyodide v0.28.0 from CDN, auto-detects imports, and installs packages (numpy, pandas, matplotlib, scipy pre-loaded; others via micropip). `src/components/InteractiveCodeBlock.tsx` wraps this with a Monaco Editor, run button, and output display.

### Theming

Two parallel systems:
- **MUI theme** (`src/theme/mui-theme.ts`): Dark palette, primary #60a5fa, background #0a0f1c
- **CSS variables** (`src/app/globals.css`): Light/dark modes, accent #D97149, warm beige (#FAF8F4) light background. Chinese text uses 宋体, English uses Times New Roman.

### Key Components

- `Layout.tsx` — Main layout with bilingual (zh/en) context, dynamic navbar, mobile drawer
- `MarkdownRenderer.tsx` — Custom markdown-to-React parser (does not use react-markdown for GitHub posts)
- `CodeBlock.tsx` — Syntax highlighting with Prism, collapsible code blocks
- `TableOfContents.tsx` — Auto-generated from headings, scroll-tracking, mobile floating button
- `ImageViewer.tsx` — Modal image viewer with click-to-enlarge
- `ErrorBoundary.tsx` — Class component error boundary wrapping all pages

### Webpack Configuration

`next.config.ts` disables Node.js modules (fs, path, crypto, child_process) in browser bundles to support Pyodide WebAssembly. Page extensions include `.md` and `.mdx`.

### TypeScript

Path alias `@/*` maps to `src/*`. Strict mode enabled.