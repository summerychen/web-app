<template>
  <!-- 主页组件 -->
  <div class="index">
    <!-- 在主页里面添加router-view，这样他的子路由（嵌套路由就可以正常显示出来） -->
    <router-view></router-view>
    <TabBar :data="tabbarData" />
  </div>
</template>
<script>
// 引入tabbar组件
import TabBar from "../components/TabBar";
export default {
  name: "index",
  data() {
    return {
      tabbarData: [
        { title: "首页", icon: "home", path: "/home" },
        { title: "订单", icon: "file-text-o", path: "/order" },
        { title: "我的", icon: "user", path: "/me" }
      ]
    };
  },
  components: {
    TabBar
  }
};
</script>

<style scoped>
.index {
  width: 100%;
  height: calc(100% - 45px);
}
</style>

