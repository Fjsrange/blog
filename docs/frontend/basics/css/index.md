---
title: CSS 基础入门
---

# CSS 基础入门

CSS（Cascading Style Sheets）是层叠样式表，用于控制网页的视觉表现。

## CSS 引入方式

### 行内样式

```html
<p style="color: red; font-size: 16px;">行内样式</p>
```

### 内部样式表

```html
<head>
  <style>
    p { color: red; font-size: 16px; }
  </style>
</head>
```

### 外部样式表（推荐）

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

### @import 导入

```css
@import url('other.css');
```

## 选择器

### 基础选择器

```css
/* 元素选择器 */
p { color: #333; }

/* 类选择器 */
.highlight { background: yellow; }

/* ID 选择器 */
#header { height: 60px; }

/* 通配选择器 */
* { margin: 0; padding: 0; }
```

### 组合选择器

```css
/* 后代选择器（空格） */
.container p { color: #333; }

/* 子代选择器（>） */
.nav > li { display: inline-block; }

/* 相邻兄弟选择器（+） */
h1 + p { margin-top: 0; }

/* 通用兄弟选择器（~） */
h1 ~ p { color: #666; }
```

### 属性选择器

```css
/* 有某属性 */
[type] { border: 1px solid #ccc; }

/* 属性值等于 */
[type="text"] { padding: 8px; }

/* 属性值包含 */
[class*="btn"] { cursor: pointer; }

/* 属性值开头 */
[href^="https"] { color: green; }

/* 属性值结尾 */
[src$=".png"] { border: none; }
```

### 伪类选择器

```css
/* 状态伪类 */
a:hover { color: red; }
a:active { color: orange; }
a:visited { color: purple; }
input:focus { border-color: blue; }

/* 结构伪类 */
li:first-child { font-weight: bold; }
li:last-child { border: none; }
li:nth-child(odd) { background: #f5f5f5; }
li:nth-child(3n) { color: blue; }
tr:nth-of-type(even) { background: #fafafa; }

/* 否定伪类 */
p:not(.special) { color: #666; }
```

### 伪元素选择器

```css
/* 首行 */
p::first-line { font-weight: bold; }

/* 首字母 */
p::first-letter { font-size: 2em; }

/* 前后插入内容 */
.required::after { content: "*"; color: red; }
.icon::before { content: "📌"; }

/* 选中样式 */
::selection { background: #646cff; color: white; }
```

## 盒模型

每个元素都是一个矩形盒子，由四层组成：

```
┌─────────────────────────────────┐
│            margin               │
│  ┌───────────────────────────┐  │
│  │         border            │  │
│  │  ┌─────────────────────┐  │  │
│  │  │      padding        │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │   content     │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### content-box vs border-box

```css
/* 标准盒模型（默认）*/
/* width = 内容宽度 */
.box-content {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 1px solid;
  /* 实际宽度 = 200 + 20*2 + 1*2 = 242px */
}

/* IE 盒模型（推荐）*/
/* width = 内容 + 内边距 + 边框 */
.box-border {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 1px solid;
  /* 实际宽度 = 200px（内容区自动缩小）*/
}

/* 全局推荐设置 */
*, *::before, *::after {
  box-sizing: border-box;
}
```

## 常用属性

### 文本样式

```css
.text {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #333;
}
```

### 背景

```css
.bg {
  background-color: #f5f5f5;
  background-image: url('pattern.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* 简写 */
  background: #f5f5f5 url('pattern.png') center/cover no-repeat;
}
```

### 边框与圆角

```css
.border {
  border: 1px solid #ddd;
  border-radius: 8px;

  /* 阴影 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## 优先级与层叠

优先级从高到低：

```
!important > 行内样式(1000) > ID(100) > 类/伪类/属性(10) > 元素/伪元素(1) > 通配(0)
```

```css
p { color: black; }              /* 0,0,0,1 */
.text { color: blue; }           /* 0,0,1,0 */
#main .text { color: green; }    /* 0,1,1,0 */
style="color: red"               /* 1,0,0,0 */
color: red !important;           /* 最高 */
```

## CSS 变量

```css
:root {
  --primary-color: #646cff;
  --font-size-base: 16px;
  --border-radius: 8px;
}

.button {
  background: var(--primary-color);
  font-size: var(--font-size-base);
  border-radius: var(--border-radius);
}

/* 带默认值 */
.text {
  color: var(--text-color, #333);
}
```

## 下一步

- 📐 [Flexbox 布局](/frontend/basics/css/flexbox) - 一维布局利器
- 🔲 [Grid 布局](/frontend/basics/css/grid) - 二维布局神器
- 🎬 [CSS 动画与过渡](/frontend/basics/css/animation) - 让页面动起来
- 📱 [响应式设计](/frontend/basics/css/responsive) - 适配所有设备
