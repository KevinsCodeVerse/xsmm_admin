<template>
  <el-dropdown trigger="click" class="custom-tree-menu" size="small">
    <i class="el-icon-more rotate" @click.stop/>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item, index) in events"
        :key="index"
        :divided="index > 0"
        @click.stop.native="clickMenu(item)"
        style="text-align:center"
      >
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  props: {
    events: {
      type: Array,
      default: function () {
        return [
          {
            label: "新建同级",
            funcName: "addNode",
          },
          {
            label: "编辑",
            funcName: "editNode",
          },
          {
            label: "删除",
            funcName: "deleteNode",
          },
        ];
      },
    },
    data: {
      type: Object,
    },
  },
  methods: {
    clickMenu(item) {
      this.$emit(item.funcName, this.data);
    },
  },
};
</script>
<style scoped>
.rotate {
  cursor: pointer;
  margin-left: 5px;
  transform: rotate(90deg);
}
</style>