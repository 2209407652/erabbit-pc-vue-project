<script setup lang="ts">
import GoodsRelevantVue from "./components/goods-relevant.vue";
import GoodsImageVue from "./components/goods-image.vue";
import GoodsSalesVue from "./components/goods-sales.vue";
import GoodsNameVue from "./components/goods-name.vue";
import GoodsSkuVue from "./components/goods-sku.vue";
import { nextTick, ref, watch } from "vue";
import { findGoods } from "@/api/product";
import { useRoute } from "vue-router";

/**
 * 获取商品详情
 */
function useGoods() {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref<GoodDetails | null>();
  const route = useRoute();
  watch(
    () => route.params.id,
    (newVal) => {
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods(<string>route.params.id).then(({ result }) => {
          // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
          result.skus.forEach((sku: { specs: any[] }) => {
            const sortSpecs: any[] = [];
            result.specs.forEach((spec: { name: any }) => {
              sortSpecs.push(sku.specs.find((item) => item.name === spec.name));
            });
            sku.specs = sortSpecs;
          });
          nextTick(() => {
            goods.value = result;
          });
        });
      }
    },
    {
      immediate: true,
    }
  );
  return goods;
}
const goods = useGoods();
console.log(goods);
</script>

<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="'/category/' + goods.categories[0].id">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="'/category/sub/' + goods.categories[1].id">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem to="/">{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImageVue :images="goods.mainPictures" />
          <GoodsSalesVue />
        </div>
        <div class="spec">
          <GoodsNameVue :goods="goods" />
          <GoodsSkuVue :goods="goods" />
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevantVue />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
</style>
