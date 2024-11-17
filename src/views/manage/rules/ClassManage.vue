<template>
  <!--  分类管理-->
  <div id="box">
    <main-content>
      <div class="table-flex">
        <el-row :gutter="50">
          <!--          收入分类-->
          <el-col :lg="12" :md="12" :span="12">
            <el-table
              ref="elTableOne"
              size="mini"
              border
              resizable
              row-key="id"
              style="height: 100%;max-height: 750px"
              max-height="650"
              height="650"
              :data="tableDataOne"
            >
              <el-table-column align="center" width="400px">
                <template slot="header" slot-scope="scope">
                  <div style="display: flex;justify-content: space-evenly;">
                    <span style="margin: 2px 0;">收入分类</span>
                    <el-input
                      v-model="paramsOne.name"
                      style="width: 50%"
                      size="mini"
                      placeholder="分类名称"
                    />
                    <el-button type="primary" size="mini" @click="getPageOne"
                      >查询</el-button
                    >
                    <el-button size="mini" @click="resetOne">重置</el-button>
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-if="scope.$index === 0"
                    v-model="scope.row.name"
                    placeholder="请输入分类名称"
                    style="width: 100%; margin: 0 5px"
                    @blur="saveNameOne(scope.row)"
                    @input="inputChangeOne"
                  ></el-input>
                  <el-input
                    size="mini"
                    v-if="scope.$index > 0 && scope.row.isEdit === true"
                    v-model="scope.row.name"
                    placeholder="请编辑分类名称"
                    style="width: 100%; margin: 0 5px"
                    @blur="saveNameOne(scope.row)"
                    @input="inputChangeOne"
                  ></el-input>
                  <span
                    style="cursor: pointer"
                    v-if="scope.row.isEdit === false && scope.$index > 0"
                    @click="enterEditOne(scope.row)"
                    >{{ scope.row.name }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    style="width: 26px"
                    v-if="scope.$index === 0"
                    size="mini"
                    type="text"
                    @click.stop="addItemOne(scope.row)"
                    >新增</el-button
                  >
                  <el-button
                    v-if="scope.$index === 0"
                    style="color: #aaa;width: 26px"
                    size="mini"
                    type="text"
                    @click.stop="clearItemOne(scope.row)"
                    >清空</el-button
                  >
                  <el-button
                    style="width: 26px"
                    v-if="scope.row.isEdit === true && scope.$index !== 0"
                    size="mini"
                    type="text"
                    @click.stop="submitItemOne(scope.row)"
                    >确认</el-button
                  >
                  <el-button
                    v-if="scope.row.isEdit === true && scope.$index !== 0"
                    style="color: #aaa;width: 26px"
                    size="mini"
                    type="text"
                    @click.stop="closeItemOne(scope.row)"
                    >取消</el-button
                  >
                  <el-button
                    v-if="scope.row.isEdit === false && scope.$index !== 0"
                    size="mini"
                    type="text"
                    :class="openStatusOne === true ? 'disabled' : 'red'"
                    :disabled="openStatusOne === true"
                    @click.stop="removeItemOne(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              style="margin-top: 20px; display: flex; justify-content: flex-start"
              :current-page.sync="paramsOne.pageNo"
              :page-size="paramsOne.pageSize"
              layout="total"
              :total="totalOne"
            >
            </el-pagination>
          </el-col>
          <!--          支出分类-->
          <el-col :lg="12" :md="12" :span="12">
            <el-table
              ref="elTableTwo"
              size="mini"
              border
              resizable
              row-key="id"
              style="height: 100%;max-height: 750px"
              max-height="650"
              height="650"
              :data="tableDataTwo"
            >
              <el-table-column align="center" width="400px">
                <template slot="header" slot-scope="scope">
                  <div style="display: flex;justify-content: space-evenly;">
                    <span style="margin: 2px 0;">支出分类</span>
                    <el-input
                      v-model="paramsTwo.name"
                      style="width: 50%"
                      size="mini"
                      placeholder="分类名称"
                    />
                    <el-button type="primary" size="mini" @click="getPageTwo"
                      >查询</el-button
                    >
                    <el-button size="mini" @click="resetTwo">重置</el-button>
                  </div>
                </template>
                <template slot-scope="scope">
                  <span
                    style="cursor: pointer"
                    v-if="scope.row.isEdit === false && scope.$index !== 0"
                    @click="enterEditTwo(scope.row)"
                    >{{ scope.row.name }}</span
                  >
                  <el-input
                    size="mini"
                    v-if="scope.$index !== 0 && scope.row.isEdit === true"
                    v-model="scope.row.name"
                    placeholder="请输入分类名称"
                    style="width: 100%; margin: 0 5px"
                    @blur="saveNameTwo(scope.row)"
                    @input="inputChangeTwo"
                  ></el-input>
                  <el-input
                    @input="inputChangeTwo"
                    size="mini"
                    v-if="scope.$index === 0"
                    v-model="scope.row.name"
                    placeholder="请输入分类名称"
                    style="width: 100%; margin: 0 5px"
                    @blur="saveNameTwo(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.$index === 0"
                    size="mini"
                    type="text"
                    @click="addItemTwo(scope.row)"
                    >新增</el-button
                  >
                  <el-button
                    v-if="scope.$index === 0"
                    style="color: #aaa"
                    size="mini"
                    type="text"
                    @click="clearItemTwo(scope.row)"
                    >清空</el-button
                  >
                  <el-button
                    v-if="scope.row.isEdit === true && scope.$index !== 0"
                    size="mini"
                    type="text"
                    @click="submitItemTwo(scope.row)"
                    >确认</el-button
                  >
                  <el-button
                    v-if="scope.row.isEdit === true && scope.$index !== 0"
                    style="color: #aaa"
                    size="mini"
                    type="text"
                    @click="closeItemTwo(scope.row)"
                    >取消</el-button
                  >
                  <el-button
                    v-if="scope.row.isEdit === false && scope.$index !== 0"
                    size="mini"
                    type="text"
                    :class="openStatusTwo === true ? 'disabled' : 'red'"
                    :disabled="openStatusTwo === true"
                    @click="removeItemTwo(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              style="margin-top: 20px; display: flex; justify-content: flex-start"
              :current-page.sync="paramsTwo.pageNo"
              :page-size="paramsTwo.pageSize"
              layout="total"
              :total="totalTwo"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </main-content>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  data() {
    return {
      loading: false,
      openStatusOne: false,
      openStatusTwo: false,
      tableDataOne: [],
      tableDataTwo: [],
      scrollPositionOne: 0,
      scrollPositionTwo: 0,
      paramsOne: {
        id: "",
        pageNo: 1,
        pageSize: 50,
        isCount: true,
        name: "",
        type: 1
      },
      rowSaveOne: "",
      rowSaveTwo: "",
      SubmitDataOne: {
        id: "",
        name: "",
        type: 1
      },
      totalOne: 0,
      pagesOne: 0,
      paramsTwo: {
        id: "",
        pageNo: 1,
        pageSize: 50,
        isCount: true,
        name: "",
        type: 2
      },
      SubmitDataTwo: {
        id: "",
        name: "",
        type: 2
      },
      totalTwo: 0,
      pagesTwo: 0
    };
  },
  created() {
    this.getPageOne();
    this.getPageTwo();
  },
  mounted() {
    const tableElOne = this.$refs.elTableOne.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableElOne.addEventListener("scroll", this.handleScrollOne);

    const tableElTwo = this.$refs.elTableTwo.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableElTwo.addEventListener("scroll", this.handleScrollTwo);
  },
  beforeDestroy() {
    const tableElOne = this.$refs.elTableOne.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableElOne.removeEventListener("scroll", this.handleScrollOne);

    const tableElTwo = this.$refs.elTableTwo.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableElTwo.removeEventListener("scroll", this.handleScrollTwo);
  },
  methods: {
    // 收入分类
    getPageOne() {
      this.loading = true;
      this.$request.post({
        url: "/finance/financeCategory/list",
        params: this.paramsOne,
        success: res => {
          console.log("resOne", res);
          if (res.list.length === 0) {
            this.$message.info("暂无数据");
          }
          this.loading = false;
          res.list.forEach((item, index) => {
            item.isEdit = false;
          });
          this.tableDataOne = res.list;
          this.tableDataOne.unshift({ name: "", isEdit: true });
          console.log("this.tableDataOne", this.tableDataOne);
          this.pagesOne = res.pages;
          this.totalOne = res.total;
          this.openStatusOne = false;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    getPageListOne() {
      this.loading = true;
      this.$request.post({
        url: "/finance/financeCategory/list",
        params: this.paramsOne,
        success: res => {
          this.loading = false;
          if (res.list.length === 0 && this.tableDataOne.length > 0) {
            this.$message.info("没有更多数据了");
            return;
          }
          if (res.list.length > 0) {
            res.list.forEach(item => {
              item.isEdit = false;
              this.tableDataOne.push(item);
            });
          }
          this.pagesOne = res.pages;
          this.totalOne = res.total;
          this.openStatusOne = false;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },

    // 支出分类
    getPageTwo() {
      this.loading = true;
      this.$request.post({
        url: "/finance/financeCategory/list",
        params: this.paramsTwo,
        success: res => {
          console.log("resTwo", res);
          if (res.list.length === 0) {
            this.$message.info("暂无数据");
          }
          this.loading = false;
          res.list.forEach((item, index) => {
            item.isEdit = false;
          });
          this.tableDataTwo = res.list;
          this.tableDataTwo.unshift({ name: "", isEdit: true });
          console.log("this.tableDataTwo", this.tableDataTwo);
          this.pagesTwo = res.pages;
          this.totalTwo = res.total;
          this.openStatusTwo = false;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    getPageListTwo() {
      this.loading = true;
      this.$request.post({
        url: "/finance/financeCategory/list",
        params: this.paramsTwo,
        success: res => {
          this.loading = false;
          if (res.list.length === 0 && this.tableDataTwo.length > 0) {
            this.$message.info("没有更多数据了");
            return;
          }
          if (res.list.length > 0) {
            res.list.forEach(item => {
              item.isEdit = false;
              this.tableDataTwo.push(item);
            });
          }
          this.pagesTwo = res.pages;
          this.totalTwo = res.total;
          this.openStatusTwo = false;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },

    // 收入分类
    handleScrollOne: debounce(function() {
      const tableEl = this.$refs.elTableOne.$el.querySelector(
        ".el-table__body-wrapper"
      );
      if (
        tableEl.scrollTop + tableEl.clientHeight + 10 >=
        tableEl.scrollHeight
      ) {
        this.loading = true;
        setTimeout(() => {
          this.loadDataOne().then(() => {
            this.loading = false;
            this.scrollPositionOne = tableEl.scrollTop;
            if (this.pagesOne > this.paramsOne.pageNo) {
              this.paramsOne.pageNo += 1;
              this.getPageListOne();
            }
          });
        }, 100);
      }
    }, 300),
    async loadDataOne() {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.$refs.elTableOne.$el.removeEventListener(
        "scroll",
        this.handleScrollOne
      );
    },

    // 支出分类
    handleScrollTwo: debounce(function() {
      const tableEl = this.$refs.elTableTwo.$el.querySelector(
        ".el-table__body-wrapper"
      );
      console.log("tableEl", tableEl);
      console.log("tableEl.scrollTop", tableEl.scrollTop);
      console.log("tableEl.clientHeight", tableEl.clientHeight);
      if (
        tableEl.scrollTop + tableEl.clientHeight + 10 >=
        tableEl.scrollHeight
      ) {
        console.log("2222");
        this.loading = true;
        setTimeout(() => {
          this.loadDataTwo().then(() => {
            this.loading = false;
            this.scrollPositionTwo = tableEl.scrollTop;
            if (this.pagesTwo > this.paramsTwo.pageNo) {
              this.paramsTwo.pageNo += 1;
              this.getPageListTwo();
            }
          });
        }, 100);
      }
    }, 300),
    async loadDataTwo() {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.$refs.elTableTwo.$el.removeEventListener(
        "scroll",
        this.handleScrollTwo
      );
    },

    // 收入分类表格
    enterEditOne(row) {
      console.log("编辑row", row);
      if (this.openStatusOne === false) {
        row.isEdit = true;
        this.openStatusOne = true;
      }
      this.rowSaveOne = row.name;
    },
    saveNameOne(row) {
      console.log("row", row);
      if (row.name === "") {
        row.isEdit = false;
      }
    },
    inputChangeOne(row) {
      if (row.name !== "") {
      }
    },
    addItemOne(row) {
      if (row.name === "") {
        this.$message.error("请输入分类名称");
        return;
      } else {
        this.SubmitDataOne.name = row.name;
        this.$request.post({
          url: "/finance/financeCategory/add",
          params: this.SubmitDataOne,
          success: res => {
            row.name = "";
            this.$message.success(res);
            this.getPageOne();
            // this.$nextTick(() => {
            //   const tableEl = this.$refs.elTableOne.$el.querySelector(
            //     ".el-table__body-wrapper"
            //   );
            //   if (tableEl) {
            //     tableEl.scrollTop = tableEl.scrollHeight - tableEl.clientHeight;
            //   }
            // });
          }
        });
      }
      console.log("row新增", row);
    },
    clearItemOne(row) {
      console.log("row清空", row);
      row.name = "";
    },
    submitItemOne(row) {
      console.log("row确认", row);
      if (row.name === "") {
        this.$message.error("请输入分类名称");
      } else {
        this.SubmitDataOne.id = row.id;
        this.SubmitDataOne.name = row.name;
        this.$request.post({
          url: "/finance/financeCategory/add",
          params: this.SubmitDataOne,
          success: res => {
            this.$message.success("修改成功");
            this.getPageOne();
            this.openStatusOne = false;
            row.isEdit = false;
          }
        });
      }
    },
    closeItemOne(row) {
      console.log("row取消", row);
      // row.name = this.rowSaveOne;
      if (this.openStatusOne === true) {
        this.openStatusOne = false;
        row.isEdit = false;
      }
      this.getPageOne();
    },
    removeItemOne(row) {
      this.$confirm("是否确认将该分类永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            url: "/finance/financeCategory/delete",
            params: { id: row.id },
            success: res => {
              this.$message.success(res);
              this.getPageOne();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 支出分类表格
    enterEditTwo(row) {
      console.log("编辑row", row);
      this.rowSaveTwo = row.name;
      if (this.openStatusTwo === false) {
        row.isEdit = true;
        this.openStatusTwo = true;
      }
    },
    saveNameTwo(row) {
      console.log("row", row);
      if (row.name === "") {
        row.isEdit = false;
      }
    },
    inputChangeTwo(row) {
      if (row.name !== "") {
      }
    },
    addItemTwo(row) {
      if (row.name === "") {
        this.$message.error("请输入分类名称");
        return;
      } else {
        this.SubmitDataTwo.name = row.name;
        this.$request.post({
          url: "/finance/financeCategory/add",
          params: this.SubmitDataTwo,
          success: res => {
            row.name = "";
            this.$message.success(res);
            this.getPageTwo();
            // this.$nextTick(() => {
            //   const tableEl = this.$refs.elTableOne.$el.querySelector(
            //     ".el-table__body-wrapper"
            //   );
            //   if (tableEl) {
            //     tableEl.scrollTop = tableEl.scrollHeight - tableEl.clientHeight;
            //   }
            // });
          }
        });
      }
      console.log("row新增", row);
    },
    clearItemTwo(row) {
      console.log("row清空", row);
      row.name = "";
    },
    submitItemTwo(row) {
      if (row.name === "") {
        this.$message.error("请输入分类名称");
      } else {
        this.SubmitDataTwo.id = row.id;
        this.SubmitDataTwo.name = row.name;
        this.$request.post({
          url: "/finance/financeCategory/add",
          params: this.SubmitDataTwo,
          success: res => {
            this.$message.success("修改成功");
            this.getPageTwo();
            this.openStatusTwo = false;
            row.isEdit = false;
          }
        });
      }
    },
    closeItemTwo(row) {
      console.log("row取消", row);
      // row.name = this.rowSaveTwo;
      this.getPageTwo();
      if (this.openStatusTwo === true) {
        this.openStatusTwo = false;
        row.isEdit = false;
      }
    },
    removeItemTwo(row) {
      this.$confirm("是否确认将该分类永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            url: "/finance/financeCategory/delete",
            params: { id: row.id },
            success: res => {
              this.$message.success(res);
              this.getPageTwo();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    resetOne() {
      this.paramsOne.name = "";
      this.getPageOne();
    },
    resetTwo() {
      this.paramsTwo.name = "";
      this.getPageTwo();
    }
  }
};
</script>

<style>
.Twodisabled {
  color: #c0c4cc;
}
.Twored {
  color: red;
}
.disabled {
  color: #c0c4cc;
}
.red {
  color: red;
}
.error .el-input__inner {
  border-color: red;
}
.el-form--inline .el-form-item {
  height: 15px;
}
</style>
<style lang="scss" scoped>
.table-flex {
  .el-table {
    width: 100%;
  }
}
</style>
