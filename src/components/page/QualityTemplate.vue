<template>
  <div>
    <div>
      <el-input v-model="templateName" placeholder="模板名称"></el-input>
      <el-button type="primary">查询</el-button>
      <el-button type="primary">重置</el-button>
      <el-button type="primary">新增</el-button>
    </div>
    <div>
      <el-table :data="templates">
        <el-table-column align="center" label="模板名称">
          <template slot-scope="scope">
            <span>{{scope.row.templatename}}</span>
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
        <el-table-column align="center" label="操作">
          <!-- <template slot-scope="scope">
            
          </template> -->
        </el-table-column>
      </el-table>

      <el-pagination :total="total" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total,sizes,prev,pager,next,jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
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
      templates: [
        {
          templatename: "1221",
          creator: "y",
          createTime: ""
        },
        {
          templatename: "1222",
          creator: "y",
          createTime: ""
        },
      ],
    };
  },
  mounted() {
    
  },
  methods: {
    handleCurrentChange(){
      console.log("change")
    }
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
</style>