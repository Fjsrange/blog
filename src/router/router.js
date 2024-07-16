export const generateRoutesFn = (pages, comps) => {
  // 页面数组路由级别排序
  const sortedArray = Object.entries(pages);

  const routes = [];
  /**
   * @description: 添加（生成）路由
   * @time 2024-07-16
   * @params {Object} pages - 路由路径
   * @params {Object} comps - 页面配置对象
   */
  function addRoute(path, page) {
    const compPath = path.replace("page.js", "index.vue");
    path = path.replace("../views", "").replace("/page.js", "") || "/";
    const name = path.split("/").filter(Boolean).join("-");
    const route = {
      path,
      name,
      component: comps[compPath],
      meta: page,
    };
    routes.push(route);
  }

  sortedArray.forEach(([path, page]) => addRoute(path, page));

  return routes;
};
