---
title: JSX 语法
---

# JSX 语法

JSX 是 JavaScript XML 的缩写，是 React 推荐的模板语法。它在 JavaScript 中书写类似 HTML 的结构，经过编译后转换为 React 元素。

## 基本语法

```jsx
// JSX 本质是 React.createElement 的语法糖
const element = <h1>Hello!</h1>;
// 等价于
const element = React.createElement('h1', null, 'Hello!');

// JSX 可以嵌套
const card = (
  <div className="card">
    <h2>标题</h2>
    <p>内容</p>
  </div>
);

// JSX 必须有根元素
// ✅ 使用 Fragment 避免多余 DOM 节点
import { Fragment } from 'react';

const list = (
  <Fragment>
    <dt>术语</dt>
    <dd>解释</dd>
  </Fragment>
);

// 简写形式
const list = (
  <>
    <dt>术语</dt>
    <dd>解释</dd>
  </>
);
```

## 表达式

```jsx
// 花括号内可以使用任何 JavaScript 表达式
const name = '张三';
const element = <h1>你好，{name}！</h1>;

// 函数调用
const formatName = (user) => `${user.firstName} ${user.lastName}`;
const element = <h1>{formatName(user)}</h1>;

// 三元运算符
const element = (
  <div>
    {isLoggedIn ? <Dashboard /> : <LoginPage />}
  </div>
);

// 逻辑与（&&）
const element = (
  <div>
    {messages.length > 0 && <MessageList messages={messages} />}
  </div>
);

// 模板字符串
const element = <div className={`btn btn-${type}`} />;

// 数组 map
const list = (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
);

// ⚠️ 不能在 JSX 中使用 if/for 语句
// ❌ {if (condition) { <Component /> }}
// ✅ 使用三元运算符或 && 代替
```

## 属性

```jsx
// 字符串属性
const element = <div className="container" id="main">内容</div>;

// 动态属性值（使用花括号）
const element = <img src={imageUrl} alt={imageAlt} />;

// 布尔属性
<input disabled={isDisabled} />
<input required /> {/* 等价于 required={true} */}

// 展开属性
const props = { className: 'card', id: 'card-1', onClick: handleClick };
const element = <div {...props}>内容</div>;

// 合并属性（后面的覆盖前面的）
const element = <div {...defaultProps} {...customProps} />;

// style 属性（驼峰命名，对象形式）
const element = (
  <div style={{
    backgroundColor: 'red',
    fontSize: '16px',
    marginTop: '10px',
    WebkitTransition: 'all 0.3s', // 浏览器前缀大写
  }}>
    内容
  </div>
);

// class → className
<div className="container active">内容</div>

// for → htmlFor
<label htmlFor="username">用户名</label>
```

## 事件处理

```jsx
// 事件命名：驼峰式
<button onClick={handleClick}>点击</button>
<input onChange={handleChange} />
<form onSubmit={handleSubmit}>

// 传递参数
// 方式一：箭头函数
<button onClick={() => handleDelete(id)}>删除</button>

// 方式二：bind
<button onClick={handleDelete.bind(this, id)}>删除</button>

// 方式三：data 属性
<button data-id={id} onClick={(e) => handleDelete(e.target.dataset.id)}>
  删除
</button>

// 获取事件对象
<button onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  handleClick(e);
}}>
  点击
</button>

// 事件委托
function List({ items }) {
  const handleClick = (e) => {
    const li = e.target.closest('li');
    if (li) {
      const id = li.dataset.id;
      handleItemClick(id);
    }
  };

  return (
    <ul onClick={handleClick}>
      {items.map(item => (
        <li key={item.id} data-id={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

## 条件渲染

```jsx
// 方式一：三元运算符
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <h1>欢迎回来！</h1> : <h1>请登录</h1>}
    </div>
  );
}

// 方式二：&& 短路（只关心"显示"的情况）
function Mailbox({ unreadMessages }) {
  return (
    <div>
      {unreadMessages.length > 0 && (
        <h2>你有 {unreadMessages.length} 条未读消息</h2>
      )}
    </div>
  );
}

// 方式三：提前返回
function UserPanel({ user }) {
  if (!user) {
    return <p>请先登录</p>;
  }
  return <Dashboard user={user} />;
}

// 方式四：变量存储
function Button({ type }) {
  let icon;
  if (type === 'save') icon = <SaveIcon />;
  else if (type === 'delete') icon = <DeleteIcon />;
  else icon = <DefaultIcon />;

  return <button>{icon} {type}</button>;
}

// 方式五：IIFE
function Component({ type }) {
  return (
    <div>
      {(() => {
        switch (type) {
          case 'A': return <TypeA />;
          case 'B': return <TypeB />;
          default: return <Default />;
        }
      })()}
    </div>
  );
}
```

## 列表渲染

```jsx
// 基本 map
const list = items.map(item => (
  <li key={item.id}>{item.name}</li>
));

// 嵌套列表
const categories = categories.map(category => (
  <div key={category.id}>
    <h3>{category.name}</h3>
    <ul>
      {category.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  </div>
));

// 提取为组件
function ListItem({ item }) {
  return <li>{item.name}</li>;
}

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

// ⚠️ key 规则
// 1. 兄弟节点中必须唯一
// 2. 不要用 index（列表会增删排序时）
// 3. key 不会传给子组件（需用其他 prop）
// ❌ {items.map((item, index) => <li key={index}>{item.name}</li>)}
// ✅ {items.map(item => <li key={item.id}>{item.name}</li>)}
```

## 子元素

```jsx
// children prop
function Card({ children, title }) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
}

// 使用
<Card title="用户信息">
  <p>姓名：张三</p>
  <p>年龄：25</p>
</Card>

// 具名插槽（通过 props）
function Layout({ header, sidebar, children }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="main">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

// 使用
<Layout
  header={<Header />}
  sidebar={<Sidebar />}
>
  <Content />
</Layout>
```

## 安全性

```jsx
// JSX 自动转义，防止 XSS
const userInput = '<script>alert("xss")</script>';
const element = <div>{userInput}</div>;
// 渲染为文本，不会执行脚本 ✅

// dangerouslySetInnerHTML（谨慎使用）
const htmlContent = '<strong>加粗文本</strong>';
const element = <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;

// ⚠️ 使用前确保内容已消毒
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml);
const element = <div dangerouslySetInnerHTML={{ __html: clean }} />;
```

## 下一步

- 🪝 [React Hooks](/frontend/frameworks/react/hooks) - 核心 Hooks
- 🗂️ [Redux 状态管理](/frontend/frameworks/react/redux) - 全局状态管理
- 🛤️ [React Router](/frontend/frameworks/react/router) - 路由管理
