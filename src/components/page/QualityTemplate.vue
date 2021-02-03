<template>
  <div>
    <div>
      <el-input v-model="templateName" placeholder="模板名称"></el-input>
      <el-button type="primary">重置</el-button>
      <el-button type="primary" @click="addTemplate">新增</el-button>
    </div>
    <div>
      <el-table :data="templates">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" label-width="100px" class="demo-table-expand">
              <el-form-item label="模板名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="时间段" ><span>{{props.row.beginTime}} ~ {{props.row.endTime}}</span></el-form-item>
              <el-form-item label="合格分数">
                <span>{{ props.row.passScore }}</span>
              </el-form-item>
              <el-form-item label="是否人均">
                <span>{{ props.row.average == true ? '人均':'不人均' }}</span>
              </el-form-item>
              <el-form-item>
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="抽检人员">
                <span>{{ props.row.persons }}</span>
              </el-form-item>
              <el-form-item label="抽检项目">
                <span>{{ props.row.projects }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="模板名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人">
          <template slot-scope="scope">
            <span>{{scope.row.creator}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="modify(scope.row)"></el-button>
            <el-popconfirm title="确认删除当前模板？" @confirm="deleted(scope.row)">
                <el-button type="danger"  icon="el-icon-delete" size="mini" slot="reference" ></el-button>
            </el-popconfirm>
            <el-button type="primary" size="mini" @click="use(scope.row)">使用模板</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :total="total" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total,sizes,prev,pager,next,jumper"></el-pagination>
    </div>

    
  </div>
</template>

<script>
import Axios from 'axios';
export default {
  name: 'QualityTemplate',
  components: {  },
  directives: {  },
  data() {
    return {
      pageSize: 5,
      total: 0,
      currentPage: 1,

      templateName: "",
      templates: [],
    };
  },
  mounted() {
    
  },
  methods: {
    deleted(data){
      Axios({
        headers: {
          'token': this.$store.getters.getToken
        },
        url: '/qualityTemplate/'+data.id,
        method: 'delete',
      }).then(Response => {
        console.log(Response);
        if(Response.data.code != '000000'){
          this.$message.error(Response.data.msg);
        }else{
          this.$message.success('操作成功')
          this.init();
        }
      }).catch(error => {
        this.$message.error('系统异常'+error.name);
      })
    },
    modify(data){
      console.log('修改');
    },
    use(data){
      this.$router.push({
        path: '/useTemplate/'+data.id
      })
    },
    init(){
      Axios({
        headers: {
          'token': this.$store.getters.getToken
        },
        url: '/qualityTemplates',
        method: 'get',
      }).then(Response => {
        console.log(Response);
        if(Response.data.code!= '000000'){
          this.$message.error('出现异常：'+Response.data.msg);
        }else{
          this.templates = Response.data.data;
        }
      }).catch(error => {
        this.$message.error(error.name);
      })
    },
    handleCurrentChange(){
      console.log("change")
    },
    addTemplate(){
      this.$router.push('/addTemplate');
    }
  },
  created() {
    this.init();
  },
};
</script>

<style  scoped>
  .el-input{
    display: inline-block;
    width: 200PX;
    margin-right: 10px;
  }
  .el-button{
    margin-top: 10px;
  }
  .el-table{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-button--mini{
    margin-left: 5px;
  }
</style>