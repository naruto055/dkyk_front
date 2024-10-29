import {ElMessage, ElMessageBox} from "element-plus";

/**
 * 消息弹窗提示
 * @param msg
 * @param type
 */
export function messageTip(msg, type) {
    ElMessage({
        showClose: true,
        message: msg,
        type: type,
        duration: 3000,
        center: true
    })
}

/**
 * 清除浏览器token
 */
export function removeHistoryToken() {
    sessionStorage.removeItem('dlyk_token');
    localStorage.removeItem('dlyk_token');
}

/**
 * 消息确认提示
 * @param msg
 * @returns {Promise<MessageBoxData>}
 */
export function messageConfirm(msg) {
    return ElMessageBox.confirm(
        msg,
        '系统提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
}

// 获取token
export function getToken() {
    // 在发送请求之前做些什么，在请求头中放一个token（jwt），传给后端接口
    let token = window.sessionStorage.getItem('dlyk_token');
    if (!token) {  //token不存在
        token = window.localStorage.getItem('dlyk_token');
    }
    if (token) { // token存在
        return token;
    } else {
        messageConfirm('请求token为空，是否重新登录').then(() => {
            removeHistoryToken();
            window.location.href = '/';
        }).catch(() => {
            messageTip('取消登录', 'waring');
        })
    }
}