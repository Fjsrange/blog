---
title: TodoList 应用
---

# TodoList 应用

TodoList 是前端入门最经典的实战项目，涵盖增删改查、组件化、状态管理等核心概念。

## 项目概述

```
功能：
├── 添加待办事项
├── 标记完成/未完成
├── 删除待办事项
├── 编辑待办事项
├── 筛选（全部/未完成/已完成）
├── 统计信息
├── 本地存储持久化
└── 清除已完成项

技术栈：Vue3 + Composition API + TypeScript
```

## 项目搭建

```bash
npm create vite@latest todolist -- --template vue-ts
cd todolist
pnpm install
pnpm dev
```

## 类型定义

```typescript
// types/todo.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';
```

## 核心逻辑 - useTodo

```typescript
// composables/useTodo.ts
import { ref, computed } from 'vue';
import type { Todo, FilterType } from '../types/todo';

export function useTodo() {
  const todos = ref<Todo[]>(loadTodos());
  const filter = ref<FilterType>('all');

  // 计算属性
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active': return todos.value.filter(t => !t.completed);
      case 'completed': return todos.value.filter(t => t.completed);
      default: return todos.value;
    }
  });

  const activeCount = computed(() => todos.value.filter(t => !t.completed).length);
  const completedCount = computed(() => todos.value.filter(t => t.completed).length);
  const totalCount = computed(() => todos.value.length);

  // 添加
  function addTodo(text: string) {
    if (!text.trim()) return;
    todos.value.push({
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    });
    saveTodos();
  }

  // 删除
  function removeTodo(id: string) {
    todos.value = todos.value.filter(t => t.id !== id);
    saveTodos();
  }

  // 切换完成状态
  function toggleTodo(id: string) {
    const todo = todos.value.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
    }
  }

  // 编辑
  function updateTodo(id: string, text: string) {
    const todo = todos.value.find(t => t.id === id);
    if (todo) {
      todo.text = text.trim();
      saveTodos();
    }
  }

  // 清除已完成
  function clearCompleted() {
    todos.value = todos.value.filter(t => !t.completed);
    saveTodos();
  }

  // 切换筛选
  function setFilter(type: FilterType) {
    filter.value = type;
  }

  // 本地存储
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos.value));
  }

  function loadTodos(): Todo[] {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  }

  return {
    todos,
    filter,
    filteredTodos,
    activeCount,
    completedCount,
    totalCount,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    setFilter,
  };
}
```

## 组件实现

### TodoInput

```vue
<!-- components/TodoInput.vue -->
<template>
  <div class="todo-input">
    <input
      v-model="newTodo"
      @keyup.enter="handleAdd"
      placeholder="添加待办事项..."
      class="todo-input__field"
    />
    <button @click="handleAdd" class="todo-input__btn" :disabled="!newTodo.trim()">
      添加
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  add: [text: string];
}>();

const newTodo = ref('');

function handleAdd() {
  if (newTodo.value.trim()) {
    emit('add', newTodo.value);
    newTodo.value = '';
  }
}
</script>

<style scoped>
.todo-input {
  display: flex;
  gap: 8px;
}
.todo-input__field {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}
.todo-input__field:focus {
  border-color: #5470c6;
}
.todo-input__btn {
  padding: 10px 24px;
  background: #5470c6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}
.todo-input__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### TodoItem

```vue
<!-- components/TodoItem.vue -->
<template>
  <div class="todo-item" :class="{ 'todo-item--completed': todo.completed }">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="$emit('toggle', todo.id)"
      class="todo-item__checkbox"
    />
    <template v-if="isEditing">
      <input
        v-model="editText"
        @keyup.enter="handleSave"
        @keyup.escape="handleCancel"
        @blur="handleSave"
        class="todo-item__edit"
        ref="editInput"
      />
    </template>
    <template v-else>
      <span @dblclick="handleEdit" class="todo-item__text">
        {{ todo.text }}
      </span>
    </template>
    <button @click="$emit('remove', todo.id)" class="todo-item__delete">
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { Todo } from '../types/todo';

const props = defineProps<{ todo: Todo }>();
const emit = defineEmits<{
  toggle: [id: string];
  remove: [id: string];
  update: [id: string, text: string];
}>();

const isEditing = ref(false);
const editText = ref('');
const editInput = ref<HTMLInputElement | null>(null);

function handleEdit() {
  isEditing.value = true;
  editText.value = props.todo.text;
  nextTick(() => editInput.value?.focus());
}

function handleSave() {
  if (editText.value.trim()) {
    emit('update', props.todo.id, editText.value);
  }
  isEditing.value = false;
}

function handleCancel() {
  isEditing.value = false;
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.todo-item--completed .todo-item__text {
  text-decoration: line-through;
  color: #999;
}
.todo-item__text {
  flex: 1;
  cursor: pointer;
}
.todo-item__edit {
  flex: 1;
  padding: 4px 8px;
  border: 2px solid #5470c6;
  border-radius: 4px;
  outline: none;
}
.todo-item__delete {
  opacity: 0;
  background: none;
  border: none;
  color: #ee6666;
  cursor: pointer;
  font-size: 16px;
}
.todo-item:hover .todo-item__delete {
  opacity: 1;
}
</style>
```

### TodoFilter

```vue
<!-- components/TodoFilter.vue -->
<template>
  <div class="todo-filter">
    <button
      v-for="option in filterOptions"
      :key="option.value"
      @click="$emit('change', option.value)"
      :class="['todo-filter__btn', { active: modelValue === option.value }]"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FilterType } from '../types/todo';

defineProps<{ modelValue: FilterType }>();
defineEmits<{ change: [value: FilterType] }>();

const filterOptions: { label: string; value: FilterType }[] = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'completed' },
];
</script>

<style scoped>
.todo-filter {
  display: flex;
  gap: 4px;
}
.todo-filter__btn {
  padding: 6px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.todo-filter__btn.active {
  background: #5470c6;
  color: white;
  border-color: #5470c6;
}
</style>
```

## 主页面

```vue
<!-- App.vue -->
<template>
  <div class="app">
    <h1>📝 TodoList</h1>

    <TodoInput @add="addTodo" />

    <TodoFilter :model-value="filter" @change="setFilter" />

    <div class="todo-list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleTodo"
        @remove="removeTodo"
        @update="updateTodo"
      />
      <p v-if="filteredTodos.length === 0" class="empty">
        暂无待办事项
      </p>
    </div>

    <div class="todo-footer" v-if="totalCount > 0">
      <span>{{ activeCount }} 项未完成</span>
      <button v-if="completedCount > 0" @click="clearCompleted">
        清除已完成 ({{ completedCount }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import TodoInput from './components/TodoInput.vue';
import TodoItem from './components/TodoItem.vue';
import TodoFilter from './components/TodoFilter.vue';
import { useTodo } from './composables/useTodo';

const {
  filter,
  filteredTodos,
  activeCount,
  completedCount,
  totalCount,
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodo,
  clearCompleted,
  setFilter,
} = useTodo();
</script>

<style>
.app {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}
h1 { text-align: center; color: #333; }
.todo-list {
  margin-top: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}
.empty { text-align: center; padding: 32px; color: #999; }
.todo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}
</style>
```

## 扩展练习

```
1. 添加拖拽排序功能
2. 添加优先级标签（高/中/低）
3. 添加到期日期和提醒
4. 实现撤销/重做功能
5. 添加暗色主题切换
6. 用 React 重写一遍
```

## 下一步

- 🖥️ [后台管理系统](/frontend/concepts/practice/admin) - 进阶实战
- 📝 [个人博客搭建](/frontend/concepts/practice/blog) - 综合实战
