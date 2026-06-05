---
title: 后台管理系统
---

# 后台管理系统

后台管理系统是前端开发中最常见的项目类型，涵盖权限控制、数据表格、表单处理等企业级核心功能。

## 项目概述

```
功能模块：
├── 用户认证
│   ├── 登录 / 登出
│   ├── Token 管理
│   └── 路由守卫
├── 布局系统
│   ├── 侧边栏导航
│   ├── 顶部导航栏
│   ├── 面包屑
│   └── 标签页
├── 权限管理
│   ├── 角色管理
│   ├── 菜单权限
│   └── 按钮权限
├── 数据表格
│   ├── 列表展示
│   ├── 搜索筛选
│   ├── 分页
│   └── 增删改查
├── 表单处理
│   ├── 动态表单
│   ├── 表单验证
│   └── 表单联动
└── 系统功能
    ├── 仪表盘
    ├── 文件上传
    └── 系统设置

技术栈：Vue3 + TypeScript + Vite + Pinia + Vue Router + Element Plus
```

## 项目搭建

```bash
npm create vite@latest admin-system -- --template vue-ts
cd admin-system
pnpm install
pnpm add vue-router pinia axios element-plus @element-plus/icons-vue
pnpm add -D unplugin-auto-import unplugin-vue-components sass
```

## 目录结构

```
src/
├── api/              # API 接口
│   ├── user.ts
│   ├── table.ts
│   └── request.ts    # Axios 封装
├── assets/           # 静态资源
├── components/       # 公共组件
│   ├── Breadcrumb/
│   ├── Pagination/
│   └── SvgIcon/
├── composables/      # 组合式函数
│   ├── useTable.ts
│   └── usePermission.ts
├── layout/           # 布局组件
│   ├── index.vue
│   ├── Sidebar.vue
│   ├── Navbar.vue
│   └── TagsView.vue
├── router/           # 路由配置
│   ├── index.ts
│   ├── guards.ts
│   └── routes.ts
├── stores/           # Pinia Store
│   ├── user.ts
│   ├── app.ts
│   └── permission.ts
├── styles/           # 全局样式
├── utils/            # 工具函数
├── views/            # 页面组件
│   ├── login/
│   ├── dashboard/
│   ├── system/
│   └── error/
├── App.vue
└── main.ts
```

## Axios 封装

```typescript
// api/request.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data;
    if (code === 200) return data;
    if (code === 401) {
      const userStore = useUserStore();
      userStore.logout();
      ElMessage.error('登录已过期，请重新登录');
    }
    ElMessage.error(message || '请求失败');
    return Promise.reject(new Error(message));
  },
  (error) => {
    ElMessage.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default service;
```

## 权限路由

```typescript
// router/routes.ts
import type { RouteRecordRaw } from 'vue-router';

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  { path: '/login', component: () => import('@/views/login/index.vue'), hidden: true },
  { path: '/404', component: () => import('@/views/error/404.vue'), hidden: true },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/dashboard/index.vue'), meta: { title: '仪表盘', icon: 'dashboard' } },
    ],
  },
];

// 动态路由（根据权限加载）
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    meta: { title: '系统管理', icon: 'setting', roles: ['admin'] },
    children: [
      { path: 'user', name: 'UserManage', component: () => import('@/views/system/user.vue'), meta: { title: '用户管理', roles: ['admin'] } },
      { path: 'role', name: 'RoleManage', component: () => import('@/views/system/role.vue'), meta: { title: '角色管理', roles: ['admin'] } },
    ],
  },
];
```

```typescript
// router/guards.ts
import type { Router } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';

const whiteList = ['/login', '/404'];

export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();

    if (userStore.token) {
      if (to.path === '/login') {
        next({ path: '/' });
      } else {
        if (permissionStore.routes.length > 0) {
          next();
        } else {
          try {
            await permissionStore.generateRoutes();
            next({ ...to, replace: true });
          } catch {
            userStore.logout();
            next('/login');
          }
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
      }
    }
  });
}
```

## 权限 Store

```typescript
// stores/permission.ts
import { defineStore } from 'pinia';
import { constantRoutes, asyncRoutes } from '@/router/routes';
import type { RouteRecordRaw } from 'vue-router';

function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  if (route.meta?.roles) {
    return roles.some(role => (route.meta!.roles as string[]).includes(role));
  }
  return true;
}

function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  return routes.reduce<RouteRecordRaw[]>((acc, route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      acc.push(tmp);
    }
    return acc;
  }, []);
}

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([]);
  const addedRoutes = ref<RouteRecordRaw[]>([]);

  async function generateRoutes() {
    const userStore = useUserStore();
    const roles = userStore.roles;
    const accessed = roles.includes('admin')
      ? asyncRoutes
      : filterAsyncRoutes(asyncRoutes, roles);
    routes.value = constantRoutes.concat(accessed);
    addedRoutes.value = accessed;
    return accessed;
  }

  return { routes, addedRoutes, generateRoutes };
});
```

## 通用表格 Hook

```typescript
// composables/useTable.ts
import { ref, reactive } from 'vue';
import type { PaginationProps } from 'element-plus';

interface UseTableOptions<T> {
  fetchApi: (params: any) => Promise<{ list: T[]; total: number }>;
  defaultPageSize?: number;
}

export function useTable<T = any>(options: UseTableOptions<T>) {
  const { fetchApi, defaultPageSize = 20 } = options;

  const loading = ref(false);
  const tableData = ref<T[]>([]) as Ref<T[]>;
  const pagination = reactive({
    page: 1,
    pageSize: defaultPageSize,
    total: 0,
  });
  const searchForm = reactive<Record<string, any>>({});

  async function loadData() {
    loading.value = true;
    try {
      const { list, total } = await fetchApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...searchForm,
      });
      tableData.value = list;
      pagination.total = total;
    } finally {
      loading.value = false;
    }
  }

  function handleSearch() {
    pagination.page = 1;
    loadData();
  }

  function handleReset() {
    Object.keys(searchForm).forEach(key => searchForm[key] = '');
    handleSearch();
  }

  function handlePageChange(page: number) {
    pagination.page = page;
    loadData();
  }

  function handleSizeChange(size: number) {
    pagination.pageSize = size;
    pagination.page = 1;
    loadData();
  }

  // 初始加载
  loadData();

  return {
    loading,
    tableData,
    pagination,
    searchForm,
    loadData,
    handleSearch,
    handleReset,
    handlePageChange,
    handleSizeChange,
  };
}
```

## 按钮权限指令

```typescript
// directives/permission.ts
import type { Directive } from 'vue';
import { useUserStore } from '@/stores/user';

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();
    const roles = userStore.roles;

    if (value && !roles.some(role => value.includes(role))) {
      el.parentNode?.removeChild(el);
    }
  },
};

// 注册
// app.directive('permission', permission)
// <button v-permission="['admin']">删除</button>
```

## 扩展练习

```
1. 添加国际化（i18n）支持
2. 实现可配置的动态表单
3. 添加 Excel 导入导出功能
4. 实现数据大屏可视化
5. 添加 WebSocket 实时通知
6. 实现主题切换（亮色/暗色）
7. 添加单元测试和 E2E 测试
```

## 下一步

- 📝 [个人博客搭建](/frontend/concepts/practice/blog) - 综合实战
- 🗺️ [前端知识图谱](/frontend/concepts/roadmap) - 学习路线图
