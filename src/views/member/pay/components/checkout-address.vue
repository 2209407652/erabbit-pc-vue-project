<script setup lang="ts">
import Message from "@/components/library/Message";
import { ref } from "vue";
import AddressEditVue from "./address-edit.vue";

// props & emit
const { list = [] } = defineProps<{ list: any[] }>();
const emit = defineEmits<{
  (e: "change", id: string): void;
}>();

/**
 * 默认显示地址
 */
const showAddress = ref<any>();
if (list.length) {
  const defaultAddress = list.find((item) => item.isDefault === 1);
  if (defaultAddress) {
    showAddress.value = defaultAddress;
  } else {
    // eslint-disable-next-line vue/no-setup-props-destructure
    showAddress.value = list[0];
  }
}

/**
 * 对话框 显示 - 隐藏
 */
const dialogVisible = ref(false);
function getVisible(v: boolean) {
  dialogVisible.value = v;
}

/**
 * 确认地址
 */
function confirmAddress() {
  if (!selectedAddress.value) return Message({ text: "没选择", type: "error" });
  dialogVisible.value = false;
  showAddress.value = selectedAddress.value;
  // 默认通知一个地址ID给父
  emit("change", showAddress.value.id);
}

/**
 * 选择的地址
 */
const selectedAddress = ref<any>();

/**
 * 添加地址
 */
const addressEdit = ref<any>();
const addresDialog = ref(false);
const openAddressEdit = () => {
  addresDialog.value = true;
};
function quxiao(e: boolean) {
  addresDialog.value = e;
}

function getFormData(formData: any) {
  const json = JSON.stringify(formData);
  addressEdit.value = json;
}
</script>

<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{ showAddress.fullLocation.replace(/ /g, "") + showAddress.address }}
        </li>
      </ul>
      <a href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="dialogVisible = true" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 选择 -->
  <XtxDialog title="切换收货地址" :visible="dialogVisible">
    <div
      class="text item"
      :class="{ active: selectedAddress && item.id === selectedAddress.id }"
      v-for="item in list"
      :key="item.id"
      @click="selectedAddress = item"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>

        <li><span>联系方式：</span>{{ item.contact }}</li>

        <li>
          <span>收货地址：</span>{{ item.fullLocation.replace(/ /g, "") + item.address }}
        </li>
      </ul>
    </div>
    <template v-slot:footer>
      <XtxButton @click="dialogVisible = false" type="gray" style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="confirmAddress" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加 -->
  <AddressEditVue
    :dialog-visible="addresDialog"
    v-on:change="quxiao"
    v-on:on-success="getFormData"
  />
</template>

<style lang="less" scoped>
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;
  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;
    &.active,
    &:hover {
      border-color: @xtxColor;
      background: lighten(@xtxColor, 50%);
    }
    > ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>
