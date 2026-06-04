---
title: CSS 动画与过渡
---

# CSS 动画与过渡

CSS 动画让页面元素从静态变为动态，提升用户体验和视觉吸引力。

## 过渡 Transition

过渡用于元素从一种样式平滑变化到另一种样式。

### 基本语法

```css
.element {
  transition: property duration timing-function delay;
}
```

| 属性 | 说明 | 示例 |
|------|------|------|
| `transition-property` | 过渡属性 | `all`, `opacity`, `transform` |
| `transition-duration` | 过渡时长 | `0.3s`, `300ms` |
| `transition-timing-function` | 缓动函数 | `ease`, `linear`, `ease-in-out` |
| `transition-delay` | 延迟时间 | `0.1s` |

### 示例

```css
.button {
  background: #646cff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.button:hover {
  background: #535bf2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.4);
}
```

### 多属性过渡

```css
.card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease 0.1s,
    opacity 0.2s ease;
}
```

### 缓动函数

```css
/* 预设 */
transition-timing-function: ease;          /* 默认，快-慢 */
transition-timing-function: linear;        /* 匀速 */
transition-timing-function: ease-in;       /* 慢-快 */
transition-timing-function: ease-out;      /* 快-慢 */
transition-timing-function: ease-in-out;   /* 慢-快-慢 */

/* 贝塞尔曲线 */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 弹性效果 */

/* 步进 */
transition-timing-function: steps(4, end); /* 分4步完成 */
```

## 关键帧动画 Animation

### 基本语法

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 或使用百分比 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

### animation 属性

```css
.element {
  animation: name duration timing-function delay iteration-count direction fill-mode play-state;
}
```

| 属性 | 说明 | 示例 |
|------|------|------|
| `animation-name` | 动画名 | `fadeIn` |
| `animation-duration` | 持续时长 | `1s`, `500ms` |
| `animation-timing-function` | 缓动函数 | `ease`, `linear` |
| `animation-delay` | 延迟 | `0.5s` |
| `animation-iteration-count` | 循环次数 | `1`, `infinite` |
| `animation-direction` | 方向 | `normal`, `alternate` |
| `animation-fill-mode` | 填充模式 | `forwards`, `backwards` |
| `animation-play-state` | 播放状态 | `running`, `paused` |

### 实用动画示例

#### 淡入

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}
```

#### 从下滑入

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.6s ease forwards;
}
```

#### 弹跳

```css
@keyframes bounce {
  0%, 20%, 53%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateY(0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translateY(-30px);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translateY(-15px);
  }
  80% {
    transform: translateY(0);
  }
  90% {
    transform: translateY(-4px);
  }
}

.bounce {
  animation: bounce 1s ease infinite;
}
```

#### 旋转加载

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e5e5;
  border-top-color: #646cff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

#### 脉冲

```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

## Transform 变换

### 2D 变换

```css
.element {
  /* 平移 */
  transform: translate(50px, 30px);
  transform: translateX(50px);
  transform: translateY(30px);

  /* 旋转 */
  transform: rotate(45deg);

  /* 缩放 */
  transform: scale(1.5);
  transform: scaleX(2);
  transform: scaleY(0.5);

  /* 倾斜 */
  transform: skew(15deg, 5deg);
  transform: skewX(15deg);

  /* 组合 */
  transform: translate(50px, 0) rotate(45deg) scale(1.2);
}
```

### 3D 变换

```css
.element {
  /* 透视 */
  perspective: 1000px;

  /* 3D 旋转 */
  transform: rotateX(45deg);
  transform: rotateY(45deg);
  transform: rotateZ(45deg);

  /* 3D 平移 */
  transform: translateZ(100px);

  /* 3D 缩放 */
  transform: scaleZ(2);

  /* 保持 3D */
  transform-style: preserve-3d;

  /* 背面可见性 */
  backface-visibility: hidden;
}
```

## 性能优化

### 使用 GPU 加速属性

```css
/* ✅ 推荐：触发 GPU 加速 */
transform: translateX(0);
opacity: 1;

/* ❌ 避免：触发重排 */
left: 100px;
top: 50px;
width: 200px;
height: 100px;
```

### will-change 提示

```css
.element {
  will-change: transform, opacity;
}
```

> ⚠️ 不要滥用 `will-change`，只在需要时使用，动画结束后移除。

### 最佳实践

1. ✅ 优先使用 `transform` 和 `opacity` 做动画
2. ✅ 避免在动画中修改 `width`、`height`、`margin` 等触发重排的属性
3. ✅ 复杂动画使用 `will-change` 提示浏览器
4. ✅ 尊重用户偏好：`@media (prefers-reduced-motion: reduce)`
5. ✅ 控制动画时长在 0.2s ~ 0.5s 之间
