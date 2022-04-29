import request from "@/utils/request";

/**
 * 获取品牌信息
 * @returns {Promise}
 */
export function findBrand(limit = 0): Promise<any> {
    return request('/home/brand', 'get', { limit })
}

/**
 * 获取轮播图
 * @returns {Promise}
 */
export function findBanner(): Promise<any> {
    return request('/home/banner', 'get')
}

/**
 * 获取新鲜好物
 * @returns {Promise}
 */
export function findNew(): Promise<any> {
    return request('/home/new', 'get')
}

/**
 * 获取人气推荐
 * @returns
 */
export function findHot(): Promise<any> {
    return request('/home/hot', 'get')
}

/**
 * 获取商品数据
 * @returns {Promise}
 */
export function findGoods(): Promise<any> {
    return request('/home/goods', 'get')
}

/**
 * 最新专题
 * @returns {Promise}
 */
export function findSpecial(): Promise<any> {
    return request('/home/special', 'get')
}