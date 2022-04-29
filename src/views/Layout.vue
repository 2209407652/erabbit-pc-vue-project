<script setup lang="ts">
import AppTopnavVue from "@/components/app-topnav.vue";
import AppHeaderVue from "@/components/app-header.vue";
import AppFooterVue from "@/components/app-footer.vue";
import AppHeaderStickyVue from "@/components/app-header-sticky.vue";

import { useCategoryStore } from "@/store";

// 实例化仓库
const categoryStore = useCategoryStore();

// 获取分类数据并持久化
categoryStore.getAndSetList();
</script>

<template>
  <AppTopnavVue />
  <AppHeaderVue />
  <AppHeaderStickyVue />
  <main>
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <AppFooterVue />
</template>

<style lang="less" scoped></style>
