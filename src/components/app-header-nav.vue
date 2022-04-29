<script setup lang="ts">
import { useCategoryStore } from "@/store";
import type { CategoryList } from "@/store";

// 实例化分类模块仓库
const categoryStore = useCategoryStore();

// 控制二级导航栏显示隐藏
function show(item: CategoryList) {
  categoryStore.show(item);
}
function hide(item: CategoryList) {
  categoryStore.hide(item);
}
</script>

<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li
      v-for="item in categoryStore.list"
      :key="item.id"
      @mouseenter="show(item)"
      @mouseleave="hide(item)"
    >
      <RouterLink :to="`/category/${item.id}`" @click="hide(item)">{{
        item.name
      }}</RouterLink>
      <!-- 二级导航 -->
      <div class="layer" :class="{ open: item.open }">
        <ul>
          <li v-for="subItem in item.children" :key="subItem.id">
            <RouterLink :to="`/category/sub/${subItem.id}`" @click="hide(item)">
              <img :src="subItem.picture" alt="" />
              <p>{{ subItem.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      // > .layer {
      //   height: 132px;
      //   opacity: 1;
      // }
    }
  }
  .layer {
    &.open {
      height: 132px;
      opacity: 1;
    }
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: 50px;
    top: 88px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    z-index: 999;
    box-shadow: 0 0 5px #ccc;
    transition: all 0.3s 0.1s;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 70px;
      align-items: center;
      height: 132px;
      li {
        width: 110px;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          padding-top: 10px;
        }
        &:hover {
          p {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
