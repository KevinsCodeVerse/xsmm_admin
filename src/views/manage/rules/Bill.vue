<template>
  <!--  支出单-->
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
            size="mini"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDateChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支出对象：">
          <el-select
            v-el-select-Income="pushDataExpense"
            v-model.trim="params.payTargetName"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请选择支出对象"
            :remote-method="ListExpense"
            @clear="clearExpense"
            :loading="loading"
            size="mini"
          >
            <el-option
              v-for="item in ExpenseList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核人：">
          <el-select
            v-el-select-audit="pushDataAudit"
            v-model.trim="params.auditerName"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请选择审核人"
            @clear="clearAudit"
            :remote-method="ListAudit"
            :loading="loading"
            size="mini"
          >
            <el-option
              v-for="item in AuditList"
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
            @clear="clearHandler"
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
            @clear="clearCategoryId"
            :remote-method="ListGetIncomeCategory"
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
        <el-table-column align="center" label="支付日期" width="170px">
          <template slot-scope="scope">
            <el-date-picker
              v-if="scope.$index === 0"
              v-model="scope.row.payDate"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              size="mini"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-date-picker
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              v-model="scope.row.payDate"
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
              <span v-if="scope.row.payDate"> {{ scope.row.payDate }}</span>
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
        <el-table-column align="center" label="支出对象">
          <template slot-scope="scope">
            <el-select
              v-if="scope.$index === 0"
              v-el-select-Income="pushDataExpense"
              v-model="scope.row.payTargetName"
              clearable
              filterable
              remote
              allow-create
              reserve-keyword
              placeholder="请选择支出对象"
              @clear="clearExpense"
              :remote-method="ListExpense"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in ExpenseList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-select
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              v-el-select-Income="pushDataExpense"
              v-model.trim="scope.row.payTargetName"
              clearable
              filterable
              @clear="clearExpense"
              remote
              allow-create
              reserve-keyword
              placeholder="请选择支出对象"
              :remote-method="ListExpense"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in ExpenseList"
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
              <span v-if="scope.row.payTargetName">
                {{ scope.row.payTargetName }}</span
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
        <el-table-column align="center" label="审核人(付款人)">
          <template slot-scope="scope">
            <el-select
              v-if="scope.$index === 0"
              v-model="scope.row.auditerName"
              allow-create
              v-el-select-audit="pushDataAudit"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请选择审核人"
              :remote-method="ListAudit"
              @clear="clearAudit"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in AuditList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-select
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              v-model="scope.row.auditerName"
              allow-create
              v-el-select-audit="pushDataAudit"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请选择审核人"
              :remote-method="ListAudit"
              @clear="clearAudit"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in AuditList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEditAudit(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.auditerName">
                {{ scope.row.auditerName }}</span
              >
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
              :remote-method="ListHandler"
              @clear="clearHandler"
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
              :remote-method="ListHandler"
              @clear="clearHandler"
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
        <el-table-column align="center" label="支出分类">
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
              v-if="scope.row.images.length === 0 && scope.$index === 0"
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
                @click.stop="editImages(scope.row)"
                v-if="scope.row.images.length && scope.$index !== 0"
              >
                {{ scope.row.images.length }}张</span
              >
              <el-button
                v-if="scope.row.images.length === 0 && scope.$index !== 0"
                size="mini"
                type="text"
                :disabled="scope.row.isEdit === false && scope.$index !== 0"
                @click.stop="openUpload(scope.row, scope.$index)"
                >上传</el-button
              >
              <!--               :disabled="scope.$index"-->
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支出凭证或编号" width="200">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              :rows="1"
              v-if="scope.$index === 0"
              size="mini"
              v-model="scope.row.paymentNo"
              placeholder="请输入支出凭证或编号"
              maxlength="100"
            >
              <!--              @focus="openRemark(scope.row)"-->
            </el-input>
            <el-input
              type="textarea"
              :rows="1"
              v-if="scope.$index > 0 && scope.row.isEdit === true"
              size="mini"
              v-model="scope.row.paymentNo"
              placeholder="请输入支出凭证或编号"
              maxlength="100"
            >
              <!--              @focus="openRemark(scope.row)"-->
            </el-input>
            <span
              style="cursor: pointer;width: 100%;display: inline-block;"
              @click="enterEditRemark(scope.row)"
              v-if="scope.row.isEdit === false && scope.$index > 0"
            >
              <span v-if="scope.row.paymentNo"> {{ scope.row.paymentNo }}</span>
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
      showImagesList: [],
      openStatus: false,
      addToken: 1,
      // 支出分类
      IncomeCategoryList: [],
      paramsCategory: {
        id: "",
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        name: "",
        type: 2
      },
      totalCategory: 0,
      // 2 经手人
      paramsHandler: {
        name: "",
        type: 2, // 1 支出对象
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
      // 3 支出对象
      paramsExpense: {
        name: "",
        type: 3,
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true,
        id: "",
        startTime: "",
        endTime: ""
      },
      totalExpense: 0,
      ExpenseList: [],
      // 4 审核人
      paramsAudit: {
        name: "",
        type: 4,
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true,
        id: "",
        startTime: "",
        endTime: ""
      },
      totalAudit: 0,
      AuditList: [],
      scrollPosition: 0,
      params: {
        pageNo: 1,
        pageSize: 50,
        auditerName: "",
        isCount: true,
        id: "",
        name: "",
        categoryId: "",
        startTime: "",
        endTime: "",
        handlerName: "",
        payTargetName: ""
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

    this.getIncomeCategory();

    this.getExpenseList();

    this.getHandlerList();

    this.getAuditList();
  },
  mounted() {
    const tableEl = this.$refs.elTable.$el.querySelector(
      ".el-table__body-wrapper"
    );
    tableEl.addEventListener("scroll", this.handleScroll);
  },
  watch: {
    // IncomeCategoryList: {
    //   handler(val) {
    //     console.log("IncomeCategoryList", val);
    //     if (val.length < 1 && this.totalCategory > 0) {
    //       this.getIncomeCategory();
    //     }
    //   }
    // },
    // HandlerList: {
    //   handler(val) {
    //     console.log("HandlerList", val);
    //     if (val.length < 1 && this.totalHandler > 0) {
    //       this.getHandlerList();
    //     }
    //   }
    // },
    // ExpenseList: {
    //   handler(val) {
    //     if (val.length < 1 && this.totalExpense > 0) {
    //       this.getExpenseList();
    //     }
    //   }
    // },
    // AuditList: {
    //   handler(val) {
    //     if (val.length < 1 && this.totalAudit > 0) {
    //       this.getAuditList();
    //     }
    //   }
    // }
  },
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
    // 支出
    getPage() {
      this.loading = true;
      console.log("this.time", this.time);
      this.$request.post({
        url: "/finance/financeExpend/list",
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
            item.payDate = this.$moment(item.payDate).format("YYYY-MM-DD");
            item.isEdit = false;
          });
          this.tableData = res.list;
          this.tableData.unshift({
            amount: "",
            categoryId: "",
            content: "",
            handlerName: "",
            payTargetName: "",
            auditerName: "",
            images: [],
            payDate: new Date(),
            paymentNo: "",
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
        url: "/finance/financeExpend/list",
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
              item.payDate = this.$moment(item.payDate).format("YYYY-MM-DD");
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
    pushDataHandler() {
      this.getHandlerList();
    },
    pushDataExpense() {
      this.getExpenseList();
    },
    pushDataAudit() {
      this.getAuditList();
    },

    ListGetIncomeCategory(query) {
      if (query !== "") {
        this.$request.post({
          url: "/finance/financeCategory/list_expend",
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
    // 相关财务人员信息

    ListHandler(query) {
      if (query !== "") {
        this.$request.post({
          url: "/finance/financeUser/list_expend",
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
    ListExpense(query) {
      if (query !== "") {
        this.$request.post({
          url: "/finance/financeUser/list_expend",
          params: {
            id: "",
            name: query,
            pageNo: 1,
            pageSize: 10,
            isCount: true,
            type: 3
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              if (res.list.length !== 0) {
                this.ExpenseList = res.list;
              } else {
                this.ExpenseList = [];
              }
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.ExpenseList = [];
      }
      console.log("this.ExpenseList", this.ExpenseList);
    },
    ListAudit(query) {
      if (query !== "") {
        this.$request.post({
          url: "/finance/financeUser/list_expend",
          params: {
            id: "",
            name: query,
            pageNo: 1,
            pageSize: 10,
            isCount: true,
            type: 4
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              if (res.list.length !== 0) {
                this.AuditList = res.list;
              } else {
                this.AuditList = [];
              }
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.AuditList = [];
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
        url: "/finance/financeCategory/list_expend",
        params: this.paramsCategory,
        success: res => {
          console.log("res", res);
          this.IncomeCategoryList = res.list;
          this.totalCategory = res.total;
        }
      });
    },
    // 获取支出对象
    getExpenseList() {
      if (
        this.paramsExpense.pageNo * this.paramsExpense.pageSize >=
          this.totalExpense &&
        this.totalExpense > 0
      ) {
        return;
      }
      // type: 3
      this.paramsExpense.pageSize += 10;
      this.$request.post({
        url: "/finance/financeUser/list_expend",
        params: this.paramsExpense,
        success: res => {
          console.log("res", res);
          this.totalExpense = res.total;
          this.ExpenseList = res.list;
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
        url: "/finance/financeUser/list_expend",
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
    // 获取审核人
    getAuditList() {
      if (
        this.paramsAudit.pageNo * this.paramsAudit.pageSize >=
          this.totalAudit &&
        this.totalAudit > 0
      ) {
        return;
      }
      this.paramsAudit.pageSize += 10;
      this.$request.post({
        url: "/finance/financeUser/list_expend",
        params: this.paramsAudit,
        success: res => {
          console.log("res", res);
          this.totalAudit = res.total;
          this.AuditList = res.list;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    clearExpense() {
      this.$request.post({
        url: "/finance/financeUser/list_expend",
        params: this.paramsExpense,
        success: res => {
          console.log("res", res);
          this.totalExpense = res.total;
          this.ExpenseList = res.list;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    clearHandler() {
      this.$request.post({
        url: "/finance/financeUser/list_expend",
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
    clearAudit() {
      this.$request.post({
        url: "/finance/financeUser/list_expend",
        params: this.paramsAudit,
        success: res => {
          console.log("res", res);
          this.totalAudit = res.total;
          this.AuditList = res.list;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    clearCategoryId() {
      this.$request.post({
        url: "/finance/financeCategory/list_expend",
        params: this.paramsCategory,
        success: res => {
          console.log("res", res);
          this.IncomeCategoryList = res.list;
          this.totalCategory = res.total;
        }
      });
    },

    openUpload(row, index) {
      if (this.openStatus === false) {
        row.isEdit = true;
        this.openStatus = true;
      }
      console.log("index", index);
      if (index === 0) {
        this.addToken = 1;
      } else {
        this.addToken = 2;
      }
      console.log("this.addToken", this.addToken);
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
    // 编辑支出对象
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
    // 编辑审核人
    enterEditAudit(row) {
      if (this.openStatus === true) {
        this.$message.info("请先取消修改");
      }
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
        { field: "payDate", message: "请选择支付日期" },
        { field: "payTargetName", message: "请选择支出对象" },
        { field: "content", message: "请输入内容或单号" },
        { field: "auditerName", message: "请选择审核人" },
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
        paymentNo: row.paymentNo,
        payTargetName: row.payTargetName,
        auditerName: row.auditerName,
        payDate: this.$moment(row.payDate).format("YYYY-MM-DD")
      };
      if (validate === true) {
        this.$request.post({
          url: "/finance/financeExpend/add",
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
      row.paymentNo = "";
      row.payTargetName = "";
      row.payDate = "";
      row.auditerName = "";
    },
    // 编辑
    submitItem(row) {
      let validate = false;
      const validations = [
        { field: "amount", message: "请输入金额" },
        { field: "payDate", message: "请选择支付日期" },
        { field: "payTargetName", message: "请选择支出对象" },
        { field: "auditerName", message: "请选择审核人" },
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
        paymentNo: row.paymentNo,
        payTargetName: row.payTargetName,
        auditerName: row.auditerName,
        payDate: this.$moment(row.payDate).format("YYYY-MM-DD")
      };
      let roleToken = sessionStorage.getItem("updateTodayDocument");
      let time1 = this.$moment(row.createTime).format("YYYY-MM-DD");
      let time2 = this.$moment(new Date()).format("YYYY-MM-DD");
      console.log("images", images);
      if (roleToken == "true") {
        if (time1 !== time2) {
          console.log("权限", row);
          this.$message.info("该角色只能修改今日的单据");
        } else {
          if (validate === true) {
            this.$request.post({
              url: "/finance/financeExpend/update",
              type: "array",
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
            url: "/finance/financeExpend/update",
            params,
            type: "array",
            success: res => {
              if (res == "操作成功") {
                this.$message.success("修改成功");
                this.openStatus = false;
                row.isEdit = false;
                this.addToken = 1;
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
      this.$confirm("是否确认将该笔支出单据永久删除,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            url: "/finance/financeExpend/delete",
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
        url: "/finance/financeExpend/uploadImage",
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
        payTargetName: "",
        auditerName: ""
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
