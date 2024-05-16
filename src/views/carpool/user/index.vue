<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
     
      <el-form-item label="用户姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省份" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请输入省份"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入地市"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区" prop="county">
        <el-input
          v-model="queryParams.county"
          placeholder="请输入区"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否实名" prop="isRealName">
        <el-select v-model="queryParams.isRealName" placeholder="实名" clearable>
               <el-option
                  v-for="dict in sv_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
         </el-select>
      </el-form-item>
      <el-form-item label="是否认证" prop="isAuth">
        <el-select v-model="queryParams.isAuth" placeholder="认证" clearable>
            <el-option
              v-for="dict in sv_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
        </el-select>
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
          v-hasPermi="['carpool:user:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['carpool:user:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['carpool:user:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="true"/>
      <el-table-column label="wxId" align="center" prop="wxOpenid" />
      <el-table-column label="用户姓名" align="center" prop="userName" />
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="手机号码" align="center" prop="mobile" />
      <el-table-column label="性别" align="center" prop="sex" >
        <template #default="scope">
            <dict-tag :options="sys_user_sex" :value="scope.row.sex" />
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" prop="avatar" >
        <template #default="scope">
          <img :src="scope.row.avatar"  class="img-circle img-small">
        </template>
      </el-table-column >
      <el-table-column label="省份" align="center" prop="province" />
      <el-table-column label="地市" align="center" prop="city" />
      <el-table-column label="区" align="center" prop="county" />
      <el-table-column label="是否实名" align="center" prop="isRealName" >
        <template #default="scope">
            <dict-tag :options="sv_yes_no" :value="scope.row.isRealName" />
        </template>
      </el-table-column>
      <el-table-column label="是否认证" align="center" prop="isAuth" >
        <template #default="scope">
            <dict-tag :options="sv_yes_no" :value="scope.row.isRealName" />
        </template>
      </el-table-column>
      <el-table-column label="身份证正面" align="center" prop="idCardFace" >
        <template #default="scope">
          <img :src="scope.row.idCardFace"  class="img-normal">
        </template>
      </el-table-column>
      <el-table-column label="身份证背面" align="center" prop="idCardBack" >
        <template #default="scope">
          <img :src="scope.row.idCardBack"  class="img-normal">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['carpool:user:edit']" >修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['carpool:user:remove']">删除</el-button>
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

    <!-- 添加或修改拼车用户对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="" prop="wxOpenid">
          <el-input v-model="form.wxOpenid" aria-readonly="true" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="用户姓名" aria-readonly="true" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item label="昵称" aria-readonly="true" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号码" aria-readonly="true" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="性别" prop="avatar">
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option
                v-for="dict in sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="头像地址" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入头像地址" />
        </el-form-item> -->
        <el-form-item label="省份" prop="province">
          <el-input v-model="form.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="地市" prop="city">
          <el-input v-model="form.city" placeholder="请输入地市" />
        </el-form-item>
        <el-form-item label="区" prop="county">
          <el-input v-model="form.county" placeholder="请输入区" />
        </el-form-item>
        <el-form-item label="是否实名" prop="isRealName">
          <el-select v-model="form.isRealName" placeholder="实名" clearable>
               <el-option
                  v-for="dict in sv_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
        </el-form-item>
        <el-form-item label="是否认证" prop="isAuth">
          <el-select v-model="form.isAuth" placeholder="认证" clearable>
               <el-option
                  v-for="dict in sv_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup name="carpoolUser">
const { proxy } = getCurrentInstance();
const { sv_yes_no } = proxy.useDict("sv_yes_no");
const { sys_user_sex } = proxy.useDict("sys_user_sex");
</script>
<script >
import { listUser, getUser, delUser, addUser, updateUser } from "@/api/carpool/user";

export default {
  name: "User",
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
      // 拼车用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        wxOpenid: undefined,
        userName: undefined,
        nickName: undefined,
        mobile: undefined,
        sex: undefined,
        avatar: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        dataStatus: undefined,
        isRealName: undefined,
        isAuth: undefined,
        idCardFace: undefined,
        idCardBack: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      
        userName: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ]
     
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询拼车用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then(response => {
        this.userList = response.rows;
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
        wxOpenid: undefined,
        userName: undefined,
        nickName: undefined,
        mobile: undefined,
        sex: undefined,
        avatar: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        createTime: undefined,
        updateTime: undefined,
        dataStatus: undefined,
        isRealName: undefined,
        isAuth: undefined,
        idCardFace: undefined,
        idCardBack: undefined
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
      this.title = "添加拼车用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getUser(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改拼车用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addUser(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除拼车用户编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delUser(ids);
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
      this.download('carpool/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
