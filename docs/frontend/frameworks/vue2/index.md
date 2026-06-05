---
title: Vue2 基础入门
---

# Vue2 基础入门

Vue2 是一个渐进式 JavaScript 框架，采用选项式 API（Options API），通过声明式渲染和组件化构建用户界面。

## 创建 Vue2 项目

```bash
# Vue CLI（传统方式）
npm install -g @vue/cli
vue create my-project

# 选择默认预设或手动选择特性
```

```html
<!-- CDN 引入 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.js"></script>
```

## Vue 实例

```javascript
const app = new Vue({
  // 挂载点
  el: '#app',

  // 数据
  data: {
    message: 'Hello Vue!',
    count: 0,
    user: { name: '张三', age: 25 },
    items: ['苹果', '香蕉', '橙子'],
  },

  // 计算属性
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    },
    // 带 getter 和 setter
    fullName: {
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      set(value) {
        const [first, last] = value.split(' ');
        this.firstName = first;
        this.lastName = last;
      },
    },
  },

  // 方法
  methods: {
    increment() {
      this.count++;
    },
  },

  // 侦听器
  watch: {
    count(newVal, oldVal) {
      console.log(`count: ${oldVal} → ${newVal}`);
    },
    // 深度监听
    user: {
      handler(newVal) {
        console.log('user changed:', newVal);
      },
      deep: true,
      immediate: true,
    },
  },

  // 生命周期钩子
  beforeCreate() { /* 实例初始化之后，数据观测之前 */ },
  created() { /* 实例创建完成，可访问 data/methods */ },
  beforeMount() { /* 挂载开始之前 */ },
  mounted() { /* DOM 挂载完成，可操作 DOM */ },
  beforeUpdate() { /* 数据更新，DOM 更新之前 */ },
  updated() { /* DOM 更新完成 */ },
  beforeDestroy() { /* 实例销毁之前，清理资源 */ },
  destroyed() { /* 实例销毁完成 */ },

  // 模板
  template: \`
    <div>
      <h1>{{ message }}</h1>
      <p>计数：{{ count }}</p>
      <button @click="increment">+1</button>
    </div>
  \`,
});
```

## 模板语法

```html
<!-- 文本插值 -->
<p>{{ message }}</p>
<p>{{ message | capitalize }}</p>

<!-- 原始 HTML -->
<p v-html="rawHtml"></p>

<!-- 属性绑定 -->
<img :src="imageUrl" :alt="imageAlt">
<a :href="url" :class="{ active: isActive }">链接</a>

<!-- 表单双向绑定 -->
<input v-model="message">
<textarea v-model="content"></textarea>
<select v-model="selected">
  <option value="">请选择</option>
  <option value="A">选项A</option>
</select>

<!-- 条件渲染 -->
<div v-if="type === 'A'">类型 A</div>
<div v-else-if="type === 'B'">类型 B</div>
<div v-else>其他类型</div>
<div v-show="isVisible">显示/隐藏</div>

<!-- 列表渲染 -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
  <li v-for="(item, index) in items" :key="index">
    {{ index }}: {{ item }}
  </li>
</ul>
```

## v-model 修饰符

```html
<!-- .lazy - 在 change 事件后同步 -->
<input v-model.lazy="message">

<!-- .number - 自动转为数字 -->
<input v-model.number="age" type="number">

<!-- .trim - 自动去除首尾空格 -->
<input v-model.trim="name">
```

## 组件基础

```javascript
// 全局注册
Vue.component('my-button', {
  template: \`
    <button :class="['btn', type]" @click="handleClick">
      <slot>默认按钮</slot>
    </button>
  \`,
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'primary', 'danger'].includes(val),
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
});

// 局部注册
export default {
  name: 'MyButton',
  // ...同上
};
```

## 组件通信

```javascript
// 1. Props Down - 父传子
// 父组件
<child :message="parentMsg" :items="list"></child>

// 子组件
export default {
  props: {
    message: String,
    items: { type: Array, default: () => [] },
  },
};

// 2. Events Up - 子传父
// 子组件
this.$emit('update', newValue);

// 父组件
<child @update="handleUpdate"></child>

// 3. .sync 修饰符（语法糖）
<child :value.sync="parentValue"></child>
// 等价于
<child :value="parentValue" @update:value="parentValue = $event"></child>

// 4. v-model（自定义组件）
<my-input v-model="value"></my-input>
// 子组件需要接收 value prop 并触发 input 事件
export default {
  props: ['value'],
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};

// 5. $refs - 直接访问子组件
<child ref="childRef"></child>
this.$refs.childRef.someMethod();

// 6. EventBus - 事件总线（跨组件）
const bus = new Vue();
bus.$emit('event', data);
bus.$on('event', handler);
bus.$off('event', handler);

// 7. $attrs / $listeners - 透传
// $attrs: 父组件传入但未在 props 中声明的属性
// $listeners: 父组件传入的事件监听器

// 8. provide / inject - 跨层级传递
// 祖先组件
export default {
  provide() {
    return { theme: this.theme, getUser: this.getUser };
  },
};

// 后代组件
export default {
  inject: ['theme', 'getUser'],
};
```

## 插槽

```html
<!-- 默认插槽 -->
<card>
  <p>卡片内容</p>
</card>

<!-- 子组件 -->
<div class="card">
  <slot>默认内容</slot>
</div>

<!-- 具名插槽 -->
<layout>
  <template #header>头部</template>
  <template #default>主体</template>
  <template #footer>底部</template>
</layout>

<!-- 子组件 -->
<div class="layout">
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>
  <footer><slot name="footer"></slot></footer>
</div>

<!-- 作用域插槽 -->
<list :items="items">
  <template #default="{ item, index }">
    <span>{{ index }}. {{ item.name }}</span>
  </template>
</list>

<!-- 子组件 -->
<ul>
  <li v-for="(item, index) in items" :key="index">
    <slot :item="item" :index="index"></slot>
  </li>
</ul>
```

## 过渡与动画

```html
<!-- 单元素过渡 -->
<transition name="fade">
  <p v-if="show">淡入淡出</p>
</transition>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<!-- 列表过渡 -->
<transition-group name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</transition-group>
```

## 下一步

- 📝 [模板语法与指令](/frontend/frameworks/vue2/template) - 深入模板语法
- 🧩 [组件系统](/frontend/frameworks/vue2/components) - 组件进阶
- 🗂️ [Vuex 状态管理](/frontend/frameworks/vue2/vuex) - 全局状态管理
- 🛤️ [Vue Router 路由](/frontend/frameworks/vue2/router) - 路由管理
