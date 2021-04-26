<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="color:#67C23A">{{title}}</span>
        <el-button style="float: right;margin-left: 5px;" >返回</el-button>
        <el-button style="float: right;" type="primary" @click="generate">生成抽检列表</el-button>
      </div>
      <el-table :data="spotChecks">
        <el-table-column label="来源类型" prop="comeFrom"></el-table-column>
        <el-table-column label="来电号码" prop="callingNo"></el-table-column>
        <el-table-column label="接线员"   prop="agentName"></el-table-column>
        <el-table-column label="响铃时间" prop="ringTime"></el-table-column>
        <el-table-column label="应答时间" prop="acceptTime"></el-table-column>
        <el-table-column label="结束时间" prop="endTime"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Axios from 'axios';
export default {
  
  name: 'UseTemplate',
  data() {
    return {
      tempId: 0,
      total: 0,
      num: 0,
      spotChecks:[],
    };
  },
  mounted() {
    
  },
  methods: {
    generate(){
      var ids = [];
      this.spotChecks.forEach(element => {
        ids.push(element.id);
      });
      Axios({
        headers: {
          'token': this.$store.getters.getToken
        },
        url: 'spotCheckList',
        method: 'post',
        data: {
          tempId: this.tempId,
          spotIds: ids
        }
      }).then(Response => {
        console.log(Response);
        if(Response.data.code != '000000'){
          this.$message.error(Response.data.msg);
        }else{
          this.$message.success( '生成抽检列表成功');
          this.$router.push({ path: '/spotCheckList' });
        }
      }).catch(error => {
        console.log(error);
      })
    }
  },
  computed: {
      title(){
        return '匹配到'+this.total+'条，根据模板筛选出以下'+this.num+'条';
      }
  },
  created() {
    console.log(this.$route.params.id);
    Axios({
      headers: {
        'token': this.$store.getters.getToken
      },
      url: '/useTemplate/'+this.$route.params.id,
      method: 'get'
    }).then(Response => {
      console.log(Response);
      if(Response.data.code !='000000'){
        this.$message.error(Response.data.msg);
      }else{
        this.spotChecks = Response.data.data.checkVOS;
        this.total = Response.data.data.total;
        this.num = Response.data.data.num;
        this.tempId = Response.data.data.tempId
      }
    }).catch(error => {
      console.log(error);
    })
  },
};
</script>

<style  scoped>

</style>