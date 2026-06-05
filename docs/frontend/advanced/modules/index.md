---
title: 模块化概述
---

# 模块化概述

前端模块化是将代码拆分为独立、可复用模块的开发方式，是前端工程化的基石，从脚本加载到现代构建工具，模块化经历了漫长的演进。

## 模块化演进

```
全局函数 → 命名空间 → CommonJS → AMD → CMD → ES Modules
```

### 全局函数（最原始）

```javascript
// ❌ 容易命名冲突
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }
```

### 命名空间

```javascript
// 略有改善，但仍不安全
var MyMath = {
  add: function(a, b) { return a + b; },
  multiply: function(a, b) { return a * b; },
};
// MyMath.add = null; // 仍可被修改
```

### CommonJS（Node.js）

```javascript
// math.js
module.exports = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
};

// app.js
const { add, multiply } = require('./math');

// 特点：同步加载、运行时加载、值拷贝
```

### ES Modules（现代标准）

```javascript
// math.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export default class Calculator {}

// app.js
import Calculator, { add, multiply } from './math';

// 特点：静态分析、编译时加载、值引用、Tree Shaking
```

## 模块化规范对比

| 特性 | CommonJS | ES Modules |
|------|----------|------------|
| 语法 | require/module.exports | import/export |
| 加载方式 | 同步 | 异步 |
| 加载时机 | 运行时 | 编译时 |
| 输出 | 值的拷贝 | 值的引用 |
| Tree Shaking | ❌ | ✅ |
| 循环依赖 | 返回已执行部分 | 引用绑定 |
| 使用场景 | Node.js | 浏览器 + Node.js |

## 现代构建工具

```
Webpack → 功能全面、生态丰富、配置复杂
Vite   → 开发极快、配置简单、ESM 原生
Rollup → 库打包首选、Tree Shaking 优秀
esbuild → 极速编译、Go 语言编写
```

| 工具 | 定位 | 开发体验 | 构建速度 | 适用场景 |
|------|------|---------|---------|---------|
| Webpack | 全能打包器 | 一般 | 较慢 | 复杂企业级应用 |
| Vite | 下一代构建工具 | 优秀 | 极快 | 新项目首选 |
| Rollup | 库打包器 | 一般 | 快 | npm 包开发 |
| esbuild | 编译器 | - | 极快 | 底层工具 |

## 包管理

```
npm   → Node.js 自带、生态最大
yarn  → Facebook 出品、并行安装、确定性安装
pnpm  → 硬链接机制、磁盘空间节省、严格模式
```

| 特性 | npm | yarn | pnpm |
|------|-----|------|------|
| 安装速度 | 一般 | 快 | 最快 |
| 磁盘空间 | 多 | 多 | 少（硬链接） |
| 幽灵依赖 | ✅ 有 | ✅ 有 | ❌ 无 |
| Monorepo | workspaces | workspaces | workspace |
| 锁文件 | package-lock.json | yarn.lock | pnpm-lock.yaml |

## 下一步

- 📦 [Webpack 构建](/frontend/advanced/modules/webpack) - Webpack 详解
- ⚡ [Vite 构建](/frontend/advanced/modules/vite) - Vite 详解
- 📮 [包管理与发布](/frontend/advanced/modules/package) - npm 包管理
- 🏢 [Monorepo 管理](/frontend/advanced/modules/monorepo) - 多包管理
