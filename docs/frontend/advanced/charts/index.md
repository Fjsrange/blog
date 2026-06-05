---
title: 图表基础入门
---

# 图表基础入门

数据可视化是前端开发的重要领域，通过图表将数据转化为直观的视觉表达，帮助用户理解和分析信息。

## 图表类型

| 图表类型 | 适用场景 | 常见库 |
|---------|---------|--------|
| 折线图 | 趋势变化、时间序列 | ECharts、D3 |
| 柱状图 | 数值对比、排名 | ECharts、D3 |
| 饼图 | 占比分布 | ECharts、D3 |
| 散点图 | 相关性分析 | ECharts、D3 |
| 雷达图 | 多维对比 | ECharts |
| 地图 | 地理数据 | ECharts、D3 |
| 关系图 | 网络拓扑 | ECharts、D3 |
| 仪表盘 | KPI 指标 | ECharts |

## 技术选型

```
简单图表需求 → ECharts（开箱即用，配置驱动）
高度定制需求 → D3.js（底层控制，数据驱动）
2D 绘图/游戏 → Canvas（像素操作，高性能）
矢量图形/动画 → SVG（DOM 操作，可交互）
```

### Canvas vs SVG

| 特性 | Canvas | SVG |
|------|--------|-----|
| 渲染方式 | 位图（像素） | 矢量（XML） |
| 缩放 | 模糊 | 清晰 |
| DOM 操作 | 不支持 | 支持 |
| 事件绑定 | 需手动计算 | 原生支持 |
| 性能 | 大量元素更优 | 少量元素更优 |
| 适用场景 | 游戏、图像处理 | 图表、图标、动画 |

## ECharts 快速上手

```javascript
// 安装
// npm install echarts

import * as echarts from 'echarts';

// 初始化
const chart = echarts.init(document.getElementById('chart'));

// 配置项
const option = {
  title: { text: '销售数据' },
  tooltip: { trigger: 'axis' },
  legend: { data: ['销量', '利润'] },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110],
    },
    {
      name: '利润',
      type: 'line',
      data: [30, 50, 40, 20, 15, 30],
    },
  ],
};

// 设置配置
chart.setOption(option);

// 响应式
window.addEventListener('resize', () => chart.resize());

// 销毁
chart.dispose();
```

## D3.js 快速上手

```javascript
// 安装
// npm install d3

import { select, scaleLinear, axisBottom, axisLeft } from 'd3';

// 选择元素
const svg = select('#chart')
  .append('svg')
  .attr('width', 600)
  .attr('height', 400);

// 比例尺
const xScale = scaleLinear()
  .domain([0, 100])
  .range([50, 550]);

const yScale = scaleLinear()
  .domain([0, 100])
  .range([350, 50]);

// 绑定数据
svg.selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('r', 5)
  .attr('fill', 'steelblue');
```

## Canvas 快速上手

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 50);

// 圆形
ctx.beginPath();
ctx.arc(200, 100, 50, 0, Math.PI * 2);
ctx.fill();

// 线条
ctx.beginPath();
ctx.moveTo(300, 50);
ctx.lineTo(400, 100);
ctx.strokeStyle = 'blue';
ctx.stroke();

// 文本
ctx.font = '20px Arial';
ctx.fillText('Hello Canvas', 10, 200);
```

## SVG 快速上手

```html
<!-- 基本图形 -->
<svg width="400" height="300">
  <!-- 矩形 -->
  <rect x="10" y="10" width="100" height="50" fill="red" rx="5" />

  <!-- 圆形 -->
  <circle cx="200" cy="100" r="40" fill="blue" />

  <!-- 椭圆 -->
  <ellipse cx="300" cy="80" rx="50" ry="30" fill="green" />

  <!-- 线条 -->
  <line x1="10" y1="200" x2="100" y2="250" stroke="black" />

  <!-- 折线 -->
  <polyline points="150,200 180,180 210,220 240,190" fill="none" stroke="purple" />

  <!-- 文本 -->
  <text x="10" y="280" font-size="20">Hello SVG</text>
</svg>
```

## 在 Vue/React 中使用

```vue
<!-- Vue3 + ECharts -->
<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({ option: Object });
const chartRef = ref(null);
let chart = null;

onMounted(() => {
  chart = echarts.init(chartRef.value);
  chart.setOption(props.option);
});

watch(() => props.option, (newOption) => {
  chart?.setOption(newOption);
}, { deep: true });

onUnmounted(() => {
  chart?.dispose();
});
</script>
```

```jsx
// React + ECharts
import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

function Chart({ option }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    instanceRef.current = echarts.init(chartRef.current);
    instanceRef.current.setOption(option);

    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      instanceRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    instanceRef.current?.setOption(option);
  }, [option]);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
}
```

## 下一步

- 📊 [ECharts 实战](/frontend/advanced/charts/echarts) - 深入 ECharts
- 🎨 [D3.js 数据可视化](/frontend/advanced/charts/d3) - D3.js 进阶
- 🖼️ [Canvas 绘图](/frontend/advanced/charts/canvas) - Canvas 详解
- 🖌️ [SVG 图形](/frontend/advanced/charts/svg) - SVG 进阶
