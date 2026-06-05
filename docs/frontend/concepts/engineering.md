---
title: 前端工程化
---

# 前端工程化

前端工程化是将前端开发流程系统化、规范化和自动化的实践，涵盖代码规范、Git 工作流、CI/CD 和自动化测试等。

## 工程化全景

```
前端工程化
├── 代码规范
│   ├── ESLint（代码质量）
│   ├── Prettier（代码格式）
│   ├── Stylelint（CSS 规范）
│   └── Commitlint（提交规范）
├── Git 工作流
│   ├── 分支策略
│   ├── Commit 规范
│   └── Husky + lint-staged
├── CI/CD
│   ├── GitHub Actions
│   ├── Jenkins
│   └── 自动化部署
└── 自动化测试
    ├── 单元测试（Vitest / Jest）
    ├── 组件测试
    └── E2E 测试（Playwright / Cypress）
```

## 代码规范

### ESLint 配置

```javascript
// eslint.config.js (Flat Config)
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
```

### Prettier 配置

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Stylelint 配置

```javascript
// .stylelintrc.js
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order', // 属性排序
  ],
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
  },
};
```

## Git 工作流

### 分支策略

```
main（生产分支）
  └── develop（开发分支）
        ├── feature/xxx（功能分支）
        ├── fix/xxx（修复分支）
        └── release/x.x.x（发布分支）

工作流程：
1. 从 develop 创建 feature 分支
2. 开发完成后提交 PR / MR
3. Code Review 通过后合并到 develop
4. 发布时从 develop 创建 release 分支
5. 测试通过后合并到 main 并打 tag
```

### Commit 规范

```
<type>(<scope>): <subject>

type 类型：
  feat     - 新功能
  fix      - 修复 Bug
  docs     - 文档变更
  style    - 代码格式（不影响功能）
  refactor - 重构
  perf     - 性能优化
  test     - 测试
  chore    - 构建/工具变更

示例：
  feat(user): 添加用户登录功能
  fix(api): 修复请求超时问题
  docs: 更新 README
```

### Husky + lint-staged

```bash
# 安装
pnpm add -D husky lint-staged

# 初始化 husky
pnpm exec husky init
```

```javascript
// .husky/pre-commit
pnpm exec lint-staged
```

```javascript
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

```bash
# commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional

# .husky/commit-msg
pnpm exec commitlint --edit $1
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore',
    ]],
  },
};
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 自动化测试

### Vitest 单元测试

```javascript
// math.test.js
import { describe, it, expect } from 'vitest';
import { add, multiply } from './math';

describe('Math', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('should multiply two numbers', () => {
    expect(multiply(2, 3)).toBe(6);
  });

  it('should handle edge cases', () => {
    expect(add(0, 0)).toBe(0);
    expect(multiply(-1, 5)).toBe(-5);
  });
});
```

### 组件测试

```javascript
// Button.test.js
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

describe('Button', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' },
    });
    expect(wrapper.text()).toBe('Click me');
  });

  it('emits click event', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('applies variant class', () => {
    const wrapper = mount(Button, {
      props: { variant: 'primary' },
    });
    expect(wrapper.classes()).toContain('btn-primary');
  });
});
```

## 下一步

- 🏗️ [微前端架构](/frontend/concepts/micro-frontend) - 微前端方案
- 🗺️ [前端知识图谱](/frontend/concepts/roadmap) - 学习路线图
- 💼 [面试高频题](/frontend/concepts/interview) - 面试准备
