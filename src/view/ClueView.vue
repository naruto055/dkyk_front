<script>
import {doDelete, doGet, doPost} from "../http/httpRequest.js";
import {messageConfirm, messageTip} from "../util/util.js";

export default {
  name: "ClueView",
  inject: ['reload'],
  data() {
    return {
      // 线索列表
      clueList: [{
        ownerDO: {},
        activityDO: {},
        needLoanDO: {},
        intentionStateDO: {},
        intentionProductDO: {},
        stateDO: {},
        sourceDO: {}
      }],
      pageSize: 0,
      total: 0,
      // 导入线索的弹窗是否展示
      dialogVisible: false
    }
  },
  mounted() {
    this.getClueData(1);
  },
  methods: {
    // 勾选或者取消勾选，触发该函数
    handleSelectionChange() {
    },

    // 获取线索列表的数据
    getClueData(current) {
      doGet(`/api/clue`, {current}).then(resp => {
        if (resp.data.code === 200) {
          this.clueList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    // 查看详情
    view(id) {
      this.$router.push(`/dashboard/clue/detail/${id}`);
    },

    // 编辑线索
    edit(id) {
      this.$router.push(`/dashboard/clue/edit/${id}`);
    },

    // 删除线索
    del(id) {
      messageConfirm("您确定要删除该数据吗？").then(() => { //用户点击“确定”按钮就会触发then函数
        doDelete("/api/clue/" + id, {}).then(resp => {
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

    // 切换页码
    toPage(index) {
      this.getClueData(index);
    },

    // 添加线索
    addClue() {
      this.$router.push('/dashboard/clue/add');
    },

    // 导入excel线索数据
    importExcel() {
      this.dialogVisible = true;
    },

    // 批量删除线索数据
    batchDelClue() {
    },

    // 提交excel到后台
    excelSubmit() {
      this.$refs.uploadRef.submit();   // 会触发下方uploadFile方法上传
    },

    // 上传文件
    uploadFile(param) {
      // console.log(param);
      let fileObj = param.file;
      let formData = new FormData();
      formData.append('file', fileObj);
      doPost('/api/importExcel', formData).then((resp) => {
        if (resp.data.code === 200) {
          messageTip('上传成功', 'success');
          this.$refs.uploadRef.clearFiles();
          this.reload();
        } else {
          messageTip('上传失败', 'error');
        }
      })
    },

  }
}
</script>

<template>
  <el-button type="primary" class="btn" @click="addClue" v-has-permission="'clue:add'">录入线索</el-button>
  <el-button type="success" class="btn" @click="importExcel" v-has-permission="'clue:import'">导入线索(Excel)</el-button>
  <el-button type="danger" class="btn" @click="batchDelClue" v-has-permission="'clue:delete'">批量删除</el-button>

  <!--线索列表展示-->
  <el-table
      :data="clueList"
      style="width: 100%"
      @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="50"/>
    <el-table-column type="index" label="序号" width="65"/>
    <el-table-column property="ownerDO.name" label="负责人" width="120"/>
    <el-table-column property="activityDO.name" label="所属活动"/>
    <el-table-column label="姓名">
      <template #default="scope">
        <a href="javascript:" @click="view(scope.row.id)" class="name">{{ scope.row.fullName }}</a>
      </template>
    </el-table-column>
    <el-table-column property="appellationDO.typeValue" label="称呼"/>
    <el-table-column property="phone" label="手机" width="120"/>
    <el-table-column property="weixin" label="微信" width="120"/>
    <el-table-column property="needLoanDO.typeValue" label="是否贷款"/>
    <el-table-column property="intentionStateDO.typeValue" label="意向状态"/>
    <el-table-column property="intentionProductDO.name" label="意向产品"/>
    <el-table-column property="stateDO.typeValue" label="线索状态">
      <template #default="scope">
        <span style="color: orangered;" v-if="scope.row.state === -1" >{{ scope.row.stateDO.typeValue }}</span>
        <span v-else>{{ scope.row.stateDO.typeValue }}</span>
      </template>
    </el-table-column>
    <el-table-column property="sourceDO.typeValue" label="线索来源"/>
    <el-table-column property="nextContactTime" label="下次联系时间" width="165"/>
    <el-table-column label="操作" width="230">
      <template #default="scope">
        <el-button type="primary" @click="view(scope.row.id)" v-has-permission="'clue:view'">详情</el-button>
        <el-button type="success" @click="edit(scope.row.id)" v-has-permission="'clue:edit'">编辑</el-button>
        <el-button type="danger" @click="del(scope.row.id)" v-has-permission="'clue:delete'">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--分页器-->
  <p>
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @prev-click="toPage"
        @next-click="toPage"
        @current-change="toPage"/>
  </p>

  <!--导入excel弹窗-->
  <el-dialog v-model="dialogVisible" title="导入线索Excel" width="50%" center draggable>
    <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :http-request="uploadFile"
    >
      <template #trigger>
        <el-button type="primary">选择Excel文件</el-button>
      </template>
      仅支持后缀名为.xls或.xlsx的文件

      <template #tip>
        <div class="fileTip">
          重要提示：
          <ul>
            <li>上传仅支持后缀名为.xls或.xlsx的文件；</li>
            <li>给定Excel文件的第一行将视为字段名；</li>
            <li>请确认您的文件大小不超过50MB；</li>
            <li>日期值以文本形式保存，必须符合yyyy-MM-dd格式；</li>
            <li>日期时间以文本形式保存，必须符合yyyy-MM-dd HH:mm:ss的格式；</li>
          </ul>
        </div>
      </template>
    </el-upload>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="excelSubmit">
          导入
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-table {
  margin-top: 15px;
}
.fileTip {
  padding-top: 30px;
}
.name {
  text-decoration: none;
  font-weight: 500;
  color: #626266;
}
.done {
  color: orangered !important;
}
</style>