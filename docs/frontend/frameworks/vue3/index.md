---
title: Vue3 基础入门
---

# Vue3 基础入门

Vue3 是 Vue.js 的最新主要版本，带来了组合式 API、更好的 TypeScript 支持、更小的包体积和更快的渲染性能。

## Vue2 vs Vue3 对比

| 特性 | Vue2 | Vue3 |
|------|------|------|
| API 风格 | 选项式 API | 组合式 API + 选项式 API |
| 响应式 | Object.defineProperty | Proxy |
| 生命周期 | beforeDestroy / destroyed | beforeUnmount / unmounted |
| 全局 API | new Vue() | createApp() |
| Fragment | 单根元素 | 多根节点 |
| Teleport | 无 | 新增 |
| Suspense | 无 | 新增 |
| TypeScript | 支持较弱 | 原生支持 |

## 创建项目

```bash
# 使用 Vite（推荐）
npm create vite@latest my-vue-app -- --template vue
npm create vite@latest my-vue-app -- --template vue-ts

# 使用 Vue CLI
npm install -g @vue/cli
vue create my-project
```

## 应用实例

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

// 注册全局组件
app.component('MyButton', MyButton);

// 注册全局指令
app.directive('focus', {
  mounted(el) { el.focus(); },
});

// 安装插件
app.use(router);
app.use(store);

// 全局属性
app.config.globalProperties.$http = axios;

// 挂载
app.mount('#app');
```

## 组合式 API

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>计数：{{ count }}</p>
    <p>双倍：{{ doubleCount }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script setup>
// <script setup> 是组合式 API 的语法糖（推荐）
import { ref, computed, watch, onMounted } from 'vue';

// 响应式数据
const title = ref('Vue3 入门');
const count = ref(0);

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
function increment() {
  count.value++;
}
function decrement() {
  count.value--;
}

// 侦听器
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} → ${newVal}`);
});

// 生命周期
onMounted(() => {
  console.log('组件已挂载');
});
</script>
```

## 响应式系统

### ref

```javascript
import { ref } from 'vue';

// 基本类型用 ref
const count = ref(0);
const name = ref('张三');
const list = ref([1, 2, 3]);

// 访问和修改需要 .value
console.log(count.value); // 0
count.value++;

// 模板中自动解包（不需要 .value）
// <p>{{ count }}</p>
```

### reactive

```javascript
import { reactive } from 'vue';

// 对象类型用 reactive
const user = reactive({
  name: '张三',
  age: 25,
  hobbies: ['编程', '阅读'],
});

// 直接访问属性（不需要 .value）
console.log(user.name); // '张三'
user.age++;

// ⚠️ 注意：解构会失去响应式
const { name, age } = user; // ❌ 不是响应式

// ✅ 使用 toRefs 保持响应式
import { toRefs } from 'vue';
const { name, age } = toRefs(user); // ✅ 响应式

// ✅ 使用 toRef 对单个属性
import { toRef } from 'vue';
const age = toRef(user, 'age');
```

### ref vs reactive

```javascript
// ref - 推荐优先使用
// ✅ 可用于任何类型
// ✅ 重新赋值不会丢失响应式
const data = ref(null);
data.value = { name: '张三' }; // ✅ 仍然响应式

// reactive - 适合复杂对象
// ⚠️ 仅适用于对象类型
// ⚠️ 不能替换整个对象
const state = reactive({ list: [] });
state.list = [1, 2, 3]; // ✅ 修改属性
state = { list: [4, 5, 6] }; // ❌ 丢失响应式
```

### 其他响应式 API

```javascript
import {
  readonly,     // 只读代理
  shallowRef,   // 浅层 ref（只有 .value 是响应式的）
  shallowReactive, // 浅层 reactive
  triggerRef,   // 手动触发 shallowRef 的更新
  customRef,    // 自定义 ref
  isRef,        // 判断是否为 ref
  isReactive,   // 判断是否为 reactive
  toRaw,        // 获取原始对象
  markRaw,      // 标记对象永远不会转为响应式
} from 'vue';

// readonly
const original = reactive({ count: 0 });
const copy = readonly(original);
copy.count++; // ⚠️ 警告，无法修改

// shallowRef
const state = shallowRef({ count: 0 });
state.value.count++; // ❌ 不会触发更新
state.value = { count: 1 }; // ✅ 触发更新

// customRef - 防抖 ref
function useDebouncedRef(value, delay = 300) {
  let timeout;
  return customRef((track, trigger) => ({
    get() { track(); return value; },
    set(newVal) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newVal;
        trigger();
      }, delay);
    },
  }));
}

const search = useDebouncedRef('', 500);

// markRaw - 跳过响应式转换
const obj = markRaw({ name: '静态数据' });
const state = reactive({ data: obj }); // data 不是响应式的
```

## 生命周期

```javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

// <script setup> 中直接使用
onMounted(() => {
  console.log('组件已挂载');
});

onBeforeUnmount(() => {
  // 清理定时器、事件监听等
  clearInterval(timer);
  window.removeEventListener('resize', handler);
});

// 对应关系
// Vue2              → Vue3
// beforeCreate      → setup()
// created           → setup()
// beforeMount       → onBeforeMount
// mounted           → onMounted
// beforeUpdate      → onBeforeUpdate
// updated           → onUpdated
// beforeDestroy     → onBeforeUnmount
// destroyed         → onUnmounted
// activated         → onActivated
// deactivated       → onDeactivated
// errorCaptured     → onErrorCaptured
```

## 模板语法

Vue3 的模板语法与 Vue2 基本相同，但有一些改进：

```html
<!-- Fragment - 多根节点 -->
<template>
  <h1>标题</h1>
  <p>内容</p>
</template>

<!-- v-memo（性能优化） -->
<div v-memo="[item.id]">
  <!-- 仅当 item.id 变化时才更新 -->
  {{ item.name }}
</div>

<!-- v-bind 增强 -->
<div v-bind="objectOfAttrs"></div>

<!-- 支持 v-for 和 v-if 同时使用（v-if 优先级更高） -->
<div v-for="item in items" v-if="item.active" :key="item.id">
  {{ item.name }}
</div>
```

## Teleport 传送门

```html
<!-- 将内容渲染到 body 下 -->
<Teleport to="body">
  <div class="modal" v-if="showModal">
    <h2>弹窗标题</h2>
    <p>弹窗内容</p>
    <button @click="showModal = false">关闭</button>
  </div>
</Teleport>

<!-- 传送到指定元素 -->
<Teleport to="#modals">
  <div class="dialog">...</div>
</Teleport>

<!-- 条件传送 -->
<Teleport to="body" :disabled="isMobile">
  <div class="tooltip">...</div>
</Teleport>
```

## Suspense

```html
<Suspense>
  <!-- 异步内容 -->
  <template #default>
    <AsyncComponent />
  </template>

  <!-- 加载状态 -->
  <template #fallback>
    <div class="loading">加载中...</div>
  </template>
</Suspense>
```

```javascript
// 异步组件
export default {
  async setup() {
    const data = await fetchData();
    return { data };
  },
};
```

## 下一步

- 🎭 [组合式 API](/frontend/frameworks/vue3/composition-api) - 深入组合式 API
- 🐻 [Pinia 状态管理](/frontend/frameworks/vue3/pinia) - Vue3 推荐的状态管理
- 🔄 [Vue3 生命周期](/frontend/frameworks/vue3/lifecycle) - 生命周期详解
- 🪝 [自定义 Hooks](/frontend/frameworks/vue3/hooks) - 逻辑复用
