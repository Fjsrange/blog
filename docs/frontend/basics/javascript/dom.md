---
title: DOM 操作
---

# DOM 操作

DOM（Document Object Model）是 JavaScript 与 HTML 页面交互的接口，通过 DOM 可以动态修改页面内容、结构和样式。

## DOM 树结构

```
document
  └── html
        ├── head
        │     ├── meta
        │     ├── title
        │     └── link / style
        └── body
              ├── header
              ├── main
              │     ├── section
              │     └── article
              └── footer
```

## 获取元素

```javascript
// 通过 ID 获取（唯一）
const el = document.getElementById('app');

// 通过选择器获取（第一个匹配）
const el = document.querySelector('.card');

// 通过选择器获取（所有匹配）
const items = document.querySelectorAll('.item'); // NodeList

// 通过标签名获取
const paragraphs = document.getElementsByTagName('p'); // HTMLCollection

// 通过类名获取
const cards = document.getElementsByClassName('card'); // HTMLCollection

// 推荐使用 querySelector / querySelectorAll
```

## 修改内容

```javascript
const el = document.querySelector('#app');

// 文本内容
el.textContent = '纯文本内容';        // 纯文本，不解析 HTML
el.innerText = '可见文本';            // 考虑样式，只获取可见文本

// HTML 内容
el.innerHTML = '<strong>加粗文本</strong>'; // 解析 HTML 标签

// 外部 HTML
el.outerHTML = '<div>替换整个元素</div>';

// value（表单元素）
const input = document.querySelector('input');
input.value = '默认值';
```

## 修改属性

```javascript
const img = document.querySelector('img');

// 标准属性
img.src = 'photo.jpg';
img.alt = '照片';
img.id = 'main-photo';

// 通用方法
img.getAttribute('src');           // 获取属性
img.setAttribute('src', 'new.jpg'); // 设置属性
img.removeAttribute('src');         // 移除属性
img.hasAttribute('src');            // 判断属性是否存在

// data-* 自定义属性
const el = document.querySelector('.card');
el.dataset.id = '123';       // data-id="123"
el.dataset.userName = '张三'; // data-user-name="张三"
el.dataset.id;                // "123"
```

## 修改样式

```javascript
const el = document.querySelector('.box');

// 行内样式
el.style.color = 'red';
el.style.backgroundColor = '#fff';
el.style.fontSize = '16px';
el.style.display = 'none';

// 多个样式
el.style.cssText = 'color: red; font-size: 16px;';

// 获取计算样式
const styles = getComputedStyle(el);
styles.width;   // "200px"
styles.color;   // "rgb(255, 0, 0)"

// class 操作
el.classList.add('active');       // 添加类名
el.classList.remove('hidden');    // 移除类名
el.classList.toggle('dark');      // 切换类名
el.classList.contains('active');  // 判断类名
el.classList.replace('old', 'new'); // 替换类名
```

## 创建与插入元素

```javascript
// 创建元素
const div = document.createElement('div');
div.textContent = '新元素';
div.classList.add('card');

// 插入元素
const parent = document.querySelector('.container');
parent.appendChild(div);                    // 末尾插入
parent.insertBefore(div, referenceNode);     // 参考节点前插入

// 新增方法
parent.append(div);                          // 末尾插入（支持字符串）
parent.prepend(div);                         // 开头插入
parent.before(div);                          // 前面插入
parent.after(div);                           // 后面插入

// 插入 HTML 字符串
parent.insertAdjacentHTML('beforeend', '<div>HTML</div>');
// 位置参数：beforebegin, afterbegin, beforeend, afterend

// 克隆元素
const clone = el.cloneNode(true); // true = 深拷贝（含子元素）
```

## 删除元素

```javascript
// 方法一：自己删除自己
el.remove();

// 方法二：父元素删除子元素
parent.removeChild(child);
```

## 遍历 DOM

```javascript
const el = document.querySelector('.item');

// 父节点
el.parentNode;
el.parentElement;

// 子节点
el.childNodes;      // 所有子节点（含文本、注释）
el.children;        // 仅元素子节点
el.firstChild;      // 第一个子节点
el.firstElementChild; // 第一个元素子节点
el.lastChild;
el.lastElementChild;

// 兄弟节点
el.nextSibling;          // 下一个兄弟节点
el.nextElementSibling;   // 下一个元素兄弟
el.previousSibling;
el.previousElementSibling;
```

## 获取尺寸与位置

```javascript
const el = document.querySelector('.box');

// 元素尺寸（含 padding）
el.clientWidth;   // 可视宽度
el.clientHeight;

// 元素尺寸（含 padding + border）
el.offsetWidth;
el.offsetHeight;

// 元素尺寸（含 padding + border + 滚动条区域）
el.scrollWidth;
el.scrollHeight;

// 元素位置（相对视口）
el.getBoundingClientRect();
// { top, right, bottom, left, width, height, x, y }

// 滚动位置
el.scrollTop;     // 已滚动的距离
el.scrollLeft;

window.scrollY;   // 页面滚动距离
window.scrollX;

// 滚动到指定位置
window.scrollTo({ top: 0, behavior: 'smooth' });
el.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

## 性能优化

```javascript
// ❌ 频繁操作 DOM（触发多次重排）
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  list.appendChild(li);
}

// ✅ 使用文档片段（只触发一次重排）
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment);

// ✅ 也可以使用模板字符串
list.innerHTML = Array.from({ length: 100 }, (_, i) =>
  `<li>Item ${i}</li>`
).join('');
```

## 下一步

- ⏳ [异步编程](/frontend/basics/javascript/async) - Promise 与 async/await
- 🎪 [事件机制](/frontend/basics/javascript/events) - 事件冒泡与委托
- ⚡ [Vue2 基础入门](/frontend/frameworks/vue2/) - 学习 Vue 框架
