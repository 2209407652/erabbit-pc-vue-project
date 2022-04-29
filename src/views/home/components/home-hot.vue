<script setup lang="ts">
import HomePanelVue from "./home-panel.vue";
import HomeSkeletonVue from "./home-skeleton.vue";
import { findHot } from "@/api/home";
import { useLazyData } from "@/hooks";

/**
 * 获取数据- 数据懒加载
 */
const { target, result: goods } = useLazyData(findHot);
</script>

<template>
  <HomePanelVue title="人气推荐" sub-title="人气爆款 不容错过">
    <div ref="target" style="position: relative; height: 426px">
      <Transition name="fade">
        <ul v-if="goods.length" ref="pannel" class="goods-list">
          <li v-for="item in goods" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
              <p class="name">{{ item.title }}</p>
              <p class="desc">{{ item.alt }}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeletonVue v-else />
      </Transition>
    </div>
  </HomePanelVue>
</template>

<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
