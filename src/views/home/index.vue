<script setup lang="ts">
import HomeCategoryVue from "./components/home-category.vue";
import HomeBannerVue from "./components/home-banner.vue";
import HomeNewVue from "./components/home-new.vue";
import HomeHotVue from "./components/home-hot.vue";
import HomeBrandVue from "./components/home-brand.vue";
import HomeProductVue from "./components/home-product.vue";
import HomeSpecialVue from "./components/home-special.vue";
</script>

<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategoryVue />
        <HomeBannerVue />
      </div>
    </div>
    <!-- 新鲜好物 -->
    <HomeNewVue />
    <!-- 人气推荐 -->
    <HomeHotVue />
    <!-- 热门品牌 -->
    <HomeBrandVue />
    <!-- 商品区域 -->
    <HomeProductVue />
    <!-- 最新专题 -->
    <HomeSpecialVue />
  </div>
</template>

<style lang="less" scoped>
.page-home {
  .home-entry {
    background-color: aquamarine;
    .container {
      width: 1240px;
      margin: 0 auto;
      position: relative;
    }
  }
}
</style>
