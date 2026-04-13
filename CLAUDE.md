# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OCR document processing system for professional auditing workflows. Built with Vue 3 + Vite, featuring 5 main modules: File Upload, OCR Recognition, File Compare, Content Proofread, and OCR Audit.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Tech Stack

- **Framework**: Vue 3.4 with Composition API + `<script setup>`
- **Build Tool**: Vite 5
- **UI Library**: Naive UI (dark theme capable)
- **Routing**: Vue Router 4
- **State**: Pinia
- **Styling**: Tailwind CSS v3 with custom theme
- **Icons**: Lucide Vue Next

## Architecture

```
src/
├── main.ts              # App entry, Naive UI theme configuration
├── App.vue              # Root component with router-view
├── assets/
│   └── globals.css      # Tailwind base + CSS variables (professional audit theme)
├── router/
│   └── index.ts         # Route definitions
├── stores/              # Pinia stores (if needed)
├── views/
│   └── MainView.vue     # Main layout wrapper
└── components/
    ├── layout/
    │   └── AppSidebar.vue   # Dark sidebar navigation
    └── features/            # Feature components
        ├── FileUpload.vue
        ├── OcrRecognition.vue
        ├── FileCompare.vue
        ├── ContentProofread.vue
        └── OcrAudit.vue
```

## Design System

**Professional Audit Theme:**
- Background: `#F1F5F9` (slate-100)
- Sidebar: `#0F172A` (dark slate) with `#3B82F6` blue accents
- Primary: `#2563EB` (blue-600)
- Cards: White with subtle shadows
- Border: `#E2E8F0` (slate-200)

**Naive UI Theme Overrides** are configured in `src/main.ts` to match the professional blue theme.

## Path Aliases

- `@/` maps to `src/`
- Example: `@/components` → `src/components`

## Important Notes

- All feature components are in `src/components/features/`
- Sidebar uses inline styles for precise dark theme control
- Naive UI components require theme configuration in `main.ts`
- Tailwind config (`tailwind.config.js`) contains the color system
- All data is mock/simulated — no backend API exists yet
- TypeScript strict mode enabled
