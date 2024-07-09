<script setup>
import { ref, reactive } from "vue";
import { useTheme } from "@/hooks/useTheme";
const { theme, toggleTheme } = useTheme();
</script>

<template>
  <div class="button">
    <div class="left">左</div>
    <div class="switch" :class="theme" @click="toggleTheme">
      <div class="bar"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url("@/assets/theme.less");

.button {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.switch {
  padding: 5px;
  transition: 0.3s ease-in-out;
  width: 120px;
  height: 50px;
  border-radius: 50px;
  text-align: center;
  background: lightslategray;
  box-shadow: -4px 4px 15px inset rgba(0, 0, 0, 0.3);
  cursor: pointer;
  .bar {
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 50px;
    transform: translateY(-50%);
    transition: transform 0.3s ease-in-out; /* 添加transform的过渡效果 */
  }
}
.switch.light .bar {
  transform: translateX(0); /* .light状态下，平移到左边0px */
}

.switch.dark .bar {
  transform: translateX(70px); /* .dark状态下，平移到右边70px */
}
</style>
