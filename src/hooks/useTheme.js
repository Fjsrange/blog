import { ref, watchEffect } from "vue";

// 获取本地存储的主题
const key = "__theme__";
const theme = ref(localStorage.getItem(key) || "light");

// 监听主题变化
watchEffect(() => {
  // 将主题设置为文档元素的dataset属性
  document.documentElement.dataset.theme = theme.value;
  // 将主题存入本地存储
  localStorage.setItem(key, theme.value);
});

// 导出一个函数，用于获取主题
export function useTheme() {
  return {
    // 主题
    theme,
    // 切换主题
    toggleTheme() {
      // 切换主题
      theme.value = theme.value === "light" ? "dark" : "light";
    },
  };
}
