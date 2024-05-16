<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属人" prop="userId">
        <el-select
                v-model="queryParams.userId"
                placeholder="所属人"
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
      <el-form-item label="车辆类型" prop="carType">
          <el-select
                v-model="queryParams.carType"
                placeholder="车辆类型"
                clearable
                style="width: 240px"
            >
          <el-option
            v-for="dict in car_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆颜色" prop="color">
        <el-select
                v-model="queryParams.color"
                placeholder="车辆颜色"
                clearable
                style="width: 240px"
            >
          <el-option
            v-for="dict in car_color"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      <el-form-item label="车座位数" prop="seatNums">
        <el-input
          v-model="queryParams.seatNums"
          placeholder="请输入车座位数"
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['carpool:car:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['carpool:car:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['carpool:car:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['carpool:car:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="carList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="true"/>
      <el-table-column label="所属人" align="center" prop="userName" />
      <el-table-column label="车辆类型" align="center" prop="carType" >
        <template #default="scope">
            <dict-tag :options="car_type" :value="scope.row.carType" />
        </template>
      </el-table-column>
      <el-table-column label="车辆颜色" align="center" prop="color" >
        <template #default="scope">
            <dict-tag :options="car_color" :value="scope.row.color" />
        </template>
      </el-table-column>
      <el-table-column label="车牌号前缀" align="center" prop="plateNumberPrefix" />
      <el-table-column label="车牌号" align="center" prop="plateNumber" />
      <el-table-column label="品牌" align="center" prop="carBrand" />
      <el-table-column label="驾驶证" align="center" prop="driverLicense" >
        <template #default="scope">
          <img :src="scope.row.driverLicense"  class="img-normal">
        </template>
      </el-table-column>
      <el-table-column label="行驶证" align="center" prop="drivingLicense" >
        <template #default="scope">
          <img :src="scope.row.drivingLicense"  class="img-normal">
        </template>
      </el-table-column>
      <el-table-column label="车座位数" align="center" prop="seatNums" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carpool:car:edit']" >修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carpool:car:remove']">删除</el-button>
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

    <!-- 添加或修改车辆信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属人" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入所属人" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="color">
          <el-select v-model="form.carType" placeholder="请选择">
            <el-option
                v-for="dict in car_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆颜色" prop="color">
          <el-select v-model="form.color" placeholder="请选择">
            <el-option
                v-for="dict in car_color"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牌号前缀" prop="plateNumberPrefix">
          <el-input v-model="form.plateNumberPrefix" placeholder="请输入牌号前缀" />
        </el-form-item>
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="品牌" prop="carBrand">
          <el-input v-model="form.carBrand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="驾驶证" prop="driverLicense">
          <el-input v-model="form.driverLicense" placeholder="请输入驾驶证" />
        </el-form-item>
        <el-form-item label="行驶证" prop="drivingLicense">
          <el-input v-model="form.drivingLicense" placeholder="请输入行驶证" />
        </el-form-item>
        <el-form-item label="车座位数" prop="seatNums">
          <el-input v-model="form.seatNums" placeholder="请输入车座位数" />
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
const { car_type } = proxy.useDict("car_type");
const { car_color } = proxy.useDict("car_color");
</script>
<script>
import { getUsers } from "@/api/carpool/user";
import { listCar, getCar, delCar, addCar, updateCar } from "@/api/carpool/car";


export default {
  name: "Car",
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
      // 车辆信息表格数据
      carList: [],
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
        userId: undefined,
        carType: undefined,
        color: undefined,
        plateNumberPrefix: undefined,
        plateNumber: undefined,
        carBrand: undefined,
        driverLicense: undefined,
        drivingLicense: undefined,
        seatNums: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        carType: [
          { required: true, message: "车辆类型不能为空", trigger: "change" }
        ],
        color: [
          { required: true, message: "车辆颜色不能为空", trigger: "blur" }
        ],
        plateNumberPrefix: [
          { required: true, message: "车牌号前缀不能为空", trigger: "blur" }
        ],
        plateNumber: [
          { required: true, message: "车牌号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
    this.getList();
  },
  methods: {
    /** 查询车辆信息列表 */
    getList() {
      this.loading = true;
      listCar(this.queryParams).then(response => {
        this.carList = response.rows;
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
        userId: undefined,
        carType: undefined,
        color: undefined,
        plateNumberPrefix: undefined,
        plateNumber: undefined,
        carBrand: undefined,
        driverLicense: undefined,
        drivingLicense: undefined,
        seatNums: undefined
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
      this.title = "添加车辆信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getCar(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改车辆信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCar(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addCar(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除车辆信息编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delCar(ids);
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
      this.download('carpool/car/export', {
        ...this.queryParams
      }, `car_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
