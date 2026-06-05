---
title: 组合式 API
---

# 组合式 API

组合式 API（Composition API）是 Vue3 的核心特性，它提供了一种更灵活的方式来组织和复用组件逻辑。

## setup 函数

```vue
<script>
import { ref, reactive, onMounted } from 'vue';

export default {
  // setup 在 beforeCreate 之前执行
  // 无法访问 this
  setup(props, context) {
    // props - 组件 props（响应式）
    // context - 上下文对象
    // context.attrs - 非 prop 属性
    // context.slots - 插槽
    // context.emit - 触发事件
    // context.expose - 暴露公共属性

    const count = ref(0);

    function increment() {
      count.value++;
    }

    // 必须返回模板可用的内容
    return {
      count,
      increment,
    };
  },
};
</script>
```

### `<script setup>` 语法糖

```vue
<script setup>
// 自动导入：ref, reactive, computed 等
// 顶层声明自动暴露给模板
// 更好的运行时性能和 IDE 支持

const count = ref(0);
const increment = () => count.value++;

// defineProps - 声明 props
const props = defineProps({
  title: String,
  count: { type: Number, default: 0 },
});

// defineEmits - 声明事件
const emit = defineEmits(['update', 'delete']);

// defineExpose - 暴露给父组件 ref
defineExpose({ count, increment });

// withDefaults - props 默认值（TypeScript）
const props = withDefaults(defineProps<{
  title?: string;
  count?: number;
}>(), {
  title: '默认标题',
  count: 0,
});
</script>
```

## 核心 API

### computed

```javascript
import { ref, computed } from 'vue';

const firstName = ref('张');
const lastName = ref('三');

// 只读计算属性
const fullName = computed(() => firstName.value + lastName.value);

// 可写计算属性
const fullName = computed({
  get: () => firstName.value + lastName.value,
  set: (val) => {
    firstName.value = val[0];
    lastName.value = val.slice(1);
  },
});
```

### watch

```javascript
import { ref, watch } from 'vue';

const count = ref(0);
const user = reactive({ name: '张三', age: 25 });

// 监听 ref
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} → ${newVal}`);
});

// 监听 reactive 属性（用 getter）
watch(
  () => user.age,
  (newAge, oldAge) => {
    console.log(`age: ${oldAge} → ${newAge}`);
  }
);

// 监听多个源
watch([count, () => user.name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('count 或 name 变化了');
});

// 深度监听
watch(
  () => user,
  (newVal) => {
    console.log('user 变化了:', newVal);
  },
  { deep: true }
);

// 立即执行
watch(
  () => user.age,
  (newVal) => {
    console.log('age:', newVal);
  },
  { immediate: true }
);
```

### watchEffect

```javascript
import { ref, watchEffect } from 'vue';

const count = ref(0);
const name = ref('张三');

// 自动追踪依赖
const stop = watchEffect(() => {
  console.log(`count=${count.value}, name=${name.value}`);
  // 自动追踪内部使用的响应式数据
});

// 停止监听
stop();

// 副作用清理
watchEffect((onCleanup) => {
  const controller = new AbortController();

  fetch(`/api/data?q=${search.value}`, { signal: controller.signal })
    .then(r => r.json())
    .then(data => { /* ... */ });

  // 下次执行前清理上一次的请求
  onCleanup(() => controller.abort());
});
```

### watch vs watchEffect

| 特性 | watch | watchEffect |
|------|-------|-------------|
| 依赖追踪 | 显式指定 | 自动追踪 |
| 旧值访问 | ✅ 可获取 | ❌ 无法获取 |
| 懒执行 | ✅ 默认懒执行 | ❌ 立即执行 |
| 精确控制 | ✅ 更精确 | 自动追踪所有 |
| 适用场景 | 需要比较新旧值 | 副作用逻辑 |

## 依赖注入

```javascript
// 提供 - 父组件
import { provide, ref } from 'vue';

const theme = ref('dark');
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

provide('theme', theme);
provide('toggleTheme', toggleTheme);

// 注入 - 后代组件
import { inject } from 'vue';

const theme = inject('theme', 'light'); // 第二个参数为默认值
const toggleTheme = inject('toggleTheme');

// 使用 Symbol 作为 key（推荐）
export const ThemeKey = Symbol('theme');
provide(ThemeKey, theme);
const theme = inject(ThemeKey);
```

## 模板引用

```vue
<template>
  <input ref="inputRef" />
  <ChildComponent ref="childRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue';

const inputRef = ref(null);
const childRef = ref(null);

onMounted(() => {
  inputRef.value?.focus();
  childRef.value?.someMethod(); // 需要子组件 defineExpose
});
</script>
```

## 组合式函数（Composables）

```javascript
// useCounter.js - 可复用的计数逻辑
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubleCount = computed(() => count.value * 2);

  function increment() { count.value++; }
  function decrement() { count.value--; }
  function reset() { count.value = initialValue; }

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset,
  };
}

// 在组件中使用
import { useCounter } from '@/composables/useCounter';

const { count, doubleCount, increment } = useCounter(10);
```

### 常用 Composables 示例

```javascript
// useMouse.js - 鼠标位置追踪
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}

// useFetch.js - 数据请求
import { ref, watchEffect, toValue } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(toValue(url));
      data.value = await res.json();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  watchEffect(() => {
    fetchData();
  });

  return { data, error, loading, refresh: fetchData };
}

// useLocalStorage.js - 本地存储
import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key);
  const data = ref(stored ? JSON.parse(stored) : defaultValue);

  watch(data, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal));
  }, { deep: true });

  return data;
}
```

## 下一步

- 🐻 [Pinia 状态管理](/frontend/frameworks/vue3/pinia) - Vue3 推荐的状态管理
- 🔄 [Vue3 生命周期](/frontend/frameworks/vue3/lifecycle) - 生命周期详解
- 🪝 [自定义 Hooks](/frontend/frameworks/vue3/hooks) - 逻辑复用进阶
