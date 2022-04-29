import axios from 'axios'
import type { AxiosRequestConfig, Method } from 'axios'
import { useUserStore } from '@/store'
import router from '@/router'

// 导出基准地址
export const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net"
const instance = axios.create({
    // 基本配置
    baseURL,
    timeout: 5000
})

// 封装请求拦截器
instance.interceptors.request.use((config: AxiosRequestConfig) => {
    // 拦截业务逻辑
    // 进行请求配置修改
    // 如果本地有token就在头部携带
    // 实例化仓库
    const userStore = useUserStore()
    // 1.获取用户信息对象
    const { profile } = userStore
    // 2.判断是否有token
    if (profile.token) {
        //3.设置token
        config.headers!.Authorization = `Bearer ${profile.token}`
    }
    return config
}, err => {
    return Promise.reject(err)
})

// 封装响应拦截器 -  res => res.data  取出data数据，将来调用接口的时候直接拿到的就是后台的数据
instance.interceptors.response.use(res => res.data, err => {
    // 实例化仓库
    const userStore = useUserStore()
    // 401
    if (err.response && err.response.status === 401) {
        // 1.清空无效信息
        // 2.跳转登陆页面
        // 3.跳转传参
        userStore.setUser({})
        // router.currentRoute 是 ref 响应式数据
        const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
        // encodeURLComponent 转换 url 编码
        router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
})

export default (url: string, method: Method, submitData?: any) => {
    // 请求地址，请求方法，请求数据
    return instance({
        url,
        method,
        // 1.如果是 get 请求，需要使用 params 来传递 submitData  ?a=10&c=10
        // 2.如果是 post 请求，需要使用 data 来传递 submitData  请求体传参
        // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
        // method参数：get,Get,GET  转换成小写再来判断
        // 在对象，['params']:submitData ===== params:submitData 这样理解
        [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
    })
}