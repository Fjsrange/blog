---
title: 性能优化
---

# 性能优化

前端性能优化是提升用户体验的关键，涵盖加载性能、运行时性能、网络优化和监控度量等多个维度。

## 性能指标

| 指标 | 全称 | 含义 | 目标值 |
|------|------|------|--------|
| FCP | First Contentful Paint | 首次内容绘制 | < 1.8s |
| LCP | Largest Contentful Paint | 最大内容绘制 | < 2.5s |
| FID | First Input Delay | 首次输入延迟 | < 100ms |
| CLS | Cumulative Layout Shift | 累积布局偏移 | < 0.1 |
| TTFB | Time to First Byte | 首字节时间 | < 800ms |
| TTI | Time to Interactive | 可交互时间 | < 3.8s |

## 加载性能

### 代码分割

```javascript
// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),
  },
];

// 动态导入
async function openEditor() {
  const { Editor } = await import('./components/Editor');
  // 使用 Editor 组件
}

// React 懒加载
const LazyComponent = React.lazy(() => import('./HeavyComponent'));
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### 资源优化

```html
<!-- 图片优化 -->
<img
  src="photo.webp"
  loading="lazy"              <!-- 懒加载 -->
  decoding="async"            <!-- 异步解码 -->
  width="800"
  height="600"
  alt="描述"
/>

<!-- 响应式图片 -->
<picture>
  <source srcset="photo.webp" type="image/webp">
  <source srcset="photo.jpg" type="image/jpeg">
  <img src="photo.jpg" alt="描述" />
</picture>

<!-- 预加载关键资源 -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="preload" href="/css/main.css" as="style">
<link rel="preload" href="/js/app.js" as="script">

<!-- 预连接 -->
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">

<!-- 预获取 -->
<link rel="prefetch" href="/next-page.js">
```

### 压缩与缓存

```javascript
// Vite 构建优化配置
export default defineConfig({
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          echarts: ['echarts'],
        },
      },
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 文件名哈希（利于缓存）
    chunkFileNames: 'js/[name]-[hash].js',
    assetFileNames: '[ext]/[name]-[hash].[ext]',
  },
});
```

## 运行时性能

### 虚拟列表

```javascript
// 大列表只渲染可见区域
function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = startIndex + visibleCount;
  const visibleItems = items.slice(startIndex, endIndex);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(item => (
            <div key={item.id} style={{ height: itemHeight }}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 防抖与节流

```javascript
// 防抖 - 事件停止触发后执行
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流 - 固定时间间隔执行
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用
const handleSearch = debounce((query) => {
  fetchSearchResults(query);
}, 500);

const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

### 减少重排重绘

```javascript
// ❌ 触发多次重排
element.style.width = '100px';
element.style.height = '200px';
element.style.margin = '10px';

// ✅ 使用 class 切换
element.className = 'active';

// ✅ 使用 cssText
element.style.cssText = 'width:100px; height:200px; margin:10px;';

// ✅ 批量 DOM 操作
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  fragment.appendChild(li);
});
list.appendChild(fragment);

// ✅ 使用 transform 代替 top/left（GPU 加速）
// ❌ element.style.left = x + 'px';
// ✅ element.style.transform = `translateX(${x}px)`;
```

## 网络优化

### 请求优化

```javascript
// 请求合并
async function batchFetch(ids) {
  const res = await fetch('/api/items/batch', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  return res.json();
}

// 请求缓存
const cache = new Map();
async function cachedFetch(url) {
  if (cache.has(url)) return cache.get(url);
  const data = await fetch(url).then(r => r.json());
  cache.set(url, data);
  return data;
}

// 请求取消
const controller = new AbortController();
fetch('/api/data', { signal: controller.signal });
controller.abort(); // 取消请求
```

### 缓存策略

```
强缓存（不请求服务器）
├── Cache-Control: max-age=31536000  // 缓存1年
└── Expires: Wed, 21 Oct 2025 07:28:00 GMT

协商缓存（请求服务器验证）
├── Last-Modified / If-Modified-Since
└── ETag / If-None-Match

推荐策略：
├── HTML: no-cache（每次验证）
├── JS/CSS: max-age=31536000（文件名含哈希）
├── 图片: max-age=86400（短期缓存）
└── API: no-cache 或短时间缓存
```

## 性能监控

```javascript
// Web Vitals 监控
import { onLCP, onFID, onCLS } from 'web-vitals';

onLCP(console.log);
onFID(console.log);
onCLS(console.log);

// Performance API
const [nav] = performance.getEntriesByType('navigation');
console.log('DNS:', nav.domainLookupEnd - nav.domainLookupStart);
console.log('TCP:', nav.connectEnd - nav.connectStart);
console.log('TTFB:', nav.responseStart - nav.requestStart);
console.log('DOM:', nav.domInteractive - nav.responseEnd);
console.log('Load:', nav.loadEventEnd - nav.startTime);

// 长任务检测
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      console.warn('长任务:', entry.duration + 'ms');
    }
  }
});
observer.observe({ entryTypes: ['longtask'] });
```

## 下一步

- 🏗️ [设计模式](/frontend/advanced/senior/design-patterns) - 前端设计模式
- 🔒 [前端安全](/frontend/advanced/senior/security) - 安全防护实践
- 📦 [模块化工程](/frontend/advanced/modules/) - 工程化实践
