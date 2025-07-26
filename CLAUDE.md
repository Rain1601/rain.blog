# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on port 3001)
- **Build**: `npm run build`
- **Production server**: `npm start` (runs on port 3001)
- **Linting**: `npm run lint`
- **Create new post**: `npm run new-post` (interactive script)
- **Convert MD to MDX**: `npm run md-to-mdx` (single file) or `npm run batch-md-to-mdx`

## Project Architecture

This is an interactive Python blog platform built with Next.js 15, featuring in-browser Python code execution via Pyodide.

### Core Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Python Runtime**: Pyodide (WebAssembly-based Python in browser)
- **UI**: Material-UI (MUI) with custom theming
- **Code Editor**: Monaco Editor
- **Content**: MDX for blog posts with React component support
- **Styling**: Custom MUI theme with dark/light mode detection

### Key Architectural Components

#### Interactive Code Execution System
- **Pyodide Manager** (`src/utils/pyodide.ts`): Singleton managing Python runtime, automatic package installation, and output capture
- **Interactive Code Block** (`src/components/InteractiveCodeBlock.tsx`): Full-featured Python code editor with execution, error handling, and output display
- **Supported Packages**: numpy, pandas, matplotlib, scipy, sympy, and micropip-installable packages

#### Blog Content System
- **Content Location**: `src/content/blog/posts/` for MDX files
- **Configuration**: `src/content/blog/config.ts` contains blog metadata, tags, and categories
- **Routing**: Dynamic routes via `src/app/posts/[slug]/page.tsx`
- **MDX Components**: Custom styled components in `mdx-components.tsx`

#### Theming System
- **Theme Provider**: Material-UI with automatic dark/light mode detection
- **Font**: Inter font family
- **Color Scheme**: Blue primary (#3b82f6), amber secondary (#f59e0b)

### File Structure Patterns
- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: Reusable React components
- `src/utils/`: Utility functions (Pyodide, MDX processing, post utilities)
- `src/types/`: TypeScript type definitions
- `src/content/blog/`: Blog content and configuration
- `scripts/`: Development scripts for post creation and conversion

### Development Workflow
1. Use `npm run new-post` to create new blog posts with proper metadata
2. Edit MDX files in `src/content/blog/posts/`
3. Blog configuration is automatically updated via the new-post script
4. Interactive Python examples use the `InteractiveCodeBlock` component

### Special Configuration
- **Webpack**: Custom config in `next.config.ts` to support Pyodide (disables Node.js modules for browser)
- **TypeScript**: Path alias `@/*` maps to `src/*`
- **Port**: Development and production both use port 3001
- **MDX**: Supports `.md` and `.mdx` extensions with React component embedding

### Error Boundaries
All components are wrapped in error boundaries to handle Pyodide loading failures and execution errors gracefully.

### GitHub Blog Integration
- **Dynamic Blog Loading**: Added GitHub API integration to fetch blog posts from `Rain1601/rain.blog.repo`
- **Repository Structure**: Supports `posts/year/month/filename.md` structure
- **API Module**: `src/utils/github.ts` handles GitHub API requests with caching (5min revalidation)
- **Routes**: 
  - `/` - Dynamic blog list from GitHub (homepage)
  - `/blog/[id]` - Individual blog post view
- **Markdown Rendering**: Custom `MarkdownRenderer` component supports headings, code blocks, lists, quotes
- **Features**: Search, statistics, year-based filtering, error handling
- **Caching**: Next.js fetch with revalidation for performance

### Performance Considerations
- Pyodide lazy-loads on first code execution
- Python packages are cached after first load
- Monaco Editor is code-split and loaded on demand
- GitHub API responses cached for 5 minutes
- Static generation for improved performance