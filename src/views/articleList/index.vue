<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";

// const router = useRoute();
// const type = ref(router.params.type);

const route = useRoute();
const type = ref(route.params.type);

// 输出 type 的值，确保它在控制台中正确显示
console.log("route", route);
console.log("type", type.value);

// 监视响应式对象中的某个属性，且该属性是基本类型的，要写成函数式
watch(
  () => route.params.type,
  (newValue) => {
    type.value = newValue; // 更新 ref 变量
  }
);
</script>

<template>
  <div style="width: 100%"></div>
  <div class="article-list">
    <div class="left">{{ type }} 相关模块</div>
    <div class="right">按钮</div>
  </div>
</template>

<style lang="less" scoped>
.article-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>
