<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/logo.jpg" alt="loginlogo" />
    </div>
    <!-- 使用登陆组件 -->
    <!-- 手机号 -->
    <InputGroup
      type="number"
      placeholder="手机号"
      v-model="phone"
      :btnTitle="btnTitle"
      :disabled="disabled"
      :error="errors.phone"
      @btnClick="getVerigyCode"
    ></InputGroup>
    <!-- 绑定子组件传递的自定义事件 -->
    <!-- 验证码 -->
    <InputGroup type="number" v-model="verifyCode" placeholder="验证码" :error="errors.code"></InputGroup>
    <!-- 用户服务协议 -->
    <div class="login_des">
      <p>
        新用户登录即自动注册，表示已同意
        <span>《用户登录协议》</span>
      </p>
    </div>
    <!-- 登录按钮 -->
    <div class="login_btn">
      <button :disabled="isClick" @click="handleLogin">登录</button>
    </div>
  </div>
</template>
<script>
// 使用登陆组件
// 1.引入组件
import InputGroup from "../components/InputGroup";
export default {
  name: "login",
  // 定义属性
  data() {
    return {
      phone: "", //手机号输入框
      verifyCode: "", //验证码输入框
      errors: {}, //错误信息，有手机号错误，也有验证码错误，所以定义成一个对象
      btnTitle: "获取验证码",
      disabled: false
    };
  },
  methods: {
    handleLogin() {
      // 取消错误提醒
      this.errors = {};
      // 发送请求
      this.$axios
        .post("/api/posts/sms_back", {
          phone: this.phone,
          code: this.verifyCode
        })
        .then(res => {
          console.log(res.data);
          // 检验成功 设置登录状态并且跳转到/
          localStorage.setItem("ele_login", res.data.user._id);
          // 跳转到根路径下
          this.$router.push("/");
        })
        .catch(err => {
          // 返回错误信息
          this.errors = {
            code: err.response.data.msg
          };
        });
    },
    // 实现点击按钮获取验证码事件
    getVerigyCode() {
      // 先判断当前手机号是否合法
      if (this.validatePhone()) {
        // 发送网络强求获取验证码
        this.valdateBtn();
        // 发送网络请求
        // 发送网络请求
        this.$axios
          .post("/api/posts/sms_send", {
            sid: "5d144bf4e139d78c05adc9a02f80d3f7",
            token: "805a064d308a4bfa104ef4114c923726",
            appid: "a5a1c01adbac4a68a8c7e738e122454e",
            templateid: "528652",
            phone: this.phone
          })
          .then(res => {
            console.log(res);
          });
      }
    },
    //获取验证码倒计时方法
    valdateBtn() {
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          this.btnTitle = "获取验证码";
          this.disabled = false;
        } else {
          this.btnTitle = time + "秒后重试";
          this.disabled = true;
          time--;
        }
      }, 1000);
    },
    validatePhone() {
      // 验证手机号码
      // 首先不为空
      if (!this.phone) {
        this.errors = {
          phone: "手机号码不能为空"
        };
        return false;
      } else if (!/^1[345678]\d{9}$/.test(this.phone)) {
        this.errors = {
          phone: "请填写正确的手机号码"
        };
        return false;
      } else {
        this.errors = {};
        return true;
      }
    }
  },
  computed: {
    isClick() {
      if (!this.phone || !this.verifyCode) return true;
      else return false;
    }
  },

  // 注册组件
  components: {
    InputGroup
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background: #fff;
}
.logo {
  text-align: center;
}
.logo img {
  width: 150px;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: #fff;
  border: none;
}
.login_btn button[disabled] {
  background-color: #8bda81;
}
</style>