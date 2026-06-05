---
title: 事件机制
---

# 事件机制

事件是 JavaScript 与用户交互的核心机制，理解事件的传播、监听和处理是前端开发的基本功。

## 事件监听

```javascript
const btn = document.querySelector('#btn');

// 方式一：addEventListener（推荐）
btn.addEventListener('click', handleClick);

// 方式二：DOM 属性（只能绑定一个）
btn.onclick = handleClick;

// 方式三：HTML 属性（不推荐）
// <button onclick="handleClick()">

// 移除监听
btn.removeEventListener('click', handleClick);

// 注意：移除时必须引用同一个函数
btn.addEventListener('click', () => {}); // ❌ 无法移除匿名函数

function handleClick() {}
btn.addEventListener('click', handleClick); // ✅
btn.removeEventListener('click', handleClick); // ✅
```

### 事件监听选项

```javascript
// 第三个参数可以是选项对象
el.addEventListener('click', handler, {
  capture: false,  // 是否在捕获阶段触发
  once: true,      // 只触发一次后自动移除
  passive: true,   // 声明不会调用 preventDefault（优化滚动性能）
});

// 常见用法
// once - 只执行一次
el.addEventListener('click', handler, { once: true });

// passive - 提升滚动性能
el.addEventListener('touchstart', handler, { passive: true });
el.addEventListener('wheel', handler, { passive: true });
```

## 事件流

事件传播分为三个阶段：**捕获 → 目标 → 冒泡**

```
                    捕获阶段 ↓
        ┌──────────────────────────┐
        │        document          │
        │    ┌──────────────┐      │
        │    │    html      │      │
        │    │  ┌────────┐  │      │
        │    │  │  body  │  │      │
        │    │  │ ┌────┐ │  │      │
        │    │  │ │ div│ │  │      │ ← 目标阶段
        │    │  │ └────┘ │  │      │
        │    │  └────────┘  │      │
        │    └──────────────┘      │
        └──────────────────────────┘
                    冒泡阶段 ↑
```

```javascript
// 捕获阶段监听
document.addEventListener('click', () => {
  console.log('1. document 捕获');
}, true);

// 冒泡阶段监听（默认）
document.addEventListener('click', () => {
  console.log('4. document 冒泡');
}, false);

// 输出顺序：1 → 2 → 3（目标） → 4
```

## 事件对象

```javascript
el.addEventListener('click', (event) => {
  // 事件类型
  event.type; // 'click'

  // 事件目标
  event.target;          // 触发事件的元素（最内层）
  event.currentTarget;   // 绑定事件的元素（当前处理函数的元素）

  // 阻止默认行为
  event.preventDefault();

  // 阻止事件传播
  event.stopPropagation();      // 阻止冒泡和捕获
  event.stopImmediatePropagation(); // 阻止同元素的其他监听器

  // 鼠标坐标
  event.clientX;  // 相对视口
  event.clientY;
  event.pageX;    // 相对文档
  event.pageY;
  event.offsetX;  // 相对目标元素
  event.offsetY;

  // 键盘事件
  event.key;      // 'Enter', 'Escape', 'a'
  event.code;     // 'KeyA', 'Enter'
  event.ctrlKey;  // Ctrl 是否按下
  event.shiftKey;
  event.altKey;
  event.metaKey;  // Meta/Command 键
});
```

## 事件委托

利用事件冒泡机制，将子元素的事件监听委托给父元素处理。

```javascript
// ❌ 为每个按钮绑定事件（性能差）
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// ✅ 事件委托 - 在父元素上监听
document.querySelector('.btn-group').addEventListener('click', (e) => {
  // 判断点击的是否为按钮
  if (e.target.classList.contains('btn')) {
    handleClick(e);
  }

  // 更精确：使用 matches 选择器
  if (e.target.matches('.btn')) {
    const action = e.target.dataset.action;
    switch (action) {
      case 'save': save(); break;
      case 'delete': deleteItem(); break;
    }
  }

  // 查找最近的匹配元素
  const btn = e.target.closest('.btn');
  if (btn) {
    handleClick({ ...e, target: btn });
  }
});
```

### 事件委托的优势

| 优势 | 说明 |
|------|------|
| 减少内存消耗 | 只需一个事件监听器 |
| 动态元素支持 | 新增子元素自动生效 |
| 代码更简洁 | 统一管理事件处理 |

## 常用事件类型

### 鼠标事件

```javascript
el.addEventListener('click', handler);       // 点击
el.addEventListener('dblclick', handler);     // 双击
el.addEventListener('mouseenter', handler);   // 鼠标进入（不冒泡）
el.addEventListener('mouseleave', handler);   // 鼠标离开（不冒泡）
el.addEventListener('mouseover', handler);    // 鼠标移入（冒泡）
el.addEventListener('mouseout', handler);     // 鼠标移出（冒泡）
el.addEventListener('mousemove', handler);    // 鼠标移动
el.addEventListener('mousedown', handler);    // 鼠标按下
el.addEventListener('mouseup', handler);      // 鼠标释放
el.addEventListener('contextmenu', handler);  // 右键菜单
```

### 键盘事件

```javascript
el.addEventListener('keydown', (e) => {
  console.log(e.key); // 按下的键
  if (e.key === 'Enter') submitForm();
  if (e.ctrlKey && e.key === 's') saveFile(); // Ctrl+S
});

el.addEventListener('keyup', handler);   // 键释放
el.addEventListener('keypress', handler); // 字符输入（已废弃）
```

### 表单事件

```javascript
const input = document.querySelector('input');

input.addEventListener('input', (e) => {
  console.log('实时输入:', e.target.value);
});

input.addEventListener('change', (e) => {
  console.log('值改变:', e.target.value);
});

input.addEventListener('focus', () => {
  console.log('获得焦点');
});

input.addEventListener('blur', () => {
  console.log('失去焦点');
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // 阻止默认提交
  // 手动处理表单数据
  const formData = new FormData(form);
});
```

### 滚动与窗口事件

```javascript
// 滚动事件（建议节流）
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const isBottom = scrollY + window.innerHeight >= document.body.scrollHeight;
});

// 窗口大小变化（建议防抖）
window.addEventListener('resize', () => {
  console.log(window.innerWidth, window.innerHeight);
});

// IntersectionObserver（推荐替代滚动监听）
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('元素进入视口:', entry.target);
    }
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.target'));
```

## 自定义事件

```javascript
// 创建自定义事件
const event = new CustomEvent('userLogin', {
  detail: { userId: 123, name: '张三' },
  bubbles: true,
});

// 监听自定义事件
document.addEventListener('userLogin', (e) => {
  console.log('用户登录:', e.detail);
});

// 触发自定义事件
document.dispatchEvent(event);

// 实际应用：组件间通信
class EventBus {
  #events = new Map();

  on(event, handler) {
    if (!this.#events.has(event)) this.#events.set(event, []);
    this.#events.get(event).push(handler);
  }

  off(event, handler) {
    const handlers = this.#events.get(event);
    if (handlers) {
      this.#events.set(event, handlers.filter(h => h !== handler));
    }
  }

  emit(event, data) {
    this.#events.get(event)?.forEach(handler => handler(data));
  }
}

const bus = new EventBus();
bus.on('themeChange', (theme) => console.log('主题切换:', theme));
bus.emit('themeChange', 'dark');
```

## 下一步

- ⚡ [Vue2 基础入门](/frontend/frameworks/vue2/) - 学习 Vue 框架
- 🔥 [React 基础入门](/frontend/frameworks/react/) - 学习 React 框架
- 🧠 [浏览器原理](/frontend/concepts/browser) - 深入理解浏览器
