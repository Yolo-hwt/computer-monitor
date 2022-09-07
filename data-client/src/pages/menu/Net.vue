<template>
  <div class="net-main">
    <div class="net-header">
      <h3>网卡信息</h3>
    </div>
    <div class="net-body">
      <div
        class="net-item-menu"
        v-for="(netItem, index) in netInfo"
        :key="index"
      >
        <div class="net-item" v-for="(item, idx) in netItem" :key="idx">
          <h3>{{ englishTranslateToChinese(idx) }}</h3>
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Net",
  data() {
    return {
      userinfo: {},
      initParamStatus: false,
      net_default: {},
      requestOption: {
        baseUrl: "http://127.0.0.1:3000/api/netInfo/",
        network: "network",
      },
      netInfo: [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }],
    };
  },
  beforeMount() {
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    // this.getNetInitParams();
  },
  mounted() {
    // this.getNetWorkInfo();
    // this.$nextTick(() => {
    //this.getNetInitParams()
    // });
  },
  activated() {
    this.getNetInitParams();
    this.getNetWorkInfo();
  },
  methods: {
    getNetInitParams() {
      // this.defalultParams = this.$pub.subscribe(
      //   "net_default",
      //   (msgName, data) => {
      //     console.log("net", this.defalultParams);
      //   }
      // );

      // this.net_default = this.$params.net_default;
      const username = this.userinfo.username;
      this.net_default =
        localStorage.getItem("params_net_" + username) === null
          ? this.$params.net_default
          : JSON.parse(localStorage.getItem("params_net_" + username));
    },
    //获取网卡信息
    getNetWorkInfo() {
      this.$req
        .requestLocalData(
          this.requestOption.baseUrl,
          this.requestOption.network
        )
        .then((data) => {
          // console.log("netinfo", data);
          this.netInfo = data;
        });
    },
    englishTranslateToChinese(networkname) {
      switch (networkname) {
        case "netWorkName": {
          return "名称";
        }
        case "family": {
          return "协议族";
        }
        case "address": {
          return "IP地址";
        }
        case "mac": {
          return "物理地址";
        }
        case "netmask": {
          return "子网掩码";
        }
      }
    },
  },
};
</script>

<style>
.net-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.net-header {
  width: 95%;

  margin-bottom: 30px;
  padding: 20px;
}
.net-header > h3 {
  font-size: 27px;
  text-align: left;
}
.net-body {
  width: 1400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: space-around;
  /* overflow: auto; */
  padding: 30px 0 0 40px;
  background-color: white;
  border: 1px solid #fff;
  box-shadow: 1px 1px 5px #333;
  border-radius: 15px;
  box-sizing: border-box;
}
.net-item-menu {
  width: 400px;
  height: 300px;
  margin-bottom: 40px;
  margin-right: 45px;
  border: 1px solid #fff;
  border-radius: 8%;
  box-shadow: 1px 1px 5px #333;
  padding-left: 30px;
  box-sizing: border-box;
}
.net-item-menu:hover {
  border: 1px solid #333;
  box-shadow: 1px 1px #0662cb;
  /* background-color: #f2f6fc; */
}
.net-item {
  display: flex;
  align-items: center;
  line-height: 6px;
}
.net-item h3 {
  width: 100px;
  text-align: left;
}
</style>