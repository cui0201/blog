# Blog - 多用户博客平台

一个基于 Next.js 16 的多用户博客平台，支持 Markdown 编辑、评论、点赞、暗色模式等功能。

**在线地址**: https://github.com/cui0201/blog

## 功能特性

- **用户系统**: 注册、登录、个人空间管理
- **文章管理**: Markdown 编辑器、公开/私密文章、摘要
- **社交互动**: 评论、点赞
- **暗色模式**: 支持明暗主题切换，带渐变动画效果
- **响应式设计**: 适配桌面和移动端

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.2.4 | 框架 (App Router + Turbopack) |
| React | 19.2.4 | UI 库 |
| TypeScript | 5.x | 类型系统 |
| Prisma | 5.22.0 | ORM |
| SQLite | - | 数据库 |
| NextAuth.js | 5.0 (beta) | 认证 |
| Tailwind CSS | 4.x | 样式 |
| shadcn/ui | - | UI 组件库 |
| Framer Motion | 12.x | 动画 |
| react-markdown | 10.x | Markdown 渲染 |

## 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm / bun

### 安装

```bash
# 克隆项目
git clone https://github.com/cui0201/blog.git
cd blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 环境变量

创建 `.env` 文件：

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="your-secret-key"
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."
```

### 数据库

```bash
# 初始化数据库
npx prisma db push

# 打开 Prisma Studio（可选）
npx prisma studio
```

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

## 最近更新

### v0.2.0 (2026-04-30)

- **UI 优化**: 修复暗色模式下渐变文字显示异常
- **交互优化**: 缩短导航过渡动画时长，提升响应速度
- **样式修复**: 修复亮色模式颜色回归问题
- **层级优化**: 修复编辑器工具栏与导航栏的 z-index 冲突

### v0.1.0 (2026-04-29)

- **暗色模式**: 支持明暗主题切换，带 spotlight 特效
- **全屏 Hero**: 动画渐变背景，响应式布局
- **Markdown 编辑器**: 实时预览，支持公开/私密切换

## 项目结构

```
blog/
├── prisma/
│   ├── schema.prisma    # 数据库 schema
│   └── dev.db          # SQLite 数据库文件
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── (auth)/     # 认证路由
│   │   ├── actions/    # Server Actions
│   │   ├── api/        # API 路由
│   │   ├── editor/     # 文章编辑器
│   │   ├── posts/      # 文章列表和详情
│   │   ├── user/       # 用户空间
│   │   └── settings/   # 设置页
│   ├── components/      # React 组件
│   ├── lib/            # 工具函数
│   └── middleware.ts    # 认证中间件
├── public/             # 静态资源
└── package.json
```

## 开发命令

```bash
npm run dev      # 开发模式
npm run build    # 生产构建
npm run start    # 生产运行
npm run lint     # ESLint 检查
```

## License

MIT
