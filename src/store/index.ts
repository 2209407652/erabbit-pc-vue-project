import { defineStore } from 'pinia'

// 请求
import { findAllCategory } from '@/api/category'
import { topCategory } from '@/api/constants'

// 类型
export interface CategoryList { id: string | number, name: string, picture?: string, children?: any[], goods?: any[], open: boolean }

// 用户模块
export const useUserStore = defineStore('user', {
    state: () => {
        return {
            // 用户信息
            profile: {
                id: "",
                avatar: "",
                nickname: "",
                account: "",
                mobile: "",
                token: ""
            }
        }
    },
    actions: {
        // 修改用户信息，payload就是用户信息对象
        setUser(payload: any) {
            this.profile = payload
        }
    },
    // 数据持久化
    persist: true
})

// 购物车状态
export const useCartStore = defineStore('cart', {
    state: () => {
        return {
            list: []
        }
    },
    // 数据持久化
    persist: true
})

// 分类模块
export const useCategoryStore = defineStore('category', {
    state: () => {
        return {
            // 分类信息集合
            list: topCategory.map(item => ({ name: item, open: false })) as CategoryList[]
        }
    },
    actions: {
        // 接口请求数据
        async getAndSetList() {
            const { result } = await findAllCategory() as any
            result.forEach((item: CategoryList) => item.open = false)
            this.list = result
        },
        // 修改当前一级分类下的open数据为true
        show(item: CategoryList) {
            const category = this.list.find(category => category.id === item.id)
            category!.open = true
        },
        // 修改当前一级分类下的open数据为false
        hide(item: CategoryList) {
            const category = this.list.find(category => category.id === item.id)
            category!.open = false
        }
    },
    // 数据持久化
    persist: true
})