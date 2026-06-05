---
title: 异步编程
---

# 异步编程

JavaScript 是单线程语言，通过异步编程机制处理耗时操作（网络请求、文件读取、定时器等），避免阻塞主线程。

## 为什么需要异步？

```javascript
// ❌ 同步执行 - 页面卡死 3 秒
console.log('开始');
// sleep(3000) // 假设这是同步阻塞
console.log('结束');

// ✅ 异步执行 - 不阻塞主线程
console.log('开始');
setTimeout(() => {
  console.log('3秒后执行');
}, 3000);
console.log('结束');
// 输出：开始 → 结束 → 3秒后执行
```

## 回调函数

```javascript
// 最早的异步方式 - 回调地狱
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetail(orders[0].id, (detail) => {
      getComments(detail.id, (comments) => {
        // 嵌套越来越深...
      });
    });
  });
});

// 回调地狱的问题：
// 1. 代码可读性差
// 2. 错误处理困难
// 3. 难以维护和扩展
```

## Promise

### 基本用法

```javascript
// 创建 Promise
const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('网络错误'));
    xhr.send();
  });
};

// 使用 Promise
fetchData('/api/users')
  .then(data => {
    console.log('成功:', data);
    return fetchData(`/api/users/${data[0].id}/posts`);
  })
  .then(posts => {
    console.log('文章:', posts);
  })
  .catch(error => {
    console.error('失败:', error);
  })
  .finally(() => {
    console.log('请求完成');
  });
```

### Promise 静态方法

```javascript
// Promise.all - 全部成功才成功，一个失败即失败
const results = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json()),
]);
// results[0] = users, results[1] = posts, results[2] = comments

// Promise.allSettled - 等待全部完成，无论成功失败
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
]);
// results = [
//   { status: 'fulfilled', value: [...] },
//   { status: 'rejected', reason: Error }
// ]

// Promise.race - 返回最先完成的结果（无论成败）
const fastest = await Promise.race([
  fetch('/cdn1/data'),
  fetch('/cdn2/data'),
]);

// Promise.any - 返回最先成功的结果（忽略失败）
const first = await Promise.any([
  fetch('/cdn1/data'),
  fetch('/cdn2/data'),
]);

// Promise.resolve / Promise.reject
const p1 = Promise.resolve(42);     // 立即成功的 Promise
const p2 = Promise.reject('错误');   // 立即失败的 Promise
```

### Promise 链式调用

```javascript
// 链式调用解决回调地狱
fetchData('/api/user/1')
  .then(user => {
    console.log('用户:', user);
    return fetchData(`/api/users/${user.id}/posts`);
  })
  .then(posts => {
    console.log('文章:', posts);
    return fetchData(`/api/posts/${posts[0].id}/comments`);
  })
  .then(comments => {
    console.log('评论:', comments);
  })
  .catch(error => {
    // 统一错误处理
    console.error('出错了:', error);
  });

// 错误处理的两种方式
fetchData('/api/data')
  .then(handleSuccess, handleError)     // 只捕获上一步的错误
  .catch(handleAnyError);               // 捕获链中所有错误（推荐）
```

## async/await

```javascript
// async 函数自动返回 Promise
async function getUserPosts(userId) {
  try {
    const user = await fetchData(`/api/users/${userId}`);
    const posts = await fetchData(`/api/users/${user.id}/posts`);
    return { user, posts };
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error; // 继续抛出
  }
}

// 调用 async 函数
const result = await getUserPosts(1);
// 或
getUserPosts(1).then(result => console.log(result));
```

### 并行执行

```javascript
// ❌ 串行 - 总耗时 = 请求1 + 请求2
async function loadSerial() {
  const users = await fetch('/api/users').then(r => r.json());
  const posts = await fetch('/api/posts').then(r => r.json());
  return { users, posts };
}

// ✅ 并行 - 总耗时 = max(请求1, 请求2)
async function loadParallel() {
  const [users, posts] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
  ]);
  return { users, posts };
}
```

### 循环中的异步

```javascript
// ❌ forEach 不等待 async
items.forEach(async (item) => {
  await processItem(item); // 不会等待！
});

// ✅ for...of 串行处理
async function processSerial(items) {
  for (const item of items) {
    await processItem(item);
  }
}

// ✅ Promise.all 并行处理
async function processParallel(items) {
  await Promise.all(items.map(item => processItem(item)));
}

// ✅ 控制并发数
async function processWithConcurrency(items, limit = 3) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = processItem(item).then(result => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}
```

## 事件循环

```javascript
// JavaScript 执行顺序
console.log('1. 同步代码');

setTimeout(() => {
  console.log('2. 宏任务（setTimeout）');
}, 0);

Promise.resolve().then(() => {
  console.log('3. 微任务（Promise）');
});

queueMicrotask(() => {
  console.log('4. 微任务（queueMicrotask）');
});

console.log('5. 同步代码');

// 输出顺序：1 → 5 → 3 → 4 → 2
```

### 宏任务与微任务

| 类型 | 示例 |
|------|------|
| **宏任务** | setTimeout、setInterval、I/O、UI 渲染、requestAnimationFrame |
| **微任务** | Promise.then、MutationObserver、queueMicrotask |

```
执行顺序：
同步代码 → 微任务队列（清空） → 宏任务（一个） → 微任务队列（清空） → ...
```

## 实用模式

```javascript
// 超时控制
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    ),
  ]);
}

// 重试机制
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url).then(r => r.json());
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

// 缓存请求结果
function createCachedFetch() {
  const cache = new Map();
  return async (url) => {
    if (cache.has(url)) return cache.get(url);
    const data = await fetch(url).then(r => r.json());
    cache.set(url, data);
    return data;
  };
}
```

## 下一步

- 🎪 [事件机制](/frontend/basics/javascript/events) - 事件冒泡与委托
- ⚡ [Vue2 基础入门](/frontend/frameworks/vue2/) - 学习 Vue 框架
- 📊 [图表基础入门](/frontend/advanced/charts/) - 数据可视化
