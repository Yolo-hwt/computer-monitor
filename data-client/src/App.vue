<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import pubsub from "pubsub-js";
export default {
  name: "App",

  // components: {
  //   Login,
  // },
  mounted() {
    // debugger;
    this.$bus.$on("getLoginStatus", this.routeToHomePage);
    this.$router.replace({
      name: "loginpage",
    });
  },
  methods: {
    routeToHomePage(loginobj) {
      console.log(loginobj);
      // this.publocalStorgeParams();
      if (loginobj.status === true) {
        this.$router.replace({
          name: "homepage",
          params: {
            username: loginobj.username,
          },
        });
      }
      // console.log("发布username");
      // pubsub.publish("username_set", loginobj.username);
    },
    publocalStorgeParams() {
      //发布初始化消息到四个路由组件
      const basic_params =
        localStorage.getItem("params_basic_" + this.username) === null
          ? this.$params.basic_default
          : JSON.parse(localStorage.getItem("params_basic_" + this.username));
      const cpu_params =
        localStorage.getItem("params_cpu_" + this.username) === null
          ? this.$params.cpu_default
          : JSON.parse(localStorage.getItem("params_cpu_" + this.username));
      const mem_params =
        localStorage.getItem("params_mem_" + this.username) === null
          ? this.$params.mem_default
          : JSON.parse(localStorage.getItem("params_mem_" + this.username));
      const net_params =
        localStorage.getItem("params_net_" + this.username) === null
          ? this.$params.net_default
          : JSON.parse(localStorage.getItem("params_net_" + this.username));

      pubsub.publish("basic_default", basic_params);
      pubsub.publish("cpu_default", cpu_params);
      pubsub.publish("mem_default", mem_params);
      pubsub.publish("net_default", net_params);
      // this.$bus.$emit("getCpuDefaultParams", this.$params.cpu_default);
      console.log("消息发布");
    },
  },
};
</script>

<style>
</style>
