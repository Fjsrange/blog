---
title: 网络与 HTTP
---

# 网络与 HTTP

HTTP 协议是 Web 开发的基石，理解网络协议、缓存策略和跨域机制，是前端工程师的必备知识。

## HTTP 协议演进

| 版本 | 特点 | 改进 |
|------|------|------|
| HTTP/1.0 | 短连接 | 每次请求新建连接 |
| HTTP/1.1 | 长连接 | Keep-Alive、管道化、分块传输 |
| HTTP/2 | 多路复用 | 二进制帧、头部压缩、服务端推送 |
| HTTP/3 | QUIC | 基于 UDP、0-RTT、无队头阻塞 |

## HTTP 请求与响应

### 请求结构

```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer token123
Cookie: session=abc123

{"name": "张三", "age": 25}
```

### 响应结构

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600
Set-Cookie: token=xyz; HttpOnly; Secure

{"id": 1, "name": "张三"}
```

### 常用状态码

| 状态码 | 含义 | 常见场景 |
|--------|------|---------|
| 200 | 成功 | GET/POST 成功 |
| 201 | 已创建 | POST 创建资源成功 |
| 204 | 无内容 | DELETE 成功 |
| 301 | 永久重定向 | 域名变更 |
| 302 | 临时重定向 | 未登录跳转 |
| 304 | 未修改 | 协商缓存命中 |
| 400 | 请求错误 | 参数验证失败 |
| 401 | 未认证 | 未登录 |
| 403 | 禁止访问 | 无权限 |
| 404 | 未找到 | 资源不存在 |
| 500 | 服务器错误 | 后端异常 |
| 502 | 网关错误 | 代理无法到达后端 |
| 503 | 服务不可用 | 服务器过载 |

## HTTP 缓存

### 强缓存

```http
# Cache-Control（优先）
Cache-Control: max-age=31536000       # 缓存1年
Cache-Control: no-cache               # 不缓存（每次验证）
Cache-Control: no-store               # 完全不存储
Cache-Control: public                 # 可被中间代理缓存
Cache-Control: private                # 仅浏览器缓存
Cache-Control: immutable              # 资源永不过期

# Expires（HTTP/1.0，已过时）
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

### 协商缓存

```http
# 方式一：Last-Modified / If-Modified-Since
# 响应头
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# 请求头
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
# 未修改返回 304，否则返回 200 + 新资源

# 方式二：ETag / If-None-Match（更精确）
# 响应头
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 请求头
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### 缓存策略

```
HTML 文件：no-cache（每次验证，确保最新）
JS/CSS：max-age=31536000（文件名含哈希，内容变则哈希变）
图片：max-age=86400（短期缓存）
API：no-cache 或短时间缓存
```

## 跨域

### 同源策略

```
同源 = 协议 + 域名 + 端口 相同

https://example.com:443/path
  ↑         ↑        ↑
 协议      域名     端口

不同源的请求默认被浏览器拦截（跨域限制）
```

### CORS 跨域资源共享

```http
# 简单请求（GET/POST + 简单头）
# 浏览器自动添加 Origin 头
Origin: https://frontend.com

# 服务端响应
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Credentials: true
```

```http
# 预检请求（OPTIONS）
# 非简单请求先发送 OPTIONS 请求
OPTIONS /api/users HTTP/1.1
Origin: https://frontend.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Authorization

# 预检响应
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```

### 其他跨域方案

```javascript
// 1. 代理服务器（开发环境）
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://backend.com',
      changeOrigin: true,
    },
  },
}

// 2. JSONP（仅 GET）
function jsonp(url, callback) {
  const script = document.createElement('script');
  const fnName = 'cb_' + Date.now();
  window[fnName] = (data) => {
    callback(data);
    delete window[fnName];
    script.remove();
  };
  script.src = `${url}?callback=${fnName}`;
  document.body.appendChild(script);
}

// 3. postMessage（跨窗口通信）
// 发送方
iframe.contentWindow.postMessage('hello', 'https://other.com');
// 接收方
window.addEventListener('message', (e) => {
  if (e.origin === 'https://trusted.com') {
    console.log(e.data);
  }
});
```

## HTTPS

```
HTTP + TLS = HTTPS

TLS 握手流程：
1. 客户端发送支持的加密套件列表
2. 服务端选择加密套件 + 数字证书
3. 客户端验证证书
4. 双方协商生成会话密钥
5. 使用会话密钥加密通信

安全保证：
- 加密：数据传输加密
- 认证：验证服务器身份
- 完整性：防止数据篡改
```

## WebSocket

```javascript
// 创建连接
const ws = new WebSocket('wss://example.com/ws');

ws.onopen = () => {
  console.log('连接已建立');
  ws.send(JSON.stringify({ type: 'hello' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('收到消息:', data);
};

ws.onerror = (error) => {
  console.error('连接错误:', error);
};

ws.onclose = () => {
  console.log('连接已关闭');
};

// 心跳保活
const heartbeat = setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);

ws.onclose = () => clearInterval(heartbeat);
```

## 下一步

- 🔧 [前端工程化](/frontend/concepts/engineering) - 工程化实践
- 🏗️ [微前端架构](/frontend/concepts/micro-frontend) - 微前端方案
- 🗺️ [前端知识图谱](/frontend/concepts/roadmap) - 学习路线图
