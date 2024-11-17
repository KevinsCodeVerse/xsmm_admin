<template>
  <!-- 查看订单 -->
  <div id="box">
    <main-content>
      <vxe-grid
        id="orderId"
        ref="xTable"
        :columns="tableColumn"
        :custom-config="customConfig"
        :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
        :footer-method="footerMethod"
        :toolbar-config="tableToolbar"
        border
        header-align="center"
        height="700"
        highlight-current-row
        keep-source
        resizable
        show-footer
        show-overflow
        size="mini"
        @scroll="handleScroll"
        @cell-click="cellOrderEvent"
        @edit-closed="editClosedEvent"
        @filter-change="handleFilterChange"
      >
        <!--        :edit-config="{trigger: 'click', mode: 'cell', showStatus: true, icon: 'fa fa-pencil'}"-->
        <!--        :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"-->
        <template v-slot:form>
          <div>
            <el-form :inline="true" :label-width="labelWidth">
              <el-form-item label="单号：">
                <el-input
                  v-model.trim="params.orderNo"
                  clearable
                  placeholder="请输入单号"
                  size="mini"
                >
                </el-input>
                <!-- 单号选项 -->
              </el-form-item>
              <el-form-item label="客户名称：">
                <el-input
                  v-model.trim="params.customerName"
                  clearable
                  placeholder="请输入客户姓名"
                  size="mini"
                ></el-input>
              </el-form-item>
              <el-form-item label="颜色或型号：">
                <el-input
                  v-model.trim="params.color"
                  clearable
                  placeholder="请输入颜色或型号"
                  size="mini"
                ></el-input>
              </el-form-item>
              <el-form-item label="厂家名称：">
                <el-select
                  v-el-ManSelect="Manloadmore"
                  v-model.trim="params.factoryId"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入厂家"
                  :remote-method="ManremoteMethod"
                  :loading="loading"
                  size="mini"
                >
                  <el-option
                    v-for="item in ManuData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品种类：">
                <el-select
                  v-el-ProSelect="Proloadmore"
                  v-model.trim="params.productId"
                  clearable
                  filterable
                  placeholder="请选择"
                  size="mini"
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
              </el-form-item>
            </el-form>
            <el-form :inline="true" :label-width="labelWidth">
              <el-form-item v-if="filterOptions.length" label="筛选：">
                <el-select
                  v-model="selectedOption"
                  clearable
                  filterable
                  placeholder="请选择"
                  size="mini"
                  style="width: 40%"
                  @change="applyFilter"
                >
                  <el-option
                    v-for="item in filterOptions"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-model="minValue"
                  placeholder="最小值"
                  size="mini"
                  style="width: 70px;margin:0 10px"
                ></el-input
                >至<el-input
                  v-model="maxValue"
                  placeholder="最大值"
                  size="mini"
                  style="width:70px;margin-left: 10px"
                ></el-input>
              </el-form-item>

              <el-form-item v-if="iScanSeeAllOrder === true" label="开单员：">
                <el-select
                  v-el-UserSelect="Userloadmore"
                  v-model.trim="params.adId"
                  clearable
                  filterable
                  placeholder="请选择"
                  size="mini"
                  remote
                  reserve-keyword
                  :remote-method="UseremoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.remark"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="业务员：">
                <el-select
                  v-el-selfUserSelect="selfUserloadmore"
                  v-model.trim="params.salesAdId"
                  clearable
                  filterable
                  placeholder="请选择"
                  size="mini"
                  remote
                  reserve-keyword
                  :remote-method="selfUseremoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in selfuserList"
                    :key="item.id"
                    :label="item.remark"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期范围：">
                <el-date-picker
                  v-model="date"
                  :picker-options="pickerOptions"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="mini"
                  @change="handleDateChange"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="search"
                  >查询</el-button
                >
                <el-button size="mini" @click="reset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <template v-slot:toolbar_buttons>
          <el-button
            :disabled="buttonHidden"
            size="mini"
            type="primary"
            @click="printInvoice"
            >打印送货单</el-button
          >
          <el-button
            :disabled="buttonHidden"
            plain
            size="mini"
            type="danger"
            @click="orderBack"
            >退回</el-button
          >
        </template>
        <template v-slot:costDetailButton="{ row }">
          <!--          <el-button type="text" size="mini" @click="openCostDialog(row)">查看</el-button>-->
          <el-input
            v-model="row.costDetail"
            size="mini"
            @focus="openCostDialog(row)"
          ></el-input>
        </template>
        <template v-slot:orderDetailButton="{ row }">
          <el-button size="mini" type="text" @click="openOrderDialog(row)"
            >详情</el-button
          >
        </template>
        <template v-slot:receiveDetailButton="{ row }">
          <el-input
            v-model="row.receiveDetail"
            size="mini"
            @focus="openReceiveDialog(row)"
          ></el-input>
          <!--          <el-button type="text" size="mini" @click="openReceiveDialog(row)">查看</el-button>-->
        </template>
      </vxe-grid>

      <!--      成本详情-->
      <el-dialog
        :visible.sync="costDialogVisible"
        center
        title="成本详情"
        width="30%"
      >
        <el-input
          v-model="costDetailData.costDetail"
          :rows="4"
          maxlength="200"
          placeholder="请输入内容"
          show-word-limit
          type="textarea"
        >
        </el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeCost">取 消</el-button>
          <el-button type="primary" @click="costSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <!--      收款详情-->
      <el-dialog
        :visible.sync="receiveDialogVisible"
        center
        title="收款详情"
        width="30%"
      >
        <el-input
          v-model="receiveDetailData.receiveDetail"
          :rows="4"
          maxlength="200"
          placeholder="请输入内容"
          show-word-limit
          type="textarea"
        >
        </el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeReceive">取 消</el-button>
          <el-button type="primary" @click="receiveSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 详细信息弹框 -->
      <el-dialog
        :visible.sync="detailDialogVisible"
        title="待提交订单详情"
        width="90%"
      >
        <div class="dialog-content">
          <div class="row">
            <div class="item">
              <span class="label">客户：</span>
              <span>{{ order.customerName }}</span>
            </div>
            <div class="item">
              <span class="label">联系人：</span>
              <span>{{ order.contacter }}</span>
            </div>
            <div class="item">
              <span class="label" style="width:45px">地址：</span>
              <span>{{ order.address }}</span>
            </div>
            <div class="item">
              <span class="label">电话：</span>
              <span>{{ order.phone }}</span>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <span class="label">产品种类：</span>
              <span>{{ order.productName }}</span>
            </div>
            <div class="item">
              <span class="label">数量：</span>
              <span>{{ order.number }}</span>
            </div>
            <div class="item">
              <span class="label">金额：</span>
              <span>{{ order.amount }}</span>
            </div>
            <div class="item">
              <span class="label">厂家：</span>
              <span>{{ order.factoryName }}</span>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <span class="label">日期：</span>
              <span>{{ $moment(order.billDate).format("YYYY-MM-DD") }}</span>
            </div>
          </div>
          <div class="row">
            <div class="itemremark">
              <span class="labelremark" style="width: 50px;white-space: nowrap;"
                >备注：</span
              >
              <span>{{ order.remark }}</span>
            </div>
          </div>
          <div
            class="row"
            style="flex-wrap: wrap; display: flex;justify-content: space-around;"
          >
            <el-image
              v-for="pic in order.images"
              :key="pic"
              :preview-src-list="[fullPath(pic)]"
              :src="fullPath(pic)"
              class="image"
              style="width: 500px;
    height: 500px;"
            >
            </el-image>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false"
            >关闭</el-button
          >
        </div>
      </el-dialog>
      <el-pagination
        :current-page.sync="params.pageNo"
        :page-size="params.pageSize"
        :page-sizes="[50, 100, 150]"
        :total="total"
        background
        layout="total"
        style="margin-top: 20px; display: flex; justify-content: flex-start"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </main-content>
  </div>
</template>
<script>
import { fullPath } from "@/config/filtersConfig";
import debounce from "lodash/debounce";
import { isEmpty, intersection } from "lodash";
export default {
  data() {
    return {
      scrollPosition: 0,
      selectedOption: "",
      minValue: null,
      maxValue: null,
      options: [
        {
          label: "订单金额",
          maxAmount: "",
          minAmount: "",
          name: "amount"
        },
        {
          label: "毛利",
          maxProfit: "",
          minProfit: "",
          name: "profit"
        },
        {
          label: "成本",
          maxCost: "",
          minCost: "",
          name: "cost"
        },
        {
          label: "已收款",
          maxReceiveAmount: "",
          minReceiveAmount: "",
          name: "receiveAmount"
        },
        {
          label: "未收款",
          maxNotReceiveAmount: "",
          minNotReceiveAmount: "",
          name: "notReceiveAmount"
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      filterOptions: [],
      labelWidth: "100px",
      buttonHidden: true,
      iScanSeeAllOrder: false,
      OrderId: null,
      dialogVisible: false,
      imgDialog: false,
      disabled: false,
      deleIndex: null,
      tableData: [],
      params: {
        pageNo: 1,
        pageSize: 50,
        ruleCategoryId: "",
        customerName: "",
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
        salesAdId: "",
        adId: "",
        status: 3,
        maxAmount: "",
        minAmount: "",
        maxCost: "",
        minCost: "",
        finishStatus: "",
        shippingStatus: "",
        maxNotReceiveAmount: "",
        minNotReceiveAmount: "",
        maxReceiveAmount: "",
        minReceiveAmount: "",
        maxProfit: "",
        minProfit: ""
      },
      SearchParams: {
        pageNo: 1,
        pageSize: 20000,

        startTime: "",
        endTime: "",
        keyWord: "",
        sortKey: "",
        isCount: true,
        status: 3
      },
      loading: false,
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
      selfuserList: [],
      selfUserParams: {
        name: "",
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true
      },
      selfuserTotal: 0,
      userList: [],
      UserParams: {
        name: "",
        pageNo: 1,
        pageSize: 10,
        sortKey: "",
        isCount: true
      },
      userTotal: 0,
      total: 0,
      pages: 0,
      date: [],
      // 收货单状态
      costDialogVisible: false,
      costDetailData: {
        id: "",
        costDetail: ""
      },
      receiveDialogVisible: false,
      // 收款详情
      receiveDetailData: {
        id: "",
        receiveDetail: ""
      },

      showPagination: false, // 控制是否展示分页组件
      customConfig: {
        storage: true, // 启用 localStorage 本地保存
        visible: true, // 启用显示/隐藏列状态
        resizable: true, // 启用列宽状态
        checkMethod: null, // 自定义列是否允许列选中的方法
        id: ""
      },
      optionMap: {
        订单金额: { max: "maxAmount", min: "minAmount", name: "amount" },
        毛利: { max: "maxProfit", min: "minProfit", name: "profit" },
        成本: { max: "maxCost", min: "minCost", name: "cost" },
        已收款: {
          max: "maxReceiveAmount",
          min: "minReceiveAmount",
          name: "receiveAmount"
        },
        未收款: {
          max: "maxNotReceiveAmount",
          min: "minNotReceiveAmount",
          name: "notReceiveAmount"
        }
      },
      tableColumn: [
        { title: "日期", field: "billDate" },
        { title: "单号", field: "orderNo" },
        { title: "厂家", field: "factoryName" },
        { title: "客户名称", field: "customerName" },
        { title: "产品种类", field: "productName" },
        { title: "颜色或型号", field: "color" },
        { title: "数量", field: "number" },
        {
          field: "amount",
          title: "金额"
        },

        {
          field: "id",
          title: "查看",
          width: 50,
          align: "center",
          slots: { default: "orderDetailButton" }
        },
        { title: "成本", field: "cost", editRender: { name: "input" } },
        {
          field: "costDetail",
          title: "成本详情",
          width: 50,
          align: "center",
          slots: { default: "costDetailButton" }
        },
        { title: "已支付", field: "paidAmount", editRender: { name: "input" } },
        { title: "未支付", field: "notPayAmount" },
        { title: "毛利", field: "profit" },
        { title: "备注", field: "remark" },
        {
          title: "完成状态",
          field: "finishStatus",
          editRender: {
            name: "$select",
            options: [
              { value: 0, label: "未" },
              { value: 1, label: "已完成" }
            ]
          },
          filters: [
            { label: "未", value: 0 },
            { label: "已完成", value: 1 }
          ],
          filterMultiple: false
        },
        {
          title: "是否出货",
          field: "shippingStatus",
          editRender: {
            name: "$select",
            options: [
              { value: 1, label: "已出货" },
              { value: 0, label: "未" }
            ]
          },
          filters: [
            { label: "未", value: 0 },
            { label: "已出货", value: 1 }
          ],
          filterMultiple: false
        },
        {
          title: "已收款",
          field: "receiveAmount",
          editRender: { name: "input" }
        },
        {
          field: "receiveDetail",
          title: "收款详情",
          width: "100%",
          align: "center",
          slots: { default: "receiveDetailButton" }
        },
        { title: "未收款", field: "notReceiveAmount" },
        { title: "开单员", field: "adName" },
        { title: "业务员", field: "salesAdName" }
      ],
      tableFilterColumn: [
        { title: "日期", field: "billDate" },
        { title: "单号", field: "orderNo" },
        { title: "厂家", field: "factoryName" },
        { title: "客户名称", field: "customerName" },
        { title: "产品种类", field: "productName" },
        { title: "颜色或型号", field: "color" },
        { title: "数量", field: "number" },
        {
          field: "amount",
          title: "金额"
        },

        {
          field: "id",
          title: "查看",
          width: 50,
          align: "center",
          slots: { default: "orderDetailButton" }
        },
        { title: "成本", field: "cost", editRender: { name: "input" } },
        {
          field: "costDetail",
          title: "成本详情",
          width: 50,
          align: "center",
          slots: { default: "costDetailButton" }
        },
        { title: "已支付", field: "paidAmount", editRender: { name: "input" } },
        { title: "未支付", field: "notPayAmount" },
        { title: "毛利", field: "profit" },
        { title: "备注", field: "remark" },
        {
          title: "完成状态",
          field: "finishStatus",
          editRender: {
            name: "$select",
            options: [
              { value: 0, label: "未" },
              { value: 1, label: "已完成" }
            ]
          },
          filters: [
            { label: "未", value: 0 },
            { label: "已完成", value: 1 }
          ],
          filterMultiple: false
        },
        {
          title: "是否出货",
          field: "shippingStatus",
          editRender: {
            name: "$select",
            options: [
              { value: 1, label: "已出货" },
              { value: 0, label: "未" }
            ]
          },
          filters: [
            { label: "未", value: 0 },
            { label: "已出货", value: 1 }
          ],
          filterMultiple: false
        },
        {
          title: "已收款",
          field: "receiveAmount",
          editRender: { name: "input" }
        },
        {
          field: "receiveDetail",
          title: "收款详情",
          width: 50,
          align: "center",
          slots: { default: "receiveDetailButton" }
        },
        { title: "未收款", field: "notReceiveAmount" },
        { title: "开单员", field: "adName" },
        { title: "业务员", field: "salesAdName" }
      ],
      detailDialogVisible: false,
      order: {},
      sensitiveFields: [],
      // 统计数据
      statisticsData: [
        {
          cost: "",
          notPayAmount: "",
          notReceiveAmount: "",
          number: "",
          paidAmount: "",
          profit: "",
          receiveAmount: "",
          amount: ""
        }
      ],
      tableToolbar: {
        print: false,
        zoom: true,
        custom: true,
        slots: {
          buttons: "toolbar_buttons",
          form: "form"
        }
      },
      curQuery: "",
      restaurants: [],
      timeout: null
    };
  },
  created() {
    this.iScanSeeAllOrder = Boolean(sessionStorage.getItem("iScanSeeAllOrder"));
    this.setUserId();
    this.getPage();
    this.getStatistics();
    if (this.CustormList.length === 0) {
      this.getCusList();
    }
    if (this.ProList.length === 0) {
      this.getProList();
    }
    if (this.ManuData.length === 0) {
      this.getManufacturer();
    }
    if (this.userList.length === 0) {
      this.getUserList();
    }
    if (this.selfuserList.length === 0) {
      this.getSelfUserList();
    }
  },
  computed: {
    fullPath() {
      return function(val) {
        return fullPath(val);
      };
    }
  },
  mounted() {
    // this.setUserId()
    // 添加节流后的滚动事件监听
    // 监听滚动事件
    // this.$refs.xTable.$el.addEventListener('scroll', this.handleScroll)
    const userId = localStorage.getItem("uid");
    if (userId) {
      this.customConfig.id = userId;
    } else {
      // 如果userId为空，可以根据实际需求进行处理，默认为空字符串或其他默认值
      this.customConfig.id = "";
    }
  },
  watch: {
    maxValue: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.selectedOption in this.optionMap) {
          const { max, min } = this.optionMap[this.selectedOption];

          if (this.maxValue !== "" || this.minValue !== "") {
            this.params[max] = Number(this.maxValue);
            this.params[min] = Number(this.minValue);
          }
        }
      }
    },
    minValue: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.selectedOption in this.optionMap) {
          const { max, min } = this.optionMap[this.selectedOption];
          if (this.maxValue !== "" || this.minValue !== "") {
            this.params[max] = Number(this.maxValue);
            this.params[min] = Number(this.minValue);
          }
        }
      }
    },
    tableData: {
      handler: function(newValue, oldValue) {
        if (newValue.length !== oldValue.length) {
          this.getStatistics();
        }
      },
      deep: true
    },
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
    },
    userList: {
      handler(val) {
        if (val.length < 1) {
          this.getUserList();
        }
      }
    },
    selfuserList: {
      handler(val) {
        if (val.length < 1) {
          this.getSelfUserList();
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
    },
    "el-UserSelect": {
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
    "el-selfUserSelect": {
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
    applyFilter() {
      if (this.selectedOption in this.optionMap) {
        const { max, min } = this.optionMap[this.selectedOption];
        this.params[max] = Number(this.maxValue);
        this.params[min] = Number(this.minValue);
      }
    },
    // 查询
    search() {
      this.params.pageNo = 1;
      if (this.params.startTime) {
        this.params.startTime = this.$moment(this.params.startTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.params.endTime = this.$moment(this.params.endTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.params.startTime = "";
        this.params.endTime = "";
      }
      this.getPage();
    },
    updateFooterData() {
      this.$refs.xTable.updateFooter();
    },
    handleFilterChange(e) {
      console.log("e", e);
      switch (e.prop) {
        case "finishStatus":
          if (e.values[0] === 0) {
            console.log("未完成");
            this.params.finishStatus = 0;
          } else if (e.values[0] === 1) {
            console.log("已完成");
            this.params.finishStatus = 1;
          } else {
            console.log("全部");
            this.params.finishStatus = "";
          }
          this.getPage();
          break;
        case "shippingStatus":
          if (e.values[0] === 0) {
            this.params.shippingStatus = 0;
            console.log("未完成");
          } else if (e.values[0] === 1) {
            this.params.shippingStatus = 1;
            console.log("已完成");
          } else {
            this.params.shippingStatus = "";
          }
          this.getPage();
          break;
      }
    },
    // 获取表格数据
    getPage() {
      this.loading = true;
      this.$request.post({
        url: "/system/sysOrder/admin/list",
        params: this.params,
        success: res => {
          this.tableData = res.list;
          this.pages = res.pages;
          this.tableData = this.tableData.map(item => {
            return {
              ...item,
              billDate: this.$moment(item.billDate).format("YYYY-MM-DD"),
              submitTime: this.$moment(item.submitTime).format("YYYY-MM-DD"),
              createTime: this.$moment(item.createTime).format("YYYY-MM-DD"),
              images:
                typeof item.images === "string"
                  ? item.images.split(",")
                  : item.images
            };
          });
          this.getStatistics();
          // 遍历所有数据，找到出现过的字段
          const allProps = new Set();
          this.tableData.forEach(item => {
            Object.keys(item).forEach(prop => {
              this.options.forEach(item => {
                if (item.name == prop) {
                  this.filterOptions.push(item);
                }
              });
              allProps.add(prop);
            });
          });
          this.filterOptions = [...new Set(this.filterOptions)];
          this.tableColumn = this.tableFilterColumn.filter(column =>
            allProps.has(column.field)
          );

          this.total = res.total;

          // this.getStatistics()
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
    getPageList() {
      this.loading = true;
      this.$request.post({
        url: "/system/sysOrder/admin/list",
        params: this.params,
        success: res => {
          if (res.list.length === 0 && this.tableData.length > 0) {
            this.$message.info("没有更多数据了");
            return;
          }
          this.pages = res.pages;
          if (res.list.length > 0) {
            res.list.forEach(item => {
              item.billDate = this.$moment(item.billDate).format("YYYY-MM-DD");
              item.submitTime = this.$moment(item.submitTime).format(
                "YYYY-MM-DD"
              );
              item.createTime = this.$moment(item.createTime).format(
                "YYYY-MM-DD"
              );
              item.images =
                typeof item.images === "string"
                  ? item.images.split(",")
                  : item.images;
              this.tableData.push(item);
            });
          }
          // this.tableData = this.tableData.map(item => {
          //   return {
          //     ...item,
          //     billDate: this.$moment(item.billDate).format("YYYY-MM-DD"),
          //     submitTime: this.$moment(item.submitTime).format("YYYY-MM-DD"),
          //     createTime: this.$moment(item.createTime).format("YYYY-MM-DD"),
          //     images:
          //       typeof item.images === "string"
          //         ? item.images.split(",")
          //         : item.images
          //   };
          // });
          // 遍历所有数据，找到出现过的字段
          // const allProps = new Set();
          // this.tableData.forEach(item => {
          //   Object.keys(item).forEach(prop => {
          //     this.options.forEach(item => {
          //       if (item.name == prop) {
          //         this.filterOptions.push(item);
          //       }
          //     });
          //     allProps.add(prop);
          //   });
          // });
          // this.filterOptions = [...new Set(this.filterOptions)];
          // this.tableColumn = this.tableColumn.filter(column =>
          //   allProps.has(column.field)
          // );
        },
        finally: () => {
          this.loading = false;
        }
      });
    },
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
    // 用户
    Userloadmore() {
      this.getUserList();
    },
    selfUserloadmore() {
      this.getSelfUserList();
    },
    // 获取客户列表
    getCusList() {
      if (this.curQuery) {
        return;
      }
      if (
        this.cusParams.pageNo * this.cusParams.pageSize >= this.cusTotal &&
        this.cusTotal > 0
      ) {
        return;
      }
      this.cusParams.pageSize += 10;
      this.$request.post({
        url: "/system/sysCustomer/admin/list_order",
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
        url: "/system/sysProduct/admin/list_order",
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
      var params=this.ManParams
      params.pageSize=100
      this.$request.post({
        url: "/system/sysFactory/admin/list_order",
        params: params,
        success: res => {
          this.ManuData = res.list;
          this.ManTotal = res.total;
        }
      });
    },
    // 获取用户
    getUserList() {
      if (
        this.UserParams.pageNo * this.UserParams.pageSize >= this.UserTotal &&
        this.UserTotal > 0
      ) {
        return;
      }
      this.$request.post({
        url: "/admin/adInfo/list",
        params: this.UserParams,
        success: res => {
          this.userList = res.list;
          this.UserTotal = res.total;
        }
      });
    },
    getSelfUserList() {
      if (
        this.selfUserParams.pageNo * this.selfUserParams.pageSize >=
          this.selfuserTotal &&
        this.selfuserTotal > 0
      ) {
        return;
      }
      this.$request.post({
        url: "/admin/adInfo/list",
        params: this.selfUserParams,
        success: res => {
          this.selfuserList = res.list.filter(item => item.roleId === 14);
          console.log("selfuserList", this.selfuserList);
          this.selfuserTotal = res.total;
        }
      });
    },

    selfUseremoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$request.post({
          url: "/admin/adInfo/list",
          params: {
            name: query,
            pageNo: 1,
            pageSize: 2000
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              this.selfuserList = res.list.filter(item => item.roleId === 14);
              console.log("selfuserList", this.selfuserList);
            }, 200);
          },
          finally: () => {
            this.loading = false;
          }
        });
      } else {
        this.selfuserList = [];
      }
    },
    // 客户数据
    CusremoteMethod(query) {
      console.log("query", query);
      this.curQuery = query;
      if (query !== "") {
        this.loading = true;
        this.$request.post({
          url: "/system/sysCustomer/admin/list_select",
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
    // 产品
    ProremoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$request.post({
          url: "/system/sysProduct/admin/list_select",
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
    // 获取厂家
    ManremoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$request.post({
          url: "/system/sysFactory/admin/list_select",
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
    // 用户
    UseremoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.$request.post({
          url: "/admin/adInfo/list",
          params: {
            name: query,
            pageNo: 1,
            pageSize: 2000
          },
          success: res => {
            setTimeout(() => {
              this.loading = false;
              this.userList = res.list;
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
    // finishStatus: "",
    // shippingStatus:"",
    // 获取统计数据
    getStatistics() {
      this.loading = true;
      this.$request.post({
        url: "/system/sysOrder/admin/total",
        params: this.params,
        success: res => {
          this.statisticsData = [
            {
              cost: res.cost,
              notPayAmount: res.notPayAmount,
              notReceiveAmount: res.notReceiveAmount,
              number: res.number,
              paidAmount: res.paidAmount,
              profit: res.profit,
              receiveAmount: res.receiveAmount,
              amount: res.amount
            }
          ];
          this.updateFooterData();
          this.loading = false;
        }
      });
    },
    // 日期
    handleDateChange(value) {
      if (!value || value == null) {
        this.params.startTime = "";
        this.params.endTime = "";
      }
      this.date = value;
      this.params.startTime = this.$moment(value[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.params.endTime = this.$moment(value[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
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

    cellDBLClickEvent({ row, rowIndex }) {
      this.Form = JSON.parse(JSON.stringify(row));
      this.Form.images = this.Form.images ? this.Form.images.split(",") : [];
      this.Form.images = JSON.parse(JSON.stringify(this.Form.images));

      this.deleIndex = rowIndex;
      this.buttonHidden = false;
      this.OrderId = row.id;
    },
    handleScroll: debounce(function() {
      const tableEl = this.$refs.xTable.$el.querySelector(
        ".vxe-table--body-wrapper"
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
      this.$refs.xTable.$el.removeEventListener("scroll", this.handleScroll);
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          // 如果是需要从后端返回的字段，则获取对应的值
          const property = column.property;
          const value = this.statisticsData[0][property];

          return value !== undefined ? value : null;
        })
      ];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialog = true;
    },
    openCostDialog(row) {
      this.costDetailData = JSON.parse(JSON.stringify(row));
      this.costDialogVisible = true;
    },
    openOrderDialog(row) {
      if (
        Array.isArray(row.images) &&
        row.images.length === 1 &&
        row.images[0] === ""
      ) {
        row.images = [];
      }

      this.order = JSON.parse(JSON.stringify(row));
      this.detailDialogVisible = true;
    },
    openReceiveDialog(row) {
      this.receiveDetailData = JSON.parse(JSON.stringify(row));
      this.receiveDialogVisible = true;
    },
    closeCost() {
      this.costDetailData = {
        id: "",
        costDetail: ""
      };
      this.costDialogVisible = false;
    },
    // 成本详情
    costSubmit() {
      if (this.costDetailData.costDetail.length) {
        this.$request.post({
          url: "/system/sysOrder/admin/update/costDetail",
          params: {
            id: this.costDetailData.id,
            costDetail: this.costDetailData.costDetail
          },
          success: res => {
            this.$message.success(res);
            this.costDialogVisible = false;
            this.params.pageNo = 1;
            this.getPage();
          }
        });
      } else {
        this.$message.error("请输入成本详情");
      }
    },

    closeReceive() {
      this.receiveDetailData = {
        id: "",
        receiveDetail: ""
      };
      this.receiveDialogVisible = false;
    },
    // 收款详情提交
    receiveSubmit() {
      if (this.receiveDetailData.receiveDetail.length) {
        this.$request.post({
          url: "/system/sysOrder/admin/update/receiveDetail",
          params: {
            id: this.receiveDetailData.id,
            receiveDetail: this.receiveDetailData.receiveDetail
          },
          success: res => {
            this.$message.success(res);
            this.receiveDialogVisible = false;
            this.params.pageNo = 1;
            this.getPage();
          }
        });
      } else {
        this.$message.error("请输入成本详情");
      }
    },
    // 收货单状态
    editClosedEvent({ row, column }) {
      const xTable = this.$refs.xTable;
      const field = column.property;

      const cellValue = row[field];
      // 判断单元格值是否被修改
      if (xTable.isUpdateByRow(row, field)) {
        setTimeout(() => {
          // 映射字段和对应的 API 配置
          const fieldToApi = {
            cost: {
              url: "/system/sysOrder/admin/update/cost",
              paramName: "cost"
            },
            // profit: {
            //   url: '/system/sysOrder/admin/update/profit',
            //   paramName: 'profit',
            // },
            receiveAmount: {
              url: "/system/sysOrder/admin/update/receivedAmount",
              paramName: "receivedAmount"
            },
            paidAmount: {
              url: "/system/sysOrder/admin/update/paidAmount",
              paramName: "paidAmount"
            },
            finishStatus: {
              url: "/system/sysOrder/admin/update/finishStatus",
              paramName: "finishStatus"
            },
            shippingStatus: {
              url: "/system/sysOrder/admin/update/shippingStatus",
              paramName: "shippingStatus"
            }
          };
          // 获取对应的 API 配置
          const apiConfig = fieldToApi[field];
          if (!apiConfig) {
            this.$message.error("字段无效");
            return; // 字段无效，不执行后续操作
          }
          // 发送请求
          this.$request.post({
            url: apiConfig.url,
            params: {
              id: row.id,
              [apiConfig.paramName]: row[field]
            },
            success: res => {
              this.$message.success(res);
              this.params.pageNo = 1;
              this.getPage();
            },
            finally: () => {
              this.params.pageNo = 1;
              this.getPage();
            }
          });
          // 局部更新单元格为已保存状态
          this.$refs.xTable.reloadRow(row, null, field);
        }, 300);
      }
    },
    cellOrderEvent({ row, column }) {
      this.buttonHidden = false;
    },
    // 退回
    orderBack() {
      let row = this.$refs.xTable.getCurrentRecord();
      this.$request.post({
        url: "/system/sysOrder/admin/back",
        params: { id: row.id },
        success: res => {
          if (res) {
            this.OrderId = null;
            this.$message.success(res);
            this.getPage();
          }
        }
      });
    },
    setUserId() {
      const userId = localStorage.getItem("uid");
      this.customConfig.storage = true;
      this.customConfig.id = userId;
    },
    saveToLocal() {
      const grid = this.$refs.xGrid;
      grid.saveCustomColumns();
      grid.saveCustomResizable();
    },
    restoreFromLocal() {
      const grid = this.$refs.xGrid;
      grid.restoreCustomColumns();
      grid.restoreCustomResizable();
    },
    showDetail(row) {
      this.detailForm = { ...row };
      this.detailDialogVisible = true;
    },
    saveDetailForm() {
      this.detailDialogVisible = false; // 关闭弹框
    },
    printInvoice() {
      let row = this.$refs.xTable.getCurrentRecord();

      let time = this.$moment().format("YYYY-MM-DD");
      var printContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transform-origin: top left;
            font-size: 14px;
          }

          .container {
            width: 200vh; /* 将宽度设置为视口高度 */
            height:67vw; /* 将高度设置为视口宽度 */
            box-sizing: border-box;
            padding: 10px 5px;
            overflow: hidden;
            border: 1px solid #000;
          }
          .title {
            text-align: center;
            font-size: 18px;
            margin-bottom: 20px;
          }

            .address{
            width:100%;
            display: flex;
            justify-content: space-between;


          }
          .order-info {
          display: flex;
          width:100%;
          justify-content: space-between;
            margin-bottom: 10px;
          }

          .table-container {


          }
          .table-top{
          display: flex;
          width: 100%;
          justify-content: space-between;
          margin-top:20px;
          margin-bottom: 10px;

          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th,
          td {
            padding: 10px;
            text-align: center;
            font-size:14px;
            border: 1px solid #ccc;
          }
          .remark{
             word-wrap: break-word;

          }
          .footer {
            margin-top: 90px;
            display: flex;
            justify-content: space-between;
          }
          .footer div {
            margin-top: 50px;
            margin-right: 70px;
          }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">送货单</div>
          <div class="address"><span class="address-left">地址:中山市小榄镇坦背东二马路同茂105国道铺路</span> <span class="phone">电话:0760-22222995</span></div>
          <div class="order-info">
            <div>订单编号：<span>${row.orderNo}</span></div>
            <div>打单时间：<span>${time}</span></div>
          </div>
          <div class="table-container">
          <div class="table-top">
           <div>
            <div style="width:100%;white-space: nowrap;">收货单位:${
              row.customerName
            }</div>
            <div style="width:100%;white-space: nowrap;">送货地址:${
              row.address
            }</div>

            </div>

           <div>
            <div style="width:100%;white-space: nowrap;">联系人:${
              row.contacter
            }</div>
           <div style="width:100%;white-space: nowrap;">电话:${row.phone}</div>
            </div>

 </div>


            <table>
              <tr>
                <th>产品种类</th>
                <th>颜色或型号</th>
                <th>数量</th>
                <th>金额</th>
              </tr>
              <tr>
                <td>${row.productName}</td>
                <td>${row.color}</td>
                <td>${row.number}</td>
                <td>${row.amount}</td>
              </tr>
            </table>
          </div>
          <div class="remark">备注：${row.remark ? row.remark : ""}</div>
          <div class="footer">
            <div>开单经手：&nbsp;</div>
            <div>司机：&nbsp;</div>
            <div style="text-align: center;">收货单位及经手人(盖章)</div>
          </div>
        </div>
      </body>
    </html>
  `;
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      iframe.contentDocument.open();
      iframe.contentDocument.write(printContent);
      iframe.contentDocument.close();

      setTimeout(() => {
        iframe.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      }, 500);
    },
    // 重置
    reset() {
      this.date = [];
      this.params = {
        pageNo: 1,
        pageSize: 50,
        ruleCategoryId: "",
        customerName: "",
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
        salesAdId: "",
        adId: "",
        status: 3,
        maxAmount: "",
        minAmount: "",
        maxCost: "",
        minCost: "",
        maxNotReceiveAmount: "",
        minNotReceiveAmount: "",
        maxReceiveAmount: "",
        minReceiveAmount: "",
        maxProfit: "",
        minProfit: ""
      };
      this.getPage();
      this.getStatistics();
      this.minValue = "";
      this.maxValue = "";
    }
  }
};
</script>
<style>
.filter-container {
  display: flex;
}

.filter-inputs {
  margin-top: 10px;
  display: flex;
}
.radio-group-vertical {
  font-size: 14px;
  //display: flex;
  //flex-direction: column;
}

.filter-button {
  margin: 10px 5px;
}
.vxe-cell .vxe-default-input,
.vxe-cell .vxe-default-select,
.vxe-cell .vxe-default-textarea,
.vxe-table--filter-wrapper .vxe-default-input,
.vxe-table--filter-wrapper .vxe-default-select,
.vxe-table--filter-wrapper .vxe-default-textarea {
  font-size: inherit !important; /* 设置字体大小为继承 */
}
.vxe-input .type--text .size--mini .is--controls .is--suffix .is--readonly {
  font-size: inherit !important; /* 设置字体大小为继承 */
}
.vxe-input--inner {
  font-size: inherit !important; /* 设置字体大小为继承 */
}
.el-Form--inline .el-Form-item {
  height: 15px;
}
.vxe-table--render-default .vxe-body--row.row--current {
  background-color: #e8f3fe !important;
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
.image {
  width: 500px;
  height: 500px;
  margin: 10px;
  object-fit: cover;
}
</style>
<style lang="scss" scoped>
.el-form-item {
  height: 20px; /* 调整 el-form-item 的高度 */
  line-height: 20px; /* 调整 el-form-item 内容的垂直对齐 */
}

.el-form-item .el-input {
  height: 100%;
}
.dialog-content {
  display: flex;
  flex-wrap: wrap;
}

.row {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
}

.item {
  width: 100%;
  display: flex;
  white-space: nowrap;
  margin: 0 10px;
}
.itemremark {
  width: 100%;
  display: flex;
  margin: 0 10px;
}

.label {
  font-weight: bold;
  white-space: nowrap;
  margin-right: 5px;
}
.labelremark {
  font-weight: bold;
  margin-right: 5px;
}
</style>
