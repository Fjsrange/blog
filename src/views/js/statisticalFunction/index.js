const users = [
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
];
groupBy(users, (u) => u.gender);
groupBy(users, (u) => u.age);
groupBy(users, (u) => u.name.length);
groupBy(users, (u) => (u.age > 18 ? "成年" : "未成年"));
function groupBy(array, generateKey) {
  const result = {};
  for (const item of array) {
    const key = generateKey(item);
    if (result[key]) {
      result[key[propName]]++;
    } else {
      result[key[propName]] = 1;
    }
  }
  return result;
}
