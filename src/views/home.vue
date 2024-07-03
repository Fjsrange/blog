<template>
  <div>
    <div style="display: flex">
      <div class="block">
        <div class="home-user">
          <img src="@/assets/touxiang.jpeg" class="user-name" />
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
      <div class="block">欢迎</div>
    </div>
    <div style="display: flex">
      <div class="part" style="display: flex">
        <div class="part-son">在这里</div>
        <div class="part-son">
          <div style="font-size: 28px">
            {{ today }}
          </div>
          <div>{{ year }} 年 {{ month }} 月 {{ date }} 日</div>
          <div>{{ time }}</div>
        </div>
      </div>
      <div class="block">Vue3</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

let name = ref("路痴");
let signature = ref("我是路痴行为艺术家");
// let date =
// 获取日期
let date = new Date().getDate();
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDay();
let week = new Date().getDay();
let hour = new Date().getHours();
let minute = new Date().getMinutes();
let second = new Date().getSeconds();
let today = year + "年" + month + "月" + day + "日";
let time = hour + ":" + minute + ":" + second;
console.log("date", date);
console.log("year", year);
console.log("month", month);
console.log("day", day);
console.log("week", week);
console.log("hour", hour);
console.log("minute", minute);
console.log("second", second);
console.log("time", time);
// 获取时间
function dateTime() {
  setTimeout(() => {
    time = hour + ":" + minute + ":" + second;
  }, 1000);
}
</script>

<style scoped>
.block {
  width: 50%;
  padding: 20px;
  margin: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 8px 1px #ccc;
}
.home-user {
  display: flex;
  align-items: center;
}
.user-name {
  margin-right: 10px;
  width: 76px;
  border-radius: 50%;
}
.user-tag {
  padding: 10px 0;
}
.user-call {
  display: flex;
}
.part {
  width: 52%;
}
.part-son {
  width: 50%;
  /* padding: 53px 20px; */
  padding: 20px;
  margin: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 8px 1px #ccc;
  text-align: center;
}
</style>
