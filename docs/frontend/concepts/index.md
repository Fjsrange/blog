---
title: 前端概念总览
---

# 前端概念总览

理解底层原理和核心概念，是从"会用"到"精通"的关键。本栏目涵盖浏览器原理、网络协议、工程化和架构等核心知识。

## 核心概念地图

```
前端核心概念
├── 浏览器原理
│   ├── 渲染流程（DOM → CSSOM → Render Tree → Layout → Paint）
│   ├── 事件循环（宏任务 → 微任务 → 渲染）
│   ├── 垃圾回收（标记清除、引用计数）
│   └── 进程与线程（多进程架构）
├── 网络与 HTTP
│   ├── HTTP 协议（1.0 → 1.1 → 2 → 3）
│   ├── HTTPS 与 TLS
│   ├── 缓存策略（强缓存 + 协商缓存）
│   ├── 跨域与 CORS
│   └── WebSocket
├── 前端工程化
│   ├── 代码规范（ESLint + Prettier）
│   ├── Git 工作流
│   ├── CI/CD 自动化
│   └── 自动化测试
└── 微前端架构
    ├── 乾坤（qiankun）
    ├── Module Federation
    ├── 无界（wujie）
    └── 沙箱隔离
```

## 浏览器渲染流程

```
HTML → DOM Tree
CSS  → CSSOM Tree
         ↓
    Render Tree（渲染树）
         ↓
    Layout（布局/回流）
         ↓
    Paint（绘制/重绘）
         ↓
    Composite（合成）
         ↓
    显示在屏幕上
```

## 事件循环

```javascript
// 执行顺序
console.log('1. 同步代码');

setTimeout(() => console.log('2. 宏任务'), 0);

Promise.resolve().then(() => console.log('3. 微任务'));

console.log('4. 同步代码');

// 输出：1 → 4 → 3 → 2
```

## HTTP 缓存

```
第一次请求：
浏览器 → 服务器（获取资源 + 缓存头）

再次请求：
├── 强缓存有效？→ 是 → 使用缓存（200 from cache）
└── 强缓存过期？
    ├── 协商缓存 → 未修改 → 304 Not Modified
    └── 协商缓存 → 已修改 → 200 + 新资源
```

## 前端工程化流程

```
代码编写 → 代码检查 → 单元测试 → 构建 → 部署
   ↓          ↓          ↓        ↓       ↓
 Editor    ESLint     Vitest   Vite    CI/CD
           Prettier            Webpack  Docker
           Husky               Rollup   K8s
```

## 学习建议

```
1. 浏览器原理 → 理解页面如何渲染，写出高性能代码
2. 网络协议 → 理解请求如何传输，优化网络性能
3. 前端工程化 → 理解团队如何协作，提升开发效率
4. 微前端架构 → 理解大型应用如何拆分，解决复杂度问题
```

## 下一步

- 🌐 [浏览器原理](/frontend/concepts/browser) - 深入浏览器
- 📡 [网络与 HTTP](/frontend/concepts/network) - 网络协议详解
- 🔧 [前端工程化](/frontend/concepts/engineering) - 工程化实践
- 🏗️ [微前端架构](/frontend/concepts/micro-frontend) - 微前端方案
- 🗺️ [前端知识图谱](/frontend/concepts/roadmap) - 学习路线图
- 💼 [面试高频题](/frontend/concepts/interview) - 面试准备
- 📏 [编码规范](/frontend/concepts/standards) - 代码规范
