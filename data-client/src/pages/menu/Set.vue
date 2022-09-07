<template>
  <div class="set-moudle">
    <div class="set-notice" v-if="loginStatus === 'root'">
      <h1>root测试登录无法使用设置页面</h1>
      <el-empty description="注册或已有账号登录以提供完整功能"></el-empty>
    </div>
    <div class="set-main" v-if="loginStatus === 'user'">
      <!-- <div class="set-header">
      <h3>设置</h3>
    </div> -->
      <div class="set-time">
        <div class="set-time-part">
          <h1>静态资源时序设置</h1>
          <h3>电脑信息/min</h3>
          <el-select
            v-model="selectTimeValue.hostTimeValue"
            placeholder="请选择"
            :name="selectID.host"
            @change="
              hostSelectChange(selectID.host, selectTimeValue.hostTimeValue)
            "
          >
            <el-option
              v-for="item in setTimeOption.hostoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.hostQueryTime"
              :step="1"
              :min="sliderTimeValue.hostMinTime"
              :max="sliderTimeValue.hostMaxTime"
              show-input
              id="host"
              :disabled="controlTimeSlider.showHostSlider"
              @change="hostSliderChange"
            >
            </el-slider>
          </div>
          <h3>网卡信息/min</h3>
          <el-select
            v-model="selectTimeValue.netTimeValue"
            placeholder="请选择"
            :name="selectID.net"
            @change="
              netSelectChange(selectID.net, selectTimeValue.netTimeValue)
            "
          >
            <el-option
              v-for="item in setTimeOption.netoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.netQueryTime"
              :step="1"
              :min="sliderTimeValue.netMinTime"
              :max="sliderTimeValue.netMaxTime"
              show-input
              :disabled="controlTimeSlider.showNetSlider"
              @change="netSliderChange"
            >
            </el-slider>
          </div>
          <h3>磁盘信息/min</h3>
          <el-select
            v-model="selectTimeValue.diskTimeValue"
            placeholder="请选择"
            :name="selectID.disk"
            @change="
              diskSelectChange(selectID.disk, selectTimeValue.diskTimeValue)
            "
          >
            <el-option
              v-for="item in setTimeOption.diskoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.diskQueryTime"
              :step="1"
              :min="sliderTimeValue.diskMinTime"
              :max="sliderTimeValue.diskMaxTime"
              show-input
              :disabled="controlTimeSlider.showDiskSlider"
              @change="diskSliderChange"
            >
            </el-slider>
          </div>
        </div>
        <div class="set-time-part">
          <!-- <el-button
            type="primary"
            @click="setModuleParams('setCpuParams', { a: 1 })"
            >主要按钮</el-button
          > -->
          <h1>cpu动态资源时序设置</h1>
          <h3>cpu查询频率/s</h3>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.cpuQueryTime"
              :step="1"
              :min="sliderTimeValue.cpuMinTime"
              :max="sliderTimeValue.cpuMaxTime"
              show-input
              @change="cpuUsageSliderChange"
            >
            </el-slider>
          </div>
          <h3>cpuToplist刷新频率/s</h3>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.cpuToplistQueryTime"
              :step="1"
              :min="sliderTimeValue.cpuToplistMinTime"
              :max="sliderTimeValue.cpuToplistMaxTime"
              show-input
              @change="cpuProcessSliderChange"
            >
            </el-slider>
          </div>
          <h3>cpuEach刷新频率/s</h3>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.cpuEachQueryTime"
              :step="1"
              :min="sliderTimeValue.cpuEachMinTime"
              :max="sliderTimeValue.cpuEachMaxTime"
              show-input
              @change="cpuEachSliderChange"
            >
            </el-slider>
          </div>
          <h3>cpu利用率导出时间/min</h3>
          <el-select
            v-model="selectTimeValue.cpuExportTimeValue"
            placeholder="请选择"
            :name="selectID.cpu"
            @change="
              cpuSelectChange(selectID.cpu, selectTimeValue.cpuExportTimeValue)
            "
          >
            <el-option
              v-for="item in setTimeOption.cpuoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.cpuExportSetTime"
              :step="1"
              :min="sliderTimeValue.cpuExportMinTime"
              :max="sliderTimeValue.cpuExportMaxTime"
              show-input
              :disabled="controlTimeSlider.showCpuSlider"
              @change="cpuExportSliderChange"
            >
            </el-slider>
          </div>
        </div>
        <div class="set-time-part">
          <h1>内存动态资源时序设置</h1>
          <h3>内存查询频率/s</h3>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.ramQueryTime"
              :step="1"
              :min="sliderTimeValue.ramMinTime"
              :max="sliderTimeValue.ramMaxTime"
              show-input
              @change="ramUsageSliderChange"
            >
            </el-slider>
          </div>

          <h3>内存利用率导出时间/min</h3>
          <el-select
            v-model="selectTimeValue.ramExportTimeValue"
            placeholder="请选择"
            :name="selectID.ram"
            @change="
              ramSelectChange(selectID.ram, selectTimeValue.ramExportTimeValue)
            "
          >
            <el-option
              v-for="item in setTimeOption.ramoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="set-time-slider">
            <el-slider
              v-model="sliderTimeValue.ramExportSetTime"
              :step="1"
              :min="sliderTimeValue.ramExportMinTime"
              :max="sliderTimeValue.ramExportMaxTime"
              show-input
              :disabled="controlTimeSlider.showRamSlider"
              @change="ramExportSliderChange"
            >
            </el-slider>
          </div>
        </div>
      </div>
      <div class="set-file">
        <el-button type="primary" @click="getFile">主要按钮</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import pubsub from "pubsub-js";
export default {
  name: "Set",
  data() {
    return {
      userinfo: {},
      moduleParams: {
        cpu: {},
        basic: {},
        mem: {},
        net: {},
      },
      loginStatus: "root",
      sliderTimeValue: {
        //host
        hostQueryTime: 0,
        hostMinTime: 1,
        hostMaxTime: 10,
        //net
        netQueryTime: 0,
        netMinTime: 1,
        netMaxTime: 10,
        //disk
        diskQueryTime: 0,
        diskMinTime: 1,
        diskMaxTime: 10,
        //cpu
        cpuQueryTime: 0,
        cpuMinTime: 1,
        cpuMaxTime: 10,
        cpuToplistQueryTime: 0,
        cpuToplistMinTime: 1,
        cpuToplistMaxTime: 10,
        cpuEachQueryTime: 0,

        cpuEachMinTime: 1,
        cpuEachMaxTime: 10,
        cpuExportSetTime: 0,
        cpuExportMinTime: 1,
        cpuExportMaxTime: 10,
        //内存
        ramQueryTime: 0,
        ramMinTime: 1,
        ramMaxTime: 10,
        ramExportSetTime: 0,
        ramExportMinTime: 1,
        ramExportMaxTime: 10,
      },
      selectTimeValue: {
        hostTimeValue: "",
        netTimeValue: "",
        diskTimeValue: "",
        ramExportTimeValue: "",
        cpuExportTimeValue: "",
      },
      selectID: {
        host: "host",
        net: "net",
        disk: "disk",
        ram: "ram",
        cpu: "cpu",
      },
      controlTimeSlider: {
        showHostSlider: true,
        showNetSlider: true,
        showDiskSlider: true,
        showCpuSlider: true,
        showRamSlider: true,
      },
      setTimeOption: {
        hostoptions: [
          {
            value: "op1",
            label: "3min",
          },
          {
            value: "op2",
            label: "5min",
          },
          {
            value: "op3",
            label: "7min",
          },
          {
            value: "self_host",
            label: "自定义",
          },
        ],
        netoptions: [
          {
            value: "op1",
            label: "3min",
          },
          {
            value: "op2",
            label: "5min",
          },
          {
            value: "op3",
            label: "7min",
          },
          {
            value: "self_net",
            label: "自定义",
          },
        ],
        diskoptions: [
          {
            value: "op1",
            label: "3min",
          },
          {
            value: "op2",
            label: "5min",
          },
          {
            value: "op3",
            label: "7min",
          },
          {
            value: "self_disk",
            label: "自定义",
          },
        ],
        cpuoptions: [
          {
            value: "op1",
            label: "1min",
          },
          {
            value: "op2",
            label: "2min",
          },
          {
            value: "op3",
            label: "3min",
          },
          {
            value: "self_cpu",
            label: "自定义",
          },
        ],
        ramoptions: [
          {
            value: "op1",
            label: "1min",
          },
          {
            value: "op2",
            label: "2min",
          },
          {
            value: "op3",
            label: "3min",
          },
          {
            value: "self_ram",
            label: "自定义",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.loginStatus = sessionStorage.getItem("loginStatus");

    // console.log("loginstatus", this.loginStatus);
    // console.log("set接收参数");
    // this.$bus.$on("set_getMoudleParams", this.set_getMoudleParams);
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    this.set_getlocalStorgeParams();
  },
  mounted() {},
  activated() {
    this.syncDataWithParams();
    // console.log("获取消息");
    // pubsub.subscribe("username_set", (msgName, data) => {
    //   console.log("订阅username", msgName, data);
    //   this.username = data;
    //   console.log("username in set", this.username);
    // });
  },
  deactivated() {},
  watch: {
    handleSelectValue: {
      deep: true,
      handler(newVal) {
        // console.log(newVal);
        if (newVal.hostTimeValue === "self_host") {
          this.controlTimeSlider.showHostSlider = false;
        } else {
          this.controlTimeSlider.showHostSlider = true;
        }
        if (newVal.netTimeValue === "self_net") {
          this.controlTimeSlider.showNetSlider = false;
        } else {
          this.controlTimeSlider.showNetSlider = true;
        }
        if (newVal.diskTimeValue === "self_disk") {
          this.controlTimeSlider.showDiskSlider = false;
        } else {
          this.controlTimeSlider.showDiskSlider = true;
        }
        if (newVal.cpuExportTimeValue === "self_cpu") {
          this.controlTimeSlider.showCpuSlider = false;
        } else {
          this.controlTimeSlider.showCpuSlider = true;
        }
        if (newVal.ramExportTimeValue === "self_ram") {
          this.controlTimeSlider.showRamSlider = false;
        } else {
          this.controlTimeSlider.showRamSlider = true;
        }
      },
    },
  },
  computed: {
    handleSelectValue() {
      return this.selectTimeValue;
    },
    // getHostTimeValue() {
    //   return this.selectTimeValue.hostTimeValue;
    // },
    // getNetTimeValue() {
    //   return this.selectTimeValue.netTimeValue;
    // },
    // getDiskTimeValue() {
    //   return this.selectTimeValue.diskTimeValue;
    // },
    // getRamExportTimeValue() {
    //   return this.selectTimeValue.ramExportTimeValue;
    // },
    // getCpuExportTimeValue() {
    //   return this.selectTimeValue.cpuExportTimeValue;
    // },
  },
  methods: {
    getFile() {
      var inputObj = document.createElement("input");
      inputObj.setAttribute("id", "_ef");
      inputObj.setAttribute("type", "file");
      inputObj.setAttribute("style", "visibility:hidden");
      document.body.appendChild(inputObj);
      inputObj.click();
      inputObj.value;
      // alert(inputObj.value);
    },
    getFloder(path) {
      {
        /*
         * 该方法只支持IE.
         * 语法：strDir=Shell.BrowseForFolder(Hwnd,Title,Options,[RootFolder])
         * 参数：Hwnd：包含对话框的窗体句柄（handle），一般设置为0
         * Title：将在对话框中显示的说明，为字符串
         * Options：使用对话框的特殊方式，为长整数，一般设置为0
         * RootFolder：（可选的），用来设置浏览的最顶层文件夹，缺省时为“桌面”，可以将其设置为一个路径或“特殊文件夹常数”
         * */
        try {
          let filePath;
          let objSrc = new ActiveXObject("Shell.Application").BrowseForFolder(
            0,
            "请选择保存路径",
            0,
            ""
          );
          if (objSrc != null) {
            filePath = objSrc.Items().Item().Path;
            if (filePath.charAt(0) == ":") {
              alert("请选择文件夹.");
              return false;
            }
            this.form[path] = filePath;
          }
        } catch (e) {
          alert(
            e +
              "请设置IE，Internet选项－安全－自定义级别－将ActiveX控件和插件前3个选项设置为启用，然后再尝试。"
          );
          return false;
        }
      }
    },
    setModuleParams(emitMethodName, paramobj) {
      // const param = {
      //   modulename: modulename,
      //   partname: partname,
      //   paramobj: paramobj,
      // };
      this.$bus.$emit(emitMethodName, paramobj);
      console.log("发送数据到" + emitMethodName, paramobj);
    },
    //获取各个模块参数
    set_getMoudleParams(name, paramobj) {
      console.log(name, paramobj);
      switch (name) {
        case "basic":
          this.moduleParams.basic = paramobj;
          break;
        case "cpu":
          this.moduleParams.cpu = paramobj;
          break;
        case "mem":
          this.moduleParams.mem = paramobj;
          break;
        case "net":
          this.moduleParams.net = paramobj;
          break;
        default:
          break;
      }
    },
    //设置模块获取localStorge参数
    set_getlocalStorgeParams() {
      const username = this.userinfo.username;

      // console.log(username, localStorage.getItem("params_basic_" + username));
      //发布初始化消息到四个路由组件
      const basic_params =
        localStorage.getItem("params_basic_" + username) === null
          ? this.$params.basic_default
          : JSON.parse(localStorage.getItem("params_basic_" + username));
      const cpu_params =
        localStorage.getItem("params_cpu_" + username) === null
          ? this.$params.cpu_default
          : JSON.parse(localStorage.getItem("params_cpu_" + username));
      const mem_params =
        localStorage.getItem("params_mem_" + username) === null
          ? this.$params.mem_default
          : JSON.parse(localStorage.getItem("params_mem_" + username));
      const net_params =
        localStorage.getItem("params_net_" + username) === null
          ? this.$params.net_default
          : JSON.parse(localStorage.getItem("params_net_" + username));

      this.moduleParams.basic = basic_params;
      this.moduleParams.cpu = cpu_params;
      this.moduleParams.mem = mem_params;
      this.moduleParams.net = net_params;
      // console.log("beforemounted", mem_params);
    },
    syncDataWithParams() {
      const { cpu, basic, mem, net } = this.moduleParams;
      //滑块
      this.sliderTimeValue.hostQueryTime = this.$convert.secToTimeStr(
        basic.timer.hostInfo
      ).time_num;
      this.sliderTimeValue.netQueryTime = this.$convert.secToTimeStr(
        net.timer.netInfo
      ).time_num;
      this.sliderTimeValue.diskQueryTime = this.$convert.secToTimeStr(
        mem.timer.diskInfo
      ).time_num;
      this.sliderTimeValue.cpuExportSetTime = this.$convert.secToTimeStr(
        cpu.timer.cpuUsageSave
      ).time_num;
      this.sliderTimeValue.ramExportSetTime = this.$convert.secToTimeStr(
        mem.timer.ramUsageSave
      ).time_num;

      this.sliderTimeValue.cpuQueryTime = this.$convert.secToTimeStr(
        cpu.timer.cpuUsageQuery
      ).time_num;
      this.sliderTimeValue.cpuToplistQueryTime = this.$convert.secToTimeStr(
        cpu.timer.cpuProcessQuery
      ).time_num;
      this.sliderTimeValue.cpuEachQueryTime = this.$convert.secToTimeStr(
        cpu.timer.cpuEachQuery
      ).time_num;
      this.sliderTimeValue.ramQueryTime = this.$convert.secToTimeStr(
        mem.timer.ramUsageQuery
      ).time_num;

      //select框
      this.selectTimeValue.hostTimeValue = this.$convert.secToTimeStr(
        basic.timer.hostInfo
      ).time_str;
      this.selectTimeValue.netTimeValue = this.$convert.secToTimeStr(
        net.timer.netInfo
      ).time_str;
      this.selectTimeValue.diskTimeValue = this.$convert.secToTimeStr(
        mem.timer.diskInfo
      ).time_str;
      this.selectTimeValue.cpuExportTimeValue = this.$convert.secToTimeStr(
        cpu.timer.cpuUsageSave
      ).time_str;
      this.selectTimeValue.ramExportTimeValue = this.$convert.secToTimeStr(
        mem.timer.ramUsageSave
      ).time_str;
    },
    // selectChange(id, newVal) {
    //   console.log("进入回调", id, newVal);
    // },
    //根据select选择器回调value值返回对应option对象数组
    getOptionLableByValue(optionname, value) {
      let option = [];
      switch (optionname) {
        case "host":
          option = this.setTimeOption.hostoptions;
          break;
        case "disk":
          option = this.setTimeOption.diskoptions;
          break;
        case "net":
          option = this.setTimeOption.netoptions;
          break;
        case "cpu":
          option = this.setTimeOption.cpuoptions;
          break;
        case "ram":
          option = this.setTimeOption.ramoptions;
          break;
      }

      let timeoption = option.filter((item) => {
        if (item.value === value) {
          return true;
        }
        return false;
      });
      return timeoption;
    },
    //更新localStorge
    updateLocalStorge(itemname, paramobj) {
      localStorage.setItem(itemname, JSON.stringify(paramobj));
    },
    //成功提示
    successTip() {
      this.$message({
        message: "设置成功",
        type: "success",
        duration: 1700,
      });
    },
    //select回调方法
    hostSelectChange(id, newVal) {
      console.log("进入回调host", id, newVal);
      if (newVal === "self_host") {
        return;
      }
      let timeobj = this.getOptionLableByValue("host", newVal);
      // console.log(timeobj);
      const timetemp = this.$convert.timeStrToSec(timeobj[0].label);
      if (timetemp === 0) {
        return;
      }
      this.moduleParams.basic.timer.hostInfo = timetemp;
      // console.log(this.moduleParams.basic.timer.computer);
      //将修改后参数写入localStorge
      const username = this.userinfo.username;
      this.updateLocalStorge(
        "params_basic_" + username,
        this.moduleParams.basic
      );
      this.successTip();
    },
    diskSelectChange(id, newVal) {
      console.log("进入回调disk", id, newVal);
      if (newVal === "self_disk") {
        return;
      }
      let timeobj = this.getOptionLableByValue("disk", newVal);
      // console.log(timeobj);
      const timetemp = this.$convert.timeStrToSec(timeobj[0].label);
      if (timetemp === 0) {
        return;
      }
      this.moduleParams.mem.timer.diskInfo = timetemp;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_mem_" + username, this.moduleParams.mem);
      this.successTip();
    },
    netSelectChange(id, newVal) {
      console.log("进入回调net", id, newVal);
      if (newVal === "self_net") {
        return;
      }
      let timeobj = this.getOptionLableByValue("net", newVal);
      // console.log(timeobj);
      const timetemp = this.$convert.timeStrToSec(timeobj[0].label);
      if (timetemp === 0) {
        return;
      }
      this.moduleParams.net.timer.netInfo = timetemp;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_net_" + username, this.moduleParams.net);
      this.successTip();
    },
    cpuSelectChange(id, newVal) {
      console.log("进入回调cpu", id, newVal);
      if (newVal === "self_cpu") {
        return;
      }
      let timeobj = this.getOptionLableByValue("cpu", newVal);
      // console.log(timeobj);
      const timetemp = this.$convert.timeStrToSec(timeobj[0].label);
      if (timetemp === 0) {
        return;
      }
      this.moduleParams.cpu.timer.cpuUsageSave = timeobj;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_cpu_" + username, this.moduleParams.cpu);
      this.successTip();
    },
    ramSelectChange(id, newVal) {
      console.log("进入回调ram", id, newVal);
      if (newVal === "self_ram") {
        return;
      }
      let timeobj = this.getOptionLableByValue("ram", newVal);
      // console.log(timeobj);
      const timetemp = this.$convert.timeStrToSec(timeobj[0].label);
      if (timetemp === 0) {
        return;
      }
      this.moduleParams.mem.timer.ramUsageSave = timetemp;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_mem_" + username, this.moduleParams.mem);
      this.successTip();
    },
    //slider回调方法
    hostSliderChange(newValue) {
      //min
      const sec = newValue * 60 * 1000;
      this.moduleParams.basic.timer.hostInfo = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge(
        "params_basic_" + username,
        this.moduleParams.basic
      );
      // console.log(newValue);
      this.successTip();
    },
    diskSliderChange(newValue) {
      //min
      const sec = newValue * 60 * 1000;
      this.moduleParams.mem.timer.diskInfo = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_mem_" + username, this.moduleParams.mem);
      // console.log(newValue);
      this.successTip();
    },
    netSliderChange(newValue) {
      //min
      const sec = newValue * 60 * 1000;
      this.moduleParams.net.timer.netInfo = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_net_" + username, this.moduleParams.net);
      this.successTip();
    },
    cpuUsageSliderChange(newValue) {
      //s
      const sec = newValue * 1000;
      this.moduleParams.cpu.timer.cpuUsageQuery = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_cpu_" + username, this.moduleParams.cpu);
      this.successTip();
    },
    cpuProcessSliderChange(newValue) {
      //s
      const sec = newValue * 1000;
      this.moduleParams.cpu.timer.cpuProcessQuery = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_cpu_" + username, this.moduleParams.cpu);
      this.successTip();
    },
    cpuEachSliderChange(newValue) {
      //s
      const sec = newValue * 1000;
      this.moduleParams.cpu.timer.cpuEachQuery = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_cpu_" + username, this.moduleParams.cpu);
      this.successTip();
    },
    cpuExportSliderChange(newValue) {
      //s
      const sec = newValue * 1000;
      this.moduleParams.cpu.timer.cpuUsageSave = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_cpu_" + username, this.moduleParams.cpu);
      this.successTip();
    },
    ramUsageSliderChange(newValue) {
      //s
      const sec = newValue * 1000;
      this.moduleParams.mem.timer.ramUsageQuery = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_mem_" + username, this.moduleParams.mem);
      this.successTip();
    },
    ramExportSliderChange(newValue) {
      //min
      const sec = newValue * 60 * 1000;
      this.moduleParams.mem.timer.ramUsageSave = sec;
      const username = this.userinfo.username;
      this.updateLocalStorge("params_mem_" + username, this.moduleParams.mem);
      this.successTip();
    },
  },
};
</script>

<style>
.set-main {
  display: flex;
  flex-direction: column;
  padding: 30px;
  /* border: 1px solid black; */
}
.set-main > div {
  margin-bottom: 30px;
}
.set-header {
  height: 100px;
  /* border: 1px solid salmon; */
}
.set-time {
  padding: 20px 450px 20px 100px;

  display: flex;
  flex-direction: column;
  /* justify-content: space-around;  */
  align-items: center;
}
.set-time h3 {
  text-align: left;
}
.set-time h1 {
  text-align: center;
  margin-bottom: 50px;
}
.set-file {
  padding: 20px;
  border: 1px solid green;
}

.set-time-slider {
  width: 600px;
}
.set-time-part {
  background-color: white;
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333;
  margin-bottom: 55px;
  border-radius: 15px;
  padding: 50px;
}
</style>