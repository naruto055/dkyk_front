import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {messageTip, removeHistoryToken} from "../util/util.js";
import router from "../router/router.js";

axios.defaults.baseURL = "http://localhost:8088"

export function doGet(url, params) {
    return axios({
        url: url,
        method: "get",
        params: params,
        dataType: "json"
    })
}

export function doPost(url, data) {
    return axios({
        method: "post",
        url: url,
        data: data,
        dataType: "json"
    })
}

export function doPut(url, data) {
    return axios({
        method: "put",
        url: url,
        data: data,
        dataType: "json"
    })
}

export function doDelete(url, params) {
    return axios({
        method: "delete",
        url: url,
        params: params,
        dataType: "json"
    })
}

// 添加请求拦截
axios.interceptors.request.use((config) => {
    // 在发送请求之前做些什么，在请求头中放一个token（jwt），传给后端接口
    let token = window.sessionStorage.getItem('dlyk_token');
    if (!token) {  //token不存在
        token = window.localStorage.getItem('dlyk_token');
        if (token) {
            config.headers['rememberMe'] = true;
        }
    }
    if (token) { // token存在
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

let isRedirecting = false;
// 添加响应拦截
axios.interceptors.response.use((resp) => {
    if (!isRedirecting && resp.data.code > 900) {  // 验证没通过
        isRedirecting = true;
        ElMessageBox.confirm(
            resp.data.msg + '，是否重新登录？',
            'Warning',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {  // 用户点击确定按钮
                removeHistoryToken();
                window.location.href = '/';  // 成功回调，跳到登录页面
            })
            .catch(() => {  // 用户点击取消按钮
                messageTip('取消去登录', 'warning');
            })
        return ;
    }
    return resp;
}, (error) => {
    return Promise.reject(error);
})