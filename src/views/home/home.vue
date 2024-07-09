<template>
  <div class="home">
    <div class="user">
      <div class="home-user">
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
      </div>
      <div class="weather">欢迎</div>
    </div>
    <div class="play">
      <div class="home-candle">
        <div class="candle">在这里</div>
      </div>
      <div class="home-time">
        <div style="font-size: 25px">{{ nowYear }}</div>
        <div style="font-size: 22px">{{ week }}</div>
        <div style="font-size: 30px">{{ currentDate }}</div>
      </div>
      <div class="home-music">
        <Music />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Music from "./components/music.vue";

let name = ref("路痴");
let signature = ref("我是路痴行为艺术家");

const nowYear = ref("");
const week = ref("");
const currentDate = ref("");
const timer = ref(null);

let weekArr = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

onMounted(() => {
  let now = new Date();
  let day = now.getDay();
  nowYear.value =
    now.getFullYear() +
    "-" +
    now.getMonth().toString().padStart(2, "0") +
    "-" +
    now.getDate().toString().padStart(2, "0");

  week.value = weekArr[day];

  const getTime = () => {
    now = new Date();
    const hours = ("0" + now.getHours()).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const seconds = ("0" + now.getSeconds()).slice(-2);
    currentDate.value = `${hours}:${minutes}:${seconds}`;
  };
  getTime();
  timer.value = setInterval(() => {
    getTime();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style lang="less" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  .user,
  .play {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;

    .home-user {
      width: 49%;
      height: 250px;
      padding: 20px 10px;
      margin-right: 2%;
      border-radius: 12px;
      box-shadow: 0 0 8px 1px #ccc;
      .user-logo {
        margin-right: 10px;
        width: 76px;
        border-radius: 50%;
      }
      .user-tag {
        margin: 10px 0;
      }
      .user-call {
        display: flex;
      }
    }
    .weather {
      display: flex;
      flex-direction: column;
      width: 49%;
      height: 250px;
      padding: 10px 20px;
      border-radius: 12px;
      box-shadow: 0 0 8px 1px #ccc;
      color: #fff;
      background: no-repeat center / 100%;
    }
  }
  .play {
    margin-top: 20px;

    .home-candle {
      display: flex;
      justify-content: center;
      align-self: center;
      width: 23%;
      height: 136px;
      padding: 10px 0;
      border-radius: 12px;
      box-shadow: 0 0 8px 1px #ccc;
      .camndle {
        position: relative;
        width: 128px;
        height: 116px;
      }
    }
    .home-time {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 23.5%;
      height: 136px;
      padding: 10px 0;
      margin-left: 2.5%;
      border-radius: 12px;
      font-family: 黑体;
      font-size: 25px;
      box-shadow: 0 0 8px 1px #ccc;
    }
    .home-music {
      width: 49%;
      height: 136px;
      padding: 10px;
      margin: 0 0 0 2%;
      border-radius: 12px;
      font-family: 黑体;
      font-size: 25px;
      box-shadow: 0 0 8px 1px #ccc;
      overflow-y: scroll;
    }
  }
}
/* 当屏幕宽度小于等于768px时应用以下样式 */
@media screen and (max-width: 768px) {
  .home {
    .user,
    .play {
      flex-wrap: wrap;
      width: 100%;
    }
  }
}
</style>
