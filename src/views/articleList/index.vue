<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { generateRoutes } from "@/router/index.js";

// const router = useRoute();
// const type = ref(router.params.type);

const route = useRoute();
const type = ref(route.params.type || "");

// 输出 type 的值，确保它在控制台中正确显示
console.log("route", route);
console.log("type", type.value);

// 监视响应式对象中的某个属性，且该属性是基本类型的，要写成函数式
watch(
  () => route.params.type,
  (to, from) => {
    console.log("111", to, from);

    /* console.log("newValue", newValue);
    console.log("oldValue", oldValue);
    // 更新 type.value
    type.value = newValue || "";
    // 进行条件检查
    if (!oldValue.includes("articleList")) return;
    // if (
    //   typeof newValue === "object" &&
    //   newValue.path &&
    //   newValue.path.includes("articleList")
    // ) {
    // 执行逻辑
    console.log("generateRoutes", generateRoutes);
    let arr = generateRoutes.filter((item) => {
      console.log("item", item);

      // return item.path === newValue.path;
    });
    console.log("arr", arr);
    // } */
  }
);
</script>

<template>
  <div style="width: 100%"></div>
  <div class="article-list">
    <div class="left">{{ type }} 相关模块</div>
    <div class="right">按钮</div>
  </div>
  <router-view></router-view>
</template>

<style lang="less" scoped>
.article-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>
