import { routeNow, loading } from "@/store/router.js";

/**
 * @file router guards
 */
const beforeEachCallback = async (to, from, next) => {
  loading.value = true;
  routeNow.value = {
    path: to.path, // 完整路径
    detailType: to.path.split("/")[to.path.split("/").length - 2], // 文章类型
    articleType: to.path.split("/")[to.path.split("/").length - 1], // 文章类型
    title: to.meta.title, // 标题
    img: to.meta.img, // 图片
    info: to.meta.info, // 简介
    menuOrder: to.meta.menuOrder, // 菜单顺序
  };
  next();
};

const afterEackCallback = (to, from) => {
  loading.value = false;
};

export { beforeEachCallback, afterEackCallback };
