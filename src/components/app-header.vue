<script setup lang="ts">
import AppHeaderNavVue from "./app-header-nav.vue";
import AppHeaderCartVue from "./app-header-cart.vue";
</script>

<template>
  <header class="app-header">
    <div class="container">
      <h1 class="logo"><Router-link to="/">小兔鲜</Router-link></h1>
      <AppHeaderNavVue />
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" />
      </div>
      <AppHeaderCartVue />
    </div>
  </header>
</template>

<style lang="less" scoped>
.app-header {
  background-color: #fff;
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url(http://erabbit.itheima.net/img/logo.0940ebb5.png) no-repeat center
        18px / contain;
    }
  }
  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }
    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }
}
</style>
