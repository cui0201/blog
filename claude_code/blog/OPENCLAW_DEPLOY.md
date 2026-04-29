# OpenClaw 部署提示词

## 项目概述

这是一个基于 **Next.js 16** 的多用户博客平台，使用 **Prisma** (SQLite) 数据库和 **NextAuth.js** 实现认证。

**技术栈：**
- 框架：Next.js 16.2.4 (App Router, Turbopack)
- 数据库：SQLite (Prisma ORM)
- 认证：NextAuth.js v5 (beta)
- 样式：Tailwind CSS + shadcn/ui
- 动画：Framer Motion
- Markdown：react-markdown + remark-gfm
- 图片上传：UploadThing

**核心功能：**
- 用户注册/登录
- 个人博客空间
- Markdown 编辑器（实时预览）
- 私密/公开文章
- 评论系统
- 点赞功能

---

## 部署要求

### 1. 环境变量（必需）

部署前需要在服务器上创建 `.env` 文件：

```env
# 数据库 - SQLite 文件路径
DATABASE_URL="file:./prisma/dev.db"

# NextAuth 密钥 - 生产环境必须更换为随机字符串
AUTH_SECRET="generate-a-32-char-random-string"

# UploadThing（可选，图片上传功能）
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."
```

### 2. 构建和启动

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 3. 进程管理（推荐 PM2）

```bash
# 安装 PM2
npm install -g pm2

# 使用 PM2 启动
pm2 start npm --name "blog" -- start

# 常用命令
pm2 list          # 查看进程状态
pm2 logs blog      # 查看日志
pm2 restart blog   # 重启
pm2 stop blog      # 停止
pm2 save          # 保存进程列表
pm2 startup       # 开机自启
```

### 4. Nginx 反向代理配置

如果使用域名，需要配置 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. HTTPS 配置（推荐 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期（Certbot 会自动配置）
```

### 6. 防火墙

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 7. 数据库注意事项

当前使用 SQLite，数据库文件位于 `prisma/dev.db`。

**备份：**
```bash
cp prisma/dev.db prisma/dev.db.backup
```

**迁移到 PostgreSQL（可选，高并发场景）：**

1. 安装 PostgreSQL
2. 修改 `.env`：
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/blog"
   ```
3. 更新 `prisma/schema.prisma`：
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. 执行迁移：
   ```bash
   npm install
   npx prisma migrate deploy
   ```

---

## 目录结构

```
blog/
├── prisma/
│   ├── dev.db          # SQLite 数据库文件
│   └── schema.prisma   # 数据库 schema
├── src/
│   ├── app/            # Next.js App Router 页面
│   │   ├── (auth)/     # 认证页面（登录/注册）
│   │   ├── api/        # API 路由
│   │   ├── editor/     # 文章编辑器
│   │   ├── posts/      # 文章列表/详情
│   │   ├── user/       # 用户空间
│   │   └── admin/      # 管理后台
│   ├── components/     # React 组件
│   ├── lib/            # 工具函数
│   └── actions/        # Server Actions
├── public/             # 静态资源
└── .env                # 环境变量（需创建）
```

---

## 快速部署命令

```bash
# 1. 克隆代码
git clone https://github.com/cui0201/blog.git
cd blog

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env  # 需要手动编辑填入真实值
nano .env

# 4. 构建
npm run build

# 5. 启动（开发模式测试）
npm run dev

# 或使用 PM2（生产模式）
npm install -g pm2
pm2 start npm --name "blog" -- start
pm2 save
```

---

## 故障排查

**端口被占用：**
```bash
lsof -i :3000
kill -9 <PID>
```

**查看日志：**
```bash
pm2 logs blog --lines 100
```

**重置数据库：**
```bash
npx prisma db push --force-reset
```
