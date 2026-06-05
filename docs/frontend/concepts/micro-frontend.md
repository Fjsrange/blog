---
title: 微前端架构
---

# 微前端架构

微前端是将一个大型前端应用拆分为多个小型、独立子应用的架构模式，每个子应用可以独立开发、部署和运行。

## 为什么需要微前端？

| 问题 | 微前端的解决方案 |
|------|----------------|
| 应用越来越大，构建慢 | 拆分为独立子应用，各自构建 |
| 团队协作冲突 | 各团队独立开发自己的子应用 |
| 技术栈升级困难 | 新子应用可用新技术，旧应用渐进迁移 |
| 联合发布风险高 | 各子应用独立部署，互不影响 |

## 微前端方案对比

| 方案 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| qiankun | HTML Entry + JS 沙箱 | 成熟稳定、API 简洁 | 基于 single-spa，配置较多 |
| Module Federation | Webpack 5 模块共享 | 运行时共享、粒度细 | 依赖 Webpack 5 |
| wujie | WebComponent + iframe | 完美隔离、接入简单 | iframe 通信成本 |
| single-spa | 路由分发 | 生态丰富 | 上手成本高 |

## qiankun 实战

### 主应用配置

```javascript
// main-app/src/main.js
import { registerMicroApps, start, setDefaultMountApp } from 'qiankun';

// 注册子应用
registerMicroApps([
  {
    name: 'vue-app',
    entry: '//localhost:8081',
    container: '#subapp-container',
    activeRule: '/vue',
    props: { mainStore, token: getToken() },
  },
  {
    name: 'react-app',
    entry: '//localhost:8082',
    container: '#subapp-container',
    activeRule: '/react',
  },
]);

// 设置默认加载的子应用
setDefaultMountApp('/vue');

// 启动
start({
  sandbox: {
    strictStyleIsolation: true, // 严格样式隔离
    // experimentalStyleIsolation: true, // 实验性样式隔离
  },
  prefetch: 'all', // 预加载
});
```

### 子应用配置

```javascript
// vue-app/src/main.js
let instance = null;

function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// qiankun 生命周期
export async function bootstrap() {
  console.log('vue-app bootstrap');
}

export async function mount(props) {
  console.log('vue-app mount', props);
  render(props);
}

export async function unmount() {
  console.log('vue-app unmount');
  instance.$destroy();
  instance = null;
}
```

```javascript
// vue-app/vue.config.js
module.exports = {
  devServer: {
    port: 8081,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  configureWebpack: {
    output: {
      library: 'vueApp',
      libraryTarget: 'umd',
    },
  },
};
```

### 主子应用通信

```javascript
// 主应用 - 通过 props 传递
registerMicroApps([{
  name: 'vue-app',
  entry: '//localhost:8081',
  container: '#subapp-container',
  activeRule: '/vue',
  props: {
    mainStore,          // 传递主应用 store
    onGlobalChange: (state) => { /* 监听全局状态变化 */ },
  },
}]);

// 子应用 - 接收 props
export async function mount(props) {
  props.onGlobalChange((state) => {
    console.log('主应用状态变化:', state);
  });

  props.mainStore.dispatch('someAction');
}
```

## Module Federation

```javascript
// 远程应用 - 暴露模块
// webpack.config.js (remote-app)
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button.vue',
        './utils': './src/utils/index.js',
      },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.0.0' },
      },
    }),
  ],
};
```

```javascript
// 宿主应用 - 消费远程模块
// webpack.config.js (host-app)
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        remoteApp: 'remoteApp@http://localhost:3000/remoteEntry.js',
      },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.0.0' },
      },
    }),
  ],
};
```

```javascript
// 在宿主应用中使用远程组件
const RemoteButton = defineAsyncComponent(() =>
  import('remoteApp/Button')
);
```

## 微前端最佳实践

### 公共依赖处理

```javascript
// 1. externals + CDN
// 各子应用将 vue、react 等外部化，通过 CDN 加载

// 2. Module Federation shared
// 利用 shared 配置共享公共依赖

// 3. qiankun 的 prefetch
// 预加载子应用资源，减少白屏时间
```

### 样式隔离

```javascript
// 1. CSS Modules / Scoped CSS
// 各子应用使用 CSS Modules 或 scoped 样式

// 2. CSS 前缀
// 各子应用添加唯一前缀 .app-vue-xxx

// 3. qiankun 样式隔离
start({ sandbox: { strictStyleIsolation: true } });

// 4. Shadow DOM（注意兼容性）
```

### 路由管理

```javascript
// 主应用路由
const routes = [
  { path: '/', component: Home },
  { path: '/vue/*', component: SubAppContainer },  // 子应用路由
  { path: '/react/*', component: SubAppContainer },
];

// 子应用路由需要添加前缀
const router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? '/vue' : '/',
  routes: childRoutes,
});
```

## 下一步

- 🗺️ [前端知识图谱](/frontend/concepts/roadmap) - 学习路线图
- 💼 [面试高频题](/frontend/concepts/interview) - 面试准备
- 📏 [编码规范](/frontend/concepts/standards) - 代码规范
