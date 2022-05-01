import { defineStore } from 'pinia'

// 请求
import { findAllCategory } from '@/api/category'
import { topCategory } from '@/api/constants'
import { mergeLocalCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'
import { GoodDetails } from '@/env'

// 类型
export interface CategoryList { id: string | number, name: string, picture?: string, children?: any[], goods?: any[], open: boolean }
export interface UserProfile { id: string, avatar: string, nickname: string, account: string, mobile: string, token: string }

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
        setUser(payload: UserProfile) {
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
            list: [] as GoodDetails[]
        }
    },
    getters: {
        // 有效商品列表
        validList(): GoodDetails[] {
            return this.list.filter(item => item.inventory > 0)
        },
        // 有效商品个数
        validTotal(): number {
            return this.validList.reduce((p: any, c: { collectCount: number }) => p + c.collectCount, 0)
        },
        // 有效商品总金额
        validAmount(): number {
            return this.validList.reduce((p, c) => p + ((c.price as unknown as number) * 100 * c.collectCount), 0) / 100
        },
        // 无效商品列表
        invalidList(): GoodDetails[] {
            return this.list.filter(item => item.inventory <= 0)
        },
        // 选中商品列表
        selectedList(): GoodDetails[] {
            return this.validList.filter(item => item.selected)
        },
        // 选中商品件数
        selectedTotal(): number {
            return this.selectedList.reduce((p, c) => p + c.collectCount, 0)
        },
        // 选中商品总金额
        selectedAmount(): number {
            return this.selectedList.reduce((p, c) => p + ((c.price as unknown as number) * 100 * c.collectCount), 0) / 100
        },
        //是否全选
        isCheckAll(): boolean {
            return this.validList.length === this.selectedList.length && this.selectedList.length !== 0
        }
    },
    actions: {
        // 获取购物车列表
        findCartList() {
            return new Promise<void>((resolve, reject) => {
                if (useUserStore().$state.profile.token) {
                    // 登陆
                    findCartList().then(data => {
                        this.setCartList(data.result)
                        resolve()
                    })
                }
            })
        },
        // 添加到购物车
        insertCart(goods: GoodDetails) {
            return new Promise<void>((resolve, reject) => {
                if (useUserStore().$state.profile.token) {
                    // 登陆
                    insertCart({ skuId: goods.id, count: goods.collectCount }).then(() => {
                        // 重新获取购物车
                        return findCartList()
                    })
                } else {
                    // 未登录
                    const sameIndex = this.list.findIndex(item => item.id === goods.id)

                    // 逻辑：有相同的给goods累加数量，删除相同skuId的商品
                    if (sameIndex >= 0) {
                        goods.collectCount = this.list[sameIndex].collectCount + goods.collectCount
                        this.list.splice(sameIndex, 1)
                    }
                    // 选中添加商品
                    goods['selected'] = true
                    this.list.push(goods)
                    resolve()
                }
            })
        },
        // 删除商品
        deleteCart(id: string | string[]) {
            let ids: string | string[]
            return new Promise<void>((resolve, reject) => {
                if (useUserStore().$state.profile.token) {
                    // 登陆
                    if (typeof id === 'string') {
                        ids = id
                    } else {
                        ids = [...id]
                    }
                    deleteCart(ids).then(() => {
                        this.findCartList()
                    })
                } else {
                    // 本地
                    const index = this.list.findIndex(item => item.id === id)
                    this.list.splice(index, 1)
                    resolve()
                }
            })
        },
        // 修改购物车商品
        updateCart(goods: GoodDetails) {

            // goods 中：必须有skuId，其他想修改的属性 selected  count
            return new Promise<void>((resolve, reject) => {

                if (useUserStore().$state.profile.token) {
                    // 登陆
                    updateCart(goods).then(() => {
                        return this.findCartList()
                    })

                } else {
                    // 本地
                    // goods中字段有可能不完整，goods有的信息才去修改。
                    // 1. goods中必需又skuId，才能找到对应的商品信息
                    const updateGoods = this.list.find(item => item.id === goods.id)
                    for (const key in goods) {
                        // 布尔类型 false 值需要使用
                        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
                            updateGoods![key] = goods[key]
                        }
                    }
                    resolve()
                }
            })

        },
        // 修改全选和反选
        checkAllCart(selected: boolean) {
            return new Promise<void>((resolve, reject) => {
                if (useUserStore().$state.profile.token) {
                    // 登陆
                    const ids = this.validList.map(item => item.id)
                    checkAllCart({ selected, ids }).then(() => {
                        return this.findCartList()
                    })
                } else {
                    this.validList.forEach(item => {
                        item['selected'] = selected
                    })
                    resolve()
                }
            })
        },
        // 批量删除选中
        batchDeleteCart(isClear: boolean) {
            return new Promise((resolve, reject) => {
                if (useUserStore().$state.profile.token) {
                    // 登陆
                    // 批量删除
                    const ids = this[isClear ? 'invalidList' : 'selectedList'].map(item => item.id)
                    this.deleteCart(ids).then(() => {
                        return this.findCartList()
                    })
                } else {
                    // 本地
                    // 清空失效或者选中商品
                    this[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
                        this.deleteCart(item.id)
                    })
                }
            })
        },
        // 清空本地购物车
        setCartList(list: GoodDetails[]) {
            this.list = list
        },
        // 合并本地购物车
        async mergeLocalCart() {
            // 存储token后调用合并API接口函数进行购物合并
            const cartList = this.validList.map(({ id, selected, collectCount }) => {
                return { id, selected, collectCount }
            })
            await mergeLocalCart(cartList)
            this.setCartList([])
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