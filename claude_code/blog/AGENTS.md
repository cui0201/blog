<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 博客项目 Agent 开发指南

## 项目概述

这是一个基于 **Next.js 16** 的多用户博客平台，支持 Markdown 编辑、评论、点赞等功能。用户可以注册账号、创建个人博客空间、发布公开或私密文章。

**在线地址**：https://github.com/cui0201/blog

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.2.4 | 框架 (App Router) |
| React | 19.2.4 | UI 库 |
| TypeScript | 5.x | 类型系统 |
| Prisma | 5.22.0 | ORM |
| SQLite | - | 数据库 |
| NextAuth.js | 5.0 (beta) | 认证 |
| Tailwind CSS | 4.x | 样式 |
| shadcn/ui | - | UI 组件库 |
| Framer Motion | 12.x | 动画 |
| react-markdown | 10.x | Markdown 渲染 |

---

## 目录结构

```
blog/
├── prisma/
│   ├── schema.prisma    # 数据库 schema
│   └── dev.db          # SQLite 数据库文件
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 认证路由组
│   │   │   ├── login/         # 登录页
│   │   │   └── register/      # 注册页
│   │   ├── actions/           # Server Actions
│   │   │   ├── post.ts        # 文章 CRUD
│   │   │   └── comment.ts     # 评论 CRUD
│   │   ├── api/               # API 路由
│   │   │   ├── auth/          # NextAuth 路由
│   │   │   ├── posts/         # 文章 API
│   │   │   └── user/          # 用户 API
│   │   ├── editor/            # 文章编辑器
│   │   │   ├── new/           # 新建文章 (/editor/new)
│   │   │   └── [postId]/      # 编辑文章 (/editor/:postId)
│   │   ├── posts/             # 文章列表和详情
│   │   ├── user/              # 用户空间
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # 用户主页
│   │   │       └── dashboard/ # 文章管理后台
│   │   ├── admin/             # 管理后台
│   │   ├── settings/          # 设置页
│   │   └── about/             # 关于页
│   ├── components/            # React 组件
│   │   ├── ui/                # shadcn/ui 组件
│   │   ├── PostCard.tsx       # 文章卡片
│   │   ├── HeroSection.tsx    # 首页 Hero
│   │   ├── CommentSection.tsx # 评论组件
│   │   ├── LikeButton.tsx     # 点赞按钮
│   │   └── Navbar.tsx         # 导航栏
│   ├── lib/                   # 工具函数
│   │   ├── auth.ts            # NextAuth 配置
│   │   ├── prisma.ts         # Prisma 客户端
│   │   └── utils.ts          # 通用工具
│   ├── types/                 # TypeScript 类型
│   │   └── index.ts          # Post 类型定义
│   └── middleware.ts          # 中间件（认证）
├── public/                   # 静态资源
├── .env                      # 环境变量
└── package.json
```

---

## 数据库模型

### User
```prisma
model User {
  id        String    @id @default(cuid())
  name      String?   # 显示名称
  email     String    @unique
  password  String    # bcrypt 加密
  avatarUrl String?   # 头像 URL
  bio       String?   # 个人简介
  posts     Post[]    # 用户的文章
  comments  Comment[] # 用户的评论
  likes     Like[]    # 用户的点赞
}
```

### Post
```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  slug      String    @unique  # URL 友好的标识
  content   String               # Markdown 内容
  excerpt   String?              # 文章摘要
  published Boolean  @default(false)
  isPrivate Boolean  @default(false)  # 私密文章
  authorId  String
  author    User     @relation(...)
  tags      String   @default("[]")  # JSON 数组
  comments  Comment[]
  likes     Like[]
}
```

### Comment & Like
```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  authorId  String
  author    User     @relation(...)
  postId    String
  post      Post     @relation(...)
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(...)
  postId    String
  post      Post     @relation(...)
  @@unique([userId, postId])  # 每人每文只能点赞一次
}
```

---

## 路由说明

### 页面路由

| 路径 | 说明 | 认证 |
|------|------|------|
| `/` | 首页 | 否 |
| `/login` | 登录 | 否 |
| `/register` | 注册 | 否 |
| `/posts` | 文章列表 | 否 |
| `/posts/[id]` | 文章详情 | 否 |
| `/user/[id]` | 用户主页 | 否 |
| `/user/[id]/dashboard` | 文章管理 | 是 |
| `/editor/new` | 新建文章 | 是 |
| `/editor/[postId]` | 编辑文章 | 是 |
| `/settings` | 设置 | 是 |
| `/admin` | 管理后台 | 是 |

### API 路由

| 路径 | 方法 | 说明 |
|------|------|------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth 认证 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/posts` | GET | 获取文章列表 |
| `/api/posts/[id]/like` | POST | 点赞/取消点赞 |
| `/api/user/profile` | GET/PUT | 用户资料 |
| `/api/user/avatar` | POST | 上传头像 |
| `/api/upload` | POST | 上传文件 |

### Server Actions

**post.ts:**
- `upsertPost(id, data)` - 创建/更新文章
- `deletePost(id)` - 删除文章
- `getPostById(id)` - 获取文章

**comment.ts:**
- `addComment(postId, content)` - 添加评论
- `deleteComment(id)` - 删除评论

---

## 认证流程

使用 **NextAuth.js v5** 的 Credentials Provider：

1. 用户在 `/login` 提交 email + password
2. Server Action 调用 `signIn()` 进行认证
3. 成功后生成 JWT session
4. `middleware.ts` 保护需要认证的路由

**获取当前用户：**
```typescript
import { auth } from "@/lib/auth";

const session = await auth();
const userId = session?.user?.id;
```

---

## 重要约定

### 1. Server Actions 调用限制
- `"use server"` 函数不能在客户端 `useEffect` 中调用
- 客户端组件如需调用，应在 Server Component page.tsx 中调用后通过 props 传递

### 2. NextAuth 在生产环境
- 需要在 `auth.ts` 配置 `trustHost: true`
- 否则会报 `UntrustedHost` 错误

### 3. 样式系统
- 使用 Tailwind CSS v4
- 需要安装 `@tailwindcss/typography` 插件来支持 `prose` 类
- shadcn/ui 组件通过 `components.json` 管理

### 4. Markdown 渲染
- 使用 `react-markdown` + `remark-gfm`
- 需要在 globals.css 中配置 `@plugin "@tailwindcss/typography"`

### 5. 环境变量
```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="your-secret-key"
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."
```

---

## 开发命令

```bash
npm install        # 安装依赖
npm run dev        # 开发模式
npm run build      # 生产构建
npm run start      # 生产运行
npm run lint       # ESLint 检查
npx prisma studio  # 打开数据库管理界面
```

---

## 常见问题排查

**1. 登录后页面报错 "headers was called outside a request scope"**
- 原因：在 useEffect 中调用了 `auth()`
- 解决：将 `auth()` 移到 Server Component page.tsx 中

**2. Markdown 样式不生效**
- 原因：缺少 `@tailwindcss/typography` 插件
- 解决：`npm install @tailwindcss/typography` 并在 globals.css 中添加 `@plugin`

**3. NextAuth 生产环境报 UntrustedHost**
- 解决：在 `src/lib/auth.ts` 的 NextAuth 配置中添加 `trustHost: true`

---

## 部署信息

详见 [OPENCLAW_DEPLOY.md](./OPENCLAW_DEPLOY.md)

---

## 项目维护者

- Owner: cui0201
- GitHub: https://github.com/cui0201/blog
