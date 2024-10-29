import {createApp} from 'vue'
// import './style.css'
import App from './App.vue'
import LoginView from './view/LoginView.vue'

// 导入element-plus 以及css样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入element-plus图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入element国际化包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 导入路由
import router from "./router/router.js"
import {doGet} from "./http/httpRequest.js";

const app = createApp(App)

// 自定义指令
app.directive('hasPermission', (el, binding) => {

    doGet('/api/login/info', {}).then((resp) => {
        let user = resp.data.data;
        let permissionLists = user.permissionList;

        let flag = false;

        for (let key in permissionLists) {
            if (permissionLists[key] === binding.value) {
                flag = true;
                break;
            }
        }

        if (!flag) {
            // el.style.display = 'none';

            // 删除dom元素
            el.parentNode && el.parentNode.removeChild(el);
        }
    })

})

// 全局注册element-plus图片
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus, {locale: zhCn})
    .use(router)
    .mount('#app')