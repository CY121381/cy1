<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="头像" prop="avatar">
        <el-input
          v-model="queryParams.avatar"
          placeholder="请输入头像"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信昵称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入微信昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片路径，最多支持九张" prop="imgUrl">
        <el-input
          v-model="queryParams.imgUrl"
          placeholder="请输入图片路径，最多支持九张"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频路径" prop="videoUrl">
        <el-input
          v-model="queryParams.videoUrl"
          placeholder="请输入视频路径"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资源宽度" prop="width">
        <el-input
          v-model="queryParams.width"
          placeholder="请输入资源宽度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资源高度" prop="height">
        <el-input
          v-model="queryParams.height"
          placeholder="请输入资源高度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="音频路径" prop="voiceUrl">
        <el-input
          v-model="queryParams.voiceUrl"
          placeholder="请输入音频路径"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input
          v-model="queryParams.author"
          placeholder="请输入作者"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="音频背景图" prop="bimgUrl">
        <el-input
          v-model="queryParams.bimgUrl"
          placeholder="请输入音频背景图"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="点赞数" prop="agreeNum">
        <el-input
          v-model="queryParams.agreeNum"
          placeholder="请输入点赞数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="踩数" prop="dissNum">
        <el-input
          v-model="queryParams.dissNum"
          placeholder="请输入踩数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转发数" prop="repostNum">
        <el-input
          v-model="queryParams.repostNum"
          placeholder="请输入转发数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论数" prop="commentNum">
        <el-input
          v-model="queryParams.commentNum"
          placeholder="请输入评论数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['carpool:forum:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['carpool:forum:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['carpool:forum:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['carpool:forum:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="forumList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增id" align="center" prop="id" v-if="true"/>
      <el-table-column label="头像" align="center" prop="avatar" />
      <el-table-column label="微信昵称" align="center" prop="name" />
      <el-table-column label="信息类型 1->全部;41->视频;10->图片;29->文本;31->声音" align="center" prop="type" />
      <el-table-column label="文本内容" align="center" prop="content" />
      <el-table-column label="图片路径，最多支持九张" align="center" prop="imgUrl" />
      <el-table-column label="视频路径" align="center" prop="videoUrl" />
      <el-table-column label="资源宽度" align="center" prop="width" />
      <el-table-column label="资源高度" align="center" prop="height" />
      <el-table-column label="音频路径" align="center" prop="voiceUrl" />
      <el-table-column label="作者" align="center" prop="author" />
      <el-table-column label="音频背景图" align="center" prop="bimgUrl" />
      <el-table-column label="点赞数" align="center" prop="agreeNum" />
      <el-table-column label="踩数" align="center" prop="dissNum" />
      <el-table-column label="转发数" align="center" prop="repostNum" />
      <el-table-column label="评论数" align="center" prop="commentNum" />
      <el-table-column label="数据状态 0 正常 1 删除" align="center" prop="dataStatus" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['carpool:forum:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['carpool:forum:remove']"
          >删除</el-button>
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

    <!-- 添加或修改论坛信息

对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入头像" />
        </el-form-item>
        <el-form-item label="微信昵称" prop="name">
          <el-input v-model="form.name" placeholder="请输入微信昵称" />
        </el-form-item>
        <el-form-item label="文本内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="图片路径，最多支持九张" prop="imgUrl">
          <el-input v-model="form.imgUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="视频路径" prop="videoUrl">
          <el-input v-model="form.videoUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="资源宽度" prop="width">
          <el-input v-model="form.width" placeholder="请输入资源宽度" />
        </el-form-item>
        <el-form-item label="资源高度" prop="height">
          <el-input v-model="form.height" placeholder="请输入资源高度" />
        </el-form-item>
        <el-form-item label="音频路径" prop="voiceUrl">
          <el-input v-model="form.voiceUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="音频背景图" prop="bimgUrl">
          <el-input v-model="form.bimgUrl" placeholder="请输入音频背景图" />
        </el-form-item>
        <el-form-item label="点赞数" prop="agreeNum">
          <el-input v-model="form.agreeNum" placeholder="请输入点赞数" />
        </el-form-item>
        <el-form-item label="踩数" prop="dissNum">
          <el-input v-model="form.dissNum" placeholder="请输入踩数" />
        </el-form-item>
        <el-form-item label="转发数" prop="repostNum">
          <el-input v-model="form.repostNum" placeholder="请输入转发数" />
        </el-form-item>
        <el-form-item label="评论数" prop="commentNum">
          <el-input v-model="form.commentNum" placeholder="请输入评论数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listForum, getForum, delForum, addForum, updateForum } from "@/api/carpool/forum";

export default {
  name: "Forum",
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
      // 论坛信息

表格数据
      forumList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        avatar: undefined,
        name: undefined,
        type: undefined,
        content: undefined,
        imgUrl: undefined,
        videoUrl: undefined,
        width: undefined,
        height: undefined,
        voiceUrl: undefined,
        author: undefined,
        bimgUrl: undefined,
        agreeNum: undefined,
        dissNum: undefined,
        repostNum: undefined,
        commentNum: undefined,
        dataStatus: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "自增id不能为空", trigger: "blur" }
        ],
        avatar: [
          { required: true, message: "头像不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "微信昵称不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "信息类型 1->全部;41->视频;10->图片;29->文本;31->声音不能为空", trigger: "change" }
        ],
        content: [
          { required: true, message: "文本内容不能为空", trigger: "blur" }
        ],
        imgUrl: [
          { required: true, message: "图片路径，最多支持九张不能为空", trigger: "blur" }
        ],
        videoUrl: [
          { required: true, message: "视频路径不能为空", trigger: "blur" }
        ],
        width: [
          { required: true, message: "资源宽度不能为空", trigger: "blur" }
        ],
        height: [
          { required: true, message: "资源高度不能为空", trigger: "blur" }
        ],
        voiceUrl: [
          { required: true, message: "音频路径不能为空", trigger: "blur" }
        ],
        author: [
          { required: true, message: "作者不能为空", trigger: "blur" }
        ],
        bimgUrl: [
          { required: true, message: "音频背景图不能为空", trigger: "blur" }
        ],
        agreeNum: [
          { required: true, message: "点赞数不能为空", trigger: "blur" }
        ],
        dissNum: [
          { required: true, message: "踩数不能为空", trigger: "blur" }
        ],
        repostNum: [
          { required: true, message: "转发数不能为空", trigger: "blur" }
        ],
        commentNum: [
          { required: true, message: "评论数不能为空", trigger: "blur" }
        ],
        dataStatus: [
          { required: true, message: "数据状态 0 正常 1 删除不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询论坛信息

列表 */
    getList() {
      this.loading = true;
      listForum(this.queryParams).then(response => {
        this.forumList = response.rows;
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
        avatar: undefined,
        name: undefined,
        type: undefined,
        content: undefined,
        imgUrl: undefined,
        videoUrl: undefined,
        width: undefined,
        height: undefined,
        voiceUrl: undefined,
        author: undefined,
        bimgUrl: undefined,
        agreeNum: undefined,
        dissNum: undefined,
        repostNum: undefined,
        commentNum: undefined,
        createTime: undefined,
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
      this.title = "添加论坛信息

";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getForum(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改论坛信息

";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateForum(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addForum(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除论坛信息

编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delForum(ids);
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
      this.download('carpool/forum/export', {
        ...this.queryParams
      }, `forum_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
