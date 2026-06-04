---
title: 响应式设计
---

# 响应式设计

响应式设计（Responsive Design）让网页在不同设备和屏幕尺寸下都能良好展示。

## 媒体查询

### 基本语法

```css
@media media-type and (media-feature) {
  /* 样式规则 */
}
```

### 常用断点

```css
/* 移动优先（推荐）*/

/* 默认样式：移动端 */

/* 平板 */
@media (min-width: 768px) {
  .container { max-width: 720px; }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container { max-width: 960px; }
}

/* 大屏 */
@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
```

### 常用媒体特性

```css
/* 屏幕宽度 */
@media (min-width: 768px) { }   /* 最小宽度 */
@media (max-width: 768px) { }   /* 最大宽度 */

/* 屏幕方向 */
@media (orientation: portrait) { }   /* 竖屏 */
@media (orientation: landscape) { }  /* 横屏 */

/* 分辨率 */
@media (min-resolution: 2dppx) { }  /* Retina 屏幕 */

/* 暗色模式 */
@media (prefers-color-scheme: dark) { }

/* 减少动画 */
@media (prefers-reduced-motion: reduce) { }

/* 悬停能力 */
@media (hover: hover) { }  /* 支持悬停的设备 */
```

## 视口设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

| 属性 | 说明 | 常用值 |
|------|------|--------|
| `width` | 视口宽度 | `device-width` |
| `initial-scale` | 初始缩放 | `1.0` |
| `maximum-scale` | 最大缩放 | `5.0` |
| `user-scalable` | 允许缩放 | `no`（不推荐） |

## 相对单位

### 常用相对单位

| 单位 | 说明 | 使用场景 |
|------|------|----------|
| `em` | 相对父元素字体大小 | 组件内间距 |
| `rem` | 相对根元素字体大小 | 全局排版 |
| `vw` | 视口宽度的 1% | 全宽布局 |
| `vh` | 视口高度的 1% | 全屏区域 |
| `vmin` | vw 和 vh 中较小的 | 等比缩放 |
| `%` | 相对父元素 | 弹性布局 |
| `ch` | 字符 "0" 的宽度 | 代码块宽度 |

### rem 方案

```css
html {
  font-size: 16px; /* 基准值 */
}

/* 响应式调整 */
@media (min-width: 768px) {
  html { font-size: 17px; }
}

@media (min-width: 1024px) {
  html { font-size: 18px; }
}

h1 { font-size: 2rem; }    /* 32px → 34px → 36px */
p  { font-size: 1rem; }    /* 16px → 17px → 18px */
.small { font-size: 0.875rem; } /* 14px → 14.875px → 15.75px */
```

## 弹性布局

### 容器最大宽度

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
```

### 响应式网格

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
```

### 响应式 Flexbox

```css
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.flex-container > .item {
  flex: 1 1 300px; /* 最小 300px，自动换行 */
}
```

## 响应式图片

```css
/* 自适应图片 */
img {
  max-width: 100%;
  height: auto;
}

/* 不同分辨率加载不同图片 */
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="响应式图片">
</picture>

/* 艺术指导 - 不同裁切 */
<picture>
  <source media="(min-width: 768px)" srcset="wide-crop.jpg">
  <img src="square-crop.jpg" alt="不同裁切">
</picture>
```

## 响应式文字

```css
/* clamp() 实现流体文字 */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* 最小 1.5rem，首选 4vw，最大 3rem */
}

p {
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  line-height: 1.6;
}
```

## 隐藏元素

```css
/* 仅在移动端显示 */
.mobile-only {
  display: block;
}
@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}

/* 仅在桌面端显示 */
.desktop-only {
  display: none;
}
@media (min-width: 768px) {
  .desktop-only {
    display: block;
  }
}
```

## 实战：响应式卡片布局

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 16px;
}

.card h3 {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  margin: 0 0 8px;
}

.card p {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: #666;
}
```

## 响应式设计原则

1. 📱 **移动优先** - 从小屏开始设计，逐步增强
2. 📏 **使用相对单位** - rem、em、vw、% 代替固定像素
3. 🖼️ **弹性图片** - `max-width: 100%` 让图片自适应
4. 🎨 **断点合理** - 根据内容而非设备设置断点
5. ✋ **触控友好** - 按钮最小 44×44px，间距足够
6. ⚡ **性能优先** - 小屏加载小图，按需加载资源
