---
title: 个人博客搭建
---

# 个人博客搭建

使用 VitePress 搭建个人博客，将所学知识整合到一个完整项目中，从搭建到部署的全流程实践。

## 项目概述

```
功能：
├── 首页（Hero + Features）
├── 博客文章列表
├── 前端知识体系
│   ├── 基础（HTML/CSS/JS）
│   ├── 框架（Vue/React）
│   ├── 进阶（图表/高级/模块）
│   └── 概念与实战
├── 归档页面
├── 关于页面
├── 本地搜索
├── 暗色模式
└── 自动化部署

技术栈：VitePress + Markdown + GitHub Pages
```

## 项目搭建

```bash
# 初始化
mkdir my-blog && cd my-blog
pnpm init
pnpm add -D vitepress

# 创建目录结构
mkdir -p docs/.vitepress
mkdir -p docs/blog
mkdir -p docs/frontend/basics/{html,css,javascript}
mkdir -p docs/frontend/frameworks/{vue2,vue3,react}
mkdir -p docs/frontend/advanced/{charts,senior,modules}
mkdir -p docs/frontend/concepts/practice
```

## VitePress 配置

```typescript
// docs/.vitepress/config.mts
import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/blog/',
  title: '我的博客',
  description: '基于 VitePress 的个人博客',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      {
        text: '前端知识',
        items: [
          { text: '基础', link: '/frontend/basics/html/' },
          { text: '框架', link: '/frontend/frameworks/vue2/' },
          { text: '进阶', link: '/frontend/advanced/charts/' },
          { text: '概念与实战', link: '/frontend/concepts/' },
        ],
      },
      { text: '归档', link: '/archives/' },
      { text: '关于', link: '/about/' },
    ],

    sidebar: {
      '/frontend/basics/': [ /* 基础侧边栏 */ ],
      '/frontend/frameworks/': [ /* 框架侧边栏 */ ],
      '/frontend/advanced/': [ /* 进阶侧边栏 */ ],
      '/frontend/concepts/': [ /* 概念侧边栏 */ ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourname' },
    ],

    search: { provider: 'local' },

    footer: {
      message: '基于 <a href="https://vitepress.dev/">VitePress</a> 构建',
      copyright: 'Copyright © 2024-present 我的博客',
    },

    lastUpdated: { text: '最后更新于' },
  },

  markdown: { lineNumbers: true },
});
```

## 首页配置

```yaml
---
layout: home

hero:
  name: "我的博客"
  text: "记录技术与生活的点滴"
  tagline: 用文字丈量世界，以代码编织梦想
  actions:
    - theme: brand
      text: 前端知识体系
      link: /frontend/basics/html/
    - theme: alt
      text: 博客文章
      link: /blog/

features:
  - icon: 🌐
    title: 基础三件套
    details: HTML、CSS、JavaScript —— 前端开发的基石
    link: /frontend/basics/html/
  - icon: ⚡
    title: 主流框架
    details: Vue2、Vue3、React —— 现代前端框架核心思想
    link: /frontend/frameworks/vue2/
  - icon: 📊
    title: 图表可视化
    details: ECharts、D3.js、Canvas、SVG —— 数据可视化
    link: /frontend/advanced/charts/
  - icon: 🚀
    title: 高级进阶
    details: TypeScript、性能优化、设计模式、前端安全
    link: /frontend/advanced/senior/
  - icon: 📦
    title: 模块化工程
    details: Webpack、Vite、包管理、Monorepo
    link: /frontend/advanced/modules/
  - icon: 🧠
    title: 核心概念
    details: 浏览器原理、HTTP 协议、工程化、微前端
    link: /frontend/concepts/
  - icon: 🎯
    title: 实战训练
    details: TodoList、后台管理系统、博客搭建
    link: /frontend/concepts/practice/
  - icon: 💡
    title: 思考感悟
    details: 技术架构、职业发展的思考
    link: /blog/
---
```

## 自定义主题样式

```css
/* docs/.vitepress/style/index.css */
:root {
  --vp-c-brand-1: #5470c6;
  --vp-c-brand-2: #4e63b3;
  --vp-c-brand-3: #4359a0;
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #5470c6, #91cc75);
  --vp-home-hero-image-background-image: linear-gradient(135deg, #5470c633, #91cc7533);
  --vp-home-hero-image-filter: blur(44px);
}

.dark {
  --vp-c-brand-1: #7b93e0;
  --vp-c-brand-2: #6b82d0;
  --vp-c-brand-3: #5b71c0;
}

/* 自定义容器 */
.custom-block.tip {
  border-color: var(--vp-c-brand-1);
}

/* 代码块样式 */
.vp-doc div[class*='language-'] {
  border-radius: 8px;
}
```

## GitHub Actions 自动部署

```yaml
# .github/workflows/deploy.yml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v3
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install
      - run: pnpm docs:build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## package.json 脚本

```json
{
  "name": "my-blog",
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.0.0"
  }
}
```

## 写作技巧

```markdown
<!-- 文章模板 -->
---
title: 文章标题
---

# 文章标题

简短介绍文章内容。

## 核心概念

详细说明...

## 代码示例

\`\`\`javascript
// 代码示例
\`\`\`

## 注意事项

::: tip 提示
重要提示信息
:::

::: warning 注意
需要注意的事项
:::

::: danger 警告
危险操作警告
:::

## 总结

简要总结...

## 下一步

- [相关文章](/path/to/article) - 描述
```

## 扩展练习

```
1. 添加评论系统（Giscus / Waline）
2. 添加文章分类和标签
3. 添加 RSS 订阅
4. 添加阅读量统计
5. 自定义 404 页面
6. 添加 PWA 支持
7. 优化 SEO（sitemap、meta 标签）
8. 添加 Google Analytics
```

## 下一步

- 🗺️ [前端知识图谱](/frontend/concepts/roadmap) - 学习路线图
- 💼 [面试高频题](/frontend/concepts/interview) - 面试准备
- 📏 [编码规范](/frontend/concepts/standards) - 代码规范
