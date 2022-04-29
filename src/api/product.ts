import request from "@/utils/request";

/**
 * 获取商品详情
 * @param { String } id 
 * @returns { Promise }
 */
export function findGoods(id: string): Promise<any> {
    return request('/goods', 'get', { id })
}