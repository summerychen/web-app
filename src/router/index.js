import Vue from "vue";
import VueRouter from "vue-router";
// //1.引入组件
// import Index from "../views/index.vue"; 写在下面了

Vue.use(VueRouter);
// 2.定义路由
const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("../views/index.vue"),
    // 在首页里面。下面的导航栏，嵌套路由
    children: [
      {
        // 默认进入home
        path: "",
        redirect: "/home"
      },
      {
        path: "/home",
        name: "home",
        component: () => import("../views/Home.vue")
      },
      {
        path: "/me",
        name: "me",
        component: () => import("../views/Me.vue")
      },
      {
        path: "/order",
        name: "order",
        component: () => import("../views/Order.vue")
      },
      {
        path: "/address",
        name: "address",
        component: () => import("../views/Address.vue")
      },
      {
        path: "/city",
        name: "city",
        component: () => import("../views/City.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/Search.vue")
  },
  {
    path: "/shop",
    name: "shop",
    redirect: "/goods",
    component: () => import("../views/Shops/Shop.vue"),
    children: [
      {
        path: "/goods",
        name: "goods",
        component: () => import("../views/Shops/Goods.vue")
      },
      {
        path: "/seller",
        name: "seller",
        component: () => import("../views/Shops/Seller.vue")
      },
      {
        path: "/comments",
        name: "comments",
        component: () => import("../views/Shops/Comments.vue")
      }
    ]
  },
  {
    path: "/myAddress",
    name: "myAddress",
    component: () => import("../views/Orders/MyAddress.vue")
  },
  {
    path: "/addAddress",
    name: "addAddress",
    component: () => import("../views/Orders/AddAddress.vue")
  },
  {
    path: "/settlement",
    name: "settlement",
    component: () => import("../views/Orders/Settlement.vue")
  },
  {
    path: "/remark",
    name: "remark",
    component: () => import("../views/Orders/Remark.vue")
  },
  {
    path: "/pay",
    name: "pay",
    component: () => import("../views/Orders/Pay.vue")
  },
  {
    path: "/orderInfo",
    name: "orderInfo",
    component: () => import("../views/Orders/OrderInfo.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes
});

// 路由守卫;
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.ele_login ? true : false;
  if (to.path == "/login") {
    next();
  } else {
    // 是否在登录状态下
    isLogin ? next() : next("/login");
  }
});
export default router;
