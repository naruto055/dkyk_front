<script>
import {doDelete, doGet, doPost, doPut} from "../http/httpRequest.js";
import {messageConfirm, messageTip} from "../util/util.js";

export default {
  name: "ActivityDetailView",
  inject: ['reload'],
  data() {
    return {
      // 市场活动详情
      activityDetail: {
        ownerDO: {},
        createByDO: {},
        editByDO: {}
      },
      // 提交时，市场活动备注信息
      activityRemarkQuery: {},
      activityRemarkRules: {
        noteContent: [
          {required: true, message: '请输入活动备注', trigger: 'blur'},
          {min: 5, max: 255, message: '活动备注字数应大于5个，不超过255个', trigger: 'blur'}
        ]
      },
      // 市场活动备注信息列表
      activityRemarkList: [
        {
          createByDO: {},
          editByDO: {}
        }
      ],
      // 备注总条数
      totalCount: 0,
      // 一页几条数据
      pageSize: 0,
      // 编辑备注显示的对话框
      dialogVisible: false,
      // 编辑备注时使用的参数
      activityEditQuery: {},
      // 编辑的规则
      editActivityRemarkRules: {
        noteContent: [
          {required: true, message: '请输入活动备注', trigger: 'blur'},
          {min: 5, max: 255, message: '活动备注字数应大于5个，不超过255个', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.loadActivityDetail();
    this.getActivityRemarkData(1);
  },
  methods: {
    // 加载市场活动详情
    loadActivityDetail() {
      let id = this.$route.params.id;
      doGet('/api/activity/' + id, {}).then(resp => {
        if (resp.data.code === 200) {
          this.activityDetail = resp.data.data;
          if (!this.activityDetail.createByDO) {
            this.activityDetail.createByDO = {};
          }
          if (!this.activityDetail.ownerDO) {
            this.activityDetail.ownerDO = {};
          }
          if (!this.activityDetail.editByDO) {
            this.activityDetail.editByDO = {};
          }
        }
      })
    },

    // 提交活动备注
    activitySubmit() {
      this.$refs.activityRefForm.validate(isValid => {
        if (isValid) {
          doPost('/api/activity/remark', {
            activityId: this.activityDetail.id,
            noteContent: this.activityRemarkQuery.noteContent
          }).then(resp => {
            if (resp.data.code === 200) {
              messageTip('提交成功', 'success');
              this.reload();
            } else {
              messageTip('提交失败', 'error');
            }
          })
        }
      })
    },

    // 切换页码
    toPage(current) {
      this.getActivityRemarkData(current);
    },

    // 获取
    getActivityRemarkData(current) {
      doGet('/api/activity/remark', {
        current,
        activityId: this.$route.params.id
      }).then(resp => {
        if (resp.data.code === 200) {
          this.activityRemarkList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.totalCount = resp.data.data.total;
        }
      })
    },

    // 获取要修改的活动备注
    edit(id) {
      this.dialogVisible = true;
      doGet(`/api/activity/remark/${id}`, {}).then(resp => {
        if (resp.data.code === 200) {
          this.activityEditQuery = resp.data.data;
        }
      })
    },

    // 提交用户修改的活动备注
    editActivityRemarkQuery() {
      let id = this.activityEditQuery.id;
      let noteContent = this.activityEditQuery.noteContent;
      this.$refs.activityRemarkRefForm.validate(isValid => {
        if (isValid) {
          doPut(`/api/activity/remark`, {
            id, noteContent
          }).then(resp => {
            if (resp.data.code === 200) {
              this
              messageTip('编辑成功', 'success');
              this.dialogVisible = false;
              this.reload();
            } else {
              messageTip('提交失败', 'error');
            }
          })
        }
      })
    },

    // 删除活动备注
    del(id) {
      messageConfirm('你确定要删除该备注吗？').then(()=> {
        doDelete(`/api/activity/remark/${id}`, {}).then(resp => {
          if (resp.data.code === 200) {
            messageTip('删除成功', 'success');
            this.reload();
          } else {
            messageTip('删除失败', 'error');
          }
        }).catch(()=> {
          messageTip('取消删除', 'warning');
        })
      })
    }
  }
}
</script>

<template>
  <!--活动详情数据-->
  <el-form ref="activityRefForm" :model="activityRemarkQuery" :rules="activityRemarkRules" label-width="auto">
    <el-form-item label="ID">
      <div class="detail">{{ activityDetail.id }}</div>
    </el-form-item>

    <el-form-item label="负责人">
      <div class="detail">{{ activityDetail.ownerDO.name }}</div>
    </el-form-item>
    <el-form-item label="开始时间">
      <div class="detail">{{ activityDetail.startTime }}</div>
    </el-form-item>
    <el-form-item label="结束时间">
      <div class="detail">{{ activityDetail.endTime }}</div>
    </el-form-item>
    <el-form-item label="活动预算">
      <div class="detail">{{ activityDetail.cost }}</div>
    </el-form-item>
    <el-form-item label="活动描述">
      <div class="detail">{{ activityDetail.description }}</div>
    </el-form-item>
    <el-form-item label="创建时间">
      <div class="detail">{{ activityDetail.createTime }}</div>
    </el-form-item>
    <el-form-item label="创建人">
      <div class="detail">{{ activityDetail.createByDO.name }}</div>
    </el-form-item>
    <el-form-item label="编辑时间">
      <div class="detail">{{ activityDetail.editTime }}</div>
    </el-form-item>
    <el-form-item label="编辑人">
      <div class="detail">{{ activityDetail.editByDO.name }}</div>
    </el-form-item>
    <el-form-item label="填写备注" prop="noteContent">
      <el-input
          v-model="activityRemarkQuery.noteContent"
          style="width: 100%;"
          :rows="8"
          type="textarea"
          placeholder="请输入活动备注"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      <el-button type="success" @click="activitySubmit">提交</el-button>
    </el-form-item>
  </el-form>

  <hr>
  <!--备注信息分页展示-->
  <el-table
      :data="activityRemarkList"
      style="width: 100%"
  >
    <el-table-column type="index" label="序号" width="60"/>
    <el-table-column prop="noteContent" label="备注内容"/>
    <el-table-column property="createTime" label="备注时间"/>
    <el-table-column property="createByDO.name" label="备注人"/>
    <el-table-column property="editTime" label="编辑时间"/>
    <el-table-column property="editByDO.name" label="编辑人"/>
    <el-table-column label="操作" show-overflow-tooltip width="250">
      <template #default="scope">
        <!--作用域插槽-->
        <el-button type="success" @click="edit(scope.row.id)">编辑</el-button>
        <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background layout="prev, pager, next"
                 :total="totalCount"
                 :page-size="pageSize"
                 @prev-click="toPage"
                 @next-click="toPage"
                 @current-change="toPage"/>

  <!--备注信息编辑弹窗-->
  <el-dialog v-model="dialogVisible" title="编辑市场活动备注" width="50%" center draggable>
    <el-form ref="activityRemarkRefForm" :model="activityEditQuery" label-width="auto" :rules="editActivityRemarkRules">
      <el-form-item label="活动备注信息" prop="noteContent">
        <el-input
            v-model="activityEditQuery.noteContent"
            style="width: 100%;"
            :rows="8"
            type="textarea"
            placeholder="请输入活动备注"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="editActivityRemarkQuery">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
.detail {
  width: 100%;
  padding-left: 15px;
}
</style>