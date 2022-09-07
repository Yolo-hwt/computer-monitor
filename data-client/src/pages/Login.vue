<template>
  <div class="container">
    <div class="forms-container">
      <div class="signin-signup">
        <form
          action="#"
          class="sign-in-form"
          @submit.prevent="handleSignInSubmit"
        >
          <div class="self-title"><h1>计算机性能监控系统</h1></div>
          <h2 class="title">登录</h2>
          <div class="input-field" id="signIn-name">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="用户名" v-model="signInName" />
          </div>
          <div class="input-field" id="signIn-psd">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="密码" v-model="signInPsd" />
          </div>
          <input type="submit" value="登录" class="btn solid" />
        </form>
        <form
          action="#"
          class="sign-up-form"
          @submit.prevent="handleSignUpSubmit"
        >
          <div class="self-title"><h1>计算机性能监控系统</h1></div>
          <h2 class="title">注册</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="用户名" v-model="signUpName" />
          </div>
          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input type="email" placeholder="邮箱" v-model="signUpEmail" />
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="密码" v-model="signUpPsd" />
          </div>
          <input type="submit" class="btn" value="注册" />
        </form>
      </div>
    </div>
    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>初次使用 ?</h3>
          <p>
            新用户? 注册计算机性能监控系统 以提供更好安全保护与使用体验
            点击按钮前往注册
          </p>
          <button class="btn transparent" id="sign-up-btn" @click="signUp">
            注册
          </button>
        </div>
        <img src="img/log.svg" class="image" alt="" />
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>已有账号 ?</h3>
          <p>
            已有账号 ? 注册成功 ? 点击按钮前往登录 系统初始化可能会加载较长时间
            请耐心等待
          </p>
          <button class="btn transparent" id="sign-in-btn" @click="signIn">
            登录
          </button>
        </div>
        <img src="img/register.svg" class="image" alt="" />
      </div>
    </div>
  </div>
</template>
   <script>
import $ from "jquery";
export default {
  name: "Login",
  data() {
    return {
      loginStatus: false,
      signInName: "",
      signInPsd: "",
      signUpName: "",
      signUpPsd: "",
      signUpEmail: "",
    };
  },
  mounted() {
    // debugger;
    this.loginStatus = false;
  },
  // watch: {
  //   getLoginStatus() {
  //     this.$forceUpdate();
  //   },
  // },
  // computed: {
  //   getLoginStatus() {
  //     return this.loginStatus;
  //   },
  // },
  //通过路由规则，离开该组件时被调用
  //登录验证
  beforeRouteLeave(to, from, next) {
    this.loginIsOk = true;
    // console.log("Login--beforeRouteLeave", to, from);
    if (to.meta.isAuth) {
      //判断是否需要鉴权
      if (this.verifyNameAndPsd()) {
        next();
      } else {
        alert("用户名或密码错误！");
      }
    } else {
      next();
    }
  },
  methods: {
    //登录转换
    signIn() {
      $(".container")[0].classList.remove("sign-up-mode");
    },
    //注册转换
    signUp() {
      $(".container")[0].classList.add("sign-up-mode");
    },

    //验证密码
    verifyNameAndPsd() {
      const name = this.signInName;
      const password = this.signInPsd;
      let flag = false;
      //root测试用户登录
      if (name === "root" && password === "123") {
        sessionStorage.setItem("loginStatus", "root");
        return true;
      }
      const userinfo = JSON.parse(localStorage.getItem("userinfo"));
      if (userinfo.username === name && userinfo.userpsd === password) {
        sessionStorage.setItem("loginStatus", "user");
        flag = true;
        this.loginStatus = false;
      }
      return flag;
    },
    //登录提交处理
    handleSignInSubmit() {
      let nullflag_name = this.signInName === "" ? true : false;
      let nullflag_psd = this.signInPsd === "" ? true : false;
      const name = this.signInName;
      // const psd = this.signInPsd;
      if (nullflag_name || nullflag_psd) {
        alert("账号或密码不能为空");
        // console.log("login flag:", nullflag_name, nullflag_psd);
      } else {
        if (this.verifyNameAndPsd()) {
          this.$bus.$emit("getLoginStatus", {
            status: true,
            username: this.signInName,
          });
        } else {
          alert("用户名或密码错误！");
        }

        // // 跳转验证账号密码并登录
        // this.$router.replace({
        //   name: "homepage",
        //   params: {
        //     username: name,
        //   },
        // });
      }

      this.signInName = "";
      this.signInPsd = "";
    },
    //注册提交处理
    handleSignUpSubmit() {
      let nullflag_name = this.signUpName === "" ? true : false;
      let nullflag_email = this.signUpEmail === "" ? true : false;
      let nullflag_psd = this.signUpPsd === "" ? true : false;

      const name = this.signUpName;
      const psd = this.signUpPsd;
      const email = this.signUpEmail;

      if (nullflag_name || nullflag_psd || nullflag_email) {
        alert("账号邮箱或密码不能为空");
        console.log(
          "register flag:",
          nullflag_name,
          nullflag_email,
          nullflag_psd
        );
      } else {
        //localStorage添加记录
        let registerobj = {
          username: name,
          useremail: email,
          userpsd: psd,
        };
        localStorage.setItem("userinfo", JSON.stringify(registerobj));
        alert(`账号${name}注册成功!`);
        this.signIn();
      }

      this.signUpName = "";
      this.signUpEmail = "";
      this.signUpPsd = "";
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

.self-title {
  font-size: 0.9rem;
  margin-bottom: 20px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
input {
  font-family: "Poppins", sans-serif;
}

.container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 0.5s 0.5s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.5s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4481eb;
  border-color: #4481eb;
}

.btn {
  width: 150px;
  background-color: #5995fd;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #4d84e2;
}
.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
  transition: 1s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>

    

    


