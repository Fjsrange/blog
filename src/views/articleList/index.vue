<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, watch } from "vue";
import { generateRoutes } from "@/router/index.js";
import { routeNow } from "@/store/router.js";

const router = useRouter();
const route = useRoute();
const routerList = ref([]);
const type = ref(routeNow.articleType || "");

// 监视响应式对象中的某个属性，且该属性是基本类型的，要写成函数式
watch(
  () => routeNow.value,
  (to, form) => {
    type.value = to.articleType || "";
    if (!to.path.includes("articleList")) return;
    let arr = generateRoutes.filter((item) => {
      return item.path.includes(to.articleType);
    });
    routerList.value = arr;
  },
  {
    immediate: true,
    deep: true,
  }
);

const routerFn = (item) => {
  console.log(item);

  router.push(item.path);
};
</script>

<template>
  <div class="article-list">
    <div class="article-top">
      <div class="left">{{ type }} 相关模块</div>
      <div class="right">按钮</div>
    </div>
    <div class="article-item-list">
      <div
        class="article-item"
        v-for="(item, index) in routerList"
        :key="index"
      >
        <div class="item-link" @click="routerFn(item)">
          <img :src="item.meta.img" alt="" />
          <div class="content">
            <div>
              <span class="content-title transition-color">{{
                item.meta.title
              }}</span>
              <span class="content-info transition-color">{{
                item.meta.info
              }}</span>
            </div>
            <span class="content-tag transition-color">效率</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.article-list {
  width: 100%;

  .article-item {
    animation: slide-in 0.6s 0.4s backwards;
    will-change: transform;
    visibility: visible;
    overflow: hidden;
    border-radius: 10px;
    background-color: var(--catalogue-bg);
    margin-bottom: 20px;
    transition: all 0.3s;
    cursor: pointer;
  }

  .article-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }
  .article-item-list {
    display: flex;
    flex-wrap: wrap;

    .article-item {
      // --n: 4;
      // --space: calc(100% - var(--n) * 50px) / var(--n);
      // --h: calc(var(--space) / var(--n) / 2);
      // margin: 10px var(--h);
      width: 22%;
      margin-right: 2.5%;
      border: 1px solid #ccc;
      border-radius: 10px;
      overflow: hidden;
      .item-link {
        display: block;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 150px;
        }
        .content {
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 150px;

          span {
            font-size: 14px;
            color: var(--primary-info);

            &.content-title {
              font-size: 22px;
              height: 25px;
              font-weight: bold;
            }

            &.content-tag {
              height: 20px;
              line-height: 20px;
              text-align: right;
              padding-right: 10px;
              color: var(--catalogue-word);
            }

            &.content-info {
              flex: 1;
              margin: 15px 0;
              font-size: 16px;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 6;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
    }
    .article-item:hover {
      box-shadow: 0px 0 10px rgba(0, 0, 0, 0.5);
      // transform: scale(1.1);
      translate: 0 -5px;
    }
  }
}

@keyframes slide-in {
  0% {
    transform: translateY(100%);
  }
  100% {
  }
}
</style>
