<template>
  <!-- 待提交订单 -->
  <div id="box">
    <main-content>
      <el-form :inline="true">
        <span class="top-span">客户：</span>
        <el-select
          v-model="params.customerId"
          ref="selectRef"
          v-el-select-loadmore="loadmore"
          filterable
          remote
          clearable
          size="mini"
          reserve-keyword
          placeholder="请输入客户姓名"
          :remote-method="CusremoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in CustormList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <span style="margin-left: 10px" class="top-span">产品种类：</span>
        <el-select
          v-el-ProSelect="Proloadmore"
          filterable
          clearable
          size="mini"
          v-model.trim="params.productId"
          placeholder="请选择产品种类"
          remote
          reserve-keyword
          :remote-method="ProremoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in ProList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-button
          style="margin-left: 10px"
          size="mini"
          type="primary"
          @click="search"
          >查询</el-button
        >
        <el-button size="mini" @click="reset">重置</el-button>
      </el-form>
      <div style="margin: 10px 0">
        <el-button size="mini" type="primary" plain @click="insertEvent"
          >新增</el-button
        >
        <el-button
          size="mini"
          :disabled="buttonHidden"
          type="primary"
          plain
          @click="orderSubmit"
          >提交</el-button
        >
        <el-button size="mini" :disabled="buttonHidden" @click="editEvent"
          >修改</el-button
        >
        <el-button
          size="mini"
          :disabled="buttonHidden"
          type="danger"
          plain
          @click="removeEvent"
          >删除</el-button
        >
      </div>
      <vxe-table
        border
        resizable
        row-key
        show-overflow
        height="700"
        ref="toTable"
        size="mini"
        @scroll="handleScroll"
        :data="tableData"
        @cell-click="cellDBLClickEvent"
        highlight-current-row
      >
        <vxe-table-column field="billDate" title="日期"> </vxe-table-column>
        <vxe-table-column field="orderNo" title="单号"></vxe-table-column>
        <vxe-table-column
          field="customerName"
          title="客户名称"
        ></vxe-table-column>
        <vxe-table-column
          field="productName"
          title="产品种类"
        ></vxe-table-column>
        <vxe-table-column field="color" title="颜色或型号"></vxe-table-column>
        <vxe-table-column field="number" title="数量"></vxe-table-column>
        <vxe-table-column field="amount" title="金额"></vxe-table-column>
        <vxe-table-column
          field="remark"
          title="备注"
          show-overflow
        ></vxe-table-column>
      </vxe-table>
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
      append-to-body
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :close-on-press-escape="false"
      :title="Form.id ? '编辑' : '添加'"
      :visible.sync="dialogVisible"
      width="90%"
      @close="clear"
      :show-close="false"
    >
      <el-Form
        label-position="left"
        ref="Form"
        label-width="100px"
        :model="Form"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-Form-item label="订单号：" prop="orderNo">
              <el-input
                show-word-limit
                v-model.trim="Form.orderNo"
                maxlength="15"
                placeholder="请输入订单号"
              ></el-input>
            </el-Form-item>
          </el-col>
          <el-col :span="6">
            <el-Form-item label="选择客户：" prop="customerId">
              <el-select
                v-el-select-loadmore="loadmore"
                @change="changeCustomer"
                filterable
                clearable
                remote
                reserve-keyword
                v-model.trim="Form.customerId"
                placeholder="请输入客户姓名"
                :remote-method="CusremoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in CustormList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-Form-item>
          </el-col>
          <el-col :span="6">
            <el-Form-item label="联系人：" prop="contacter">
              <el-input
                v-model.trim="Form.contacter"
                placeholder="请输入联系人"
              ></el-input>
            </el-Form-item>
          </el-col>
          <el-col :span="6">
            <el-Form-item label="地址：" prop="address">
              <el-input
                v-model.trim="Form.address"
                placeholder="请输入地址"
              ></el-input>
            </el-Form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-Form-item label="电话：" prop="phone">
              <el-input
                v-model.number="Form.phone"
                placeholder="请输入电话"
              ></el-input>
            </el-Form-item>
          </el-col>
          <el-col :span="6">
            <el-Form-item label="产品种类：" prop="productId">
              <el-select
                v-el-ProSelect="Proloadmore"
                filterable
                clearable
                v-model.trim="Form.productId"
                remote
                reserve-keyword
                :remote-method="ProremoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in ProList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-Form-item>
          </el-col>
          <el-col :span="6">
            <el-Form-item label="颜色或型号：" prop="color ">
              <el-input
                v-model.trim="Form.color"
                placeholder="请输入颜色或型号"
              ></el-input>
            </el-Form-item>
          </el-col>
          <el-col :span="6">
            <el-Form-item label="数量：" prop="number">
              <el-input
                v-model.trim="Form.number"
                placeholder="请输入数量"
                @input="handleNumber(Form.number)"
              ></el-input>
            </el-Form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-Form-item label="金额：" prop="amount">
              <el-input
                v-model.trim="Form.amount"
                placeholder="请输入金额"
                @input="handleInput(Form.amount)"
              ></el-input>
            </el-Form-item>
          </el-col>
          <el-col :span="8">
            <el-Form-item label="选择厂家：" prop="factoryId">
              <el-select
                v-el-ManSelect="Manloadmore"
                filterable
                clearable
                v-model.trim="Form.factoryId"
                remote
                reserve-keyword
                placeholder="请输入厂家"
                :remote-method="ManremoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in ManuData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-Form-item>
          </el-col>
          <el-col :span="8">
            <el-Form-item label="选择日期：" prop="billDate">
              <el-date-picker
                v-model="Form.billDate"
                type="date"
                placeholder="请选择日期"
              ></el-date-picker>
            </el-Form-item>
          </el-col>
          <el-col :span="24">
            <el-Form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="Form.remark"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入备注"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-Form-item>
          </el-col>
        </el-row>
        <!-- el-upload 组件 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-Form-item label="上传图片：(最多10张)" prop="images">
              <el-upload
                class="order-upload"
                action="#"
                accept="image/*"
                list-type="picture-card"
                :on-change="handleCover"
                :on-exceed="handleExceed"
                :auto-upload="false"
                ref="uploadcover"
                :limit="10"
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
            </el-Form-item>
          </el-col>
        </el-row>
      </el-Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取消</el-button>
        <el-button type="primary" @click="submit" :disabled="submitFlag">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import uuid from "@/utils/getUid.js";
import { fullPath } from "@/config/filtersConfig";
import debounce from "lodash/debounce";
import axios from "axios";
export default {
  data() {
    return {
      submitFlag:false,
      buttonHidden: true,
      OrderId: null,
      fullscreenLoading: false,
      Form: {
        orderNo: "",
        id: "",
        customerId: "",
        contacter: "",
        address: "",
        phone: "",
        productId: "",
        color: "",
        number: null,
        amount: null,
        factoryId: "",
        billDate: new Date(),
        remark: "",
        images: []
      },
      imgList: [],
      dialogImageUrl: "",
      rules: {
        customerId: [
          { required: true, message: "请选择客户", trigger: "change" }
        ],
        contacter: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
        productId: [
          { required: true, message: "请选择产品种类", trigger: "change" }
        ],
        color: [
          { required: true, message: "请输入颜色或型号", trigger: "blur" }
        ],
        orderNo: [{ required: true, message: "请输入订单号", trigger: "blur" }],
        number: [{ required: true, message: "请输入数量", trigger: "blur" }],
        amount: [{ required: true, message: "请输入金额", trigger: "blur" }],
        factoryId: [
          { required: true, message: "请选择厂家", trigger: "change" }
        ],
        billDate: [{ required: true, message: "请选择日期", trigger: "change" }]
      },
      dialogVisible: false,
      imgDialog: false,
      disabled: false,
      deleIndex: null,
      tableData: [],
      params: {
        pageNo: 1,
        pageSize: 50,
        // ruleCategoryId: '',
        startTime: "",
        endTime: "",
        keyWord: "",
        sortKey: "",
        isCount: true,
        orderNo: "",
        customerId: "",
        color: "",
        factoryId: "",
        productId: "",
        adId: "",
        status: 1
      },
      SearchParams: {
        name: "",
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true,
        customerId: "",
        productId: ""
      },
      loading: false,
      list: [],
      CustormList: [],
      cusParams: {
        name: "",
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true
      },
      cusTotal: 0,
      ProParams: {
        name: "",
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true
      },
      ProTotal: 0,
      ProList: [],
      ManParams: {
        name: "",
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true
      },
      ManTotal: 0,
      ManuData: [],
      total: 0,

      pages: 0,
      dateTime: [],
      userList: [],
      labelWidth: "105px"
    };
  },
  created() {
    // this.getManufacturer();
    this.getPage();
    // this.getProList();
    if (this.CustormList.length === 0) {
      this.getCusList();
    }
    if (this.ProList.length === 0) {
      this.getProList();
    }
    if (this.ManuData.length === 0) {
      this.getManufacturer();
    }
    // this.getCusList();
    this.getUserList();
  },
  computed: {
    fullPath() {
      return function(val) {
        return fullPath(val);
      };
    }
  },
  mounted() {},
  watch: {
    CustormList: {
      handler(val) {
        if (val.length < 1) {
          this.getCusList();
        }
      }
    },
    ProList: {
      handler(val) {
        if (val.length < 1) {
          this.getProList();
        }
      }
    },
    ManuData: {
      handler(val) {
        if (val.length < 1) {
          this.getManufacturer();
        }
      }
    }
  },
  directives: {
    "el-select-loadmore": {
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
    "el-ProSelect": {
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
    "el-ManSelect": {
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
  methods: {
    // 客户
    loadmore() {
      this.getCusList();
    },
    // 产品
    Proloadmore() {
      this.getProList();
    },
    // 厂家
    Manloadmore() {
      this.getManufacturer();
    },
    // 获取客户列表
    getCusList() {
      if (
        this.cusParams.pageNo * this.cusParams.pageSize >= this.cusTotal &&
        this.cusTotal > 0
      ) {
        return;
      }
      this.cusParams.pageSize += 10;
      this.$request.post({
        url: "/system/sysCustomer/admin/list_customer_pending",
        params: this.cusParams,
        success: res => {
          this.cusTotal = res.total;
          this.CustormList = res.list;
        }
      });
    },
    // 获取下拉产品
    getProList() {
      if (
        this.ProParams.pageNo * this.ProParams.pageSize >= this.ProTotal &&
        this.ProTotal > 0
      ) {
        return;
      }
      this.ProParams.pageSize += 10;
      this.$request.post({
        url: "/system/sysProduct/admin/list_pending",
        params: this.ProParams,
        success: res => {
          this.ProList = res.list;
          this.ProTotal = res.total;
        }
      });
    },
    // 获取厂家
    getManufacturer() {
      if (
        this.ManParams.pageNo * this.ManParams.pageSize >= this.ManTotal &&
        this.ManTotal > 0
      ) {
        return;
      }
      this.$request.post({
        url: "/system/sysFactory/admin/list_factory_pending",
        params: this.ManParams,
        success: res => {
          this.ManuData = res.list;
          this.ManTotal = res.total;
        }
      });
    },
    CusremoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$request.post({
          url: "/system/sysCustomer/admin/list_select_pending",
          params: {
            name: query
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              this.CustormList = res;
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.CustormList = [];
      }
    },
    ProremoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$request.post({
          url: "/system/sysProduct/admin/list_select_pending",
          params: {
            name: query
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              this.ProList = res;
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.ProList = [];
      }
    },
    ManremoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$request.post({
          url: "/system/sysFactory/admin/list_select_pending",
          params: {
            name: query
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              this.ManuData = res;
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.ProList = [];
      }
    },
    getPage() {
      this.needRefresh = true;
      this.loading = true;
      this.$request.post({
        // url: '/system/sysOrder/admin/list',
        url: "/system/sysOrder/admin/list_pending",
        params: this.params,
        success: res => {
          this.pages = res.pages;
          this.tableData = res.list;
          this.tableData = this.tableData.map(item => {
            return {
              ...item,
              billDate: this.$moment(item.billDate).format("YYYY-MM-DD"),
              images:
                typeof item.images === "string"
                  ? item.images.trim().split(",")
                  : item.images
            };
          });

          this.total = res.total;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    getPageList() {
      this.loading = true;
      this.$request.post({
        // url: "/system/sysOrder/admin/list",
        url: "/system/sysOrder/admin/list_pending",
        params: this.params,
        success: res => {
          if (res.list.length === 0 && this.tableData.length > 0) {
            this.$message.info("没有更多数据了");
            return;
          }
          this.pages = res.pages;
          if (res.list.length > 0) {
            res.list.forEach(item => {
              this.tableData.push(item);
            });
          }

          this.tableData = this.tableData.map(item => {
            return {
              ...item,
              billDate: this.$moment(item.billDate).format("YYYY-MM-DD"),
              images:
                typeof item.images === "string"
                  ? item.images.trim().split(",")
                  : item.images
            };
          });
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    // 获取用户信息
    getUserList() {
      this.loading = true;
      this.$request.post({
        // url: "/admin/adInfo/list",
        url: "/admin/adInfo/list_order",
        params: this.SearchParams,
        success: res => {
          this.loading = false;
          this.userList = res.list;
        }
      });
    },
    handleInput(value) {
      // 去除非数字和小数点的字符
      value = value.replace(/[^\d.]/g, "");
      // 去除多余的小数点
      value = value.replace(/\.{2,}/g, ".");
      // 去除小数点前面多余的0
      value = value.replace(/^0+(\d)/g, "$1");
      // 限制只能输入一个小数点
      if (value.indexOf(".") !== value.lastIndexOf(".")) {
        value = value.slice(0, -1);
      }
      // 更新输入值
      this.Form.amount = value;
    },
    handleNumber(value) {
      // 去除非数字和小数点的字符
      value = value.replace(/[^\d.]/g, "");
      // 去除多余的小数点
      value = value.replace(/\.{2,}/g, ".");
      // 去除小数点前面多余的0
      value = value.replace(/^0+(\d)/g, "$1");
      // 限制只能输入一个小数点
      if (value.indexOf(".") !== value.lastIndexOf(".")) {
        value = value.slice(0, -1);
      }
      // 更新输入值
      this.Form.number = value;
    },
    submit() {
      let images = "";
      if (this.Form.images.length > 0) {
        images = this.Form.images
          .map(item => {
            return item.url;
          })
          .join(",");
      }

      this.$refs.Form.validate(valid => {
        if (valid) {
          let params = {
            id: this.Form.id ? this.Form.id : "",
            orderNo: this.Form.orderNo,
            customerId: this.Form.customerId,
            contacter: this.Form.contacter,
            address: this.Form.address,
            phone: this.Form.phone,
            productId: this.Form.productId,
            color: this.Form.color,
            number: this.Form.number,
            amount: this.Form.amount,
            factoryId: this.Form.factoryId,
            billDate: this.$moment(this.Form.billDate).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            remark: this.Form.remark,
            images: images.length ? images : []
          };
          this.submitFlag=true
          this.$request.post({
            url: "/system/sysOrder/admin/addOrUpdate",
            params,
            success: res => {
              this.$message.success(res);
              this.dialogVisible = false;
              this.clearForm();
              this.getPage();
            },
            finally: () => {
              this.submitFlag=false;
            }
          });
        } else {
          this.$message.error("表单验证未通过，请检查输入");
        }
      });
    },
    changeCustomer(val) {
      let item = this.CustormList.find(item => {
        return item.id === val;
      });
      this.Form.contacter = item.contacter;
      this.Form.address = item.address;
      this.Form.phone = item.phone;
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
      if (this.dateTime && this.dateTime.length) {
        this.params.startTime = this.$moment(this.dateTime[0]).format(
          "YYYY-MM-DD"
        );
        this.params.endTime = this.$moment(this.dateTime[1]).format(
          "YYYY-MM-DD"
        );
      } else {
        this.params.startTime = "";
        this.params.endTime = "";
      }
      this.getPage();
    },
    handleScroll: debounce(function() {
      const tableEl = this.$refs.xTable.$el.querySelector(
        ".vxe-table--body-wrapper"
      );
      if (
        tableEl.scrollTop + tableEl.clientHeight + 10 >=
        tableEl.scrollHeight
      ) {
        if (!this.loading && this.needRefresh) {
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
      }
    }, 300), // 设置延时为300ms，可以根据实际情况调整
    async loadData() {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.$refs.toTable.$el.removeEventListener("scroll", this.handleScroll);
    },
    cellDBLClickEvent({ row, rowIndex }) {
      this.CustormList.push({ id: row.customerId, name: row.customerName });
      this.CustormList = Object.values(
        this.CustormList.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {})
      );
      this.ManuData.push({ id: row.factoryId, name: row.factoryName });
      this.ManuData = Object.values(
        this.ManuData.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {})
      );
      this.ProList.push({ id: row.productId, name: row.productName });
      this.ProList = Object.values(
        this.ProList.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {})
      );

      row.images = row.images ? row.images : [];
      // row.images =typeof row.images==='string' ? row.images.split(',') : []
      // 处理单元格点击逻辑
      this.Form = {
        ...row,
        images: row.images ? row.images : []
      };
      this.Form = JSON.parse(JSON.stringify(row));

      // this.Form.images = this.Form.images ? this.Form.images.split(',') : []
      // this.Form.images = JSON.parse(JSON.stringify(this.Form.images))
      this.deleIndex = rowIndex;
      this.buttonHidden = false;
      this.OrderId = row.id;
    },
    orderSubmit() {
      if (this.OrderId) {
        this.$request.post({
          url: "/system/sysOrder/admin/submit",
          params: { id: this.OrderId },
          success: res => {
            this.$message.success(res);
            this.OrderId = null;
            this.dialogVisible = false;
            this.getPage();
          }
        });
      }
    },
    insertEvent() {
      this.Form = {
        orderNo: "",
        customerId: "",
        contacter: "",
        address: "",
        phone: "",
        productId: "",
        color: "",
        number: null,
        amount: null,
        factoryId: "",
        billDate: new Date(),
        remark: "",
        images: []
      };
      this.dialogVisible = true;
    },
    editEvent() {
      if (this.Form.id) {
        this.dialogVisible = true;
        this.$nextTick(() => {
          let img = [];
          if (this.Form.images?.length && this.Form.images[0] !== "") {
            this.Form.images.forEach(item => {
              let uid = uuid();
              img.push({
                url: item,
                uid: uid
              });
              this.$refs.uploadcover.uploadFiles.push({
                url: fullPath(item),
                uid: uid
              });
            });
          } else {
            this.Form.images = [];
          }

          this.Form.images = img;
        });
      } else {
        this.$message.info("请重新选择订单");
      }
    },
    removeEvent() {
      this.$confirm("此操作将永久删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request.post({
            url: "/system/sysOrder/admin/delete",
            params: { id: this.Form.id },
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

    cancel() {
      let hasData = false;
      for (const value of Object.values(this.Form)) {
        if (
          value !== this.Form.billDate &&
          value !== null &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          hasData = true;
          break;
        }
      }
      if (hasData) {
        this.$confirm("你还有填写的数据没保存, 是否保存?", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning",
          callbackAction: "cancel" // 设置callback-action为"cancel"
        })
          .then(() => {
            this.submit();
          })
          .catch(() => {
            this.Form = {
              id: "",
              orderNo: "",
              customerId: "",
              contacter: "",
              address: "",
              phone: "",
              productId: "",
              color: "",
              number: null,
              amount: null,
              factoryId: "",
              billDate: new Date(),
              remark: "",
              images: []
            };
            this.OrderId = null;
            this.$refs.uploadcover.clearFiles();

            this.$nextTick(() => {
              this.$refs.Form.resetFields();
            });
            this.dialogVisible = false;
          });
      } else {
        this.dialogVisible = false;
        this.Form = {
          id: "",
          orderNo: "",
          customerId: "",
          contacter: "",
          address: "",
          phone: "",
          productId: "",
          color: "",
          number: null,
          amount: null,
          factoryId: "",
          billDate: new Date(),
          remark: "",
          images: []
        };
        this.OrderId = null;
        this.$refs.uploadcover.clearFiles();
        this.$nextTick(() => {
          this.$refs.Form.resetFields();
        });
      }
    },
    clear() {
      let hasData = false;
      for (const value of Object.values(this.Form)) {
        if (
          value !== this.Form.billDate &&
          value !== null &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          hasData = true;
          break;
        }
      }
      if (hasData) {
        this.$confirm("你还有填写的数据没保存, 是否保存?", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning",
          callbackAction: "cancel", // 设置callback-action为"cancel"
          closeOnClickModal: false // 禁止点击对话框外的区域关闭对话框
        })
          .then(() => {
            this.submit();
          })
          .catch(() => {
            this.$nextTick(() => {
              this.$refs.Form.resetFields();
            });
            this.Form = {
              id: "",
              orderNo: "",
              customerId: "",
              contacter: "",
              address: "",
              phone: "",
              productId: "",
              color: "",
              number: null,
              amount: null,
              factoryId: "",
              billDate: new Date(),
              remark: "",
              images: []
            };
            this.OrderId = null;
            this.$refs.uploadcover.clearFiles();
            this.dialogVisible = false;
          });
      } else {
        this.dialogVisible = false;
        this.Form = {
          id: "",
          orderNo: "",
          customerId: "",
          contacter: "",
          address: "",
          phone: "",
          productId: "",
          color: "",
          number: null,
          amount: null,
          factoryId: "",
          billDate: new Date(),
          remark: "",
          images: []
        };
        this.OrderId = null;
        this.$refs.uploadcover.clearFiles();
        this.$nextTick(() => {
          this.$refs.Form.resetFields();
        });
      }
    },
    clearForm() {
      this.Form = {
        id: "",
        orderNo: "",
        customerId: "",
        contacter: "",
        address: "",
        phone: "",
        productId: "",
        color: "",
        number: null,
        amount: null,
        factoryId: "",
        billDate: new Date(),
        remark: "",
        images: []
      };
      this.OrderId = null;
      this.$refs.uploadcover.clearFiles();
      this.dialogVisible = false;
    },
    // 重置
    reset() {
      this.params = {
        pageNo: 1,
        pageSize: 50,
        // ruleCategoryId: '',
        startTime: "",
        endTime: "",
        keyWord: "",
        sortKey: "",
        isCount: true,
        orderNo: "",
        customerId: "",
        color: "",
        factoryId: "",
        productId: "",
        adId: "",
        status: 1
      };
      this.getPage();
    },

    handleCover(file, fileList) {
      let formData = new FormData();
      formData.append("file", file.raw);
      this.$request.post({
        url: "/system/sysOrder/admin/uploadImage",
        type: "form-data",
        params: formData,
        headers: {
          ContentType: "multipart/form-data"
        },
        success: res => {
          if (res) {
            this.Form.images.push({
              url: res,
              uid: file.uid
            });
            this.$message.success("上传成功");
          }
        }
      });
    },
    handleExceed(files, fileList) {
      this.$message.info("最多上传10张图片");
    },
    handleRemove(file) {
      let uid = file.uid;
      this.Form.images.map((item, i) => {
        if (item.uid === uid) {
          let index = i;
          if (index > -1) {
            this.Form.images.splice(index, 1);
            this.$refs.uploadcover.uploadFiles.splice(index, 1);
          }
        }
      });
    },
    handlePictureCardPreview(file) {
      this.imgDialog = true;
      this.dialogImageUrl = file.url;
    }
  }
};
</script>
<style>
.top-span {
  font-size: 15px;
  color: #606266;
}

.vxe-table--render-default .vxe-body--row.row--current {
  background-color: #f4f5f9 !important;
}
.vxe-table--render-default .vxe-body--row.row--current {
  background-color: #e8f3fe !important;
}

.order-upload .el-upload--picture-card {
  width: 500px;
  height: 500px;
  line-height: 500px;
}

.order-upload .el-upload-list--picture-card .el-upload-list__item {
  width: 500px;
  height: 500px;
  line-height: 500px;
}
</style>
