<script setup>
import { RouterLink, RouterView } from "vue-router";
import routerButton from "@/components/routerButton/index.vue";
// import useTheme from "@/hooks/useTheme";
// const { theme } = useTheme();
</script>

<template>
  <div class="App">
    <routerButton />
    <RouterView class="content" />
  </div>
</template>

<style lang="less" scoped>
.App {
  height: 100vh;
  /* background: linear-gradient(to bottom, var(--bg1), var(--bg2));
  color: var(--text-color); */
  background: linear-gradient(to bottom, var(--bg1), var(--bg2));
  color: var(--text-color);

  .content {
    padding: 20px;
  }
}
</style>
