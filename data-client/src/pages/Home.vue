<template>
  <!-- main -->
  <el-container class="main">
    <el-header :height="layout.headerHeight"
      ><div class="my-header-logo">
        <img src="logo.png" alt="data watcher" />
      </div>
      <div class="my-header-title"><h1>COMPUTER MONITORING</h1></div>
      <div class="my-header-function">
        <el-dropdown :show-timeout="layout.dropMenuTimeOut">
          <span class="el-dropdown-link">
            <i class="el-icon-magic-stick"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" disabled>
              主题
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="my-header-function">
        <el-dropdown :show-timeout="layout.dropMenuTimeOut">
          <span class="el-dropdown-link">
            <el-badge :value="3" class="item">
              <i class="el-icon-bell"></i>
            </el-badge>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" disabled>
              通知
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="my-header-function">
        <el-dropdown :show-timeout="layout.dropMenuTimeOut">
          <span class="el-dropdown-link">
            <i class="el-icon-info"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" disabled>
              关于
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="my-header-avatar">
        <div class="my-avatar-img">
          <el-dropdown @command="handleDropMenuCommand">
            <span class="el-dropdown-link">
              <el-avatar
                :size="avatarData.avatarSize"
                :src="avatarData.avatarUrl"
              ></el-avatar>
              <!-- <i class="el-icon-caret-bottom el-icon--right"></i> -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix" command="profile">
                个人信息
                <!-- <el-badge class="mark" :value="12" /> -->
              </el-dropdown-item>
              <el-dropdown-item class="clearfix" divided command="exit">
                退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <span class="my-avator-name"> {{ username }}</span>
      </div>
    </el-header>
    <!--个人信息右侧抽屉-->
    <el-drawer
      title="个人信息"
      :visible.sync="avatarData.drawer"
      :direction="avatarData.direction"
      :before-close="handleDrawerClose"
      :wrapperClosable="false"
    >
      <span>我来啦!</span>
    </el-drawer>

    <el-aside :width="layout.asideWidth">
      <el-menu
        class="my-aside-menu"
        :default-active="asideMenuData.defaultActive"
        @select="routeToPage"
        :active-text-color="asideMenuData.activeTextColor"
        :text-color="asideMenuData.textColor"
      >
        <el-menu-item index="basic" class="my-menu-item first-menu-item">
          <i class="el-icon-menu"></i>
          <span slot="title">电脑</span>
        </el-menu-item>

        <el-menu-item index="cpu" class="my-menu-item">
          <i class="el-icon-cpu"></i>
          <span slot="title">cpu</span>
        </el-menu-item>

        <el-menu-item index="mem" class="my-menu-item">
          <i class="el-icon-folder-opened"></i>
          <span slot="title">存储</span>
        </el-menu-item>
        <el-menu-item index="net" class="my-menu-item">
          <i class="el-icon-discover"></i>
          <span slot="title">网卡</span>
        </el-menu-item>

        <el-menu-item index="set" class="my-menu-item last-menu-item">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main
      ><keep-alive :include="cacheList">
        <router-view></router-view>
      </keep-alive>
      <el-footer
        >This tool is a personal development, only for learning and reference,
        if you have any questions, please contact
        <a href="#">1803297996@qq.com</a></el-footer
      >
    </el-main>
  </el-container>
</template>
<script>
import $ from "jquery";
export default {
  name: "Home",
  data() {
    return {
      cacheList: ["Basic", "Cpu", "Mem", "Set", "Net"], //
      layout: {
        asideWidth: "130px",
        headerHeight: "75px",
        dropMenuTimeOut: 100, //下拉菜单响应时间
      },
      username: "rose",
      //用户头像数据
      avatarData: {
        avatarSize: 40,
        avatarUrl:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        //侧边个人信息
        drawer: false,
        direction: "rtl",
      },
      //侧边菜单数据
      asideMenuData: {
        asideColor: "#f3f4f7",
        defaultActive: "basic",
        textColor: "#545c64",
        activeTextColor: "#00aeef",
      },
    };
  },
  methods: {
    initHomePage() {
      this.username = this.$route.params.username;
      this.routeToPage("basic");
      this.setMenuItemStyle();
    },
    // 菜单select事件的两个回调参数(index,indexPath)
    //index: 选中菜单项的 index, indexPath: 选中菜单项的 index path
    routeToPage(index, indexPath) {
      const targetRoute = index + "page";
      this.$router.replace({ name: targetRoute }).catch((err) => err);
    },
    //设置左侧菜单样式
    setMenuItemStyle() {
      $(".el-menu-item").css({
        height: "100px",
        "line-height": "100px",
        "font-size": "19px",
      });
    },
    //个人信息、设置跳转
    handleDropMenuCommand(command) {
      switch (command) {
        case "profile": {
          //个人信息
          this.avatarData.drawer = true;
          break;
        }
        case "exit": {
          //退出
          this.$router.replace({ name: "loginpage" });
          break;
        }
      }
    },
    //个人信息页面抽屉关闭动作
    handleDrawerClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    publocalStorgeParams() {
      //发布初始化消息到四个路由组件
      const basic_params =
        localStorage.getItem("params_basic_" + this.username) === null
          ? this.$params.basic_default
          : localStorage.getItem("params_basic_" + this.username);
      const cpu_params =
        localStorage.getItem("params_cpu_" + this.username) === null
          ? this.$params.cpu_default
          : localStorage.getItem("params_cpu_" + this.username);
      const mem_params =
        localStorage.getItem("params_mem_" + this.username) === null
          ? this.$params.mem_default
          : localStorage.getItem("params_mem_" + this.username);
      const net_params =
        localStorage.getItem("params_net_" + this.username) === null
          ? this.$params.net_default
          : localStorage.getItem("params_net_" + this.username);

      this.$pub.publish("basic_default", basic_params);
      this.$pub.publish("cpu_default", cpu_params);
      this.$pub.publish("mem_default", mem_params);
      this.$pub.publish("net_default", net_params);
      // this.$bus.$emit("getCpuDefaultParams", this.$params.cpu_default);
      console.log("消息发布");
    },
  },

  mounted() {
    //跳转主页时候默认显示basic路由页面
    this.initHomePage();
    // this.$nextTick(() => {
    //   this.publocalStorgeParams();
    // });
  },
};
</script>
<style >
body {
  background: #e9eef3;
  margin: 0;
}
</style>
<style scoped>
.my-header-logo {
  width: 75px;
  height: 70px;
  padding-left: 6px;
}
.my-header-logo img {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  cursor: pointer;
}
.my-header-title {
  flex: 6 1 auto;
  color: #00a9e5;
  font-size: 23px;
  cursor: default;
}
.my-header-title h1 {
  width: 600px;
}
.my-header-function {
  flex: 1 1 auto;
  cursor: pointer;
  line-height: 20px;
}
.my-header-function span i {
  font-size: 35px;
}

.my-header-avatar {
  flex: 2 1 auto;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  /* border: 1px solid blue; */
  font-size: 18px;
  line-height: 20px;
}
.el-avatar {
  border: 2px solid gray;
}
.my-avatar-img {
  cursor: pointer;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-header {
  display: flex;
  align-items: center;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 1px 1px 10px #333;
}
.el-footer {
  margin-top: 50px;
}
.el-footer a {
  color: #448aff;
}
.el-aside {
  background-color: #e9eef3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  text-align: center;
  line-height: 160px;
  /* my-style */
  height: 750px;
  position: fixed;
  top: 8%;
  left: 0;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  flex: 1;
  overflow: auto;
  height: 900px;
  padding-top: 110px;
  padding-left: 170px;
  padding-right: 50px;
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-menu.my-aside-menu {
  background-color: #d3dce6;
  width: 110px;
  /* border-radius: 20px; */
  box-shadow: 1px 1px gray;
}

/* .el-menu-item.my-menu-item.last-menu-item {
  border-radius: 0 0 20px 20px;
}
.el-menu-item.my-menu-item.first-menu-item {
  border-radius: 20px 20px 0 0;
} */
.my-menu-item.el-menu-item:hover {
  outline: 0;
  background-color: #f3f3f5;
}
.my-menu-item.el-menu-item:focus {
  background-color: #d3dce6;
}
.my-menu-item.el-menu-item {
  font-size: 23px;
}
</style>