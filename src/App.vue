<template>
  <div id="app">
		<keep-alive include="memberList">
      <router-view v-if="isRouterAlive"></router-view>
		</keep-alive>
  </div>
</template>

<script>
export default {
  created() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    // const changeFavicon = link => {
    //     let $favicon = document.querySelector('link[rel="icon"]');
    //     // If a <link rel="icon"> element already exists,
    //     // change its href to the given link.
    //     if ($favicon !== null) {
    //       $favicon.href = link;
    //       // Otherwise, create a new element and append it to <head>.
    //     } else {
    //       $favicon = document.createElement("link");
    //       $favicon.rel = "icon";
    //       $favicon.href = link;
    //       document.head.appendChild($favicon);
    //     }
    //   };
    //   let icon = this.$appConfig.admin.publicPath+"logos"+this.$appConfig.admin.img+".ico"; // 图片地址
    //   changeFavicon(icon); // 动态修改网站图标
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    handleResize(event) {
      var fullWidth = document.documentElement.clientWidth;
      if (fullWidth > 768) {
        this.$store.state.isPhone = false;
        this.$store.state.navOpen = true;
      } else {
        this.$store.state.isPhone = true;
        this.$store.state.navOpen = false;
      }
    },
  },
};
</script>


<style lang="scss">
@import url("./assets/css/element-ui.css");
@import url("./assets/css/public.css");
@import url("./assets/fonts/icon.css");

* {
  padding: 0;
  margin: 0;
}

body {
  background-color: #f6f8f9;
  overflow: hidden;
  padding: 0 !important;
}
@media screen and (max-width: 768px) {
  .el-message-box {
    width: 80% !important;
  }
  .el-dialog {
    width: 80% !important;
  }
  .el-dialog .el-form-item__label {
    display: none !important;
  }
  .el-dialog .el-form-item__content {
    margin-left: 0 !important;
  }
}

// .theme-color:{
// 	// color: $color-primary;
// }
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
