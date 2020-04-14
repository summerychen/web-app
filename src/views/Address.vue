<template>
  <div class="address">
    <!-- 使用header组件 -->
    <Header :isLeft="true" title="选择收货地址"></Header>
    <!-- 搜索框 -->
    <div class="city_search">
      <div class="search">
        <span class="city" @click="$router.push('/city')">
          {{city}}
          <!-- 向下箭头 -->
          <i class="fa fa-angle-down"></i>
        </span>
        <i class="fa fa-search"></i>
        <input type="text" v-model="search_val" placeholder="小区/写字楼/学校等" />
      </div>
      <Location :address="address"></Location>
    </div>
    <div class="area">
      <ul class="area_list" v-for="(item,index) in areaList" :key="index">
        <!-- 搜索得到的每一项 -->
        <li @click="selectAddress(item)">
          <h4>{{item.name}}</h4>
          <p>{{item.district}}{{item.address}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 引入header组件
import Header from "../components/Header.vue";
// 使用定位组件
import Location from "../components/Location";
export default {
  name: "Address",
  data() {
    return {
      city: "", //定位到当前城市
      search_val: "", //搜索内容
      areaList: [] //用来存储匹配到的数据
    };
  },
  computed: {
    address() {
      return this.$store.getters.location.formattedAddress;
    }
  },
  watch: {
    search_val() {
      this.searchPlace();
    }
  },
  methods: {
    searchPlace() {
      const self = this;
      // console.log(this.search_val);
      AMap.plugin("AMap.Autocomplete", function() {
        // 实例化Autocomplete
        var autoOptions = {
          //city 限定城市，默认全国
          city: self.city
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);
        autoComplete.search(self.search_val, function(status, result) {
          // 搜索成功时，result即是对应的匹配数据
          // console.log(result);
          self.areaList = result.tips;
        });
      });
    },
    selectAddress(item) {
      // 设置地址
      if (item) {
        this.$store.dispatch(
          "setAddress",
          item.district + item.address + item.name
        );
      } else {
        this.$store.diapatch("setAddress", this.address);
      }
      // 跳转home
      this.$router.push("/home");
    }
  },
  components: {
    Header,
    Location
  },
  beforeRouteEnter(to, from, next) {
    console.log(to);
    // 由home传递过来的city
    next(vm => {
      vm.city = to.params.city;
    });
  }
};
</script>

<style scoped>
.address {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}
.city_search {
  background-color: #fff;
  padding: 10px 20px;
}
.search {
  background-color: #eee;
  height: 40px;
  border-radius: 10px;
  box-sizing: border-box;
  line-height: 40px;
  padding-left: 3px;
}
.city i {
  margin-right: 10px;
}
.search input {
  margin-left: 5px;
  background-color: #eee;
  outline: none;
  border: none;
}
.area {
  margin-top: 16px;
  background: #fff;
}
.area li {
  border-bottom: 1px solid #eee;
  padding: 8px 16px;
  color: #aaa;
}
.area li h4 {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
</style>