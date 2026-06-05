---
title: 包管理与发布
---

# 包管理与发布

npm 包管理是前端工程化的重要环节，涵盖依赖管理、版本控制、包发布和私有仓库等内容。

## npm 常用命令

```bash
# 初始化项目
npm init
npm init -y

# 安装依赖
npm install                    # 安装所有依赖
npm install package-name       # 安装生产依赖
npm install package-name -D    # 安装开发依赖
npm install package-name -g    # 全局安装
npm install package@version    # 安装指定版本

# 卸载依赖
npm uninstall package-name
npm uninstall package-name -D
npm uninstall package-name -g

# 更新依赖
npm update                     # 更新所有依赖
npm update package-name        # 更新指定依赖
npm outdated                   # 查看过时依赖

# 查看信息
npm list                       # 查看已安装依赖
npm list --depth=0             # 只看顶层依赖
npm view package-name          # 查看包信息
npm view package-name versions # 查看所有版本

# 运行脚本
npm run dev
npm run build
npm run lint
npm run test

# 清理缓存
npm cache clean --force
```

## pnpm 常用命令

```bash
# 安装 pnpm
npm install -g pnpm

# pnpm 命令与 npm 基本一致
pnpm install
pnpm add package-name
pnpm add package-name -D
pnpm remove package-name
pnpm update
pnpm run dev

# pnpm 特有
pnpm store path              # 查看存储路径
pnpm store prune             # 清理未引用的包
pnpm why package-name        # 查看依赖原因
```

## package.json 详解

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "包描述",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src/",
    "test": "vitest",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["vue", "component"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "dependencies": {
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.0.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### 依赖类型

| 类型 | 说明 | 示例 |
|------|------|------|
| dependencies | 运行时依赖 | vue, axios, lodash |
| devDependencies | 开发时依赖 | vite, eslint, typescript |
| peerDependencies | 宿主依赖 | vue（插件需要宿主提供） |
| optionalDependencies | 可选依赖 | fsevents（仅 macOS） |

### 版本号规则

```
语义化版本（SemVer）：主版本.次版本.修订号
1.0.0 → 2.0.0（不兼容的变更）
1.0.0 → 1.1.0（向后兼容的新功能）
1.0.0 → 1.0.1（向后兼容的修复）

范围符号：
^1.2.3  → >=1.2.3 <2.0.0（兼容次版本更新）
~1.2.3  → >=1.2.3 <1.3.0（兼容修订号更新）
1.2.x   → >=1.2.0 <1.3.0
*       → 任意版本
```

## 发布 npm 包

```bash
# 1. 注册 npm 账号
npm adduser
# 或在 https://www.npmjs.com 注册

# 2. 登录
npm login

# 3. 检查包名是否可用
npm view my-package-name

# 4. 构建包
npm run build

# 5. 发布
npm publish
npm publish --access public  # 公开发布

# 6. 更新版本
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
npm publish

# 7. 撤销发布（24小时内）
npm unpublish my-package@1.0.0
```

## 库的打包配置

```javascript
// vite.config.js - 库模式打包
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `my-lib.${format}.js`,
    },
    rollupOptions: {
      // 外部化不需要打包的依赖
      external: ['vue', 'react'],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
        },
      },
    },
  },
});
```

## 私有仓库

```bash
# 使用 Verdaccio 搭建私有 npm 仓库
npm install -g verdaccio
verdaccio  # 默认端口 4873

# 设置 registry
npm set registry http://localhost:4873

# 添加用户
npm adduser --registry http://localhost:4873

# 发布到私有仓库
npm publish --registry http://localhost:4873

# 使用 .npmrc 配置
# @mycompany:registry=http://npm.mycompany.com
```

## 下一步

- 🏢 [Monorepo 管理](/frontend/advanced/modules/monorepo) - 多包管理
- 🧠 [核心概念](/frontend/concepts/) - 前端核心概念
- 🎯 [实战训练](/frontend/concepts/practice/) - 项目实战
