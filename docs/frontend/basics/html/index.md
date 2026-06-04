---
title: HTML 基础入门
---

# HTML 基础入门

HTML（HyperText Markup Language）是构建网页的骨架语言，是前端开发的第一课。

## 什么是 HTML？

HTML 是一种标记语言，它使用标签（Tag）来描述网页的结构和内容。浏览器通过解析 HTML 文档来渲染页面。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的第一个网页</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>欢迎来到 HTML 的世界</p>
</body>
</html>
```

## 基本结构

一个完整的 HTML 文档包含以下结构：

| 部分 | 说明 |
|------|------|
| `<!DOCTYPE html>` | 文档类型声明，告诉浏览器使用 HTML5 标准 |
| `<html>` | 根元素，包裹整个页面 |
| `<head>` | 头部，包含元信息（标题、字符集、样式等） |
| `<body>` | 主体，包含页面可见内容 |

## 常用标签

### 标题标签

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

### 文本标签

```html
<p>段落文本</p>
<strong>加粗（强调语义）</strong>
<em>斜体（强调语义）</em>
<br>  <!-- 换行 -->
<hr>  <!-- 水平线 -->
<blockquote>引用文本</blockquote>
```

### 链接与图片

```html
<!-- 超链接 -->
<a href="https://example.com" target="_blank">点击跳转</a>

<!-- 图片 -->
<img src="image.jpg" alt="图片描述" width="300">
```

### 列表

```html
<!-- 无序列表 -->
<ul>
  <li>项目一</li>
  <li>项目二</li>
  <li>项目三</li>
</ul>

<!-- 有序列表 -->
<ol>
  <li>第一步</li>
  <li>第二步</li>
  <li>第三步</li>
</ol>

<!-- 定义列表 -->
<dl>
  <dt>术语</dt>
  <dd>术语的解释</dd>
</dl>
```

### 表格

```html
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>城市</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>25</td>
      <td>北京</td>
    </tr>
    <tr>
      <td>李四</td>
      <td>30</td>
      <td>上海</td>
    </tr>
  </tbody>
</table>
```

## 全局属性

所有 HTML 元素都可以使用的属性：

| 属性 | 说明 | 示例 |
|------|------|------|
| `id` | 唯一标识符 | `<div id="header">` |
| `class` | 类名（可多个） | `<div class="box active">` |
| `style` | 行内样式 | `<div style="color: red">` |
| `title` | 悬停提示 | `<div title="提示信息">` |
| `data-*` | 自定义数据 | `<div data-id="123">` |
| `hidden` | 隐藏元素 | `<div hidden>` |

## 学习路线

```
HTML 基础 → HTML5 新特性 → 语义化标签 → 表单与验证 → 无障碍访问
```

## 下一步

- 📖 [HTML5 新特性](/frontend/basics/html/html5) - 了解 HTML5 带来的强大功能
- 🏷️ [语义化标签](/frontend/basics/html/semantic) - 让你的 HTML 更有意义
- 📋 [表单与验证](/frontend/basics/html/forms) - 构建交互式表单
