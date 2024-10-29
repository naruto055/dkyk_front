<script>
import {doGet} from "../http/httpRequest.js";
import axios from "axios";
import {getToken, messageTip} from "../util/util.js";

export default {
  name: "CustomerView",
  data() {
    return {
      // 客户列表数据
      customerList: [{
        ownerDO: {},
        activityDO: {},
        appellationDO: {},
        clueDO: {},
        needLoanDO: {},
        intentionStateDO: {},
        stateDO: {},
        sourceDO: {},
        intentionProductDO: {}
      }],
      pageSize: 0,
      total: 0,
      selectedCustomerIds: []
    }
  },
  mounted() {
    this.getData(1);
  },
  methods: {
    getData(current) {
      doGet('/api/customers', {
        current
      }).then(resp => {
        if (resp.data.code === 200) {
          this.customerList = resp.data.data.list;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    // 勾选或者取消勾选，触发该函数
    handleSelectionChange(selectItemArr) {
      this.selectedCustomerIds = [];
      selectItemArr.forEach((item) => {
        this.selectedCustomerIds.push(item.id);
      })
    },

    // 切换页码
    toPage(index) {
      this.getData(index);
    },

    // 导出excel
    exportExcel(ids) {
      // 向后端发送一个请求
      let iframe = document.createElement('iframe');
      if (ids) {
        iframe.src = axios.defaults.baseURL + '/api/exportExcel?Authorization=' + getToken() + '&ids=' + ids;
      } else {
        iframe.src = axios.defaults.baseURL + '/api/exportExcel?Authorization=' + getToken();
      }
      document.body.appendChild(iframe);
      // 后端查询数据库的数据，把数据库写入excel，然后把Excel以IO流的方式输出到前端浏览器
      // 前端浏览器弹出一个下载框，进行文件下载
    },

    // 批量导出客户的excel
    batchExportExcel() {
      this.exportExcel(null);
    },

    // 选择导出
    chooseExportExcel() {
      if (this.selectedCustomerIds <= 0) {
        messageTip('请选择要导出的数据', 'warning');
      } else {
        let ids = this.selectedCustomerIds.join(',');
        this.exportExcel(ids);
      }
    }
  }
}
</script>

<template>
  <el-button type="primary" class="btn" @click="batchExportExcel">批量导出(Excel)</el-button>
  <el-button type="success" class="btn" @click="chooseExportExcel">选择导出(Excel)</el-button>

  <el-table
      :data="customerList"
      style="width: 100%"
      @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="50"/>
    <el-table-column type="index" label="序号" width="65"/>
    <el-table-column property="ownerDO.name" label="负责人" width="120" />
    <el-table-column property="activityDO.name" label="所属活动"/>
    <el-table-column label="姓名">
      <template #default="scope">
        <a href="javascript:" @click="view(scope.row.id)">{{ scope.row.clueDO.fullName }}</a>
      </template>
    </el-table-column>
    <el-table-column property="appellationDO.typeValue" label="称呼"/>
    <el-table-column property="clueDO.phone" label="手机" width="120"/>
    <el-table-column property="clueDO.weixin" label="微信" width="120"/>
    <el-table-column property="needLoanDO.typeValue" label="是否贷款"/>
    <el-table-column property="intentionStateDO.typeValue" label="意向状态"/>
    <el-table-column property="stateDO.typeValue" label="线索状态"/>
    <el-table-column property="sourceDO.typeValue" label="线索来源"/>
    <el-table-column property="intentionProductDO.name" label="意向产品"/>
    <el-table-column property="nextContactTime" label="下次联系时间" width="165"/>
    <el-table-column label="操作" width="85">
      <template #default="scope">
        <el-button type="primary" @click="view(scope.row.id)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
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
</template>

<style scoped>
.el-table {
  margin-top: 15px;
  margin-top: 15px;
}
</style>