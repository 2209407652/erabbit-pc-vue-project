// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
import type { App } from 'vue'

import XtxSkeletonVue from "./xtx-skeleton.vue";
import XtxCarouselVue from './xtx-carousel.vue';
import XtxMoreVue from './xtx-more.vue'
import XtxBreadVue from './xtx-bread.vue'
import XtxBreadItemVue from './xtx-bread-item.vue'
import XtxCheckboxVue from './xtx-checkbox.vue';
import XtxInfiniteLoadingVue from './xtx-infinite-loading.vue';
import XtxCityVue from './xtx-city.vue';
import XtxNumboxVue from './xtx-numbox.vue';
import XtxButtonVue from './xtx-button.vue'
import XtxPaginationVue from './xtx-pagination.vue';

import defaultImg from '@/assets/images/200.png'

/**
 * 图片懒加载指令
 * @param app { App }
 */
function defineDirective(app: App) {
    // 图片懒加载指令
    app.directive('lazyload', {
        mounted(el, binding) {
            const observer = new IntersectionObserver(([{ isIntersecting }]) => {
                if (isIntersecting) {
                    observer.unobserve(el)
                    el.onerror = () => {
                        el.src = defaultImg
                    }
                    el.src = binding.value
                }
            }, {
                threshold: 0.01
            })
            observer.observe(el)
        }
    })
}

export default {
    install(app: App) {
        // 在app上进行扩展，app提供 component directive 函数
        // 如果要挂载原型 app.config.globalProperties 方式
        app.component('XtxSkeleton', XtxSkeletonVue)
        app.component('XtxCarousel', XtxCarouselVue)
        app.component('XtxMore', XtxMoreVue)
        app.component('XtxBread', XtxBreadVue)
        app.component('XtxBreadItem', XtxBreadItemVue)
        app.component('XtxCheckbox', XtxCheckboxVue)
        app.component('XtxInfiniteLoading', XtxInfiniteLoadingVue)
        app.component('XtxCity', XtxCityVue)
        app.component('XtxNumbox', XtxNumboxVue)
        app.component('XtxButton', XtxButtonVue)
        app.component('XtxPagination', XtxPaginationVue)
        defineDirective(app)
    }
}