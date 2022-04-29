<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { onClickOutside } from "@vueuse/core";
import axios from "axios";

// emit
const emit = defineEmits<{
  (
    e: "change",
    changeResult: {
      provinceCode: string;
      provinceName: string;
      cityCode: string;
      cityName: string;
      countyCode: string;
      countyName: string;
      fullLocation: string;
    }
  ): void;
}>();

/**
 * 获取城市数据
 * 请求数据并且做内存缓存
 * 定义计算属性，根据点击的省份城市显示
 */
function getCityData() {
  // 封住成 Promise
  return new Promise((resolve, reject) => {
    // 如果内存缓存有数据
    if (window.cityData) {
      resolve(window.cityData);
    } else {
      // 没有缓存
      const url =
        "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json";
      axios.get(url).then((res) => {
        window.cityData = res.data;
        resolve(window.cityData);
      });
    }
  });
}

/**
 * 获取城市数据,显示当前地方列表
 * 显示和隐藏函数
 */
const loading = ref(false);
const cityData = ref<CityData[]>();
function open() {
  active.value = true;
  loading.value = true;
  // 获取数据
  getCityData().then((data) => {
    cityData.value = <CityData[]>data;
    loading.value = false;
  });
  // 清空选择结果
  for (const key in changeResult) {
    (changeResult as any)[key] = "";
  }
}
// 定义计算属性
const currList = computed(() => {
  // 省份
  let currList = <CityData[]>cityData.value;
  // 城市
  if (changeResult.provinceCode) {
    currList = currList.find((p) => p.code === changeResult.provinceCode)
      ?.areaList as any[];
  }
  // 地区
  if (changeResult.cityCode) {
    currList = currList.find((c) => c.code === changeResult.cityCode)?.areaList as any[];
  }
  return currList;
});

/**
 * 选择地区
 */
const changeResult = reactive({
  provinceCode: "",
  provinceName: "",
  cityCode: "",
  cityName: "",
  countyCode: "",
  countyName: "",
  fullLocation: "",
});
function changeItem(item: CityData) {
  // 省份
  if (item.level === 0) {
    changeResult.provinceCode = item.code;
    changeResult.provinceName = item.name;
  }
  // 市
  if (item.level === 1) {
    changeResult.cityCode = item.code;
    changeResult.cityName = item.name;
  }
  // 地区
  if (item.level === 2) {
    changeResult.countyCode = item.code;
    changeResult.countyName = item.name;
    changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`;
    close();
    emit("change", changeResult);
  }
}

/**
 * 控制展开收起，默认收起
 */
const active = ref(false);
function openDialog() {
  active.value = true;
}
function closeDialog() {
  active.value = false;
}

/**
 * 切换展开收起
 */
function toggleDialog() {
  if (active.value) closeDialog();
  else openDialog();
}

/**
 * 点击其他位置隐藏
 */
const target = ref(null);
onClickOutside(target, () => {
  closeDialog();
});
</script>

<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{ active }">
      <span class="placeholder">请选择配送地址</span>
      <span class="value"></span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          v-for="item in currList"
          :key="item.code"
          @click="changeItem(item)"
          >北京市</span
        ></template
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/none.png) no-repeat center;
    }
  }
}
</style>
