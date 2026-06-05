---
title: Vue Router 路由
---

# Vue Router 路由

Vue Router 是 Vue.js 的官方路由管理器，它和 Vue.js 深度集成，让构建单页面应用变得易如反掌。

## 基本配置

```javascript
// router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // 路由懒加载
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('@/views/User.vue'),
    props: true, // 将路由参数作为 props 传递
  },
];

const router = new VueRouter({
  mode: 'history', // 'hash' | 'history'
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { x: 0, y: 0 };
  },
});

export default router;
```

```javascript
// main.js
import router from './router';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
```

## 路由导航

```html
<!-- 声明式导航 -->
<router-link to="/">首页</router-link>
<router-link :to="{ name: 'user', params: { id: 1 }}">用户</router-link>
<router-link :to="{ path: '/search', query: { q: 'vue' }}">搜索</router-link>

<!-- 自定义样式 -->
<router-link to="/" custom v-slot="{ navigate, isActive }">
  <li :class="{ active: isActive }" @click="navigate">首页</li>
</router-link>

<!-- 编程式导航 -->
<script>
export default {
  methods: {
    goToUser(id) {
      // 字符串路径
      this.$router.push('/user/' + id);

      // 对象
      this.$router.push({ name: 'user', params: { id } });

      // 带查询参数
      this.$router.push({ path: '/search', query: { q: 'vue' } });

      // 替换当前记录（不留历史）
      this.$router.replace({ name: 'home' });

      // 前进/后退
      this.$router.go(1);   // 前进
      this.$router.go(-1);  // 后退
      this.$router.back();  // 后退
    },
  },
};
</script>
```

## 动态路由

```javascript
const routes = [
  // 动态路径参数
  { path: '/user/:id', component: User },

  // 多个参数
  { path: '/post/:category/:id', component: Post },

  // 可选参数
  { path: '/optional/:id?', component: Optional },

  // 重复参数
  { path: '/files/:path*', component: Files }, // /files/a/b/c
  { path: '/files/:path+', component: Files }, // 至少匹配一个
];
```

```javascript
// 在组件中获取路由参数
export default {
  computed: {
    userId() {
      return this.$route.params.id;
    },
    searchQuery() {
      return this.$route.query.q;
    },
  },
  watch: {
    '$route.params.id'(newId) {
      this.loadUser(newId);
    },
  },
};

// 使用 props 解耦
export default {
  props: ['id'], // 路由参数直接作为 props
  created() {
    console.log(this.id);
  },
};
```

## 嵌套路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: '',           // /user/:id
        component: UserHome,
      },
      {
        path: 'profile',    // /user/:id/profile
        component: UserProfile,
      },
      {
        path: 'posts',      // /user/:id/posts
        component: UserPosts,
      },
    ],
  },
];
```

```html
<!-- User.vue -->
<template>
  <div class="user">
    <h2>用户 {{ $route.params.id }}</h2>
    <nav>
      <router-link to="">首页</router-link>
      <router-link to="profile">资料</router-link>
      <router-link to="posts">文章</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
```

## 导航守卫

### 全局守卫

```javascript
// 前置守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['user/isLoggedIn'];

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

// 后置钩子
router.afterEach((to, from) => {
  document.title = to.meta.title || '我的应用';
});

// 解析守卫（在组件内守卫和异步路由组件解析后调用）
router.beforeResolve((to, from, next) => {
  next();
});
```

### 路由独享守卫

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (store.getters['user/isAdmin']) {
        next();
      } else {
        next({ name: 'forbidden' });
      }
    },
  },
];
```

### 组件内守卫

```javascript
export default {
  // 进入组件前（不能访问 this，可用 next(vm => {})）
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loadUser();
    });
  },

  // 路由改变时（复用组件，如 /user/1 → /user/2）
  beforeRouteUpdate(to, from, next) {
    this.loadUser(to.params.id);
    next();
  },

  // 离开组件前
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirm = window.confirm('有未保存的更改，确定离开吗？');
      next(confirm);
    } else {
      next();
    }
  },
};
```

### 守卫执行顺序

```
1. beforeRouteLeave（离开组件）
2. beforeEach（全局前置）
3. beforeRouteUpdate（复用组件）
4. beforeEnter（路由配置）
5. 解析异步路由组件
6. beforeRouteEnter（进入组件）
7. beforeResolve（全局解析）
8. afterEach（全局后置）
9. DOM 更新
10. beforeRouteEnter 的 next 回调
```

## 路由元信息

```javascript
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      title: '仪表盘',
      requiresAuth: true,
      roles: ['admin', 'editor'],
    },
  },
  {
    path: '/login',
    component: Login,
    meta: { title: '登录', guest: true },
  },
];

// 在守卫中使用
router.beforeEach((to) => {
  document.title = to.meta.title || '默认标题';
});
```

## 过渡效果

```html
<template>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
```

## 数据获取

```javascript
// 方式一：导航完成后获取（用户体验好）
export default {
  data() {
    return { post: null };
  },
  watch: {
    '$route': 'fetchData',
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        this.post = await api.getPost(this.$route.params.id);
      } finally {
        this.loading = false;
      }
    },
  },
};

// 方式二：导航完成前获取（确保数据就绪）
export default {
  async beforeRouteEnter(to, from, next) {
    const post = await api.getPost(to.params.id);
    next(vm => vm.setData(post));
  },
  async beforeRouteUpdate(to, from, next) {
    this.post = null;
    const post = await api.getPost(to.params.id);
    this.setData(post);
    next();
  },
  methods: {
    setData(post) {
      this.post = post;
    },
  },
};
```

## 404 与重定向

```javascript
const routes = [
  // 重定向
  { path: '/home', redirect: '/' },
  { path: '/old-path', redirect: { name: 'newName' } },
  { path: '/search', redirect: to => ({ path: '/search-new', query: { q: to.query.q } }) },

  // 404 匹配（放在最后）
  { path: '*', component: NotFound }, // Vue Router 3.x
];
```

## 下一步

- ⚡ [Vue3 基础入门](/frontend/frameworks/vue3/) - 学习 Vue3 新特性
- 🧩 [组件系统](/frontend/frameworks/vue2/components) - 组件进阶用法
- 🗂️ [Vuex 状态管理](/frontend/frameworks/vue2/vuex) - 全局状态管理
