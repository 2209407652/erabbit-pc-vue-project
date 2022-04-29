<script setup lang="ts">
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

// props、emit
const { loading = false, finished = false } = defineProps<{
  loading: boolean;
  finished: boolean;
}>();
const emit = defineEmits<{
  (e: "infinite"): void;
}>();

/**
 * 滚动数据加载
 */
let count = 0;
const container = ref(null);
useIntersectionObserver(
  container,
  ([{ isIntersecting }], dom) => {
    if (isIntersecting) {
      if (loading === false && finished === false) {
        console.log(`获取数据!${count++}`);
        emit("infinite");
      }
    }
  },
  { threshold: 0 }
);
</script>

<template>
  <div class="xtx-infinite-loading" ref="container">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
