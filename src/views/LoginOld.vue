<template>
  <div id="login">
    <div v-if="!$store.state.isPhone" class="back_img">
      <div class="shade">
        <div class="title">西诗 定制行业生意 销售系统</div>
      </div>
    </div>
    <div class="form">
      <el-form
        :model="params"
        status-icon
        :rules="rules"
        ref="login"
        :hide-required-asterisk="true"
        @keyup.enter.native="submitForm()"
      >
        <div class="login-title">欢迎登录！</div>
        <el-form-item prop="account">
          <el-input
            v-model="params.account"
            placeholder="账号"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="params.password"
            placeholder="密码"
            type="password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row>
            <el-col :span="16">
              <el-input
                v-model="params.code"
                placeholder="验证码"
                prefix-icon="el-icon-lock"
                style="margin-right: 5px"
              ></el-input>
            </el-col>
            <el-col :span="8" class="align-right">
              <ImgCode
                :sign.sync="params.verifySign"
                ref="imgCode"
                style="width: 90%; height: 39px; margin-left: 10%"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-button
          type="primary"
          class="form_btn"
          @click="submitForm"
          :loading="loading"
          >登录</el-button
        >
        <div style="text-align: center"></div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ImgCode from "@/components/utils/ImgCode";
import rsa from "@/utils/rsa";
import routerUtil from "@/router/routerUtil";
import qs from "qs";
export default {
  components: {
    ImgCode
  },
  data() {
    return {
      params: {
        account: "",
        password: "",
        code: "",
        verifySign: ""
      },
      rules: {
        account: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      },
      verifyCode: {
        codeUrl: "",
        sign: "",
        code: ""
      },
      loading: false,
      redirect: "",
      otherQuery: {},
      activeName: "first"
    };
  },

  mounted() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("menuList");
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.otherQuery = query;
          let token = sessionStorage.getItem("adminToken");
        }
      },
      immediate: true
    }
  },
  methods: {
    getOtherQuery(query) {
      let data = qs.parse(query.split("?")[1]);
      return data;
    },
    beforeLeave() {
      this.$refs["login"].resetFields();
      if (this.loading) return false;
    },
    submitForm() {
      this.$refs["login"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$request.post({
            url: "admin/adInfo/public/authority",
            params: {
              account: rsa.encryptByPublicKey(this.params.account),
              password: rsa.encryptByPublicKey(this.params.password),
              verifyCode: this.params.code,
              verifySign: this.params.verifySign
            },
            success: res => {
              sessionStorage.setItem("adminToken", res.token);
              // sessionStorage.setItem("userName", res.name)
              localStorage.setItem("uid", res.adInfo.id);
              sessionStorage.setItem("name", res.adInfo.remark);
              sessionStorage.setItem(
                "iScanSeeAllOrder",
                res.roleInfo.canSeeAllOrder
              );
              sessionStorage.setItem("roleId", res.roleInfo.roleId);
              // this.$store.dispatch('router/setMenuList', res.menuList)
              sessionStorage.setItem("menuList", JSON.stringify(res.menuList));
              sessionStorage.setItem("roleName", res.roleInfo.roleName);
              routerUtil.init();
              this.$router.push("/manage/rules/Order");
              // this.$router.push("manage/rules/Account")
              this.$message.success("登录成功");
            },
            allError: e => {
              this.$refs.imgCode.getImgCode();
            },
            finally: () => {
              this.loading = false;
            }
          });
        } else {
          return false;
        }
      });
    },

    resetForm() {
      this.$refs["login"].resetFields();
    },

    getMenus() {
      this.loading = true;
      this.$request.post({
        url: "admin/roleMenu/getMenuUrl",
        success: res => {
          sessionStorage.setItem("menuList", res);
          let redirect = decodeURIComponent(this.$route.query.redirect || "/");
          if (redirect.indexOf("/") != -1 || redirect.indexOf("login") != -1) {
            redirect = "/manage/welcome";
          }
          localStorage.setItem("account", this.admin.account);
          this.$router.replace(redirect);
        },
        finally: () => {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
#login {
  display: flex;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  min-width: 1200px;
  background: white;
}

#login > div {
  width: 100%;
  height: 100%;
}

#login .form {
  flex: 1;
  box-sizing: border-box;
}

#login .form .el-form {
  width: 80%;
  margin: 50% auto;
}

#login .back_img {
  flex: 3;
}

#login .form_title {
  font-weight: 550;
  font-size: 20px;
  margin-bottom: 15px;
  color: #444444;
}

#login .form .form_btn {
  width: 100%;
  margin-top: 30px;
}

#login .back_img {
  background: url("../assets/img/login_back.jpg") center no-repeat;
  background-size: auto 100% 100%;
  display: flex;
  align-items: center;
  /* opacity: 0.7; */
}

#login .back_img .shade {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
}

#login .back_img .title {
  font-size: 30px;
  width: 60%;
  background: white;
  margin: auto;
  margin-top: 25vh;
  padding: 2% 0;
  text-align: center;
  white-space: nowrap;
  opacity: 0.85;
}

@media screen and (max-width: 768px) {
  #login {
    width: 100%;
    min-width: auto;
  }
}
</style>
<style lang="scss">
.login-title {
  font-size: 20px;
  font-weight: 500;
  color: #444444;
  margin-bottom: 15px;
}
</style>
