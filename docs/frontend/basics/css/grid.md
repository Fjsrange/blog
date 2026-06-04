---
title: Grid 布局
---

# Grid 布局

CSS Grid 是二维布局系统，可以同时控制行和列，是构建复杂布局的强大工具。

## 基本概念

```
┌───┬───┬───┬───┐  ← 行线
│   │   │   │   │
├───┼───┼───┼───┤
│   │   │   │   │
├───┼───┼───┼───┤
│   │   │   │   │
└───┴───┴───┴───┘
↑   ↑   ↑   ↑
列线（网格线）
```

## 容器属性

### 定义网格

```css
.container {
  display: grid;
  display: inline-grid;

  /* 定义列 */
  grid-template-columns: 200px 200px 200px;       /* 三列固定宽度 */
  grid-template-columns: 1fr 1fr 1fr;              /* 三列等分 */
  grid-template-columns: repeat(3, 1fr);            /* 同上，简写 */
  grid-template-columns: 200px 1fr 200px;           /* 固定-自适应-固定 */
  grid-template-columns: repeat(auto-fill, 200px);  /* 自动填充 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 自适应 */

  /* 定义行 */
  grid-template-rows: 60px 1fr 60px;  /* 头部-主体-底部 */

  /* 间距 */
  gap: 16px;
  row-gap: 16px;
  column-gap: 24px;
}
```

### grid-template-areas 区域命名

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px 1fr 60px;
  grid-template-areas:
    "header header  header"
    "left   content right"
    "footer footer  footer";
}

.header  { grid-area: header; }
.left    { grid-area: left; }
.content { grid-area: content; }
.right   { grid-area: right; }
.footer  { grid-area: footer; }
```

### 对齐方式

```css
.container {
  /* 所有项目在网格中的对齐 */
  justify-items: start | end | center | stretch;  /* 水平 */
  align-items: start | end | center | stretch;    /* 垂直 */
  place-items: center;  /* align-items justify-items 简写 */

  /* 网格在容器中的对齐 */
  justify-content: start | end | center | stretch | space-between | space-around | space-evenly;
  align-content: start | end | center | stretch | space-between | space-around | space-evenly;
  place-content: center;  /* 简写 */
}
```

## 项目属性

### 基于网格线定位

```css
.item {
  /* 起止线 */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;

  /* 简写 */
  grid-column: 1 / 3;      /* 从第1条列线到第3条列线 */
  grid-row: 1 / 3;          /* 从第1条行线到第3条行线 */

  /* span 关键字 */
  grid-column: 1 / span 2;  /* 从第1条线开始，跨2列 */
  grid-row: span 2;          /* 跨2行 */
}
```

### grid-area 简写

```css
.item {
  /* grid-row-start / grid-column-start / grid-row-end / grid-column-end */
  grid-area: 1 / 1 / 3 / 3;

  /* 或使用区域名 */
  grid-area: header;
}
```

### 单独对齐

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
  place-self: center;  /* 简写 */
}
```

## 常见布局实例

### 响应式网格

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
```

### 经典页面布局

```css
.page {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr 48px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}

.page .header  { grid-area: header; }
.page .sidebar { grid-area: sidebar; }
.page .main    { grid-area: main; }
.page .footer  { grid-area: footer; }
```

### 瀑布流布局

```css
.masonry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 10px;
  gap: 16px;
}

.masonry .item:nth-child(3n+1) { grid-row: span 20; }
.masonry .item:nth-child(3n+2) { grid-row: span 25; }
.masonry .item:nth-child(3n)   { grid-row: span 15; }
```

### 12列栅格系统

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}

.col-6  { grid-column: span 6; }   /* 半宽 */
.col-4  { grid-column: span 4; }   /* 三分之一 */
.col-3  { grid-column: span 3; }   /* 四分之一 */
.col-8  { grid-column: span 8; }   /* 三分之二 */
.col-12 { grid-column: span 12; }  /* 全宽 */
```

## Grid vs Flexbox 选择指南

| 特性 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维（行或列） | 二维（行和列） |
| 适用场景 | 导航栏、工具栏、单行/列布局 | 页面整体布局、复杂网格 |
| 内容驱动 | 根据内容自适应 | 根据布局定义位置 |
| 弹性 | 更灵活 | 更规整 |

> 💡 **经验法则**：一维布局用 Flexbox，二维布局用 Grid。两者可以嵌套使用！
