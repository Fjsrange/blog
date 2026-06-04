---
title: Vue3 组合式 API 详解
date: 2024-11-15
tags: [Vue3, 组合式 API]
---

# Vue3 组合式 API 详解

## 从选项式到组合式

Vue3 引入了组合式 API（Composition API），这是 Vue3 最重要的新特性之一。相比选项式 API，组合式 API 提供了更灵活的代码组织方式。

### 选项式 API 的问题

在选项式 API 中，一个功能的代码被分散在不同的选项中：

```javascript
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('mounted!')
  }
}
```

### 组合式 API 的解决方案

组合式 API 让相关功能的代码可以组织在一起：

```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    const increment = () => count.value++

    onMounted(() => {
      console.log('mounted!')
    })

    return { count, doubleCount, increment }
  }
}
```

## 核心概念

### ref 与 reactive

`ref` 和 `reactive` 是创建响应式数据的两种方式：

```javascript
import { ref, reactive } from 'vue'

// ref - 适用于基本类型
const count = ref(0)
console.log(count.value) // 0

// reactive - 适用于对象类型
const state = reactive({
  name: '张三',
  age: 25
})
console.log(state.name) // 张三
```

### computed

计算属性，自动追踪依赖并缓存结果：

```javascript
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

const fullName = computed(() => {
  return firstName.value + lastName.value
})
```

### watch 与 watchEffect

侦听器，用于响应数据变化：

```javascript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)

// watch - 明确指定侦听源
watch(count, (newVal, oldVal) => {
  console.log(`count 从 ${oldVal} 变为 ${newVal}`)
})

// watchEffect - 自动追踪依赖
watchEffect(() => {
  console.log(`当前 count: ${count.value}`)
})
```

## 组合式函数（Composables）

组合式 API 最强大的地方在于可以轻松提取和复用逻辑：

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  return { count, doubleCount, increment, decrement, reset }
}
```

```javascript
// 在组件中使用
import { useCounter } from './composables/useCounter'

const { count, doubleCount, increment } = useCounter(10)
```

## 总结

组合式 API 带来了：

- 📦 **更好的代码组织** - 相关逻辑集中在一起
- 🔧 **更好的类型推导** - 与 TypeScript 完美配合
- ♻️ **更好的代码复用** - Composables 模式简单优雅
- 🌳 **更小的打包体积** - 更利于 Tree-shaking

拥抱组合式 API，让你的 Vue 代码更加优雅！
