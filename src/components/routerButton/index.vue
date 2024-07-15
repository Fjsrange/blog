<script setup>
import { ref, reactive } from "vue";
import { useTheme } from "@/hooks/useTheme";
const { theme, toggleTheme } = useTheme();
import { useRouter } from "vue-router";

const router = useRouter();

// 按钮列表与是否展示底部内容
const showBtn = ref([false, false, false]);
const routerBtnList = ref([
  {
    name: "文章列表",
    icon: "icon-liebiao",
    children: [
      {
        name: "CSS",
        base: "/articleList/",
        path: "css",
        icon: "icon-css",
      },
      {
        name: "Javascript",
        base: "/articleList/",
        path: "js",
        icon: "icon-js",
      },
      {
        name: "Learn",
        base: "/articleList/",
        path: "learn",
        icon: "icon-xuexi",
      },
    ],
  },
]);
const showItemFn = (index, type) => {
  showBtn.value[index] = type;
};

// 点击跳转项目内路由
const goRouter = (item, index) => {
  if (!item.base || !item.path) return;
  router.push(`${item.base}${item.path}`);
  showItemFn(index, false);
};

// 跳转到首页
function goHome() {
  router.push({ name: "home" });
}
</script>

<template>
  <div class="button">
    <div class="left" @click="goHome">开始</div>
    <div class="btn-list">
      <div
        v-for="(item, index) in routerBtnList"
        :key="index"
        class="btn-item"
        :class="{ active: item.children?.length && showBtn[index] }"
        @mouseenter="showItemFn(index, true)"
        @mouseleave="showItemFn(index, false)"
      >
        <i>📕</i>
        <span class="hasMargin">文章列表</span>
        <div class="popup">
          <div class="popup-item" v-for="(chil, i) in item.children" :key="i">
            <div @click="goRouter(chil, index)">
              <i>📕</i>
              <span>{{ chil.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  margin-bottom: 20px;
  z-index: 9900;
}

.left {
  border: 2px solid #fff;
  padding: 0 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  cursor: pointer;
}

.btn-list {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .btn-item {
    background-color: #fff;
    color: #333;
    padding: 5px 30px;
    border-radius: 20px;
    cursor: pointer;
    &::before {
      content: "";
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;
      height: 10px;
      background-color: transparent;
    }
    &::after {
      content: "";
      position: absolute;
      top: 53px;
      left: 50%;
      transform: translate(-50%, 150%) scale(0.1);
      opacity: 0;
      border-bottom: 10px solid #eaeaea;
      border-top: 10px solid transparent;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      transition: all 0.3s;
    }
  }
  .popup {
    position: absolute;
    top: 73px;
    left: 50%;
    transform: translate(-50%, 60%) scale(0.1);
    padding: 10px 20px;
    background-color: #eaeaea;
    opacity: 0;
    transition: all 0.3s;
    will-change: transform;
    z-index: 999;

    .popup-item {
      border: 1px solid #fff;
      border-radius: 25px;
      padding: 4px 25px;
      background-color: #fff;
      margin: 10px 0;
    }
  }
  .active {
    .popup {
      transform: translate(-50%, 0) scale(1);
      opacity: 1;
    }
    &::after {
      opacity: 1;
      transform: translate(-50%, 0) scale(1);
    }
  }
}

.switch {
  padding: 5px;
  transition: 0.3s ease-in-out;
  transition: opacity 0.5s ease;
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
