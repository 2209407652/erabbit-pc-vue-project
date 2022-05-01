<script setup lang="ts">
import getPowerSet from "@/vender/power-set";

// props、emit
const props = defineProps<{
  goods: {
    specs: any[];
    skus: any[];
  };
  skuId: string;
}>();
const emit = defineEmits<{
  (
    e: "change",
    sku: {
      skuId?: string;
      price?: string;
      oldPrice?: string;
      inventory?: number;
      specsText?: any;
    }
  ): void;
}>();

/**
 * 初始化选中状态
 * @param goods
 * @param skuId
 */
function initSelectedStatus(
  goods: {
    skus: any[];
    specs: {
      values: {
        selected: boolean; // props
        name: any;
      }[];
    }[];
  },
  skuId: any
) {
  const sku = goods.skus.find((sku: { id: any }) => sku.id === skuId);
  if (sku) {
    goods.specs.forEach(
      (spec: { values: { selected: boolean; name: any }[] }, i: string | number) => {
        const value = sku.specs[i].valueName;
        spec.values.forEach((val: { selected: boolean; name: any }) => {
          val.selected = val.name === value;
        });
      }
    );
  }
}

/**
 * 禁用效果，设置状态
 * @param specs
 */
function getSelectedArr(specs: any[]) {
  const selectedArr: any[] = [];
  specs.forEach((spec) => {
    const selectedVal = spec.values.find((val: { selected: any }) => val.selected);
    selectedArr.push(selectedVal ? selectedVal.name : undefined);
  });
  return selectedArr;
}

/**
 * 更新按钮的禁用状态
 * @param specs
 * @param pathMap
 */
function updateDisabledStatus(specs: any[], pathMap: { [x: string]: any }) {
  specs.forEach((spec, i) => {
    const selectedArr = getSelectedArr(specs);
    spec.values.forEach((val: { name: any; disabled: boolean }) => {
      // 已经选中的按钮不用判断
      if (val.name === selectedArr[i]) return false;
      // 未选中的替换对应的值
      selectedArr[i] = val.name;
      // 过滤无效值得到key
      const key = selectedArr.filter((v) => v).join(spliter);
      // 设置禁用状态
      val.disabled = !pathMap[key];
    });
  });
}

/**
 *根据skus数据得到路径字典对象
 * @param skus
 */
const spliter = "★";
// 根据skus数据得到路径字典对象
function getPathMap(skus: any[]) {
  const pathMap = {};
  skus.forEach((sku) => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory) {
      // 2. 得到sku属性值数组
      const specs = sku.specs.map((spec: { valueName: any }) => spec.valueName);
      // 3. 得到sku属性值数组的子集
      const powerSet = getPowerSet(specs);
      // 4. 设置给路径字典对象
      powerSet.forEach((set: any[]) => {
        const key = set.join(spliter);
        if ((pathMap as any)[key]) {
          // 已经有key往数组追加
          (<any>pathMap)[key].push(sku.id);
        } else {
          // 没有key设置一个数组
          (<any>pathMap)[key] = [sku.id];
        }
      });
    }
  });
  return pathMap;
}

/**
 *  根据传入的skuId默认选中规格按钮 -- 组件初始化的时候更新禁用状态
 */
const pathMap = getPathMap(props.goods.skus);
initSelectedStatus(props.goods, props.skuId);
updateDisabledStatus(props.goods.specs, pathMap);

/**
 * 选中与取消选中
 * @param item
 * @param val
 */
function clickSpecs(item: { values: any[] }, val: { selected: boolean }) {
  if (val.selected) {
    val.selected = false;
  } else {
    item.values.forEach((bv) => {
      bv.selected = false;
    });
    val.selected = true;
  }
  // 点击的时候更新禁用状态
  updateDisabledStatus(props.goods.specs, pathMap);
  // 触发change事件将sku数据传递出去
  const selectedArr = getSelectedArr(props.goods.specs).filter((v) => v);

  if (selectedArr.length === props.goods.specs.length) {
    const skuIds = (<any>pathMap)[selectedArr.join(spliter)];
    const sku = props.goods.skus.find((sku) => sku.id === skuIds[0]);
    // 传递

    emit("change", {
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      specsText: sku.specs
        .reduce(
          (p: any, n: { name: any; valueName: any }) => `${p} ${n.name}：${n.valueName}`,
          ""
        )
        .replace(" ", ""),
    });
  } else {
    emit("change", {});
  }
}
</script>

<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected }"
            @click="clickSpecs(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            :class="{ selected: val.selected }"
            @click="clickSpecs(item, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<style lang="less" scoped>
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
