<script setup lang="ts">
import { reactive } from "vue";

// emit
const emit = defineEmits<{
  (
    e: "sort-change",
    sortParams: {
      inventory: boolean;
      onlyDiscount: boolean;
      sortField: string;
      sortMethod: string;
    }
  ): void;
}>();

/**
 * 筛选条件排序
 */
interface SortParams {
  inventory: boolean;
  onlyDiscount: boolean;
  sortField: string;
  sortMethod: string;
}
const sortParams = reactive<SortParams>({
  inventory: false,
  onlyDiscount: false,
  sortField: "",
  sortMethod: "",
});
// 改变排序
function changeSort(sortField: string) {
  if (sortField === "price") {
    sortParams.sortField = sortField;
    if (sortParams.sortMethod === "") {
      // 第一次点击，默认降序
      sortParams.sortMethod = "desc";
    } else {
      // 不是第一次需要排序取反
      sortParams.sortMethod = sortParams.sortMethod === "desc" ? "asc" : "desc";
    }
  } else {
    // 排序未改变停止逻辑
    if (sortParams.sortField === sortField) return;
    sortParams.sortField = sortField;
    sortParams.sortMethod = "";
  }
  emit("sort-change", sortParams);
}

/**
 * 改变复选框的值
 */
function changeInventory(i: boolean) {
  sortParams.inventory = i;
  emit("sort-change", sortParams);
}
function changeOnlyDiscount(o: boolean) {
  sortParams.onlyDiscount = o;
  emit("sort-change", sortParams);
}
</script>

<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        :class="{ active: sortParams.sortField === '' }"
        @click="changeSort('')"
        href="javascript:;"
        >默认排序</a
      >
      <a
        :class="{ active: sortParams.sortField === 'publishTime' }"
        @click="changeSort('publishTime')"
        href="javascript:;"
        >最新商品</a
      >
      <a
        :class="{ active: sortParams.sortField === 'orderNum' }"
        @click="changeSort('orderNum')"
        href="javascript:;"
        >最高人气</a
      >
      <a
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        @click="changeSort('evaluateNum')"
        href="javascript:;"
        >评论最多</a
      >
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i
          class="arrow up"
          :class="{
            active: sortParams.sortField === 'price' && sortParams.sortMethod == 'asc',
          }"
        />
        <i
          class="arrow down"
          :class="{
            active: sortParams.sortField === 'price' && sortParams.sortMethod == 'desc',
          }"
        />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @update="changeInventory" v-model="sortParams.inventory"
        >仅显示有货商品</XtxCheckbox
      >
      <XtxCheckbox @update="changeOnlyDiscount" v-model="sortParams.onlyDiscount"
        >仅显示特惠商品</XtxCheckbox
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
