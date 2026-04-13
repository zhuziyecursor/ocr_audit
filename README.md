# OCR Audit

OCR 文档处理系统，基于 Next.js 16 + React 19 构建。

## 功能模块

- **File Upload** - 文件上传
- **OCR Recognition** - OCR 识别
- **File Compare** - 文件对比
- **Content Proofread** - 内容校对
- **OCR Audit** - OCR 审计

## 技术栈

- Next.js 16.2.0 (App Router)
- React 19
- shadcn/ui + Radix UI
- Tailwind CSS v4

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生产构建
pnpm build

# 启动生产服务器
pnpm start
```

## 项目结构

```
├── app/                    # Next.js App Router
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   └── *.tsx            # 功能组件
├── hooks/                 # 自定义 Hooks
├── lib/                    # 工具函数
└── public/                 # 静态资源
```
