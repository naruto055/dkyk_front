<script>
import {
  Aim, ArrowDown,
  Avatar,
  Connection, CreditCard,
  DataAnalysis,
  DataLine, Files, Fold, GoodsFilled, HelpFilled, Histogram, List,
  OfficeBuilding,
  Position, Setting,
  Suitcase, TrendCharts,
  User, UserFilled, Wallet
} from "@element-plus/icons-vue";
import {doGet} from "../http/httpRequest.js";
import {messageConfirm, messageTip, removeHistoryToken} from "../util/util.js";

export default {
  name: "DashboardView",
  components: {
    ArrowDown,
    Fold,
    HelpFilled,
    Setting,
    UserFilled,
    Aim,
    Files,
    List,
    CreditCard,
    GoodsFilled,
    Wallet,
    TrendCharts,
    Histogram, Avatar, User, DataLine, Position, Connection, DataAnalysis, Suitcase, OfficeBuilding
  },
  data() {
    return {
      isCollapse: false,
      userInfo: {
        name: "未登录"
      },
      isRouterAlive: true,
      // 当前访问的路由路径
      currentRouterPath: ''
    }
  },
  methods: {
    // 控制左侧菜单展开折叠
    showMenu() {
      this.isCollapse = !this.isCollapse;
    },

    // 加载用户信息
    loadUserInfo() {
      doGet('/api/login/info', {}).then((resp) => {
        this.userInfo = resp.data.data;
        this.userInfo.name = resp.data.data.name;
      })
    },

    // 退出登录
    logout() {
      doGet('/api/logout', {}).then((resp) => {
        if (resp.data.code === 200) {
          removeHistoryToken();
          messageTip('退出成功', 'success');
          window.location.href = '/';
        } else {
          // 退出出现异常，前后台数据token不一致
          messageConfirm('退出异常，是否强制退出？').then(() => {
            removeHistoryToken();
            window.location.href = '/';
          }).catch(() => {
            messageTip('取消去登录', 'waring');
          })
        }
      })
    },

    // 加载当前路由路径
    loadCurrentRouterPath() {
      let path = this.$route.path;
      let arr = path.split('/');
      if (arr.length >= 3) {
        this.currentRouterPath = '/' + arr[1] + '/' + arr[2];
      } else {
        this.currentRouterPath = path;
      }
    }

  },
  mounted() {
    // 加载登录用户
    this.loadUserInfo();
    this.loadCurrentRouterPath();
  },
  // 提供者
  provide() {
    return {
      reload: () => {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        })
      }
    }
  }
}
</script>

<template>
  <el-container>
    <!-- 左侧 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="menuTitle">动力云客管理系统</div>
      <el-menu
          active-text-color="#ffd04b"
          background-color="#334157"
          class="el-menu-vertical-demo"
          :default-active="currentRouterPath"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          text-color="#fff"
          style="border-right: solid 0 ;"
      >
        <!--市场活动菜单-->
        <el-sub-menu :index="index" v-for="(menuPermission, index) in userInfo.menuPermissionList" :key="menuPermission.id">
          <template #title>
            <el-icon>
              <component :is="menuPermission.icon"/>
            </el-icon>
            <span>
              {{ menuPermission.name }}
            </span>
          </template>
          <el-menu-item v-for="subMenuPermissionList in menuPermission.subPermissionList" :key="subMenuPermissionList.id" :index="subMenuPermissionList.url">
            <el-icon>
              <component :is="subMenuPermissionList.icon"/>
            </el-icon>
            {{ subMenuPermissionList.name }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

    </el-aside>
    <!-- 右侧 -->
    <el-container class="rightContent">
      <!-- 右侧：上 -->
      <el-header>
        <el-icon @click="showMenu">
          <Fold/>
        </el-icon>
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userInfo.name }}
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>我的资料</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 右侧：中 -->
      <el-main>
        <router-view v-if="isRouterAlive"/>
      </el-main>
      <!-- 右侧：下 -->
      <el-footer>邮箱：sherrly@qq.com</el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-aside {
  background-color: #1a1a1a;
}

.el-header {
  background-color: azure;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
}

.el-footer {
  background-color: aliceblue;
  height: 35px;
  text-align: center;
  line-height: 35px;
}

.rightContent {
  height: calc(100vh);
}

.menuTitle {
  height: 35px;
  color: #f9f9f9;
  line-height: 35px;
  text-align: center;
}

.el-dropdown {
  float: right;
  line-height: 35px;
}
</style>