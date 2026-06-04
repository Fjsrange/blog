---
title: 表单与验证
---

# 表单与验证

表单是用户与网页交互的核心方式，掌握表单构建和验证是前端开发的基本功。

## 基本表单结构

```html
<form action="/submit" method="POST">
  <label for="username">用户名：</label>
  <input type="text" id="username" name="username" required>

  <label for="password">密码：</label>
  <input type="password" id="password" name="password" required>

  <button type="submit">提交</button>
</form>
```

## 常用表单元素

### 文本输入

```html
<!-- 单行文本 -->
<input type="text" placeholder="请输入姓名">

<!-- 密码 -->
<input type="password" placeholder="请输入密码">

<!-- 邮箱（自动验证格式） -->
<input type="email" placeholder="example@mail.com">

<!-- 电话 -->
<input type="tel" placeholder="13800138000">

<!-- 搜索框 -->
<input type="search" placeholder="搜索...">

<!-- URL -->
<input type="url" placeholder="https://example.com">
```

### 数字与范围

```html
<!-- 数字输入 -->
<input type="number" min="0" max="100" step="1" value="50">

<!-- 滑块 -->
<input type="range" min="0" max="100" value="50">

<!-- 颜色选择 -->
<input type="color" value="#646cff">
```

### 日期与时间

```html
<input type="date">          <!-- 日期 -->
<input type="time">          <!-- 时间 -->
<input type="datetime-local"> <!-- 日期时间 -->
<input type="month">         <!-- 月份 -->
<input type="week">          <!-- 周 -->
```

### 选择控件

```html
<!-- 下拉选择 -->
<select name="city">
  <option value="">请选择城市</option>
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
  <option value="guangzhou">广州</option>
</select>

<!-- 单选按钮 -->
<label><input type="radio" name="gender" value="male"> 男</label>
<label><input type="radio" name="gender" value="female"> 女</label>

<!-- 复选框 -->
<label><input type="checkbox" name="hobby" value="reading"> 阅读</label>
<label><input type="checkbox" name="hobby" value="coding"> 编程</label>
<label><input type="checkbox" name="hobby" value="travel"> 旅行</label>
```

### 多行文本与文件

```html
<!-- 多行文本 -->
<textarea rows="5" cols="40" placeholder="请输入内容..."></textarea>

<!-- 文件上传 -->
<input type="file" accept="image/*" multiple>
```

## HTML5 内置验证

### 常用验证属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `required` | 必填 | `<input required>` |
| `minlength` | 最小长度 | `<input minlength="6">` |
| `maxlength` | 最大长度 | `<input maxlength="20">` |
| `min` / `max` | 数值范围 | `<input type="number" min="0" max="100">` |
| `pattern` | 正则验证 | `<input pattern="^[A-Za-z]+$">` |
| `type="email"` | 邮箱格式 | `<input type="email">` |
| `type="url"` | URL 格式 | `<input type="url">` |

### 验证示例

```html
<form>
  <!-- 必填 + 最小长度 -->
  <input type="text" required minlength="2" maxlength="20"
         placeholder="用户名（2-20个字符）">

  <!-- 邮箱格式验证 -->
  <input type="email" required placeholder="请输入邮箱">

  <!-- 正则验证：6-16位字母数字 -->
  <input type="password" required
         pattern="^[A-Za-z0-9]{6,16}$"
         placeholder="密码（6-16位字母数字）">

  <!-- 数字范围 -->
  <input type="number" min="18" max="120" placeholder="年龄">

  <!-- 自定义正则：手机号 -->
  <input type="tel" pattern="^1[3-9]\d{9}$"
         placeholder="手机号码">

  <button type="submit">提交</button>
</form>
```

## JavaScript 表单验证

```javascript
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // 检查整体验证
  if (!form.checkValidity()) {
    form.reportValidity(); // 显示浏览器默认提示
    return;
  }

  // 自定义验证逻辑
  const password = form.querySelector('[name="password"]');
  const confirm = form.querySelector('[name="confirmPassword"]');

  if (password.value !== confirm.value) {
    confirm.setCustomValidity('两次密码不一致');
    confirm.reportValidity();
    return;
  }

  // 验证通过，提交数据
  console.log('表单验证通过！');
  // fetch('/api/submit', { method: 'POST', body: new FormData(form) })
});

// 实时验证
document.querySelector('[name="username"]').addEventListener('input', (e) => {
  const value = e.target.value;
  if (value.length < 2) {
    e.target.setCustomValidity('用户名至少2个字符');
  } else {
    e.target.setCustomValidity(''); // 清除错误
  }
});
```

## 表单最佳实践

1. ✅ 始终使用 `<label>` 关联表单控件
2. ✅ 提供清晰的 `placeholder` 提示
3. ✅ 同时使用前端验证和后端验证
4. ✅ 给出友好的错误提示信息
5. ✅ 提交按钮添加 `loading` 状态防止重复提交
6. ✅ 敏感数据使用 `POST` 方法传输
