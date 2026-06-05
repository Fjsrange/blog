---
title: 浏览器原理
---

# 浏览器原理

理解浏览器的工作原理，是写出高性能前端代码的基础。从多进程架构到渲染流程，从事件循环到垃圾回收，每一个环节都影响着页面的表现。

## 浏览器多进程架构

```
浏览器
├── 浏览器主进程（Browser Process）
│   ├── 地址栏、书签、前进/后退
│   ├── 网络资源管理
│   └── 子进程管理
├── 渲染进程（Renderer Process）⭐
│   ├── DOM 解析
│   ├── CSS 解析
│   ├── JavaScript 执行（V8）
│   └── 页面渲染
├── GPU 进程（GPU Process）
│   └── 3D CSS、Canvas、视频解码
├── 网络进程（Network Process）
│   └── 网络请求处理
└── 插件进程（Plugin Process）
    └── 每个插件一个进程
```

> 每个 Tab 页对应一个渲染进程（同站点可能合并）

## 渲染流程

```
1. 解析 HTML → DOM Tree
2. 解析 CSS → CSSOM Tree
3. 合并 → Render Tree（渲染树）
4. Layout（布局/回流）→ 计算几何信息
5. Paint（绘制/重绘）→ 填充像素
6. Composite（合成）→ 分层合成显示
```

### DOM 树构建

```html
<html>
  <head>
    <title>示例</title>
  </head>
  <body>
    <div class="container">
      <h1>标题</h1>
      <p>段落</p>
    </div>
  </body>
</html>

<!-- DOM 树 -->
html
├── head
│   └── title
└── body
    └── div.container
        ├── h1
        └── p
```

### CSSOM 树构建

```css
body { font-size: 16px; }
.container { width: 800px; margin: 0 auto; }
h1 { font-size: 2em; color: #333; }
p { line-height: 1.6; }
```

### 渲染树

```
渲染树 = DOM + CSSOM（不包含不可见元素）
- 排除 <head>、<script>、<style> 等
- 排除 display: none 的元素
- 包含 visibility: hidden 的元素（占空间）
```

### 布局与绘制

```
Layout（回流/重排）：计算元素的位置和大小
  触发：添加/删除元素、改变尺寸、改变位置...

Paint（重绘）：将元素绘制到屏幕
  触发：改变颜色、背景、阴影等外观属性

Composite（合成）：将多个图层合成
  transform、opacity 只触发合成，性能最优
```

## 回流与重绘

### 触发回流（Layout）

```javascript
// 修改几何属性
element.style.width = '200px';
element.style.height = '100px';
element.style.margin = '10px';
element.style.padding = '10px';
element.style.display = 'none';
element.style.position = 'absolute';

// DOM 操作
document.body.appendChild(newElement);
element.removeChild(child);

// 读取布局信息（强制同步布局）
element.offsetWidth;
element.offsetHeight;
element.clientWidth;
element.getBoundingClientRect();
```

### 触发重绘（Paint）

```javascript
// 修改外观属性（不影响布局）
element.style.color = 'red';
element.style.backgroundColor = '#fff';
element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
element.style.borderRadius = '8px';
element.style.visibility = 'hidden';
```

### 优化策略

```javascript
// ❌ 读写交替（强制同步布局）
element.style.width = '100px';
console.log(element.offsetWidth); // 强制布局
element.style.height = '200px';
console.log(element.offsetHeight); // 再次强制布局

// ✅ 批量读写分离
element.style.width = '100px';
element.style.height = '200px';
console.log(element.offsetWidth); // 只触发一次布局
console.log(element.offsetHeight);

// ✅ 使用 transform 代替 top/left
// ❌ element.style.left = x + 'px';
// ✅ element.style.transform = `translateX(${x}px)`;

// ✅ 使用 class 切换
element.className = 'active'; // 一次性应用所有样式

// ✅ 使用 DocumentFragment
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  fragment.appendChild(li);
});
list.appendChild(fragment); // 只触发一次回流
```

## 事件循环

```javascript
// 完整的事件循环流程
// 1. 执行同步代码（调用栈）
// 2. 微任务队列清空
// 3. 渲染（如果需要）
// 4. 取一个宏任务执行
// 5. 微任务队列清空
// 6. 渲染（如果需要）
// 7. 回到第4步

// 宏任务
setTimeout / setInterval
I/O 操作
UI 渲染
requestAnimationFrame

// 微任务
Promise.then / catch / finally
MutationObserver
queueMicrotask
```

```javascript
// 经典面试题
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => console.log('5'), 0);
});

console.log('6');

// 输出：1 → 6 → 4 → 2 → 3 → 5
```

## 垃圾回收

```javascript
// V8 垃圾回收策略

// 1. 新生代（Scavenge 算法）
// - 短生命周期对象
// - From → To 空间交换
// - 晋升条件：存活过一次 Scavenge 或 To 空间使用超过 25%

// 2. 老生代（标记清除 + 标记整理）
// - 长生命周期对象
// - 标记清除：标记可达对象，清除未标记对象
// - 标记整理：解决内存碎片问题

// 3. 增量标记（优化）
// - 将长停顿拆分为多个小步骤
// - 与 JS 交替执行，减少卡顿

// 内存泄漏常见场景
// ❌ 未清除的定时器
const timer = setInterval(() => { /* ... */ }, 1000);
// 忘记 clearInterval(timer);

// ❌ 未移除的事件监听
element.addEventListener('click', handler);
// 忘记 removeEventListener

// ❌ 闭包引用
function createLeak() {
  const hugeData = new Array(1000000);
  return function() {
    console.log(hugeData.length); // hugeData 无法释放
  };
}

// ❌ DOM 引用
const elements = {};
document.getElementById('button').onclick = function() {
  elements.button = this; // 即使 DOM 删除，引用仍在
};
```

## 下一步

- 📡 [网络与 HTTP](/frontend/concepts/network) - 网络协议详解
- 🔧 [前端工程化](/frontend/concepts/engineering) - 工程化实践
- 🏗️ [微前端架构](/frontend/concepts/micro-frontend) - 微前端方案
