---
title: React Hooks
---

# React Hooks

Hooks 是 React 16.8 引入的特性，让函数组件拥有状态管理和生命周期等能力，是现代 React 开发的核心。

## Hooks 规则

```javascript
// ⚠️ 两条铁律
// 1. 只在最顶层使用 Hook（不要在循环、条件或嵌套函数中调用）
// 2. 只在 React 函数组件或自定义 Hook 中调用

// ❌ 错误用法
if (condition) {
  useState(0); // 不能在条件中
}
for (let i = 0; i < 5; i++) {
  useEffect(() => {}); // 不能在循环中
}

// ✅ 正确用法
const [count, setCount] = useState(0);
useEffect(() => {
  if (condition) { /* ... */ }
}, [condition]);
```

## useState - 状态

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // 直接更新
  const increment = () => setCount(count + 1);

  // 函数式更新（推荐，避免闭包陷阱）
  const incrementSafe = () => setCount(prev => prev + 1);

  // 对象状态
  const [user, setUser] = useState({ name: '', age: 0 });
  const updateName = (name) => setUser(prev => ({ ...prev, name }));

  // 数组状态
  const [items, setItems] = useState([]);
  const addItem = (item) => setItems(prev => [...prev, item]);
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const updateItem = (id, data) => setItems(prev =>
    prev.map(i => i.id === id ? { ...i, ...data } : i)
  );

  // 惰性初始化
  const [data, setData] = useState(() => expensiveComputation());

  return <button onClick={increment}>{count}</button>;
}
```

## useEffect - 副作用

```jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // 每次渲染后执行
  useEffect(() => {
    console.log('组件渲染了');
  });

  // 挂载时执行一次（空依赖数组）
  useEffect(() => {
    console.log('组件挂载了');
  }, []);

  // 依赖变化时执行
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // 仅 userId 变化时重新执行

  // 带清理函数
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('tick');
    }, 1000);

    // 返回清理函数（组件卸载或依赖变化前执行）
    return () => clearInterval(timer);
  }, []);

  // 事件监听
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
}
```

### useEffect 依赖陷阱

```jsx
// ❌ 缺少依赖
useEffect(() => {
  fetchData(userId); // userId 应该在依赖中
}, []); // ESLint 会警告

// ✅ 补全依赖
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ❌ 对象/数组作为依赖（每次渲染都是新引用）
useEffect(() => {
  fetchData(options);
}, [options]); // 每次渲染都会执行

// ✅ 使用 useMemo 或提取原始值
const query = useMemo(() => options.query, [options.query]);
useEffect(() => {
  fetchData(query);
}, [query]);

// ❌ 函数作为依赖
useEffect(() => {
  fetchData(userId);
}, [fetchData]); // 如果 fetchData 每次渲染都重新创建

// ✅ 使用 useCallback
const fetchData = useCallback(async (id) => {
  const res = await api.getUser(id);
  setUser(res);
}, []);

useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]);
```

## useContext - 上下文

```jsx
import { createContext, useContext, useState } from 'react';

// 创建 Context
const ThemeContext = createContext('light');
const UserContext = createContext(null);

// 提供者
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Layout />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 消费者
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <header className={`header theme-${theme}`}>
      <span>{user?.name ?? '未登录'}</span>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </header>
  );
}
```

## useReducer - 复杂状态

```jsx
import { useReducer } from 'react';

// 定义 reducer
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    case 'DELETE':
      return state.filter(todo => todo.id !== action.payload);
    case 'CLEAR_COMPLETED':
      return state.filter(todo => !todo.done);
    default:
      return state;
  }
}

function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);

  const addTodo = (text) => dispatch({ type: 'ADD', payload: text });
  const toggleTodo = (id) => dispatch({ type: 'TOGGLE', payload: id });
  const deleteTodo = (id) => dispatch({ type: 'DELETE', payload: id });

  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}
```

## useMemo - 缓存计算

```jsx
import { useMemo } from 'react';

function ProductList({ products, category, sortBy }) {
  // 缓存计算结果
  const filteredAndSorted = useMemo(() => {
    return products
      .filter(p => p.category === category)
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, category, sortBy]);

  // ⚠️ 不要过度使用 useMemo
  // 简单计算不需要缓存，缓存本身也有开销

  return (
    <ul>
      {filteredAndSorted.map(product => (
        <li key={product.id}>{product.name} - ¥{product.price}</li>
      ))}
    </ul>
  );
}
```

## useCallback - 缓存函数

```jsx
import { useCallback } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  // 缓存函数引用，避免子组件不必要的重渲染
  const handleSearch = useCallback((value) => {
    onSearch(value);
  }, [onSearch]);

  // 配合 useMemo 使用
  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch]
  );

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

## useRef - 引用

```jsx
import { useRef, useEffect } from 'react';

function TextInput() {
  // 1. DOM 引用
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 2. 存储可变值（不触发重渲染）
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  // 3. 保存前一次的值
  const prevValueRef = useRef(value);
  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);
  const prevValue = prevValueRef.current;

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={startTimer}>开始</button>
      <button onClick={stopTimer}>停止</button>
    </div>
  );
}
```

## 自定义 Hook

```jsx
// useFetch.js
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// useLocalStorage.js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 使用
function App() {
  const { data, loading, error } = useFetch('/api/users');
  const [theme, setTheme] = useLocalStorage('theme', 'light');
}
```

## Hooks 对应生命周期

| React 生命周期 | Hooks 等价 |
|---------------|-----------|
| componentDidMount | useEffect(() => {}, []) |
| componentDidUpdate | useEffect(() => {}) |
| componentWillUnmount | useEffect(() => () => cleanup, []) |
| shouldComponentUpdate | React.memo + useMemo/useCallback |

## 下一步

- 🗂️ [Redux 状态管理](/frontend/frameworks/react/redux) - 全局状态管理
- 🛤️ [React Router](/frontend/frameworks/react/router) - 路由管理
- 📊 [图表基础入门](/frontend/advanced/charts/) - 数据可视化
