<template>
  <div class="panel_container">
    <el-container>
      <el-aside>
        <slot name="left"></slot>
      </el-aside>
      <el-main>
        <slot name="right-container"> </slot>
      </el-main>
    </el-container>
  </div>
</template>
<style scoped>
.panel_container {
  width: 100%;
}
.el-container {
  padding: 15px;
}
.el-aside {
  min-width: 270px;
  height: 60%;
  align-items: center;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 20px 15px;
  word-wrap: break-word;
}
.el-main {
  align-items: center;
  word-wrap: break-word;
  padding: 15px;
}
el-header {
  align-items: center;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 20px 15px;
  word-wrap: break-word;
}
</style>
