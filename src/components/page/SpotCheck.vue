<template>
  <div>
    <el-col :span="14">
      <el-card>
              <el-table 
        :data="spotChecks"
        stripe
        style="width: 100%">
        <el-table-column prop="agentName" label="话务员"></el-table-column>
        <el-table-column prop="callingNo" label="来电号码"></el-table-column>
        <el-table-column prop="createTime" label="日期" >
        </el-table-column>
        <el-table-column label="话务录音" width="320px">
          <template slot-scope="scope">
            <audio controls >
              <!-- <source :src="scope.row.recordPath" type="audio/mpeg"> -->
              <source src="https://mp32.9ku.com/upload/128/2020/02/13/1002010.mp3" type="audio/mpeg">
              <!-- <source src="../../../assets/TestRecord.mp3" type="audio/mpeg"> -->
              您的浏览器不支持该音频格式。
            </audio>
          </template>
        </el-table-column>
        <el-table-column label="标注状态">
          <template slot-scope="scope">
            {{scope.row.isRemark ? '已标注' : '未标注'}}
          </template>
        </el-table-column>
        <el-table-column label="质检状态">
          <template slot-scope="scope">
            {{qualityStatus(scope.row.qualityStatus)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" @click="spotcheck(scope.row)">抽检</el-button>
            <el-button type="primary" @click="remark(scope.row)">标注</el-button>
          </template>
        </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card class="box-card">
        <el-table :data="spotCheckDetailList">
          <el-table-column label="质检内容" prop="parentName"></el-table-column>
          <el-table-column label="质检内容" prop="name"></el-table-column>
          <el-table-column label="是否达标" >
            <template slot-scope="scope">
                <el-radio v-model="spotCheckDetailList[scope.$index].pass" label="true">是</el-radio>
                <br>
                <el-radio v-model="spotCheckDetailList[scope.$index].pass" label="false">否</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="分值" prop="score"></el-table-column>
          <el-table-column label="严重程度">
            <template slot-scope="scope">
              {{scope.row.level == 1 ? "一般" : "严重"}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card>
        <el-col :span="10">总分：{{totalScore}}</el-col>
        <el-col :span="4">{{weatherPass}}</el-col>
        <el-col :span="10"> <el-button type="primary" @click="submit">提交</el-button></el-col>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import Axios from 'axios';
export default {
  name: 'SpotCheck',
  data() {
    return {
      listId: 0,
      spotChecks: [],
      spotCheckDetailList: [],
      passScore: 0
    };
  },
  computed:{
    totalScore(){
      var sum = 0;
      for(var i = 0;i<this.spotCheckDetailList.length;i++){
        this.spotCheckDetailList[i].pass ? sum += this.spotCheckDetailList[i].score : sum += 0;
      }
      return sum;
    },
    weatherPass(){
      if(this.passScore != 0 && this.totalScore != 0){
        console.log(this.passScore,this.totalScore);
        return this.passScore <= this.totalScore ? "已通过" : "未通过";
      }
      return "未通过";
    }
  },
  methods: {
    qualityStatus(data){

    },
    submit(){
      Axios({
        headers: {
          'token': this.$store.getters.getToken
        },
        url:"submitSpotCheck",
        method: "POST",
        type: "json",
        data:{
          list: this.spotCheckDetailList
        }
      }).then(Response => {
        console.log(Response);
        if(Response.data.code == '000000'){
          this.$message.success( '操作成功');
        }else{
          this.$message.error('操作失败');
        }
      }).catch(error => {
        this.$message.error(error.name);
      })
    },
    spotcheck(data){
      Axios({
        headers: {
          'token': this.$store.getters.getToken
        },
        url: '/spotCheckProject/'+data.id,
        method: 'get'
      }).then( Response => {
        console.log(Response);
        this.spotCheckDetailList = Response.data.data.list;
        this.passScore = Response.data.data.passScore;
      }).catch(error => {
        this.$message.error(error.name);
      })
    },
    remark(data) {
        console.log(data);
        this.remark = data.remark;
        this.$prompt('请输入标注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          Axios({
            headers: {
              'token': this.$store.getters.getToken
            },
            url: '/spotCheckRemark',
            method: 'put',
            data:{
              remark: value,
              id: data.id
            }
          }).then(Response => {
            console.log(Response);
            if(Response.data.code != '000000'){
              this.$message.error(Response.data.msg);
            }else{
              this.$message.success( '更新成功');
              this.init();
            }
          }).catch(error => {
            this.$message.error(error.name);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        })
    },
    init(){
      Axios({
        headers: {
          'token': this.$store.getters.getToken
        },
        url: '/spotCheckEx/'+this.$route.params.id,
        method: 'get',
      }).then(Response => {
        console.log(Response);
        if(Response.data.code != '000000'){
          this.$message.error(Response.data.msg);
        }else{
          this.spotChecks = Response.data.data;
          this.listId = this.$route.params.id;
        }
      }).catch(error => {
        this.$message.error(error.name);
      })
    }
  },
  created() {
    this.init();
  },
};
</script>

<style scoped>
  .el-card{
    padding: 0px 1px 0px 1px;
  }
  .el-button{
    margin-bottom: 10px;
  }
</style>