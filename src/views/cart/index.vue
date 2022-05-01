<script setup lang="ts">
import { GoodDetails } from "@/env";
import { useCartStore, useUserStore } from "@/store";
import GoodsRelevantVue from "../goods/components/goods-relevant.vue";
import CartNoneVue from "./components/cart-none.vue";
import Confirm from "@/components/library/Confirm";
import Message from "@/components/library/Message";
import { useRouter } from "vue-router";

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();

/**
 * 单选
 */
function checkOne(goods: GoodDetails, selected: boolean) {
  cartStore.updateCart({ ...goods, selected });
}

/**
 * 全选 - 反选
 */
function checkAll(e: boolean) {
  cartStore.checkAllCart(e);
}

/**
 * 删除
 */
function deleteCart(id: string) {
  Confirm({ text: "您确定从购物车删除该商品吗？", title: "温馨提示" })
    .then(() => {
      console.log("点击确认");
      cartStore.deleteCart(id);
    })
    .catch((e) => {
      console.log("点击取消");
    });
}

/**
 * 删除选中
 */
function batchDeleteCart(isClear: boolean) {
  if (cartStore.selectedTotal === 0) return;
  Confirm({
    text: `您确定从购物车删除${isClear ? "失效" : "选中"}的商品吗？`,
    title: "警告",
  })
    .then(() => {
      cartStore.batchDeleteCart(isClear);
    })
    .catch((e) => {
      console.log("取消");
    });
}

/**
 * 修改数量
 */
function changeCount(goods: GoodDetails, collectCount: number) {
  cartStore.updateCart({ ...goods, collectCount });
}

/**
 * 下单结算
 */
function goCheckout() {
  // 1. 判断是否选择有效商品
  // 2. 判断是否已经登录，未登录 弹窗提示
  // 3. 进行跳转 （需要做访问权限控制）
  if (cartStore.selectedTotal === 0)
    return Message({ text: "至少选中一件商品才能结算", type: "warn" });
  if (!userStore.$state.profile.token) {
    Confirm({ text: "下单结算需要登录，您是否去登录？", title: "提示" })
      .then(() => {
        // 点击确认
        router.push("/member/checkout");
      })
      .catch((e) => {});
  } else {
    router.push("/member/checkout");
  }
}
</script>

<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <CartNoneVue v-if="cartStore.validList.length === 0" />
      <div v-else class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox :modelValue="cartStore.isCheckAll" @update="checkAll"
                  >全选</XtxCheckbox
                >
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-for="item in cartStore.validList" :key="item.id">
              <td>
                <XtxCheckbox
                  :modelValue="item.selected"
                  @update="($event: boolean) => checkOne(item, $event)"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id}`"
                    ><img :src="item.mainPictures[0]" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <!-- 选择规格组件 -->
                    <p class="attr">{{ item.desc }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.price }}</p>
                <p v-if="Number(item.price) - Number(item.oldPrice) > 0">
                  比加入时降价
                  <span class="red"
                    >&yen;{{ Number(item.price) - Number(item.oldPrice) }}</span
                  >
                </p>
              </td>
              <td class="tc">
                <XtxNumbox
                  :modelValue="item.collectCount"
                  :max="item.inventory"
                  @change="($event: number) => changeCount(item, $event)"
                />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{ (Number(item.price) * 100 * item.collectCount) / 100 }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p>
                  <a class="green" href="javascript:;" @click="deleteCart(item.id)"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="cartStore.invalidList.length > 0">
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr v-for="item in cartStore.invalidList" :key="item.id">
              <td><XtxCheckbox style="color: #eee" :modelValue="item.selected" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id}`"
                    ><img :src="item.mainPictures[0]" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <p class="attr">{{ item.desc }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.price }}</p>
              </td>
              <td class="tc">{{ item.collectCount }}</td>
              <td class="tc">
                <p>&yen;{{ (Number(item.price) * 100 * item.collectCount) / 100 }}</p>
              </td>
              <td class="tc">
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div v-if="cartStore.validList.length !== 0" class="action">
        <div class="batch">
          <XtxCheckbox :modelValue="cartStore.isCheckAll">全选</XtxCheckbox>
          <a href="javascript:;" @click="batchDeleteCart(false)">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ cartStore.validTotal }} 件商品，已选择
          {{ cartStore.selectedTotal }} 件，商品合计：
          <span class="red">¥{{ cartStore.selectedAmount }}</span>
          <XtxButton type="primary" @click="goCheckout">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodsRelevantVue
        v-if="cartStore.validList.length !== 0"
        :goodsId="cartStore.validList[0].id || '0'"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
