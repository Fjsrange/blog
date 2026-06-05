---
title: SVG 图形
---

# SVG 图形

SVG（Scalable Vector Graphics）是一种基于 XML 的矢量图形格式，可以通过 CSS 和 JavaScript 进行样式控制和交互操作。

## SVG 基础

```html
<!-- SVG 基本结构 -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <!-- viewBox 定义坐标系 -->
  <svg viewBox="0 0 400 300">
    <!-- 图形元素 -->
  </svg>
</svg>

<!-- 内联 SVG -->
<svg viewBox="0 0 100 100" class="icon">
  <circle cx="50" cy="50" r="40" fill="steelblue" />
</svg>

<!-- 外部引用 -->
<img src="logo.svg" alt="Logo">
<object data="chart.svg" type="image/svg+xml"></object>
```

## 基本图形

```html
<svg viewBox="0 0 500 400">
  <!-- 矩形 -->
  <rect x="10" y="10" width="100" height="60" rx="8" ry="8"
        fill="#5470c6" stroke="#3b5998" stroke-width="2" />

  <!-- 圆形 -->
  <circle cx="200" cy="40" r="30" fill="#91cc75" />

  <!-- 椭圆 -->
  <ellipse cx="320" cy="40" rx="50" ry="25" fill="#fac858" />

  <!-- 线条 -->
  <line x1="10" y1="100" x2="100" y2="150"
        stroke="#333" stroke-width="2" stroke-linecap="round" />

  <!-- 折线 -->
  <polyline points="120,100 150,130 180,110 210,140"
            fill="none" stroke="#ee6666" stroke-width="2" />

  <!-- 多边形 -->
  <polygon points="250,100 280,150 220,150"
           fill="#73c0de" stroke="#5470c6" />

  <!-- 路径（最强大） -->
  <path d="M 300 100 L 350 130 L 320 150 Z"
        fill="#fc8452" stroke="#333" stroke-width="1" />
</svg>
```

## Path 路径命令

```
M x y    - 移动到（moveto）
L x y    - 直线到（lineto）
H x      - 水平线到
V y      - 垂直线到
C x1 y1, x2 y2, x y  - 三次贝塞尔曲线
S x2 y2, x y          - 平滑三次贝塞尔
Q x1 y1, x y          - 二次贝塞尔曲线
T x y                  - 平滑二次贝塞尔
A rx ry, rotation, large-arc, sweep, x y  - 弧线
Z        - 闭合路径

小写字母表示相对坐标
```

```html
<!-- 曲线路径示例 -->
<svg viewBox="0 0 400 200">
  <!-- 二次贝塞尔 -->
  <path d="M 10 100 Q 200 -50 390 100"
        fill="none" stroke="blue" stroke-width="2" />

  <!-- 三次贝塞尔 -->
  <path d="M 10 150 C 100 50, 300 250, 390 150"
        fill="none" stroke="red" stroke-width="2" />

  <!-- 弧线 -->
  <path d="M 50 100 A 80 50 0 1 1 250 100"
        fill="none" stroke="green" stroke-width="2" />
</svg>
```

## 文本

```html
<svg viewBox="0 0 400 200">
  <!-- 基本文本 -->
  <text x="50" y="50" font-size="24" fill="#333">
    Hello SVG
  </text>

  <!-- 文本对齐 -->
  <text x="200" y="100" text-anchor="middle" dominant-baseline="middle"
        font-size="20" fill="#666">
    居中文本
  </text>

  <!-- 多行文本 -->
  <text x="50" y="140" font-size="16">
    <tspan x="50" dy="0">第一行</tspan>
    <tspan x="50" dy="1.5em">第二行</tspan>
    <tspan x="50" dy="1.5em">第三行</tspan>
  </text>

  <!-- 沿路径文本 -->
  <defs>
    <path id="curve" d="M 50 180 Q 200 120 350 180" />
  </defs>
  <text font-size="14" fill="purple">
    <textPath href="#curve">沿曲线排列的文本</textPath>
  </text>
</svg>
```

## 渐变与图案

```html
<svg viewBox="0 0 400 200">
  <defs>
    <!-- 线性渐变 -->
    <linearGradient id="linearGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5470c6" />
      <stop offset="100%" stop-color="#91cc75" />
    </linearGradient>

    <!-- 径向渐变 -->
    <radialGradient id="radialGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fac858" />
      <stop offset="100%" stop-color="#ee6666" />
    </radialGradient>

    <!-- 图案 -->
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="3" fill="#ccc" />
    </pattern>
  </defs>

  <rect x="10" y="10" width="180" height="80" fill="url(#linearGrad)" rx="8" />
  <rect x="210" y="10" width="180" height="80" fill="url(#radialGrad)" rx="8" />
  <rect x="10" y="110" width="380" height="80" fill="url(#dots)" rx="8" />
</svg>
```

## 滤镜

```html
<svg viewBox="0 0 400 200">
  <defs>
    <!-- 高斯模糊 -->
    <filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>

    <!-- 阴影 -->
    <filter id="shadow">
      <feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.3)" />
    </filter>

    <!-- 发光效果 -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <circle cx="100" cy="100" r="40" fill="steelblue" filter="url(#shadow)" />
  <circle cx="250" cy="100" r="40" fill="#91cc75" filter="url(#glow)" />
</svg>
```

## CSS 动画

```html
<svg viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="40" fill="steelblue" class="pulse" />
</svg>

<style>
.pulse {
  animation: pulse 2s ease-in-out infinite;
  transform-origin: center;
}

@keyframes pulse {
  0%, 100% { r: 40; opacity: 1; }
  50% { r: 50; opacity: 0.7; }
}

/* SVG 特有 CSS 属性 */
.rect {
  fill: steelblue;
  stroke: #333;
  stroke-width: 2;
  stroke-dasharray: 10 5;     /* 虚线 */
  stroke-dashoffset: 0;
  animation: dash 2s linear infinite;
}

@keyframes dash {
  to { stroke-dashoffset: -30; }
}
</style>
```

## SMIL 动画

```html
<svg viewBox="0 0 400 200">
  <!-- 属性动画 -->
  <circle cx="50" cy="100" r="20" fill="steelblue">
    <animate attributeName="cx" from="50" to="350"
             dur="3s" repeatCount="indefinite" />
    <animate attributeName="r" values="20;30;20"
             dur="3s" repeatCount="indefinite" />
  </circle>

  <!-- 变换动画 -->
  <rect x="170" y="80" width="40" height="40" fill="#91cc75">
    <animateTransform attributeName="transform" type="rotate"
                      from="0 190 100" to="360 190 100"
                      dur="3s" repeatCount="indefinite" />
  </rect>

  <!-- 路径动画 -->
  <circle r="8" fill="#ee6666">
    <animateMotion dur="4s" repeatCount="indefinite"
                   path="M 50 150 Q 200 50 350 150" />
  </circle>
</svg>
```

## JavaScript 操作 SVG

```javascript
// 创建 SVG 元素（注意命名空间）
const ns = 'http://www.w3.org/2000/svg';
const circle = document.createElementNS(ns, 'circle');
circle.setAttribute('cx', 100);
circle.setAttribute('cy', 100);
circle.setAttribute('r', 40);
circle.setAttribute('fill', 'steelblue');
svg.appendChild(circle);

// 修改属性
circle.setAttribute('r', 50);
circle.style.fill = 'red';

// 事件监听
circle.addEventListener('click', (e) => {
  console.log('点击了圆形');
});

circle.addEventListener('mouseenter', () => {
  circle.setAttribute('r', 50);
});
circle.addEventListener('mouseleave', () => {
  circle.setAttribute('r', 40);
});
```

## 下一步

- 🚀 [高级进阶](/frontend/advanced/senior/) - 前端高级知识
- 📦 [模块化工程](/frontend/advanced/modules/) - 工程化实践
- 🧠 [核心概念](/frontend/concepts/) - 前端核心概念
