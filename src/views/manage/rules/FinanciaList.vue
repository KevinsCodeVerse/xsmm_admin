<template>
  <!--  财务报表-->
  <div id="box">
    <main-content>
      <div class="table-flex">
        <el-row :gutter="0">
          <!--          收入分类-->
          <el-col :lg="12" :md="12" :span="12">
            <el-table
              ref="elTable"
              size="mini"
              border
              resizable
              row-key="id"
              style="height: 100%;max-height: 850px"
              max-height="850"
              :data="tableData"
            >
              <el-table-column align="center" width="400px">
                <template slot="header" slot-scope="scope">
                  <div style="display: flex;justify-content: space-between;">
                    <div style="display: flex;justify-content: space-around;">
                      <span style="margin: 2px 0;">选择月份</span>
                      <el-date-picker
                        style="width: 50%"
                        v-model="params.month"
                        type="month"
                        size="mini"
                        placeholder="选择月份"
                        @change="changeDataMonth"
                      >
                      </el-date-picker>
                      <el-button type="primary" size="mini" @click="getPage"
                        >查询</el-button
                      >
                    </div>
                    <div style="display: flex;justify-content: space-around;">
                      <span style="margin: 2px 0">历史结余</span>
                      <el-input
                        v-model="remainAmount"
                        style="width: 50%"
                        size="mini"
                        placeholder="本月历史结余"
                      />
                      <el-button type="primary" size="mini" @click="setBalance"
                        >设置</el-button
                      >
                    </div>
                  </div>
                </template>

                <el-table-column align="center" label="日期" prop="date">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="上日结余"
                  prop="yesterdayRemain"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  label="今日收入"
                  prop="todayIncome"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  label="今日支出"
                  prop="todayExpend"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  label="今日结余"
                  prop="todayRemain"
                >
                </el-table-column>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              style="margin-top: 20px; display: flex; justify-content: flex-start"
              :current-page.sync="params.pageNo"
              :page-sizes="[50, 100, 150]"
              :page-size="params.pageSize"
              layout="total"
              :total="total"
            >
            </el-pagination>
          </el-col>
          <!--          收支分布-->
          <el-col :lg="12" :md="12" :span="12">
            <el-table
              ref="elTableTwo"
              size="mini"
              border
              resizable
              row-key="id"
              style="height: 850px;"
              :data="[{ id: 1 }]"
            >
              <el-table-column align="left">
                <template slot="header" slot-scope="scope">
                  <span>收支分布 </span>
                  <el-date-picker
                    style="width: 60%;margin: 0 10px"
                    v-model="date2"
                    :picker-options="pickerOptions"
                    type="daterange"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="mini"
                    :clearable="false"
                  >
                    @change="changeDataTime" clearable >
                  </el-date-picker>
                  <el-button type="primary" size="mini" @click="getPageTwo"
                    >查询</el-button
                  >
                </template>

                <template slot-scope="scope">
                  <div style="max-width:100%;height: 800px;z-index: 99">
                    <div style="width: 100%; height: 400px;" id="main1"></div>
                    <div style="width: 100%; height: 400px;" id="main2"></div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </main-content>
  </div>
</template>

<script>
import { debounce } from "lodash";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { Decimal } from "decimal.js";

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);
export default {
  data() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const firstDayOfMonth = new Date(year, month - 1, 1); // 当前月份的第一天
    return {
      errorMsg: "",
      loading: false,
      remainAmount: "",
      tableData: [],
      tableDataTwo: [],
      scrollPosition: 0,
      expendData: [],
      incomeData: [],
      params: {
        month: this.$moment().format("YYYY-MM")
      },
      total: 0,
      pages: 0,
      paramsTwo: {
        startTime: "",
        endTime: "",
        month: ""
      },
      date1: [new Date()],
      date2: [firstDayOfMonth, new Date()],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getPage();
  },
  mounted() {
    // const today = new Date();
    // const year = today.getFullYear();
    // const month = today.getMonth() + 1;
    // const firstDayOfMonth = new Date(year, month - 1, 1); // 当前月份的第一天
    //
    // this.$set(this.date2, 0, firstDayOfMonth);
    // console.log("this.date2", this.date2);
    this.getPageTwo();
  },

  methods: {
    // 获取某月收支统计
    getPage() {
      if (this.params.month) {
        this.loading = true;
        this.$request.post({
          url: "/finance/financeReport/getFinanceStatisticsByMonth",
          params: {
            month: this.$moment(this.params.month).format("YYYY-MM")
          },
          success: res => {
            this.tableData = res;
            this.getRemainByMonth();
            this.loading = false;
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.$message.error("请选择月份");
      }
    },
    // 获取图表数据
    getPageTwo() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const firstDayOfMonth = new Date(year, month - 1, 1); // 当前月份的第一天
      this.loading = true;
      this.$request.post({
        url: "/finance/financeReport/getIncomeAndExpenditurePieChart",
        params: {
          startTime: this.date2?.[0]
            ? this.$moment(this.date2[0]).format("YYYY-MM-DD 00:00:00")
            : "",
          endTime: this.date2?.[1]
            ? this.$moment(this.date2[1]).format("YYYY-MM-DD 23:59:59")
            : ""
        },
        success: res => {
          console.log("res", res);
          if (res.length) {
            this.expendData = JSON.parse(JSON.stringify(res));
            this.incomeData = JSON.parse(JSON.stringify(res));
            this.$nextTick(() => {
              this.getIncomeData();
              this.getExpenditureData();
            });
          }

          this.loading = false;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },

    getIncomeData() {
      var chartDom = document.getElementById("main1");
      var myChart = echarts.init(chartDom);
      var option;
      var data = [];
      this.incomeData.forEach(item => {
        if (item.incomeAmount !== 0) {
          data.push({
            value: item.incomeAmount,
            name: item.categoryName
          });
        }
      });
      let total = new Decimal(0);
      for (let i = 0; i < data.length; i++) {
        let valueDecimal = new Decimal(data[i].value);
        total = total.plus(valueDecimal);
      }

      console.log(total.toString()); // 输出合计值

      console.log("收入数据data", data);
      console.log("收入合计total", total);
      if (data.length) {
        function getRandomColor() {
          const letters = "0123456789ABCDEF";
          let color = "#";
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }
        option = {
          title: {
            text: "收入分布",
            subtext: `收入合计：${total}元`,
            left: "left"
          },
          tooltip: {
            trigger: "item"
          },
          legend: {
            bottom: "5px",
            left: "center",
            icon: "circle"
          },
          series: [
            {
              type: "pie",
              radius: "60%",
              avoidLabelOverlap: false,
              itemStyle: {
                borderColor: "#fff",
                borderWidth: 1
              },
              label: {
                alignTo: "edge",
                minMargin: 5,
                edgeDistance: 10,
                lineHeight: 1,
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}: ({d}%)"
                },
                textStyle: {
                  fontWeight: "normal",
                  fontSize: 10
                }
              },
              emphasis: {
                label: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              },
              data: data.map(item => ({
                ...item
                // itemStyle: {
                //   color: getRandomColor()
                // }
              }))
            }
          ]
        };

        option && myChart.setOption(option);
      } else {
        option = {
          title: {
            text: "暂无数据",
            x: "center",
            y: "center",
            textStyle: {
              color: "#65ABE7",
              fontWeight: "normal",
              fontSize: 16
            }
          },
          tooltip: {
            trigger: "item"
          },
          series: [
            {
              type: "",
              radius: "60%",
              data: [0]
            }
          ]
        };
        option && myChart.setOption(option);
      }
      // window.addEventListener("resize", () => {
      //   myChart.resize();
      // });
    },
    getExpenditureData() {
      var chartDom = document.getElementById("main2");
      var myChart = echarts.init(chartDom);
      var option;
      console.log("this.expendData", this.expendData);
      var data = [];
      this.expendData.forEach(item => {
        if (item.expendAmount !== 0) {
          data.push({
            value: item.expendAmount,
            name: item.categoryName
          });
        }
      });
      console.log("支出数据data", data);
      let total = new Decimal(0);
      for (let i = 0; i < data.length; i++) {
        let valueDecimal = new Decimal(data[i].value);
        total = total.plus(valueDecimal);
      }
      console.log("支出合计total", total);
      if (data.length) {
        function getRandomColor() {
          const letters = "0123456789ABCDEF";
          let color = "#";
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }
        option = {
          title: {
            text: "支出分布",
            subtext: `支出合计：${total}元`,
            left: "left"
          },
          tooltip: {
            trigger: "item"
          },
          legend: {
            bottom: "5px",
            left: "center",
            icon: "circle"
          },

          series: [
            {
              type: "pie",
              radius: "60%",
              itemStyle: {
                borderColor: "#fff",
                borderWidth: 2
              },
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}: ({d}%)"
                },
                textStyle: {
                  fontWeight: "normal",
                  fontSize: 10
                }
              },
              emphasis: {
                label: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              },
              data: data
            }
          ]
        };

        option && myChart.setOption(option);
      } else {
        option = {
          title: {
            text: "暂无数据",
            x: "center",
            y: "center",
            textStyle: {
              color: "#65ABE7",
              fontWeight: "normal",
              fontSize: 16
            }
          },
          tooltip: {
            trigger: "item"
          },
          series: [
            {
              type: "",
              radius: "60%",
              data: [0]
            }
          ]
        };
        option && myChart.setOption(option);
      }
      // window.addEventListener("resize", () => {
      //   myChart.resize();
      // });
    },
    // 获取本月结余
    getRemainByMonth() {
      this.$request.post({
        url: "/finance/financeMonthRemain/getRemainByMonth",
        params: {
          month: this.$moment(this.params.month).format("YYYY-MM")
        },
        success: res => {
          console.log("获取结余", res);
          this.remainAmount = res;
        },
        finally: () => {}
      });
    },
    setBalance() {
      if (
        this.remainAmount === "" ||
        this.remainAmount === null ||
        this.remainAmount === undefined
      ) {
        this.$message.error("请输入本月历史结余");
      } else {
        this.$request.post({
          url: "/finance/financeMonthRemain/update",
          params: {
            month: this.$moment(this.params.month).format("YYYY-MM"),
            remainAmount: Number(this.remainAmount)
          },
          success: res => {
            this.$message.success("设置成功");
            this.getPage();
          },
          finally: () => {}
        });
      }
    },
    changeDataTime(val) {
      if (val) {
        this.date2[0] = this.$moment(val[0]).format("YYYY-MM-DD");
        this.date2[1] = this.$moment(val[1]).format("YYYY-MM-DD");
      }

      console.log("paramsTwo", this.paramsTwo);
    },
    changeDataMonth(val) {
      if (val) {
        console.log("val", val);
        this.date1 = this.$moment(val[0]).format("YYYY-MM-DD");
        // this.params.endTime = this.$moment(val[1]).format("YYYY-MM-DD");
        console.log("params", this.params);
      }
    }
  }
};
</script>

<style>
.el-form--inline .el-form-item {
  height: 15px;
}
</style>
<style lang="scss" scoped>
.table-flex {
  .el-table {
    width: 100%;
  }
}
</style>
