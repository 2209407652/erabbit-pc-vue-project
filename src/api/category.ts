import request from "@/utils/request";

/**
 * 获取首页头部分类数据
 * @returns { Promise }
 */
export function findAllCategory(): Promise<any> {
    return request('/home/category/head', 'get')
}

/**
 * 获取单个顶级分类信息
 * @param { String } id - 顶级分类ID
 * @returns { Promise }
 */
export function findTopCategory(id: string): Promise<any> {
    return request('/category', 'get', { id })
}

/**
 * 获取二级分类筛选条件数据
 * @param { String } id - 二级分类ID
 * @returns { Promise }
 */
export function findSubCategoryFilter(id: string): Promise<any> {
    return request('/category/sub/filter', 'get', { id })
}

/**
 * 获取分类下的商品（带筛选条件）
 * @param { Object } params 
 * @returns { Promise }
 */
export function findSubCategoryGoods(params: object): Promise<any> {  
    return request('/category/goods/temporary', 'post', params)
}