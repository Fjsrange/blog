---
title: React Router
---

# React Router

React Router 是 React 的官方路由库，用于在单页面应用中实现页面导航和路由管理。

## 安装

```bash
npm install react-router-dom
```

## 基本使用

### 创建路由

```jsx
// router/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/layout/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import User from '@/pages/User';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'user/:id', element: <User /> },
    ],
  },
]);
```

```jsx
// main.jsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return <RouterProvider router={router} />;
}
```

### 布局组件

```jsx
// layout/Layout.jsx
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="layout">
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
      </nav>
      <main>
        <Outlet /> {/* 子路由渲染位置 */}
      </main>
    </div>
  );
}
```

## 导航组件

### Link 与 NavLink

```jsx
import { Link, NavLink } from 'react-router-dom';

// Link - 基本导航
<Link to="/">首页</Link>
<Link to="/about">关于</Link>
<Link to={`/user/${userId}`}>用户</Link>

// NavLink - 带激活状态的导航
<NavLink
  to="/about"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  关于
</NavLink>

// 样式对象写法
<NavLink
  to="/about"
  style={({ isActive }) => ({ color: isActive ? 'red' : 'black' })}
>
  关于
</NavLink>
```

### 编程式导航

```jsx
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login(credentials);
    navigate('/dashboard');              // 跳转
    navigate('/dashboard', { replace: true }); // 替换（不留历史）
    navigate(-1);                        // 后退
    navigate(1);                         // 前进
  };

  return <button onClick={handleLogin}>登录</button>;
}
```

## 路由参数

### 动态参数

```jsx
// 路由定义
{ path: 'user/:id', element: <User /> }
{ path: 'post/:category/:id', element: <Post /> }

// 获取参数
import { useParams } from 'react-router-dom';

function User() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);

  return <div>{user?.name}</div>;
}
```

### 查询参数

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', String(newPage));
      return prev;
    });
  };

  return (
    <div>
      <input value={query} onChange={(e) => handleSearch(e.target.value)} />
      <p>搜索：{query}，第 {page} 页</p>
    </div>
  );
}
```

### 位置信息

```jsx
import { useLocation } from 'react-router-dom';

function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

// 获取完整位置信息
function LocationInfo() {
  const location = useLocation();
  // location.pathname  - 路径
  // location.search    - 查询字符串
  // location.hash      - 哈希
  // location.state     - 传递的状态
  // location.key       - 唯一标识
}
```

## 嵌套路由

```jsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'user',
        element: <UserLayout />,
        children: [
          { index: true, element: <UserList /> },
          { path: ':id', element: <UserDetail /> },
          { path: ':id/edit', element: <UserEdit /> },
        ],
      },
    ],
  },
]);

// UserLayout.jsx
function UserLayout() {
  return (
    <div>
      <h2>用户管理</h2>
      <Outlet />
    </div>
  );
}
```

## 路由守卫

### 认证守卫

```jsx
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // 保存来源路径，登录后跳回
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// 使用
{
  path: 'dashboard',
  element: (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
}
```

### 角色权限

```jsx
function RequireRole({ children, roles }) {
  const { user } = useAuth();

  if (!roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

// 使用
{
  path: 'admin',
  element: (
    <RequireAuth>
      <RequireRole roles={['admin']}>
        <AdminPanel />
      </RequireRole>
    </RequireAuth>
  ),
}
```

### 登录页跳回

```jsx
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (credentials) => {
    await login(credentials);
    navigate(from, { replace: true }); // 跳回来源页
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

## 数据加载（Loader）

```jsx
// React Router v6.4+ 支持数据加载
import { createBrowserRouter, useLoaderData } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: 'user/:id',
    element: <UserDetail />,
    loader: async ({ params }) => {
      const user = await fetchUser(params.id);
      return { user };
    },
  },
]);

// 组件中使用
function UserDetail() {
  const { user } = useLoaderData();
  return <div>{user.name}</div>;
}
```

## 404 与懒加载

```jsx
import { lazy, Suspense } from 'react';

// 懒加载组件
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

function LazyRoute({ component: Component }) {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Component />
    </Suspense>
  );
}

// 404 路由
{
  path: '*',
  element: <NotFound />,
}
```

## 下一步

- 🗂️ [Redux 状态管理](/frontend/frameworks/react/redux) - 全局状态管理
- 📊 [图表基础入门](/frontend/advanced/charts/) - 数据可视化
- 🧠 [核心概念](/frontend/concepts/) - 前端核心概念
