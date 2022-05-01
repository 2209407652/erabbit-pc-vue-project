# 图形标记

特点 ✨
安装 ⚙
使用 🚀

# 项目笔记 - day1

## 搭建项目

`npm init vite@latest`

`cd <project>`

`npm install`

`npm run dev`

## 配置文件

**tsconfig.json**

```json
"baseUrl": ".",
"paths": {
    "@/*": ["src/*"]
}
```

**vite.config.ts**

```ts
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
    extensions: [".js", ".ts"],
  },
});
```

## 安装依赖

### ⚙pinia

`npm install pinia`

**配置 pinia**

```ts
// main.ts - 其余代码省略
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);
```

**🚀 创建 pinia**

```ts
// ./src/store/index.ts
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => {
    return {
      // ...
    };
  },
  getters: {},
  actions: {},
});
```

### ⚙vue-router@4

`npm install vue-router@4`

**配置 router**

```ts
import router from "./router";
app.use(router);
```

**🚀 创建 router**

```ts
// ./src/router/index.ts
// createWebHistory
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{}, {}];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

## 数据持久化

**⚙pinia-plugin-persistedstate**
`npm i pinia-plugin-persistedstate`

### 🚀 用法

```ts
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

### 🚀 使用插件

```ts
export const useStore = defineStore("main", {
  state: () => {
    return {
      someState: "hello pinia",
    };
  },
  persist: true,
});
```

## 请求工具

`npm i axios`

**✨encodeURIComponent**

```js
var uri = "https://www.runoob.com/my test.php?name=ståle&car=saab";
document.write(encodeURIComponent(uri));
// https%3A%2F%2Fwww.runoob.com%2Fmy%20test.php%3Fname%3Dst%C3%A5le%26car%3Dsaab
```

**⚙ 封装请求**

```ts
import axios from "axios";
import type { AxiosRequestConfig, Method } from "axios";
import { useUserStore } from "@/store";
import router from "@/router";

// 实例化仓库
const userStore = useUserStore();

// 导出基准地址
export const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";
const instance = axios.create({
  // 基本配置
  baseURL,
  timeout: 5000,
});

// 封装请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 拦截业务逻辑
    // 进行请求配置修改
    // 如果本地有token就在头部携带
    // 1.获取用户信息对象
    const { profile } = userStore;
    // 2.判断是否有token
    if (profile.token) {
      //3.设置token
      config.headers!.Authorization = `Bearer ${profile.token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 封装响应拦截器 -  res => res.data  取出data数据，将来调用接口的时候直接拿到的就是后台的数据
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // 401
    if (err.response && err.response.status === 401) {
      // 1.清空无效信息
      // 2.跳转登陆页面
      // 3.跳转传参
      userStore.setUser({});
      // router.currentRoute 是 ref 响应式数据
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath);
      // encodeURLComponent 转换 url 编码
      router.push("/login?redirectUrl=" + fullPath);
    }
    return Promise.reject(err);
  }
);

export default (url: string, method: Method, submitData: any) => {
  // 请求地址，请求方法，请求数据
  return instance({
    url,
    method,
    // 1.如果是 get 请求，需要使用 params 来传递 submitData  ?a=10&c=10
    // 2.如果是 post 请求，需要使用 data 来传递 submitData  请求体传参
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成小写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
  });
};
```

## Less 使用

这里这里碰到了一个大坑，调试了好久。在此记录一下。

❌ 错误演示：
`import '**/**.less'`
我直接在 main.ts 里引入 less 并不生效，也不会报错。

我这里使用的 vite 搭建的项目，所以并不能用 webpack 的配置使用插件来进行全局自动引入。
查看 vite 官网配置，找到了一个全局引入的配置项：

```ts
css: {
  preprocessorOptions: {
    less: {
      additionalData: '@import "./src/assets/styles/variables.less";' +
        '@import "./src/assets/styles/common.less";';
    }
  }
}
```

❗ 上述是最后引入正确的全局 less 文件。注意几个点

- less 引入要用 @import 这里报错了好久
- 引入路径要用双引号，并且最后结尾要加分号 ;

这里报错会难以查找，竟然还有路由报错。

### ✨ 基本使用

& - 当前节点的父节点

\> - 只选择第一个标签

## 首页-头部分类导航交互

> 目的：实现点击的时候跳转，且能关闭二级分类弹窗。

描述：由于是单页面路由跳转不会刷新页面，css 的 hover 一直触发无法关闭分类弹窗。

**debugger**
我在使用 category.list 时，直接定义变量:
`const list = category.list` 然后 v-for 遍历 list
此时打印 list 虽然是 proxy 代理，我也以为这个是响应式的，但是会遇到一个很奇怪的 bug。无论鼠标怎么移动都不会改变 open 的值
后边直接遍历 category.list 就解决了这个 bug。

**debugger**
在 app-header.vue 和 app-header-sticky.vue 中同时引用了 app-header-nav.vue，
这里导致了一个大问题，就是在滚动条 Top 小于设置的距离时，粘性导航不可见，也导致 app-header 导航交互不可用。
这里用了一个不是办法的办法，使用`transform: translateY(-270%);`把元素移除页面之外

## 首页-左侧分类骨架效果

> 注册一个公用全局组件

在 -> **components/library/xtx-skeleton.vue**

```vue
<script setup lang="ts">
// props 接受参数
defineProps({
  bg: {
    type: String,
    default: "#efefef",
  },
  width: {
    type: String,
    default: "100px",
  },
  height: {
    type: String,
    default: "100px",
  },
  animated: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="xtx-skeleton"
    :style="{ width, height }"
    :class="{ shan: animated }"
  >
    <div class="block" :style="{ backgroundColor: bg }"></div>
  </div>
</template>

<style lang="less" scoped>
.xtx-skeleton {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  .block {
    width: 100%;
    height: 100%;
    border-radius: 2px;
  }
}
.shan {
  &::after {
    content: "";
    position: absolute;
    animation: shan 1.5s ease 0s infinite;
    top: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-45deg);
  }
}
@keyframes shan {
  0% {
    left: -100%;
  }
  100% {
    left: 120%;
  }
}
</style>
```

在 -> **components/library/index.ts**

```ts
import type { App } from "vue";

import XtxSkeletonVue from "./xtx-skeleton.vue";

export default {
  install(app: App) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component("XtxSkeleton", XtxSkeletonVue);
  },
};
```

接下来就直接在 main.ts 中引入即可

```ts
// 自定义插件
import ui from "./components/library";
// ...
app.use(ui);
```

## 首页-轮播图

**debugger**
在父组件异步获取数据，子组件通过 props 获取时，由于渲染比获取数据快，所以在子组件直接拿不到数据，所以父组件需要判断是否拿到了数据

```vue
<template>
  <!-- ... -->
  <XtxCarousel v-if="sliders.length" :sliders="sliders" :autoPlay="true" />
  <!-- ... -->
</template>
```

## useIntersectionObserver

`npm i @vueuse/core`
useIntersectionObserver - 可以用来实现监听进入可视区域行为，但是必须配合 vue3.0 的组合 API 的方式才能实现。

```js
// stop 是停止观察是否进入或移出可视区域的行为
const { stop } = useIntersectionObserver(
  // target 是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
  target,
  // isIntersecting 是否进入可视区域，true是进入 false是移出
  // observerElement 被观察的dom
  ([{ isIntersecting }], observerElement) => {
    // 在此处可根据isIntersecting来判断，然后做业务
  }
);
```

**复用代码**

```ts
// hooks 封装逻辑，提供响应式数据。
import { useIntersectionObserver } from "@vueuse/core";
import { ref } from "vue";

// 货物数据类型
interface Goods {
  id: string | number;
  desc: string;
  discount: any;
  name: string;
  orderNum: number;
  picture: string;
  price: string | number;
  title: string;
  alt: string;
}
// 数据懒加载函数
export const useLazyData = (apiFn: Function) => {
  // 需要
  // 1. 被观察的对象
  // 2. 不同的API函数
  const target = ref(null);
  const result = ref<Goods[]>([]);
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop();
        // 调用API获取数据
        apiFn().then((data: any) => {
          result.value = data.result;
        });
      }
    }
  );
  return { target, result };
};
```

# 项目笔记 - day2

## 面包屑切换动画

Vue3 内置组件 `<Transition?> </Transition>`

❗<Transition>中的组件渲染无法设置动画的非元素根节点。

给面包屑加动画效果时:

```html
<!-- 警告: Component inside <Transition> renders non-element root node that cannot be animated.  -->
<Transition name="fade-right" mode="out-in">
  <XtxBreadItem :key="topCategory!.id">{{ topCategory!.name }}</XtxBreadItem>
</Transition>
```

可以加一个 div 包裹起来

```html
<!-- 通过不同的 key 值来达到切换的效果 -->
<Transition name="fade-right" mode="out-in">
  <div :key="topCategory!.id">
    <XtxBreadItem>{{ topCategory!.name }}</XtxBreadItem>
  </div>
</Transition>
```

## 路由跳转滚动行为

点击一级类目时把页面滚动到最上方, `createRouter`可接受参数设置滚动行为

`RouterOptions`:
省略其他配置......

scrollBehavior:

函数签名:

```ts
scrollBehavior?: RouterScrollBehavior
```

示例:

```ts
function scrollBehavior(to, from, savedPosition) {
  // `to` 和 `from` 都是路由地址
  // `savedPosition` 可以为空，如果没有的话。
}

behavior?: ScrollOptions['behavior']
left?: number
top?: number
```

## 通过@vueuse/core 实现 v-model

一般情况下，父子组件通信可以通过，props 实现父传子。
然后通过 emit 提交事件带参数，来实现子传父。

**useVModel**
v-model ====> :modelValue + @update:modelValue

```ts
const checked = useVModel(props, "modelValue", emit);
// 1.使用 props 接受数据，利用 useVModel 来包装 props 的 modelValue 属性
// 2.再使用 checked.value 就是父组件的数据
// 3.给 checked.value = 赋值 时, 会触发 emit('update:modelValue', '数据')
```

# 项目笔记 - day3

## 放大镜效果

使用了@vueuse/core 的**useMouseInElement**

[官方 demo]: (https://vueuse.org/core/usemouseinelement/#demo)

```ts
// 声明文件
declare function useMouseInElement(
  target?: MaybeElementRef,
  options?: MouseInElementOptions
): {
  x: vue_demi.Ref<number>;
  y: vue_demi.Ref<number>;
  sourceType: vue_demi.Ref<MouseSourceType>;
  elementX: vue_demi.Ref<number>;
  elementY: vue_demi.Ref<number>;
  elementPositionX: vue_demi.Ref<number>;
  elementPositionY: vue_demi.Ref<number>;
  elementHeight: vue_demi.Ref<number>;
  elementWidth: vue_demi.Ref<number>;
  isOutside: vue_demi.Ref<boolean>;
  stop: () => void;
};
// 使用
const { elementX, elementY, isOutside } = useMouseInElement(target);
```

**elementX:** 鼠标相对于 DOM 元素左上角的横坐标 - number
**elementY:** 鼠标相对于 DOM 元素左上角的纵坐标 - number
**isOutside** 鼠标是否在 DOM 元素里面 - boolean

### 实现代码

```ts
function usePreviewImg() {
  const target = ref(null);
  const show = ref(false);
  // elementX 鼠标基于容器左上角X轴偏移
  // elementY 鼠标基于容器左上角Y轴偏移
  // isOutside 鼠标是否在模板容器外
  const { elementX, elementY, isOutside } = useMouseInElement(target);
  const position = reactive<{
    left: number | string;
    top: number | string;
  }>({ left: 0, top: 0 });
  const bgPosition = reactive<{
    backgroundPositionX: number | string;
    backgroundPositionY: number | string;
  }>({ backgroundPositionX: 0, backgroundPositionY: 0 });
  // 监听鼠标位置的移动
  watch([elementX, elementY, isOutside], () => {
    // 控制X轴方向的定位 0-200 之间
    if (elementX.value < 100) position.left = 0;
    else if (elementX.value > 300) position.left = 200;
    else position.left = elementX.value - 100;
    // 控制Y轴方向的定位 0-200 之间
    if (elementY.value < 100) position.top = 0;
    else if (elementY.value > 300) position.top = 200;
    else position.top = elementY.value - 100;
    // 设置大背景的定位
    bgPosition.backgroundPositionX = -position.left * 2 + "px";
    bgPosition.backgroundPositionY = -position.top * 2 + "px";
    //  设置遮罩容器的定位
    position.left = position.left + "px";
    position.top = position.top + "px";
    // 是否显示预览大图
    show.value = !isOutside.value;
  });
  return { position, bgPosition, show, target };
}
const { position, bgPosition, show, target } = usePreviewImg();
```

**Vue 的 DOM 结构**

```html
<div class="goods-image">
  <div
    class="large"
    v-show="show"
    :style="[{ backgroundImage: `url(${images[currIndex]})` }, bgPosition]"
  ></div>
  <div class="middle" ref="target">
    <img :src="images[currIndex]" alt="" />
    <div class="layer" v-show="show" :style="position"></div>
  </div>
</div>
```

## 分页器

```vue
<script setup lang="ts">
import { ref, computed, watch } from "vue";

// props \ emit
const {
  total = 100,
  currentPage = 1,
  pageSize = 10,
} = defineProps<{
  total?: number;
  currentPage?: number;
  pageSize?: number;
}>();

const emit = defineEmits<{
  (e: "current-change", newPage: number): void;
}>();

/**
 * 准备渲染数据
 */
// 总条数
const myTotal = ref(100);
// 每页条数
const myPageSize = ref(10);
// 当前第几页
const myCurrentPage = ref(1);
// 按钮个数
const btnCount = 5;

// 重点：根据上述数据得到（总页数，起始页码，结束页码，按钮数组）
const pager = computed(() => {
  // 计算总页数
  const pageCount = Math.ceil(myTotal.value / myPageSize.value);
  // 计算起始页码和结束页码
  // 1.理想情况根据当前页码，和按钮个数可得到
  let start = myCurrentPage.value - Math.floor(btnCount / 2);
  let end = start + btnCount - 1;
  // 2.如果起始页码小于1，重新计算
  if (start < 1) {
    start = 1;
    end = start + btnCount - 1 > pageCount ? pageCount : start + btnCount - 1;
  }
  // 3.如果结束页码大于总页数，重新计算
  if (end > pageCount) {
    end = pageCount;
    start = end - btnCount + 1 < 1 ? 1 : end - btnCount + 1;
  }
  // 处理完毕start和end得到按钮数组
  const btnArr = [];
  for (let i = start; i <= end; i++) {
    btnArr.push(i);
  }
  return { pageCount, start, end, btnArr };
});

/**
 * 改变页码
 */
function changePage(newPage: number) {
  if (myCurrentPage.value !== newPage) {
    myCurrentPage.value = newPage;
    // 通知父组件最新页码
    emit("current-change", newPage);
  }
}

/**
 * 监听传入的值
 */
watch(
  [total, currentPage, pageSize],
  () => {
    myTotal.value = total;
    myCurrentPage.value = currentPage;
    myPageSize.value = pageSize;
  },
  { immediate: true }
);
</script>

<template>
  <div class="xtx-pagination">
    <a v-if="myCurrentPage <= 1" href="javascript:;" class="disabled">上一页</a>
    <a v-else href="javascript:;" @click="changePage(myCurrentPage - 1)"
      >上一页</a
    >
    <span v-if="pager.start > 1">...</span>
    <a
      v-for="i in pager.btnArr"
      :key="i"
      href="javascript:;"
      :class="{ active: myCurrentPage === i }"
      @click="changePage(i)"
      >{{ i }}</a
    >
    <span v-if="pager.end < pager.pageCount">...</span>
    <a
      v-if="myCurrentPage >= pager.pageCount"
      href="javascript:;"
      class="disabled"
      >下一页</a
    >
    <a v-else href="javascript:;" @click="changePage(myCurrentPage + 1)"
      >下一页</a
    >
  </div>
</template>

<style lang="less" scoped>
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
```

## getCurrentInstance

通过 getCurrentInstance 方法获取当前组件实例，从而获取 route 和 router

```ts
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
console.log(proxy.$root.$route);
console.log(proxy.$root.$router);
```
