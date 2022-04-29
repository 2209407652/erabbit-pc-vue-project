import { createRouter, createWebHashHistory } from 'vue-router'

// 布局一级路由
const Layout = () => import('@/views/Layout.vue')
// 二级路由
const Home = () => import('@/views/home/index.vue')
const TopCategory = () => import('@/views/category/index.vue')
const SubCategory = () => import('@/views/category/sub.vue')
// 商品详情
const Goods = () => import('@/views/goods/index.vue')

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
    }
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { left: 0, top: 0 }
    }
})

export default router