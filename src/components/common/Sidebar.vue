<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#20222A"
      text-color="rgba(255,255,255,.7)"
      active-text-color="#fff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
import {getSysmenu} from '../../api/api'
export default {
  data() {
    return {
      collapse: true,
      menuItems: [],
      items: this.$store.getters.getItem
    };
  },
  methods: {
    // getMenuData(menuName) {
    //   let menuData = [];
    //   getSysmenu().then(
    //     function(data) {
    //       let data1 = data.data.menuArr;
    //       data1.forEach((val,index) => {
    //         let i=8;
    //         if(val.menuname==menuName){
    //           let systemItem = {};
    //           systemItem.icon = "el-icon-setting";
    //           systemItem.idex=i;
    //           systemItem.title=val.menuname;
    //           systemItem.subs=[];
    //           data1.forEach(value => {
    //             if(value.parentid==val.id){
    //               let systemSubs = {};
    //               let menuurl = value.menuurl.split('/')[2];
    //               systemSubs.index = menuurl;
    //               systemSubs.title = value.menuname;
    //               systemItem.subs.push(systemSubs);
    //             }
    //           });
    //           this.items.push(systemItem);
    //         }
    //         i++;
    //       });
    //     }.bind(this)
    //   );
    // }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    // this.getMenuData("系统管理");
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
