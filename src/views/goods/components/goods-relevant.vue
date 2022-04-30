<script setup lang="ts">
import { ref } from "vue";
import { findRelGoods } from "@/api/goods";

// props
const props = defineProps<{ goodsId: string }>();

/**
 * 得到需要的数据
 * @param { String } id
 */
function useRelGoodsData(id: string) {
  const sliders = ref<any[]>([]);
  findRelGoods(id).then((data) => {
    // 每页四条
    const size = 4;
    const total = Math.ceil(data.result.length / size);
    for (let i = 0; i < total; i++) {
      sliders.value.push(data.result.slice(i * size, (i + 1) * size));
    }
  });
  return sliders;
}
const sliders = useRelGoodsData(props.goodsId);
</script>

<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">同类商品推荐</span>
    </div>
    <!-- 此处使用改造后的xtx-carousel.vue -->
    <XtxCarousel :sliders="sliders" style="height: 380px" auto-play />
  </div>
</template>

<style lang="less" scoped>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
  :deep(.xtx-carousel) {
    height: 380px;
    .carousel {
      &-indicator {
        bottom: 30px;
        span {
          &.active {
            background: @xtxColor;
          }
        }
      }
      &-btn {
        top: 110px;
        opacity: 1;
        background: rgba(0, 0, 0, 0);
        color: #ddd;
        i {
          font-size: 30px;
        }
      }
    }
  }
}
</style>
