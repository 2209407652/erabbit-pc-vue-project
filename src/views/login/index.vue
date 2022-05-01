<script setup lang="ts">
import LoginHeaderVue from "./components/login-header.vue";
import LoginFooterVue from "./components/login-footer.vue";
import LoginFormVue from "./components/login-form.vue";
import { ref } from "vue";

/**
 * 切换登陆方式
 */
const activeName = ref("account");
</script>

<template>
  <LoginHeaderVue>欢迎登录</LoginHeaderVue>
  <section class="login-section">
    <div class="wrapper">
      <nav>
        <a
          href="javascript:;"
          :class="{ active: activeName === 'account' }"
          @click="activeName = 'account'"
          >账户登录</a
        >
        <a
          href="javascript:;"
          :class="{ active: activeName === 'qrcode' }"
          @click="activeName = 'qrcode'"
          >扫码登录</a
        >
      </nav>
      <!-- 表单 -->
      <LoginFormVue v-if="activeName === 'account'" />
      <!-- 二维码 -->
      <div v-if="activeName === 'qrcode'" class="qrcode-box">
        <img src="http://erabbit.itheima.net/img/qrcode.5372a064.jpg" alt="" />
        <p>打开<a href="javascript:;">小兔鲜App</a>扫码登陆</p>
      </div>
    </div>
  </section>
  <LoginFooterVue />
</template>

<style lang="less" scoped>
.login-section {
  background: url(http://erabbit.itheima.net/img/login-bg.696efec3.png) no-repeat center /
    cover;
  height: 488px;
  position: relative;
  .wrapper {
    width: 380px;
    background: #fff;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;
      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active {
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
    // 二维码容器
    .qrcode-box {
      text-align: center;
      padding-top: 40px;
      p {
        margin-top: 20px;
        a {
          color: @xtxColor;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
