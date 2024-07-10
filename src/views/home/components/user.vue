<template>
  <div style="display: flex; align-items: center">
    <img src="@/assets/touxiang.jpeg" class="user-logo" />
    <div class="user-role">
      <div style="font-size: 20px; font-weight: bold">{{ name }}</div>
      <div style="display: flex">
        <div>我是</div>
        <div style="padding: 0 10px">卢本伟</div>
        <div>牛逼</div>
      </div>
    </div>
  </div>
  <div class="user-tag">
    <div class="tag-item">{{ signature }}</div>
    <div class="tag-item">签名2.0</div>
  </div>
  <div class="user-call">
    <div class="call-item">找到我的方式：</div>
    <div class="call-item">哔哩哔哩</div>
    <div class="call-item">github</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

let name = ref("路痴");
let signature = ref("我是路痴行为艺术家");
</script>

<style lang="less" scoped>
.user-logo {
  margin-right: 10px;
  width: 76px;
  border-radius: 50%;
}
.user-tag {
  margin: 10px 0;
  line-height: 35px;
}
.user-call {
  display: flex;
  margin-top: 10px;
}
</style>
