<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

// props接收参数
interface Sliders {
  hrefUrl: string;
  id: string | number;
  imgUrl: string;
  type: string | number | boolean;
}
const { sliders, duration = 3000, autoPlay = false } = defineProps<{
  sliders: Sliders[];
  duration?: number;
  autoPlay?: boolean;
}>();

/**
 * 默认显示图片索引
 */
const index = ref(0);

/**
 * 自动播放
 */
let timer: NodeJS.Timeout;
function autoPlayFunc() {
  clearInterval(timer);
  timer = setInterval(() => {
    index.value++;
    if (index.value >= sliders.length) {
      index.value = 0;
    }
  }, duration);
}
watch(
  () => sliders,
  (newVal) => {
    // 有数据才开始自动播放，调用自动播放函数
    if (newVal.length && autoPlay) {
      index.value = 0;
      autoPlayFunc();
    }
  },
  {
    immediate: true,
  }
);

/**
 * 鼠标进入停止轮播，移除继续轮播
 */
function stop() {
  if (timer) clearInterval(timer);
}
function start() {
  if (sliders.length && autoPlay) {
    autoPlayFunc();
  }
}

/**
 * 上一张、下一张
 */
function toggle(step: number) {
  const newIndex = index.value + step;
  if (newIndex >= sliders.length) {
    index.value = 0;
    return;
  }
  if (newIndex < 0) {
    index.value = sliders.length - 1;
    return;
  }
  index.value = newIndex;
}

/**
 * 销毁组件时，清空定时器
 */
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="xtx-carousel" @mouseenter="stop()" @mouseleave="start()">
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ fade: index === i }"
      >
        <RouterLink v-if="item.hrefUrl" to="/">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
        <div v-else class="slider">
          <RouterLink
            v-for="goods in (item as any)"
            :key="goods.id"
            :to="`/product/${goods.id}`"
          >
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p></RouterLink
          >
        </div>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ active: index === i }"
        @click="index = i"
      ></span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      // 轮播商品
      .slider {
        display: flex;
        justify-content: space-around;
        padding: 0 40px;
        > a {
          width: 240px;
          text-align: center;
          img {
            padding: 20px;
            width: 230px !important;
            height: 230px !important;
          }
          .name {
            font-size: 16px;
            color: #666;
            padding: 0 40px;
          }
          .price {
            font-size: 16px;
            color: @priceColor;
            margin-top: 15px;
          }
        }
      }
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
