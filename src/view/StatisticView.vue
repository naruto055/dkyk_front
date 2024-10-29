<script>
import {doGet} from "../http/httpRequest.js";
import * as echarts from 'echarts';

export default {
  name: "StatisticView",
  mounted() {
    this.loadOutline();
    this.loadSaleFunnelCharts();
    this.loadSourceCluePieChart();
  },
  data() {
    return {
      // 概览统计数据
      outlineData: {}
    }
  },
  methods: {
    loadOutline() {
      doGet(`/api/summary/data`, {}).then(resp => {
        if (resp.data.code === 200) {
          this.outlineData = resp.data.data;
        }
      })
    },

    // 加载销售漏斗图
    loadSaleFunnelCharts() {
      // 查询数据
      doGet(`/api/saleFunnel/data`).then( resp => {
        if (resp.data.code === 200) {
          let saleFunnelData = resp.data.data;
          let chartDom = document.getElementById('saleFunnelCharts');
          let myChart = echarts.init(chartDom);
          // 配置可选项
          let option = {
            title: {
              text: '销售漏斗图',
              left: 'center',
              top: 'bottom'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%'
            },
            toolbox: {
              feature: {
                dataView: {readOnly: true},
                restore: {},
                saveAsImage: {}
              }
            },
            legend: {
              data: ['线索', '客户', '交易', '成交']
            },
            series: [
              {
                name: '销售漏斗数据统计',
                type: 'funnel',
                left: '10%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                  show: true,
                  position: 'inside'
                },
                labelLine: {
                  length: 10,
                  lineStyle: {
                    width: 1,
                    type: 'solid'
                  }
                },
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 1
                },
                emphasis: {
                  label: {
                    fontSize: 20
                  }
                },
                // 数据项
                data: saleFunnelData
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },

    // 加载线索来源饼图
    loadSourceCluePieChart() {
      doGet(`/api/sourcePie/data`, {}).then( resp => {
        if (resp.data.code === 200) {
          let sourceData = resp.data.data;

          let chartDom = document.getElementById('sourceCluePieChart');
          let myChart = echarts.init(chartDom);
          let option = {
            title: {
              text: '线索来源',
              left: 'center',
              top: 'bottom'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'horizontal',
            },
            series: [
              {
                name: '线索来源统计',
                type: 'pie',
                radius: '60%',
                data: sourceData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
  }
}
</script>

<template>
  <el-row>

    <el-col :span="6">
      <el-statistic :value="outlineData.effectiveActivityCount">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            市场活动
          </div>
        </template>
        <template #suffix>/{{ outlineData.totalActivityCount }}</template>
      </el-statistic>
    </el-col>
    <el-col :span="6">
      <el-statistic title="线索总数" :value="outlineData.totalClueCount"/>
    </el-col>
    <el-col :span="6">
      <el-statistic title="客户总数" :value="outlineData.totalCustomerCount"/>
    </el-col>
    <el-statistic :value="outlineData.successTranAmount">
      <template #title>
        <div style="display: inline-flex; align-items: center">
          交易总额
        </div>
      </template>
      <template #suffix>/{{ outlineData.totalTranAmount }}</template>
    </el-statistic>
  </el-row>

  <!--销售漏斗图-->
  <div id="saleFunnelCharts" style="width: 48%;height:350px; margin: 10px; float: left;"></div>
  <!--线索来源饼图-->
  <div id="sourceCluePieChart" style="width: 48%;height:350px; margin: 10px; float: left;"></div>
</template>

<style scoped>
.el-row {
  text-align: center;
}
</style>