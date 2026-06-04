---
title: HTML5 新特性
---

# HTML5 新特性

HTML5 是 HTML 的第五个主要版本，引入了大量新特性，让 Web 应用更加强大。

## 语义化标签

HTML5 新增了多个语义化标签，让页面结构更清晰：

```html
<header>页面头部</header>
<nav>导航栏</nav>
<main>
  <article>独立文章</article>
  <section>内容分区</section>
  <aside>侧边栏</aside>
</main>
<footer>页面底部</footer>
```

## 多媒体

### 音频 `<audio>`

```html
<audio controls>
  <source src="music.mp3" type="audio/mpeg">
  <source src="music.ogg" type="audio/ogg">
  您的浏览器不支持 audio 标签。
</audio>
```

### 视频 `<video>`

```html
<video controls width="640" height="360" poster="cover.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持 video 标签。
</video>
```

## Canvas 画布

Canvas 提供了通过 JavaScript 绘制图形的能力：

```html
<canvas id="myCanvas" width="400" height="300"></canvas>

<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  // 绘制矩形
  ctx.fillStyle = '#646cff';
  ctx.fillRect(50, 50, 200, 100);

  // 绘制圆形
  ctx.beginPath();
  ctx.arc(300, 150, 50, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
</script>
```

## 本地存储

### localStorage

```javascript
// 存储数据
localStorage.setItem('username', '张三');

// 读取数据
const name = localStorage.getItem('username');

// 删除数据
localStorage.removeItem('username');

// 清空所有
localStorage.clear();
```

### sessionStorage

```javascript
// 用法与 localStorage 相同，区别在于：
// sessionStorage - 关闭浏览器后数据清除
// localStorage - 数据永久保存（除非手动清除）
```

## Web Workers

Web Workers 允许在后台线程中运行 JavaScript，不阻塞主线程：

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ command: 'start', data: [1, 2, 3] });

worker.onmessage = function(e) {
  console.log('计算结果:', e.data);
};

// worker.js
self.onmessage = function(e) {
  const result = e.data.data.reduce((sum, val) => sum + val, 0);
  self.postMessage(result);
};
```

## 地理定位

```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(`纬度: ${position.coords.latitude}`);
      console.log(`经度: ${position.coords.longitude}`);
    },
    (error) => {
      console.error('获取位置失败:', error.message);
    }
  );
}
```

## 拖放 API

```html
<div id="drag-item" draggable="true">拖拽我</div>
<div id="drop-zone">放置区域</div>

<script>
  const dragItem = document.getElementById('drag-item');
  const dropZone = document.getElementById('drop-zone');

  dragItem.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault(); // 允许放置
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    dropZone.appendChild(document.getElementById(id));
  });
</script>
```

## 新增表单特性

HTML5 为 `<input>` 新增了多种类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| `email` | 邮箱验证 | `<input type="email">` |
| `url` | URL 验证 | `<input type="url">` |
| `number` | 数字输入 | `<input type="number" min="0" max="100">` |
| `range` | 滑块 | `<input type="range">` |
| `date` | 日期选择 | `<input type="date">` |
| `color` | 颜色选择 | `<input type="color">` |
| `search` | 搜索框 | `<input type="search">` |

## 浏览器兼容性

使用 [Can I Use](https://caniuse.com/) 查询 HTML5 特性的浏览器支持情况。对于不支持的浏览器，可以使用 [Modernizr](https://modernizr.com/) 进行特性检测。
