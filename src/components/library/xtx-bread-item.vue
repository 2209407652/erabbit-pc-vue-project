<script setup lang="ts">
// props
defineProps<{ to?: string | object }>();
</script>

<template>
  <div class="xtx-bread-item">
    <RouterLink v-if="to" :to="to"><slot /></RouterLink>
    <span v-else><slot /></span>
  </div>
  <i v-if="to" class="iconfont icon-angle-right"></i>
</template>

<style lang="less" scoped></style>
