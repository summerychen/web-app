<template>
  <div class="search">
    <Header title="搜索" :isLeft="true"></Header>
    <div class="search_header">
      <form action class="search_wrap">
        <i class="fa fa-search"></i>
        <input type="text" v-model="key_word" placeholder="输入商家，商品信息" />
        <button @click.prevent="searchHandle">搜索</button>
      </form>
    </div>
    <!-- 渲染搜索得到的相应的商家信息 -->
    <div class="shop" v-if="result&&!showShop">
      <div class="empty_wrap" v-if="empty">
        <img src="https://fuss10.elemecdn.com/d/60/70008646170d1f654e926a2aaa3afpng.png" alt />
        <div class="empty_txt">
          <h4>附件没有搜索结果</h4>
          <span>换个关键词试试吧</span>
        </div>
      </div>
      <div v-else>
        <!-- 点击到集体的商家页面订餐 -->
        <SearchIndex @click="$router.push('/shop')" :data="result.restaurants" />
        <SearchIndex @click="shopItemClick" :data="result.words" />
      </div>
    </div>
    <!-- 商家信息 当点击上面商家信息时，这个显示，反则上面的显示 -->
    <div v-if="showShop" class="container">
      <!-- 商家信息 -->
      <!-- 导航 -->
      <!-- 单独写一个组导航栏的组件 -->
      <FilterView :filterData="filterData" @update="update" />
      <div class="shoplist" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading">
        <IndexShop v-for="(item,index) in restaurants" :key="index" :restaurant="item.restaurant" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import SearchIndex from "../components/SearchIndex";
import FilterView from "../components/FilterView";
import IndexShop from "../components/IndexShop";
import { InfiniteScroll } from "mint-ui";
export default {
  name: "Search",
  data() {
    return {
      key_word: "",
      result: null,
      data: null,
      empty: false,
      showShop: false,
      filterData: null,
      page: 0, //页数
      size: 7, //个数
      restaurants: [],
      loading: false //默认未加载完
    };
  },
  created() {
    // 获取导航栏数据
    this.$axios("/api/profile/filter").then(res => {
      // console.log(res.data);
      this.filterData = res.data;
    });
  },
  watch: {
    // key_word 一旦变化，方法就会运行

    key_word() {
      this.empty = false;
      this.keyWordChange();
      this.showShop = false;
    }
  },
  methods: {
    keyWordChange() {
      // console.log(this.key_word);
      this.$axios(`/api/profile/typeahead/${this.key_word}`)
        .then(res => {
          console.log(res.data);
          // 返回输入框搜索的数据相关商家信息
          this.result = res.data;
        })
        .catch(err => {
          this.result = null;
        });
    },
    shopItemClick() {
      this.showShop = true;
      this.page = 0;
      this.restaurants = [];
    },
    searchHandle() {
      if (!this.key_word) return;
      // 搜索
      if (
        this.result &&
        (this.result.restaurants.length > 0 || this.result.words.length > 0)
      ) {
        // console.log("有内容");
        // 点击搜索.显示商家信息
        this.shopItemClick();
      } else {
        this.empty = true;
      }
    },
    // 更新数据
    update(condation) {
      // console.log(condation); //得到选中的排序方式下的数据
      this.data = condation;
      this.shopItemClick();
    },
    // 当页面上下滚动式，就会触发
    loadMore() {
      this.page++;
      //拉取商家信息  获取饭店数据 用post请求，需要传递数据
      this.$axios
        .post(`/api/profile/restaurants/${this.page}/${this.size}`, this.data)
        .then(res => {
          console.log(res.data);

          if (res.data.length > 0) {
            res.data.forEach(item => {
              this.restaurants.push(item);
            });
          } else {
            this.loading = true;
          }
        });
    }
  },
  components: {
    Header,
    SearchIndex,
    FilterView,
    IndexShop
  }
};
</script>

<style scoped>
.search {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.search_header {
  margin-top: 45px;
  background: #fff;
  padding: 0 4.266667vw;
}
.search_header .search_wrap {
  padding: 2.933333vw 2.933333vw 2.933333vw 0;
  display: flex;
  align-items: center;
  position: relative;
}
.search_wrap .fa-search {
  width: 2.933333vw;
  height: 2.933333vw;
  color: #888;
  position: absolute;
  top: 4.6666666vw;
  left: 2.933333vw;
}
.search_wrap input {
  flex-grow: 1;
  border-radius: 0.266667vw;
  background-color: #f8f8f8;
  padding: 1.733333vw 4vw 1.733333vw 8.8vw;
  color: #666;
  outline: none;
  border: none;
}
.search_wrap button {
  outline: none;
  border: none;
  color: #333;
  font-size: 0.426667rem;
  background: #fff;
  font-weight: 700;
  margin-left: 2.933333vw;
  font-size: 14px;
}
</style>