---
title: 面试高频题
---

# 面试高频题

整理前端面试中高频出现的问题，涵盖 JavaScript、CSS、框架、网络和工程化等核心领域。

## JavaScript 基础

### 数据类型有哪些？

```javascript
// 基本类型（7种）
undefined, null, boolean, number, string, symbol, bigint

// 引用类型
Object, Array, Function, Date, RegExp, Map, Set...

// 类型判断
typeof 42           // 'number'
typeof 'hello'      // 'string'
typeof true         // 'boolean'
typeof undefined    // 'undefined'
typeof null         // 'object' ⚠️ 历史遗留
typeof {}           // 'object'
typeof []           // 'object'
typeof function(){} // 'function'

// 精确判断
Array.isArray([])         // true
value === null            // 判断 null
Object.prototype.toString.call(value) // '[object Array]'
```

### 闭包是什么？

```javascript
// 闭包：函数和其词法环境的组合
function createCounter() {
  let count = 0; // 被闭包引用，不会回收
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2

// 应用：数据私有化、柯里化、防抖节流
// 注意：闭包会持有外部变量，可能导致内存泄漏
```

### 原型链

```javascript
// 每个对象都有 __proto__ 指向其构造函数的 prototype
// 原型链：对象 → 原型 → 原型的原型 → ... → null

function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function() {
  return `Hi, I'm ${this.name}`;
};

const person = new Person('张三');

person.sayHi();              // "Hi, I'm 张三"
person.hasOwnProperty('name'); // true
person instanceof Person;     // true

// 原型链查找
person → Person.prototype → Object.prototype → null
```

### this 指向

```javascript
// 1. 默认绑定（独立调用）
function foo() { console.log(this); }
foo(); // window（非严格模式）/ undefined（严格模式）

// 2. 隐式绑定（对象调用）
const obj = { name: '张三', greet() { console.log(this.name); } };
obj.greet(); // '张三'

// 3. 显式绑定（call/apply/bind）
function greet() { return this.name; }
greet.call({ name: '李四' });   // '李四'
greet.apply({ name: '王五' });  // '王五'
const bound = greet.bind({ name: '赵六' });
bound(); // '赵六'

// 4. new 绑定
function Person(name) { this.name = name; }
new Person('张三'); // this 指向新实例

// 5. 箭头函数（继承外层 this）
const obj = {
  name: '张三',
  greet: () => console.log(this.name), // ❌ this 指向外层
  hello() { console.log(this.name); },  // ✅ this 指向 obj
};

// 优先级：new > 显式 > 隐式 > 默认
```

## CSS 高频题

### BFC 是什么？

```css
/* BFC（块级格式化上下文）：独立的渲染区域，内部不影响外部 */

/* 触发 BFC */
overflow: hidden | auto | scroll;
display: flex | grid | inline-block | flow-root;
position: absolute | fixed;
float: left | right;

/* 应用场景 */
/* 1. 清除浮动 */
.clearfix { overflow: hidden; }
/* 或 */ .clearfix::after { content: ''; display: block; clear: both; }

/* 2. 防止 margin 合并 */
.container { overflow: hidden; }

/* 3. 自适应布局 */
.left { float: left; width: 200px; }
.right { overflow: hidden; /* 形成 BFC，不与浮动重叠 */ }
```

### Flex 布局

```css
.container {
  display: flex;
  justify-content: center;    /* 主轴对齐 */
  align-items: center;        /* 交叉轴对齐 */
  flex-direction: row;        /* 主轴方向 */
  flex-wrap: wrap;            /* 换行 */
  gap: 16px;                  /* 间距 */
}

.item {
  flex: 1;                    /* 等分剩余空间 */
  /* flex: flex-grow flex-shrink flex-basis */
  /* flex: 1 1 0% */
  /* flex: 0 0 200px; 固定宽度 */
}

/* 常见布局 */
/* 水平垂直居中 */
.center { display: flex; justify-content: center; align-items: center; }

/* 左右布局 */
.sidebar { flex: 0 0 200px; }
.main { flex: 1; }

/* 等分布局 */
.col { flex: 1; }
```

## 框架高频题

### Vue 响应式原理

```javascript
// Vue2 - Object.defineProperty
function defineReactive(obj, key, val) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addSub(Dep.target); // 依赖收集
      return val;
    },
    set(newVal) {
      val = newVal;
      dep.notify(); // 触发更新
    },
  });
}

// Vue3 - Proxy
function reactive(target) {
  return new Proxy(target, {
    get(obj, key) {
      track(obj, key); // 依赖收集
      return obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      trigger(obj, key); // 触发更新
      return true;
    },
  });
}

// Proxy 优势：
// 1. 可以监听属性新增/删除
// 2. 可以监听数组变化
// 3. 性能更好（懒代理）
```

### Vue3 为什么用 Proxy？

```
Object.defineProperty 的局限：
1. 无法检测属性新增/删除（需要 Vue.set/Vue.delete）
2. 无法检测数组索引和 length 变化
3. 需要递归遍历所有属性（初始化慢）
4. 每个属性都需要一个 Dep（内存开销大）

Proxy 的优势：
1. 可以检测属性新增/删除
2. 可以检测数组变化
3. 惰性代理（只有访问时才代理子对象）
4. 整体代理，不需要逐属性
```

### React Hooks 为什么不能条件调用？

```javascript
// Hooks 内部使用链表存储，按调用顺序匹配
// fiber.memoizedState → hook1 → hook2 → hook3 → ...

// ❌ 条件调用导致顺序错乱
if (condition) {
  const [a, setA] = useState(0); // 第1次渲染：hook1
}
const [b, setB] = useState(0);   // 第1次渲染：hook2
                                   // 第2次渲染：hook1（错位！）

// ✅ 条件逻辑放在 Hook 内部
const [a, setA] = useState(0);
if (condition) { /* 使用 a */ }
```

## 网络高频题

### 从输入 URL 到页面显示的过程？

```
1. DNS 解析 → 域名转换为 IP 地址
2. TCP 三次握手 → 建立连接
3. TLS 握手 → 建立 HTTPS 安全连接
4. 发送 HTTP 请求 → 请求 HTML 文档
5. 服务器处理请求 → 返回 HTML
6. 浏览器解析 → 构建 DOM Tree
7. 遇到 CSS → 构建 CSSOM Tree
8. 合并 → Render Tree
9. Layout → 计算布局
10. Paint → 绘制页面
11. 遇到 JS → 执行脚本（可能阻塞）
12. 执行完毕 → 继续解析
13. DOMContentLoaded → DOM 就绪
14. Load → 所有资源加载完成
```

### 跨域解决方案？

```
1. CORS（最常用）
   - 服务端设置 Access-Control-Allow-Origin
   - 简单请求直接发送
   - 非简单请求先发 OPTIONS 预检

2. 代理服务器
   - 开发环境：vite/webpack devServer proxy
   - 生产环境：Nginx 反向代理

3. JSONP（仅 GET）
   - 利用 <script> 标签不受同源限制
   - 回调函数获取数据

4. postMessage
   - 跨窗口通信
```

## 手写题

### 实现 Promise

```javascript
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e; };

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledTask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      };

      const rejectedTask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this.status === 'fulfilled') fulfilledTask();
      if (this.status === 'rejected') rejectedTask();
      if (this.status === 'pending') {
        this.onFulfilledCallbacks.push(fulfilledTask);
        this.onRejectedCallbacks.push(rejectedTask);
      }
    });

    return promise2;
  }
}
```

## 下一步

- 📏 [编码规范](/frontend/concepts/standards) - 代码规范
- 🎯 [实战训练](/frontend/concepts/practice/) - 项目实战
- 🗺️ [前端知识图谱](/frontend/concepts/roadmap) - 学习路线图
