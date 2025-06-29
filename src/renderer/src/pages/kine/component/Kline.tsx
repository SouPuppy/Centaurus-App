import { FC, useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import klin from './klin.json';
import dayjs from "dayjs";

// 模拟的数据类型
type KlineData = {
  data_us: string;  // ISO 8601 格式的日期字符串
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  hold: number;
  open_interest: number | null;  // 可能为 null
  turnover: number;
  settle: number | null;  // 可能为 null
  pre_settle: number | null;  // 可能为 null
  product_id: string;
  current_us: string;  // ISO 8601 格式的日期字符串
  change: number;
  amplitude: number;
  data_ts: number;  // 时间戳
};

const Kline: FC = () => {
  const klineRef = useRef<HTMLDivElement | null>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const [klinData, setKlinData] = useState<KlineData[]>([]);

  // 模拟接口
  const getData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(klin); // 这里模拟返回数据
      }, 1000);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData() as KlineData[];
      data && setKlinData(data); // 将数据存储在 state 中
    };

    fetchData();  // 调用异步获取数据函数
  }, []);

  // kline图配置
  const option = {
    animation: false,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: () => "", //取消tip弹窗
    },
    visualMap: {
      show: false,
      seriesIndex: 1,
      dimension: 2,
      pieces: [
        { value: 1, color: "#296758" },
        { value: -1, color: "#762c38" },
      ],
    },
    axisPointer: {
      link: [{ xAxisIndex: "all" }],
      label: { backgroundColor: "#777" },
    },
    grid: [
      { top: "0%", left: ".6%", right: "5%", height: "75%" },
      { left: ".6%", right: "5%", top: "75.5%", height: "16%" },
    ],
    xAxis: [
      {
        type: "category",
        gridIndex: 0, // 主图（K线图）
        data: [] as string[], // x轴使用数据中的日期
        boundaryGap: true,
        axisLine: { onZero: false, lineStyle: { color: "#404552" } },
        min: "dataMin",
        max: "dataMax",
        axisTick: { show: false }, //不显示刻度
        axisLabel: {
          show: false, // 不显示主图的 x 轴刻度
        },
        axisPointer: {
          label: { show: false }, // 禁用提示框
        },
      },
      {
        type: "category",
        gridIndex: 1, // 副图（持仓柱状图）
        data: [], // x轴使用数据中的日期
        boundaryGap: true,
        axisLine: { onZero: false, lineStyle: { color: "#404552" } },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
        axisLabel: {
          show: true, // 显示副图的 x 轴刻度
          fontSize: 12,
          formatter: (value: string) => dayjs(value).format('HH:mm'),
        },
      },
    ],
    yAxis: [
      {
        scale: true,
        axisLabel: { show: true, fontSize: 12 },
        splitLine: { show: true, lineStyle: { color: "#404552" } },
        position: "right",
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
      },
    ],
    dataZoom: [
      // 内部控制（鼠标滚轮、触摸缩放）
      { 
        type: "inside", 
        xAxisIndex: [0, 1],  // 同时作用于主图和副图，但不影响 Y 轴
        start: 50, 
        end: 100 
      },
      // Y轴的拖拽缩放（只启用内部拖动，不显示滑动条）
      {
        type: "inside", 
        yAxisIndex: [0],  // 只作用于 Y 轴
        orient: 'vertical',  // 设置为竖直方向
        start: 50,
        end: 100,
      }
    ],

    series: [] as echarts.SeriesOption[],
  };

  // 初始化和更新图表
  useEffect(() => {
    if (klineRef.current) {
      const myChart = echarts.init(klineRef.current);
      setChart(myChart);
    }
  }, []);

  // 格式化数据
  const splitData = (rawData: KlineData[]) => {
    const categoryData: string[] = [];
    const values: [number, number, number, number][] = [];
    const volumes: [number, number, number][] = [];

    rawData.forEach((item, index) => {
      // 将时间戳转换为可读格式
      const dateStr = dayjs(item.data_ts * 1000).format("YYYY-MM-DD HH:mm:ss");
      categoryData.push(dateStr);
      // 将数据转换为K线图需要的格式
      values.push([item.open, item.close, item.low, item.high]);
      // 将成交量数据转换为K线图需要的格式
      volumes.push([index, item.volume, item.close > item.open ? 1 : -1]);
    });

    return { categoryData, values, volumes, rawData };
  };

  useEffect(() => {
    if (chart && klinData.length) {
      const { categoryData, values, volumes } = splitData(klinData);
      option.xAxis[0].data = categoryData;
      option.xAxis[1].data = categoryData;
      option.series = [
        {
          type: "candlestick",
          name: "K",
          data: values,
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
        {
          type: "bar",
          name: "持仓量",
          data: volumes,
          xAxisIndex: 1,
          yAxisIndex: 1,
        }
      ];

      chart.setOption(option);
    }
  }, [chart, klinData]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div ref={klineRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default Kline;
