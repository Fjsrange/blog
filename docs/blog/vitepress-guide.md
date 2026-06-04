---
title: VitePress 搭建博客指南
date: 2024-12-01
tags: [VitePress, 博客搭建]
---

# VitePress 搭建博客指南

## 为什么选择 VitePress？

VitePress 是由 Vue.js 团队开发的静态站点生成器，它具有以下优势：

- ⚡️ **极速的开发体验**：基于 Vite 构建，支持即时热更新
- 🎨 **美观的默认主题**：开箱即用的精美文档/博客主题
- 📱 **响应式设计**：完美适配各种设备尺寸
- 🔍 **内置搜索**：支持本地搜索，无需额外配置
- 🌙 **暗色模式**：自动跟随系统偏好
- 🧩 **Markdown 增强**：支持 Vue 组件、数学公式等扩展

## 快速开始

### 1. 初始化项目

```bash
mkdir my-blog && cd my-blog
npm init -y
npm install vitepress vue -D
```

### 2. 创建目录结构

```
my-blog/
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts      # 配置文件
│   │   └── theme/           # 自定义主题
│   │       ├── index.ts
│   │       └── style/
│   │           └── custom.css
│   ├── blog/                # 博客文章
│   ├── index.md             # 首页
│   └── about.md             # 关于页
├── package.json
└── README.md
```

### 3. 配置脚本

在 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  }
}
```

### 4. 启动开发服务器

```bash
npm run dev
```

## 主题定制

VitePress 支持通过 CSS 变量轻松定制主题外观：

```css
:root {
  --vp-c-brand-1: #646cff;
  --vp-c-brand-2: #535bf2;
  --vp-c-brand-3: #4a4af2;
}
```

## 部署

构建完成后，将 `docs/.vitepress/dist` 目录部署到任意静态托管服务即可：

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

## 总结

VitePress 是搭建个人博客的绝佳选择，它简单易用、性能出色，同时拥有强大的扩展能力。希望这篇指南能帮助你快速搭建属于自己的博客！
