---
title: 语义化标签
---

# 语义化标签

语义化标签让 HTML 代码更具可读性，有助于 SEO 和无障碍访问。

## 为什么需要语义化？

### 不好的做法（div 汤）

```html
<div class="header">
  <div class="nav">
    <div class="nav-item">首页</div>
    <div class="nav-item">关于</div>
  </div>
</div>
<div class="main">
  <div class="article">
    <div class="title">文章标题</div>
    <div class="content">文章内容</div>
  </div>
  <div class="sidebar">侧边栏</div>
</div>
<div class="footer">页脚</div>
```

### 好的做法（语义化）

```html
<header>
  <nav>
    <a href="/">首页</a>
    <a href="/about">关于</a>
  </nav>
</header>
<main>
  <article>
    <h1>文章标题</h1>
    <p>文章内容</p>
  </article>
  <aside>侧边栏</aside>
</main>
<footer>页脚</footer>
```

## 常用语义化标签

### 页面结构标签

| 标签 | 用途 | 使用场景 |
|------|------|----------|
| `<header>` | 页面或区块头部 | 网站头部、文章头部 |
| `<nav>` | 导航链接 | 主导航、面包屑 |
| `<main>` | 页面主体内容 | 每页仅一个 |
| `<footer>` | 页面或区块底部 | 版权信息、联系方式 |
| `<aside>` | 侧边内容 | 侧边栏、广告、引用 |

### 内容标签

| 标签 | 用途 | 使用场景 |
|------|------|----------|
| `<article>` | 独立完整的内容 | 博客文章、新闻、评论 |
| `<section>` | 内容分区 | 章节标签页内容 |
| `<figure>` | 独立的引用内容 | 图片、图表、代码 |
| `<figcaption>` | figure 的标题 | 图片说明文字 |
| `<details>` | 可展开的详情 | FAQ、折叠内容 |
| `<summary>` | details 的摘要 | 折叠内容的标题 |
| `<time>` | 时间日期 | 发布日期、活动时间 |
| `<mark>` | 标记高亮 | 搜索结果高亮 |
| `<address>` | 联系信息 | 作者联系方式 |

## 实战示例：博客页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>我的博客</title>
</head>
<body>
  <header>
    <h1>我的博客</h1>
    <nav>
      <a href="/">首页</a>
      <a href="/blog">文章</a>
      <a href="/about">关于</a>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>VitePress 搭建博客指南</h2>
        <time datetime="2024-12-01">2024年12月1日</time>
        <address>由 <a href="/about">作者</a> 编写</address>
      </header>

      <section>
        <h3>简介</h3>
        <p>本文介绍如何使用 VitePress 搭建博客...</p>
      </section>

      <section>
        <h3>步骤</h3>
        <p>首先安装依赖...</p>
      </section>

      <footer>
        <p>标签：<mark>VitePress</mark> <mark>博客</mark></p>
      </footer>
    </article>

    <aside>
      <h2>相关文章</h2>
      <ul>
        <li><a href="#">Vue3 入门</a></li>
        <li><a href="#">CSS 布局</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024 我的博客. All rights reserved.</p>
  </footer>
</body>
</html>
```

## 语义化的好处

1. 🔍 **SEO 友好** - 搜索引擎更好地理解页面结构
2. ♿ **无障碍访问** - 屏幕阅读器能正确解读内容
3. 📖 **代码可读性** - 团队协作时更容易理解
4. 🛠️ **可维护性** - 结构清晰，便于修改和扩展
