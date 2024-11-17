<template>
  <div>
    <el-dialog
        v-bind="$attrs"
        v-on="$listeners"
        @open="onOpen"
        @close="onClose"
        width="30%"
    >
      <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="120px"
      >
        <el-form-item label="级别名称" prop="name">
          <el-input
              v-model="formData.name"
              placeholder="请输入级别名称"
              :maxlength="8"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限分配" required>
          <el-tree
              :data="menuData"
              show-checkbox
              node-key="id"
              ref="menu"
              highlight-current
              check-strictly
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="handelConfirm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ["id"],
  data() {
    return {

    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getTreeData();
  },
  methods: {
    onOpen() {
      let id = this.id;
      if (this.id !== "") {
        this.roleId = this.id;
        // this.menuVisible = true;
        this.$request.post({
          // url: "admin/adRole/getRoleMenuId",
          url: "admin/level/getRoleMenuId",
          params: {
            levelId: id,
          },
          success: (result) => {
            this.$refs.menu.setCheckedKeys(result);
            // this.$refs.menu.setCheckedKeys(result);
          },
        });
      } else {
        this.$refs["elForm"].resetFields();
      }
    },

    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
      this.$refs["elForm"].resetFields();
    },
    getTreeData() {
      this.$request.post({
        url: "admin/adMenu/allList",
        success: (res) => {
          this.menuData = res;

          var menuMap = {};
          // 获取根节点数据
          let data = res.filter((value) => value.parentId == -1);
          let parents = [];
          data.forEach((item) => {
            if (item.menuName != "权限管理") {
              parents.push({
                id: item.id,
                label: item.menuName,
                level: item.level,
              });
            }
          });

          // 获取子节点数据
          let childrens = res.filter((value) => value.parentId !== -1);

          // 生成树
          this.menuData = this.$common.translator(
              parents,
              childrens,
              (current) => {
                // 定义树结构
                return {
                  id: current.id,
                  label: current.menuName + (current.flag == 2 ? "  (接口)" : ""),
                  children: current.children,
                  disabled: parent.id == 24 || parent.id == 25 || parent.id == 26,
                };
              }
          );
        },
      });
    },
    setMenuData() {
      let arr = this.$refs.menu.getCheckedNodes(false, true);
      if (arr.length < 1) {
        this.$message.success("请选择需要分配权限的菜单");
        return;
      }
      var menuIds = [];
      arr.forEach((item) => {
        menuIds.push(item.id);
      });
      this.$request.post({
        url: "admin/adRole/setRoleMenu",
        type: "array",
        params: {
          roleId: this.roleId,
          menuIds,
        },
        success: (res) => {
          this.$message.success("设置成功");
        },
      });
      this.menuVisible = false;
    },

    handelConfirm() {
      let arr = this.$refs.menu.getCheckedNodes(false, true);
      if (arr.length < 1) {
        this.$message.success("请选择需要分配权限的菜单");
        return;
      }
      var menuIds = [];
      arr.forEach((item) => {
        menuIds.push(item.id);
      });

      // menuIds = JSON.stringify(menuIds);
      const { bonusPoints, pointDeduction, name, id } = this.formData;
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        this.$request.post({
          url: "system/sysLevel/admin/addOrUpdate",
          type: "array",
          params: {
            bonusPoints,
            pointDeduction,
            name,
            id,
            menuIds,
          },
          success: (res) => {
            this.$message.success("操作成功");
            this.$emit("success");
            this.$refs["elForm"].resetFields();
            // this.id = "";
          },
          error: () => {},
          finally: () => {},
        });
        this.close();
      });
    },
    //选择上级层级触发函数
    handleChange(val) {
      if (val.length === 1) {
        this.changeDeptForm.mainDepartment = val[0];
      }
    },
  },
};
</script>
<style>
.el-icon-arrow-down {
//margin-left: 340px;
}
</style>
