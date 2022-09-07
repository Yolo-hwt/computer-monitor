//Vue
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
//第三方库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import jquery from 'jquery'

import echarts from 'echarts';
import 'echarts-liquidfill'

//我的方法
import convert from './tool/dataConvert'
import request from './tool/request'
import params from './tool/defaultParam'

//关闭生产提示
Vue.config.productionTip = false
//应用vu-router
Vue.use(VueRouter)
//全局应用第三方库
Vue.use(ElementUI);
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.prototype.$jq = jquery

//全局应用我的模块
Vue.prototype.$convert = convert
Vue.prototype.$req = request
Vue.prototype.$params = params


//创建vm
new Vue({
  el: "#app",
  render: h => h(App),
  router: router,
  beforeCreate() {
    //安装全局事件总线
    Vue.prototype.$bus = this
  },
})
