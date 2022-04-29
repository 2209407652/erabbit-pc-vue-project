<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppHeaderNavVue from "./app-header-nav.vue";

// 全局监听滚动距离
const y = ref(0);
onMounted(() => {
  window.onscroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    y.value = scrollTop;
  };
});
</script>

<template>
  <div class="app-header-sticky" :class="{ show: y > 78 }">
    <div class="container">
      <RouterLink class="logo" to="/" />
      <AppHeaderNavVue />
      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  /* 默认隐藏 */
  transform: translateY(-270%);
  opacity: 0;
  &.show {
    transition: all 0.4s linear;
    transform: none;
    opacity: 1;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(http://erabbit.itheima.net/img/logo.0940ebb5.png) no-repeat right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 200px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
