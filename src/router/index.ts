import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store'

// 布局一级路由
const Layout = () => import('@/views/Layout.vue')
// 二级路由
const Home = () => import('@/views/home/index.vue')
const TopCategory = () => import('@/views/category/index.vue')
const SubCategory = () => import('@/views/category/sub.vue')
// 商品详情
const Goods = () => import('@/views/goods/index.vue')
// 登陆
const Login = () => import('@/views/login/index.vue')
// 购物车
const Cart = () => import('@/views/cart/index.vue')
// 订单提交
const PayCheckout = () => import('@/views/member/pay/checkout.vue')
// 之父
const PayIndex = () => import('@/views/member/pay/index.vue')

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '/', component: Home },
            { path: '/category/:id', component: TopCategory },
            { path: '/category/sub/:id', component: SubCategory },
            { path: '/product/:id', component: Goods }
        ]
    },
    { path: '/login', component: Login },
    { path: '/cart', component: Cart },
    { path: '/member/checkout', component: PayCheckout },
    { path: '/member/pay', component: PayIndex }
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { left: 0, top: 0 }
    }
})


// 路由拦截
router.beforeEach((to, from, next) => {
    useUserStore().setUser({
        account: "xiaotuxian001",
        avatar: "http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/avatar/2022-03-05/10b2fe8d-b981-4296-a9de-e2c7aab37419.png",
        id: "1369594954739859458",
        mobile: "13219165182",
        nickname: "真牛",
        token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuYW1lXCI6XCLnnJ_niZtcIixcImlkXCI6XCIxMzY5NTk0OTU0NzM5ODU5NDU4XCIsXCJ1c2VybmFtZVwiOlwieGlhb3R1eGlhbjAwMVwifSIsImlhdCI6MTY1MTM3NDE1NSwiZXhwIjoxNjUxNjMzMzU1fQ.SkhL6nVoNXsojhNjbJqi779XJCwAzpKOCYBdQtc9pLM"
    })
    // 登陆信息
    const { token } = useUserStore().$state.profile
    // 需要登陆
    if (to.path.startsWith('/member') && !token) {
        next({ path: '/login', query: { redirectUrl: to.fullPath } })
    }
    next()
})

export default router