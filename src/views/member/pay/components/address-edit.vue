<script setup lang="ts">
import { reactive, ref } from "vue";
import { addAddress } from "@/api/order";
import Message from "@/components/library/Message";

// props
const props = defineProps<{
  dialogVisible: boolean;
}>();
const emit = defineEmits<{
  (e: "change", value: boolean): void;
  (e: "on-success", formData: any): void;
}>();

/**
 * 取消
 */
function quxiao() {
  emit("change", false);
}

/**
 * 表单数据
 */
const formData = reactive({
  receiver: "",
  contact: "",
  provinceCode: "",
  cityCode: "",
  countyCode: "",
  address: "",
  postalCode: "",
  addressTags: "",
  isDefault: 0,
  fullLocation: "",
  id: "",
});
// 选择地区
function changeCty(data: {
  provinceCode: string;
  cityCode: string;
  countyCode: string;
  fullLocation: string;
}) {
  formData.provinceCode = data.provinceCode;
  formData.cityCode = data.cityCode;
  formData.countyCode = data.countyCode;
  formData.fullLocation = data.fullLocation;
}

/**
 * 提交地址
 */
function submit() {
  addAddress(formData).then((res) => {
    // 添加成功
    Message({ text: "添加收货地址成功", type: "success" });
    formData.id = res.data.result.id;
    emit("change", false);
    emit("on-success", formData);
  });
}
</script>

<template>
  <XtxDialog title="添加收货地址" :visible="dialogVisible">
    <div class="xtx-form">
      <div class="xtx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地区：</div>
        <div class="field">
          <XtxCity
            placeholder="请选择所在地区"
            :fullLocation="formData.fullLocation"
            @change="changeCty"
          />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input
            v-model="formData.postalCode"
            class="input"
            placeholder="请输入邮政编码"
          />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input
            v-model="formData.addressTags"
            class="input"
            placeholder="请输入地址标签，逗号分隔"
          />
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right: 20px" @click="quxiao">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<style lang="less" scoped>
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
</style>
