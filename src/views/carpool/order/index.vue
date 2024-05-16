<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="行程ID" prop="publishId">
        <el-input
          v-model="queryParams.publishId"
          placeholder="请输入行程ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户类型" prop="userType">
          <el-select
                v-model="queryParams.userType"
                placeholder="用户类型"
                clearable
                style="width: 240px"
            >
          <el-option
            v-for="dict in carpool_user_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预约人" prop="orderUserName">
        <el-input
          v-model="queryParams.orderUserName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="乘客人数" prop="passengerNum">
        <el-input
          v-model="queryParams.passengerNum"
          placeholder="请输入乘客人数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
          <el-select
                v-model="queryParams.status"
                placeholder="状态"
                clearable
                style="width: 240px"
            >
          <el-option
            v-for="dict in carpool_order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出发地点" prop="startPoint">
        <el-input
          v-model="queryParams.startPoint"
          placeholder="请输入出发地点"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="终点" prop="destination">
        <el-input
          v-model="queryParams.destination"
          placeholder="请输入终点"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出发时间" prop="departureTime">
        <el-date-picker clearable
          v-model="queryParams.departureTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择出发时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['carpool:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['carpool:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['carpool:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="true"/>
      <el-table-column label="行程ID" align="center" prop="publishId" />
      <el-table-column label="用户类型" align="center" prop="userType" >
        <template #default="scope">
            <dict-tag :options="carpool_user_type" :value="scope.row.userType" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="orderUserName" />
      <el-table-column label="联系电话" align="center" prop="mobile" />
      <el-table-column label="乘客人数" align="center" prop="passengerNum" />
      <el-table-column label="出发地点" align="center" prop="startPoint" />
      <el-table-column label="起点经度" align="center" prop="startPointLongitude" />
      <el-table-column label="起点纬度" align="center" prop="startPointLatitude" />
      <el-table-column label="起点GEO" align="center" prop="startPointGeo" />
      <el-table-column label="终点" align="center" prop="destination" />
      <el-table-column label="终点经度" align="center" prop="destinationLongitude" />
      <el-table-column label="终点纬度" align="center" prop="destinationLatitude" />
      <el-table-column label="终点GEO" align="center" prop="destinationGeo" />
      <el-table-column label="出发时间" align="center" prop="departureTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.departureTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
            <dict-tag :options="carpool_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="拒绝原因" align="center" prop="refuseReason" />
      <el-table-column label="取消原因" align="center" prop="cancelReason" />
      <el-table-column label="操作人" align="center" prop="operatorName" />
      <el-table-column label="备注信息" align="center" prop="bake" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carpool:order:edit']" >修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carpool:order:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改订单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="行程id" prop="publishId">
          <el-input v-model="form.publishId" aria-readonly="true" placeholder="请输入行程id" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择">
            <el-option
                v-for="dict in carpool_user_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" aria-readonly="true" prop="orderUserName">
          <el-input v-model="form.orderUserName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="乘客人数" prop="passengerNum">
          <el-input v-model="form.passengerNum" placeholder="请输入乘客人数" />
        </el-form-item>
        <el-form-item label="出发地点" prop="startPoint">
          <el-input v-model="form.startPoint" type="textarea" aria-readonly="true" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="起点经度" prop="startPointLongitude">
          <el-input v-model="form.startPointLongitude" aria-readonly="true" placeholder="请输入起点经度" />
        </el-form-item>
        <el-form-item label="起点纬度" prop="startPointLatitude">
          <el-input v-model="form.startPointLatitude" aria-readonly="true" placeholder="请输入起点纬度" />
        </el-form-item>
        <el-form-item label="起点GEO" prop="startPointGeo">
          <el-input v-model="form.startPointGeo" aria-readonly="true" placeholder="请输入起点GEO" />
        </el-form-item>
        <el-form-item label="终点" prop="destination">
          <el-input v-model="form.destination" type="textarea" aria-readonly="true" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="终点经度" prop="destinationLongitude">
          <el-input v-model="form.destinationLongitude"  aria-readonly="true" placeholder="请输入终点经度" />
        </el-form-item>
        <el-form-item label="终点纬度" prop="destinationLatitude">
          <el-input v-model="form.destinationLatitude" aria-readonly="true" placeholder="请输入终点纬度" />
        </el-form-item>
        <el-form-item label="终点GEO" prop="destinationGeo">
          <el-input v-model="form.destinationGeo" aria-readonly="true" placeholder="请输入终点GEO" />
        </el-form-item>
        <el-form-item label="出发时间" prop="departureTime">
          <el-date-picker clearable
            v-model="form.departureTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择出发时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="拒绝原因" prop="refuseReason">
          <el-input v-model="form.refuseReason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="取消原因" prop="cancelReason">
          <el-input v-model="form.cancelReason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注信息" prop="bake">
          <el-input v-model="form.bake" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script  setup name="carpoolCar">
const { proxy } = getCurrentInstance();
const { carpool_user_type } = proxy.useDict("carpool_user_type");
const { carpool_order_status } = proxy.useDict("carpool_order_status");
</script>
<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/carpool/order";

export default {
  name: "Order",
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        publishId: undefined,
        userType: undefined,
        orderUserId: undefined,
        orderUserName: undefined,
        mobile: undefined,
        passengerNum: undefined,
        startPoint: undefined,
        startPointLongitude: undefined,
        startPointLatitude: undefined,
        startPointGeo: undefined,
        destination: undefined,
        destinationLongitude: undefined,
        destinationLatitude: undefined,
        destinationGeo: undefined,
        departureTime: undefined,
        status: undefined,
        refuseReason: undefined,
        cancelReason: undefined,
        operatorId: undefined,
        operatorName: undefined,
        bake: undefined,
        dataStatus: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mobile: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        publishId: undefined,
        userType: undefined,
        orderUserId: undefined,
        orderUserName: undefined,
        mobile: undefined,
        passengerNum: undefined,
        startPoint: undefined,
        startPointLongitude: undefined,
        startPointLatitude: undefined,
        startPointGeo: undefined,
        destination: undefined,
        destinationLongitude: undefined,
        destinationLatitude: undefined,
        destinationGeo: undefined,
        departureTime: undefined,
        status: undefined,
        refuseReason: undefined,
        cancelReason: undefined,
        operatorId: undefined,
        operatorName: undefined,
        createTime: undefined,
        updateTime: undefined,
        bake: undefined,
        dataStatus: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addOrder(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除订单编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delOrder(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('carpool/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
