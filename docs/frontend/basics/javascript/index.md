---
title: JavaScript 基础
---

# JavaScript 基础

JavaScript 是 Web 开发的编程语言，赋予网页交互能力。

## 变量与常量

```javascript
// var - 函数作用域（不推荐）
var name = '张三';

// let - 块级作用域，可重新赋值
let age = 25;
age = 26; // ✅

// const - 块级作用域，不可重新赋值
const PI = 3.14159;
PI = 3.14; // ❌ TypeError

// const 对象可以修改属性
const user = { name: '张三' };
user.name = '李四'; // ✅ 修改属性
user = {}; // ❌ 重新赋值
```

## 数据类型

### 基本类型（值类型）

```javascript
// Number
let integer = 42;
let decimal = 3.14;
let negative = -10;

// String
let single = 'hello';
let double = "world";
let template = `你好，${single}`; // 模板字符串

// Boolean
let isTrue = true;
let isFalse = false;

// null 和 undefined
let empty = null;        // 空值
let notDefined;          // undefined

// Symbol
let sym = Symbol('unique');

// BigInt
let big = 9007199254740991n;
```

### 引用类型

```javascript
// Object
const person = {
  name: '张三',
  age: 25,
  greet() {
    return `我是${this.name}`;
  }
};

// Array
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, 'hello', true, null, { key: 'value' }];

// Function
function add(a, b) {
  return a + b;
}

const multiply = (a, b) => a * b;
```

### 类型检测

```javascript
typeof 42           // 'number'
typeof 'hello'      // 'string'
typeof true         // 'boolean'
typeof undefined    // 'undefined'
typeof null         // 'object' ⚠️ 历史遗留bug
typeof {}           // 'object'
typeof []           // 'object'
typeof function(){} // 'function'

// 精确判断数组
Array.isArray([1, 2, 3])  // true
Array.isArray('hello')    // false

// 精确判断 null
value === null

// 判断 NaN
Number.isNaN(NaN)  // true
```

## 运算符

### 比较运算符

```javascript
// == 宽松相等（会类型转换）
1 == '1'    // true
null == undefined  // true

// === 严格相等（推荐）
1 === '1'   // false
null === undefined  // false

// 推荐：始终使用 ===
```

### 逻辑运算符

```javascript
// && 与
true && false  // false

// || 或
true || false  // true

// ! 非
!true  // false

// 短路求值
const name = user.name || '匿名';  // 默认值
const value = data?.items?.[0];     // 可选链
const count = value ?? 0;           // 空值合并
```

## 流程控制

### 条件语句

```javascript
// if-else
if (score >= 90) {
  grade = 'A';
} else if (score >= 80) {
  grade = 'B';
} else if (score >= 60) {
  grade = 'C';
} else {
  grade = 'D';
}

// 三元运算符
const message = age >= 18 ? '成年人' : '未成年人';

// switch
switch (day) {
  case 'Monday':
    console.log('周一');
    break;
  case 'Friday':
    console.log('周五');
    break;
  default:
    console.log('其他');
}
```

### 循环语句

```javascript
// for
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// for...of（遍历可迭代对象）
for (const item of array) {
  console.log(item);
}

// for...in（遍历对象键名）
for (const key in object) {
  console.log(key, object[key]);
}

// while
let i = 0;
while (i < 10) {
  console.log(i);
  i++;
}

// 数组方法（推荐）
array.forEach(item => console.log(item));
const doubled = array.map(item => item * 2);
const evens = array.filter(item => item % 2 === 0);
const sum = array.reduce((acc, item) => acc + item, 0);
```

## 函数

### 函数声明

```javascript
// 函数声明（会提升）
function greet(name) {
  return `你好，${name}！`;
}

// 函数表达式
const greet = function(name) {
  return `你好，${name}！`;
};

// 箭头函数
const greet = (name) => `你好，${name}！`;

// 默认参数
function greet(name = '世界') {
  return `你好，${name}！`;
}

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### 闭包

```javascript
function createCounter(initial = 0) {
  let count = initial;
  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
}

const counter = createCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.getCount();  // 12
```

### 解构赋值

```javascript
// 数组解构
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// 对象解构
const { name, age, city = '北京' } = person;

// 函数参数解构
function printUser({ name, age }) {
  console.log(`${name}, ${age}岁`);
}

// 交换变量
let a = 1, b = 2;
[a, b] = [b, a];
```

## 字符串方法

```javascript
const str = 'Hello, World!';

str.length              // 13
str.includes('World')   // true
str.startsWith('Hello') // true
str.endsWith('!')       // true
str.indexOf('World')    // 7
str.slice(0, 5)         // 'Hello'
str.substring(7, 12)    // 'World'
str.toLowerCase()       // 'hello, world!'
str.toUpperCase()       // 'HELLO, WORLD!'
str.trim()              // 去除首尾空格
str.split(', ')         // ['Hello', 'World!']
str.replace('World', 'JS') // 'Hello, JS!'
str.replaceAll('l', 'L')   // 'HeLLo, WorLd!'
str.repeat(3)           // 重复3次
str.padStart(5, '0')    // 左侧填充
str.padEnd(5, '0')      // 右侧填充
```

## 数组方法

```javascript
const arr = [1, 2, 3, 4, 5];

// 遍历
arr.forEach(item => console.log(item));

// 变换
arr.map(x => x * 2);           // [2, 4, 6, 8, 10]
arr.filter(x => x > 3);        // [4, 5]
arr.reduce((sum, x) => sum + x, 0); // 15

// 查找
arr.find(x => x > 3);          // 4
arr.findIndex(x => x > 3);     // 3
arr.includes(3);                // true
arr.indexOf(3);                 // 2

// 判断
arr.every(x => x > 0);         // true
arr.some(x => x > 4);          // true

// 增删
arr.push(6);                    // 末尾添加
arr.pop();                      // 末尾删除
arr.unshift(0);                 // 开头添加
arr.shift();                    // 开头删除
arr.splice(2, 1);               // 删除索引2的元素

// 排序
arr.sort((a, b) => a - b);     // 升序
arr.reverse();                  // 反转

// 展开
const arr2 = [...arr, 6, 7];   // [1, 2, 3, 4, 5, 6, 7]
const flat = [[1,2],[3,4]].flat(); // [1, 2, 3, 4]
```

## 下一步

- ✨ [ES6+ 新特性](/frontend/basics/javascript/es6) - 现代JavaScript语法
- 🌳 [DOM 操作](/frontend/basics/javascript/dom) - 操作页面元素
- ⏳ [异步编程](/frontend/basics/javascript/async) - Promise 与 async/await
- 🎪 [事件机制](/frontend/basics/javascript/events) - 事件冒泡与委托
