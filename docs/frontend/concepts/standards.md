---
title: 编码规范
---

# 编码规范

良好的编码规范是团队协作的基础，统一的代码风格可以减少冲突、提高可读性、降低维护成本。

## 命名规范

### 文件命名

```
组件文件：PascalCase
  UserCard.vue, ButtonGroup.vue, LayoutHeader.vue

普通文件：camelCase
  utils.js, apiService.js, useCounter.js

样式文件：kebab-case
  variables.scss, global-style.css

页面文件：kebab-case
  user-profile.vue, order-detail.vue

目录名：kebab-case
  components/, user-management/, api-service/
```

### 变量命名

```javascript
// 变量：camelCase
const userName = '张三';
const isLoading = true;
const itemCount = 10;

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;

// 私有变量：以 _ 开头
const _internalState = {};

// 布尔值：is/has/should/can 开头
const isVisible = true;
const hasPermission = false;
const shouldUpdate = true;
const canEdit = true;

// 事件处理：handle/on 开头
const handleClick = () => {};
const onSubmit = () => {};
const onInputChange = () => {};

// 回调函数：onXxx / afterXxx / beforeXxx
const onSuccess = () => {};
const beforeSubmit = () => {};
const afterClose = () => {};
```

### 组件命名

```javascript
// Vue 组件：PascalCase
export default {
  name: 'UserCard',    // ✅
  name: 'userCard',    // ❌
  name: 'user-card',   // ❌
};

// React 组件：PascalCase
function UserCard() {}    // ✅
function userCard() {}    // ❌

// 组件文件名与组件名一致
// UserCard.vue → name: 'UserCard'
```

## 代码结构

### Vue 组件顺序

```vue
<template>
  <!-- 模板 -->
</template>

<script setup>
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ChildComponent from './ChildComponent.vue';

// 2. Props & Emits
const props = defineProps({ /* ... */ });
const emit = defineEmits(['update', 'delete']);

// 3. 响应式状态
const count = ref(0);
const user = reactive({ name: '' });

// 4. 计算属性
const doubleCount = computed(() => count.value * 2);

// 5. 方法
function increment() { count.value++; }

// 6. 侦听器
watch(count, (newVal) => { /* ... */ });

// 7. 生命周期
onMounted(() => { /* ... */ });
</script>

<style scoped>
/* 样式 */
</style>
```

### React 组件顺序

```jsx
import { useState, useEffect, useCallback } from 'react';

function UserCard({ userId, onUpdate }) {
  // 1. State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Effects
  useEffect(() => {
    loadUser();
  }, [userId]);

  // 3. Handlers
  const handleUpdate = useCallback(() => {
    onUpdate(user);
  }, [user, onUpdate]);

  // 4. Render helpers
  const renderAvatar = () => <img src={user.avatar} />;

  // 5. Return
  if (loading) return <Spinner />;
  return <div>{/* ... */}</div>;
}
```

## CSS 规范

```css
/* BEM 命名规范 */
/* Block__Element--Modifier */
.card {}
.card__header {}
.card__body {}
.card__footer {}
.card--featured {}
.card__header--dark {}

/* 避免嵌套过深 */
/* ❌ */
.nav .menu .item .link .icon {}
/* ✅ */
.nav-menu-item-icon {}

/* 使用 CSS 变量 */
:root {
  --color-primary: #5470c6;
  --color-danger: #ee6666;
  --font-size-base: 14px;
  --spacing-md: 16px;
}

.button {
  color: var(--color-primary);
  font-size: var(--font-size-base);
  padding: var(--spacing-md);
}
```

## 注释规范

```javascript
/**
 * 函数说明
 * @param {string} name - 用户名
 * @param {number} age - 年龄
 * @returns {Object} 用户对象
 */
function createUser(name, age) {
  return { name, age };
}

// TODO: 需要优化性能
// FIXME: 修复边界情况
// NOTE: 此处逻辑与后端约定
// HACK: 临时方案，后续需重构

// 复杂逻辑必须注释
// 使用二分查找定位插入位置
let left = 0, right = arr.length - 1;
while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  // ...
}
```

## Git 规范

```
Commit 格式：<type>(<scope>): <subject>

类型：
  feat:     新功能
  fix:      修复 Bug
  docs:     文档变更
  style:    代码格式
  refactor: 重构
  perf:     性能优化
  test:     测试
  chore:    构建/工具

示例：
  feat(user): 添加用户登录功能
  fix(api): 修复请求超时问题
  refactor(utils): 重构日期格式化函数

分支命名：
  feature/xxx  - 新功能
  fix/xxx      - Bug 修复
  hotfix/xxx   - 紧急修复
  release/x.x  - 发布分支
```

## 代码审查清单

```
✅ 命名是否清晰、有意义
✅ 函数是否单一职责（不超过 50 行）
✅ 是否有重复代码可以提取
✅ 是否有未处理的错误和边界情况
✅ 是否有不必要的 any / @ts-ignore
✅ 是否有内存泄漏风险（定时器、事件监听）
✅ 是否符合团队编码规范
✅ 是否有必要注释复杂逻辑
✅ 是否有性能问题（不必要的渲染、大循环）
✅ 是否有安全隐患（XSS、敏感信息）
```

## 下一步

- 🎯 [实战训练](/frontend/concepts/practice/) - 项目实战
- 🗺️ [前端知识图谱](/frontend/concepts/roadmap) - 学习路线图
- 💼 [面试高频题](/frontend/concepts/interview) - 面试准备
