---
title: 自定义 Hooks
---

# 自定义 Hooks

自定义 Hooks（组合式函数 / Composables）是 Vue3 中复用状态逻辑的核心模式，将响应式状态和操作封装为可复用的函数。

## 设计原则

```javascript
// ✅ 命名规范：以 use 开头
// ✅ 入参可以是 ref 或 getter，增加灵活性
// ✅ 返回值使用 toRefs 保持响应式
// ✅ 在 setup 中同步调用（确保生命周期正确注册）
// ✅ 清理副作用（定时器、事件监听等）

// 基本结构
export function useXxx(source) {
  // 1. 声明响应式状态
  const state = ref(initialValue);

  // 2. 定义计算属性
  const derived = computed(() => /* ... */);

  // 3. 定义方法
  function action() { /* ... */ }

  // 4. 注册生命周期钩子和副作用
  onMounted(() => { /* ... */ });
  onUnmounted(() => { /* ... */ });

  // 5. 返回需要暴露的状态和方法
  return { state, derived, action };
}
```

## 常用 Hooks

### useMouse - 鼠标追踪

```javascript
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

// 使用
const { x, y } = useMouse();
// <p>鼠标位置：{{ x }}, {{ y }}</p>
```

### useFetch - 数据请求

```javascript
import { ref, watchEffect, toValue } from 'vue';

export function useFetch(url, options = {}) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  async function execute() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(toValue(url), options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data.value = await response.json();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  // 自动监听 URL 变化
  watchEffect(() => {
    execute();
  });

  return { data, error, loading, refresh: execute };
}

// 使用
const userId = ref(1);
const { data: user, loading, error } = useFetch(
  computed(() => `/api/users/${userId.value}`)
);
```

### useLocalStorage - 本地存储

```javascript
import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key);
  const data = ref(stored ? JSON.parse(stored) : defaultValue);

  watch(
    data,
    (newVal) => {
      localStorage.setItem(key, JSON.stringify(newVal));
    },
    { deep: true }
  );

  function remove() {
    localStorage.removeItem(key);
    data.value = defaultValue;
  }

  return { data, remove };
}

// 使用
const { data: theme } = useLocalStorage('theme', 'light');
const { data: user } = useLocalStorage('user', { name: '', age: 0 });
```

### useDebounce / useThrottle

```javascript
import { ref, watch } from 'vue';

// 防抖
export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value);
  let timer;

  watch(value, (newVal) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debouncedValue.value = newVal;
    }, delay);
  });

  return debouncedValue;
}

// 节流
export function useThrottle(fn, delay = 300) {
  let lastCall = 0;
  let timer = null;

  return (...args) => {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      lastCall = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

// 使用
const search = ref('');
const debouncedSearch = useDebounce(search, 500);

watch(debouncedSearch, (val) => {
  // 500ms 后才执行搜索
  fetchSearchResults(val);
});

const throttledScroll = useThrottle(handleScroll, 100);
window.addEventListener('scroll', throttledScroll);
```

### useEventListener - 事件监听

```javascript
import { onMounted, onUnmounted } from 'vue';

export function useEventListener(target, event, handler, options = {}) {
  onMounted(() => {
    target.addEventListener(event, handler, options);
  });

  onUnmounted(() => {
    target.removeEventListener(event, handler, options);
  });
}

// 使用
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

function onResize() {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
}

useEventListener(window, 'resize', onResize);
```

### useIntersectionObserver - 元素可见性

```javascript
import { ref, onMounted, onUnmounted } from 'vue';

export function useIntersectionObserver(target, options = {}) {
  const isIntersecting = ref(false);
  let observer = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.value = entry.isIntersecting;
      },
      { threshold: 0.1, ...options }
    );

    if (target.value) {
      observer.observe(target.value);
    }
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { isIntersecting };
}

// 使用 - 懒加载
const imageRef = ref(null);
const { isIntersecting } = useIntersectionObserver(imageRef);

// <img ref="imageRef" :src="isIntersecting ? realSrc : placeholder" />
```

### useCounter - 计数器

```javascript
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0, options = {}) {
  const { min, max } = options;
  const count = ref(initialValue);

  const isMin = computed(() => min !== undefined && count.value <= min);
  const isMax = computed(() => max !== undefined && count.value >= max);

  function increment(step = 1) {
    if (!isMax.value) {
      count.value = max !== undefined
        ? Math.min(count.value + step, max)
        : count.value + step;
    }
  }

  function decrement(step = 1) {
    if (!isMin.value) {
      count.value = min !== undefined
        ? Math.max(count.value - step, min)
        : count.value - step;
    }
  }

  function reset() {
    count.value = initialValue;
  }

  return { count, isMin, isMax, increment, decrement, reset };
}

// 使用
const { count, increment, decrement, isMin, isMax } = useCounter(0, { min: 0, max: 10 });
```

### useToggle - 切换状态

```javascript
import { ref } from 'vue';

export function useToggle(initialValue = false) {
  const state = ref(initialValue);

  function toggle(value) {
    state.value = typeof value === 'boolean' ? value : !state.value;
  }

  function setTrue() { state.value = true; }
  function setFalse() { state.value = false; }

  return { state, toggle, setTrue, setFalse };
}

// 使用
const { state: visible, toggle, setTrue, setFalse } = useToggle();
// <Modal :visible="visible" @close="setFalse" />
```

## 组合 Hooks

```javascript
// 将多个 hooks 组合使用
export function useUserList() {
  const page = ref(1);
  const pageSize = ref(10);

  const { data, loading, error, refresh } = useFetch(
    computed(() => `/api/users?page=${page.value}&size=${pageSize.value}`)
  );

  const debouncedSearch = useDebounce(search, 300);

  watch(debouncedSearch, () => {
    page.value = 1;
    refresh();
  });

  function nextPage() {
    page.value++;
  }

  function prevPage() {
    if (page.value > 1) page.value--;
  }

  return {
    users: data,
    loading,
    error,
    page,
    pageSize,
    nextPage,
    prevPage,
    refresh,
  };
}
```

## 下一步

- 🐻 [Pinia 状态管理](/frontend/frameworks/vue3/pinia) - Vue3 状态管理
- 🔥 [React 基础入门](/frontend/frameworks/react/) - 学习 React 框架
- 📊 [图表基础入门](/frontend/advanced/charts/) - 数据可视化
