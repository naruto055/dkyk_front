<script>
import {doGet, doPost, doPut} from "../http/httpRequest.js";
import {messageTip} from "../util/util.js";

export default {
  name: "ActivityRecordView",
  inject: ['reload'],
  data() {
    return {
      activityQuery: {},
      // 活动表单验证规则
      activityRules: {
        ownerId: [
          {required: true, message: '请选择负责人', trigger: 'blur'},
        ],
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ],
        startTime: [
          {required: true, message: '请选择活动开始时间', trigger: 'blur'},
        ],
        endTime: [
          {required: true, message: '请选择活动结束时间', trigger: 'blur'},
        ],
        cost: [
          {required: true, message: '请输入活动预算', trigger: 'blur'},
          { pattern : /^[0-9]+(\.[0-9]{2})?$/, message: '活动预算必须是整数或者两位小数', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入活动描述', trigger: 'blur'},
          {min: 5, max: 255, message: '活动描述字数应大于5个，不超过255个', trigger: 'blur'}
        ]
      },
      ownerOptions: []
    }
  },
  mounted() {
    this.loadOwner();

    // 加载要编辑的数据
    this.loadActivity();
  },
  methods: {
    // 获取负责人数据
    loadOwner() {
      doGet('api/owner', {}).then((resp) => {
        if (resp.data.code === 200) {
          this.ownerOptions = resp.data.data;
        }
      })
    },

    // 提交新增活动表单数据
    activitySubmit() {
      let formData = new FormData();
      for (let data in this.activityQuery) {
        if (this.activityQuery[data]) {
          formData.append(data, this.activityQuery[data]);
        }
      }
      this.$refs.activityRefForm.validate((isValid) => {
        if (isValid) {
          if (this.activityQuery.id > 0) {  //编辑
            doPut('/api/activity', formData).then(resp => {
              if (resp.data.code === 200) {
                messageTip('编辑成功', 'success');
                this.$router.push('/dashboard/activity');
              } else {
                messageTip('编辑失败', 'error');
              }
            })
          } else {  //新增
            doPost('/api/activity', formData).then((resp) => {
              if (resp.data.code === 200) {
                messageTip('提交成功', 'success');
                this.$router.go(-1);
              } else {
                messageTip('提交失败', 'error');
              }
            })
          }
        }
      })
    },

    // 加载要编辑市场活动数据
    loadActivity() {
      let id = this.$route.params.id;
      if (id) {
        doGet('/api/activity/' + id, {}).then(resp => {
          if (resp.data.code === 200) {
            this.activityQuery = resp.data.data;
          }
        })
      }
    }
  }
}
</script>

<template>
  <el-form ref="activityRefForm" :model="activityQuery" label-width="auto" :rules="activityRules">
    <el-form-item label="负责人" prop="ownerId">
      <el-select
          v-model="activityQuery.ownerId"
          placeholder="请选择负责人"
          class="width"
          clearable>
        <el-option
            v-for="item in ownerOptions[0]"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
      </el-select>
    </el-form-item>

    <el-form-item label="活动名称" prop="name">
      <el-input v-model="activityQuery.name"/>
    </el-form-item>

    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker
          v-model="activityQuery.startTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          placeholder="请选择开始时间"
          style="width: 100%;"
      />
    </el-form-item>

    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker
          v-model="activityQuery.endTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          placeholder="请选择结束时间"
          style="width: 100%;"
      />
    </el-form-item>

    <el-form-item label="活动预算" prop="cost">
      <el-input v-model="activityQuery.cost"/>
    </el-form-item>

    <el-form-item label="活动描述" prop="description">
      <el-input
          v-model="activityQuery.description"
          style="width: 100%;"
          :rows="6"
          type="textarea"
          placeholder="请输入活动描述"
      />
    </el-form-item>

    <el-form-item>
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" @click="activitySubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.width {
  width: 100%;
}
</style>