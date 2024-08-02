<template>
  <div class="compute-table">
    <table>
      <thead>
        <tr>
          <th v-for="(item, index) in columns" :key="index">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="(item, index) in dataSource" :key="index">
            {{ item || "-" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
  },
  dataSource: {
    type: Array,
  },
  result: {
    type: Object,
  },
});
</script>

<style lang="less" scoped>
.compute-table {
  display: ruby-text;
  padding: 10px 0;
  border: 1px solid #ddd;
}
/* 可选的样式，用于美化表格 */
table {
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
// th,
td:hover {
  cursor: pointer;
  background-color: #f2f2f2;
}
th {
  background-color: #f2f2f2;
}
</style>
