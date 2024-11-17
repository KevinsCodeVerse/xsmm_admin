<template>
  <!-- 产品 -->
  <div id="box">
    <main-content>
      <el-form :inline="true">
        <el-form-item>
          <el-input
            size="mini"
            placeholder="输入产品名称"
            v-model.trim="params.name"
            :clearable="true"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button
        style="margin: 10px 0;"
        size="mini"
        type="primary"
        @click="insertEvent"
        >新增</el-button
      >
      <div class="table-container">
        <el-table
          border
          resizable
          show-overflow-tooltip
          style="height: 100%;max-height: 750px"
          max-height="650"
          size="mini"
          ref="elTable"
          row-key="id"
          :data="tableData"
        >
          <el-table-column prop="name" label="产品种类"></el-table-column>
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
      <el-dialog
        center
        :title="Form.id ? '编辑' : '添加'"
        :visible.sync="dialogVisible"
        width="30%"
        @close="clear"
      >
        <el-form
          label-position="left"
          ref="Form"
          label-width="100px"
          :model="Form"
          :rules="rules"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="产品种类：" prop="name">
                <el-input
                  v-model.trim="Form.name"
                  placeholder="请输入产品种类"
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
      scrollPosition: 0,
      Form: {
        name: "",
        id: ""
      },
      rules: {
        name: [{ required: true, message: "请输入产品种类", trigger: "blur" }]
      },
      dialogVisible: false,
      disabled: false,
      tableData: [],
      selectRow: null,
      params: {
        pageNo: 1,
        pageSize: 50,
        startTime: "",
        endTime: "",
        keyWord: "",
        id: "",
        sortKey: "",
        isCount: true,
        name: ""
      },
      loading: false,
      list: [],
      total: 0,
      pages: 0
    };
  },
  created() {
    // 初始化数据
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
      this.params.name = "";
      this.params.id = "";
      this.params.pageNo = 1;
      this.params.pageSize = 50;
      this.search();
    },
    getPage() {
      if (this.loading) return;
      this.loading = true;
      this.$request.post({
        url: "/system/sysProduct/admin/list",
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
      this.$request.post({
        url: "/system/sysProduct/admin/list",
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
          this.total = res.total;
          this.pages = res.pages;
        }
      });
    },
    insertEvent() {
      this.Form = {
        name: ""
      };
      this.dialogVisible = true;
    },
    editEvent(row) {
      this.Form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    removeEvent(row) {
      this.$confirm("此操作将永久删除该产品种类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            url: "/system/sysProduct/admin/delete",
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
            url: "/system/sysProduct/admin/addOrUpdate",
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
        name: "",
        id: ""
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
