// 实现使用函数调用 xtx-message 组件的逻辑
import { createVNode, render } from "vue";
import XtxMessageVue from "./xtx-message.vue";

// 准备 DOM 容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
// 定时器标识
let timer: NodeJS.Timeout

interface Message {
    type: string
    text: string
}
export default ({ type, text }: Message) => {
    // 实现：根据xtx-message.vue渲染消息提示
    // 1. 导入组件
    // 2. 根据组件创建虚拟节点
    const vnode = createVNode(XtxMessageVue, { type, text })
    // 3. 准备一个DOM容器
    // 4. 把虚拟节点渲染DOM容器中
    render(vnode, div)
    // 5. 开启定时，移出DOM容器内容
    clearTimeout(timer)
    timer = setTimeout(() => {
        render(null, div)
    }, 3000)
}