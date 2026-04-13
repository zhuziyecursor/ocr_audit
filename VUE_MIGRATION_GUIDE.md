# OCR Demo Vue 3 迁移开发指南

## 项目概述

将现有的 Next.js 16 + React 19 OCR 文档处理系统迁移到 Vue 3 + Vite 架构。

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.4 + Vite 5 |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia |
| UI组件库 | Naive UI |
| 样式 | Tailwind CSS v3 + OKLCH颜色 |
| 图标 | Lucide Vue Next |
| 文件上传 | vue-dropzone |
| 包管理 | pnpm |

---

## 项目初始化

### Step 1: 创建 Vue 项目

```bash
# 在 ocr_demo 目录下执行
pnpm create vite@latest . --template vue-ts -- --force
```

### Step 2: 安装依赖

```bash
# 核心依赖
pnpm add vue-router@4 pinia naive-ui @vueuse/core lucide-vue-next vue-dropzone

# 开发依赖
pnpm add -D tailwindcss@3 postcss autoprefixer @types/node
```

### Step 3: 初始化 Tailwind

```bash
npx tailwindcss init -p
```

---

## 目录结构

```
src/
├── assets/
│   └── globals.css          # Tailwind + OKLCH 颜色变量
├── components/
│   ├── layout/
│   │   └── AppSidebar.vue  # 侧边栏导航
│   ├── ui/                 # Naive UI 包装组件
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Badge.vue
│   │   ├── Select.vue
│   │   ├── Tabs.vue
│   │   ├── Table.vue
│   │   ├── Input.vue
│   │   ├── Textarea.vue
│   │   ├── DropdownMenu.vue
│   │   └── Progress.vue
│   └── features/
│       ├── FileUpload.vue
│       ├── OcrRecognition.vue
│       ├── FileCompare.vue
│       ├── ContentProofread.vue
│       └── OcrAudit.vue
├── router/
│   └── index.ts
├── stores/
├── hooks/
│   ├── useMobile.ts
│   └── useToast.ts
├── lib/
│   └── utils.ts
├── views/
│   └── MainView.vue
├── App.vue
└── main.ts
```

---

## 配置文件

### tsconfig.json 添加路径别名

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OKLCH 颜色（从原项目 app/globals.css 提取）
        background: 'oklch(0.13 0.005 260)',
        foreground: 'oklch(0.95 0 0)',
        primary: 'oklch(0.65 0.18 160)',
        destructive: 'oklch(0.55 0.22 25)',
        success: 'oklch(0.65 0.18 145)',
        warning: 'oklch(0.75 0.15 75)',
        sidebar: 'oklch(0.1 0.005 260)',
        accent: 'oklch(0.15 0.005 260)',
        'sidebar-accent': 'oklch(0.18 0.005 260)',
        border: 'oklch(0.25 0.005 260)',
        muted: 'oklch(0.2 0.005 260)',
        'muted-foreground': 'oklch(0.6 0 0)',
      }
    },
  },
  plugins: [],
}
```

### src/assets/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: oklch(0.13 0.005 260);
  --foreground: oklch(0.95 0 0);
  --primary: oklch(0.65 0.18 160);
  --destructive: oklch(0.55 0.22 25);
  --success: oklch(0.65 0.18 145);
  --warning: oklch(0.75 0.15 75);
  --sidebar: oklch(0.1 0.005 260);
  --accent: oklch(0.15 0.005 260);
  --sidebar-accent: oklch(0.18 0.005 260);
  --border: oklch(0.25 0.005 260);
  --muted: oklch(0.2 0.005 260);
  --muted-foreground: oklch(0.6 0 0);
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

---

## 核心文件

### src/main.ts

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import App from './App.vue'
import router from './router'
import './assets/globals.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)

app.mount('#app')
```

### src/App.vue

```vue
<template>
  <router-view />
</template>
```

### src/router/index.ts

```ts
import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainView,
      children: [
        { path: '', redirect: '/upload' },
        { path: 'upload', name: 'upload', component: () => import('@/components/features/FileUpload.vue') },
        { path: 'ocr', name: 'ocr', component: () => import('@/components/features/OcrRecognition.vue') },
        { path: 'compare', name: 'compare', component: () => import('@/components/features/FileCompare.vue') },
        { path: 'proofread', name: 'proofread', component: () => import('@/components/features/ContentProofread.vue') },
        { path: 'audit', name: 'audit', component: () => import('@/components/features/OcrAudit.vue') },
      ]
    }
  ]
})

export default router
```

### src/views/MainView.vue

```vue
<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar />
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>
```

### src/components/layout/AppSidebar.vue

参考原 `components/sidebar.tsx`，实现：
- TabType: `"upload" | "ocr" | "compare" | "proofread" | "audit"`
- 5个导航项带图标（使用 lucide-vue-next）
- 折叠功能（w-64 展开，w-16 折叠）
- 活跃状态高亮

---

## 5个功能组件

### 1. FileUpload.vue
- 参考 `components/file-upload.tsx`
- 使用 vue-dropzone 替代 react-dropzone
- 拖拽上传 + 进度条模拟

### 2. OcrRecognition.vue
- 参考 `components/ocr-recognition.tsx`
- OCR引擎/语言/格式选择器
- 文件列表 + 预览/Raw切换

### 3. FileCompare.vue
- 参考 `components/file-compare.tsx`
- 分屏/统一视图切换
- Diff高亮渲染

### 4. ContentProofread.vue
- 参考 `components/content-proofread.tsx`
- Issue列表 + Accept/Reject

### 5. OcrAudit.vue
- 参考 `components/ocr-audit.tsx`
- 表格筛选 + 统计卡片

---

## 工具函数

### src/lib/utils.ts

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

需要安装：`pnpm add clsx tailwind-merge`

### src/hooks/useMobile.ts

```ts
import { useMediaQuery } from '@vueuse/core'

export function useMobile() {
  return useMediaQuery('(max-width: 768px)')
}
```

### src/hooks/useToast.ts

使用 Naive UI 的 useMessage：

```ts
import { useMessage } from 'naive-ui'

export function useToast() {
  const message = useMessage()
  return {
    toast: (content: string) => message.success(content),
    success: (content: string) => message.success(content),
    error: (content: string) => message.error(content),
    warning: (content: string) => message.warning(content),
  }
}
```

---

## 验证命令

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```

---

## 注意事项

1. **Naive UI 组件使用**：优先使用 Naive UI 组件，Tailwind 用于布局和自定义样式
2. **响应式处理**：使用 `@vueuse/core` 的 `useMediaQuery`
3. **类型定义**：参考原项目的 TypeScript 接口
4. **图标**：统一使用 `lucide-vue-next`
5. **颜色**：OKLCH 颜色值需转换（CSS 原生支持）

---

## 原项目文件参考

| 原文件路径 | 说明 |
|-----------|------|
| `app/page.tsx` | 主页面，tab 切换逻辑 |
| `components/sidebar.tsx` | 侧边栏 |
| `components/file-upload.tsx` | 文件上传 |
| `components/ocr-recognition.tsx` | OCR 识别 |
| `components/file-compare.tsx` | 文件对比 |
| `components/content-proofread.tsx` | 内容校对 |
| `components/ocr-audit.tsx` | OCR 审计 |
| `app/globals.css` | 颜色变量 |
| `lib/utils.ts` | 工具函数 |
| `hooks/use-mobile.ts` | 移动端检测 |
| `hooks/use-toast.ts` | Toast 提示 |
