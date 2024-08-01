import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import { generateRoutesFn } from "./router";
import { beforeEachCallback, afterEackCallback } from "./guards.js";

const pages = import.meta.glob("../views/**/page.js", {
  eager: true,
  import: "default",
});
const comps = import.meta.glob("../views/**/index.vue");
export const generateRoutes = generateRoutesFn(pages, comps); // 生成路由

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/home/home.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/articleList/:type",
    name: "articleList",
    component: () => import("@/views/articleList/index.vue"),
    meta: {
      title: "列表",
    },
  },
  {
    path: "/detail",
    name: "detail",
    component: () => import("@/views/detail/index.vue"),
    children: [...generateRoutes],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(beforeEachCallback);

router.afterEach(afterEackCallback);

export default router;
