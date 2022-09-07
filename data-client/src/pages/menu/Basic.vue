<template>
  <div>
    <div class="header">
      <div class="header-oslogo"><img src="windows.png" alt="#" /></div>
      <div class="header-selfinfo">
        <h1>主机名：{{ basicInfo.hostName }}</h1>
        <!-- <h1>用户名：{{ basicInfo.userInfo.username }}</h1> -->
        <h1>用户名：hwt</h1>
        <p>开机时间：{{ this.$convert.dealTime(upTimeControl.saveUpTime) }}</p>
      </div>
    </div>
    <div class="main">
      <div class="main-left">
        <h1>windows系统信息</h1>
        <div class="main-left-item">
          <h3>os平台</h3>
          <p>{{ basicInfo.platForm }}</p>
        </div>
        <div class="main-left-item">
          <h3>os内核</h3>
          <p>{{ basicInfo.type }}</p>
        </div>
        <div class="main-left-item">
          <h3>os版本</h3>
          <p>{{ basicInfo.version }}</p>
        </div>
        <div class="main-left-item">
          <h3>os内部版本</h3>
          <p>{{ basicInfo.release }}</p>
        </div>
        <h1>cpu基本信息</h1>
        <div class="main-left-item">
          <h3>cpu架构</h3>
          <p>{{ cpuInfo.arch }}</p>
        </div>
        <div class="main-left-item">
          <h3>cpu型号</h3>
          <p>{{ cpuInfo.model }}</p>
        </div>
        <div class="main-left-item">
          <h3>逻辑处理器数目</h3>
          <p>{{ cpuInfo.nums }}</p>
        </div>
        <div class="main-left-item">
          <h3>cpu频率</h3>
          <p>{{ cpuInfo.freq + "Mhz" }}</p>
        </div>
      </div>
      <div class="main-right">
        <h1>主机设备信息</h1>
        <div class="main-left-item">
          <h3>cpu架构</h3>
          <p>{{ basicInfo.arch }}</p>
        </div>
        <div class="main-left-item">
          <h3>cpu字节序</h3>
          <p>{{ basicInfo.endianness }}</p>
        </div>
        <div class="main-left-item">
          <h3>基带RAM</h3>
          <p>{{ this.$convert.dealMem(memInfo.totalMem) }}</p>
        </div>
        <h1>磁盘信息</h1>
        <div class="main-left-item">
          <h3>磁盘分区</h3>
          <p>{{ diskInfo.length }}</p>
        </div>
        <div class="main-left-item">
          <h3>磁盘总量</h3>
          <p>{{ $convert.dealMem(totalDiskInfo.blocks) }}</p>
        </div>
        <div class="main-left-item">
          <h3>磁盘已用</h3>
          <p>{{ $convert.dealMem(totalDiskInfo.used) }}</p>
        </div>
        <div class="main-left-item">
          <h3>磁盘可用</h3>
          <p>{{ $convert.dealMem(totalDiskInfo.available) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pubsub from "pubsub-js";
export default {
  name: "Basic",
  data() {
    return {
      cpuInfo: {
        model: "Intel(R) Core(TM) i5-9300H CPU @ 2.40GHz",
        arch: "x64",
        nums: 8,
        freq: 2400,
      },
      diskInfo: [{ a: 1 }],
      userinfo: {},
      initParamStatus: false,
      basic_default: {},
      basic_timer: null,
      requestOption: {
        baseUrl: "http://127.0.0.1:3000/api/basicInfo/",
        os: "os",
        mem: "mem",
        cpuRequest: {
          baseUrl: "http://127.0.0.1:3000/api/cpuInfo/",
          basic: "basic",
        },
        memRequest: {
          memBaseUrl: "http://127.0.0.1:3000/api/diskInfo/",
          exter: "disks",
        },
      },
      upTimeControl: {
        saveUpTime: null,
        isPersist: true,
        upTimeTimer: null,
      },

      basicInfo: {
        userInfo: {
          username: "主机信息加载中",
        },
      },
      memInfo: "存储信息加载中",
    };
  },
  beforeMount() {
    // console.log(this.basic_default);
    // this.$nextTick(() => {
    //   console.log("发送数据到set");
    //   this.$bus.$emit("set_getMoudleParams", "basic", this.basic_default);
    // });
    //初始化成功置标识为true
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    // console.log("basic", this.userinfo);
    this.getBasicInitParams();
  },
  activated() {
    // this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    clearInterval(this.upTimeControl.upTimeTimer);
    this.persistUptime();
    this.getBasicInitParams();
    this.initData();
  },
  deactivated() {
    // clearInterval(this.basic_timer);
    // clearInterval(this.upTimeControl.upTimeTimer);
  },
  mounted() {
    // console.log(this.basic_default);
    // this.initData();
  },
  methods: {
    //获取cpu基本信息
    getCpuBasicInfo() {
      this.$req
        .requestLocalData(
          this.requestOption.cpuRequest.baseUrl,
          this.requestOption.cpuRequest.basic
        )
        .then((basicinfo) => {
          this.cpuInfo = basicinfo;
        });
    },
    //获取外存信息
    getExternalInfo() {
      this.$req
        .requestLocalData(
          this.requestOption.memRequest.memBaseUrl,
          this.requestOption.memRequest.exter
        )
        .then((data) => {
          // console.log("exterInfo", data);
          this.diskInfo = data;
        });
    },
    getBasicInitParams() {
      // pubsub.subscribe("basic_default", (msgName, data) => {
      //   console.log("basic", msgName, data);
      //   this.basic_default = data;
      //   console.log("this.d", this.basic_default);
      // });
      const username = this.userinfo.username;
      this.basic_default =
        localStorage.getItem("params_basic_" + username) === null
          ? this.$params.basic_default
          : JSON.parse(localStorage.getItem("params_basic_" + username));
      // console.log(this.basic_default);
    },
    initData() {
      // console.log(this.basic_default);
      // var that = this;
      // this.basic_timer = setInterval(() => {
      this.$req
        .requestLocalData(this.requestOption.baseUrl, this.requestOption.os)
        .then((data) => {
          this.basicInfo = data[0];
          this.upTimeControl.saveUpTime = this.basicInfo.upTime;

          console.log(this.basicInfo);
        });
      this.$req
        .requestLocalData(this.requestOption.baseUrl, this.requestOption.mem)
        .then((data) => {
          this.memInfo = data[0];
          console.log(this.memInfo);
        });
      this.getCpuBasicInfo();
      this.getExternalInfo();
      // }, this.basic_default.timer.hostInfo);
      //持续更新开机时间
    },
    //无限循环更新开机时间
    persistUptime() {
      this.upTimeControl.upTimeTimer = setInterval(() => {
        this.upTimeControl.saveUpTime++;
      }, 1000);
    },
  },
  computed: {
    totalDiskInfo() {
      let totalobj = {
        blocks: 0,
        used: 0,
        available: 0,
        usage: 0,
      };
      if (this.diskInfo[0].a) {
        return totalobj;
      }
      this.diskInfo.forEach((disk) => {
        totalobj.blocks += disk.blocks;
        totalobj.used += disk.used;
        totalobj.available += disk.available;
        totalobj.usage = (totalobj.used / totalobj.blocks).toFixed(2);
      });
      return totalobj;
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  /* height: 120px; */
  line-height: 10px;
  margin-bottom: 30px;
  /* background-color: #e4e7ed; */
  /* justify-content: center; */
}
.header-oslogo {
  width: 100px;
  height: 100px;
}
.header-oslogo img {
  width: 100%;
  height: 100%;
}
.header-selfinfo {
  /* flex: 2 1 auto; */
  width: 400px;
  margin-left: 30px;
  text-align: left;
}
.main {
  display: flex;
  padding: 10px;
  /* border: 2px solid #fff;
  box-shadow: 1px 1px 5px #333; */
  padding-left: 100px;
}
.main-left {
  border: 2px solid #fff;
  box-shadow: 1px 1px 10px #333;
  border-radius: 20px;
  /* flex: 1 1 auto; */
  padding: 20px;
  margin-right: 140px;
  text-align: left;
  background-color: #ffffff;
}
.main-right {
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333;
  border-radius: 15px;
  /* flex: 1 1 auto; */
  padding: 20px;
  text-align: left;
  background-color: #ffffff;
}
.main-left-item {
  display: flex;
  align-items: center;
  line-height: 1px;
}
.main-left-item h3 {
  width: 200px;
}
</style>