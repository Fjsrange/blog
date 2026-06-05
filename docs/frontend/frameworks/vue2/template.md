---
title: 模板语法与指令
---

# 模板语法与指令

Vue2 使用基于 HTML 的模板语法，允许声明式地将数据绑定到 DOM 上。指令是带有 `v-` 前缀的特殊属性。

## 插值

```html
<!-- 文本插值 -->
<span>{{ message }}</span>

<!-- 一次性插值（不随数据变化更新） -->
<span v-once>{{ message }}</span>

<!-- 原始 HTML（注意 XSS 风险） -->
<div v-html="rawHtml"></div>

<!-- 属性绑定（不能用 {{ }}） -->
<div v-bind:id="dynamicId"></div>
<img :src="imageUrl" :alt="imageAlt">

<!-- JavaScript 表达式 -->
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div :class="'list-' + type"></div>
```

## 内置指令

### v-bind 属性绑定

```html
<!-- 基本绑定 -->
<img :src="imageUrl">

<!-- class 绑定 -->
<!-- 对象语法 -->
<div :class="{ active: isActive, 'text-danger': hasError }"></div>

<!-- 数组语法 -->
<div :class="[baseClass, isActive ? 'active' : '']"></div>

<!-- 数组中使用对象 -->
<div :class="[{ active: isActive }, errorClass]"></div>

<!-- style 绑定 -->
<!-- 对象语法 -->
<div :style="{ color: activeColor, fontSize: size + 'px' }"></div>
<div :style="styleObject"></div>

<!-- 数组语法（合并多个样式对象） -->
<div :style="[baseStyles, overridingStyles]"></div>

<!-- 绑定多个属性 -->
<div v-bind="{ id: 'container', class: 'wrapper' }"></div>
```

### v-on 事件绑定

```html
<!-- 基本绑定 -->
<button @click="handleClick">点击</button>

<!-- 内联语句 -->
<button @click="count++">+1</button>

<!-- 调用方法 -->
<button @click="greet('Hello')">问候</button>

<!-- 访问原生事件 -->
<button @click="handleClick($event)">点击</button>

<!-- 事件修饰符 -->
<form @submit.prevent="onSubmit">阻止默认</form>
<div @click.stop="handler">阻止冒泡</div>
<div @click.capture="handler">捕获模式</div>
<div @click.self="handler">仅自身触发</div>
<div @click.once="handler">只触发一次</div>
<div @click.passive="handler">被动监听</div>

<!-- 按键修饰符 -->
<input @keyup.enter="submit">
<input @keyup.esc="cancel">
<input @keyup.tab="next">
<input @keyup.delete="remove">

<!-- 系统修饰键 -->
<input @keydown.ctrl="handler">
<input @keydown.ctrl.enter="handler">
<input @click.ctrl="handler"> <!-- Ctrl + 点击 -->

<!-- 鼠标按钮修饰符 -->
<button @click.left="handler">左键</button>
<button @click.right="handler">右键</button>
<button @click.middle="handler">中键</button>
```

### v-model 双向绑定

```html
<!-- 文本输入 -->
<input v-model="message" placeholder="请输入">
<textarea v-model="content"></textarea>

<!-- 复选框 -->
<input type="checkbox" v-model="checked">
<!-- 多个复选框绑定数组 -->
<input type="checkbox" v-model="selected" value="A">
<input type="checkbox" v-model="selected" value="B">

<!-- 单选框 -->
<input type="radio" v-model="picked" value="A">
<input type="radio" v-model="picked" value="B">

<!-- 下拉选择 -->
<select v-model="selected">
  <option disabled value="">请选择</option>
  <option value="A">A</option>
  <option value="B">B</option>
</select>

<!-- 修饰符 -->
<input v-model.lazy="message">    <!-- change 时更新 -->
<input v-model.number="age">      <!-- 自动转数字 -->
<input v-model.trim="name">       <!-- 去除空格 -->
```

### v-if / v-else-if / v-else 条件渲染

```html
<div v-if="type === 'A'">类型 A</div>
<div v-else-if="type === 'B'">类型 B</div>
<div v-else>其他类型</div>

<!-- template 上使用 v-if（不渲染额外元素） -->
<template v-if="showGroup">
  <h1>标题</h1>
  <p>内容</p>
</template>

<!-- 用 key 管理可复用元素 -->
<input v-if="type === 'email'" key="email" placeholder="邮箱">
<input v-else key="username" placeholder="用户名">
```

### v-show 显示隐藏

```html
<!-- 通过 display: none 切换显示 -->
<div v-show="isVisible">条件显示</div>

<!-- v-if vs v-show -->
<!-- v-if: 真正的条件渲染，切换开销大，适合不频繁切换 -->
<!-- v-show: CSS 切换，初始渲染开销大，适合频繁切换 -->
```

### v-for 列表渲染

```html
<!-- 遍历数组 -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }} - {{ item.name }}
  </li>
</ul>

<!-- 遍历对象 -->
<div v-for="(value, key) in user" :key="key">
  {{ key }}: {{ value }}
</div>

<div v-for="(value, key, index) in user" :key="key">
  {{ index }}. {{ key }}: {{ value }}
</div>

<!-- 遍历范围 -->
<span v-for="n in 10" :key="n">{{ n }}</span>

<!-- template 上使用 v-for -->
<template v-for="item in items">
  <h3 :key="item.id + '-title'">{{ item.title }}</h3>
  <p :key="item.id + '-desc'">{{ item.desc }}</p>
</template>

<!-- ⚠️ v-for 和 v-if 不要同时使用 -->
<!-- ❌ v-for 优先级高于 v-if，每次遍历都会判断 -->
<li v-for="item in items" v-if="!item.disabled" :key="item.id">

<!-- ✅ 使用 computed 过滤 -->
<li v-for="item in activeItems" :key="item.id">

computed: {
  activeItems() {
    return this.items.filter(item => !item.disabled);
  }
}
```

## 自定义指令

```javascript
// 全局注册
Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

// 局部注册
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
  },
};

// 使用
<input v-focus>
```

### 钩子函数

```javascript
Vue.directive('my-directive', {
  bind(el, binding, vnode) {
    // 指令第一次绑定到元素时调用（初始化）
  },
  inserted(el, binding) {
    // 绑定元素插入父节点时调用
  },
  update(el, binding) {
    // VNode 更新时调用
  },
  componentUpdated(el, binding) {
    // VNode 及其子 VNode 全部更新后调用
  },
  unbind(el, binding) {
    // 指令与元素解绑时调用（清理）
  },
});
```

### 钩子参数

```javascript
// binding 对象包含：
{
  name: 'my-directive',     // 指令名（不含 v- 前缀）
  value: 'hello',           // 绑定值：v-my="'hello'"
  oldValue: 'world',        // 前一个值（仅在 update 中可用）
  expression: 'message',    // 字符串形式的表达式
  arg: 'foo',               // 参数：v-my:foo
  modifiers: { bar: true }, // 修饰符：v-my.bar
}
```

### 实用自定义指令

```javascript
// 防抖点击
Vue.directive('debounce', {
  inserted(el, binding) {
    let timer = null;
    el.addEventListener('click', () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        binding.value();
      }, binding.arg || 300);
    });
  },
});
// <button v-debounce:500="handleClick">防抖按钮</button>

// 权限控制
Vue.directive('permission', {
  inserted(el, binding) {
    const { value } = binding;
    const roles = store.getters.roles;
    if (value && !roles.includes(value)) {
      el.parentNode?.removeChild(el);
    }
  },
});
// <button v-permission="'admin'">删除</button>

// 拖拽指令
Vue.directive('drag', {
  inserted(el) {
    el.style.cursor = 'move';
    el.style.position = 'absolute';
    el.addEventListener('mousedown', (e) => {
      const disX = e.clientX - el.offsetLeft;
      const disY = e.clientY - el.offsetTop;
      const move = (e) => {
        el.style.left = e.clientX - disX + 'px';
        el.style.top = e.clientY - disY + 'px';
      };
      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  },
});
```

## 过滤器

```javascript
// 全局过滤器
Vue.filter('currency', (value) => {
  if (!value) return '';
  return '¥' + Number(value).toFixed(2);
});

Vue.filter('dateFormat', (value, format = 'YYYY-MM-DD') => {
  return dayjs(value).format(format);
});

// 局部过滤器
export default {
  filters: {
    truncate(value, length = 20) {
      if (!value) return '';
      return value.length > length ? value.slice(0, length) + '...' : value;
    },
  },
};

// 使用
<p>{{ price | currency }}</p>
<p>{{ date | dateFormat('YYYY年MM月DD日') }}</p>
<p>{{ text | truncate(50) }}</p>
```

## 下一步

- 🧩 [组件系统](/frontend/frameworks/vue2/components) - 组件进阶用法
- 🗂️ [Vuex 状态管理](/frontend/frameworks/vue2/vuex) - 全局状态管理
- 🛤️ [Vue Router 路由](/frontend/frameworks/vue2/router) - 路由管理
