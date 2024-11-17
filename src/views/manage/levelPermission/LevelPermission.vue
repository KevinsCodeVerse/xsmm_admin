<template>
  <div class="container">
    <!-- 角色管理 -->
    <main-content>
      <el-form :inline="true">
        <el-form-item>
          <el-input
            size="mini"
            placeholder="请输入姓名"
            v-model="params.name"
            :clearable="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button
        style="margin: 10px 0"
        size="mini"
        type="primary"
        @click="onOpen"
        >新增</el-button
      >

      <el-table
        :data="list"
        v-loading="loading"
        style="height: 100%;max-height: 750px"
        max-height="650"
      >
        <el-table-column
          prop="roleName"
          label="角色"
          width="150px"
          align="center"
        >
        </el-table-column>
        <el-table-column label="分配菜单" width="500px" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openAuth(scope.row)"
              >权限</el-button
            >
            <el-button type="text" size="mini" @click="updata(scope.row)"
              >修改</el-button
            >
            <el-button
              v-if="scope.row.id !== 14"
              type="text"
              style="color: red"
              size="mini"
              @click="deletes(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </main-content>
    <el-dialog
      :visible.sync="visible"
      :title="id ? '编辑角色' : '添加角色'"
      @close="handleDialogClose"
      width="40%"
    >
      <el-form
        ref="Form"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="120px"
        center
      >
        <el-form-item label-width="140px" label="角色名称:" prop="roleName">
          <el-input
            v-model="formData.roleName"
            placeholder="请输入角色名称"
            :maxlength="8"
            show-word-limit
            clearable
            :disabled="isYwyId === 14"
            :style="{ width: '100%' }"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="sensitiveFields"
          label-width="140px"
          label="敏感字段查看权限:"
        >
          <el-checkbox-group v-model="formData.sensitiveFields">
            <el-checkbox v-for="item in SensiList" :label="item" :key="item">{{
              item
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          prop="canSeeAllOrder"
          label-width="140px"
          label="是否可见全部订单:"
        >
          <el-switch v-model="formData.canSeeAllOrder"> </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAuth" title="权限" width="25%" center>
      <el-tree
        :data="menuData"
        show-checkbox
        ref="menu"
        node-key="id"
        highlight-current
        check-strictly
      >
      </el-tree>
      <div slot="footer">
        <el-button @click="closeMenu">取 消</el-button>
        <el-button type="primary" @click="setMenuData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isYwyId: null,
      menuMappings: [
        ["cost", "成本"],
        ["cost_detail", "成本详情"],
        ["receive_amount", "收款金额"],
        ["receive_detail", "收款详情"],
        ["not_receive_amount", "未收款"],
        ["profit", "毛利"],
        ["paid_amount", "已支付"],
        ["not_pay_amount", "未支付"]
      ],
      fields: [
        "成本",
        "成本详情",
        "收款金额",
        "收款详情",
        "未收款",
        "毛利",
        "已支付",
        "未支付"
      ],
      englishFields: [],
      dialogAuth: false,
      loading: false,
      visible: false,
      params: {
        pageNo: 1,
        pageSize: 200
      },
      total: 0,
      pages: 0,
      list: [],
      id: "",
      formData: {
        sensitiveFields: [],
        canSeeAllOrder: false,
        roleName: "",
        id: ""
      },
      SensiList: [], // 敏感字段
      // 菜单数据
      menuData: [],
      defaultProps: {
        label: "name",
        children: "children",
        isLeaf: "isLeaf",
        id: "id"
      },
      // 分配菜单时用到的角色id
      roleId: "",
      checkedItems: [],
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }
        ],
        sensitiveFields: [
          {
            required: true,
            message: "请选择敏感字段",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    search() {
      this.params.pageNo = 1;
      this.getList();
    },

    // 重置表单信息
    reset() {
      this.params = {
        pageNo: 1,
        pageSize: 50,
        name: ""
      };
      this.getList();
    },
    // 获取敏感字段
    getSensitiveFields() {
      const fieldMap = new Map([
        ["cost", "成本"],
        ["cost_detail", "成本详情"],
        ["receive_amount", "收款金额"],
        ["receive_detail", "收款详情"],
        ["not_receive_amount", "未收款"],
        ["profit", "毛利"],
        ["paid_amount", "已支付"],
        ["not_pay_amount", "未支付"]
      ]);
      this.$request.post({
        url: "/admin/adRole/getAllSensitiveFields",
        success: res => {
          if (res) {
            this.visible = true;
            const sensiFields = res.split(",");
            this.SensiList = sensiFields.map(field => fieldMap.get(field));
          }
        }
      });
    },
    submitForm() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          const englishFields = this.formData.sensitiveFields.filter(field => {
            for (const mapping of this.menuMappings) {
              if (mapping[1] === field) {
                return true;
              }
            }
            return false; // 如果没有找到对应的英文字段，则过滤掉该字段
          });

          // 将筛选出的英文字段存储到一个变量中
          const filteredEnglishFields = englishFields.map(field => {
            for (const mapping of this.menuMappings) {
              if (mapping[1] === field) {
                return mapping[0];
              }
            }
          });

          if (this.formData.id) {
            this.$request.post({
              url: "/admin/adRole/update",
              params: {
                id: this.formData.id,
                roleName: this.formData.roleName,
                sensitiveFields: filteredEnglishFields.join(","),
                canSeeAllOrder: this.formData.canSeeAllOrder
              },
              success: res => {
                this.$message.success(res);
                this.getList();
                this.close();
              }
            });
          } else {
            this.$request.post({
              url: "/admin/adRole/add",
              params: {
                roleName: this.formData.roleName,
                sensitiveFields: this.formData.sensitiveFields.join(","),
                canSeeAllOrder: this.formData.canSeeAllOrder
              },
              success: res => {
                this.$message.success(res);
                this.getList();
                this.close();
              }
            });
          }
        } else {
          this.$message.error("请填写完整信息");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.Form.resetFields();
    },
    handleDialogClose() {
      this.$refs.Form.resetFields();
    },
    deletes(id) {
      this.$confirm("是否删除该角色？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.loading) return;
        this.loading = true;
        this.$request.post({
          url: "/admin/adRole/delete",
          params: {
            id
          },
          success: res => {
            this.loading = false;
            this.$message.success(res);
            this.getList();
          },
          finally: () => {
            this.loading = false;
          }
        });
      });
    },
    updata(e) {
      this.getSensitiveFields();
      this.isYwyId = e.id;
      if (!e.sensitiveFields) {
        this.$message.info("该角色没有分配敏感字段权限");
        return false;
      }
      if (typeof e.sensitiveFields === "string") {
        e.sensitiveFields = e.sensitiveFields.split(",");
        const fieldMap = new Map([
          ["cost", "成本"],
          ["cost_detail", "成本详情"],
          ["receive_amount", "收款金额"],
          ["receive_detail", "收款详情"],
          ["not_receive_amount", "未收款"],
          ["profit", "毛利"],
          ["paid_amount", "已支付"],
          ["not_pay_amount", "未支付"]
        ]);
        e.sensitiveFields = e.sensitiveFields.map(field => fieldMap.get(field));
      }
      this.formData = JSON.parse(JSON.stringify(e));
      this.getList();
    },
    openAuth(row) {
      this.roleId = row.id;
      this.$request.post({
        url: "admin/adRole/getRoleMenuId",
        params: {
          roleId: row.id
        },
        success: res => {
          if (res) {
            this.dialogAuth = true;
            this.$nextTick(() => {
              this.$refs.menu.setCheckedKeys(res);
            });
          }
        }
      });
    },
    getList() {
      if (this.loading) return;
      this.loading = true;
      this.$request.post({
        // url: "/admin/adRole/list",
        url: "/admin/adRole/list_role",
        params: this.params,
        success: res => {
          this.list = res.list;
          this.total = res.total;
        },
        finally: err => {
          this.loading = false;
        }
      });
    },
    onOpen() {
      this.getSensitiveFields();
      this.formData = {
        sensitiveFields: [],
        canSeeAllOrder: false,
        roleName: ""
      };
    },

    onClose() {
      this.$refs["Form"].resetFields();
    },
    close() {
      this.visible = false;
      this.$refs["Form"].resetFields();
    },
    closeMenu() {
      this.dialogAuth = false;
    },
    getTreeData() {
      this.$request.post({
        // url: "admin/adMenu/allList",
        url: "/admin/adMenu/allList_role",
        success: res => {
          this.menuData = res;

          var menuMap = {};
          // 获取根节点数据
          let data = res.filter(value => value.parentId == -1);
          let parents = [];
          data.forEach(item => {
            if (item.menuName != "权限管理") {
              parents.push({
                id: item.id,
                label: item.menuName,
                level: item.level
              });
            }
          });

          // 获取子节点数据
          let childrens = res.filter(value => value.parentId !== -1);

          // 生成树
          this.menuData = this.$common.translator(
            parents,
            childrens,
            current => {
              // 定义树结构
              return {
                id: current.id,
                label: current.menuName + (current.flag == 2 ? "  (接口)" : ""),
                children: current.children,
                disabled: parent.id == 24 || parent.id == 25 || parent.id == 26
              };
            }
          );
        }
      });
    },
    setMenuData() {
      let arr = this.$refs.menu.getCheckedNodes(false, true);
      if (arr.length < 1) {
        this.$message.success("请选择需要分配权限的菜单");
        return;
      }
      var menuIds = [];
      arr.forEach(item => {
        menuIds.push(item.id);
      });
      this.$request.post({
        url: "/admin/adRole/setRoleMenu",
        type: "array",
        params: {
          roleId: this.roleId,
          menuIds
        },
        success: res => {
          this.$message.success("设置成功");
        }
      });
      this.dialogAuth = false;
    }
  }
};
</script>
<style scoped>
.main_content {
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
<style>
.el-form--inline .el-form-item {
  height: 15px;
}
</style>
