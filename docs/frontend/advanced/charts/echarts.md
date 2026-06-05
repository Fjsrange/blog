---
title: ECharts 实战
---

# ECharts 实战

ECharts 是百度开源的 JavaScript 可视化图表库，功能强大、图表丰富、交互性好，是国内最流行的数据可视化方案。

## 安装与引入

```bash
# 完整安装
npm install echarts

# 按需引入（减小体积）
npm install echarts/core echarts/charts echarts/components echarts/renderers
```

```javascript
// 完整引入
import * as echarts from 'echarts';

// 按需引入
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  TitleComponent, TooltipComponent, LegendComponent,
  GridComponent, DatasetComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart, LineChart, PieChart,
  TitleComponent, TooltipComponent, LegendComponent,
  GridComponent, DatasetComponent, CanvasRenderer,
]);
```

## 核心配置结构

```javascript
const option = {
  // 标题
  title: { text: '图表标题', subtext: '副标题' },

  // 提示框
  tooltip: { trigger: 'axis' }, // 'axis' | 'item' | 'none'

  // 图例
  legend: { data: ['系列A', '系列B'] },

  // 工具栏
  toolbox: {
    feature: {
      saveAsImage: {},    // 保存为图片
      dataView: {},       // 数据视图
      dataZoom: {},       // 缩放
      restore: {},        // 重置
      magicType: { type: ['line', 'bar'] }, // 切换类型
    },
  },

  // 网格
  grid: { left: '10%', right: '10%', top: '10%', bottom: '10%' },

  // X 轴
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },

  // Y 轴
  yAxis: { type: 'value' },

  // 数据系列
  series: [
    { name: '系列A', type: 'bar', data: [10, 20, 30] },
    { name: '系列B', type: 'line', data: [5, 15, 25] },
  ],
};
```

## 常用图表

### 折线图

```javascript
const option = {
  title: { text: '月度趋势' },
  tooltip: { trigger: 'axis' },
  legend: { data: ['收入', '支出'] },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    boundaryGap: false,
  },
  yAxis: { type: 'value', name: '金额（元）' },
  series: [
    {
      name: '收入',
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1330],
      smooth: true,        // 平滑曲线
      symbol: 'circle',   // 标记形状
      symbolSize: 8,
      lineStyle: { width: 3 },
      areaStyle: {         // 区域填充
        opacity: 0.3,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(58,77,233,0.8)' },
          { offset: 1, color: 'rgba(58,77,233,0.1)' },
        ]),
      },
    },
    {
      name: '支出',
      type: 'line',
      data: [620, 732, 701, 734, 1090, 1130],
      smooth: true,
    },
  ],
};
```

### 柱状图

```javascript
const option = {
  title: { text: '部门业绩' },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['技术部', '市场部', '销售部', '运营部'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      data: [320, 250, 380, 210],
      barWidth: '40%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' },
        ]),
      },
      emphasis: { itemStyle: { color: '#188df0' } },
    },
  ],
};

// 堆叠柱状图
series: [
  { name: 'Q1', type: 'bar', stack: 'total', data: [120, 132, 101] },
  { name: 'Q2', type: 'bar', stack: 'total', data: [220, 182, 191] },
  { name: 'Q3', type: 'bar', stack: 'total', data: [150, 232, 201] },
]
```

### 饼图

```javascript
const option = {
  title: { text: '访问来源', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', left: 'left' },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['40%', '70%'], // 环形图
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: { show: true, formatter: '{b}: {d}%' },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' },
      },
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
    },
  ],
};
```

### 雷达图

```javascript
const option = {
  title: { text: '能力雷达图' },
  radar: {
    indicator: [
      { name: '销售', max: 100 },
      { name: '管理', max: 100 },
      { name: '技术', max: 100 },
      { name: '客服', max: 100 },
      { name: '研发', max: 100 },
      { name: '市场', max: 100 },
    ],
  },
  series: [{
    type: 'radar',
    data: [
      { value: [90, 80, 95, 70, 85, 75], name: '张三' },
      { value: [70, 90, 80, 85, 75, 95], name: '李四' },
    ],
  }],
};
```

## 交互功能

### 数据缩放

```javascript
option = {
  dataZoom: [
    {
      type: 'slider',     // 滑动条
      xAxisIndex: 0,
      start: 0,
      end: 50,
    },
    {
      type: 'inside',     // 鼠标滚轮
      xAxisIndex: 0,
    },
  ],
};
```

### 异步数据加载

```javascript
const chart = echarts.init(document.getElementById('chart'));
chart.showLoading();

try {
  const data = await fetch('/api/chart-data').then(r => r.json());
  chart.hideLoading();
  chart.setOption({
    xAxis: { data: data.categories },
    series: [{ type: 'line', data: data.values }],
  });
} catch (error) {
  chart.hideLoading();
  console.error('数据加载失败:', error);
}
```

### 动态更新

```javascript
// 追加数据
function appendData(newData) {
  const option = chart.getOption();
  option.xAxis[0].data.push(newData.category);
  option.series[0].data.push(newData.value);

  // 保持最近 20 个数据点
  if (option.xAxis[0].data.length > 20) {
    option.xAxis[0].data.shift();
    option.series[0].data.shift();
  }

  chart.setOption(option);
}

// 定时更新
setInterval(() => {
  appendData(generateData());
}, 2000);
```

## 主题与样式

```javascript
// 内置主题
const chart = echarts.init(dom, 'dark'); // 'dark' | 'vintage' | ...

// 自定义主题
const theme = {
  color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
  backgroundColor: '#fff',
  textStyle: { color: '#333' },
  title: { textStyle: { color: '#333' } },
};
echarts.registerTheme('custom', theme);
const chart = echarts.init(dom, 'custom');
```

## 下一步

- 🎨 [D3.js 数据可视化](/frontend/advanced/charts/d3) - D3.js 进阶
- 🖼️ [Canvas 绘图](/frontend/advanced/charts/canvas) - Canvas 详解
- 🖌️ [SVG 图形](/frontend/advanced/charts/svg) - SVG 进阶
