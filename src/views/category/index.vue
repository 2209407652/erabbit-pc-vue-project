<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useCategoryStore } from "@/store";
import { findBanner } from "@/api/home";
import { findTopCategory } from "@/api/category";
import GoodsItemVue from "./components/goods-item.vue";

// 实例化仓库和当前路由
const categoryStore = useCategoryStore();
const route = useRoute();

/**
 * 轮播图
 */
const sliders = ref([]);
findBanner().then((data) => {
  sliders.value = data.result;
});

/**
 * 获取当前路由下的分类
 * 面包屑 + 所有分类
 */

const topCategory = computed(() => {
  let cate;
  const item = categoryStore.list.find((item) => {
    return item.id === route.params.id;
  });
  if (item) cate = item;

  return cate;
});

/**
 *获取单个顶级分类信息
 */
interface SubList {
  id: string | number;
  name: string;
  picture: string;
  children: any[];
}
const subList = ref<SubList>();
function getSubList() {
  findTopCategory(<string>route.params.id).then((data) => {
    subList.value = data.result;
  });
}
watch(
  () => route.params.id,
  (newVal: any) => {
    if (newVal && `/category/${newVal}` === route.path) getSubList();
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <div :key="topCategory!.id">
            <XtxBreadItem>{{ topCategory!.name }}</XtxBreadItem>
          </div>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel v-if="sliders.length" :sliders="sliders" style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory!.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <!-- 分类关联商品 -->
      <div
        v-if="subList"
        class="ref-goods"
        v-for="item in subList.children"
        :key="item.id"
      >
        <div class="head">
          <h3>- {{ item.name }} -</h3>
          <p class="tag">{{ item.id }}</p>
          <XtxMore path="/" />
        </div>
        <div class="body">
          <GoodsItemVue
            v-for="subItem in item.goods"
            :key="subItem.id"
            :goods="subItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }

  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
