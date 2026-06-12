# ES6 全知识点趣味详解文档（适配 VitePress）

直接将以下完整内容保存为 `.md` 文件即可在 VitePress 中正常渲染，行文幽默通俗、知识点全覆盖，包含**基础语法、进阶特性、新增API、异步、模块化、元编程**等全套 ES6\+ 内容，附带代码示例、易错点、使用场景。

---

## 前言

哈喽各位前端小伙伴！
ES6 全称 **ECMAScript 2015**，算是 JavaScript 历史上一次**史诗级大整容**。以前的 JS 写法啰嗦、坑多、语法杂乱，写代码全靠“猜”和“踩坑”；ES6 上线后，代码变简洁、逻辑变清晰、功能直接拉满。

现在不管是 Vue、React、小程序还是各类项目，**默认全是 ES6\+ 语法**。本文不讲官方晦涩术语，全程大白话\+趣味比喻，从零到全覆盖 ES6 所有核心知识点，新手能看懂，老手能查漏补缺，放心食用！

---

## 一、变量声明：let / const 彻底淘汰 var

### 1\.1 老 var 的“十大罪状”

`var` 就是 JS 远古时代的老古董，缺点一大堆：

1. **没有块级作用域**：`if/for/while` 代码块拦不住它，变量到处乱跑；

2. **允许重复声明**：一不小心重名变量，悄悄覆盖原值，bug 凭空出现；

3. **变量提升诡异**：声明会被提到顶部，赋值不动，访问变量会得到 `undefined`；

4. **挂载到 window**：全局变量全挂在浏览器顶级对象上，容易命名冲突。

### 1\.2 let 用法（可变变量）

`let` 主打一个**守规矩**：拥有**块级作用域**，只在当前 `{}` 代码块内生效。

```JavaScript
// 块级作用域演示
if (true) {
  let msg = "我只在大括号里存活";
  console.log(msg); // 正常输出
}
console.log(msg); // 报错：msg is not defined

// 不允许重复声明
let a = 10;
let a = 20; // 直接报错
```

### 1\.3 const 用法（常量）

`const` 是**只读常量**，日常开发**优先使用**。
规则：

- 声明时**必须初始化赋值**，不能只声明不赋值；

- 基础类型（数字、字符串、布尔）赋值后**不可修改**；

- 引用类型（数组、对象）**地址不可改**，内部属性/元素可以修改。

```JavaScript
// 基础类型：不可修改
const name = "前端玩家";
name = "改变我"; // 报错

// 引用类型：地址不变，内容可改
const arr = [1, 2, 3];
arr.push(4); 
console.log(arr); // [1,2,3,4] 正常运行

const obj = { age: 18 };
obj.age = 20; 
console.log(obj.age); // 20 正常运行
```

### 1\.4 暂时性死区（TDZ）

`let / const` 存在**暂时性死区**：代码块内，变量在**声明前不能访问**。

```JavaScript
console.log(num); // 报错
let num = 100;
```

简单记：**先声明，后使用**，告别 `var` 奇葩的变量提升。

### 1\.5 最佳编码规范

1. 能使用 `const` 绝不使用 `let`；

2. 只有变量值需要**主动修改**时，才用 `let`；

3. **项目中彻底弃用 var**。

---

## 二、解构赋值：一键拆包，告别重复取值

解构赋值 = **快速从数组、对象中提取数据**，少写几十行打点取值代码，分为**对象解构**、**数组解构**、**字符串解构**三大类。

### 2\.1 数组解构

按**下标顺序**一一对应取值，支持默认值、按需取值、变量交换。

```JavaScript
// 基础解构
const list = ["苹果", "香蕉", "橙子"];
const [fruit1, fruit2] = list;
console.log(fruit1, fruit2); // 苹果 香蕉

// 默认值（解构不到值时生效）
const [a, b, c = "西瓜"] = ["草莓"];
console.log(c); // 西瓜

// 经典用法：快速交换两个变量（不用中间变量）
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1
```

### 2\.2 对象解构（项目最高频）

按**属性名**匹配取值，和顺序无关，支持重命名、默认值、嵌套解构。

```JavaScript
const user = { name: "李四", age: 22, gender: "男" };

// 基础解构
const { name, age } = user;

// 属性重命名（原属性名太长/冲突时使用）
const { name: username } = user;
console.log(username); // 李四

// 默认值
const { height = 175 } = user;
console.log(height); // 175

// 嵌套对象解构
const info = { person: { nick: "小码农" } };
const { person: { nick } } = info;
console.log(nick); // 小码农
```

### 2\.3 字符串解构

字符串会被拆分为字符数组，可直接解构：

```JavaScript
const str = "hello";
const [s1, s2] = str;
console.log(s1, s2); // h e
```

### 2\.4 函数参数解构（接口请求/组件传参神器）

前端传参标配写法，不用在函数内部反复取值：

```JavaScript
// 传统写法
function getInfo(options) {
  const name = options.name;
}

// ES6 解构写法（简洁优雅）
function getInfo({ name, age = 18 }) {
  console.log(name, age);
}
getInfo({ name: "王五" });
```

---

## 三、模板字符串 \`\` ：终结字符串拼接地狱

传统字符串拼接：`"" + 变量 + ""`，引号嵌套、换行、拼接符号满天飞，堪称前端噩梦。
ES6 推出**反引号模板字符串**，全方位吊打传统写法。

### 3\.1 核心特性

1. 支持**原生换行**，不用拼接换行符；

2. 使用 `${变量/表达式}` 嵌入内容，支持运算、函数调用；

3. 单双引号无需转义。

```JavaScript
// 传统拼接
const username = "赵六";
const oldStr = "姓名：" + username + "，今年" + 20 + "岁";

// ES6 模板字符串
const newStr = `姓名：${username}，今年${20}岁`;

// 支持换行
const html = `
  <div>
    <p>我可以直接换行写HTML</p>
  </div>
`;

// 支持表达式运算
const a = 10, b = 20;
const calcStr = `求和结果：${a + b}`;
```

### 3\.2 标签模板（进阶用法）

可以对模板字符串内容进行二次加工，多用于过滤标签、国际化、安全过滤：

```JavaScript
function tag(arr, ...args) {
  console.log(arr, args);
}
const name = "前端";
tag`你好，${name}`;
```

---

## 四、对象扩展：简写、计算属性、方法简写

ES6 给对象做了多重优化，日常开发 100% 用到。

### 4\.1 属性简写

当**变量名 和 对象属性名一致**时，可省略赋值：

```JavaScript
const nickname = "码仔";
const score = 90;

// 传统写法
const stu1 = {
  nickname: nickname,
  score: score
};

// ES6 简写
const stu2 = {
  nickname,
  score
};
```

### 4\.2 方法简写

对象内的函数，可以省略 `function` 关键字：

```JavaScript
// 传统
const obj1 = {
  say: function() {
    console.log("哈喽");
  }
};

// ES6 简写
const obj2 = {
  say() {
    console.log("哈喽");
  }
};
```

### 4\.3 计算属性

属性名可以写成**变量/表达式**，动态生成属性名：

```JavaScript
const key = "address";
const person = {
  [key]: "北京市", // 动态属性名
  [`name_${1 + 1}`]: "小明"
};
console.log(person); // { address: '北京市', name_2: '小明' }
```

### 4\.4 Object 新增静态方法

1. `Object.assign()`：对象合并（浅拷贝）

```JavaScript
const objA = { a: 1 };
const objB = { b: 2 };
const newObj = Object.assign({}, objA, objB);
console.log(newObj); // {a:1, b:2}
```

2. `Object.keys() / Object.values() / Object.entries()`：遍历对象

```JavaScript
const o = { x: 1, y: 2 };
console.log(Object.keys(o)); // 键名数组
console.log(Object.values(o)); // 值数组
console.log(Object.entries(o)); // 键值对二维数组
```

---

## 五、箭头函数 =\> ：懒人专属极简函数

箭头函数是 ES6 最常用的语法糖，**简化普通函数写法**，同时改变了 `this` 指向规则。

### 5\.1 基础写法与简写规则

```JavaScript
// 1. 无参数：括号不能省
const fn1 = () => "无参数函数";

// 2. 单个参数：括号可省略
const fn2 = x => x * 2;

// 3. 多个参数：必须加括号
const fn3 = (a, b) => a + b;

// 4. 多行代码：必须写 {} + return
const fn4 = (n) => {
  n = n + 1;
  return n;
};

// 5. 返回对象字面量：必须加小括号
const fn5 = () => ({ name: "箭头函数" });
```

### 5\.2 箭头函数核心特性（面试重点）

1. **没有自身 this**：继承**外层作用域**的 `this`，不再需要 `var that = this` 兜底；

2. **没有 arguments**：不能使用内置参数集合；

3. **不能作为构造函数**：不能用 `new` 实例化；

4. **没有 prototype 原型**；

5. **不能使用 generator 生成器（\*）**。

### 5\.3 使用场景 \& 禁忌

✅ 适合：回调函数、数组方法（map/filter/forEach）、内层函数
❌ 不适合：对象方法、构造函数、需要使用 `arguments` 的函数、DOM 事件回调

---

## 六、扩展运算符 \.\.\. 三点符：万能摊开工具

`...` 扩展运算符（也叫剩余/展开运算符），ES6 万能语法，**摊开数组/对象**，分两大用法：**展开**、**剩余参数**。

### 6\.1 展开运算符（拆包）

#### 数组展开

```JavaScript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // 数组合并
console.log(arr2); // [1,2,3,4,5]

// 数组浅拷贝
const copyArr = [...arr1];
```

#### 对象展开（ES6\+）

```JavaScript
const o1 = { id: 1 };
const o2 = { ...o1, title: "标题" }; // 对象合并、浅拷贝
console.log(o2); // {id:1, title:"标题"}
```

### 6\.2 剩余参数（收纳打包）

收集**剩余参数**，必须写在**参数最后一位**，返回数组。

```JavaScript
// 函数剩余参数
function sum(a, b, ...rest) {
  console.log(rest); // [3,4,5]
}
sum(1, 2, 3, 4, 5);

// 数组解构剩余项
const [first, ...other] = [10, 20, 30];
console.log(other); // [20,30]
```

### 6\.3 应用场景总结

- 数组/对象合并、浅拷贝；

- 函数接收不定量参数；

- 解构赋值收纳剩余元素；

- 数组转参数列表（`Math.max(...arr)`）。

---

## 七、数组扩展：新增方法 \& 遍历方式

ES6 给数组新增了大量实用方法，彻底告别原生 `for` 循环硬写逻辑。

### 7\.1 全新遍历 for\.\.\.of

弥补 `for/forEach/for...in` 的缺陷：**可 break、可 continue、遍历纯元素**。

```JavaScript
const arr = [10, 20, 30];
for (const item of arr) {
  if (item === 20) break;
  console.log(item); // 10
}
```

支持遍历：数组、字符串、Map、Set、类数组对象。

### 7\.2 数组静态方法

1. `Array.from()`：**类数组 / 可迭代对象 转真数组**

```JavaScript
const likeArr = { 0: "a", 1: "b", length: 2 };
const realArr = Array.from(likeArr);
```

2. `Array.of()`：创建数组，解决 `new Array()` 奇葩问题

```JavaScript
Array.of(1, 2, 3); // [1,2,3]
```

### 7\.3 数组实例常用方法（项目高频）

```JavaScript
const list = [1, 2, 3, 4];

// map：映射，加工每一项，返回新数组
list.map(item => item * 2); // [2,4,6,8]

// filter：过滤，保留符合条件项
list.filter(item => item > 2); // [3,4]

// find：查找第一个符合条件的值，找不到返回 undefined
list.find(item => item === 3); // 3

// findIndex：查找下标，找不到返回 -1
list.findIndex(item => item === 4); // 3

// includes：判断是否包含某一项，返回布尔值
list.includes(2); // true

// every：全部满足条件才为 true
list.every(item => item > 0); // true

// some：任意一项满足条件就为 true
list.some(item => item > 3); // true

// reduce：累加器，数组最强聚合方法
list.reduce((prev, curr) => prev + curr, 0); // 10
```

---

## 八、Set \& Map 新型数据结构

ES6 新增两种**集合数据结构**，专门解决传统数组、普通对象的短板。

### 8\.1 Set 集合（元素唯一，自动去重）

特点：**内部元素不允许重复**，天然实现数组去重。

```JavaScript
// 数组一键去重（经典用法）
const oldArr = [1, 1, 2, 2, 3];
const newArr = [...new Set(oldArr)];
console.log(newArr); // [1,2,3]

// Set 常用API
const s = new Set();
s.add(1); // 添加元素
s.delete(1); // 删除元素
s.has(1); // 判断是否存在
s.clear(); // 清空
s.size; // 获取元素个数
```

### 8\.2 Map 键值对集合（键可以是任意类型）

传统对象 `key` 只能是**字符串/Symbol**，`Map` 的 `key` 可以是**数字、数组、对象**等任意类型，查询效率更高。

```JavaScript
const m = new Map();
const keyObj = { name: "对象键" };

m.set(keyObj, "对应的值"); // 设置键值对
m.get(keyObj); // 获取值
m.has(keyObj); // 判断存在
m.delete(keyObj); // 删除
m.clear(); // 清空
m.size; // 长度

// 遍历 Map
for (const [k, v] of m) {
  console.log(k, v);
}
```

### 8\.3 WeakSet / WeakMap（弱引用）

- `WeakSet`：只能存**对象**，弱引用，不阻碍垃圾回收；

- `WeakMap`：`key` 只能是**对象**，弱引用，适合存储临时数据、DOM 节点数据。

---

## 九、Symbol 原始数据类型

ES6 第七种原始数据类型：`Symbol`（符号），表示**独一无二的值**。

### 9\.1 基础用法

```JavaScript
// 创建 Symbol，每一个 Symbol 都是唯一的
const s1 = Symbol();
const s2 = Symbol();
console.log(s1 === s2); // false

// 添加描述文本（仅注释作用）
const s3 = Symbol("标识");
```

### 9\.2 核心使用场景

1. **定义对象私有属性**：外部无法随意访问、覆盖；

2. **避免对象属性名冲突**；

3. 定义内置常量、迭代器标识。

```JavaScript
const name = Symbol("name");
const obj = {
  [name]: "私有名字"
};
```

---

## 十、函数扩展：参数默认值、剩余参数、形参解构

### 10\.1 函数参数默认值

不用再写 `a = a || 10` 兜底，ES6 原生支持默认值：

```JavaScript
// 传统写法
function fn(a) {
  a = a || 10;
}

// ES6 默认参数
function fn(a = 10) {
  console.log(a);
}
fn(); // 10
fn(20); // 20
```

### 10\.2 剩余参数（前文扩展运算符已讲）

替代 `arguments`，推荐优先使用。

### 10\.3 函数 length 属性

默认参数、剩余参数会影响函数 `length`，面试小考点。

### 10\.4 尾调用优化

ES6 支持**尾递归优化**，解决递归函数栈溢出问题（日常使用较少，了解即可）。

---

## 十一、迭代器 \& 生成器 Iterator / Generator

### 11\.1 迭代器 Iterator

所有**可遍历对象**（数组、Set、Map、字符串）底层都部署了迭代器接口 `Symbol.iterator`，`for...of` 本质就是调用迭代器遍历。
核心方法：`next()`，返回 `{ value: 值, done: 是否遍历完成 }`。

### 11\.2 生成器 Generator（函数暂停/恢复）

特殊函数，用 `function*` 声明，`yield` 暂停代码，`next()` 恢复执行，**分段执行函数**。
常用于：异步任务拆分、长任务分段、状态机。

```JavaScript
function* gen() {
  yield "第一步";
  yield "第二步";
  return "结束";
}
const g = gen();
console.log(g.next()); // {value: '第一步', done: false}
console.log(g.next()); // {value: '第二步', done: false}
console.log(g.next()); // {value: '结束', done: true}
```

---

## 十二、Promise 异步解决方案

ES6 原生 `Promise`，专门解决前端**回调地狱**（函数无限嵌套），是现代异步编程基石。

### 12\.1 三种状态

- `pending`：进行中（初始状态）；

- `fulfilled`：成功状态；

- `rejected`：失败状态；
**状态一旦改变，永久凝固，无法二次修改**。

### 12\.2 基础语法

```JavaScript
// 创建 Promise 实例
const p = new Promise((resolve, reject) => {
  // 异步操作：定时器、接口请求
  setTimeout(() => {
    const flag = true;
    if (flag) {
      resolve("请求成功数据"); // 触发成功
    } else {
      reject("请求失败原因"); // 触发失败
    }
  }, 1000);
});

// 接收结果
p.then(res => {
  console.log("成功：", res);
}).catch(err => {
  console.log("失败：", err);
}).finally(() => {
  console.log("无论成败都会执行");
});
```

### 12\.3 静态方法（批量异步）

```JavaScript
// Promise.all：所有异步全部成功才成功，一个失败就失败
Promise.all([p1, p2, p3]);

// Promise.race：谁先完成就返回谁的结果（竞速）
Promise.race([p1, p2]);

// Promise.resolve / Promise.reject：快速创建实例
```

> 补充：后来的 `async/await` 是基于 Promise 的语法糖，属于 ES2017，基于 ES6 Promise 实现。

---

## 十三、ES6 模块化 Module（import / export）

ES6 推出**官方标准模块化**，现在前端项目（Vite/Webpack/Vue/React）默认使用，彻底替代 `CommonJS(require)`。

### 13\.1 两种导出方式

#### 1\. 分别导出（命名导出）

一个文件可写多个，导入时必须**名称对应**：

```JavaScript
// a.js
export const num = 100;
export function sayHello() {
  console.log("你好");
}
```

#### 2\. 默认导出 export default

**一个文件只能有一个默认导出**，导入时可自定义名称：

```JavaScript
// b.js
export default {
  name: "默认导出"
};
```

### 13\.2 两种导入方式

```JavaScript
// 导入命名导出
import { num, sayHello } from "./a.js";

// 导入默认导出（自定义名称）
import bObj from "./b.js";

// 全部导入（别名接收）
import * as all from "./a.js";

// 导入并重命名
import { num as total } from "./a.js";
```

### 13\.3 模块特点

1. 每个模块都是**独立作用域**，变量互不污染；

2. 严格模式 `strict mode` 默认开启；

3. 浏览器、Node、打包工具全平台支持。

---

## 十四、class 类：面向对象语法糖

ES6 用 `class` 关键字简化 JS 原型写法，本质还是**原型\+构造函数**，只是语法更贴近传统面向对象语言。

### 14\.1 基础类与构造函数

```JavaScript
// 定义类
class Person {
  // 构造器：实例化时自动执行，初始化属性
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法
  sayName() {
    console.log(this.name);
  }

  // 静态方法（挂载在类本身，实例无法调用）
  static fn() {
    console.log("静态方法");
  }
}

// 实例化
const p = new Person("小张", 20);
p.sayName();
Person.fn();
```

### 14\.2 类的继承 extends

使用 `extends` 实现继承，`super()` 调用父类构造器：

```JavaScript
// 子类继承父类
class Student extends Person {
  constructor(name, age, score) {
    super(name, age); // 必须先调用 super
    this.score = score;
  }
  showScore() {
    console.log(this.score);
  }
}

const s = new Student("小李", 18, 95);
s.sayName();
s.showScore();
```

### 14\.3 类的特点

1. 类不存在变量提升，必须**先定义后使用**；

2. 内部默认开启严格模式；

3. 方法不可枚举，比原生原型更规范。

---

## 十五、字符串、数值、正则扩展

### 15\.1 字符串新增方法

```JavaScript
const str = "hello es6";

// includes：是否包含字符
str.includes("es6"); // true

// startsWith / endsWith：开头、结尾匹配
str.startsWith("hello"); // true
str.endsWith("6"); // true

// repeat：字符串重复 n 次
"abc".repeat(2); // "abcabc"

// padStart / padEnd：补全长度（格式化字符串常用）
"1".padStart(2, "0"); // "01"
```

### 15\.2 数值扩展

- `Number.isNaN()` / `Number.isFinite()`：精准判断 NaN、有限数字；

- `Number.parseInt()` / `Number.parseFloat()`：全局方法迁移到 Number；

- 二进制 `0b`、八进制 `0o` 数值表示。

### 15\.3 正则扩展

新增正则修饰符、分组捕获、后行断言等，增强正则能力。

---

## 十六、全局对象 \& 严格模式

1. **globalThis**：统一全局对象（浏览器=window、Node=global），ES6\+ 标准全局顶层对象；

2. **严格模式**：ES6 模块、class 内部**默认开启严格模式**，限制不合理语法，代码更严谨。

---

## 十七、全文总结

### ES6 核心知识点清单（速查）

1. 变量：`let / const` 块级作用域、暂时性死区；

2. 取值：解构赋值（数组/对象/函数参数）；

3. 字符串：模板字符串、新增字符串方法；

4. 函数：箭头函数、参数默认值、剩余参数；

5. 运算符：扩展运算符 `...`；

6. 对象：属性简写、方法简写、计算属性、Object 新方法；

7. 数组：`for...of`、Array\.from、map/filter/find 等方法；

8. 数据结构：`Set / Map / WeakSet / WeakMap`；

9. 原始类型：`Symbol` 唯一标识；

10. 异步：`Promise` 异步方案；

11. 遍历：迭代器 Iterator、生成器 Generator；

12. 面向对象：`class` 类、继承 `extends`；

13. 模块化：`import / export` 官方模块；

14. 补充：字符串/数值/正则扩展、严格模式。

### 学习建议

ES6 不是“高深新语法”，而是 **JavaScript 标准化、现代化的升级**。现在所有前端框架、工程化项目都基于 ES6\+ 开发，建议：

1. 日常写代码强制使用 `let/const`，抛弃 `var`；

2. 解构、模板字符串、扩展运算符、数组方法优先使用；

3. Promise、模块化、class 是项目架构核心，重点掌握；

4. Symbol、迭代器、生成器偏向进阶/面试，理解原理即可。

---

### 使用说明（VitePress）

1. 将以上全部内容复制，新建文件命名为 `es6-full.md`；

2. 放入 VitePress 文档目录；

3. 配置侧边栏/路由后，直接启动项目即可正常浏览，代码块、标题、列表全部原生支持渲染。

> （注：文档部分内容可能由 AI 生成）
