# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OCR document processing system built with Next.js 16 + React 19. A single-page application with tab-based navigation for 5 main workflows: File Upload, OCR Recognition, File Compare, Content Proofread, and OCR Audit.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16.2.0 with App Router
- **UI**: shadcn/ui (new-york style) + Radix UI primitives
- **Styling**: Tailwind CSS v4
- **State**: React useState hooks (client components)
- **Package Manager**: pnpm

## Architecture

- `app/page.tsx` - Main entry with tab-based routing via `activeTab` state
- `components/sidebar.tsx` - Navigation sidebar with `TabType` enum
- `components/*.tsx` - Feature components (FileUpload, OcrRecognition, FileCompare, ContentProofread, OcrAudit)
- `components/ui/` - shadcn/ui components (follows `@/components/ui` alias)
- `lib/utils.ts` - `cn()` utility using clsx + tailwind-merge
- `hooks/` - Custom React hooks

## Path Aliases

`@/*` maps to project root, so:
- `@/components` → `./components`
- `@/components/ui` → `./components/ui`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks`

## Important Notes

- All feature components use `"use client"` directive (no server components in main flow)
- No backend/API routes exist yet — all data is mock with simulated processing
- `next.config.mjs` has `ignoreBuildErrors: true` and `unoptimized: true` for images
- No test framework is configured
