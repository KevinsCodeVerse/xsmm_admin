<template>
  <!--  收入单-->
  <div id="box">
    <main-content>
      <el-form
        style="margin-bottom: 10px"
        :inline="true"
        :label-width="labelWidth"
      >
        <el-form-item label="登记时间：">
          <el-date-picker
            v-model="time"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            @change="handleDateChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收入对象：">
          <el-select
            v-el-select-Income="pushDataIncome"
            v-model.trim="params.revenueName"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请选择收入对象"
            @clear="clearIncomeId"
            :remote-method="ListIncome"
            :loading="loading"
            size="mini"
          >
            <el-option
              v-for="item in IncomeUserList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经手人：">
          <el-select
            v-el-select-handler="pushDataHandler"
            v-model.trim="params.handlerName"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入经手人"
            :remote-method="ListHandler"
            @clear="clearHandlerId"
            :loading="loading"
            size="mini"
          >
            <el-option
              v-for="item in HandlerList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类：">
          <el-select
            v-model.trim="params.categoryId"
            v-el-select-Category="pushDataIncomeCategory"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入分类"
            :remote-method="ListGetIncomeCategory"
            @clear="clearCategoryId"
            :loading="loading"
            size="mini"
          >
            <el-option
              v-for="item in IncomeCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="getPage"
            >查询</el-button
          >
          <el-button size="mini" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        ref="elTable"
        size="mini"
        border
        resizable
        row-key="id"
        style="height: 100%;max-height: 750px"
        max-height="550"
        :data="tableData"
      >
        <el-table-column align="center" label="登记日期" width="120px">
          <template slot-scope="scope">
            <span v-if="scope.$index === 0">
              {{ $moment(new Date()).format("YYYY-MM-DD") }}</span
            >
            <span v-if="scope.row.createTime">
              {{ $moment(scope.row.createTime).format("YYYY-MM-DD") }}</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款日期" width="170px">
          <template slot-scope="scope">
            <el-date-picker
              v-if="scope.$index === 0"
              v-model="scope.row.receiptDate"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              size="mini"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-date-picker
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              v-model="scope.row.receiptDate"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              size="mini"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEditReceiptDate(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.receiptDate">
                {{ scope.row.receiptDate }}</span
              >
              <span style="cursor: pointer;width: 50px;" v-else>&nbsp;</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-if="scope.$index === 0"
              v-model.trim="scope.row.amount"
              placeholder="请输入金额"
              style="width: 100%; margin: 0 5px"
              @input="
                scope.row.amount = scope.row.amount
                  .replace(/[^\d.]/g, '')
                  .replace(/\.{2,}/g, '.')
                  .replace(/^0+(\d)/g, '$1')
              "
            ></el-input>
            <el-input
              size="mini"
              v-if="scope.$index !== 0 && scope.row.isEdit === true"
              v-model.trim="scope.row.amount"
              placeholder="请输入金额"
              style="width: 100%; margin: 0 5px"
              @input="
                scope.row.amount = scope.row.amount
                  .replace(/[^\d.]/g, '')
                  .replace(/\.{2,}/g, '.')
                  .replace(/^0+(\d)/g, '$1')
              "
            ></el-input>

            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEdit(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.amount"> {{ scope.row.amount }}</span>
              <span style="cursor: pointer;width: 50px;" v-else>&nbsp;</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收入对象">
          <template slot-scope="scope">
            <el-select
              v-if="scope.$index === 0"
              v-el-select-Income="pushDataIncome"
              v-model.trim="scope.row.revenueName"
              clearable
              filterable
              remote
              allow-create
              reserve-keyword
              placeholder="请选择收入对象"
              @clear="clearIncomeId"
              :remote-method="ListIncome"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in IncomeUserList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-select
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              v-el-select-Income="pushDataIncome"
              v-model.trim="scope.row.revenueName"
              clearable
              filterable
              remote
              allow-create
              reserve-keyword
              placeholder="请选择收入对象"
              @clear="clearIncomeId"
              :remote-method="ListIncome"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in IncomeUserList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEditRevenueName(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.revenueName">
                {{ scope.row.revenueName }}</span
              >
              <span style="cursor: pointer;width: 50px;" v-else>&nbsp;</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="内容或单号" width="200px">
          <template slot-scope="scope">
            <el-input
              v-if="scope.$index === 0"
              size="mini"
              type="textarea"
              :rows="1"
              v-model="scope.row.content"
              placeholder="请输入内容或单号"
              maxlength="30"
            >
            </el-input>
            <el-input
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              size="mini"
              type="textarea"
              :rows="1"
              v-model="scope.row.content"
              placeholder="请输入内容或单号"
              maxlength="30"
            >
            </el-input>

            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEditContent(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.content"> {{ scope.row.content }}</span>
              <span style="cursor: pointer;width: 50px;" v-else>&nbsp;</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="经手人">
          <template slot-scope="scope">
            <el-select
              v-if="scope.$index === 0"
              v-el-select-handler="pushDataHandler"
              v-model.trim="scope.row.handlerName"
              clearable
              filterable
              remote
              allow-create
              reserve-keyword
              placeholder="请选择经手人"
              @clear="clearHandlerId"
              :remote-method="ListHandler"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in HandlerList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-select
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              v-el-select-handler="pushDataHandler"
              v-model.trim="scope.row.handlerName"
              clearable
              filterable
              remote
              allow-create
              reserve-keyword
              placeholder="请选择经手人"
              @clear="clearHandlerId"
              :remote-method="ListHandler"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in HandlerList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEditHandler(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.handlerName">
                {{ scope.row.handlerName }}</span
              >
              <span style="cursor: pointer;width: 50px;" v-else>&nbsp;</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分类">
          <template slot-scope="scope">
            <el-select
              v-el-select-Category="pushDataIncomeCategory"
              v-model.trim="scope.row.categoryId"
              v-if="scope.$index === 0"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请选择分类"
              :remote-method="ListGetIncomeCategory"
              @clear="clearCategoryId"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in IncomeCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-el-select-Category="pushDataIncomeCategory"
              v-model.trim="scope.row.categoryId"
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请选择分类"
              :remote-method="ListGetIncomeCategory"
              @clear="clearCategoryId"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in IncomeCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>

            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEditCategoryId(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.categoryId">
                {{ scope.row.categoryName }}</span
              >
              <span
                @click="enterEditCategoryId(scope.row)"
                style="cursor: pointer;width: 50px;"
                v-else
                >&nbsp;</span
              >
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="图片">
          <template slot-scope="scope">
            <!--            表格第一行-->
            <el-button
              v-if="
                scope.row.images.length === 0 &&
                  scope.row.isEdit === true &&
                  scope.$index === 0
              "
              size="mini"
              type="text"
              :disabled="addToken === 2"
              @click="openUpload(scope.row, scope.$index)"
              >上传</el-button
            >

            <!--              编辑状态-->
            <el-button
              type="text"
              size="mini"
              @click="editImages(scope.row)"
              v-if="
                fileList.length > 0 &&
                  scope.row.isEdit === true &&
                  scope.$index !== 0 &&
                  scope.row.images.length > 0
              "
              >{{ fileList.length }}张(点击修改)</el-button
            >

            <span
              v-else
              style="cursor: pointer;"
              @click="openImages(scope.row)"
            >
              <el-button
                type="text"
                size="mini"
                @click="editImages(scope.row)"
                v-if="
                  fileList.length > 0 &&
                    scope.row.isEdit === true &&
                    scope.$index !== 0 &&
                    scope.row.images.length > 0
                "
                >{{ fileList.length }}张(点击修改)</el-button
              >

              <span
                @click="editImages(scope.row)"
                v-if="scope.row.images.length && scope.$index !== 0"
              >
                {{ scope.row.images.length }}张</span
              >
              <el-button
                v-if="scope.row.images.length === 0 && scope.$index !== 0"
                size="mini"
                type="text"
                :disabled="scope.row.isEdit === false"
                @click="openUpload(scope.row, scope.$index)"
                >上传</el-button
              >
              <!--               :disabled="scope.$index"-->
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收入备注" width="200">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              :rows="1"
              v-if="scope.$index === 0"
              size="mini"
              v-model="scope.row.remark"
              placeholder="请输入收入备注"
              maxlength="100"
            >
              <!--              @focus="openRemark(scope.row)"-->
            </el-input>
            <el-input
              type="textarea"
              :rows="1"
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              size="mini"
              v-model="scope.row.remark"
              placeholder="请输入收入备注"
              maxlength="100"
            >
              <!--              @focus="openRemark(scope.row)"-->
            </el-input>
            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEditRemark(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.remark"> {{ scope.row.remark }}</span>
              <span style="cursor: pointer;width: 50px;" v-else>&nbsp;</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.$index === 0"
              size="mini"
              type="text"
              @click="addItem(scope.row)"
              >新增</el-button
            >
            <el-button
              v-if="scope.$index === 0"
              style="color: #aaa"
              size="mini"
              type="text"
              @click="clearItem(scope.row)"
              >清空</el-button
            >
            <el-button
              v-if="scope.row.isEdit === true && scope.$index !== 0"
              size="mini"
              type="text"
              @click="submitItem(scope.row)"
              >确认</el-button
            >
            <el-button
              v-if="scope.row.isEdit === true && scope.$index !== 0"
              style="color: #aaa"
              size="mini"
              type="text"
              @click="closeItem(scope.row)"
              >取消</el-button
            >
            <el-button
              v-if="scope.row.isEdit === false && scope.$index !== 0"
              size="mini"
              type="text"
              :class="openStatus === true ? 'disabled' : 'red'"
              :disabled="openStatus === true"
              @click="removeItem(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="图片"
        :visible.sync="DialogVisible"
        width="90%"
        center
        append-to-body
        @close="closeDialog"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :close-on-press-escape="false"
        :show-close="false"
      >
        <el-upload
          class="order-upload"
          action="#"
          accept="image/*"
          list-type="picture-card"
          :on-change="handleCover"
          :on-exceed="handleExceed"
          :auto-upload="false"
          ref="uploadcover"
          :limit="3"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog
          center
          width="750px"
          append-to-body
          :visible.sync="imgDialog"
        >
          <el-image
            style="display:flex;width: 100%;height:100%;margin: 0 auto;"
            :preview-src-list="[dialogImageUrl]"
            :src="dialogImageUrl"
            alt=""
          />
        </el-dialog>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeImages">取 消</el-button>
          <el-button type="primary" @click="submitImages">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination
        background
        style="margin-top: 20px; display: flex; justify-content: flex-start"
        :current-page.sync="params.pageNo"
        :page-sizes="[50, 100, 150]"
        :page-size="params.pageSize"
        layout="total"
        :total="total"
      >
      </el-pagination>
    </main-content>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { fullPath } from "@/config/filtersConfig";
import uuid from "@/utils/getUid";

export default {
  computed: {
    fullPath() {
      return function(val) {
        return fullPath(val);
      };
    }
  },
  data() {
    return {
      closeRemark: false,
      remark: "",
      labelWidth: "100px",
      loading: false,
      disabled: false,
      dialogImageUrl: "",
      imgDialog: false,
      tableData: [],
      fileList: [],
      openStatus: false,
      addToken: 1,
      // 收入分类
      IncomeCategoryList: [],
      paramsCategory: {
        id: "",
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        name: "",
        type: 1
      },
      totalCategory: 0,
      // 收入对象
      paramsIncome: {
        name: "",
        type: 1,
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true,
        id: "",
        startTime: "",
        endTime: ""
      },
      totalIncome: 0,
      IncomeUserList: [],
      // 2 经手人
      paramsHandler: {
        name: "",
        type: 2, // 1 收入对象
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true,
        id: "",
        startTime: "",
        endTime: ""
      },
      totalHandler: 0,
      HandlerList: [],

      scrollPosition: 0,
      params: {
        pageNo: 1,
        pageSize: 50,
        isCount: true,
        id: "",
        name: "",
        categoryId: "",
        startTime: "",
        endTime: "",
        handlerName: "",
        revenueName: ""
      },
      DialogVisible: false,
      time: [new Date(), new Date()],
      total: 0,
      pages: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getPage();
    if (this.IncomeCategoryList.length === 0) {
      this.getIncomeCategory();
    }
    if (this.IncomeUserList.length === 0) {
      this.getIncomeList();
    }
    if (this.HandlerList.length === 0) {
      this.getHandlerList();
    }
  },
  mounted() {
    const tableEl = this.$refs.elTable.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableEl.addEventListener("scroll", this.handleScroll);
  },
  watch: {},
  directives: {
    "el-select-Category": {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    },
    "el-select-Income": {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    },
    "el-select-handler": {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    },
    "el-select-audit": {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    }
  },
  beforeDestroy() {
    const tableEl = this.$refs.elTable.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableEl.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 收入
    getPage() {
      this.loading = true;
      console.log("this.time", this.time);
      this.$request.post({
        url: "/finance/financeIncome/list",
        params: {
          ...this.params,
          startTime: this.time?.[0]
            ? this.$moment(this.time[0]).format("YYYY-MM-DD 00:00:00")
            : "",
          endTime: this.time?.[1]
            ? this.$moment(this.time[1]).format("YYYY-MM-DD 23:59:59")
            : ""
        },
        success: res => {
          console.log("tableDataList", res);
          if (res.list.length === 0) {
            this.$message.info("暂无数据");
          }
          this.loading = false;
          res.list.forEach((item, index) => {
            if (typeof item.images === "string" && item.images !== "") {
              item.images = item.images.trim().split(",");
            } else {
              item.images = [];
            }
            item.receiptDate = this.$moment(item.receiptDate).format(
              "YYYY-MM-DD"
            );
            item.isEdit = false;
          });
          this.tableData = res.list;
          this.tableData.unshift({
            amount: "",
            categoryId: "",
            content: "",
            handlerName: "",
            revenueName: "",
            images: [],
            receiptDate: new Date(),
            remark: "",
            isEdit: true,
            createTime: ""
          });
          console.log("this.tableData", this.tableData);
          this.pages = res.pages;
          this.total = res.total;
          this.openStatus = false;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    getPageList() {
      this.loading = true;
      this.$request.post({
        url: "/finance/financeIncome/list",
        params: {
          ...this.params,
          startTime: this.time?.[0]
            ? this.$moment(this.time[0]).format("YYYY-MM-DD 00:00:00")
            : "",
          endTime: this.time?.[1]
            ? this.$moment(this.time[1]).format("YYYY-MM-DD 23:59:59")
            : ""
        },
        success: res => {
          this.loading = false;
          if (res.list.length === 0 && this.tableData.length > 0) {
            this.$message.info("没有更多数据了");
            return;
          }
          if (res.list.length > 0) {
            res.list.forEach(item => {
              item.isEdit = false;
              item.receiptDate = this.$moment(item.receiptDate).format(
                "YYYY-MM-DD"
              );
              this.tableData.push(item);
            });
          }
          this.pages = res.pages;
          this.total = res.total;
          this.openStatus = false;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
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
    }, 300),
    async loadData() {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.$refs.elTable.$el.removeEventListener("scroll", this.handleScroll);
    },

    // 获取分类IncomeCategory
    pushDataIncomeCategory() {
      this.getIncomeCategory();
    },
    pushDataIncome() {
      this.getIncomeList();
    },
    pushDataHandler() {
      this.getHandlerList();
    },

    // 相关财务人员信息
    ListGetIncomeCategory(query) {
      if (query !== "") {
        this.$request.post({
          url: "/finance/financeCategory/list_income",
          params: {
            id: "",
            name: query,
            pageNo: 1,
            pageSize: 10,
            isCount: true,
            type: 1
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              if (res.list.length !== 0) {
                this.IncomeCategoryList = res.list;
              } else {
                this.IncomeCategoryList = [];
              }
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.IncomeCategoryList = [];
      }
    },
    ListIncome(query) {
      if (query !== "") {
        this.$request.post({
          url: "/finance/financeUser/list_income",
          params: {
            id: "",
            name: query,
            pageNo: 1,
            pageSize: 10,
            isCount: true,
            type: 1
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              if (res.list.length !== 0) {
                this.IncomeUserList = res.list;
              } else {
                this.IncomeUserList = [];
              }
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.IncomeUserList = [];
      }
      console.log("this.IncomeUserList", this.IncomeUserList);
    },

    ListHandler(query) {
      if (query !== "") {
        this.$request.post({
          url: "/finance/financeUser/list_income",
          params: {
            id: "",
            name: query,
            pageNo: 1,
            pageSize: 10,
            isCount: true,
            type: 2
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              if (res.list.length !== 0) {
                this.HandlerList = res.list;
              } else {
                this.HandlerList = [];
              }
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.HandlerList = [];
      }
    },

    // 获取分类
    getIncomeCategory() {
      if (
        this.paramsCategory.pageNo * this.paramsCategory.pageSize >=
          this.totalCategory &&
        this.totalCategory > 0
      ) {
        return;
      }
      this.paramsCategory.pageSize += 10;
      this.$request.post({
        url: "/finance/financeCategory/list_income",
        params: this.paramsCategory,
        success: res => {
          console.log("res", res);
          this.IncomeCategoryList = res.list;
          this.totalCategory = res.total;
        }
      });
    },
    // 获取收入对象
    getIncomeList() {
      if (
        this.paramsIncome.pageNo * this.paramsIncome.pageSize >=
          this.totalIncome &&
        this.totalIncome > 0
      ) {
        return;
      }
      this.paramsIncome.pageSize += 10;
      this.$request.post({
        url: "/finance/financeUser/list_income",
        params: this.paramsIncome,
        success: res => {
          console.log("res", res);
          this.totalIncome = res.total;
          this.IncomeUserList = res.list;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    // 获取经手人
    getHandlerList() {
      if (
        this.paramsHandler.pageNo * this.paramsHandler.pageSize >=
          this.totalHandler &&
        this.totalHandler > 0
      ) {
        return;
      }
      this.paramsHandler.pageSize += 10;
      this.$request.post({
        url: "/finance/financeUser/list_income",
        params: this.paramsHandler,
        success: res => {
          console.log("res", res);
          this.totalHandler = res.total;
          this.HandlerList = res.list;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },

    clearCategoryId() {
      this.$request.post({
        url: "/finance/financeCategory/list_income",
        params: this.paramsCategory,
        success: res => {
          console.log("res", res);
          this.IncomeCategoryList = res.list;
          this.totalCategory = res.total;
        }
      });
    },
    clearIncomeId() {
      this.$request.post({
        url: "/finance/financeUser/list_income",
        params: this.paramsIncome,
        success: res => {
          console.log("res", res);
          this.totalIncome = res.total;
          this.IncomeUserList = res.list;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    clearHandlerId() {
      this.$request.post({
        url: "/finance/financeUser/list_income",
        params: this.paramsHandler,
        success: res => {
          console.log("res", res);
          this.totalHandler = res.total;
          this.HandlerList = res.list;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },

    openUpload(row, index) {
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      if (index === 0) {
        this.addToken = 1;
      } else {
        this.addToken = 2;
      }
      this.DialogVisible = true;
      if (this.fileList.length === 0) {
        this.$nextTick(() => {
          this.$refs.uploadcover.uploadFiles = [];
          this.fileList = [];
        });
      }
    },
    editImages(row) {
      console.log("row.images", row.images);
      this.fileList = [];
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      this.DialogVisible = true;
      if (row.id) {
        let img = [];
        if (row.images?.length && row.images[0] !== "") {
          this.$nextTick(() => {
            this.$refs.uploadcover.uploadFiles = [];
            row.images.forEach(item => {
              let uid = uuid();
              img.push({
                url: item,
                uid: uid
              });
              this.$refs.uploadcover.uploadFiles.push({
                url: item,
                uid: uid
              });
            });
          });
        } else {
          row.images = [];
        }
        this.fileList = img;
        console.log("this.fileList编辑", this.fileList);
      }
    },
    closeDialog() {
      this.DialogVisible = false;
      this.openStatus = false;
    },
    openImages(row) {
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
        this.fileList = row.images;
      }
    },
    // 编辑日期
    enterEditReceiptDate(row) {
      if (this.openStatus === true) {
        this.$message.info("请先取消修改");
      }
      this.rowSaveOne = row.receiptDate;
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      this.fileList = row.images;
    },
    // 编辑金额
    enterEdit(row) {
      if (this.openStatus === true) {
        this.$message.info("请先取消修改");
      }
      console.log("编辑row", row);
      this.rowSaveOne = row.name;
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      this.fileList = row.images;
    },
    // 编辑收入对象
    enterEditRevenueName(row) {
      if (this.openStatus === true) {
        this.$message.info("请先取消修改");
      }
      console.log("编辑row", row);
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      this.fileList = row.images;
    },
    // 编辑内容
    enterEditContent(row) {
      if (this.openStatus === true) {
        this.$message.info("请先取消修改");
      }
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      this.fileList = row.images;
    },
    // 编辑经手人
    enterEditHandler(row) {
      if (this.openStatus === true) {
        this.$message.info("请先取消修改");
      }
      console.log("编辑经手人", row);
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      this.fileList = row.images;
    },
    // 编辑分类
    enterEditCategoryId(row) {
      if (this.openStatus === true) {
        this.$message.info("请先取消修改");
      }
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      this.fileList = row.images;
    },
    // 编辑备注
    enterEditRemark(row) {
      if (this.openStatus === true) {
        this.$message.info("请先取消修改");
      }
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      this.fileList = row.images;
    },
    // 新增
    addItem(row) {
      console.log("新增row", row);
      let validate = false;
      const validations = [
        { field: "amount", message: "请输入金额" },
        { field: "receiptDate", message: "请选择收款日期" },
        { field: "revenueName", message: "请选择收入对象" },
        { field: "content", message: "请输入内容或单号" },
        { field: "handlerName", message: "请选择经手人" },
        { field: "categoryId", message: "请选择分类" }
      ];
      for (const validation of validations) {
        if (
          row[validation.field] === "" ||
          row[validation.field] === undefined ||
          row[validation.field] === null
        ) {
          this.$message.error(validation.message);
          return;
        } else {
          validate = true;
        }
      }
      let images = "";
      if (this.fileList.length > 0) {
        images = this.fileList
          .map(item => {
            return item.url;
          })
          .join(",");
      }
      let params = {
        id: row.id ? row.id : "",
        amount: row.amount,
        categoryId: row.categoryId,
        content: row.content,
        handlerName: row.handlerName,
        images: images.length ? images : "",
        remark: row.remark,
        revenueName: row.revenueName,
        receiptDate: this.$moment(row.receiptDate).format("YYYY-MM-DD")
      };
      if (validate === true) {
        this.$request.post({
          url: "/finance/financeIncome/add",
          params,
          success: res => {
            if (res == "操作成功") {
              this.$message.success("新增成功");
              this.fileList = [];

              this.getPage();
            }
          }
        });

        console.log("row新增", row);
      }
    },
    // 清空
    clearItem(row) {
      console.log("row清空", row);
      row.name = "";
      row.amount = "";
      row.categoryId = "";
      row.content = "";
      row.handlerName = "";
      row.images = [];
      row.remark = "";
      row.revenueName = "";
      row.receiptDate = "";
    },
    // 编辑
    submitItem(row) {
      let validate = false;
      const validations = [
        { field: "amount", message: "请输入金额" },
        { field: "receiptDate", message: "请选择收款日期" },
        { field: "revenueName", message: "请选择收入对象" },
        { field: "content", message: "请输入内容或单号" },
        { field: "handlerName", message: "请选择经手人" },
        { field: "categoryId", message: "请选择分类" }
      ];
      for (const validation of validations) {
        if (
          row[validation.field] === "" ||
          row[validation.field] === undefined ||
          row[validation.field] === null
        ) {
          this.$message.error(validation.message);
          return;
        } else {
          validate = true;
        }
      }
      let images = "";
      if (this.fileList.length > 0) {
        images = this.fileList
          .map(item => {
            return item.url;
          })
          .join(",");
      }
      let params = {
        id: row.id,
        amount: row.amount,
        categoryId: row.categoryId,
        content: row.content,
        handlerName: row.handlerName,
        images: images.length ? images : "",
        remark: row.remark,
        revenueName: row.revenueName,
        receiptDate: this.$moment(row.receiptDate).format("YYYY-MM-DD")
      };

      let roleToken = sessionStorage.getItem("updateTodayDocument");
      let time1 = this.$moment(row.createTime).format("YYYY-MM-DD");
      let time2 = this.$moment(new Date()).format("YYYY-MM-DD");
      if (roleToken == "true") {
        if (time1 !== time2) {
          console.log("权限", row);
          this.$message.info("该角色只能修改今日的单据");
        } else {
          if (validate === true) {
            this.$request.post({
              url: "/finance/financeIncome/update",
              params,
              success: res => {
                if (res == "操作成功") {
                  this.$message.success("修改成功");
                  this.openStatus = false;
                  this.addToken = 1;
                  row.isEdit = false;

                  this.fileList = [];
                  this.getPage();
                }
              }
            });

            console.log("row新增", row);
          }
        }
      } else {
        if (validate === true) {
          this.$request.post({
            url: "/finance/financeIncome/update",
            params,
            success: res => {
              if (res == "操作成功") {
                this.$message.success("修改成功");
                this.openStatus = false;
                this.addToken = 1;
                row.isEdit = false;
                this.fileList = [];
                this.getPage();
              }
            }
          });

          console.log("row新增", row);
        }
      }
    },
    closeItem(row) {
      console.log("row取消", row);
      if (this.openStatus === true) {
        this.openStatus = false;
        row.isEdit = false;
      }
      this.addToken = 1;
      this.fileList = [];
      this.getPage();
    },
    removeItem(row) {
      this.$confirm("是否确认将该笔收入单据永久删除,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            url: "/finance/financeIncome/delete",
            params: { id: row.id },
            success: res => {
              this.$message.success(res);
              this.openStatus = false;
              this.addToken = 1;
              this.getPage();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    handleDateChange(date) {
      if (date) {
        this.params.startTime = date[0];
        this.params.endTime = date[1];
        console.log("date", date);
      }
    },
    handleExceed(files, fileList) {
      this.$message.info("最多上传3张图片");
    },
    handleCover(file, fileList) {
      let formData = new FormData();
      formData.append("files", file.raw);
      this.$request.post({
        url: "/finance/financeIncome/uploadImage",
        type: "form-data",
        params: formData,
        headers: {
          ContentType: "multipart/form-data"
        },
        success: res => {
          console.log("res", res);
          if (res) {
            this.fileList.push({
              url: fullPath(res),
              uid: file.uid
            });
            this.$message.success("上传成功");
          }
        }
      });
    },
    submitImages() {
      console.log("this.fileList", this.fileList);
      this.DialogVisible = false;
    },
    closeImages() {
      this.DialogVisible = false;
    },
    handleRemove(file) {
      let uid = file.uid;
      this.fileList.forEach((item, i) => {
        if (item.uid === uid) {
          let index = i;
          if (index > -1) {
            this.fileList.splice(index, 1);
            this.$refs.uploadcover.uploadFiles.splice(index, 1);
          }
        }
      });
    },
    handlePictureCardPreview(file) {
      console.log("file", file);
      this.imgDialog = true;
      this.dialogImageUrl = file.url;
    },
    // 重置
    clear() {
      this.params = {
        pageNo: 1,
        pageSize: 50,
        isCount: true,
        id: "",
        name: "",
        categoryId: "",
        startTime: "",
        endTime: "",
        handlerName: "",
        revenueName: ""
      };
      this.time = [new Date(), new Date()];
      this.getPage();
    }
  }
};
</script>

<style>
.order-upload .el-upload--picture-card {
  width: 500px;
  height: 500px;
  line-height: 500px;
}
.disabled {
  color: #c0c4cc;
}
.red {
  color: red;
}
.order-upload .el-upload-list--picture-card .el-upload-list__item {
  width: 500px;
  height: 500px;
  line-height: 500px;
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
