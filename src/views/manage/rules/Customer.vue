<template>
  <!-- 客户资料 -->
  <div id="box">
    <main-content>
      <el-form :inline="true">
        <el-form-item>
          <el-input
            size="mini"
            placeholder="请输入客户名称"
            v-model.trim="params.name"
            :clearable="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="区域：">
          <el-input
            size="mini"
            placeholder="请输入区域"
            v-model.trim="params.area"
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
        type="primary"
        size="mini"
        @click="insertEvent"
        >新增</el-button
      >
      <div class="table-container">
        <el-table
          border
          resizable
          ref="elTable"
          row-key="id"
          style="height: 100%;max-height: 750px"
          max-height="650"
          size="mini"
          :data="tableData"
        >
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="name" label="客户名称"></el-table-column>
          <el-table-column prop="contacter" label="联系人"></el-table-column>
          <el-table-column prop="phone" label="电话"></el-table-column>
          <el-table-column prop="adName" label="业务员"></el-table-column>
          <el-table-column prop="area" label="归属区域"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="editEvent(row)"
                >修改</el-button
              >
              <el-button
                style="color: red"
                size="mini"
                type="text"
                @click="removeEvent(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <el-dialog
      :title="Form.id ? '编辑' : '添加'"
      :visible.sync="dialogVisible"
      width="40%"
      @close="clear"
    >
      <el-form
        ref="Form"
        :model="Form"
        :rules="rules"
        :label-width="labelWidth"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称：" prop="name">
              <el-input
                v-model.trim="Form.name"
                placeholder="请输入客户名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="地址：" prop="address">
              <el-input
                v-model.trim="Form.address"
                placeholder="请输入地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="业务员：" prop="adId">
              <el-select
                filterable
                clearable
                v-model="Form.adId"
                placeholder="请选择业务员"
                style="width: 100%"
              >
                <el-option
                  v-for="item in salespersonOptions"
                  :key="item.id"
                  :label="item.remark"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人：" prop="contacter">
              <el-input
                v-model.trim="Form.contacter"
                placeholder="请输入联系人"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="phone">
              <el-input
                v-model.trim="Form.phone"
                placeholder="请输入电话"
                maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item label="区域：" prop="area">
              <el-input
                v-model.trim="Form.area"
                placeholder="请输入区域"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="center" style="margin-top: 10px;">
          <el-button @click="clear">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from "lodash";

export default {
  data() {
    return {
      rowkey: "id",
      labelWidth: "100px",
      scrollPosition: 0,
      salespersonOptions: [],
      Form: {
        id: "",
        name: "",
        contacter: "",
        address: "",
        phone: "",
        adId: "",
        area: ""
      },
      rules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        adId: [{ required: true, message: "请选择业务员", trigger: "blur" }]
      },
      dialogVisible: false,
      disabled: false,
      tableData: [],
      params: {
        pageSize: 50,
        pageNo: 1,
        startTime: "",
        endTime: "",
        keyWord: "",
        id: "",
        sortKey: "",
        isCount: true,
        name: "",
        area: ""
      },
      searchParams: {
        pageSize: 5000,
        pageNo: 1,
        startTime: "",
        endTime: "",
        keyWord: "",
        id: "",
        sortKey: "",
        isCount: true,
        name: "",
        area: ""
      },
      loading: false,
      list: [],
      total: 0,
      pages: 0
    };
  },
  created() {
    this.getPage();
    this.getAdList();
  },
  mounted() {
    const tableEl = this.$refs.elTable.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableEl.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    const tableEl = this.$refs.elTable.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableEl.removeEventListener("scroll", this.handleScroll); // 在组件销毁之前移除事件监听器
  },
  methods: {
    // 设置延时为300ms，可以根据实际情况调整
    handleScroll: debounce(function() {
      const tableEl = this.$refs.elTable.$el.querySelector(
        ".el-table__body-wrapper"
      );
      if (
        tableEl.scrollTop + tableEl.clientHeight + 10 >=
        tableEl.scrollHeight
      ) {
        this.loading = true;
        setTimeout(() => {
          this.loadData().then(() => {
            this.loading = false;
            this.scrollPosition = tableEl.scrollTop;
            if (this.pages > this.params.pageNo) {
              this.params.pageNo += 1;
              this.getPageList();
            }
          });
        }, 100);
      }
    }, 300), // 设置延时为300ms，可以根据实际情况调整
    async loadData() {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.$refs.elTable.$el.removeEventListener("scroll", this.handleScroll);
    },
    // 获取业务员数据
    getAdList() {
      this.$request.post({
        // url: "/admin/adInfo/list",
        url: "/admin/adInfo/list_customer_user",
        params: this.searchParams,
        success: res => {
          this.salespersonOptions = res.list.filter(
            item => item.roleName === "业务员"
          );
        }
      });
    },
    formatDate(date) {
      return this.$moment(date).format("YYYY-MM-DD");
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
    reset() {
      this.params = {
        pageNo: 1,
        pageSize: 50,
        startTime: "",
        endTime: "",
        keyWord: "",
        id: "",
        sortKey: "",
        isCount: true,
        name: "",
        area: ""
      };
      this.getPage();
    },
    getPage() {
      this.loading = true;
      this.$request.post({
        // url:'/system/sysCustomer/admin/list',
        url: "/system/sysCustomer/admin/list_customer",
        params: this.params,
        success: res => {
          this.loading = false;
          this.tableData = res.list;
          this.total = res.total;
          this.pages = res.pages;
        }
      });
    },
    getPageList() {
      this.loading = true;
      this.$request.post({
        url: "/system/sysCustomer/admin/list_customer",
        params: this.params,
        success: res => {
          if (res.list.length === 0 && this.tableData.length > 0) {
            this.$message.info("没有更多数据了");
            return;
          }
          if (res.list.length > 0) {
            res.list.forEach(item => {
              this.tableData.push(item);
            });
          }
          this.pages = res.pages;
          this.total = res.total;
          this.loading = false;
        }
      });
    },
    insertEvent() {
      this.Form = {
        id: "",
        name: "",
        contacter: "",
        address: "",
        phone: "",
        adId: "",
        area: ""
      };
      this.dialogVisible = true;
    },
    editEvent(row) {
      this.Form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    removeEvent(row) {
      this.$confirm("此操作将永久删除客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            url: "/system/sysCustomer/admin/delete",
            params: { id: row.id },
            success: res => {
              this.$message.success(res);
              this.getPage();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submit() {
      if (this.Form.name == "") {
        this.$message.error("请输入客户名称");
        return false;
      }
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.$request.post({
            url: "/system/sysCustomer/admin/addOrUpdate",
            params: this.Form,
            success: res => {
              this.$message.success(res);
              this.getPage();
              this.dialogVisible = false;
            }
          });
        } else {
          // 表单验证不通过，提示错误信息
          this.$message.error("请正确输入信息");
        }
      });
    },
    clear() {
      this.Form = {
        id: "",
        name: "",
        contacter: "",
        address: "",
        phone: "",
        adId: "",
        area: ""
      };
      this.dialogVisible = false;
    }
  }
};
</script>
<style>
.el-form--inline .el-form-item {
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
