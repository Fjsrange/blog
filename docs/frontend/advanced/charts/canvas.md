---
title: Canvas 绘图
---

# Canvas 绘图

Canvas 是 HTML5 提供的 2D 绘图 API，通过 JavaScript 在画布上绘制图形，适用于游戏、图像处理、数据可视化等场景。

## 基础设置

```html
<canvas id="canvas" width="600" height="400"></canvas>
```

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸（高清屏适配）
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  return ctx;
}
```

## 绘制图形

```javascript
// 矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 50);      // 填充矩形
ctx.strokeStyle = 'blue';
ctx.strokeRect(120, 10, 100, 50);    // 描边矩形
ctx.clearRect(30, 20, 60, 30);       // 清除区域

// 圆形/弧形
ctx.beginPath();
ctx.arc(100, 150, 50, 0, Math.PI * 2); // 完整圆
ctx.fill();

ctx.beginPath();
ctx.arc(250, 150, 50, 0, Math.PI);     // 半圆
ctx.stroke();

// 椭圆
ctx.beginPath();
ctx.ellipse(400, 150, 60, 30, 0, 0, Math.PI * 2);
ctx.fill();

// 圆角矩形
ctx.beginPath();
ctx.roundRect(10, 220, 150, 80, 10);
ctx.fill();

// 三角形
ctx.beginPath();
ctx.moveTo(200, 220);
ctx.lineTo(280, 300);
ctx.lineTo(120, 300);
ctx.closePath();
ctx.fill();
```

## 路径

```javascript
// 基本路径
ctx.beginPath();
ctx.moveTo(50, 50);       // 起点
ctx.lineTo(150, 50);      // 直线到
ctx.lineTo(100, 150);     // 直线到
ctx.closePath();           // 闭合路径
ctx.fillStyle = 'green';
ctx.fill();
ctx.strokeStyle = 'darkgreen';
ctx.lineWidth = 2;
ctx.stroke();

// 贝塞尔曲线
ctx.beginPath();
ctx.moveTo(50, 200);
ctx.quadraticCurveTo(150, 100, 250, 200); // 二次贝塞尔
ctx.stroke();

ctx.beginPath();
ctx.moveTo(50, 300);
ctx.bezierCurveTo(100, 200, 200, 400, 250, 300); // 三次贝塞尔
ctx.stroke();
```

## 样式与渐变

```javascript
// 线性渐变
const linearGrad = ctx.createLinearGradient(0, 0, 200, 0);
linearGrad.addColorStop(0, 'red');
linearGrad.addColorStop(0.5, 'yellow');
linearGrad.addColorStop(1, 'green');
ctx.fillStyle = linearGrad;
ctx.fillRect(10, 10, 200, 100);

// 径向渐变
const radialGrad = ctx.createRadialGradient(300, 60, 10, 300, 60, 80);
radialGrad.addColorStop(0, 'white');
radialGrad.addColorStop(1, 'blue');
ctx.fillStyle = radialGrad;
ctx.fillRect(220, 10, 160, 100);

// 阴影
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;

// 透明度
ctx.globalAlpha = 0.5;

// 线条样式
ctx.lineWidth = 3;
ctx.lineCap = 'round';     // 'butt' | 'round' | 'square'
ctx.lineJoin = 'round';    // 'miter' | 'round' | 'bevel'
ctx.setLineDash([5, 5]);   // 虚线
```

## 文本

```javascript
ctx.font = '24px Arial';
ctx.textAlign = 'center';     // 'left' | 'center' | 'right'
ctx.textBaseline = 'middle';  // 'top' | 'middle' | 'bottom'

ctx.fillStyle = 'black';
ctx.fillText('Hello Canvas', 300, 200);   // 填充文本

ctx.strokeStyle = 'red';
ctx.strokeText('描边文本', 300, 250);      // 描边文本

// 文本测量
const metrics = ctx.measureText('Hello');
metrics.width; // 文本宽度
```

## 图像操作

```javascript
// 绘制图片
const img = new Image();
img.onload = () => {
  ctx.drawImage(img, 10, 10);                    // 原始大小
  ctx.drawImage(img, 10, 10, 200, 150);          // 指定大小
  ctx.drawImage(img, 0, 0, 100, 100, 10, 10, 200, 200); // 裁剪绘制
};
img.src = 'photo.jpg';

// 获取/设置像素
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data; // RGBA 数组

// 遍历像素（灰度化）
for (let i = 0; i < data.length; i += 4) {
  const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
  data[i] = data[i + 1] = data[i + 2] = gray;
}
ctx.putImageData(imageData, 0, 0);
```

## 变换

```javascript
// 平移
ctx.translate(100, 100);

// 旋转
ctx.rotate(Math.PI / 4); // 45度

// 缩放
ctx.scale(2, 2);

// 变换矩阵
ctx.transform(1, 0, 0, 1, 0, 0); // 仿射变换

// 保存和恢复状态
ctx.save();   // 保存当前状态
ctx.translate(100, 100);
ctx.rotate(Math.PI / 4);
ctx.fillRect(-25, -25, 50, 50);
ctx.restore(); // 恢复到 save 时的状态
```

## 动画

```javascript
// requestAnimationFrame 动画循环
let x = 0;
let animationId;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制
  ctx.fillStyle = 'steelblue';
  ctx.fillRect(x, 150, 50, 50);

  // 更新位置
  x += 2;
  if (x > canvas.width) x = -50;

  animationId = requestAnimationFrame(animate);
}

animate();

// 停止动画
function stop() {
  cancelAnimationFrame(animationId);
}

// 帧率控制
let lastTime = 0;
const fps = 60;
const interval = 1000 / fps;

function animate(currentTime) {
  animationId = requestAnimationFrame(animate);
  const delta = currentTime - lastTime;
  if (delta < interval) return;
  lastTime = currentTime - (delta % interval);

  // 绘制逻辑...
}
```

## 事件交互

```javascript
// 获取鼠标在 Canvas 上的坐标
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 判断是否点击了某个图形
  if (isPointInCircle(x, y, circleX, circleY, radius)) {
    console.log('点击了圆形');
  }
});

// 拖拽
let isDragging = false;
let offsetX, offsetY;

canvas.addEventListener('mousedown', (e) => {
  const { x, y } = getMousePos(e);
  if (isPointInRect(x, y, rectX, rectY, rectW, rectH)) {
    isDragging = true;
    offsetX = x - rectX;
    offsetY = y - rectY;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const { x, y } = getMousePos(e);
  rectX = x - offsetX;
  rectY = y - offsetY;
  redraw();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
```

## 下一步

- 🖌️ [SVG 图形](/frontend/advanced/charts/svg) - SVG 进阶
- 🚀 [高级进阶](/frontend/advanced/senior/) - 前端高级知识
- 📦 [模块化工程](/frontend/advanced/modules/) - 工程化实践
