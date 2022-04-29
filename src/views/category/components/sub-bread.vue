<script setup lang="ts">
import { useCategoryStore } from "@/store";
import { computed } from "vue";
import { useRoute } from "vue-router";

// 获取Store和Route
const categoryStore = useCategoryStore();
const route = useRoute();

/**
 * 计算获得一级类目名称和ID，二级类目名称和ID
 */
interface CategoryObj {
  top?: {
    id: string | number;
    name: string;
  };
  sub?: {
    id: string | number;
    name: string;
  };
}
const category = computed(() => {
  const obj: CategoryObj = {};
  categoryStore.list.forEach((top) => {
    top.children &&
      top.children.forEach((sub) => {
        if (sub.id === route.params.id) {
          // 设置一级类目
          obj.top = { id: top.id, name: top.name };
          // 设置二级类目
          obj.sub = { id: sub.id, name: sub.name };
        }
      });
  });
  return obj;
});
</script>

<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{
      category.top.name
    }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <div :key="category.sub.id">
        <XtxBreadItem v-if="category.sub">{{ category.sub.name }}</XtxBreadItem>
      </div>
    </Transition>
  </XtxBread>
</template>

<style lang="less" scoped></style>
