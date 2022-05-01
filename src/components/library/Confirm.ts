import { createVNode, render } from "vue";
import XtxConfirmVue from "./xtx-confirm.vue";

// 准备 DIV
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 该函数渲染XtxConfirm组件，标题和文本
// 函数的返回值是promise对象
interface Confirm {
    title: string
    text: string
}
export default ({ title, text }: Confirm) => {
    return new Promise<void>((resolve, reject) => {
        function submitCallback() {
            render(null, div)
            resolve()
        }
        function cancelCallback() {
            render(null, div)
            reject(new Error('点击取消'))
        }
        // 1. 渲染组件
        // 2. 点击确认按钮，触发resolve同时销毁组件
        // 3. 点击取消按钮，触发reject同时销毁组件
        const vnode = createVNode(XtxConfirmVue, { title, text, submitCallback, cancelCallback })
        render(vnode, div)
    })
}

