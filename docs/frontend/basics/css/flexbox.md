---
title: Flexbox 布局
---

# Flexbox 布局

Flexbox（弹性盒模型）是 CSS3 中的一维布局模型，非常适合处理行或列方向的布局。

## 基本概念

```
┌──────────────────────────────────────────┐
│              main axis (主轴) →           │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │      │  │      │  │      │  ← item   │
│  │ item │  │ item │  │ item │           │
│  │      │  │      │  │      │           │
│  └──────┘  └──────┘  └──────┘           │
│         cross axis (交叉轴) ↓            │
└──────────────────────────────────────────┘
```

## 容器属性

### display: flex

```css
.container {
  display: flex;         /* 块级弹性容器 */
  display: inline-flex;  /* 行内弹性容器 */
}
```

### flex-direction 主轴方向

```css
.container {
  flex-direction: row;            /* 水平（默认）→ */
  flex-direction: row-reverse;    /* 水平反转 ← */
  flex-direction: column;         /* 垂直 ↓ */
  flex-direction: column-reverse; /* 垂直反转 ↑ */
}
```

### flex-wrap 换行

```css
.container {
  flex-wrap: nowrap;  /* 不换行（默认）*/
  flex-wrap: wrap;    /* 换行 */
  flex-wrap: wrap-reverse; /* 反向换行 */
}
```

### justify-content 主轴对齐

```css
.container {
  justify-content: flex-start;    /* 起点对齐（默认）*/
  justify-content: flex-end;      /* 终点对齐 */
  justify-content: center;        /* 居中对齐 */
  justify-content: space-between; /* 两端对齐，中间等距 */
  justify-content: space-around;  /* 每项两侧等距 */
  justify-content: space-evenly;  /* 完全均匀分布 */
}
```

### align-items 交叉轴对齐

```css
.container {
  align-items: stretch;    /* 拉伸填满（默认）*/
  align-items: flex-start; /* 起点对齐 */
  align-items: flex-end;   /* 终点对齐 */
  align-items: center;     /* 居中对齐 */
  align-items: baseline;   /* 文字基线对齐 */
}
```

### align-content 多行对齐

```css
.container {
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  align-content: stretch; /* 默认 */
}
```

### gap 间距

```css
.container {
  gap: 16px;            /* 行列间距相同 */
  row-gap: 16px;        /* 行间距 */
  column-gap: 24px;     /* 列间距 */
  gap: 16px 24px;       /* 行间距 列间距 */
}
```

## 项目属性

### flex-grow 放大比例

```css
.item {
  flex-grow: 0;  /* 不放大（默认）*/
  flex-grow: 1;  /* 等比例放大 */
  flex-grow: 2;  /* 放大比例为其他项的2倍 */
}
```

### flex-shrink 缩小比例

```css
.item {
  flex-shrink: 1;  /* 等比缩小（默认）*/
  flex-shrink: 0;  /* 不缩小 */
}
```

### flex-basis 初始大小

```css
.item {
  flex-basis: auto;   /* 根据内容（默认）*/
  flex-basis: 200px;  /* 固定初始大小 */
  flex-basis: 30%;    /* 百分比 */
}
```

### flex 简写

```css
.item {
  flex: 0 1 auto;   /* 默认：不放大 等比缩小 自动大小 */
  flex: 1;           /* 等同于 flex: 1 1 0% */
  flex: auto;        /* 等同于 flex: 1 1 auto */
  flex: none;        /* 等同于 flex: 0 0 auto */
  flex: 0 0 200px;   /* 固定 200px，不放大不缩小 */
}
```

### align-self 单独对齐

```css
.item {
  align-self: auto;       /* 继承 align-items */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: stretch;
  align-self: baseline;
}
```

### order 排列顺序

```css
.item {
  order: 0;   /* 默认 */
  order: -1;  /* 排在前面 */
  order: 1;   /* 排在后面 */
}
```

## 常见布局实例

### 水平垂直居中

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 经典导航栏

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
}

.navbar .logo { flex-shrink: 0; }
.navbar .links { display: flex; gap: 16px; }
```

### 等分布局

```css
.equal-columns {
  display: flex;
  gap: 16px;
}

.equal-columns > .col {
  flex: 1; /* 每列等宽 */
}
```

### 侧边栏 + 主内容

```css
.layout {
  display: flex;
  gap: 24px;
}

.sidebar {
  flex: 0 0 240px; /* 固定 240px */
}

.main-content {
  flex: 1; /* 占据剩余空间 */
}
```

### 圣杯布局

```css
.holy-grail {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.holy-grail .header,
.holy-grail .footer {
  flex-shrink: 0;
}

.holy-grail .body {
  display: flex;
  flex: 1;
}

.holy-grail .sidebar-left { flex: 0 0 200px; }
.holy-grail .content { flex: 1; }
.holy-grail .sidebar-right { flex: 0 0 150px; }
```
