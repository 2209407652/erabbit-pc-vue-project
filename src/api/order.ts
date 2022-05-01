import request from "@/utils/request";
import axios from "axios";

/**
 * 获取订单详情
 * @param { String } id
 * @returns { Promise }
 */
export function findOrder(id: string): Promise<any> {
    return axios({
        url: 'https://apipc-xiaotuxian-front.itheima.net/member/order/' + id,
        method: 'get'
    })
}

/**
 * 获取结算信息
 * @returns { Promise }
 */
export function findCheckoutInfo(): Promise<any> {
    return axios({
        url: 'https://apipc-xiaotuxian-front.itheima.net/member/order/pre',
        method: 'get',
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuYW1lXCI6XCLnnJ_niZtcIixcImlkXCI6XCIxMzY5NTk0OTU0NzM5ODU5NDU4XCIsXCJ1c2VybmFtZVwiOlwieGlhb3R1eGlhbjAwMVwifSIsImlhdCI6MTY1MTM3NDE1NSwiZXhwIjoxNjUxNjMzMzU1fQ.SkhL6nVoNXsojhNjbJqi779XJCwAzpKOCYBdQtc9pLM'
        }
    })
}

/**
 * 添加地址
 * @returns { Promise }
 */
export function addAddress(address: any): Promise<any> {
    return axios({
        url: 'https://apipc-xiaotuxian-front.itheima.net/member/address',
        method: 'post',
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuYW1lXCI6XCLnnJ_niZtcIixcImlkXCI6XCIxMzY5NTk0OTU0NzM5ODU5NDU4XCIsXCJ1c2VybmFtZVwiOlwieGlhb3R1eGlhbjAwMVwifSIsImlhdCI6MTY1MTM3NDE1NSwiZXhwIjoxNjUxNjMzMzU1fQ.SkhL6nVoNXsojhNjbJqi779XJCwAzpKOCYBdQtc9pLM'
        },
        data: address
    })
}

/**
 * 提交订单
 * @param order 
 * @returns { Promise }
 */
export function createOrder(order: any): Promise<any> {
    return axios({
        url: 'https://apipc-xiaotuxian-front.itheima.net/member/order',
        method: 'post',
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJuYW1lXCI6XCLnnJ_niZtcIixcImlkXCI6XCIxMzY5NTk0OTU0NzM5ODU5NDU4XCIsXCJ1c2VybmFtZVwiOlwieGlhb3R1eGlhbjAwMVwifSIsImlhdCI6MTY1MTM3NDE1NSwiZXhwIjoxNjUxNjMzMzU1fQ.SkhL6nVoNXsojhNjbJqi779XJCwAzpKOCYBdQtc9pLM'
        },
        data: order
    })
}