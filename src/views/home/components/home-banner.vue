<script setup lang="ts">
import { ref } from "vue";
import { findBanner } from "@/api/home";

/**
 * 获取轮播图功能
 */
const sliders = ref([]);
findBanner().then((data: any) => {
  sliders.value = data.result;  
});
</script>

<template>
  <div class="home-banner">
    <XtxCarousel v-if="sliders.length" :sliders="sliders" :autoPlay="true"/>
  </div>
</template>

<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  .xtx-carousel {
    :deep(.carousel-btn.prev) {
      left: 270px;
    }
    :deep(.carousel-indicator) {
      padding-left: 250px;
    }
  }
}
</style>
