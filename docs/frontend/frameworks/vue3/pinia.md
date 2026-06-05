---
title: Pinia 状态管理
---

# Pinia 状态管理

Pinia 是 Vue3 的官方状态管理库，是 Vuex 的继任者，更简洁、更类型安全、支持组合式 API。

## Pinia vs Vuex

| 特性 | Vuex | Pinia |
|------|------|-------|
| API 风格 | Mutations + Actions | 只有 Actions |
| TypeScript | 支持较弱 | 原生支持 |
| 模块化 | 嵌套模块 | 扁平 Store |
| 代码量 | 较多 | 更少 |
| Composition API | 不友好 | 原生支持 |
| DevTools | ✅ | ✅ |

## 基本使用

```javascript
// stores/counter.js
import { defineStore } from 'pinia';

// 选项式 Store（类似 Vuex）
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: '计数器',
  }),

  getters: {
    doubleCount: (state) => state.count * 2,

    // 使用 this 访问其他 getter
    doublePlusOne() {
      return this.doubleCount + 1;
    },
  },

  actions: {
    increment() {
      this.count++; // 直接修改！无需 mutation
    },

    async fetchCount() {
      const count = await api.getCount();
      this.count = count; // 异步也直接修改
    },
  },
});
```

### 组合式 Store（推荐）

```javascript
// stores/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // state
  const info = ref(null);
  const token = ref('');

  // getters
  const isLoggedIn = computed(() => !!token.value);
  const userName = computed(() => info.value?.name ?? '未登录');

  // actions
  async function login(username, password) {
    const { token: t, user } = await api.login(username, password);
    token.value = t;
    info.value = user;
    localStorage.setItem('token', t);
  }

  function logout() {
    token.value = '';
    info.value = null;
    localStorage.removeItem('token');
  }

  return {
    info,
    token,
    isLoggedIn,
    userName,
    login,
    logout,
  };
});
```

## 在组件中使用

```vue
<script setup>
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const counter = useCounterStore();

// ❌ 直接解构会丢失响应式
const { count, name } = counter;

// ✅ 使用 storeToRefs 解构 state 和 getter
const { count, name, doubleCount } = storeToRefs(counter);

// ✅ 方法可以直接解构
const { increment } = counter;

// 也可以直接访问
counter.count++;
counter.increment();
</script>

<template>
  <p>{{ counter.count }}</p>
  <p>{{ counter.doubleCount }}</p>
  <button @click="counter.increment()">+1</button>
</template>
```

## 修改 State

```javascript
const store = useCounterStore();

// 方式一：直接修改
store.count++;

// 方式二：$patch 批量修改
store.$patch({
  count: store.count + 1,
  name: '新名称',
});

// 方式三：$patch 函数（推荐批量修改）
store.$patch((state) => {
  state.count++;
  state.name = '新名称';
});

// 方式四：$reset 重置到初始状态
store.$reset();

// 替换整个 state
store.$state = { count: 0, name: '重置' };
```

## Store 间交互

```javascript
// stores/cart.js
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),

  getters: {
    // 使用其他 store
    summary(state) {
      const userStore = useUserStore();
      return `${userStore.userName} 的购物车：${state.items.length} 件商品`;
    },
  },

  actions: {
    // 在 action 中使用其他 store
    async checkout() {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) {
        throw new Error('请先登录');
      }
      await api.checkout(userStore.token, this.items);
    },
  },
});
```

## 订阅 State 变化

```javascript
const store = useCounterStore();

// 订阅 state 变化
store.$subscribe((mutation, state) => {
  console.log('变化类型:', mutation.type); // 'direct' | 'patch object' | 'patch function'
  console.log('storeId:', mutation.storeId);
  // 持久化
  localStorage.setItem('counter', JSON.stringify(state));
});

// 订阅 action
store.$onAction(({ name, args, after, onError }) => {
  const startTime = Date.now();

  after((result) => {
    console.log(`${name} 执行成功，耗时 ${Date.now() - startTime}ms`);
  });

  onError((error) => {
    console.error(`${name} 执行失败:`, error);
  });
});
```

## 插件

```javascript
// 持久化插件
function piniaPluginPersist({ store }) {
  const saved = localStorage.getItem(store.$id);
  if (saved) {
    store.$patch(JSON.parse(saved));
  }

  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state));
  });
}

// 注册插件
const pinia = createPinia();
pinia.use(piniaPluginPersist);

// 推荐：使用 pinia-plugin-persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 在 store 中配置
export const useUserStore = defineStore('user', {
  state: () => ({ token: '', info: null }),
  persist: {
    key: 'my-user',
    storage: sessionStorage,
    paths: ['token'], // 只持久化 token
  },
});
```

## 在组件外使用

```javascript
// 在路由守卫中使用
import { useUserStore } from '@/stores/user';

router.beforeEach((to) => {
  const userStore = useUserStore(); // 必须在 pinia 安装后使用
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return { name: 'login' };
  }
});

// 在普通 JS/TS 中使用
import { useUserStore } from '@/stores/user';

export async function apiRequest(url, options = {}) {
  const userStore = useUserStore();
  const headers = {
    Authorization: `Bearer ${userStore.token}`,
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
}
```

## 下一步

- 🔄 [Vue3 生命周期](/frontend/frameworks/vue3/lifecycle) - 生命周期详解
- 🪝 [自定义 Hooks](/frontend/frameworks/vue3/hooks) - 逻辑复用进阶
- 🔥 [React 基础入门](/frontend/frameworks/react/) - 学习 React 框架
