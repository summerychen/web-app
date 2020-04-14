<template>
  <div class="header">
    <!-- 左侧返回按钮 -->
    <div class="header-button is-left" v-show="isLeft">
      <i class="fa fa-chevron-left"></i>
      <button @click="$router.go(-1)">返回</button>
    </div>

    <!-- 中间标题 -->
    <h1 class="header-title">{{title}}</h1>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    title: String,
    isLeft: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.header {
  align-items: center;
  display: flex;
  height: 45px;
  color: #fff;
  font-size: 16px;
  line-height: 1;
  padding: 0 10px;
  text-align: center;
  white-space: nowrap;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 99;
  background-color: #009eef;
}
.header-button {
  position: absolute;
}

.header-button button {
  background-color: transparent;
  border: 0;
  box-shadow: none;
  color: inherit;
  display: inline-block;
  padding: 0;
  font-size: inherit;
  outline: none;
}
.header-title {
  flex: 1;
}
.is-left {
  text-align: left;
}
</style>