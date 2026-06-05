---
title: Monorepo 管理
---

# Monorepo 管理

Monorepo（单体仓库）是将多个相关项目放在同一个仓库中管理的开发策略，便于代码共享、统一构建和版本管理。

## Monorepo vs Polyrepo

| 特性 | Monorepo | Polyrepo |
|------|----------|----------|
| 代码位置 | 一个仓库 | 多个仓库 |
| 代码共享 | 直接引用 | npm 包 |
| 版本管理 | 统一管理 | 独立版本 |
| 构建部署 | 可统一可独立 | 独立 |
| 协作成本 | 低 | 高 |
| 仓库体积 | 大 | 小 |

## 项目结构

```
my-monorepo/
├── packages/
│   ├── ui/              # UI 组件库
│   │   ├── package.json
│   │   └── src/
│   ├── utils/           # 工具库
│   │   ├── package.json
│   │   └── src/
│   └── shared/          # 共享类型/常量
│       ├── package.json
│       └── src/
├── apps/
│   ├── web/             # Web 应用
│   │   ├── package.json
│   │   └── src/
│   └── admin/           # 管理后台
│       ├── package.json
│       └── src/
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

## pnpm Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```json
// 根 package.json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r run build",
    "lint": "pnpm -r run lint",
    "clean": "pnpm -r run clean"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 包间引用

```json
// apps/web/package.json
{
  "name": "@my/app-web",
  "dependencies": {
    "@my/ui": "workspace:*",
    "@my/utils": "workspace:*",
    "@my/shared": "workspace:*"
  }
}
```

```json
// packages/ui/package.json
{
  "name": "@my/ui",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "vue": "^3.0.0"
  }
}
```

### 常用命令

```bash
# 安装所有依赖
pnpm install

# 给指定包添加依赖
pnpm add axios --filter @my/app-web
pnpm add lodash -D --filter @my/utils

# 包间依赖
pnpm add @my/utils --filter @my/app-web

# 运行指定包的脚本
pnpm run dev --filter @my/app-web
pnpm run build --filter @my/ui

# 并行运行所有包的脚本
pnpm -r --parallel run dev

# 按依赖顺序运行
pnpm -r run build

# 清理所有 node_modules
pnpm -r exec rm -rf node_modules
```

## TypeScript 配置

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "paths": {
      "@my/*": ["./packages/*/src"]
    }
  }
}
```

```json
// packages/ui/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

## Changesets 版本管理

```bash
# 安装
pnpm add -Dw @changesets/cli
pnpm changeset init
```

```json
// package.json scripts
{
  "changeset": "changeset",
  "version": "changeset version",
  "release": "pnpm run build && changeset publish"
}
```

```bash
# 工作流程
# 1. 开发完成后创建 changeset
pnpm changeset
# 选择变更的包 → 填写变更类型（patch/minor/major）→ 填写变更描述

# 2. 版本升级
pnpm changeset version
# 自动更新 package.json 版本号和 CHANGELOG.md

# 3. 发布
pnpm run release
# 构建并发布到 npm
```

## Turborepo 加速构建

```bash
pnpm add -Dw turbo
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

```bash
# Turborepo 利用缓存加速构建
turbo build    # 首次全量构建
turbo build    # 第二次命中缓存，秒级完成
turbo build --force  # 强制重新构建
```

## 下一步

- 🧠 [核心概念](/frontend/concepts/) - 前端核心概念
- 🎯 [实战训练](/frontend/concepts/practice/) - 项目实战
- 🏗️ [设计模式](/frontend/advanced/senior/design-patterns) - 前端设计模式
