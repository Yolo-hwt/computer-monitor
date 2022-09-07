<template>
  <div class="mem-container">
    <div class="mem-header">
      <!-- 内存 -->
      <div class="header-internal">
        <div class="header-inter-usage" id="internalFrame"></div>
        <div class="header-inter-info">
          <div
            class="inter-info-item"
            v-for="(item, index) in internal.ramInfo"
            :key="index"
          >
            <h1>{{ index }}</h1>
            <p>{{ $convert.dealMem(item) }}</p>
          </div>
        </div>
      </div>
      <!-- 外存 -->
      <div class="header-external">
        <div class="header-exter-usage" id="externalFrame"></div>
        <div class="header-exter-info">
          <div
            class="exter-info-item"
            v-for="(item, index) in totalDiskInfo"
            :key="index"
          >
            <h1 v-if="index !== 'usage'">{{ index }}</h1>
            <p v-if="index !== 'usage'">{{ $convert.dealMem(item) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mem-body">
      <div>
        <div class="mem-body-left" id="interUsageChart"></div>
        <div class="usage-chart-footer">
          <p>
            当前导出时间设置为：{{
              this.$convert.secToTimeStr(mem_default.timer.ramUsageSave)
                .time_str
            }}
          </p>

          <div>
            <el-button type="primary" round icon="el-icon-download"></el-button>
            <el-button type="danger" round icon="el-icon-delete"></el-button>
          </div>
        </div>
      </div>
      <div class="mem-body-right" id="exterInfoChart">
        <div
          class="mem-each-disk"
          v-for="(disk, index) in external.diskInfo"
          :key="index"
        >
          <div class="each-disk-img"><img src="disk2.png" alt="" /></div>
          <div class="each-disk-usage">
            <div class="each-disk-info">
              <h3>{{ "磁盘 " + disk.mounted }}</h3>
              <p>
                {{
                  `${$convert.dealMem(disk.used)}\\${$convert.dealMem(
                    disk.blocks
                  )}`
                }}
              </p>
            </div>
            <div class="usage-progress">
              <el-progress
                :text-inside="true"
                :stroke-width="26"
                :percentage="disk.capacity || 70"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mem",
  data() {
    return {
      userinfo: {},
      initParamStatus: false,
      mem_default: {},
      requestOption: {
        baseUrl: "http://127.0.0.1:3000/api/diskInfo/",
        inter: "mem",
        exter: "disks",
      },
      internal: {
        //内存
        timer: null,
        timeout: 2000,
        ramInfo: {
          totalMem: 0,
          freeMem: 0,
        },
      },
      external: {
        //外存
        timer: null,
        timeout: 60000, //1min
        diskInfo: [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }],
      },
      //内存利用率仪表盘
      internalUsageFrame: {
        timer: null,
        timeout: 2000,
        titleText: "RAM",
        textColor: "black",
        backgroundColor: "white",
        usageData: [31],
        offset_0_Color: "#16CEB9",
        offset_1_Color: "#6648FF",
      },
      externalUsageFrame: {
        usageData: [31],
        waveData: [0.31, 0.21, 0.11],
        backgroundColor: "#e9eef3",
      },
      interUsageChart: {
        timer: null,
        totalUsage: [31, 31, 31, 31, 31, 31, 31],
        yAxisChart: ["", "", "", "", "", "", ""],
      },
    };
  },
  beforeMount() {
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    // this.getCpuInitParams();
  },
  mounted() {
    this.getExternalInfo();
    // this.$nextTick(() => {
    //   this.getMemInitParams();
    // });
  },
  activated() {
    // console.log("Mem组件激活");
    this.getMemInitParams();

    this.initData();
    this.initChart();

    // this.getInternalInfo();
  },
  deactivated() {
    // console.log("Mem组件失活");
    this.clearAllTimer();
  },
  watch: {
    //开启深度监听 只要对象中任何一个属性变化 都会触发'对象的侦听器'
    ramUsage(newVal, oldVal) {
      // console.log(newVal);
      //重绘echarts
      this.initInternalUsageFrame();
      this.initInterUsageChart();
    },

    totalDiskInfo(newVal) {
      // console.log(newVal);
      //重绘echarts
      const exterusage = this.totalDiskInfo.usage;
      this.externalUsageFrame.usageData = [exterusage * 100];
      this.externalUsageFrame.waveData = [
        exterusage,
        exterusage - 0.1,
        exterusage - 0.2,
      ];
      this.initExternalUsageFrame();
    },
  },
  computed: {
    //统计总外存信息
    totalDiskInfo() {
      let totalobj = {
        blocks: 0,
        used: 0,
        available: 0,
        usage: 0,
      };
      if (this.external.diskInfo[0].a) {
        return totalobj;
      }
      this.external.diskInfo.forEach((disk) => {
        totalobj.blocks += disk.blocks;
        totalobj.used += disk.used;
        totalobj.available += disk.available;
        totalobj.usage = (totalobj.used / totalobj.blocks).toFixed(2);
      });
      return totalobj;
    },
    freeRamMem() {
      return this.internal.ramInfo.freeMem;
    },
    ramUsage() {
      if (this.internal.ramInfo.totalMem === 0) {
        return [31];
      }
      const ram = this.internal.ramInfo;
      let usage = ((1 - ram.freeMem / ram.totalMem) * 100).toFixed(2);
      this.internalUsageFrame.usageData = [usage];
      this.interUsageChart.yAxisChart.push("");
      this.interUsageChart.totalUsage.push(usage);
      // console.log("usage:", this.interUsageChart.totalUsage);
      return [usage];
    },
  },
  methods: {
    getMemInitParams() {
      const username = this.userinfo.username;
      // this.mem_default = this.$params.mem_default;
      this.mem_default =
        localStorage.getItem("params_mem_" + username) === null
          ? this.$params.mem_default
          : JSON.parse(localStorage.getItem("params_mem_" + username));
      this.initParamStatus = true;
      // console.log(this.mem_default);
      // this.defalultParams = this.$pub.subscribe(
      //     "mem_default",
      //     (msgName, data) => {
      //       console.log("mem", this.defalultParams);
      //     }
      //   );
    },

    initData() {
      this.getInternalInfo();
      this.getExternalInfo();
    },
    initChart() {
      this.initInternalUsageFrame();
      this.initExternalUsageFrame();
      this.initInterUsageChart();
      this.$nextTick(function () {
        this.$jq(".el-progress-bar__outer").css({
          backgroundColor: "#dee2e7",
        });
      });
    },
    //获取内存信息
    getInternalInfo() {
      this.internal.timer = setInterval(() => {
        this.$req
          .requestLocalData(
            this.requestOption.baseUrl,
            this.requestOption.inter
          )
          .then((data) => {
            this.internal.ramInfo = data[0];
          });
      }, this.mem_default.timer.ramUsageQuery);
    },
    //获取外存信息
    getExternalInfo() {
      this.$req
        .requestLocalData(this.requestOption.baseUrl, this.requestOption.exter)
        .then((data) => {
          // console.log("exterInfo", data);
          this.external.diskInfo = data;
        });
    },
    //清除所有计时器
    clearAllTimer() {
      clearInterval(this.internal.timer);
    },
    //初始化内存利用率仪表盘
    initInternalUsageFrame() {
      var internalFrame = this.$echarts.init(
        document.getElementById("internalFrame")
      );
      let option = {
        title: [
          {
            text: this.internalUsageFrame.titleText,
            x: "center",
            top: "58%",
            textStyle: {
              color: this.internalUsageFrame.textColor, //文字颜色
              fontSize: 14,
              fontWeight: "100",
            },
          },
          {
            text: this.ramUsage + "%",
            x: "center",
            y: "center",
            textStyle: {
              fontSize: 30,
              color: this.internalUsageFrame.textColor, //文字颜色
              fontFamily: "DINAlternate-Bold, DINAlternate",
              foontWeight: "600",
            },
          },
        ],
        backgroundColor: this.internalUsageFrame.backgroundColor,
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
            data: this.ramUsage,
            coordinateSystem: "polar",
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: this.internalUsageFrame.offset_0_Color,
                  },
                  {
                    offset: 1,
                    color: this.internalUsageFrame.offset_1_Color,
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
      internalFrame.setOption(option);
    },
    //初始化磁盘总利用率水球图
    initExternalUsageFrame() {
      var externalFrame = this.$echarts.init(
        document.getElementById("externalFrame")
      );
      var currentData = this.externalUsageFrame.usageData;

      let option = {
        backgroundColor: this.externalUsageFrame.backgroundColor,
        title: {
          text: "DISK",
          textStyle: {
            fontSize: 20,
            fontFamily: "Microsoft Yahei",
            fontWeight: "normal",
            color: "#bcb8fb",
            rich: {
              a: {
                fontSize: 28,
              },
            },
          },
          x: "center",
          y: "65%",
        },
        series: [
          {
            type: "liquidFill",
            // radius: "80%",
            name: "external usage",
            data: this.externalUsageFrame.waveData,
            backgroundStyle: {
              color: this.externalUsageFrame.backgroundColor,
            },
            shape: "container",
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 10,
                borderColor: "#156ACF",
              },
            },
            tooltip: {
              show: true,
            },
            color: ["#420BFF", "#18C5FE", "#824DE1"],

            label: {
              normal: {
                formatter: currentData + "%",
              },
            },
          },
        ],
      };
      externalFrame.setOption(option);
    },
    //初始化内存利用率表格
    initInterUsageChart() {
      let that = this;
      var interUsageChart = this.$echarts.init(
        document.getElementById("interUsageChart")
      );
      let option = {
        title: {
          text:
            "Ram usage freq: " +
              this.$convert.secToTimeStr(this.mem_default.timer.ramUsageQuery)
                .time_str || "1s",
          left: "10%",
          top: "7%",
        },
        grid: {
          left: "7%",
          top: "20%",

          width: "80%",
          height: "70%",
        },
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
            return "ram usage\n" + params[0].value + "%";
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
            this.$convert.secToTimeStr(this.mem_default.timer.ramUsageQuery)
              .time_str || "1s",
          type: "category",
          show: true,
          data: this.interUsageChart.yAxisChart,
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
            data: this.interUsageChart.totalUsage,
            type: "line",
            symbol: "none",
          },
        ],
      };

      option && interUsageChart.setOption(option);
    },
  },
};
</script>

<style>
.mem-header {
  display: flex;
  height: 200px;
  padding: 10px;
  margin-bottom: 30px;
  /* background-color: white;
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333; */
  justify-content: space-around;
}
.header-internal {
  background-color: white;
  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: 1px 1px 5px #333;
  display: flex;
}
.header-inter-usage {
  width: 200px;
}
.header-inter-info {
  box-sizing: border-box;
  padding: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.inter-info-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-external {
  background-color: white;
  border-radius: 15px;
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333;
  display: flex;
}
.header-exter-usage {
  width: 200px;
  padding: 10px 16px 10px 16px;
  box-sizing: border-box;
}
.header-exter-info {
  box-sizing: border-box;
  padding: 20px;

  line-height: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.exter-info-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
.mem-body {
  display: flex;
  padding: 20px;
  justify-content: space-around;
  background-color: white;
  border-radius: 15px;
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333;
}
.mem-body-left {
  width: 700px;
  height: 360px;
  margin-bottom: 20px;
}
.mem-body-right {
  width: 700px;
  height: 400px;
  padding: 15px;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.mem-each-disk {
  width: 300px;
  height: 100px;

  display: flex;
}
.each-disk-img {
  width: 100px;
}
.each-disk-img img {
  width: 100%;
  height: 100%;
}
.each-disk-usage {
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.each-disk-info {
  width: 200px;
  height: 60px;
  line-height: 5px;
}
.usage-progress {
  width: 180px;
}
.usage-chart-footer {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 25px;
}
.usage-chart-footer > p {
  flex: 1;
  text-align: left;
  font-size: 15px;
  font-weight: 700;
}
</style>