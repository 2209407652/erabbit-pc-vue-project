import request from "@/utils/request";

/**
 * 参数类型
 */
interface AccountLogin {
    account: string
    password: string
}
interface MobileLogin {
    mobile: string
    code: string
}

/**
 * 账号登陆
 * @param { String | String } param0 
 * @returns { Promise }
 */
export function userAccountLogin({ account, password }: AccountLogin): Promise<any> {
    return request('/login', 'post', { account, password })
}

/**
 * 短信登陆
 * @param { String | String } param0 
 * @returns { Promise }
 */
export function userMobileLogin({ mobile, code }: MobileLogin) {
    return request('/login/code', 'post', { mobile, code })
}

/**
 * 获取短信登陆验证码
 * @param { String } mobile 
 * @returns { Promise }
 */
export function userMobileLoginMsg(mobile: string) {
    return request('/login/code', 'get', { mobile })
}