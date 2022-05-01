import { GoodDetails } from "@/env";
import request from "@/utils/request";

/**
 * 合并本地购物车
 * @param { any[] } cartList
 * @returns { Promise }
 */
export function mergeLocalCart(cartList: any[]): Promise<any> {
    return request('/member/cart/merge', 'post', cartList)
}

/**
 * 获取登录后的购物车列表
 * @returns { Promise }
 */
export function findCartList(): Promise<any> {
    return request('/member/cart', 'get')
}

/**
 * 
 * @param param0 
 * @returns { Promise }
 */
interface InsertCart {
    skuId: string
    count: number
}
export function insertCart({ skuId, count }: InsertCart): Promise<any> {
    return request('/member/cart', 'post', { skuId, count })
}

/**
 * 删除商品（支持批量删除）
 * @param { String[] } ids 
 * @returns { Promise }
 */
export function deleteCart(ids: string | string[]): Promise<any> {
    return request('/member/cart', 'delete', { ids })
}

/**
 * 修改购物车商品的状态和数量
 * @param goods
 * @returns { Promise }
 */
export function updateCart(goods: GoodDetails): Promise<any> {
    return request('/member/cart/' + goods.id, 'put', goods)
}

/**
 * 
 * @param param0 
 * @returns 
 */
interface CheckAllCart {
    selected: boolean
    ids: string[]
}
export function checkAllCart({ selected, ids }: CheckAllCart) {
    return request('/member/cart/selected', 'put', { selected, ids })
}