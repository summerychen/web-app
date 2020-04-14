<template>
  <div :class="{'open':isSort || isScreen}" @click.self="hideView">
    <!-- 导航 -->
    <div v-if="filterData" :class="{'filter_top':isShow}" class="filter_wrap">
      <aside class="filter">
        <div
          class="filter-nav"
          v-for="(item,index) in filterData.navTab"
          :key="index"
          :class="{'filter-bold':currentFilter==index}"
          @click="filterSort(index)"
        >
          <span>{{item.name}}</span>
          <i v-if="item.icon" :class="'fa fa-'+item.icon"></i>
        </div>
      </aside>
    </div>
    <!-- 排序 -->

    <section class="filter-extend" v-if="isSort">
      <ul>
        <li v-for="(item,index) in filterData.sortBy" :key="index" @click="selectSort(item,index)">
          <span :class="{'selectName':currentSort == index}">{{item.name}}</span>
          <i v-show="currentSort == index" class="fa fa-check"></i>
        </li>
      </ul>
    </section>
    <!-- 筛选 -->
    <section class="filter-extend" v-if="isScreen">
      <div class="filter-sort">
        <!--screen 筛选里面3个部分  -->
        <div v-for="(screen,index) in filterData.screenBy" :key="index" class="morefilter">
          <p class="title">{{screen.title}}</p>
          <ul>
            <!-- item 3个部分里面的数据 -->
            <!-- 添加点击事件，实现单选和多选 -->
            <!-- 绑定动态类名，当item.select属性为true才添加该样式 -->
            <li
              v-for="(item,i) in screen.data"
              :key="i"
              :class="{'selected':item.select}"
              @click="selectScreen(item,screen)"
            >
              <img v-if="item.icon" :src="item.icon" alt />
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="morefilter-btn">
        <!-- 绑定点击事件，清空所有选择 -->
        <span @click="clearFilter" :class="{'edit':edit}" class="morefilter-clear">清空</span>
        <span @click="filterOk" class="morefilter-ok">确定</span>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "FilterView",
  data() {
    return {
      currentFilter: 0,
      isSort: false,
      currentSort: 0,
      isScreen: false,
      isShow: false
    };
  },
  computed: {
    // 一旦筛选里面有数据被选中，就给清空按钮添加样式
    edit() {
      let edit = false;
      this.filterData.screenBy.forEach(screen => {
        screen.data.forEach(item => {
          if (item.select) {
            edit = true;
          }
        });
      });
      return edit;
    }
  },
  props: {
    filterData: Object
  },
  methods: {
    filterSort(index) {
      this.currentFilter = index;
      switch (index) {
        case 0:
          this.isSort = true;
          // 点击综合排序的时候，注册事件searchFixed
          this.$emit("searchFixed", true);
          this.isShow = true;
          break;
        case 1:
          this.$emit("update", {
            condition: this.filterData.navTab[1].condition
          });
          this.hideView();
          break;
        case 2:
          this.$emit("update", {
            condition: this.filterData.navTab[2].condition
          });
          this.hideView();
          break;
        case 3:
          this.isScreen = true;
          this.isSort = false;
          this.$emit("searchFixed", true);
          this.isShow = true;

          break;
        default:
          this.hideView();
          break;
      }
    },

    hideView() {
      this.isSort = false;
      this.isScreen = false;
      this.$emit("searchFixed", false);
      this.isShow = false;
    },
    // 给被选中的项添加对应的样式，替换标题，隐藏蒙版
    selectSort(item, index) {
      this.currentSort = index;
      this.filterData.navTab[0].name = this.filterData.sortBy[index].name;
      this.hideView();

      // 更新数据
      this.$emit("update", { condition: item.code });
    },
    selectScreen(item, screen) {
      // 筛选里面的3个部分数据接口里面都提供了各自的id，只有第一部分商家服务是多选，其他2个是单选
      if (screen.id !== "MPI") {
        // 单选 （相当于排他思想）select数据接口里面有，先全部让为false，不被选中
        screen.data.forEach(ele => {
          ele.select = false;
        });
      }
      // 其他的2个部分就不用在意排他，因为是多选
      item.select = !item.select;
    },
    // 清空所有选择，都变为不被选中的 层层遍历，让所有的select属性都变为false
    clearFilter() {
      this.filterData.screenBy.forEach(screen => {
        screen.data.forEach(item => {
          item.select = false;
        });
      });
    },
    filterOk() {
      let screenData = {
        MPI: "",
        offer: "",
        per: ""
      };
      let mpiStr = "";
      this.filterData.screenBy.forEach(screen => {
        screen.data.forEach((item, index) => {
          if (item.select) {
            // 两种情况 1.多选 2.单选
            if (screen.id !== "MPI") {
              // 单选
              screenData[screen.id] = item.code;
            } else {
              // 多选 fengniao,pinpai
              mpiStr += item.code + ",";
              screenData[screen.id] = mpiStr;
            }
          }
        });
      });

      console.log(mpiStr);
      this.$emit("update", { condition: screenData });

      this.hideView();
    }
  }
};
</script>

<style scoped>
.filter_wrap {
  background: #fff;
  position: sticky;
  top: 54px;
  z-index: 10;
}
.filter_top {
  background: #fff;
  position: fixed;
  top: 54px;
  z-index: 999;
  width: 100%;
}
.hidden {
  display: none;
}
.filter {
  position: relative;
  border-bottom: 1px solid #ddd;
  line-height: 10.4vw;
  z-index: 101;
  height: 10.666667vw;
  display: flex;
  justify-content: space-around;
}
.filter-nav {
  flex: 1;
  text-align: center;
  color: #666;
  font-size: 0.8333rem;
}
.filter-nav i {
  width: 1.6vw;
  height: 0.8vw;
  margin-left: 1.333333vw;
  margin-bottom: 0.533333vw;
  fill: #333;
  will-change: transform;
}

.filter-bold {
  font-weight: 600;
  color: #333;
}

.open {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  z-index: 3;
}

.filter-extend {
  background-color: #fff;
  color: #333;
  padding-top: 2.133333vw;
  position: absolute;
  width: 100%;
  z-index: 4;
  left: 0;
  top: 23.533333vw;
}
.filter-extend li {
  position: relative;
  padding-left: 5.333333vw;
  line-height: 10.666667vw;
  overflow: hidden;
}
.fa-check {
  float: right;
  color: #009eef;
  margin-right: 3.733333vw;
  line-height: 10.666667vw;
}

.selectName {
  color: #009eef;
}
/* 筛选 */
.filter-sort {
  background: #fff;
  padding: 0 2.666667vw;
  line-height: normal;
}
.morefilter {
  margin: 2.666667vw 0;
  overflow: hidden;
}
.morefilter .title {
  margin-bottom: 2vw;
  color: #666;
  font-size: 0.5rem;
}
.morefilter ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.8rem;
}
.morefilter li {
  box-sizing: border-box;
  width: 30%;
  height: 9.333333vw;
  line-height: 9.333333vw;
  margin: 0.8vw 1%;
  background: #fafafa;
}
.morefilter li img {
  width: 3.466667vw;
  height: 3.466667vw;
  vertical-align: middle;
  margin-right: 0.8vw;
}
.morefilter li span {
  margin-left: 2%;
  vertical-align: middle;
}

.morefilter-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fafafa;
  box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
  line-height: 11.466667vw;
  box-sizing: border-box;
}
.morefilter-btn span {
  font-size: 0.826667rem;
  text-align: center;
  text-decoration: none;
  flex: 1;
}
.morefilter-clear {
  color: #ddd;
  background: #fff;
}
.morefilter-ok {
  color: #fff;
  background: #00d762;
  border: 0.133333vw solid #00d762;
}

.selected {
  color: #3190e8 !important;
  background-color: #edf5ff !important;
}

.edit {
  color: #333 !important;
}
</style>
