---
title: Vuex 状态管理
---

# Vuex 状态管理

Vuex 是 Vue2 的官方状态管理库，采用集中式存储管理应用的所有组件状态，并以相应的规则保证状态的可预测变化。

## 核心概念

```
                    ┌─────────────┐
          dispatch  │   Actions   │  commit
  Components ──────────────────────────→ Mutations ──→ State ──→ Components
                    │             │         ↑
                    └─────────────┘         │
                         异步操作           同步修改
```

| 概念 | 说明 | 特点 |
|------|------|------|
| State | 状态数据 | 响应式，组件通过计算属性获取 |
| Getters | 计算属性 | 基于 State 派生数据 |
| Mutations | 同步修改 | 唯一修改 State 的方式 |
| Actions | 异步操作 | 提交 Mutation，可含异步 |
| Modules | 模块拆分 | 大型应用拆分 Store |

## 基本使用

```javascript
// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    user: null,
    todos: [],
    loading: false,
  },

  getters: {
    // 获取 state
    doneTodos: (state) => {
      return state.todos.filter(todo => todo.done);
    },

    // 获取 getters 中的其他值
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length;
    },

    // 返回函数（支持传参）
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id);
    },
  },

  mutations: {
    // 同步修改 state
    INCREMENT(state) {
      state.count++;
    },

    // 带载荷（payload）
    SET_USER(state, user) {
      state.user = user;
    },

    // 对象风格的提交
    SET_TODOS(state, { todos, total }) {
      state.todos = todos;
    },
  },

  actions: {
    // 异步操作
    async fetchUser({ commit }, userId) {
      commit('SET_LOADING', true);
      try {
        const user = await api.getUser(userId);
        commit('SET_USER', user);
        return user;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // 组合 Action
    async fetchUserAndPosts({ dispatch }, userId) {
      const user = await dispatch('fetchUser', userId);
      await dispatch('fetchPosts', user.id);
    },
  },
});
```

## 在组件中使用

```javascript
// 方式一：直接访问
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
    doneTodos() {
      return this.$store.getters.doneTodos;
    },
  },
  methods: {
    increment() {
      this.$store.commit('INCREMENT');
    },
    fetchUser() {
      this.$store.dispatch('fetchUser', 1);
    },
  },
};

// 方式二：辅助函数（推荐）
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    // 映射 state
    ...mapState(['count', 'user', 'loading']),
    // 重命名
    ...mapState({ myCount: 'count' }),

    // 映射 getters
    ...mapGetters(['doneTodos', 'doneTodosCount']),
    ...mapGetters({ todoCount: 'doneTodosCount' }),
  },
  methods: {
    // 映射 mutations
    ...mapMutations(['INCREMENT', 'SET_USER']),
    ...mapMutations({ addCount: 'INCREMENT' }),

    // 映射 actions
    ...mapActions(['fetchUser', 'fetchPosts']),
    ...mapActions({ loadUser: 'fetchUser' }),
  },
};
```

## Modules 模块化

```javascript
// store/modules/user.js
const userModule = {
  namespaced: true, // 重要！启用命名空间

  state: {
    info: null,
    token: '',
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.info?.name ?? '未登录',
  },

  mutations: {
    SET_INFO(state, info) {
      state.info = info;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    LOGOUT(state) {
      state.info = null;
      state.token = '';
    },
  },

  actions: {
    async login({ commit }, { username, password }) {
      const { token, user } = await api.login(username, password);
      commit('SET_TOKEN', token);
      commit('SET_INFO', user);
      localStorage.setItem('token', token);
    },
    logout({ commit }) {
      commit('LOGOUT');
      localStorage.removeItem('token');
    },
  },
};

export default userModule;
```

```javascript
// store/index.js
import user from './modules/user';
import cart from './modules/cart';
import products from './modules/products';

export default new Vuex.Store({
  modules: {
    user,
    cart,
    products,
  },
});
```

### 在组件中使用模块

```javascript
// 命名空间模块的访问方式
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    // 方式一：完整路径
    token() {
      return this.$store.state.user.token;
    },
    isLoggedIn() {
      return this.$store.getters['user/isLoggedIn'];
    },

    // 方式二：辅助函数 + 模块路径
    ...mapState('user', ['info', 'token']),
    ...mapGetters('user', ['isLoggedIn', 'userName']),
  },
  methods: {
    ...mapActions('user', ['login', 'logout']),

    handleLogin() {
      this.login({ username: 'admin', password: '123456' });
    },
  },
};

// 方式三：createNamespacedHelpers（推荐）
import { createNamespacedHelpers } from 'vuex';
const { mapState, mapGetters, mapActions } = createNamespacedHelpers('user');

export default {
  computed: {
    ...mapState(['info', 'token']),
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['login', 'logout']),
  },
};
```

## 插件

```javascript
// 持久化插件
const persistencePlugin = (store) => {
  // 初始化时从 localStorage 恢复
  const saved = localStorage.getItem('vuex');
  if (saved) {
    store.replaceState(JSON.parse(saved));
  }

  // 每次 mutation 后保存
  store.subscribe((mutation, state) => {
    localStorage.setItem('vuex', JSON.stringify(state));
  });
};

// 日志插件（开发环境）
const loggerPlugin = (store) => {
  store.subscribe((mutation, state) => {
    console.log(`[Vuex] ${mutation.type}`, mutation.payload);
  });
};

// 使用插件
export default new Vuex.Store({
  plugins: [persistencePlugin, loggerPlugin],
});

// 推荐：使用 vuex-persistedstate
import createPersistedState from 'vuex-persistedstate';

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'my-app',
      paths: ['user.token', 'user.info'], // 只持久化指定路径
    }),
  ],
});
```

## 严格模式

```javascript
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  // 严格模式下，直接修改 state（非 mutation）会抛出错误
  // 仅在开发环境启用，生产环境关闭（性能考虑）
});
```

## 下一步

- 🛤️ [Vue Router 路由](/frontend/frameworks/vue2/router) - 路由管理
- ⚡ [Vue3 基础入门](/frontend/frameworks/vue3/) - 学习 Vue3 新特性
- 🐻 [Pinia 状态管理](/frontend/frameworks/vue3/pinia) - Vue3 的新状态管理
