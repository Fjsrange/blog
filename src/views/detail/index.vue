<script setup>
import { ref, reactive, onMounted } from "vue";
import { routeNow } from "@/store/router.js";
console.log("routerNow", routeNow.value);
onMounted(() => {
  console.log("onMounted");
});
</script>

<template>
  <div class="detail">
    <div class="detail-title">
      <p style="font-weight: 900; font-size: 38px">{{ routeNow.title }}</p>
      <p style="font-weight: 900; font-size: 24px">{{ routeNow.info }}</p>
    </div>
    <div class="detail-body">
      <main class="detail-content">
        <router-view></router-view>
      </main>
    </div>
    <!-- <router-view></router-view> -->
  </div>
</template>

<style lang="less" scoped>
.detail-content {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0 3px;
  background-color: #fff;
}
</style>
