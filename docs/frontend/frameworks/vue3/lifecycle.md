---
title: Vue3 生命周期
---

# Vue3 生命周期

Vue3 的生命周期钩子在组合式 API 中以 `on` 前缀的函数形式使用，更加直观和灵活。

## 生命周期流程

```
创建阶段
  │
  ├── setup() / <script setup>
  │     （替代 beforeCreate 和 created）
  │
挂载阶段
  ├── onBeforeMount    → 挂载前
  ├── onMounted        → 挂载完成 ✅
  │
更新阶段
  ├── onBeforeUpdate   → 更新前
  ├── onUpdated        → 更新完成
  │
卸载阶段
  ├── onBeforeUnmount  → 卸载前 ✅
  ├── onUnmounted      → 卸载完成 ✅
  │
特殊钩子
  ├── onActivated      → keep-alive 激活
  ├── onDeactivated    → keep-alive 停用
  ├── onErrorCaptured  → 捕获后代错误
```

## 基本使用

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue';

onBeforeMount(() => {
  console.log('1. 挂载前 - DOM 还未生成');
});

onMounted(() => {
  console.log('2. 挂载完成 - 可以访问 DOM');
  // ✅ 适合：DOM 操作、发起请求、添加事件监听
});

onBeforeUpdate(() => {
  console.log('3. 更新前 - 数据已变，DOM 未更新');
});

onUpdated(() => {
  console.log('4. 更新完成 - DOM 已更新');
  // ⚠️ 避免在此修改响应式数据（可能无限循环）
});

onBeforeUnmount(() => {
  console.log('5. 卸载前 - 组件仍然可用');
  // ✅ 适合：清理定时器、取消订阅、移除事件监听
});

onUnmounted(() => {
  console.log('6. 卸载完成 - 组件已销毁');
});
</script>
```

## Vue2 vs Vue3 对比

| Vue2 选项式 | Vue3 选项式 | Vue3 组合式 |
|------------|------------|------------|
| beforeCreate | beforeCreate | setup() |
| created | created | setup() |
| beforeMount | beforeMount | onBeforeMount |
| mounted | mounted | onMounted |
| beforeUpdate | beforeUpdate | onBeforeUpdate |
| updated | updated | onUpdated |
| beforeDestroy | **beforeUnmount** | **onBeforeUnmount** |
| destroyed | **unmounted** | **onUnmounted** |
| activated | activated | onActivated |
| deactivated | deactivated | onDeactivated |
| errorCaptured | errorCaptured | onErrorCaptured |

## 各钩子的典型用途

### onMounted

```vue
<script setup>
import { ref, onMounted } from 'vue';

const data = ref(null);
const listRef = ref(null);

onMounted(async () => {
  // 1. 发起数据请求
  data.value = await fetchData();

  // 2. 操作 DOM
  listRef.value?.focus();

  // 3. 添加事件监听
  window.addEventListener('resize', handleResize);

  // 4. 初始化第三方库
  const chart = echarts.init(chartRef.value);
  chart.setOption(options);
});
</script>
```

### onBeforeUnmount

```vue
<script setup>
import { onBeforeUnmount } from 'vue';

let timer = null;
let observer = null;

onBeforeUnmount(() => {
  // 清理定时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  // 移除事件监听
  window.removeEventListener('resize', handleResize);

  // 断开观察器
  observer?.disconnect();

  // 取消未完成的请求
  abortController?.abort();

  // 销毁第三方实例
  chartInstance?.dispose();
});
</script>
```

### onActivated / onDeactivated

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue';

// keep-alive 缓存的组件激活/停用时触发
onActivated(() => {
  console.log('组件被激活');
  // 恢复定时器、刷新数据
  startPolling();
  refreshData();
});

onDeactivated(() => {
  console.log('组件被停用');
  // 暂停定时器
  stopPolling();
});
</script>
```

### onErrorCaptured

```vue
<script setup>
import { ref, onErrorCaptured } from 'vue';

const error = ref(null);

onErrorCaptured((err, instance, info) => {
  // err - 错误对象
  // instance - 触发错误的组件实例
  // info - 错误来源信息（如 'render function'）

  console.error('捕获到子组件错误:', err);
  error.value = err;

  // 返回 false 阻止错误继续向上传播
  return false;

  // 返回 true 或不返回，错误继续传播
});
</script>

<template>
  <div v-if="error" class="error-fallback">
    <h3>出错了</h3>
    <p>{{ error.message }}</p>
    <button @click="error = null">重试</button>
  </div>
  <slot v-else />
</template>
```

## 在组合式函数中使用

```javascript
// useEventListener.js
import { onMounted, onUnmounted } from 'vue';

export function useEventListener(target, event, handler) {
  onMounted(() => target.addEventListener(event, handler));
  onUnmounted(() => target.removeEventListener(event, handler));
}

// 使用
const { x, y } = useMouse();
// 等价于自动管理了 mousemove 的监听和清理

// useInterval.js
import { ref, onUnmounted } from 'vue';

export function useInterval(callback, delay) {
  const timer = ref(null);

  const start = () => {
    stop();
    timer.value = setInterval(callback, delay);
  };

  const stop = () => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  onUnmounted(stop);

  return { start, stop };
}
```

## 生命周期执行顺序

```javascript
// 父子组件的执行顺序
// 挂载：父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted
// 更新：父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
// 卸载：父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted
```

## 下一步

- 🪝 [自定义 Hooks](/frontend/frameworks/vue3/hooks) - 逻辑复用进阶
- 🐻 [Pinia 状态管理](/frontend/frameworks/vue3/pinia) - Vue3 状态管理
- 🔥 [React 基础入门](/frontend/frameworks/react/) - 学习 React 框架
