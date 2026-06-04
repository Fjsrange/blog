# 我的个人博客

基于 [VitePress](https://vitepress.dev/) 构建的个人博客站点。

## ✨ 特性

- ⚡️ 基于 Vite 构建，开发体验极速
- 🎨 精美的默认主题，支持自定义样式
- 📱 完美的响应式设计
- 🌙 自动暗色模式
- 🔍 内置本地搜索
- 📝 Markdown 增强（支持 Vue 组件、代码高亮等）

## 📁 项目结构

```
blog/
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts          # VitePress 配置文件
│   │   └── theme/              # 自定义主题
│   │       ├── index.ts        # 主题入口
│   │       └── style/
│   │           └── custom.css  # 自定义样式
│   ├── archives/               # 归档页面
│   │   └── index.md
│   ├── blog/                   # 博客文章
│   │   ├── index.md            # 博客列表页
│   │   ├── vitepress-guide.md
│   │   ├── vue3-composition-api.md
│   │   └── 2024-summary.md
│   ├── about/                  # 关于页面
│   │   └── index.md
│   └── index.md                # 首页
├── package.json
└── README.md
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 即可预览。

### 构建生产版本

```bash
npm run build
```

构建产物在 `docs/.vitepress/dist` 目录。

### 本地预览构建产物

```bash
npm run preview
```

## 📝 写新文章

1. 在 `docs/blog/` 目录下创建新的 `.md` 文件
2. 在文件头部添加 frontmatter：

```yaml
---
title: 文章标题
date: 2024-12-01
tags: [标签1, 标签2]
---
```

3. 在 `docs/.vitepress/config.mts` 中添加侧边栏配置
4. 在 `docs/blog/index.md` 中添加文章卡片

## 🚢 部署

### Vercel

1. 将项目推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置构建命令为 `npm run build`
4. 设置输出目录为 `docs/.vitepress/dist`

### GitHub Pages

可使用 GitHub Actions 自动部署，参考 [VitePress 官方部署文档](https://vitepress.dev/guide/deploying)。

## 📄 License

MIT
