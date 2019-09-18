<template>
  <div class="login-page" @keyup.enter.native="handleLogin">
    <div class="login-weaper animated bounceInDown">
      <div class="login-left">
        <img class="img" :src="imgUrl"/>
      </div>
      <div class="login-border">
        <div class="title">用户登录</div>
        <div class="login-main">
          <el-form
            class="login-form"
            status-icon
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            label-width="0"
            label-position="top"
          >
            <el-form-item prop="userName" style="margin-bottom: 40px;">
              <el-input
                size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.userName"
                auto-complete="off"
                placeholder="请输入用户名"
              >
                <i slot="prefix" class="icon-yonghu"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                size="small"
                v-model="loginForm.password"
                @keyup.enter.native="handleLogin"
                auto-complete="off"
                placeholder="请输入密码"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click.native.prevent="handleLogin" class="login-submit">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Emit, Component } from 'vue-property-decorator'
import { login } from '../../api/module/login'
@Component
export default class loginPage extends Vue {
  imgUrl: string = '../../assets/logo.png';
  loginForm: any = {
    userName: 'admin',
    password: '123123'
  };
  loginRules: object = {
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入随密码', trigger: 'blur' }]
  };

  @Emit()
  handleLogin () {
    (this.$refs['loginForm'] as HTMLFormElement).validate((valid: any) => {
      if (valid) {
        login(this.loginForm).then(res => {
          this.$router.push({
            path: '/'
          })
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.login-page {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  margin: 0 auto;
  background: #edf1f3;
  animation: animate-cloud 20s linear infinite;
}

.login-weaper {
  margin: 0 auto;
  width: 750px;
  box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
}

.login-left,
.login-border {
  position: relative;
  height: 420px;
}

.login-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  justify-content: center;
  flex-direction: column;
  background-color: #409eff;
  color: #fff;
  float: left;
  width: 300px;
  position: relative;
}

.login-left .img {
  width: 100%;
  height: 100%;
}

.login-time {
  position: absolute;
  left: 25px;
  top: 25px;
  width: 100%;
  color: #fff;
  font-weight: 200;
  opacity: 0.9;
  font-size: 18px;
  overflow: hidden;
}

.login-border .title {
  text-align: center;
  color: #0a82e5;
  font-weight: 600;
  letter-spacing: 2px;
  font-size: 22px;
  padding: 45px 0;
}

.login-border {
  border-left: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: #fff;
  background-color: #fff;
  width: 450px;
  float: left;
  box-sizing: border-box;
}

.login-main {
  margin: 0 auto;
  width: 65%;
  box-sizing: border-box;
}

.login-main > h3 {
  margin-bottom: 20px;
}

.login-main > p {
  color: #76838f;
}

.login-title {
  color: #333;
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 22px;
  text-align: center;
  letter-spacing: 4px;
}

.login-select {
  input {
    color: #333;
    font-size: 18px;
    font-weight: 400;
    border: none;
    text-align: center;
  }
}

.login-menu {
  margin-top: 40px;
  width: 100%;
  text-align: center;

  a {
    color: #999;
    font-size: 12px;
    margin: 0px 8px;
  }
}

.login-submit {
  width: 100%;
  font-size: 16px;
  letter-spacing: 2px;
  padding: 0;
  font-weight: 300;
  cursor: pointer;
  margin-top: 30px;
  height: 40px;
  line-height: 40px;
  transition: 0.25s;
}

.login-form {
  i {
    color: #333;
  }

  .el-form-item__content {
    width: 100%;
  }

  .el-input {
    input {
      padding-bottom: 10px;
      text-indent: 5px;
      background: transparent;
      border: none;
      border-radius: 0;
      color: #333;
      border-bottom: 1px solid rgb(235, 237, 242);
    }

    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}

.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 0 0 10px;
}

.login-code-img {
  margin-top: 2px;
  width: 100px;
  height: 38px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 38px;
  text-indent: 5px;
  text-align: center;
}
</style>
