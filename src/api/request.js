import axios from 'axios'
import config from '../config'
import Cookie from 'js-cookie'
// import { useStore } from 'vuex'
import store from '../store/index'
// let store = useStore()
import { ElMessage } from 'element-plus'
const NETWORK_ERROR = '网络请求异常,请稍后重试.....'
// 创建一个axios实例对象
const service = axios.create({
  baseURL: config.baseApi
})

// 在请求之前 jwt-token
service.interceptors.request.use((req) => {
    // 可以自定义header
    // jwt-token认证的时候 Bearer
    const token = Cookie.get("token")
    req.headers.Authorization = `Bearer ${token}`


    const loginName = JSON.parse(localStorage.getItem('username'))
    req.headers['username'] = loginName
    return req
})

// 在请求之后 
// 根据接口json数据结构进行解构字段
service.interceptors.response.use((res) => {
    console.log("dev request.js:", res)
    const { code, data, msg } = res.data
    if (code != 200) {
        if (/^20[4-99]$/.test(String(code))) {
            ElMessage.error(msg);
        }
        if  (code == 208 || code == 9090){
            store.commit('cleanMenu')
            store.commit('clearToken')
            router.push({
                name: 'login'
            })        
        } 
        if (code == 403){
            ElMessage.error(msg)
        }
        // 网络请求错误
        // ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)   
    }
   
    return data
})

// 封装的核心函数
function request(options) {
    options.method = options.method || 'get' // 默认get请求
    if (options.method.toLowerCase() == 'get') {  // 大写转换小写
        options.params = options.data
    }
    // 对mock的处理
    let isMock = config.mock
    if (typeof options.mock !== 'undefined') {
        isMock = options.mock
    }
    // 对线上环境做处理
    if (config.env == 'prod') {
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }
    return service(options)
}
export default request