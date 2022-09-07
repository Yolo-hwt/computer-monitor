<template>
  <div class="cpu-container">
    <div class="cpu-header">
      <div
        class="header-usage"
        id="cpuUsageframe"
        v-loading="cpuTotalUsageChart.loading"
      ></div>
      <div class="header-info">
        <div
          class="header-info-item"
          v-for="(item, index) in cpuInfo.cpuBasicInfo"
          :key="index"
        >
          <h1>{{ index }}</h1>
          <p>{{ item }}</p>
          <!-- <p>{{ basicInfo.platForm }}</p> -->
        </div>
      </div>
    </div>
    <div class="cpu-body">
      <div class="cpu-body-left">
        <div
          class="left-usage"
          id="cpuUsageChart"
          v-loading="cpuTotalUsageChart.loading"
        ></div>
        <div class="usage-Chart-footer">
          <p>
            当前导出时间设置为：{{
              this.$convert.secToTimeStr(cpu_default.timer.cpuUsageSave)
                .time_str
            }}
          </p>
          <p v-show="cpuButton.exportUsage || false">
            预计导出时间倒计时{{ countDownForExport + "s" }}
          </p>
          <div>
            <el-button
              type="primary"
              round
              icon="el-icon-download"
              @click="exportAllUsageData"
              :disabled="cpuButton.exportAllUsage"
              >all</el-button
            >
            <el-button
              type="primary"
              round
              icon="el-icon-download"
              @click="exportUsageData"
              :disabled="cpuButton.exportUsage"
            ></el-button>
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              @click="clearUsageData"
              :disabled="cpuButton.deleteData"
            ></el-button>
          </div>
        </div>
      </div>
      <div class="cpu-body-right">
        <div id="eachCpuChart" v-loading="eachCpuChart.loading"></div>
        <el-button type="primary" round icon="  el-icon-camera"></el-button>
      </div>
    </div>
    <div class="cpu-footer">
      <div class="cpu-process">
        <div class="cpu-process-header">
          <h3>
            进程TopList freq:
            {{
              $convert.secToTimeStr(this.cpu_default.timer.cpuProcessQuery)
                .time_str || "1s"
            }}
          </h3>
          <div>
            <el-button
              type="primary"
              round
              icon="el-icon-camera"
              @click="exportProcessData"
            ></el-button>
          </div>
        </div>

        <el-table
          v-loading="cpuProcessChart.loading"
          :data="cpuInfo.cpuProcessInfo"
          style="width: 1350; margin-bottom: 20px"
          row-key="pid"
          column-key="name"
          border
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="name"
            label="名称"
            sortable
            width="250"
            :filters="cpuInfo.cpuProcessName"
            :filter-method="cpuNameFilterHandler"
            :formatter="nameFormatter"
          >
          </el-table-column>
          <el-table-column prop="pid" label="PID" sortable width="250">
          </el-table-column>
          <el-table-column prop="session" label="会话" sortable width="250">
          </el-table-column>
          <el-table-column prop="status" label="状态" sortable width="250">
          </el-table-column>
          <el-table-column
            prop="used"
            label="内存"
            sortable
            width="300"
            :formatter="ramFormatter"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default {
  name: "Cpu",
  data() {
    return {
      countDownForExport: 0,
      countDownTimer: null,
      cpuButton: {
        exportUsage: false,
        exportAllUsage: false,
        exportEach: false,
        exportProcess: false,
        deleteData: false,
      },
      userinfo: {},
      initParamStatus: false,
      cpu_default: {},
      requestOption: {
        baseUrl: "http://127.0.0.1:3000/api/cpuInfo/",
        //请求后端参数控制
        basic: "basic",
        cores: "cores",
        totalusage: {
          usage: "usage",
          params: {
            flag: false, //or false
            time: 1000,
          },
        },
        cpuprocess: {
          process: "process",
          params: {
            search: "console", //or services
            sort: "dec", //or asc
            limit: 10,
          },
        },
      },
      cpuInfo: {
        cpuBasicInfo: {
          model: "Intel(R) Core(TM) i5-9300H CPU @ 2.40GHz",
          arch: "x64",
          nums: 8,
          freq: 2400,
        },
        cpuCoresInfo: {
          name: [
            "cpu0",
            "cpu1",
            "cpu2",
            "cpu3",
            "cpu4",
            "cpu5",
            "cpu6",
            "cpu7",
          ],
          usage: [
            "22.96",
            "12.69",
            "24.58",
            "15.29",
            "22.02",
            "20.95",
            "19.64",
            "11.45",
          ],
          num: 8,
        }, //name,usage
        cpuProcessInfo: [{ used: 0 }],
        cpuProcessName: [],
      },
      //总利用率仪表盘
      cpuTotalUsageFrame: {
        timer: null,
        timeout: 2000,
        titleText: "CPU",
        textColor: "black",
        backgroundColor: "white",
        usageData: [31],
        offset_0_Color: "#16CEB9",
        offset_1_Color: "#6648FF",
      },
      //总利用率表格
      cpuTotalUsageChart: {
        loading: true,
        timer: null,
        totalUsage: [31, 31, 31, 31, 31, 31, 31],
        yAxisChart: ["", "", "", "", "", "", ""],
      },
      //各个cpu利用率表格
      eachCpuChart: {
        loading: true,
        timer: null,
        timeout: 3000,
      },
      //cpu进程表格
      cpuProcessChart: {
        timer: null,
        timeout: 4000,
        loading: true,
      },
    };
  },
  beforeMount() {
    //挂载数据总线设置cpu参数方法
    // console.log("cpu11111");
    // this.$bus.$on("setCpuParams", this.setCpuParams);
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    // this.getCpuInitParams();
  },
  mounted() {
    // this.initCharts();
    // this.downloadTxt();
    //获取初始化cpu参数
    // this.$nextTick(() => {
    //   this.defalultParams = this.$pub.subscribe(
    //     "cpu_default",
    //     (msgName, data) => {
    //       console.log("cpu", this.defalultParams);
    //     }
    //   );
    // });
  },
  activated() {
    // console.log("Cpu组件被激活了");
    // this.getCpuTotalUsage();
    // this.clearAllTimer();
    this.getCpuInitParams();
    console.log(this.defalultParams);
    this.initData();
    this.initCharts();
  },
  deactivated() {
    this.clearAllTimer();
    // console.log("Cpu组件失活了");
  },
  watch: {
    processUsed(newVal) {
      var that = this;
      // this.downloadProcessInfo();
      this.$nextTick().then(function () {
        that.forceTableBackground();
      });
    },
    totalUsage(newVal, oldVal) {
      // console.log("totalUsage new:", newVal, "old:", oldVal);
      this.initCpuTotalUsageFrame();
      this.initCpuUTotalUsageChart();
    },
    cpuCores(newVal, oldVal) {
      // console.log("cpuCores new:", newVal, "old:", oldVal);
      this.initEachCpuChart();
    },
  },
  computed: {
    totalUsage() {
      return this.cpuTotalUsageFrame.usageData;
    },
    cpuCores() {
      return this.cpuInfo.cpuCoresInfo.usage;
    },
    processUsed() {
      return this.cpuInfo.cpuProcessInfo[0].used;
    },
  },
  methods: {
    //获取配置参数
    getCpuInitParams() {
      const username = this.userinfo.username;

      this.cpu_default =
        localStorage.getItem("params_cpu_" + username) === null
          ? this.$params.cpu_default
          : JSON.parse(localStorage.getItem("params_cpu_" + username));
    },
    setCpuParams(data) {
      console.log("cpu get data", data);
    },
    //获取当前日期
    getCurrentDate() {
      return new Date()
        .toLocaleDateString()
        .split("/")
        .map((item) => {
          if (item < 10) {
            return "0" + item;
          } else {
            return item;
          }
        })
        .join("-");
      //"2021-08-09"
    },
    getCurrentTime() {
      var d = new Date();
      var hour = d.getHours(); //得到小时数
      var minute = d.getMinutes(); //得到分钟数
      var sec = d.getSeconds(); //得到秒数
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      sec = sec < 10 ? "0" + sec : sec;
      return [hour, minute, sec].join(":");
    },
    //预处理导出excel数据
    initProcessinfoForExcel(processinfo) {
      let resultProcess = [];
      let index = 0;
      processinfo.forEach((item) => {
        if (item.children) {
          let tempobj = {};
          tempobj.name = item.name;
          tempobj.pid = item.pid;
          tempobj.session = item.session;
          tempobj.status = item.status;
          tempobj.used = item.used;
          tempobj.childIndex = "root";
          tempobj.childNum = item.childNum;

          index = 0;
          resultProcess.push(tempobj);
          item.children.forEach((child) => {
            child.childIndex = index++;
            child.childNum = 0;
            resultProcess.push(child);
          });
        }
      });
      return resultProcess;
    },
    //预处理导出usagedata数据
    initCpuUsageinfoForExcel(cpuusageinfo) {
      console.log(cpuusageinfo);
      let cpuusageObj = [];
      const eachusage = {
        index: "0",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
        10: "",
      };
      let time = 0;
      let start = 0;
      let end = 10;
      const datalen = parseInt(cpuusageinfo.length / 10);
      for (let i = 0; i < datalen; i++) {
        let tempstr = cpuusageinfo.slice(start, end);
        console.log(start);

        tempstr.push([].concat([start])[0]);
        let tempobj = JSON.parse(JSON.stringify(eachusage));
        for (let key in tempobj) {
          tempobj[key] = tempstr[time++];
        }
        cpuusageObj.push(tempobj);
        time = 0;
        start += 10;
        end += 10;
      }
      let j = start;
      let lastobj = JSON.parse(JSON.stringify(eachusage));
      let laststr = cpuusageinfo.slice(start);
      laststr.push([].concat([start])[0]);
      time = 0;
      for (let key in lastobj) {
        lastobj[key] = laststr[time++];
        j++;
        if (j + 1 === cpuusageinfo.length) {
          lastobj[key] = "null";
        }
      }
      cpuusageObj.push(lastobj);
      debugger;
      return cpuusageObj;
    },
    //下载为txt
    downloadTxt() {
      let str = JSON.stringify(this.cpuInfo.cpuBasicInfo);
      console.log(str);
      let strData = new Blob([str], { type: "text/plain;charset=utf-8" });
      saveAs(strData, "E:/cpu基本信息.txt");
    },
    messageTip(msg) {
      this.$message({
        message: msg,
        type: "success",
        duration: 1700,
      });
    },
    //导出进程信息
    exportProcessData() {
      const data = XLSX.utils.json_to_sheet(
        this.initProcessinfoForExcel(this.cpuInfo.cpuProcessInfo)
      );
      const wb = XLSX.utils.book_new();
      const name =
        this.getCurrentDate() + "_" + this.getCurrentTime() + "cpuprocess";
      XLSX.utils.book_append_sheet(wb, data, "cpuprocess");
      XLSX.writeFile(wb, name + ".xlsx");
      this.messageTip(
        "cpu process in" +
          this.$convert.secToTimeStr(this.cpu_default.timer.cpuUsageSave) +
          "导出成功！"
      );
    },
    //导出cpuusage数据
    exportUsageData() {
      //禁用导出按钮和清空按钮
      this.cpuButton.exportUsage = true;
      this.cpuButton.deleteData = true;
      const length = this.cpuTotalUsageChart.totalUsage.length;
      //导出倒计时
      setTimeout(() => {
        //导出数据
        const data = XLSX.utils.json_to_sheet(
          this.initCpuUsageinfoForExcel(
            this.cpuTotalUsageChart.totalUsage.slice(length)
          )
        );
        const wb = XLSX.utils.book_new();
        const name =
          this.getCurrentDate() + "_" + this.getCurrentTime() + "cpuusage";
        XLSX.utils.book_append_sheet(wb, data, "cpuusage");
        XLSX.writeFile(wb, name + ".xlsx");
        //还原按钮
        this.cpuButton.exportUsage = false;
        this.cpuButton.deleteData = false;
        this.messageTip(
          "cpu usage in" +
            this.$convert.secToTimeStr(this.cpu_default.timer.cpuUsageSave) +
            "导出成功！"
        );
      }, this.cpu_default.timer.cpuUsageSave);

      this.countDownTimer = setInterval(() => {
        this.countDownForExport--;
        if (this.countDownForExport === 0) {
          clearInterval(this.countDownTimer);
          this.countDownForExport = cpu_default.timer.cpuUsageSave / 1000;
        }
      }, 1000);
    },
    //导出所有cpuusage数据
    exportAllUsageData() {
      const data = XLSX.utils.json_to_sheet(
        this.initCpuUsageinfoForExcel(this.cpuTotalUsageChart.totalUsage)
      );
      const wb = XLSX.utils.book_new();
      const name =
        this.getCurrentDate() + "_" + this.getCurrentTime() + "cpuusageall";
      XLSX.utils.book_append_sheet(wb, data, "cpuusageall");
      XLSX.writeFile(wb, name + ".xlsx");
      this.messageTip("all usage data 导出成功！");
    },
    clearUsageData() {
      this.cpuTotalUsageChart.totalUsage = [];
      this.messageTip("clear all usage data 清空成功！");
    },
    //初始化数据
    initData() {
      // //获取cpu基本信息
      this.getCpuBasicInfo();
      // 获取cpu总利用率;
      this.getCpuTotalUsage();
      setTimeout(() => {
        this.cpuTotalUsageChart.loading = false;
      }, this.cpu_default.timer.cpuUsageQuery - 300);
      //各个cpu信息
      this.getEachCpuInfo();
      setTimeout(() => {
        this.eachCpuChart.loading = false;
      }, this.cpu_default.timer.cpuEachQuery - 300);
      // //获取cpu进程信息
      this.getCpuProcessInfo();
      setTimeout(() => {
        this.cpuProcessChart.loading = false;
      }, this.cpu_default.timer.cpuProcessQuery - 300);

      this.countDownForExport =
        this.cpu_default.timer.cpuUsageSave / 1000 || 60;
    },
    initCharts() {
      this.initCpuTotalUsageFrame();
      this.initCpuUTotalUsageChart();
      this.initEachCpuChart();
    },
    //获取cpu基本信息
    getCpuBasicInfo() {
      this.$req
        .requestLocalData(this.requestOption.baseUrl, this.requestOption.basic)
        .then((basicinfo) => {
          this.cpuInfo.cpuBasicInfo = basicinfo;
        });
    },
    //获取cpu总利用率
    getCpuTotalUsage() {
      this.cpuTotalUsageFrame.timer = setInterval(() => {
        const args_total = this.requestOption.totalusage;
        this.$req
          //请求后端数据
          .requestLocalDataWithParams(
            this.requestOption.baseUrl,
            args_total.usage,
            args_total.params
          )
          .then((usageinfo) => {
            //更新本地数据
            usageinfo = (usageinfo * 100).toFixed(2);
            this.cpuTotalUsageFrame.usageData = [usageinfo];
            this.cpuTotalUsageChart.yAxisChart.push("");
            this.cpuTotalUsageChart.totalUsage.push(usageinfo);
          });
      }, this.cpu_default.timer.cpuUsageQuery);
    },
    //获取各个cpu信息
    getEachCpuInfo() {
      this.eachCpuChart.timer = setInterval(() => {
        let cores = {
          name: [],
          usage: [],
          num: 0,
        };
        //获取多核cpu信息
        this.$req
          .requestLocalData(
            this.requestOption.baseUrl,
            this.requestOption.cores
          )
          .then((coresinfo) => {
            coresinfo.forEach((item, index) => {
              cores.name.push(item.name);
              cores.usage.push(item.usage);
              cores.num++;
            });
            this.cpuInfo.cpuCoresInfo = cores;
            // console.log("coresinfo", this.cpuInfo.cpuCoresInfo);
          });
      }, this.cpu_default.timer.cpuEachQuery);
    },
    //获取cpu进程信息
    getCpuProcessInfo() {
      this.cpuProcessChart.timer = setInterval(() => {
        this.$req
          .requestLocalDataWithParams(
            this.requestOption.baseUrl,
            this.requestOption.cpuprocess.process,
            this.requestOption.cpuprocess.params
          )
          .then((processinfo) => {
            this.cpuInfo.cpuProcessInfo = processinfo;
            let nametemp = [];
            processinfo.forEach((item, index) => {
              // console.log("index:", index);
              const nameitem = {
                text: item.name,
                value: item.name,
              };
              nametemp.push(nameitem);
            });
            this.cpuInfo.cpuProcessName = nametemp;
            // console.log(this.cpuInfo.cpuProcessInfo);
          });
      }, this.cpu_default.timer.cpuProcessQuery);
    },
    //初始化cpu利用率仪表盘
    initCpuTotalUsageFrame() {
      var usageFrame = this.$echarts.init(
        document.getElementById("cpuUsageframe")
      );
      let option = {
        title: [
          {
            text: this.cpuTotalUsageFrame.titleText,
            x: "center",
            top: "58%",
            textStyle: {
              color: this.cpuTotalUsageFrame.textColor, //文字颜色
              fontSize: 14,
              fontWeight: "100",
            },
          },
          {
            text: this.cpuTotalUsageFrame.usageData + "%",
            x: "center",
            y: "center",
            textStyle: {
              fontSize: 30,
              color: this.cpuTotalUsageFrame.textColor, //文字颜色
              fontFamily: "DINAlternate-Bold, DINAlternate",
              foontWeight: "600",
            },
          },
        ],
        backgroundColor: this.cpuTotalUsageFrame.backgroundColor,
        polar: {
          radius: ["60%", "90%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            roundCap: true, //末端圆角
            barWidth: 36,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(66, 66, 66, .3)", //空闲条带颜色
              // color: 'red'
            },
            data: this.cpuTotalUsageFrame.usageData,
            coordinateSystem: "polar",
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: this.cpuTotalUsageFrame.offset_0_Color,
                  },
                  {
                    offset: 1,
                    color: this.cpuTotalUsageFrame.offset_1_Color,
                  },
                ]),
              },
            },
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["90%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 3,
              borderColor: "#5269EE",
            },
            // data: [100],
          },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["58%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 1,
              borderColor: "#5269EE",
            },
            // data: [100],
          },
        ],
      };
      usageFrame.setOption(option);
    },
    //初始化cpu利用率表格
    initCpuUTotalUsageChart() {
      let that = this;
      var usageChart = this.$echarts.init(
        document.getElementById("cpuUsageChart")
      );
      let option = {
        title: {
          text:
            "Cpu usage  freq: " +
              this.$convert.secToTimeStr(this.cpu_default.timer.cpuUsageQuery)
                .time_str || "1s",
          left: "10%",
          top: 0,
        },
        grid: { left: "7%", top: "15%", width: "80%", height: "80%" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          textStyle: {
            color: "black",
          },
          formatter: function (params) {
            return "cpu usage\n" + params[0].value + "%";
          },
        },
        axisPointer: {
          link: { xAxisIndex: "all" },
          label: {
            backgroundColor: "#777",
            // formatter: function (params) {
            //   // return params[0].name + " : " + params[0].value + "%";
            //   console.log(params);
            // },
          },
        },

        xAxis: {
          name:
            this.$convert.secToTimeStr(this.cpu_default.timer.cpuUsageQuery)
              .time_str || "1s",
          type: "category",
          show: true,
          data: this.cpuTotalUsageChart.yAxisChart,
        },
        yAxis: {
          name: "%",
          type: "value",
          axisPointer: {
            label: {
              formatter: function (params) {
                return params.value.toFixed(2);
              },
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0],
            start: 0,
            end: 98,
          },
          {
            type: "inside",
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
          {
            show: true,
            xAxisIndex: [0],
            type: "slider",
            top: "95%",
            start: 0,
            end: 98,
          },
          {
            type: "slider",
            show: true,
            yAxisIndex: [0],
            left: "93%",
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            data: this.cpuTotalUsageChart.totalUsage,
            type: "line",
            symbol: "none",
            // tooltip: {
            //   formatter: function (param) {
            //     console.log("111", param);
            //     param = param[0];
            //     return param;
            //   },
            // },
          },
        ],
      };

      option && usageChart.setOption(option);
    },
    //初始化各个cpu信息
    initEachCpuChart() {
      var eachcpu = this.$echarts.init(document.getElementById("eachCpuChart"));
      var salvProMax = []; //背景按最大值
      for (let i = 0; i < this.cpuInfo.cpuCoresInfo.num; i++) {
        salvProMax.push(100);
      }
      let option = {
        backgroundColor: "white",
        title: {
          text:
            "Cpu each  freq: " +
              this.$convert.secToTimeStr(this.cpu_default.timer.cpuEachQuery)
                .time_str || "1s",
          left: "10%",
          top: 0,
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "2%",
          top: "18%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return params[0].name + " : " + params[0].value + "%";
          },
        },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: "black",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: this.cpuInfo.cpuCoresInfo.name,
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              textStyle: {
                color: "black",
                fontSize: "15",
              },
            },
            data: this.cpuInfo.cpuCoresInfo.usage,
          },
        ],
        series: [
          {
            name: "值",
            type: "bar",
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "rgb(57,89,255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgb(46,200,207,1)",
                  },
                ]),
              },
            },
            barWidth: 20,
            data: this.cpuInfo.cpuCoresInfo.usage,
          },
          {
            name: "背景",
            type: "bar",
            barWidth: 20,
            barGap: "-100%",
            data: salvProMax,
            itemStyle: {
              normal: {
                color: "lightGray",
                barBorderRadius: 30,
              },
            },
          },
        ],
      };

      eachcpu.setOption(option);
    },
    //清除所有计时器
    clearAllTimer() {
      clearInterval(this.cpuTotalUsageFrame.timer);
      clearInterval(this.eachCpuChart.timer);
      clearInterval(this.cpuProcessChart.timer);
      // clearInterval(this.countDownTimer);
    },
    /**
     * 表格方法
     */
    //根据名称筛选
    cpuNameFilterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //内存格式
    ramFormatter(row, column) {
      return (row.used / 1024 / 2).toFixed(2) + "MB";
    },
    //名称格式
    nameFormatter(row, column) {
      if (row.childNum) {
        return `${row.name}(${row.childNum})`;
      } else {
        return row.name;
      }
    },
    //根据内存控制表格样式
    tableRowClassName({ row, rowIndex }) {
      let ramused = parseInt((row.used / 1024 / 2).toFixed(2));
      // console.log(typeof ramused);
      // console.log(ramused);
      let classname = "ramused0-1";

      if (ramused > 0 && ramused < 1) {
        classname = "ramused0-1";
      } else if (ramused > 1 && ramused < 10) {
        classname = "ramused1-10";
      } else if (ramused > 10 && ramused < 50) {
        classname = "ramused10-50";
      } else if (ramused > 50 && ramused < 100) {
        classname = "ramused50-100";
      } else if (ramused > 100 && ramused < 200) {
        classname = "ramused100-200";
      } else if (ramused > 200 && ramused < 300) {
        classname = "ramused200-300";
      } else if (ramused > 300) {
        classname = "ramused300-";
      }

      // console.log(classname);
      return classname;
    },
    //使用jquery改变css背景颜色样式
    jqChangeBackoundColor(classname, color) {
      this.$jq(classname).css({
        backgroundColor: color,
      });
    },
    //强制改变表格背景
    forceTableBackground() {
      this.jqChangeBackoundColor(".el-table .ramused0-1", "#ffffff");
      this.jqChangeBackoundColor(".el-table .ramused1-10", "#fff9e4");
      this.jqChangeBackoundColor(".el-table .ramused10-50", "#f9eca8");
      this.jqChangeBackoundColor(".el-table .ramused50-100", "#ffe487");
      this.jqChangeBackoundColor(".el-table .ramused100-200", "#ffd264");
      this.jqChangeBackoundColor(".el-table .ramused200-300", "#ff6c37");
      this.jqChangeBackoundColor(".el-table .ramused300-", "#ea8685");
    },
  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.cpu-header {
  height: 200px;
  padding: 10px;

  margin-bottom: 30px;
  display: flex;
  align-items: center;
}
.header-usage {
  width: 200px;
  /* padding: 10px; */
  height: 100%;
  margin-right: 30px;
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333;
}
.header-info {
  flex: 1 1 auto;
  padding: 10px;
  border: 1px solid #fff;
  box-shadow: 1px 1px 3px #333;
  border-radius: 15px;
  justify-content: space-around;
  display: flex;
  align-items: center;
  height: 130px;
  background-color: white;
}
.header-info-item {
  display: flex;
  align-items: center;
  /* justify-content: center; */

  /* flex: 1 1 auto; */
}
.header-info-item h1 {
  font-size: 23px;
  margin-right: 15px;
}
.header-info-item {
  font-size: 18px;
}
/* .header-info-item p,
.header-info-item h1 {
  flex: 1 1 auto;
} */
.header-info-item h1 {
  width: 70px;
}
.cpu-body {
  display: flex;
  padding: 15px;
  background-color: white;
  justify-content: space-around;
  margin-bottom: 30px;
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333;
  border-radius: 15px;
}
.cpu-body-left {
  /* flex: 0 1 auto; */
  padding: 10px;
}
.left-usage {
  padding: 10px;
}
.cpu-body-right {
  /* flex: 1 1 auto; */
  padding: 10px;
}
#cpuUsageChart {
  width: 750px;
  height: 310px;
  margin-bottom: 20px;
}
#eachCpuChart {
  width: 600px;
  height: 310px;
  margin-bottom: 20px;
}
.cpu-footer {
  /* width: 100%; */
  padding: 10px;
  background-color: white;
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}
.cpu-process-header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.cpu-process-header h3 {
  margin-right: 60px;
}
.el-table .ramused0-1 {
  background: "#ffffff";
}
.el-table .ramused1-10 {
  background: "#fff9e4";
}
.el-table .ramused10-50 {
  background: "#f9eca8";
}
.el-table .ramused50-100 {
  background: "#ffe487";
}
.el-table .ramused100-200 {
  background: "#ffd264";
}
.el-table .ramused200-300 {
  background: "#ff6c37";
}
.el-table .ramused300- {
  background: "#fc011a";
}
.el-table {
  font-size: 17px;
}
.usage-Chart-footer {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 25px;
}
.usage-Chart-footer > p {
  flex: 1;
  text-align: left;
  font-size: 15px;
  font-weight: 700;
}
</style>