<template>
  <div>
    <div>
      <el-input v-model="templateName" placeholder="模板名称"></el-input>
      <el-button type="primary">查询</el-button>
      <el-button type="primary">重置</el-button>
      <el-button type="primary">新增</el-button>
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
      templateName: "",
    };
  },
  mounted() {
    
  },
  methods: {
    
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
</style>