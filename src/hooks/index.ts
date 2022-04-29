// hooks 封装逻辑，提供响应式数据。
import { useIntersectionObserver } from "@vueuse/core";
import { ref } from 'vue'

// 货物数据类型
interface Goods {
    id: string | number;
    /* 新鲜好物 */
    desc: string;
    discount: any;
    name: string;
    orderNum: number;
    picture: string;
    price: string | number;
    /* 人气推荐 */
    title: string;
    alt: string;
    /* 热门品牌 */
    logo: string
    nameEn: string
    place: string
    type: any
    /* 商品区块 */
    children: any[]
    saleInfo: string
    goods: any[]
    /* 最新专题 */
    cover: string
    summary: string
    lowestPrice: number
    collectNum: number
    viewNum: number
    replyNum: number
}
// 数据懒加载函数
export const useLazyData = (apiFn: Function) => {
    // 需要 
    // 1. 被观察的对象
    // 2. 不同的API函数
    const target = ref(null)
    const result = ref<Goods[]>([])
    const { stop } = useIntersectionObserver(
        target,
        ([{ isIntersecting }], observerElement) => {
            if (isIntersecting) {
                stop()
                // 调用API获取数据
                apiFn().then((data: any) => {
                    result.value = data.result
                })
            }
        }, {
        threshold: 0
    }
    )
    return { target, result }
}


