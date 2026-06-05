---
title: Redux 状态管理
---

# Redux 状态管理

Redux 是 React 生态中最流行的状态管理库，遵循单向数据流和不可变状态原则，适合管理大型应用的复杂状态。

## Redux 核心概念

```
         dispatch          reducer          store
Action ──────────→ Middleware ──────────→ New State ──→ View
  ↑                                                    │
  └────────────────────────────────────────────────────┘
                      单向数据流
```

| 概念 | 说明 |
|------|------|
| Store | 全局唯一的状态容器 |
| Action | 描述发生了什么的普通对象 |
| Reducer | 纯函数，根据 Action 返回新 State |
| Dispatch | 触发 Action 的方法 |
| Middleware | 处理副作用的中间件 |
| Selector | 从 Store 中提取数据的函数 |

## Redux Toolkit（推荐）

Redux Toolkit（RTK）是 Redux 官方推荐的使用方式，简化了 Redux 的模板代码。

```bash
npm install @reduxjs/toolkit react-redux
```

### 创建 Slice

```javascript
// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 异步 Thunk
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('请求失败');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: null,
    token: localStorage.getItem('token') || '',
    loading: false,
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.info = null;
      state.token = '';
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setToken, logout, clearError } = userSlice.actions;
export default userSlice.reducer;
```

### 创建 Store

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
  // 中间件
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 关闭序列化检查
    }),
  // 开发工具
  devTools: process.env.NODE_ENV !== 'production',
});

// TypeScript 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 在组件中使用

```jsx
// 方式一：useSelector + useDispatch
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, logout } from '@/store/userSlice';
import type { RootState, AppDispatch } from '@/store';

function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const { info, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [userId, dispatch]);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <h2>{info?.name}</h2>
      <button onClick={() => dispatch(logout())}>退出登录</button>
    </div>
  );
}
```

### 类型化的 Hooks（TypeScript 推荐）

```typescript
// store/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// 避免到处写类型
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

```tsx
// 使用类型化 Hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUser, logout } from '@/store/userSlice';

function UserProfile() {
  const dispatch = useAppDispatch();
  const { info, loading } = useAppSelector((state) => state.user);
  // 现在有完整的类型提示 ✅
}
```

## 购物车示例

```javascript
// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.id !== id);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// Selector
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;
```

```jsx
// components/Cart.jsx
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addItem, removeItem, updateQuantity } from '@/store/cartSlice';
import { selectCartTotal, selectCartCount } from '@/store/cartSlice';

function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);

  return (
    <div>
      <h2>购物车 ({count} 件)</h2>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>¥{item.price}</span>
          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
          <button onClick={() => dispatch(removeItem(item.id))}>删除</button>
        </div>
      ))}
      <div>总计：¥{total}</div>
    </div>
  );
}
```

## Middleware 中间件

```javascript
// 自定义日志中间件
const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('Prev State:', store.getState());
  console.log('Action:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  console.groupEnd();
  return result;
};

// 自定义 API 中间件
const apiMiddleware = (store) => (next) => async (action) => {
  if (!action.meta?.api) return next(action);

  const { url, method, onSuccess, onError } = action.meta.api;

  try {
    const res = await fetch(url, { method });
    const data = await res.json();
    if (onSuccess) store.dispatch(onSuccess(data));
  } catch (error) {
    if (onError) store.dispatch(onError(error.message));
  }
};
```

## Redux vs 其他状态管理

| 特性 | Redux Toolkit | Zustand | Jotai | Context |
|------|--------------|---------|-------|---------|
| 学习曲线 | 中等 | 简单 | 简单 | 简单 |
| 模板代码 | 较少 | 极少 | 极少 | 少 |
| 异步处理 | createAsyncThunk | 内置 | 内置 | 手动 |
| DevTools | ✅ | ✅ | ✅ | ❌ |
| 适用场景 | 大型应用 | 中小型 | 原子化状态 | 简单共享 |

## 下一步

- 🛤️ [React Router](/frontend/frameworks/react/router) - 路由管理
- 🐻 [Pinia 状态管理](/frontend/frameworks/vue3/pinia) - Vue3 状态管理
- 🧠 [核心概念](/frontend/concepts/) - 前端核心概念
