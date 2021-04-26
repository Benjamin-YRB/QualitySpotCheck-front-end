<template>
  <div>
    <el-input v-model="namefilter" placeholder="列表名称" style="width:200px; margin-right:5px;margin-bottom:5px"></el-input><el-button @click="reset"  type="primary">重置</el-button>
    <el-table :data="spotCheckLists" @row-dblclick="check">
      <el-table-column label="列表名称" prop="name"></el-table-column>
      <el-table-column label="质检员" prop="operator"></el-table-column>
      <el-table-column label="创建日期" prop="createTime"></el-table-column>
      <el-table-column label="抽检时间段">
        <template slot-scope="scope">
          {{scope.row.beginTime}} - {{scope.row.endTime}}
        </template>
      </el-table-column>
      <el-table-column label="列表状态">
        <template slot-scope="scope">
          {{scope.row.status ? "已上报" : "未上报"}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="commit(scope.row)">上报</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Axios from 'axios';
export default {
  name: 'SpotCheckList',
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      namefilter: '',
      spotCheckLists: []
    };
  },
  mounted() {
    
  },
  methods: {
    check(row){
      console.log(row);
      this.$router.push({
        path: '/spotCheck/'+row.id,
      });
    },
    init(){
      Axios({
          headers: {
            'token': this.$store.getters.getToken
          },
        url: '/spotCheckLists',
        method: 'get'
      }).then(Response => {
        console.log(Response);
        if(Response.data.code != '000000'){
          this.$message.error(Response.data.msg);
        }else{
          this.spotCheckLists = Response.data.data;
        }
      })
    },
    commit(data){
      
    },
    reset(){

    }
  },
  computed: {
    total() {
      
    },
    handleSizeChange(){

    },
    handleCurrentChange(){

    },
  },
  created(){
    this.init();
  }
};
</script>

<style  scoped>

</style>