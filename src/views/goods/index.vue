<script setup lang="ts">
import GoodsRelevantVue from "./components/goods-relevant.vue";
import GoodsImageVue from "./components/goods-image.vue";
import GoodsSalesVue from "./components/goods-sales.vue";
import GoodsNameVue from "./components/goods-name.vue";
import GoodsSkuVue from "./components/goods-sku.vue";
import GoodsTabsVue from "./components/goods-tabs.vue";
import GoodsHotVue from "./components/goods-hot.vue";
import GoodsWarnVue from "./components/goods-warn.vue";
import { nextTick, provide, ref, watch, getCurrentInstance } from "vue";
import { findGoods } from "@/api/product";
import { useRoute } from "vue-router";
import { useCartStore } from "@/store";
import Message from "@/components/library/Message";
import { GoodDetails } from "@/env";

// 实例化 路由 仓库
const route = useRoute();
const cartStore = useCartStore();

/**
 * 获取商品详情
 */
function useGoods() {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref<GoodDetails | null>();

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

/**
 * sku改变触发
 */
function changeSku(sku: any) {
  if (sku.skuId) {
    goods.value!.price = sku.price;
    goods.value!.oldPrice = sku.oldPrice;
    goods.value!.inventory = sku.inventory;
    currSku.value = sku;
  } else {
    currSku.value = undefined;
  }
}

/**
 * 数量
 */
const num = ref(1);
function changeNum(newNum: number) {
  num.value = newNum;
}
console.log(goods);

/**
 * 加入购物车逻辑
 */
const currSku = ref<GoodDetails>();

function insertCart() {
  if (!currSku.value) {
    return Message({ type: "warn", text: "请选择商品规格" });
  }
  console.log(goods.value?.inventory);
  if (num.value > goods.value!.inventory) {
    return Message({ type: "warn", text: "库存不足" });
  }
  // pinia 保存
  cartStore
    .insertCart({
      id: goods.value!.id,
      inventory: currSku.value.inventory,
      categories: goods.value!.categories,
      name: goods.value!.name,
      mainPictures: goods.value!.mainPictures,
      desc: goods.value!.desc,
      price: currSku.value.price,
      oldPrice: currSku.value.oldPrice,
      userAddresses: goods.value!.userAddresses,
      specs: currSku.value.specs,
      skus: goods.value!.skus,
      spuCode: currSku.value.spuCode,
      commentCount: goods.value!.commentCount,
      details: goods.value!.details,
      collectCount: num.value,
    })
    .then(() => {
      Message({ type: "success", text: "加入购物车成功" });
    });
}
/**
 * 注入依赖
 */
provide("goods", goods);
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
          <GoodsSkuVue :goods="goods" :sku-id="goods.spuCode" @change="changeSku" />
          <XtxNumbox
            label="数量"
            v-model="num"
            :max="goods.inventory"
            @change="changeNum"
          />
          <XtxButton
            type="primary"
            size="middle"
            style="margin-top: 20px; margin-left: 10px"
            @click="insertCart"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevantVue :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabsVue />
          <!-- 注意事项 -->
          <GoodsWarnVue />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHotVue :type="1" :goods-id="goods.id" />
          <GoodsHotVue :type="2" :goods-id="goods.id" />
        </div>
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
