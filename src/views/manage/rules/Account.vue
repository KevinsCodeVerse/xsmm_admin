<template>
  <!-- 账号管理 -->
  <div id="box">
    <main-content>
      <el-form :inline="true">
        <el-form-item>
          <el-input
            size="mini"
            placeholder="输入姓名"
            v-model.trim="params.name"
            :clearable="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button
        style="margin: 0 0 10px 0"
        size="mini"
        type="primary"
        @click="openAddForm"
        >新增</el-button
      >
      <el-table
        size="mini"
        border
        resizable
        row-key="id"
        style="height: 100%;max-height: 750px"
        max-height="650"
        :data="tableData"
      >
        <el-table-column prop="remark" label="姓名"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="setupdateForm(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              style="color: red"
              @click="removeEvent(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        style="margin-top: 20px; display: flex; justify-content: flex-start"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="params.pageNo"
        :page-sizes="[50, 100, 150]"
        :page-size="params.pageSize"
        layout="total"
        :total="total"
      >
      </el-pagination>
    </main-content>
    <!-- 添加账号弹框 -->
    <el-dialog center title="添加账号" :visible.sync="addVisible" width="420px">
      <el-form
        ref="form"
        :model="addForm"
        label-width="100px"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="姓名">
          <el-input
            v-model="addForm.remark"
            placeholder="请填写姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            filterable
            clearable
            style="width: 100%"
            v-model="addForm.roleId"
            placeholder="请选择角色"
          >
            <!--            v-infinite-scroll="getRoleList"-->
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="addForm.account"
            placeholder="请输入账号"
            maxlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.password"
            type="password"
            placeholder="请输入密码"
            maxlength="18"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
            v-model="addForm.rePassword"
            type="password"
            placeholder="请再次输入密码"
            maxlength="18"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 修改账号弹框 -->
    <el-dialog
      center
      title="修改账号"
      :visible.sync="updateVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-Form
        ref="Form"
        :model="updateForm"
        label-width="100px"
        :rules="rules"
      >
        <el-Form-item label="角色" prop="roleId">
          <el-select
            filterable
            clearable
            style="width: 100%"
            v-model="updateForm.roleId"
            placeholder="请选择角色"
          >
            <!--            v-infinite-scroll="getRoleList"-->
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-Form-item>
        <el-Form-item label="账号" prop="account">
          <el-input
            v-model="updateForm.account"
            placeholder="请输入账号"
            maxlength="8"
          ></el-input>
        </el-Form-item>
        <el-Form-item label="修改密码?" prop="account">
          <el-radio-group v-model="isUpdPwd">
            <el-radio label="1">不修改</el-radio>
            <el-radio label="2">修改</el-radio>
          </el-radio-group>
        </el-Form-item>
        <el-Form-item label="密码" prop="password" v-show="isUpdPwd == 2">
          <el-input
            v-model="updateForm.password"
            type="password"
            placeholder="请输入密码"
            maxlength="18"
          ></el-input>
        </el-Form-item>
        <el-Form-item label="确认密码" prop="rePassword" v-show="isUpdPwd == 2">
          <el-input
            v-model="updateForm.rePassword"
            type="password"
            placeholder="请再次输入密码"
            maxlength="18"
          ></el-input>
        </el-Form-item>
        <el-Form-item label="姓名">
          <el-input
            v-model="updateForm.remark"
            placeholder="请填写姓名"
            maxlength="50"
          ></el-input>
        </el-Form-item>
      </el-Form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import rsa from "@/utils/rsa";

export default {
  data() {
    return {
      updateForm: {
        id: -1,
        roleId: "",
        account: "",
        password: "",
        rePassword: "",
        remark: ""
      },
      addForm: {
        id: -1,
        roleId: "",
        account: "",
        password: "",
        rePassword: "",
        remark: ""
      },
      rules: {
        roleId: {
          message: "请选择角色",
          required: true,
          trigger: "blur"
        },
        account: {
          message: "请输入账号",
          required: true,
          trigger: "blur"
        },
        password: {
          required: true,
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (
              (this.updateVisible && this.isUpdPwd == "2" && !value) ||
              (this.addVisible && !value)
            ) {
              callback(new Error("请输入密码"));
            } else if (
              (this.updateVisible &&
                this.isUpdPwd == "2" &&
                value &&
                (value.length < 6 || value.length > 20)) ||
              (this.addVisible &&
                value &&
                (value.length < 6 || value.length > 20))
            ) {
              callback(new Error("密码长度必须是6-20位"));
            } else {
              callback();
            }
          }
        },
        rePassword: {
          required: true,
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (
              (this.updateVisible && this.isUpdPwd == "2" && !value) ||
              (this.addVisible && !value)
            ) {
              callback(new Error("请再次输入密码"));
            } else if (this.addVisible && value !== this.addForm.password) {
              callback(new Error("两次输入密码不一致!"));
            } else if (
              this.updateVisible &&
              value !== this.updateForm.password &&
              this.isUpdPwd == "2"
            ) {
              callback(new Error("两次输入密码不一致!"));
            } else {
              callback();
            }
          }
        }
      },
      dialogVisible: false,
      dialogTitle: "",
      addVisible: false,
      updateVisible: false,
      // 是否修改密码
      isUpdPwd: "1",
      isAdd: 0,
      loading: false,
      load: false,
      roleList: [],
      roleParam: {
        pageNo: 0,
        pageSize: 100
      },
      params: {
        pageSize: 50,
        pageNo: 1,
        status: "",
        name: ""
      },
      tableData: [],
      total: 0,
      pages: 0
    };
  },
  created() {
    this.getPage();
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      this.$request.post({
        // url: "admin/adRole/list",
        url: "/admin/adRole/list_user_role",
        params: this.roleParam,
        success: result => {
          if (result && this.isAdd === 1) {
            this.addVisible = true;
            this.roleList = result.list;
            this.roleTotal = result.total;
          }
          if (result && this.isAdd === 2) {
            this.updateVisible = true;
            this.roleList = result.list;
            this.roleTotal = result.total;
          }
        },
        finally: () => {
          this.load = false;
        }
      });
    },
    handleCurrentChange(current) {
      this.params.pageNo = current;
      this.getPage();
    },
    handleSizeChange(size) {
      if (this.total <= 10) {
        return;
      }
      this.params.pageSize = size;
      this.search();
    },
    search() {
      this.params.pageNo = 1;
      this.getPage();
    },
    getPage() {
      this.loading = true;
      this.$request.post({
        // url: '/admin/adInfo/list',
        url: "/admin/adInfo/list_user",
        params: this.params,
        success: res => {
          this.loading = false;
          this.tableData = res.list;
          this.total = res.total;
        }
      });
    },
    // 打开添加窗口
    openAddForm() {
      this.isAdd = 1;
      this.getRoleList();
      this.reset();
    },
    // 重置表单信息
    resetSearch() {
      this.params = {
        pageSize: 50,
        pageNo: 1,
        status: "",
        name: ""
      };
      this.getPage();
    },
    reset() {
      this.addForm.remark = "";
      this.updateForm.roleId = "";
      this.updateForm.id = "";
      this.updateForm.account = "";
      this.updateForm.password = "";
      this.updateForm.rePassword = "";
      this.updateForm.remark = "";
      var setint = setInterval(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
          this.$refs.form.clearValidate();
          clearInterval(setint);
        }
      }, 100);
    },
    // 添加
    add() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.load = true;
          this.addVisible = false;
          this.$request.post({
            url: "admin/adInfo/add",
            params: {
              roleId: this.addForm.roleId,
              account: this.addForm.account,
              password: rsa.encryptByPublicKey(this.addForm.password),
              remark: this.addForm.remark
            },
            success: res => {
              this.$message.success("添加成功");
              this.addVisible = false;
              this.getPage();
            },
            finally: () => {
              this.load = false;
            }
          });
        }
      });
    },
    // 设置角色表单信息
    setupdateForm(data) {
      this.isAdd = 2;
      this.getRoleList();
      this.updateForm = {
        id: data.id,
        roleId: data.roleId,
        account: data.account,
        remark: data.remark
      };
    },

    // 修改
    update() {
      this.$refs["Form"].validate(valid => {
        if (!valid) {
          return;
        }
        if (this.load) {
          return;
        }
        this.updateVisible = false;
        this.load = true;
        this.$request.post({
          url: "admin/adInfo/update",
          params: {
            id: this.updateForm.id,
            roleId: this.updateForm.roleId,
            account: this.updateForm.account,
            password: this.updateForm.password
              ? rsa.encryptByPublicKey(this.updateForm.password)
              : "",
            remark: this.updateForm.remark
          },
          success: result => {
            this.$message.success("修改成功");
            this.reset();
            this.getPage();
          },
          finally: () => {
            this.load = false;
          }
        });
      });
    },

    // 删除
    removeEvent(id) {
      if (this.load) {
        return;
      }
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.load = true;
        this.$request.post({
          url: "admin/adInfo/delete",
          params: {
            id
          },
          success: result => {
            this.$message.success("删除成功");
            this.getPage();
          },
          finally: () => {
            this.load = false;
          }
        });
      });
    },
    submit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.$request.post({
            url: "/admin/adInfo/add",
            params: {
              roleId: this.addForm.roleId,
              account: this.addForm.account,
              password: rsa.encryptByPublicKey(this.addForm.password),
              remark: this.addForm.remark
            },
            success: res => {
              this.$message.success(res);
              this.getPage();
              this.clearForm();
              this.dialogVisible = false;
            }
          });
        } else {
          // 表单验证不通过，提示错误信息
          this.$message.error("请正确输入信息");
        }
      });
    }
  }
};
</script>

<style>
.el-Form--inline .el-Form-item {
  height: 15px;
}
.vxe-table--render-default .vxe-body--row.row--current {
  background-color: #f4f5f9 !important;
}
.new-upload .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.new-upload .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style>
<style lang="scss" scoped></style>
