import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 导入axios
import axios from "axios";
// import qs from "qs";

import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import { Indicator } from "mint-ui";

Vue.use(MintUI);
// 允许跨域请求
// axios.defaults.baseURL = "https://ele-interface.herokuapp.com/";

// 添加请求拦截器  请求拦截
axios.interceptors.request.use(
  config => {
    // 使用qs将post请求的数据做转换
    // if (config.method == "post") {
    //   config.data = qs.stringify(config.data);
    // }
    // 在发送请求之前做些什么
    // 加载动画
    Indicator.open();
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器 请求响应
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    Indicator.close();
    return response;
  },
  error => {
    // 对响应错误做点什么
    Indicator.close();
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;
// 将axios定义到全局
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
