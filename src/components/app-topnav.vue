<script setup lang="ts">
import { useUserStore, useCartStore } from "@/store";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const cartStore = useCartStore();

// 根据当前的登陆状态显示用户名和退出登陆
const { profile } = userStore;

/**
 * 退出登陆
 */
const initData = {
  id: "",
  avatar: "",
  nickname: "",
  account: "",
  mobile: "",
  token: "",
};
function logout() {
  userStore.setUser(initData);
  // 清空购物车
  cartStore.setCartList([]);
  router.push("/login");
}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <a href="javascript:;"
              ><i class="iconfont icon-user"></i>{{ profile.account }}</a
            >
          </li>
          <li><a href="javascript:;" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">请先登录</RouterLink></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="less" scoped>
.app-topnav {
  background-color: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      border-left: 2px solid #666;
      &:first-child {
        border: none;
      }
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        &:hover {
          color: @xtxColor;
        }
      }
      i {
        font-size: 14px;
        margin-right: 2px;
      }
    }
  }
}
</style>
