<script setup lang="ts">
import { reactive, ref, watch, onUnmounted } from "vue";
import { Form, Field } from "vee-validate";
import veeValidateSchema from "@/utils/vee-validate-schema";
import Message from "@/components/library/Message";
import { useUserStore, useCartStore } from "@/store";
import { useRouter } from "vue-router";
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from "@/api/user";
import { useIntervalFn } from "@vueuse/core";

// 实例化路由和仓库
const userStore = useUserStore();
const cartStore = useCartStore();
const router = useRouter();

/**
 * 控制登陆方式 - 表单信息对象
 */
const isMsgLogin = ref(false);
const form = reactive({
  isAgree: true,
  account: "",
  password: "",
  mobile: "",
  code: "",
});
// 校验规则对象
const mySchema = {
  account: veeValidateSchema.account,
  password: veeValidateSchema.password,
  mobile: veeValidateSchema.mobile,
  code: veeValidateSchema.code,
  isAgree: veeValidateSchema.isAgree,
};

/**
 * 切换表单清空数据
 */
const formCom = ref();
watch(isMsgLogin, () => {
  // 还原数据
  form.isAgree = false;
  form.account = "";
  form.password = "";
  form.mobile = "";
  form.code = "";
  // 清除校验效果
  formCom.value.resetForm();
});

/**
 * 勾选协议
 * @param newValue
 */
function changeValue(newValue: boolean) {
  form.isAgree = newValue;
}

/**
 * 登录提交
 */
async function submit() {
  // 整体校验 - 账号 - 手机号
  const valid = await formCom.value.validate();
  // 校验成功
  if (valid) {
    // 发送登陆请求
    let data: any;
    try {
      if (!isMsgLogin.value) {
        // 帐号登录
        data = await userAccountLogin(form);
      } else {
        // 短信登录
        // 1. 定义两个API  短信登录，获取短信验证码
        // 2. 实现发送短信验证码发送功能
        // 3. 完成手机号短信验证码登录逻辑
        data = await userMobileLogin(form);
      }
    } catch (e: any) {
      Message({ type: "error", text: e.response.data.message || "登录失败" });
    }
    // 成功
    // 1.储存信息
    const { id, account, nickname, avatar, token, mobile } = data.result;
    userStore.setUser({ id, account, nickname, avatar, token, mobile });
    // 合并购物车
    cartStore.mergeLocalCart().then(() => {
      // 2.提示信息
      Message({ type: "success", text: "登录成功" });
      // 3.路由跳转
      router.push("/");
    });
  }
}

/**
 * pause 暂停 resume 开始
 * useIntervalFn(回调函数,执行间隔,是否立即开启)
 */
const time = ref(0);
const { pause, resume } = useIntervalFn(
  () => {
    time.value--;
    if (time.value <= 0) {
      pause();
    }
  },
  1000,
  { immediate: false }
);
onUnmounted(() => {
  pause();
});

/**
 * 发送短信
 */
async function send() {
  const valid = mySchema.mobile(form.mobile);
  if (valid === true) {
    // 通过验证
    if (time.value === 0) {
      // 没有倒计时可以发送短信
      await userMobileLoginMsg(form.mobile);
      Message({ type: "success", text: "发送成功" });
      time.value = 60;
      resume();
    }
  } else {
    // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
    formCom.value.setFieldError("mobile", valid);
  }
}
</script>

<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
      ref="formCom"
      v-slot="{ errors }"
      class="form"
      :validation-schema="mySchema"
      autocomplete="off"
    >
      <template v-if="!isMsgLogin">
        <!-- 用户名 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <!-- 密码 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 手机号 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="form.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <!-- 验证码 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              v-model="form.code"
              name="code"
              type="password"
              placeholder="请输入验证码"
            />
            <span class="code" @click="send()">{{
              time === 0 ? "发送验证码" : `${time}秒后发送`
            }}</span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field
            as="XtxCheckbox"
            name="isAgree"
            v-model="form.isAgree"
            @update="changeValue"
          />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />{{ errors.isAgree }}
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="submit">登录</a>
    </Form>
    <div class="action">
      <img
        src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
        alt=""
      />
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
