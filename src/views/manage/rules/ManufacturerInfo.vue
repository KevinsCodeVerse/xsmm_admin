<template>
  <!--  厂家资料-->
  <div id="box">
    <main-content>
      <el-form :inline="true">
        <el-form-item>
          <el-input
            size="mini"
            placeholder="请输入厂家名称"
            v-model.trim="params.name"
            :clearable="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input
            size="mini"
            placeholder="请输入联系人"
            v-model.trim="params.contacter"
            :clearable="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="rest">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button
        style="margin:10px 0"
        size="mini"
        type="primary"
        @click="insertEvent"
        >新增</el-button
      >

      <el-table
        ref="elTable"
        size="mini"
        border
        resizable
        row-key="id"
        style="height: 100%;max-height: 750px"
        max-height="650"
        :data="tableData"
      >
        <el-table-column prop="name" label="厂家名称"></el-table-column>
        <el-table-column prop="contacter" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editEvent(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              style="color: red"
              @click="removeEvent(scope.row)"
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

      <el-dialog
        center
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
              <el-form-item label="厂家名称：" prop="name">
                <el-input
                  v-model.trim="Form.name"
                  placeholder="请输入厂家名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="地址：" prop="address">
                <el-input
                  v-model.trim="Form.address"
                  placeholder="请输入地址"
                ></el-input>
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
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <el-button @click="clear">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </div>
      </el-dialog>
    </main-content>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  data() {
    return {
      labelWidth: "100px",
      Form: {
        id: "", // 初始化 id 字段
        name: "", // 初始化 name 字段
        contacter: "", // 初始化 contacter 字段
        address: "", // 初始化 address 字段
        phone: "" // 初始化 phone 字段
      },
      // 定义验证规则
      rules: {
        name: [
          { required: true, message: "请输入厂家名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "厂家名称长度在 2 到 50 个字符之间",
            trigger: "blur"
          }
        ],
        phone: [{ required: false, message: "请输入电话", trigger: "blur" }]
      },
      dialogVisible: false,
      loading: false,
      tableData: [],
      scrollPosition: 0,
      params: {
        pageNo: 1,
        pageSize: 50,
        startTime: "",
        endTime: "",
        keyWord: "",
        id: "",
        sortKey: "",
        isCount: true,
        name: "",
        contacter: ""
      },
      total: 0,
      pages: 0
    };
  },
  created() {
    this.getPage();
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
      this.params.pageNo = 1;
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
        contacter: ""
      };
      // 进行查询逻辑...
      this.getPage();
    },
    getPage() {
      if (this.loading) return;
      this.loading = true;
      this.$request.post({
        // url:'/system/sysFactory/admin/list',
        url: "/system/sysFactory/admin/list_factory",
        params: this.params,
        success: res => {
          this.loading = false;
          this.tableData = res.list;
          this.pages = res.pages;
          this.total = res.total;
        }
      });
    },
    getPageList() {
      if (this.loading) return;
      this.loading = true;
      this.$request.post({
        url: "/system/sysFactory/admin/list",
        params: this.params,
        success: res => {
          this.loading = false;
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
        }
      });
    },
    insertEvent() {
      this.Form = {
        name: "",
        contacter: "",
        address: "",
        phone: ""
      };
      this.dialogVisible = true;
    },
    editEvent(row) {
      this.Form = JSON.parse(JSON.stringify(row));

      this.dialogVisible = true;
    },
    removeEvent(row) {
      this.$confirm("此操作将永久删除该厂家, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            url: "/system/sysFactory/admin/delete",
            params: { id: row.id },
            success: res => {
              this.$message.success(res);
              this.getPage();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    submit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.$request.post({
            url: "/system/sysFactory/admin/addOrUpdate",
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
    // 重置
    rest() {
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
        contacter: ""
      };
      this.getPage();
    },

    clear() {
      this.Form = {
        id: "",
        name: "",
        contacter: "",
        address: "",
        phone: ""
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
