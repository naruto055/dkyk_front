<script>
import {doGet} from "../http/httpRequest.js";

export default {
  name: "UserDetailView",
  data() {
    return {
      // 用户详情
      userDetail: {
        createByDO: {},
        editByDO: {}
      }
    }
  },
  methods: {
    // 加载用户详情数据
    loadUserDetail() {
      let id = this.$route.params.id;
      doGet('/api/user/' + id, {}).then((resp) => {
        if (resp.data.code === 200) {
          this.userDetail = resp.data.data;
          if (!this.userDetail.editByDO || !this.userDetail.createByDO) {
            this.userDetail.editByDO = {};
            this.userDetail.createByDO = {};
          }
        }
      })
    },

    // 返回
    goBack() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.loadUserDetail();
  }
}
</script>

<template>
  <el-form ref="loginForm" label-width="auto" style="max-width: 600px">
    <el-form-item label="ID">
      <div class="detail">{{userDetail.id}}</div>
    </el-form-item>

    <el-form-item label="账号" >
      <div class="detail">{{userDetail.loginAct}}</div>
    </el-form-item>
    <el-form-item label="密码" >
      <div class="detail">******</div>
    </el-form-item>
    <el-form-item label="姓名" >
      <div class="detail">{{userDetail.name}}</div>
    </el-form-item>
    <el-form-item label="手机" >
      <div class="detail">{{userDetail.phone}}</div>
    </el-form-item>
    <el-form-item label="邮箱" >
      <div class="detail">{{userDetail.email}}</div>
    </el-form-item>
    <el-form-item label="账号未过期" >
      <div class="detail">{{userDetail.accountNoExpired === 1 ? '是' : '否'}}</div>
    </el-form-item>
    <el-form-item label="密码未过期" >
      <div class="detail">{{userDetail.credentialsNoExpired === 1 ? '是' : '否'}}</div>
    </el-form-item>
    <el-form-item label="账号未锁定" >
      <div class="detail">{{userDetail.accountNoLocked === 1 ? '是' : '否'}}</div>
    </el-form-item>
    <el-form-item label="账号是否启用" >
      <div class="detail">{{userDetail.acctountEnable === 1 ? '是' : '否'}}</div>
    </el-form-item>
    <el-form-item label="创建时间" >
      <div class="detail">{{userDetail.createTime}}</div>
    </el-form-item>
    <el-form-item label="创建人" >
      <div class="detail">{{userDetail.createByDO.name}}</div>
    </el-form-item>
    <el-form-item label="编辑时间" >
      <div class="detail">{{userDetail.editTime}}</div>
    </el-form-item>
    <el-form-item label="编辑人" >
      <div class="detail">{{userDetail.editByDO.name}}</div>
    </el-form-item>
    <el-form-item label="最近登录时间" >
      <div class="detail">{{userDetail.lastLoginTime}}</div>
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="goBack">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.detail {
  width: 100%;
  background-color: #f0ffff;
  padding-left: 15px;
}
</style>