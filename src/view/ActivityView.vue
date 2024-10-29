<script>
import {doDelete, doGet} from "../http/httpRequest.js";
import {messageConfirm, messageTip} from "../util/util.js";

export default {
  name: "ActivityView",
  inject: ['reload'],
  data() {
    return {
      // 市场活动表单对象
      activityQuery: {},
      // 市场活动列表
      activityList: [
        {
          ownerDO: {}
        }
      ],
      totalCount: 0,
      pageSize: 0,
      // 负责人的下拉列表数据
      ownerOptions: [],
      // 定义市场活动搜索表单校验规则
      activityRules: {
        cost: [
          {pattern: '^[0-9]+(.[0-9]{2})?$', message: '活动预算必须是数字或两位小数', trigger: 'blur'}
        ]
      },
      // 被勾选的活动id
      selectedUserIds: []
    }
  },
  mounted() {
    this.getActivityData(1);
  },
  methods: {
    // 获取市场活动列表数据
    getActivityData(current) {
      let startTime = '';
      let endTime = '';
      for (let key in this.activityQuery.activityTime) {
        if (key === '0') {
          startTime = this.activityQuery.activityTime[key];
        }
        if (key === '1') {
          endTime = this.activityQuery.activityTime[key];
        }
      }
      doGet('/api/activities', {
        current: current,  // 当前页
        name: this.activityQuery.name,
        ownerId: this.activityQuery.ownerId,
        startTime: startTime,
        endTime: endTime,
        cost: this.activityQuery.cost,
        createTime: this.activityQuery.createTime
      }).then((resp) => {
        if (resp.data.code === 200) {
          this.activityList = resp.data.data.list;
          this.totalCount = resp.data.data.total;
          this.pageSize = resp.data.data.pageSize;
        }
      })
    },

    // 分页函数，点击页码获取数据
    toPage(current) {
      this.getActivityData(current);
    },

    // 获取负责人数据
    loadOwner() {
      doGet('api/owner', {}).then((resp) => {
        console.log('查询负责人');
        if (resp.data.code === 200) {
          this.ownerOptions = resp.data.data;
        }
      })
    },

    // 条件查询
    onSearch() {
      this.getActivityData(1)
    },

    // 新增活动
    add() {
      this.$router.push('/dashboard/activity/add');
    },

    // 重置
    reset() {
      this.activityQuery = {}
    },

    // 编辑
    edit(id) {
      this.$router.push('/dashboard/activity/edit/' + id);
    },

    // 查看活动详情
    view(id) {
      this.$router.push('/dashboard/activity/' + id);
    },

    // 删除市场活动
    del(id) {
      messageConfirm('你确认要删除该市场活动吗？').then(() => {
        doDelete(`/api/activity/${id}`, {}).then(resp => {
          if (resp.data.code === 200) {
            messageTip('删除成功', 'success');
            //页面刷新
            this.reload();
          } else {
            messageTip('删除失败' + resp.data.msg, 'error');
          }
        })
      }).catch(() => {
        messageTip('取消删除', 'warning');
      })
    },

    // 勾选或者取消勾选，触发该函数
    handleSelectionChange(selectItemArr) {
      this.selectedUserIds = [];
      selectItemArr.forEach((item) => {
        this.selectedUserIds.push(item.id);
      })
    },

    // 批量删除市场活动
    batchDel() {
      if (this.selectedUserIds.length <= 0) {
        messageTip('请勾选要删除的数据', 'warning');
        return ;
      }
      let ids = this.selectedUserIds.join(',');
      messageConfirm('你确认要删除勾选的活动吗？').then(() => {
        doDelete('/api/activities', {ids}).then((resp) => {
          if (resp.data.code === 200) {
            messageTip('删除成功', 'success');
            this.reload();
          } else {
            messageTip('删除失败' + resp.data.msg, 'error');
          }
        })
      }).catch(() => {
        messageTip('取消删除', 'warning');
      })
    }
  }
}
</script>

<template>
  <el-form :inline="true" :model="activityQuery" :rules="activityRules">
    <el-form-item label="负责人">
      <el-select
          v-model="activityQuery.ownerId"
          placeholder="请选择负责人"
          @click="loadOwner"
          style="width: 150px;"
          clearable>
        <el-option
            v-for="item in ownerOptions[0]"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
      </el-select>
    </el-form-item>

    <el-form-item label="活动名称">
      <el-input v-model="activityQuery.name" placeholder="请输入活动名称" clearable/>
    </el-form-item>

    <el-form-item label="活动时间">
      <el-date-picker
          v-model="activityQuery.activityTime"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>

    <el-form-item label="活动预算" prop="cost">
      <el-input v-model="activityQuery.cost" placeholder="请输入活动预算" clearable/>
    </el-form-item>

    <el-form-item label="创建时间">
      <el-date-picker
          label="创建时间"
          v-model="activityQuery.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          placeholder="请选择创建时间"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
      <el-button type="primary" plain @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
  <el-button type="primary" @click="add">录入市场活动</el-button>
  <el-button type="danger" @click="batchDel">批量删除</el-button>

  <el-table
      :data="activityList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection"/>
    <el-table-column type="index" label="序号" width="60"/>
    <el-table-column property="ownerDO.name" label="负责人" width="120"/>
    <el-table-column property="name" label="活动名称" show-overflow-tooltip/>
    <el-table-column property="startTime" label="开始时间" show-overflow-tooltip/>
    <el-table-column property="endTime" label="结束时间" show-overflow-tooltip/>
    <el-table-column property="cost" label="活动预算" show-overflow-tooltip/>
    <el-table-column property="createTime" label="创建时间" show-overflow-tooltip/>
    <el-table-column label="操作" width="280">
      <template #default="scope">
        <!--作用域插槽-->
        <el-button type="primary" @click="view(scope.row.id)">详情</el-button>
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
</template>

<style scoped>
.el-form {
  margin-bottom: 20px;
}

.el-table {
  margin-top: 12px;
}

.el-pagination {
  margin-top: 20px;
}
</style>