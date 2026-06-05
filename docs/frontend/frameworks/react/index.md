---
title: React 基础入门
---

# React 基础入门

React 是由 Meta 开发的 JavaScript 库，用于构建用户界面。它采用声明式编程和组件化思想，通过虚拟 DOM 高效更新视图。

## 创建项目

```bash
# Create React App（传统方式）
npx create-react-app my-app

# Vite（推荐，更快）
npm create vite@latest my-app -- --template react
npm create vite@latest my-app -- --template react-ts

# Next.js（SSR 框架）
npx create-next-app@latest my-app
```

## JSX 语法

```jsx
// JSX 是 JavaScript 的语法扩展，看起来像 HTML
const element = <h1>Hello, React!</h1>;

// 表达式插值
const name = '张三';
const greeting = <h1>你好，{name}！</h1>;

// 表达式可以是任何 JavaScript
const formatName = (user) => `${user.firstName} ${user.lastName}`;
const element = <h1>{formatName(user)}</h1>;

// 属性绑定
const img = <img src={user.avatarUrl} alt={user.name} />;

// 条件渲染
const element = isLoggedIn
  ? <Dashboard />
  : <LoginPage />;

// 列表渲染（必须提供 key）
const list = (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
);

// JSX 注意事项
// 1. 必须有根元素（或 Fragment）
// 2. className 代替 class
// 3. htmlFor 代替 for
// 4. style 接受对象（驼峰命名）
// 5. 自闭合标签：<img />, <br />
const style = { backgroundColor: 'red', fontSize: '16px' };
<div className="container" style={style}>
  <label htmlFor="name">姓名：</label>
  <input id="name" type="text" />
</div>
```

## 函数组件

```jsx
// 函数组件（推荐）
function Welcome({ name, age }) {
  return (
    <div className="welcome">
      <h2>欢迎，{name}！</h2>
      <p>年龄：{age}</p>
    </div>
  );
}

// 箭头函数
const Welcome = ({ name, age }) => (
  <div>
    <h2>欢迎，{name}！</h2>
  </div>
);

// 使用组件
<Welcome name="张三" age={25} />
```

## Props

```jsx
// 传递 Props
<UserCard
  name="张三"
  age={25}
  hobbies={['编程', '阅读']}
  address={{ city: '北京' }}
  onClick={() => console.log('clicked')}
>

// 子组件
function UserCard({ name, age, hobbies, address, children }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>年龄：{age}</p>
      <p>城市：{address.city}</p>
      <ul>
        {hobbies.map(h => <li key={h}>{h}</li>)}
      </ul>
      {children}
    </div>
  );
}

// 默认值
function Button({ type = 'primary', size = 'medium', children }) {
  return (
    <button className={`btn btn-${type} btn-${size}`}>
      {children}
    </button>
  );
}

// Props 解构
function Card({ title, content, footer }) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{content}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
```

## State 状态

```jsx
import { useState } from 'react';

function Counter() {
  // 声明状态变量
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: '张三', age: 25 });

  // 更新状态
  const increment = () => setCount(count + 1);

  // 函数式更新（基于前一个状态）
  const incrementSafe = () => setCount(prev => prev + 1);

  // 更新对象状态
  const updateName = (newName) => {
    setUser(prev => ({ ...prev, name: newName }));
  };

  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  );
}
```

### useState 注意事项

```jsx
// ❌ 直接修改状态（不会触发更新）
user.name = '李四';
setUser(user);

// ✅ 创建新对象
setUser({ ...user, name: '李四' });

// ❌ 数组直接修改
items.push(newItem);
setItems(items);

// ✅ 创建新数组
setItems([...items, newItem]);     // 添加
setItems(items.filter(i => i.id !== id)); // 删除
setItems(items.map(i => i.id === id ? { ...i, done: true } : i)); // 修改

// 惰性初始化（避免重复计算）
const [data, setData] = useState(() => {
  return expensiveComputation(initialValue);
});
```

## 事件处理

```jsx
function Form() {
  const [value, setValue] = useState('');

  // 方式一：内联函数
  <button onClick={() => console.log('clicked')}>点击</button>

  // 方式二：引用函数
  function handleClick() {
    console.log('clicked');
  }
  <button onClick={handleClick}>点击</button>

  // 传递参数
  <button onClick={(e) => handleDelete(id, e)}>删除</button>

  // 表单事件
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交:', value);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={handleChange} />
      <button type="submit">提交</button>
    </form>
  );
}
```

## 条件渲染

```jsx
function UserGreeting({ isLoggedIn, user }) {
  // 方式一：三元运算符
  return (
    <div>
      {isLoggedIn ? <h1>欢迎回来！</h1> : <h1>请登录</h1>}
    </div>
  );

  // 方式二：&& 短路
  return (
    <div>
      {isLoggedIn && <Dashboard />}
    </div>
  );

  // 方式三：提前返回
  if (!isLoggedIn) {
    return <LoginPage />;
  }
  return <Dashboard user={user} />;
}
```

## 列表与 Key

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={todo.done ? 'done' : ''}>
          <span>{todo.text}</span>
          <button onClick={() => toggleTodo(todo.id)}>
            {todo.done ? '取消' : '完成'}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ⚠️ key 的规则
// 1. 必须在兄弟节点中唯一
// 2. 不要用 index 作为 key（列表会变化时）
// 3. key 不会作为 props 传递给子组件
```

## 表单处理

```jsx
function ControlledForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    subscribe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交数据:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="用户名"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="邮箱"
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="user">用户</option>
        <option value="admin">管理员</option>
      </select>
      <label>
        <input
          name="subscribe"
          type="checkbox"
          checked={formData.subscribe}
          onChange={handleChange}
        />
        订阅通知
      </label>
      <button type="submit">提交</button>
    </form>
  );
}
```

## 组件通信

```jsx
// 1. Props Down - 父传子
<Child data={parentData} onAction={handleAction} />

// 2. 回调函数 - 子传父
function Child({ onAction }) {
  return <button onClick={() => onAction('child data')}>通知父组件</button>;
}

// 3. Context - 跨层级传递
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

// 提供者
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <DeepChild />
    </ThemeContext.Provider>
  );
}

// 消费者
function DeepChild() {
  const theme = useContext(ThemeContext);
  return <div className={`theme-${theme}`}>当前主题：{theme}</div>;
}

// 4. 状态提升 - 兄弟组件共享状态
function Parent() {
  const [shared, setShared] = useState('');
  return (
    <>
      <ChildA value={shared} onChange={setShared} />
      <ChildB value={shared} />
    </>
  );
}
```

## 下一步

- 🎨 [JSX 语法](/frontend/frameworks/react/jsx) - 深入 JSX
- 🪝 [React Hooks](/frontend/frameworks/react/hooks) - 核心 Hooks
- 🗂️ [Redux 状态管理](/frontend/frameworks/react/redux) - 全局状态管理
- 🛤️ [React Router](/frontend/frameworks/react/router) - 路由管理
