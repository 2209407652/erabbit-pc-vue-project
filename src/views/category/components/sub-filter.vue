<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { findSubCategoryFilter } from "@/api/category";

// 实例化路由
const route = useRoute();

// emit
const emit = defineEmits<{
  (e: "filter-change", params: FilterParams): void;
}>();

/**
 * 1.获取数据
 * 2.数据中需要全部选中，需要预览将来点击激活功能。默认选中全部
 * 3.渲染
 */
interface P {
  id: string | null;
  name: string;
  properties: { id: string | null; name: string }[];
  selectedProp: string | null;
}
const filterData = ref<any>(null);
const filterLoading = ref(false);
watch(
  () => route.params.id,
  (newVal, oldVal) => {
    // 从二级类目去一级类目时也会触发请求，所以需要根据路径来判断是否发送请求
    if (newVal && route.path === `/category/sub/${newVal}`) {
      filterLoading.value = true;
      // 请求数据
      findSubCategoryFilter(<string>route.params.id).then(({ result }) => {
        // 品牌全部
        result.selectedBrand = null;
        // Array.proptype.unshift方法在数组前边插入一个或者多个数据，并且返回新数组长度，会修改原数组
        result.brands.unshift({ id: null, name: "全部" });
        // 销售属性全部
        result.saleProperties.forEach((p: P) => {
          p.selectedProp = null;
          p.properties.unshift({ id: null, name: "全部" });
        });
        filterData.value = result;
        filterLoading.value = false;
      });
    }
  },
  {
    immediate: true,
  }
);

/**
 * 获取筛选参数
 */
interface FilterParams {
  brandId: string | null;
  attrs: {
    groupName: string;
    propertyName: string;
  }[];
}
function getFilterParams() {
  let filterParams: FilterParams = {
    brandId: "",
    attrs: [],
  };
  const attrs: { groupName: any; propertyName: any }[] = [];
  filterParams.brandId = filterData.value.selectedBrand;
  filterData.value.saleProperties.forEach(
    (p: { properties: any[]; selectedProp: any; name: string }) => {
      const attr = p.properties.find(
        (attr: { id: string | null }) => attr.id === p.selectedProp
      );
      if (attr && attr.id !== null) {
        attrs.push({ groupName: p.name, propertyName: attr.name });
      }
    }
  );
  if (attrs.length) filterParams.attrs = attrs;
  return filterParams;
}
/**
 * 选择品牌
 * @param { String | Null } brandId 品牌Id
 */
function changeBrand(brandId: string | null) {
  if (filterData.value.selectedBrand === brandId) return;
  filterData.value.selectedBrand = brandId;
  emit("filter-change", getFilterParams());
}

function changeAttr(p: P, attrId: string | null) {
  if (p.selectedProp === attrId) return;
  p.selectedProp = attrId;
  emit("filter-change", getFilterParams());
}
</script>

<template>
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <!-- 品牌 -->
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          :class="{ active: filterData.selectedBrand === brand.id }"
          href="javascript:;"
          v-for="brand in filterData.brands"
          :key="brand.id"
          @click="changeBrand(brand.id)"
          >{{ brand.name }}</a
        >
      </div>
    </div>
    <div class="item" v-for="p in (filterData.saleProperties as P[])" :key="p.id">
      <div class="head">{{ p.name }}：</div>
      <div class="body">
        <a
          :class="{ active: p.selectedProp === attr.id }"
          href="javascript:;"
          v-for="attr in p.properties"
          :key="attr.id"
          @click="changeAttr(p, attr.id)"
          >{{ attr.name }}</a
        >
      </div>
    </div>
  </div>
  <div class="sub-filter" v-else>
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>

<style lang="less" scoped>
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
