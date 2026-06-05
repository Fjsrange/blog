---
title: Vite 构建
---

# Vite 构建

Vite 是下一代前端构建工具，利用浏览器原生 ESM 实现极速开发体验，基于 Rollup 进行生产构建。

## Vite vs Webpack

| 特性 | Webpack | Vite |
|------|---------|------|
| 开发启动 | 全量打包后启动 | 按需编译，毫秒启动 |
| 热更新 | 重新打包变更模块 | 即时 HMR |
| 构建工具 | 自身 | Rollup（生产） |
| 配置复杂度 | 较复杂 | 简洁 |
| 生态成熟度 | 非常成熟 | 快速成长中 |

## 创建项目

```bash
# Vue
npm create vite@latest my-app -- --template vue
npm create vite@latest my-app -- --template vue-ts

# React
npm create vite@latest my-app -- --template react
npm create vite@latest my-app -- --template react-ts

# Vanilla
npm create vite@latest my-app -- --template vanilla
npm create vite@latest my-app -- --template vanilla-ts
```

## 基本配置

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  // 插件
  plugins: [
    vue(),
    // react(),
  ],

  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // 开发服务器
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          echarts: ['echarts'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
    },
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
```

## 环境变量

```bash
# .env
VITE_APP_TITLE=我的应用

# .env.development
VITE_API_BASE_URL=http://localhost:8080

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

```javascript
// 使用环境变量
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE;
```

## 静态资源处理

```javascript
// 导入静态资源
import imgUrl from './logo.png'; // 返回构建后的 URL

// 动态导入
const modules = import.meta.glob('./views/*.vue');
// { './views/Home.vue': () => import('./views/Home.vue'), ... }

const modules = import.meta.globEager('./views/*.vue');
// 同步导入所有匹配模块

// public 目录
// /icon.png → 直接使用绝对路径引用
```

## 插件开发

```javascript
// 自定义 Vite 插件
function myPlugin() {
  return {
    name: 'my-plugin',

    // 构建开始前
    buildStart() {
      console.log('构建开始');
    },

    // 转换模块
    transform(code, id) {
      if (id.endsWith('.custom')) {
        return { code: transformCode(code), map: null };
      }
    },

    // 配置解析后
    configResolved(config) {
      console.log('模式:', config.mode);
    },

    // 热更新处理
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.custom')) {
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}
```

## 常用插件

```javascript
import { defineConfig } from 'vite';

// 框架插件
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import react from '@vitejs/plugin-react';
import reactSvg from 'vite-plugin-react-svg';

// 功能插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import viteCompression from 'vite-plugin-compression';
import { viteMockServe } from 'vite-plugin-mock';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-layouts';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),

    // SVG 图标
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/icons')],
      symbolId: 'icon-[name]',
    }),

    // Gzip 压缩
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // 10kb 以上才压缩
    }),

    // Mock 数据
    viteMockServe({
      mockPath: 'mock',
      localEnabled: dev,
    }),

    // 自动生成路由
    Pages({
      dirs: 'src/pages',
    }),

    // 自动生成布局
    Layouts({
      layoutsDirs: 'src/layouts',
    }),
  ],
});
```

## 下一步

- 📮 [包管理与发布](/frontend/advanced/modules/package) - npm 包管理
- 🏢 [Monorepo 管理](/frontend/advanced/modules/monorepo) - 多包管理
- 🧠 [核心概念](/frontend/concepts/) - 前端核心概念
