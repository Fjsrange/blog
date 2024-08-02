<template>
  <div
    class="btn"
    :style="{
      backgroundColor: bgColor,
      color: textColor,
      fontSize: fontSize + 'px',
      width: buttonWidth + 'px',
    }"
    @click="handleClick"
  >
    {{ text }}
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
/**
 *
 * @type {String} text 按钮文本
 * @type {String} textColor 按钮文本颜色
 * @type {Number} fontSize 按钮文本大小
 * @type {String} bgColor 按钮背景颜色
 * @type {Number} buttonWidth 按钮宽度
 */
const props = defineProps({
  text: {
    type: String,
    default: "常用按钮",
  },
  textColor: {
    type: String,
    default: "#fff",
  },
  fontSize: {
    type: Number,
    default: 16,
  },
  bgColor: {
    type: String,
    default: "#006cff",
  },
  buttonWidth: {
    type: Number,
    default: 120,
  },
});

const emit = defineEmits(["click"]);
const handleClick = () => {
  emit("click");
};
</script>

<style lang="less" scoped>
.btn {
  height: 47.6px;
  padding: 10px 20px;
  border: 1px solid #fff;
  border-radius: 6px;
  // background-color: #006cff;
  color: #fff;
  text-align: center;
  /* 最长6个字，1em 为字体大小 */
  // max-width: calc(6 * 2em);
  /* 文本不换行 */
  white-space: nowrap;
  /* 超出部分隐藏 */
  // overflow: hidden;
  /* 超出部分显示省略号 */
  // text-overflow: ellipsis;

  &:hover {
    cursor: pointer;
    background-color: #5589ff !important; /* 悬停时背景色 */
  }
}
</style>
