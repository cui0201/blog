# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# This is NOT the Next.js you know

Next.js 16 has breaking changes — APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## 关键约束

### 1. Server Actions 调用限制
`"use server"` 函数不能在客户端 `useEffect` 中调用。客户端组件如需调用，应在 Server Component page.tsx 中调用后通过 props 传递。

### 2. NextAuth 生产环境
在 `src/lib/auth.ts` 配置 `trustHost: true`，否则会报 `UntrustedHost` 错误。

### 3. Markdown 样式
需要 `@tailwindcss/typography` 插件。在 `globals.css` 中配置 `@plugin "@tailwindcss/typography"`。

## 开发命令

```bash
npm run dev        # 开发模式 (localhost:3000)
npm run build      # 生产构建
npm run lint       # ESLint 检查
npx prisma db push # 初始化/同步数据库
npx prisma studio  # 打开数据库管理界面
```

## 架构概览

**认证流程**: NextAuth.js v5 Credentials Provider → `auth()` 在 Server Component 调用 → `middleware.ts` 保护路由

**数据流**: Prisma 5.22 + SQLite → Server Actions (`src/app/actions/`) → API Routes (`src/app/api/`)

**样式**: Tailwind CSS 4.x + shadcn/ui 组件，通过 `components.json` 管理

**Markdown**: react-markdown 10.x + remark-gfm，支持 GFM 语法

## 数据库模型

User (posts, comments, likes), Post (slug unique, tags JSON), Comment, Like (@@unique [userId, postId])

## 常见问题

- **"headers was called outside a request scope"**: `auth()` 在 useEffect 中调用，需移至 Server Component page.tsx