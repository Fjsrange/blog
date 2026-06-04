import { defineConfig } from "vitepress";

export default defineConfig({
  // 站点标题
  title: "我的博客",
  // 站点描述
  description: "基于 VitePress 的个人博客 - 前端知识体系",

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "博客", link: "/blog/" },
      {
        text: "前端知识",
        items: [
          { text: "基础", link: "/frontend/basics/html/" },
          { text: "框架", link: "/frontend/frameworks/vue2/" },
          { text: "进阶", link: "/frontend/advanced/charts/" },
          { text: "概念与实战", link: "/frontend/concepts/" },
        ],
      },
      { text: "归档", link: "/archives/" },
      { text: "关于", link: "/about/" },
    ],

    // 侧边栏
    sidebar: {
      "/blog/": [
        {
          text: "前端开发",
          items: [
            { text: "VitePress 搭建博客指南", link: "/blog/vitepress-guide" },
            { text: "Vue3 组合式 API 详解", link: "/blog/vue3-composition-api" },
          ],
        },
        {
          text: "生活随笔",
          items: [
            { text: "我的 2024 年总结", link: "/blog/2024-summary" },
          ],
        },
      ],

      "/frontend/basics/": [
        {
          text: "HTML",
          items: [
            { text: "HTML 基础入门", link: "/frontend/basics/html/" },
            { text: "HTML5 新特性", link: "/frontend/basics/html/html5" },
            { text: "语义化标签", link: "/frontend/basics/html/semantic" },
            { text: "表单与验证", link: "/frontend/basics/html/forms" },
          ],
        },
        {
          text: "CSS",
          items: [
            { text: "CSS 基础入门", link: "/frontend/basics/css/" },
            { text: "Flexbox 布局", link: "/frontend/basics/css/flexbox" },
            { text: "Grid 布局", link: "/frontend/basics/css/grid" },
            { text: "CSS 动画与过渡", link: "/frontend/basics/css/animation" },
            { text: "响应式设计", link: "/frontend/basics/css/responsive" },
          ],
        },
        {
          text: "JavaScript",
          items: [
            { text: "JavaScript 基础", link: "/frontend/basics/javascript/" },
            { text: "ES6+ 新特性", link: "/frontend/basics/javascript/es6" },
            { text: "DOM 操作", link: "/frontend/basics/javascript/dom" },
            { text: "异步编程", link: "/frontend/basics/javascript/async" },
            { text: "事件机制", link: "/frontend/basics/javascript/events" },
          ],
        },
      ],

      "/frontend/frameworks/": [
        {
          text: "Vue2",
          items: [
            { text: "Vue2 基础入门", link: "/frontend/frameworks/vue2/" },
            { text: "模板语法与指令", link: "/frontend/frameworks/vue2/template" },
            { text: "组件系统", link: "/frontend/frameworks/vue2/components" },
            { text: "Vuex 状态管理", link: "/frontend/frameworks/vue2/vuex" },
            { text: "Vue Router 路由", link: "/frontend/frameworks/vue2/router" },
          ],
        },
        {
          text: "Vue3",
          items: [
            { text: "Vue3 基础入门", link: "/frontend/frameworks/vue3/" },
            { text: "组合式 API", link: "/frontend/frameworks/vue3/composition-api" },
            { text: "Pinia 状态管理", link: "/frontend/frameworks/vue3/pinia" },
            { text: "Vue3 生命周期", link: "/frontend/frameworks/vue3/lifecycle" },
            { text: "自定义 Hooks", link: "/frontend/frameworks/vue3/hooks" },
          ],
        },
        {
          text: "React",
          items: [
            { text: "React 基础入门", link: "/frontend/frameworks/react/" },
            { text: "JSX 语法", link: "/frontend/frameworks/react/jsx" },
            { text: "React Hooks", link: "/frontend/frameworks/react/hooks" },
            { text: "Redux 状态管理", link: "/frontend/frameworks/react/redux" },
            { text: "React Router", link: "/frontend/frameworks/react/router" },
          ],
        },
      ],

      "/frontend/advanced/": [
        {
          text: "图表可视化",
          items: [
            { text: "图表基础入门", link: "/frontend/advanced/charts/" },
            { text: "ECharts 实战", link: "/frontend/advanced/charts/echarts" },
            { text: "D3.js 数据可视化", link: "/frontend/advanced/charts/d3" },
            { text: "Canvas 绘图", link: "/frontend/advanced/charts/canvas" },
            { text: "SVG 图形", link: "/frontend/advanced/charts/svg" },
          ],
        },
        {
          text: "高级进阶",
          items: [
            { text: "前端高级概述", link: "/frontend/advanced/senior/" },
            { text: "TypeScript 深入", link: "/frontend/advanced/senior/typescript" },
            { text: "性能优化", link: "/frontend/advanced/senior/performance" },
            { text: "设计模式", link: "/frontend/advanced/senior/design-patterns" },
            { text: "前端安全", link: "/frontend/advanced/senior/security" },
          ],
        },
        {
          text: "模块化工程",
          items: [
            { text: "模块化概述", link: "/frontend/advanced/modules/" },
            { text: "Webpack 构建", link: "/frontend/advanced/modules/webpack" },
            { text: "Vite 构建", link: "/frontend/advanced/modules/vite" },
            { text: "包管理与发布", link: "/frontend/advanced/modules/package" },
            { text: "Monorepo 管理", link: "/frontend/advanced/modules/monorepo" },
          ],
        },
      ],

      "/frontend/concepts/": [
        {
          text: "核心概念",
          items: [
            { text: "前端概念总览", link: "/frontend/concepts/" },
            { text: "浏览器原理", link: "/frontend/concepts/browser" },
            { text: "网络与 HTTP", link: "/frontend/concepts/network" },
            { text: "前端工程化", link: "/frontend/concepts/engineering" },
            { text: "微前端架构", link: "/frontend/concepts/micro-frontend" },
          ],
        },
        {
          text: "知识体系",
          items: [
            { text: "前端知识图谱", link: "/frontend/concepts/roadmap" },
            { text: "面试高频题", link: "/frontend/concepts/interview" },
            { text: "编码规范", link: "/frontend/concepts/standards" },
          ],
        },
        {
          text: "实战训练",
          items: [
            { text: "实战项目总览", link: "/frontend/concepts/practice/" },
            { text: "TodoList 应用", link: "/frontend/concepts/practice/todolist" },
            { text: "后台管理系统", link: "/frontend/concepts/practice/admin" },
            { text: "个人博客搭建", link: "/frontend/concepts/practice/blog" },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/Fjsrange" },
    ],

    // 搜索 - 使用本地搜索
    search: {
      provider: "local",
    },

    // 页脚
    footer: {
      message: '基于 <a href="https://vitepress.dev/">VitePress</a> 构建',
      copyright: "Copyright © 2024-present 我的博客",
    },

    // 编辑链接
    editLink: {
      pattern: "https://github.com/Fjsrange/blog/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    // 最后更新时间
    lastUpdated: {
      text: "最后更新于",
    },
  },

  // Markdown 配置
  markdown: {
    // 行号显示
    lineNumbers: true,
  },

  // 头部元信息
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "author", content: "我的名字" }],
    ["meta", { name: "keywords", content: "博客, VitePress, 前端, 知识体系" }],
  ],
});
