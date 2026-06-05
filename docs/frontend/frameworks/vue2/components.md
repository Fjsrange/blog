---
title: 组件系统
---

# 组件系统

组件是 Vue 最强大的功能之一，它允许你将 UI 拆分为独立、可复用的单元，是构建大型应用的基础。

## 组件注册

```javascript
// 全局注册（所有组件可直接使用）
Vue.component('my-button', {
  template: '<button @click="$emit('click')"><slot></slot></button>',
});

// 局部注册（推荐，按需引入）
import MyButton from './MyButton.vue';

export default {
  components: {
    MyButton, // 简写，等价于 MyButton: MyButton
  },
};
```

## 单文件组件 (SFC)

```vue
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" />
    <h3>{{ user.name }}</h3>
    <p>{{ user.bio }}</p>
    <button @click="handleFollow">
      {{ isFollowing ? '已关注' : '关注' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'UserCard', // 组件名（用于递归、devtools）

  // 组件选项
  inheritAttrs: true, // 是否继承父组件属性

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isFollowing: false,
    };
  },

  computed: {
    buttonText() {
      return this.isFollowing ? '已关注' : '关注';
    },
  },

  methods: {
    handleFollow() {
      this.isFollowing = !this.isFollowing;
      this.$emit('follow-change', this.isFollowing);
    },
  },

  mounted() {
    console.log('UserCard mounted');
  },
};
</script>

<style scoped>
.user-card {
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

## Props 验证

```javascript
export default {
  props: {
    // 基础类型检测
    name: String,
    age: Number,
    isActive: Boolean,

    // 多种类型
    value: [String, Number],

    // 必填
    title: {
      type: String,
      required: true,
    },

    // 默认值
    type: {
      type: String,
      default: 'primary',
    },

    // 对象/数组默认值必须用工厂函数
    items: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => ({ theme: 'light' }),
    },

    // 自定义验证
    status: {
      type: String,
      validator: (val) => ['active', 'inactive', 'pending'].includes(val),
    },
  },
};
```

## 自定义事件

```javascript
// 子组件 - 触发事件
export default {
  methods: {
    submit() {
      // 基本用法
      this.$emit('submit');

      // 传递数据
      this.$emit('update', { id: 1, name: '张三' });

      // 验证事件名（建议 kebab-case）
      this.$emit('update-user', userData);
    },
  },
};

// 父组件 - 监听事件
<child-form @submit="handleSubmit" @update-user="handleUpdate" />
```

### v-model 自定义组件

```javascript
// Vue2 的 v-model 默认使用 value prop + input 事件
export default {
  props: ['value'],
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};

// 自定义 v-model 属性和事件
export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: Boolean,
  },
  methods: {
    toggle() {
      this.$emit('change', !this.checked);
    },
  },
};
```

## 插槽 Slots

```vue
<!-- 默认插槽 -->
<!-- 子组件 Card.vue -->
<template>
  <div class="card">
    <slot>默认内容</slot>
  </div>
</template>

<!-- 父组件使用 -->
<Card>
  <p>自定义内容</p>
</Card>
```

```vue
<!-- 具名插槽 -->
<!-- 子组件 Layout.vue -->
<template>
  <div class="layout">
    <header><slot name="header"></slot></header>
    <main><slot></slot></main>
    <footer><slot name="footer"></slot></footer>
  </div>
</template>

<!-- 父组件使用 -->
<Layout>
  <template #header>
    <h1>页面标题</h1>
  </template>
  <p>主体内容</p>
  <template #footer>
    <p>页脚信息</p>
  </template>
</Layout>
```

```vue
<!-- 作用域插槽 -->
<!-- 子组件 List.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="index">
        {{ item.name }} <!-- 默认渲染 -->
      </slot>
    </li>
  </ul>
</template>

<!-- 父组件使用 -->
<List :items="users">
  <template #default="{ item, index }">
    <span class="idx">{{ index + 1 }}</span>
    <span>{{ item.name }} - {{ item.email }}</span>
  </template>
</List>
```

## 动态组件

```html
<!-- 使用 is 属性动态切换组件 -->
<component :is="currentComponent"></component>

<!-- 配合 keep-alive 缓存组件 -->
<keep-alive :include="['UserList', 'UserDetail']" :max="10">
  <component :is="currentComponent"></component>
</keep-alive>
```

```javascript
export default {
  data() {
    return {
      currentTab: 'home',
    };
  },
  computed: {
    currentComponent() {
      const tabs = {
        home: 'HomeTab',
        profile: 'ProfileTab',
        settings: 'SettingsTab',
      };
      return tabs[this.currentTab];
    };
  },
};
```

## 异步组件

```javascript
// 全局异步组件
Vue.component('AsyncComp', (resolve, reject) => {
  import('./HeavyComponent.vue').then(resolve).catch(reject);
});

// 局部异步组件
export default {
  components: {
    AsyncComp: () => import('./HeavyComponent.vue'),
  },
};

// 带加载状态的异步组件
const AsyncComp = () => ({
  component: import('./HeavyComponent.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 10000,
});
```

## 递归组件

```vue
<!-- TreeItem.vue -->
<template>
  <li>
    <span @click="toggle">{{ node.name }}</span>
    <ul v-if="node.children && node.children.length" v-show="isOpen">
      <tree-item
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'TreeItem', // 必须有 name 才能递归
  props: {
    node: Object,
  },
  data() {
    return { isOpen: true };
  },
  methods: {
    toggle() { this.isOpen = !this.isOpen; },
  },
};
</script>
```

## 组件最佳实践

```javascript
// ✅ 命名规范
// 组件名：PascalCase（MyButton, UserCard）
// 事件名：kebab-case（update-user, item-click）
// Prop 名：kebab-case 在模板中（user-name）

// ✅ 单一职责
// 每个组件只做一件事
// 可拆分为：展示组件 + 容器组件

// ✅ Props Down, Events Up
// 父 → 子：通过 props 传递数据
// 子 → 父：通过 events 传递消息
// 避免直接修改 props

// ✅ 合理使用 v-if 和 v-show
// v-if：条件很少变化
// v-show：频繁切换显示

// ✅ 及时销毁
// 在 beforeDestroy 中清理定时器、事件监听等
export default {
  mounted() {
    this.timer = setInterval(this.poll, 5000);
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener('resize', this.onResize);
  },
};
```

## 下一步

- 🗂️ [Vuex 状态管理](/frontend/frameworks/vue2/vuex) - 全局状态管理
- 🛤️ [Vue Router 路由](/frontend/frameworks/vue2/router) - 路由管理
- ⚡ [Vue3 基础入门](/frontend/frameworks/vue3/) - 学习 Vue3 新特性
