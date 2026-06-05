---
title: 设计模式
---

# 设计模式

设计模式是解决软件设计中常见问题的可复用方案。在前端开发中，合理使用设计模式可以提升代码的可维护性、可扩展性和可读性。

## 设计原则 SOLID

| 原则 | 含义 | 前端体现 |
|------|------|---------|
| S - 单一职责 | 一个模块只做一件事 | 组件拆分、函数单一功能 |
| O - 开闭原则 | 对扩展开放，对修改关闭 | 插件系统、策略模式 |
| L - 里氏替换 | 子类可以替换父类 | 继承与多态 |
| I - 接口隔离 | 不依赖不需要的接口 | Props 按需传递 |
| D - 依赖倒置 | 依赖抽象而非具体 | 依赖注入、IoC |

## 创建型模式

### 单例模式

```javascript
// 确保一个类只有一个实例
class Singleton {
  static #instance = null;

  constructor() {
    if (Singleton.#instance) {
      return Singleton.#instance;
    }
    Singleton.#instance = this;
  }
}

// 应用：全局状态、全局配置
const createStore = (() => {
  let instance = null;
  return () => {
    if (!instance) {
      instance = { state: {}, listeners: [] };
    }
    return instance;
  };
})();

// Vue3 中的单例
const pinia = createPinia(); // 全局唯一
app.use(pinia);

// 模块单例（ES Module 天然单例）
// store.js
export const store = reactive({ count: 0 }); // 单例
```

### 工厂模式

```javascript
// 简单工厂
function createButton(type, text) {
  const styles = {
    primary: 'bg-blue-500 text-white',
    danger: 'bg-red-500 text-white',
    default: 'bg-gray-200 text-gray-800',
  };
  return {
    type,
    text,
    className: styles[type] || styles.default,
  };
}

// 工厂方法
class Dialog {
  createContent() { throw new Error('需子类实现'); }
  render() {
    const content = this.createContent();
    return `<div class="dialog">${content}</div>`;
  }
}

class ConfirmDialog extends Dialog {
  createContent() { return '<p>确认操作？</p><button>确认</button>'; }
}

class AlertDialog extends Dialog {
  createContent() { return '<p>警告信息</p><button>知道了</button>'; }
}

// 抽象工厂
function createUIFramework(theme) {
  const themes = {
    light: {
      createButton: () => ({ color: '#333', bg: '#fff' }),
      createInput: () => ({ border: '#ddd', bg: '#fff' }),
    },
    dark: {
      createButton: () => ({ color: '#fff', bg: '#333' }),
      createInput: () => ({ border: '#555', bg: '#222' }),
    },
  };
  return themes[theme];
}
```

## 结构型模式

### 适配器模式

```javascript
// 将不兼容的接口转换为兼容的接口
// 旧接口
const oldApi = {
  getUserInfo: () => ({ user_name: '张三', user_age: 25 }),
};

// 适配器
const userAdapter = {
  getUser: () => {
    const old = oldApi.getUserInfo();
    return { name: old.user_name, age: old.user_age };
  },
};

// 实际应用：统一不同第三方库的接口
class StorageAdapter {
  constructor(storage) {
    this.storage = storage;
  }
  get(key) {
    const value = this.storage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }
}

const localStorageAdapter = new StorageAdapter(localStorage);
const sessionStorageAdapter = new StorageAdapter(sessionStorage);
```

### 装饰器模式

```javascript
// 动态给对象添加功能，不修改原有代码

// 函数装饰器
function withLoading(fn) {
  return async function (...args) {
    showLoading();
    try {
      return await fn.apply(this, args);
    } finally {
      hideLoading();
    }
  };
}

function withRetry(fn, retries = 3) {
  return async function (...args) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  };
}

// 组合装饰器
const fetchWithLoadingAndRetry = withRetry(withLoading(fetchData), 3);

// HOC（React 高阶组件）
function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}
```

### 代理模式

```javascript
// 控制对对象的访问

// Vue3 响应式就是基于 Proxy
const reactive = (target) => {
  return new Proxy(target, {
    get(obj, key) {
      track(obj, key); // 依赖收集
      return obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      trigger(obj, key); // 触发更新
      return true;
    },
  });
};

// 缓存代理
function createCacheProxy(fn) {
  const cache = new Map();
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = target.apply(thisArg, args);
      cache.set(key, result);
      return result;
    },
  });
}

const expensiveCalc = createCacheProxy(function compute(n) {
  console.log('计算中...');
  return n * n;
});
```

## 行为型模式

### 观察者模式

```javascript
// 一对多依赖：当一个对象状态改变时，所有依赖者收到通知
class EventEmitter {
  #events = new Map();

  on(event, handler) {
    if (!this.#events.has(event)) this.#events.set(event, []);
    this.#events.get(event).push(handler);
  }

  off(event, handler) {
    const handlers = this.#events.get(event);
    if (handlers) {
      this.#events.set(event, handlers.filter(h => h !== handler));
    }
  }

  emit(event, ...args) {
    this.#events.get(event)?.forEach(h => h(...args));
  }

  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// Vue 中的观察者
// Vue2: Watcher / Dep
// Vue3: effect / track / trigger
// React: useState + useEffect
```

### 发布订阅模式

```javascript
// 与观察者模式区别：发布者和订阅者通过事件中心通信，互不认识
class PubSub {
  #topics = new Map();

  subscribe(topic, handler) {
    if (!this.#topics.has(topic)) this.#topics.set(topic, []);
    this.#topics.get(topic).push(handler);
    return () => this.unsubscribe(topic, handler);
  }

  unsubscribe(topic, handler) {
    const handlers = this.#topics.get(topic);
    if (handlers) {
      this.#topics.set(topic, handlers.filter(h => h !== handler));
    }
  }

  publish(topic, data) {
    this.#topics.get(topic)?.forEach(h => h(data));
  }
}

// 应用：跨组件通信
const bus = new PubSub();
bus.subscribe('user:login', (user) => updateUI(user));
bus.publish('user:login', { name: '张三' });
```

### 策略模式

```javascript
// 定义一系列算法，封装起来，使它们可以互相替换
const validationStrategies = {
  required: (value) => value ? '' : '此字段必填',
  minLength: (value, min) => value.length >= min ? '' : `最少${min}个字符`,
  maxLength: (value, max) => value.length <= max ? '' : `最多${max}个字符`,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : '邮箱格式不正确',
  pattern: (value, regex) => regex.test(value) ? '' : '格式不正确',
};

class Validator {
  rules = [];

  addRule(value, strategy, ...args) {
    this.rules.push(() => validationStrategies[strategy](value, ...args));
    return this; // 链式调用
  }

  validate() {
    for (const rule of this.rules) {
      const msg = rule();
      if (msg) return msg;
    }
    return '';
  }
}

// 使用
const validator = new Validator();
validator
  .addRule(username, 'required')
  .addRule(username, 'minLength', 3)
  .addRule(email, 'required')
  .addRule(email, 'email');

const error = validator.validate();
```

## 下一步

- 🔒 [前端安全](/frontend/advanced/senior/security) - 安全防护实践
- 📦 [模块化工程](/frontend/advanced/modules/) - 工程化实践
- 🧠 [核心概念](/frontend/concepts/) - 前端核心概念
