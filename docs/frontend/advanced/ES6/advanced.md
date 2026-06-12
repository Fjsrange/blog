# ES6 进阶知识点详解（适配 VitePress）

> 文档风格延续上篇诙谐通俗风格，基于基础 ES6 延伸进阶语法、原理、实战场景、面试考点，包含**作用域深入、异步进阶、元编程、语法糖深挖、工程化用法、易错坑点**，纯 Markdown 格式，直接放入 VitePress 即可渲染。

------

## 前言

看完 ES6 基础语法，相信大家日常编码已经能熟练使用解构、箭头函数、`let/const`、模块化等功能。

本篇 **ES6 进阶** 不再讲基础用法，重点深挖**底层原理、边界场景、疑难考点、实战高阶写法、踩坑点**，同时补充 ES6+ 延伸语法、异步进阶、元编程、性能优化相关内容，适合进阶提升、面试复盘、项目深度开发。

------

## 一、变量与作用域 深度剖析

### 1.1 暂时性死区（TDZ）彻底详解

基础篇提到 `let/const` 存在暂时性死区，这里讲清原理与边界场景。

**定义**：在代码块内，`let/const` 变量从**进入作用域**到**正式声明**之间的区域，就是暂时性死区，该区域内禁止访问变量。

js









```
// 场景1：块级作用域内 TDZ
{
  console.log(a); // 报错：Cannot access 'a' before initialization
  let a = 10;
}

// 场景2：if / for 块同样存在 TDZ
if (true) {
  console.log(b);
  const b = 20;
}
```

**TDZ 产生原因**

`let/const` 同样存在**变量提升**，只是 ES6 语法强制屏蔽了提升后的访问能力，目的是规范代码，杜绝 `var` 先使用后声明的诡异行为。

**延伸：函数参数 TDZ**

函数形参之间也存在暂时性死区：

js









```
function fn(x = y, y = 10) {
  console.log(x, y);
}
fn(); // 报错，x 引用了还未声明的 y
```

### 1.2 块级作用域 实战应用

1. **循环绑定事件经典坑（var 对比 let）**

html



预览







```
<!-- 点击按钮查看效果 -->
<button>按钮1</button>
<button>按钮2</button>
```

js









```
// 错误写法：var 无块级作用域，循环结束 i = 2
var btns = document.querySelectorAll("button");
for (var i = 0; i < btns.length; i++) {
  btns[i].onclick = function () {
    console.log(i); // 永远输出 2
  };
}

// ES6 正确写法：let 拥有块级作用域，每次循环都是新变量
for (let i = 0; i < btns.length; i++) {
  btns[i].onclick = function () {
    console.log(i); // 依次输出 0、1
  };
}
```

1. 块级作用域替代立即执行函数 (IIFE)

   

   ES5 靠 IIFE 创建局部作用域隔离变量，ES6 直接用 

   ```
   {}
   ```

    块级作用域，写法更简洁：

js









```
// ES5 老写法 IIFE
(function () {
  var msg = "局部变量";
})();

// ES6 进阶写法
{
  let msg = "局部变量";
}
```

### 1.3 const 引用类型 深度坑点

`const` 仅保证**变量指针地址不可修改**，不限制引用类型内部数据修改，也是面试高频题。

js









```
const obj = { name: "张三" };
// 允许：修改对象内部属性
obj.name = "李四"; 

// 禁止：修改变量指向的内存地址
obj = {}; // 直接报错

// 进阶：彻底冻结对象（防止内部修改）
const user = Object.freeze({ name: "王五" });
user.name = "赵六"; // 严格模式下报错，普通模式静默失效
```

> `Object.freeze()` 是浅冻结，嵌套对象依然可以修改。

------

## 二、解构赋值 高阶用法与坑点

### 2.1 多层嵌套解构

业务中接口返回多层嵌套对象 / 数据，嵌套解构是必备技巧：

js









```
// 模拟后端嵌套数据
const res = {
  code: 200,
  data: {
    user: {
      nickname: "码农",
      age: 22
    }
  }
};

// 多层嵌套解构
const {
  data: {
    user: { nickname, age }
  }
} = res;

console.log(nickname, age);
```

### 2.2 解构默认值 生效规则

**默认值仅在属性值为 `undefined` 时生效**，`null`、`0`、`""`、`false` 都不会触发默认值。

js









```
const obj = { num: 0, name: null };

// 0 不会走默认值
const { num = 10 } = obj; 
console.log(num); // 0

// null 不会走默认值
const { name = "默认名" } = obj;
console.log(name); // null

// undefined 才会触发默认值
const { addr = "北京市" } = obj;
console.log(addr); // 北京市
```

### 2.3 函数参数解构 + 多层默认值（项目标配）

封装工具函数、接口请求函数最常用的高阶写法：

js









```
// 完整配置默认值、解构、兜底
function request({
  url = "/api",
  method = "GET",
  data = {}
} = {}) { 
  console.log(url, method, data);
}

// 不传参也不会报错
request();
// 部分传参
request({ url: "/user" });
```

> 末尾 `= {}` 是为了防止函数无入参时报错，进阶必记写法。

### 2.4 数组解构 剩余运算符边界

剩余运算符 `...` 在解构中**只能放在最后一位**，放在中间 / 开头直接语法报错：

js









```
const arr = [1, 2, 3, 4];
const [a, ...rest, b] = arr; // 语法错误
const [first, ...last] = arr; // 正确
```

------

## 三、箭头函数 底层原理 & 避坑大全

### 3.1 this 指向 终极解析（面试核心）

箭头函数**没有自身的 this**，会沿着**作用域链向上查找最近一层普通函数 / 全局作用域的 this**。

#### 场景 1：普通函数嵌套

js









```
const name = "全局";
const obj = {
  name: "对象内部",
  fn: function () {
    // 外层普通函数 this -> obj
    setTimeout(() => {
      console.log(this.name); // 对象内部
    }, 1000);
  }
};
obj.fn();
```

#### 场景 2：全局作用域下的箭头函数

js









```
// 浏览器环境：this 指向 window
const fn = () => {
  console.log(this); // window
};
fn();
```

#### 场景 3：绝对不能用箭头函数的场景

1. **对象方法**：this 指向全局，无法拿到对象自身

js









```
const obj = {
  name: "测试",
  say: () => {
    console.log(this.name); // undefined / 全局变量
  }
};
obj.say();
```

1. **构造函数**：箭头函数无 `prototype`，不能 `new`

js









```
const Person = () => {};
new Person(); // 报错
```

1. **DOM 事件回调**：事件绑定 this 会指向外层，而非当前 DOM 元素

js









```
document.querySelector("button").onclick = () => {
  console.log(this); // window，不是按钮元素
};
```

### 3.2 箭头函数 无 arguments 解决方案

箭头函数不支持 `arguments` 对象，不定参场景用**剩余参数**替代：

js









```
// 错误：箭头函数不能使用 arguments
const fn = () => {
  console.log(arguments);
};

// 进阶正确写法：剩余参数 ...args
const fn2 = (...args) => {
  console.log(args);
};
fn2(1, 2, 3);
```

### 3.3 箭头函数 返回对象 简写坑

单行箭头函数直接返回对象字面量，**必须用小括号包裹**，否则解析为代码块：

js









```
// 错误：{} 被识别为函数体
const getObj = () => { name: "张三" }; 

// 正确：() 包裹对象字面量
const getObj2 = () => ({ name: "张三" });
```

------

## 四、扩展运算符 & 剩余参数 高阶实战

### 4.1 浅拷贝 深度讲解

`...` 扩展运算符、`Object.assign` 都属于**浅拷贝**，仅拷贝第一层属性，嵌套引用类型依然共用内存地址。

js









```
// 嵌套对象
const oldObj = { a: 1, b: { c: 2 } };
const newObj = { ...oldObj };

newObj.b.c = 999;
console.log(oldObj.b.c); // 999 原数据被修改
```

**进阶方案**

- 简单场景：手动递归实现深拷贝
- 快速方案：`JSON.parse(JSON.stringify())`（无法拷贝函数、正则、Symbol）

### 4.2 函数不定参 高阶运用

结合数组方法实现累加、最大值等工具函数：

js









```
// 任意多个数字求和
const sum = (...nums) => nums.reduce((pre, cur) => pre + cur, 0);
sum(1, 2, 3, 4); // 10

// 求最大值
const max = (...nums) => Math.max(...nums);
max(5, 8, 2); // 8
```

### 4.3 数组合并 & 去重 组合写法

结合 `Set` + 扩展运算符实现**两数组合并并去重**：

js









```
const arr1 = [1, 2, 3, 3];
const arr2 = [2, 4, 5];
const result = [...new Set([...arr1, ...arr2])];
console.log(result); // [1,2,3,4,5]
```

------

## 五、Set / Map / WeakSet / WeakMap 进阶原理

### 5.1 Set 去重 边界问题

`Set` 基于 **严格相等（===）** 判断重复，注意特殊值：

- `NaN === NaN` 结果为 false，但 `Set` 认为 `NaN` 是同一个值，会自动去重
- `+0` 和 `-0` 视为相等

js









```
const arr = [NaN, NaN, +0, -0];
console.log([...new Set(arr)]); // [NaN, 0]
```

### 5.2 Map 与 Object 核心区别（面试重点）

表格







|   特性   |  Object 普通对象  |            Map 集合            |
| :------: | :---------------: | :----------------------------: |
|  键类型  | 仅字符串 / Symbol | 任意类型（数字、对象、数组等） |
| 键值有序 |       无序        |        **插入顺序有序**        |
| 长度获取 |    需手动遍历     |       直接 `.size` 获取        |
|   迭代   |  不支持直接迭代   |      原生支持 `for...of`       |
|   性能   | 大量增删查性能弱  |       频繁增删查性能更强       |

### 5.3 WeakSet / WeakMap 弱引用 核心作用

**弱引用**：不会计入垃圾回收引用计数，当对象没有其他引用时，GC 会自动回收，**防止内存泄漏**。

使用限制：

1. `WeakSet` 只能存储**对象**，不能存基本类型
2. `WeakMap` 的 `key` 只能是**对象**
3. 两者都**不可遍历**、没有 `size` 属性

**实战场景：DOM 节点缓存**

给 DOM 节点绑定临时数据，节点移除后数据自动回收，杜绝内存泄漏：

js









```
const wm = new WeakMap();
const btn = document.querySelector("button");

// 给 DOM 绑定数据
wm.set(btn, { clickCount: 0 });

// 节点被移除后，wm 中数据自动被垃圾回收
btn.remove();
```

------

## 六、Symbol 进阶用法与元编程

### 6.1 Symbol 全局注册表

`Symbol.for()` 可以创建**全局共享的 Symbol**，多次调用相同字符串会返回同一个 Symbol；而 `Symbol()` 每次都是全新值。

js









```
const s1 = Symbol.for("token");
const s2 = Symbol.for("token");
console.log(s1 === s2); // true

const s3 = Symbol("token");
const s4 = Symbol("token");
console.log(s3 === s4); // false
```

### 6.2 内置 Symbol 常量（元编程）

ES6 提供一批**内置 Symbol**，用于改写对象底层行为，属于元编程范畴。

常用内置 Symbol：

1. `Symbol.iterator`：定义对象迭代器（`for...of` 依赖）
2. `Symbol.toStringTag`：自定义 `Object.prototype.toString` 返回值

示例：自定义对象类型标签

js









```
const obj = {
  [Symbol.toStringTag]: "MyObject"
};
console.log(Object.prototype.toString.call(obj)); 
// [object MyObject]
```

### 6.3 Symbol 实现真正私有属性

普通属性可以被遍历、修改，Symbol 属性**默认不可被常规遍历**，模拟私有属性：

js









```
const privateKey = Symbol("私有字段");
const user = {
  name: "张三",
  [privateKey]: "内部私密数据"
};

// 常规遍历无法获取 Symbol 属性
console.log(Object.keys(user)); // ["name"]
console.log(user[privateKey]); // 仅持有 key 才能访问
```

------

## 七、迭代器（Iterator）& 生成器（Generator）高阶

### 7.1 手动实现迭代器

所有可遍历对象都部署了 `Symbol.iterator` 接口，我们可以手动给普通对象添加迭代能力：

js









```
const obj = {
  list: [10, 20, 30],
  // 自定义迭代器
  [Symbol.iterator]() {
    let index = 0;
    const arr = this.list;
    return {
      next() {
        return index < arr.length 
          ? { value: arr[index++], done: false }
          : { value: undefined, done: true };
      }
    };
  }
};

// 现在可以用 for...of 遍历普通对象
for (const item of obj) {
  console.log(item);
}
```

### 7.2 Generator 生成器 传参 & 异常捕获

生成器 `next()` 可以传入参数，作为上一次 `yield` 的返回值，是异步分段执行的核心原理。

js









```
function* gen() {
  const res1 = yield "第一步";
  console.log(res1); // 来自 next 传参：hello

  const res2 = yield "第二步";
  console.log(res2); // world
}

const g = gen();
g.next(); 
g.next("hello");
g.next("world");
```

### 7.3 Generator 处理异步队列（经典实战）

多个异步任务按顺序串行执行，早期 `async/await` 未普及时，Generator 是主流方案：

js









```
// 模拟异步函数
function asyncTask(time, val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), time);
  });
}

function* taskQueue() {
  const r1 = yield asyncTask(1000, "任务1完成");
  console.log(r1);
  const r2 = yield asyncTask(1000, "任务2完成");
  console.log(r2);
}

// 自动执行生成器
function run(generator) {
  const g = generator();
  function next(data) {
    const { value, done } = g.next(data);
    if (!done) {
      value.then(res => next(res));
    }
  }
  next();
}

run(taskQueue);
```

------

## 八、Class 类 高阶特性与坑点

### 8.1 类的私有属性（ES6+ 延伸）

ES6 本身无原生私有属性，ES2022 新增 `#` 表示**真正私有属性 / 方法**，无法在类外部访问：

js









```
class Person {
  // 私有属性
  #age = 18;

  getAge() {
    return this.#age;
  }
}

const p = new Person();
console.log(p.getAge()); // 18
console.log(p.#age); // 外部直接访问 语法报错
```

### 8.2 静态属性 & 静态继承

静态属性 / 方法属于**类本身**，实例无法访问，子类可以继承父类静态成员：

js









```
class Parent {
  static type = "父类";
  static say() {
    console.log("静态方法");
  }
}

class Child extends Parent {}

Child.say(); // 继承成功
console.log(Child.type); // 父类
```

### 8.3 super 关键字 双重用法

1. `super()`：子类构造器中调用**父类构造函数**，必须放在第一行
2. `super.xxx`：访问父类的实例 / 静态方法

js









```
class Parent {
  constructor(name) {
    this.name = name;
  }
  hello() {
    console.log("父类方法");
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父类构造器
    this.age = age;
  }
  test() {
    super.hello(); // 调用父类方法
  }
}
```

### 8.4 类的易错点

1. 类**不存在变量提升**，必须先定义再使用
2. 类内部默认开启**严格模式**
3. 类方法不可枚举，不能用 `for...in` 遍历

------

## 九、Promise 进阶（链式调用、异常、并发）

### 9.1 Promise 链式调用 穿透特性

`then` 方法会返回新 Promise，实现链式调用；**如果 then 没有返回值，会自动传递 `undefined`**。

js









```
new Promise(resolve => resolve(10))
  .then(res => {
    console.log(res); // 10
    return 20;
  })
  .then(res => {
    console.log(res); // 20
  });
```

### 9.2 异常捕获 穿透规则

1. 链式中任意环节报错，会一直向后寻找最近的 `catch`
2. `catch` 之后的 `then` 会正常执行，链式不会中断

js









```
Promise.resolve()
  .then(() => {
    throw new Error("出错啦");
  })
  .then(() => {
    console.log("不会执行");
  })
  .catch(err => {
    console.log(err.message); // 出错啦
  })
  .then(() => {
    console.log("异常捕获后继续执行");
  });
```

### 9.3 Promise 并发方法 场景区分

1. **Promise.all**：全部成功才成功，一个失败直接失败（适合强依赖接口）
2. **Promise.allSettled**：等待所有任务完成，无论成功失败（适合批量请求，不关心单个成败）
3. **Promise.race**：竞速，谁先完成返回谁（适合超时拦截）
4. **Promise.any**：只要一个成功就成功，全部失败才失败

js









```
// 超时拦截经典用法
const req = fetch("/api/data");
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject("请求超时"), 3000);
});

Promise.race([req, timeout])
  .then(res => console.log("请求成功"))
  .catch(err => console.log(err));
```

------

## 十、ES6 模块化 进阶（循环依赖、导入导出细节）

### 10.1 导出重命名 & 导入重命名

解决命名冲突，大型项目高频使用：

js









```
// a.js 导出重命名
const num = 100;
export { num as total };

// 导入重命名
import { total as count } from "./a.js";
```

### 10.2 模块 循环依赖

ES6 模块支持循环依赖，原理是**模块加载为引用，而非完整拷贝**，CommonJS 则容易出现值丢失。

### 10.3 动态导入 import ()

ES6 静态 `import` 必须写在顶层，ES 动态导入 `import()` 返回 Promise，支持**按需加载、条件加载**（路由懒加载核心原理）：

js









```
// 条件动态导入
if (true) {
  import("./module.js").then(mod => {
    mod.foo();
  });
}
```

------

## 十一、字符串 & 正则 进阶扩展

### 11.1 字符串补位方法实战

`padStart` / `padEnd` 常用于时间、编号格式化：

js









```
// 时间格式化 01:09
const min = 1;
const sec = 9;
const time = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
console.log(time); // 01:09
```

### 11.2 正则 y 修饰符 & u 修饰符

- `u`：Unicode 模式，正确处理四字节字符（emoji、生僻字）
- `y`：粘连修饰符，匹配必须从**连续下一个位置**开始

------

## 十二、综合易错点 & 编码规范（进阶总结）

### 12.1 高频踩坑清单

1. `const` 只锁地址，不锁引用类型内部数据，嵌套对象建议配合 `Object.freeze`
2. 箭头函数慎用在对象方法、构造函数、DOM 事件
3. 解构默认值仅 `undefined` 生效，`null/0/""` 不触发
4. 浅拷贝无法处理嵌套对象，复杂场景使用深拷贝
5. `WeakSet/WeakMap` 键 / 值限制为对象，不可遍历
6. Promise 异常会链式穿透，合理分层捕获错误

### 12.2 进阶编码规范

1. 优先 `const`，其次 `let`，彻底废弃 `var`
2. 多层数据优先使用嵌套解构，简化取值代码
3. 批量接口请求根据业务选择 `all/allSettled/race`
4. 私有数据优先使用 `Symbol` 或类私有字段 `#`
5. 工程化项目统一使用 ES6 Module，摒弃 CommonJS