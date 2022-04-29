<script setup lang="ts">
import SubBreadVue from "./components/sub-bread.vue";
import SubFilterVue from "./components/sub-filter.vue";
import SubSortVue from "./components/sub-sort.vue";
import GoodsItemVue from "./components/goods-item.vue";
import { ref, watch } from "vue";
import { findSubCategoryGoods } from "@/api/category";
import { useRoute } from "vue-router";

// 实例化路由
const route = useRoute();

/**
 * 无限加载组件
 * 动态加载数据并且渲染
 * 任何筛选条件变化需要更新列表
 */
const loading = ref(false);
const finished = ref(false);
const goodsList = ref<any[]>([]);
// 查询参数
let reqParams = {
  page: 1,
  pageSize: 20,
  categoryId: "",
};
// 获取数据
function getData() {
  loading.value = true;
  reqParams.categoryId = <string>route.params.id;
  findSubCategoryGoods(reqParams).then(({ result }) => {
    if (result.items.length) {
      goodsList.value.push(...result.items);
      reqParams.page++;
    } else {
      // 加载完毕
      finished.value = true;
    }
  });
  // 请求结束
  loading.value = false;
}
// 切换二级分类 重新加载
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && `/category/sub/${newVal}` === route.path) {
      // 初始化参数
      goodsList.value = [];
      reqParams = {
        page: 1,
        pageSize: 20,
        categoryId: "",
      };
      finished.value = false;
    }
  }
);

/**
 * 监听筛选区参数的改变
 * @param { FilterParams } filterParams
 */
interface FilterParams {
  brandId: string | null;
  attrs: {
    groupName: string;
    propertyName: string;
  }[];
}
function changeFilter(filterParams: FilterParams) {
  reqParams = { ...reqParams, ...filterParams };
  reqParams.page = 1;
  goodsList.value = [];
  finished.value = true;
}

/**
 * 监听排序参数改变
 * @param { SortParams } sortParams
 */
interface SortParams {
  inventory: boolean;
  onlyDiscount: boolean;
  sortField: string;
  sortMethod: string;
}
function changeSort(sortParams: SortParams) {
  reqParams = { ...reqParams, ...sortParams };
  reqParams.page = 1;
  goodsList.value = [];
  finished.value = false;
}
</script>

<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBreadVue />
      <!-- 筛选区 -->
      <SubFilterVue @filter-change="changeFilter" />
      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSortVue @sort-change="changeSort" />
        <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <GoodsItemVue :goods="item" />
          </li>
        </ul>
        <!-- 加载 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
