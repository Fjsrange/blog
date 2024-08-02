<script setup>
import { ref, reactive } from "vue";
// import hButton from "@/components/hButton.vue";
import hButton from "@/components/hButton/index.vue";
import computeTable from "./components/computeTable/index.vue";
//
const users = reactive([
  { name: "张三", gender: "男", age: 20 },
  { name: "李四", gender: "女", age: 22 },
  { name: "王五", gender: "男", age: 25 },
  { name: "赵六", gender: "女", age: 18 },
  { name: "钱七", gender: "男", age: 20 },
  { name: "孙八", gender: "女", age: 22 },
  { name: "周九", gender: "男", age: 19 },
  { name: "吴十", gender: "女", age: 23 },
  { name: "郑十一", gender: "男", age: 22 },
  { name: "王十二", gender: "女", age: 22 },
]);
const result = reactive({});
const dataSource = ref([]);

// 重置
function reset() {
  for (let key in result) {
    result[key] = 0;
  }
}

function gropGrowUp() {
  result.成年 = 0;
  result.未成年 = 0;
  groupBy(users, (u) => (u.age > 18 ? "成年" : "未成年"));
}
function genderrowUp() {
  result.男 = 0;
  result.女 = 0;
  groupBy(users, (u) => u.gender);
}

function groupBy(array, generateKey) {
  for (const item of array) {
    let key = generateKey(item);
    if (result[key]) {
      result[key]++;
    } else {
      result[key] = 1;
    }
  }
  return result;
}
</script>

<template>
  <div style="display: flex">
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>性别</th>
          <th>年龄</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.gender }}</td>
          <td>{{ user.age }}</td>
        </tr>
      </tbody>
    </table>
    <div class="compute">
      <h-Button
        :buttonWidth="160"
        :text="'点击筛选成年人数'"
        @click="gropGrowUp"
      ></h-Button>
      <computeTable
        :dataSource="[result.成年, result.未成年]"
        :columns="['成年', '未成年']"
      />
    </div>
    <div class="compute">
      <h-Button
        :buttonWidth="160"
        :text="'点击筛选男女人数'"
        @click="genderrowUp"
      ></h-Button>
      <computeTable
        :dataSource="[result.男, result.女]"
        :columns="['男', '女']"
      />
    </div>
    <h-Button :buttonWidth="160" :text="'重置'" @click="reset"></h-Button>
  </div>
</template>

<style lang="less" scoped>
.compute {
  padding: 0 20px;
}

.compute-table {
  display: ruby-text;
  padding: 10px 0;
  border: 1px solid #ddd;
}
/* 可选的样式，用于美化表格 */
table {
  width: 30%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border: 1px solid #ccc;
}
th,
td {
  padding: 7px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}
th {
  background-color: #f2f2f2;
}
</style>
