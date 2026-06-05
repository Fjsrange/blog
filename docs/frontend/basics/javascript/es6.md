---
title: ES6+ 新特性
---

# ES6+ 新特性

ES6（ECMAScript 2015）及之后版本引入了大量现代语法特性，极大提升了 JavaScript 的开发体验。

## let 与 const

```javascript
// var - 函数作用域，存在变量提升
console.log(a); // undefined（变量提升）
var a = 1;

// let - 块级作用域，暂时性死区
console.log(b); // ReferenceError
let b = 2;

// const - 块级作用域，必须初始化，不可重新赋值
const c = 3;
c = 4; // TypeError

// const 对象可修改属性
const obj = { name: '张三' };
obj.name = '李四'; // ✅
obj = {}; // ❌
```

## 箭头函数

```javascript
// 普通函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;

// 单参数可省略括号
const double = n => n * 2;

// 返回对象需加括号
const createUser = (name, age) => ({ name, age });

// 箭头函数没有自己的 this
const obj = {
  name: '张三',
  greet: () => console.log(this.name), // ❌ this 指向外层
  hello() { console.log(this.name) },  // ✅ 方法简写
};
```

## 模板字符串

```javascript
const name = '世界';
const greeting = `你好，${name}！`;

// 多行字符串
const html = `
  <div class="card">
    <h2>${name}</h2>
  </div>
`;

// 标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : '';
    return result + str + value;
  }, '');
}
const keyword = 'VitePress';
const result = highlight`学习使用 ${keyword} 搭建博客`;
// "学习使用 <mark>VitePress</mark> 搭建博客"
```

## 解构赋值

```javascript
// 数组解构
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3,4,5]

// 对象解构
const { name, age, city = '北京' } = { name: '张三', age: 25 };

// 重命名
const { name: userName, age: userAge } = person;

// 嵌套解构
const { address: { city, street } } = user;

// 函数参数解构
function printUser({ name, age = 18 }) {
  console.log(`${name}, ${age}岁`);
}
```

## 展开运算符

```javascript
// 数组展开
const a = [1, 2, 3];
const b = [...a, 4, 5]; // [1, 2, 3, 4, 5]

// 对象展开
const defaults = { theme: 'light', lang: 'zh' };
const config = { ...defaults, theme: 'dark' };
// { theme: 'dark', lang: 'zh' }

// 函数调用展开
Math.max(...[1, 5, 3]); // 5

// 浅拷贝
const copy = [...original];
const objCopy = { ...original };
```

## Promise

```javascript
// 创建 Promise
const fetchData = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve({ name: '张三' });
    } else {
      reject(new Error('请求失败'));
    }
  }, 1000);
});

// 使用 Promise
fetchData()
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log('完成'));

// Promise.all - 全部成功才成功
const results = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
]);

// Promise.allSettled - 等待全部完成
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
]);

// Promise.race - 取最快的一个
const fastest = await Promise.race([
  fetch('/cdn1/data'),
  fetch('/cdn2/data'),
]);

// Promise.any - 取第一个成功的
const first = await Promise.any([
  fetch('/cdn1/data'),
  fetch('/cdn2/data'),
]);
```

## async/await

```javascript
// async 函数自动返回 Promise
async function getUser() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

// 并行执行
async function loadDashboard() {
  const [users, posts] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
  ]);
  return { users, posts };
}

// 循环中的 async/await
async function processItems(items) {
  // 串行处理
  for (const item of items) {
    await processItem(item);
  }

  // 并行处理
  await Promise.all(items.map(item => processItem(item)));
}
```

## Class 类

```javascript
class Person {
  // 私有字段
  #age;

  constructor(name, age) {
    this.name = name;
    this.#age = age;
  }

  // 实例方法
  greet() {
    return `我是${this.name}，今年${this.#age}岁`;
  }

  // 静态方法
  static create(name, age) {
    return new Person(name, age);
  }

  // getter / setter
  get age() { return this.#age; }
  set age(value) {
    if (value < 0) throw new Error('年龄不能为负');
    this.#age = value;
  }
}

// 继承
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  greet() {
    return `${super.greet()}，就读${this.grade}年级`;
  }
}
```

## Module 模块

```javascript
// 命名导出 - math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// 默认导出
export default class Calculator { /* ... */ }

// 命名导入
import { PI, add } from './math.js';

// 默认导入
import Calculator from './math.js';

// 全部导入
import * as math from './math.js';
math.add(1, 2);

// 重命名导入
import { add as sum } from './math.js';

// 动态导入
const module = await import('./heavy-module.js');
```

## 其他常用特性

```javascript
// Map
const map = new Map();
map.set('name', '张三');
map.set('age', 25);
map.get('name'); // '张三'
map.has('age');  // true
map.delete('age');
map.size;

// Set
const set = new Set([1, 2, 3, 3, 3]);
set; // Set(3) {1, 2, 3}
set.add(4);
set.has(2); // true
const unique = [...new Set(array)]; // 数组去重

// Symbol
const key = Symbol('description');
const obj = { [key]: '私有值' };

// 可选链 ?.
const city = user?.address?.city; // 安全访问

// 空值合并 ??
const name = user.name ?? '匿名'; // 仅 null/undefined 时使用默认值

// 逻辑赋值
x ||= 10; // x = x || 10
x &&= 10; // x = x && 10
x ??= 10; // x = x ?? 10

// Object 新方法
const target = { a: 1 };
const source = { b: 2, a: 3 };
Object.assign(target, source); // { a: 3, b: 2 }

const merged = { ...target, ...source }; // 展开合并

Object.keys(obj);    // ['a', 'b']
Object.values(obj);  // [1, 2]
Object.entries(obj);  // [['a', 1], ['b', 2]]

// fromEntries
const obj = Object.fromEntries([['a', 1], ['b', 2]]);
// { a: 1, b: 2 }
```

## 下一步

- 🌳 [DOM 操作](/frontend/basics/javascript/dom) - 操作页面元素
- ⏳ [异步编程](/frontend/basics/javascript/async) - 深入理解异步
- 🎪 [事件机制](/frontend/basics/javascript/events) - 事件冒泡与委托
