<script setup lang="ts">
import { ref, watch } from "vue";

// props, emit
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: "update", modelValue: boolean): void;
}>();

/**
 * 复选框功能
 */
const checked = ref(false);
function changeChecked() {
  checked.value = !checked.value;
  // 通知父组件更新数据
  emit("update", checked.value);
}
// 监听父组件传递的 props
watch(
  () => props.modelValue,
  () => {
    checked.value = props.modelValue;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<style lang="less" scoped>
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
    &:hover {
      cursor: pointer;
    }
  }
  span {
    margin-left: 2px;
  }
}
</style>
