<script setup lang="ts">
import { computed, ref } from "vue";
import { findHotGoods } from "@/api/goods";
import GoodsItemVue from "@/views/category/components/goods-item.vue";

// props
const { type = 1, goodsId } = defineProps<{ type: number; goodsId: string }>();

/**
 * 热销标题
 */
interface Title {
  [propName: number]: string;
}
const titleObj: Title = { 1: "24小时热销榜", 2: "周热销榜", 3: "总热销榜" };
const title = computed(() => {
  return titleObj[type];
});

/**
 * 商品列表
 */
const goodsList = ref<any[]>([]);
findHotGoods(goodsId, type).then((data) => {
  goodsList.value = data.result.map((item: { tag: any; desc: any }) => {
    item.tag = item.desc;
    return item;
  });
});
</script>

<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <div v-if="goodsList">
      <GoodsItemVue v-for="item in goodsList" :key="item.id" :goods="item" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
