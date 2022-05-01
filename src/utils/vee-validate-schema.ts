// 定义校验规则
export default {
    account(value: string) {
        if (!value) return '请输入用户名!'
        if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符!'
        return true
    },
    password(value: string) {
        if (!value) return '请输入密码!'
        if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符!'
        return true
    },
    mobile(value: string) {
        if (!value) return '请输入手机号!'
        if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式有误!'
        return true
    },
    code(value: string) {
        if (!value) return '请输入验证码!'
        if (!/^\d{6}$/.test(value)) return '验证码是6个数字!'
        return true
    },
    isAgree(value: any) {
        if (!value) return '请勾选同意用户协议!'
        return true
    }
}