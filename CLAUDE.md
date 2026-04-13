# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OCR document processing system for professional auditing workflows. Built with Vue 3 + Vite, featuring 5 main modules: File Upload, OCR Recognition, File Compare, Content Proofread, and OCR Audit.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build (runs vue-tsc first)
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
- **HTTP Client**: Axios

## Architecture

```
src/
├── main.ts              # App entry, Naive UI theme + manual component registration
├── App.vue              # Root component with router-view
├── api/
│   └── ocr.ts           # OCR API integration (processOcr function)
├── assets/
│   └── globals.css      # Tailwind base + CSS variables (professional audit theme)
├── router/
│   └── index.ts         # Route definitions
├── stores/
│   └── ocr.ts           # Pinia store for upload/OCR state
├── views/
│   └── MainView.vue     # Main layout wrapper
└── components/
    ├── layout/
    │   └── AppSidebar.vue   # Dark sidebar navigation
    └── features/            # Feature components
        ├── FileUpload.vue        # File upload + OCR trigger
        ├── OcrRecognition.vue    # OCR results display
        ├── FileCompare.vue
        ├── ContentProofread.vue
        └── OcrAudit.vue
```

## OCR API Integration

**Backend**: `zzy-ocr-service` running at `http://localhost:8089`

**Endpoint**: `POST /api/ocr/v1/ocr/process`
- Content-Type: `multipart/form-data`
- Params: `file` (required), `fileType`, `language`, `extractTables`, `extractText`, `structuredOutput`, `tableMode`

**Key types** (`src/api/ocr.ts`):
- `OcrProcessParams` - request params
- `OcrProcessResponse` - response with `extractedText`, `data.text`, `data.tables`
- `OcrProgressEvent` - upload/processing progress callback

**File upload flow**:
1. `FileUpload.vue` adds files to Pinia store via `useOcrStore().addFiles()`
2. `handleStartOcr()` calls `processOcr()` from `src/api/ocr.ts`
3. Results stored in Pinia store via `useOcrStore().updateFile()`
4. Navigates to `/ocr?selected=<fileId>` which auto-selects the file

**Vite proxy** (`vite.config.ts`): `/api` requests proxied to `http://localhost:8089`

## Design System

**Professional Audit Theme:**
- Background: `#F1F5F9` (slate-100)
- Sidebar: `#0F172A` (dark slate) with `#3B82F6` blue accents
- Primary: `#2563EB` (blue-600)
- Cards: White with subtle shadows
- Border: `#E2E8F0` (slate-200)

**Naive UI**: Manual component registration in `main.ts` (no auto-import plugin). Available components: `NButton`, `NInput`, `NSelect`, `NDataTable`, `NDropdown`, `NInputGroup`, `NTag`, `NSpin`, `NIcon`, `NTabs`, `NTabPane`, `NProgress`.

## Path Aliases

- `@/` maps to `src/`
- Example: `@/components` → `src/components`

## Supported File Types

PDF, PNG, JPG, JPEG, BMP, TIFF, TIF, GIF, DOCX, XLSX, TXT

## Important Notes

- All feature components are in `src/components/features/`
- Sidebar uses inline styles for precise dark theme control
- Naive UI components require manual registration in `main.ts`
- `VITE_API_BASE_URL` is empty in `.env` — dev uses Vite proxy (relative paths); set full URL for production
- Tailwind config (`tailwind.config.js`) contains the color system
- TypeScript strict mode enabled
