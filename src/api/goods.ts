import request from "@/utils/request";
import axios from "axios";

/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param { String } id 
 * @param { Number } limit 
 * @returns { Promise }
 */
export function findRelGoods(id: string, limit: number = 16): Promise<any> {
    return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热榜商品
 * @param {String} id
 * @param { Number } type
 * @param { Number } limit
 * @returns {Promise}
 */
export function findHotGoods(id: string, type: number, limit: number = 3): Promise<any> {
    return request('/goods/hot', 'get', { id, type, limit })
}

/**
 * 获取商品的评价统计信息
 * @param { String } id 
 * @returns { Promise }
 */
export function findCommentInfoByGoods(id: string): Promise<any> {
    return axios.get(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`)
}

/**
 * 获取商品评论信息
 * @param { string } id 
 * @param { Object } params 
 * @returns { Promise }
 */
export function findCommentItemsInfo(id: string, params: any): Promise<any> {
    return axios.get(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, params)
}