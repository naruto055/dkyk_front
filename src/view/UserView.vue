<script>
import {doDelete, doGet, doPost, doPut} from "../http/httpRequest.js";
import {messageConfirm, messageTip} from "../util/util.js";

export default {
  name: "UserView",
  data() {
    return {
      userList: [{}],
      totalCount: 0,
      pageSize: 0,
      dialogVisible: false,
      // 添加新用户需要的信息
      userQuery: {},
      // 定义用户验证规则
      userRules: {
        loginAct: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        loginPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '登录密码长度为6~16位', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {pattern: '^[\u4e00-\u9fa5]+$', message: '姓名必须是中文', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: '^1[3-9]\\d{9}$', message: '请输入正确手机号', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', message: '请输入正确的邮箱', trigger: 'blur'}
        ],
        accountNoExpired: [
          {required: true, message: '请选择账号是否未过期', trigger: 'blur'},
        ],
        credentialsNoExpired: [
          {required: true, message: '请选择密码是否未过期', trigger: 'blur'},
        ],
        accountNoLocked: [
          {required: true, message: '请选择账号是否未锁定', trigger: 'blur'},
        ],
        accountEnabled: [
          {required: true, message: '请选择账号是否启用', trigger: 'blur'},
        ]
      },
      // 下拉选项数组
      option: [
        {label: '是', value: 1},
        {label: '否', value: 0}
      ],
      // 被勾选的人员id
      selectedUserIds: []
    }
  },
  // 注入 父组件传递过来的数据（对象，函数）
  inject: ["reload"],
  methods: {
    // 勾选或者取消勾选，触发该函数
    handleSelectionChange(selectItemArr) {
      this.selectedUserIds = [];
      selectItemArr.forEach((item) => {
        this.selectedUserIds.push(item.id);
      })
    },

    // 获取用户数据
    getUserData(current) {
      doGet('/api/users', {
        current: current,  // 当前页
      }).then((resp) => {
        if (resp.data.code === 200) {
          this.userList = resp.data.data.list;
          this.totalCount = resp.data.data.total;
          this.pageSize = resp.data.data.pageSize;
        }
      })
    },

    // 分页函数，点击页码获取数据
    toPage(current) {
      this.getUserData(current);
    },

    // 获取详情信息
    getDetail(index) {
      console.log(index);
      this.$router.push('/dashboard/user/' + index);
    },

    // 新增用户
    addUser() {
      this.userQuery = {};
      // 弹出对话框
      if (!this.dialogVisible) {
        this.dialogVisible = !this.dialogVisible;
      }
    },

    // 提交新增用户的数据
    userSubmit() {
      let formData = new FormData();
      for (let data in this.userQuery) {
        formData.append(data, this.userQuery[data]);
      }
      this.$refs.userRefForm.validate((isValid) => {
        if (isValid) {
          // 编辑用户
          if (this.userQuery.id > 0) {
            doPut('/api/user', formData).then((resp) => {
              if (resp.data.code === 200) {
                messageTip('编辑成功', 'success');
                // 刷新页面
                this.reload();
              } else {
                messageTip('编辑失败', 'error');
              }
            })
          } else {
            // 新增用户
            doPost('/api/user', formData).then((resp) => {
              if (resp.data.code === 200) {
                messageTip('新增用户成功', 'success');
                this.dialogVisible = false;
                // 刷新页面
                this.reload();
              } else {
                messageTip('提交失败', 'error');
              }
            })
          }
        }
      })
    },

    // 编辑用户
    edit(id) {
      this.dialogVisible = true;
      this.loadUser(id);
    },

    // 加载个人用户信息
    loadUser(id) {
      doGet('/api/user/' + id, {}).then((resp) => {
        if (resp.data.code === 200) {
          this.userQuery = resp.data.data;
          this.userQuery.loginPwd = '';
        }
      })
    },

    // 删除用户
    del(id) {
      messageConfirm("您确定要删除该数据吗？").then(() => { //用户点击“确定”按钮就会触发then函数
        doDelete("/api/user/" + id, {}).then(resp => {
          if (resp.data.code === 200) {
            messageTip("删除成功", "success");
            //页面刷新
            this.reload();
          } else {
            messageTip("删除失败，原因：" + resp.data.msg, "error");
          }
        })
      }).catch(() => { //用户点击“取消”按钮就会触发catch函数
        messageTip("取消删除", "warning");
      })
    },

    // 批量删除
    batchDel() {
      if (this.selectedUserIds.length <= 0) {
        messageTip('请选择要删除的数据', 'warning');
        return;
      }
      let ids = this.selectedUserIds.join(',');
      messageConfirm("您确定要删除该数据吗？").then(() => { //用户点击“确定”按钮就会触发then函数
        doDelete('/api/user', {ids: ids}).then((resp) => {
          if (resp.data.code === 200) {
            messageTip('批量删除成功', 'success');
            this.reload();
          } else {
            messageTip('批量删除失败', 'error');
          }
        })
      }).catch(() => { //用户点击“取消”按钮就会触发catch函数
        messageTip("取消批量删除", "warning");
      })
    }
  },
  mounted() {
    this.getUserData(1);
  }
}
</script>

<template>
  <el-button type="primary" @click="addUser" v-has-permission="'user:add'">添加用户</el-button>
  <el-button type="danger" @click=batchDel v-has-permission="'user:delete'">批量删除</el-button>

  <el-table
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection"/>
    <el-table-column type="index" label="序号" width="60"/>
    <el-table-column property="loginAct" label="账号" width="120"/>
    <el-table-column property="name" label="姓名" show-overflow-tooltip width="150"/>
    <el-table-column property="phone" label="手机" show-overflow-tooltip/>
    <el-table-column property="email" label="邮箱" show-overflow-tooltip/>
    <el-table-column property="createTime" label="创建时间" show-overflow-tooltip width="200"/>
    <el-table-column label="操作" show-overflow-tooltip width="250">
      <template #default="scope">
        <!--作用域插槽-->
        <el-button type="primary" @click="getDetail(scope.row.id)" v-has-permission="'user:view'">详情</el-button>
        <el-button type="success" @click="edit(scope.row.id)" v-has-permission="'user:edit'">编辑</el-button>
        <el-button type="danger" @click="del(scope.row.id)" v-has-permission="'user:delete'">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background layout="prev, pager, next"
                 :total="totalCount"
                 :page-size="pageSize"
                 @prev-click="toPage"
                 @next-click="toPage"
                 @current-change="toPage"/>

  <!--新增用户弹窗-->
  <el-dialog v-model="dialogVisible" :title="userQuery.id > 0 ? '编辑用户' : '新增用户'" width="50%" center draggable>
    <el-form ref="userRefForm" :model="userQuery" label-width="auto" :rules="userRules">
      <el-form-item label="账号" prop="loginAct">
        <el-input v-model="userQuery.loginAct"/>
      </el-form-item>

      <!--编辑的时候，密码不需要验证-->
      <el-form-item label="密码" v-if="userQuery.id > 0">
        <el-input v-model="userQuery.loginPwd" type="password"/>
      </el-form-item>
      <!--新增的时候，密码验证-->
      <el-form-item label="密码" prop="loginPwd" v-else>
        <el-input v-model="userQuery.loginPwd" type="password"/>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="userQuery.name" type="text"/>
      </el-form-item>

      <el-form-item label="手机" prop="phone">
        <el-input v-model="userQuery.phone" type="text"/>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userQuery.email" type="text"/>
      </el-form-item>

      <el-form-item label="账号未过期" prop="accountNoExpired">
        <el-select
            v-model="userQuery.accountNoExpired"
            placeholder="请选择"
            size="large">
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="密码未过期" prop="credentialsNoExpired">
        <el-select
            v-model="userQuery.credentialsNoExpired"
            placeholder="请选择"
            size="large">
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="账号未锁定" prop="accountNoLocked">
        <el-select
            v-model="userQuery.accountNoLocked"
            placeholder="请选择"
            size="large">
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="账号是否启用" prop="accountEnabled">
        <el-select
            v-model="userQuery.accountEnabled"
            placeholder="请选择"
            size="large">
          <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="userSubmit">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-table {
  margin-top: 12px;
}

.el-pagination {
  margin-top: 20px;
}
</style>