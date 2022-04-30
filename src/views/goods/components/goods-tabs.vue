<script setup lang="ts">
import GoodsDetailVue from "./goods-detail.vue";
import GoodsCommentVue from "./goods-comment.vue";
import { inject, ref } from "vue";
import { GoodDetails } from "@/env";

/**
 * detail-->详情   comment-->评价
 */
const activeName = ref("detail");
function clickTab(name: string) {
  activeName.value = name;
}

/**
 * 接受依赖
 */
const goods = inject<GoodDetails | null>("goods");
</script>

<template>
  <div class="goods-tabs">
    <nav>
      <a
        :class="{ active: activeName === 'detail' }"
        href="javascript:;"
        @click="clickTab('detail')"
        >商品详情</a
      >
      <a
        :class="{ active: activeName === 'comment' }"
        href="javascript:;"
        @click="clickTab('comment')"
        >商品评价<span>({{ goods?.commentCount }})</span></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <component
      :is="activeName === 'detail' ? GoodsDetailVue : GoodsCommentVue"
      :goods="goods"
    />
  </div>
</template>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
