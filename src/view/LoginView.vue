<script>
import {doGet, doPost} from "../http/httpRequest.js";
import {messageTip, removeHistoryToken} from "../util/util.js";
import router from "../router/router.js";

export default {
  name: "LoginView",
  data() {
    return {
      // 提交的表单数据
      form: {
        loginAct: '',
        loginPwd: '',
        rememberMe: false
      },
      // 登录校验规则
      loginRules: {
        // 账号校验规则
        loginAct: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        // 密码校验规则
        loginPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '登录密码长度为6~16位', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    userLogin() {
      // 提交前验证输入框的合法性
      this.$refs.loginForm.validate(isValid => {
        // isValid验证后的结果
        if (isValid) {
          let formData = new FormData();
          formData.append("loginAct", this.form.loginAct);
          formData.append("loginPwd", this.form.loginPwd);
          formData.append("rememberMe", this.form.rememberMe);

          // 提交表单
          doPost("/api/login", formData).then((resp) => {
            if (resp.data.code === 200) {
              // 登录成功
              messageTip('登录成功', 'success');

              // 清除历史token
              removeHistoryToken();

              // 存储jwt
              if (this.form.rememberMe === true) {
                localStorage.setItem('dlyk_token', resp.data.data);
              } else {
                sessionStorage.setItem('dlyk_token', resp.data.data);
              }

              // 跳转到系统的主页面
              window.location.href = '/dashboard';
            } else {
              messageTip('登录失败', 'error');
            }
          });
        }
      })
    },

    //免登录（自动登录）
    freeLogin() {
      let token = window.localStorage.getItem('dlyk_token');
      if (token) { //表示token有值，token不是空，token存在
        doGet("/api/login/free", {}).then(resp => {
          if (resp.data.code === 200) {
            //token验证通过了，那么可以免登录
            window.location.href = "/dashboard";
          }
        })
      }
    }
  },
  mounted() {
    this.freeLogin();
  },

}
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <img src="../assets/loginBox.svg" alt="">
      <p class="imgTitle">欢迎使用动力云客系统</p>
    </el-aside>
    <el-main>
      <div class="welcome">欢迎登录</div>
      <el-form ref="loginForm" :model="form" label-width="auto" style="max-width: 600px" :rules="loginRules">
        <el-form-item label="账号" prop="loginAct">
          <el-input v-model="form.loginAct"/>
        </el-form-item>

        <el-form-item label="密码" prop="loginPwd">
          <el-input v-model="form.loginPwd" type="password"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="userLogin">登 录</el-button>
        </el-form-item>

        <el-form-item>
          <el-checkbox label="记住我" v-model="form.rememberMe"></el-checkbox>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-aside {
  background: #1a1a1a;
  width: 40%;
  text-align: center;
}

.el-main {
  height: calc(100vh);
}

img {
  height: 400px;
}

.imgTitle {
  color: #f9f9f9;
  font-size: 28px;
}

.el-form {
  width: 60%;
  margin: 0 auto;
}

.welcome {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 50px;
  font-size: 28px;
  font-weight: bold;
}

.el-button {
  width: 100%;
}

.el-checkbox {
  font-weight: normal;
}
</style>