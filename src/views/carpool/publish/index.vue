<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="发布人" prop="publishUserId">
        <el-select
                v-model="queryParams.publishUserId"
                placeholder="发布人"
                clearable
                style="width: 240px"
            >
          <el-option
            v-for="u in userList"
            :key="u.id"
            :label="u.userName"
            :value="u.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="途经地方" prop="byWays">
        <el-input
          v-model="queryParams.byWays"
          placeholder="请输入途经地方"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车程安排" prop="schedule">
        <el-select
                v-model="queryParams.schedule"
                placeholder="车程安排"
                clearable
                style="width: 240px"
            >
          <el-option
            v-for="dict in carpool_schedule"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出发时间" prop="departureTime">
        <el-date-picker clearable
          v-model="queryParams.departureTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择出发时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="返程日期" prop="backDate">
        <el-date-picker clearable
          v-model="queryParams.backDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择返程日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="返程时分" prop="backTime">
        <el-date-picker clearable
          v-model="queryParams.backTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择返程时分">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="乘客人数" prop="passengerNum">
        <el-input
          v-model="queryParams.passengerNum"
          placeholder="请输入乘客人数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="牌号前缀" prop="plateNumberPrefix">
        <el-input
          v-model="queryParams.plateNumberPrefix"
          placeholder="请输入牌号前缀"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber">
        <el-input
          v-model="queryParams.plateNumber"
          placeholder="请输入车牌号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="品牌" prop="carBrand">
        <el-input
          v-model="queryParams.carBrand"
          placeholder="请输入品牌"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['carpool:publish:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
        type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['carpool:publish:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['carpool:publish:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="publishList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="true"/>
      <el-table-column label="发布人" align="center" prop="publishUserName" />
      <el-table-column label="用户类型" align="center" prop="userType" >
        <template #default="scope">
            <dict-tag :options="carpool_user_type" :value="scope.row.userType" />
        </template>
      </el-table-column>
      <el-table-column label="拼车类型" align="center" prop="type" />
      <el-table-column label="联系电话" align="center" prop="mobile" />
      <el-table-column label="金额" align="center" prop="price" />
      <el-table-column label="出发地点" align="center" prop="startPoint" />
      <el-table-column label="起点经度" align="center" prop="startPointLongitude" />
      <el-table-column label="起点维度" align="center" prop="startPointLatitude" />
      <el-table-column label="起点GEO" align="center" prop="startPointGeo" />
      <el-table-column label="终点" align="center" prop="destination" />
      <el-table-column label="终点经度" align="center" prop="destinationLongitude" />
      <el-table-column label="终点维度" align="center" prop="destinationLatitude" />
      <el-table-column label="终点GEO" align="center" prop="destinationGeo" />
      <el-table-column label="途经地方" align="center" prop="byWays" />
      <el-table-column label="车程安排" align="center" prop="schedule" >
        <template #default="scope">
            <dict-tag :options="carpool_schedule" :value="scope.row.schedule" />
        </template>
      </el-table-column>
      <el-table-column label="出发时间" align="center" prop="departureTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.departureTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返程日期" align="center" prop="backDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.backDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返程时分" align="center" prop="backTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.backTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="乘客人数" align="center" prop="passengerNum" />
      <el-table-column label="车辆类型" align="center" prop="carType" />
      <el-table-column label="牌号前缀" align="center" prop="plateNumberPrefix" />
      <el-table-column label="车牌号" align="center" prop="plateNumber" />
      <el-table-column label="车辆颜色" align="center" prop="carColor" >
        <template #default="scope">
            <dict-tag :options="car_color" :value="scope.row.carColor" />
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center" prop="carBrand" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
            <dict-tag :options="carpool_publish_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="取消原因" align="center" prop="cancelReason" />
      <el-table-column label="备注信息" align="center" prop="bake" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carpool:publish:edit']" >修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carpool:publish:remove']">删除</el-button>
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

    <!-- 添加或修改拼车发布信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发布人"  prop="publishUserId">
          <el-input v-model="form.publishUserId" aria-readonly="true" placeholder="请输入发布人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input v-model="form.price" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="具体的出发地点" aria-readonly="true" prop="startPoint">
          <el-input v-model="form.startPoint" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="起点经度" aria-readonly="true" prop="startPointLongitude">
          <el-input v-model="form.startPointLongitude" placeholder="请输入起点经度" />
        </el-form-item>
        <el-form-item label="起点维度" aria-readonly="true" prop="startPointLatitude">
          <el-input v-model="form.startPointLatitude" placeholder="请输入起点维度" />
        </el-form-item>
        <el-form-item label="起点GEO编码" aria-readonly="true" prop="startPointGeo">
          <el-input v-model="form.startPointGeo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="终点" aria-readonly="true" prop="destination">
          <el-input v-model="form.destination" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="终点经度" aria-readonly="true" prop="destinationLongitude">
          <el-input v-model="form.destinationLongitude" placeholder="请输入终点经度" />
        </el-form-item>
        <el-form-item label="终点维度" aria-readonly="true" prop="destinationLatitude">
          <el-input v-model="form.destinationLatitude" placeholder="请输入终点维度" />
        </el-form-item>
        <el-form-item label="终点GEO编码" aria-readonly="true" prop="destinationGeo">
          <el-input v-model="form.destinationGeo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="途经地方" aria-readonly="true" prop="byWays">
          <el-input v-model="form.byWays" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="车程安排" prop="schedule">
          <el-input v-model="form.schedule" placeholder="请输入车程安排" />
        </el-form-item>
        <el-form-item label="出发时间" prop="departureTime">
          <el-date-picker clearable
            v-model="form.departureTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择出发时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="返程日期" prop="backDate">
          <el-date-picker clearable
            v-model="form.backDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择返程日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="返程时分" prop="backTime">
          <el-date-picker clearable
            v-model="form.backTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择返程时分">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="乘客人数" prop="passengerNum">
          <el-input v-model="form.passengerNum" placeholder="请输入乘客人数" />
        </el-form-item>
        <el-form-item label="牌号前缀" aria-readonly="true" prop="plateNumberPrefix">
          <el-input v-model="form.plateNumberPrefix" placeholder="请输入牌号前缀" />
        </el-form-item>
        <el-form-item label="车牌号" aria-readonly="true" prop="plateNumber">
          <el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车辆颜色" aria-readonly="true" prop="carColor">
          <el-select v-model="form.carColor" placeholder="请选择">
            <el-option
                v-for="dict in car_color"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" aria-readonly="true" prop="carBrand">
          <el-input v-model="form.carBrand" placeholder="请输入品牌" />
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
<script  setup name="carpoolPublish">
const { proxy } = getCurrentInstance();
const { car_type } = proxy.useDict("car_type");
const { car_color } = proxy.useDict("car_color");
const { carpool_user_type } = proxy.useDict("carpool_user_type");
const { carpool_schedule } = proxy.useDict("carpool_schedule");
const { carpool_publish_status } = proxy.useDict("carpool_publish_status");
</script>
<script>
import { listPublish, getPublish, delPublish, addPublish, updatePublish } from "@/api/carpool/publish";
import { getUsers } from "@/api/carpool/user";
export default {
  name: "Publish",
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
      // 拼车发布信息表格数据
      publishList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
       //用户列表
       userList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        publishUserId: undefined,
        userType: undefined,
        type: undefined,
        mobile: undefined,
        price: undefined,
        startPoint: undefined,
        startPointLongitude: undefined,
        startPointLatitude: undefined,
        startPointGeo: undefined,
        destination: undefined,
        destinationLongitude: undefined,
        destinationLatitude: undefined,
        destinationGeo: undefined,
        byWays: undefined,
        schedule: undefined,
        departureTime: undefined,
        backDate: undefined,
        backTime: undefined,
        passengerNum: undefined,
        carType: undefined,
        plateNumberPrefix: undefined,
        plateNumber: undefined,
        carColor: undefined,
        carBrand: undefined,
        status: undefined,
        cancelReason: undefined,
        bake: undefined,
        dataStatus: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
       
        userType: [
          { required: true, message: "用户类型不能为空", trigger: "change" }
        ],
        type: [
          { required: true, message: "拼车类型不能为空", trigger: "change" }
        ]
      
      }
    };
  },
  created() {
    this.getUserList();
    this.getList();
  },
  methods: {
    /** 查询拼车发布信息列表 */
    getList() {
      this.loading = true;
      listPublish(this.queryParams).then(response => {
        this.publishList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getUserList() {
      getUsers({dataStatus:0}).then(response => {
        this.userList = response;
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
        publishUserId: undefined,
        userType: undefined,
        type: undefined,
        mobile: undefined,
        price: undefined,
        startPoint: undefined,
        startPointLongitude: undefined,
        startPointLatitude: undefined,
        startPointGeo: undefined,
        destination: undefined,
        destinationLongitude: undefined,
        destinationLatitude: undefined,
        destinationGeo: undefined,
        byWays: undefined,
        schedule: undefined,
        departureTime: undefined,
        backDate: undefined,
        backTime: undefined,
        passengerNum: undefined,
        carType: undefined,
        plateNumberPrefix: undefined,
        plateNumber: undefined,
        carColor: undefined,
        carBrand: undefined,
        status: undefined,
        cancelReason: undefined,
        bake: undefined,
        createTime: undefined,
        updateTime: undefined,
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
      this.title = "添加拼车发布信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getPublish(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改拼车发布信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updatePublish(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addPublish(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除拼车发布信息编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delPublish(ids);
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
      this.download('carpool/publish/export', {
        ...this.queryParams
      }, `publish_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
