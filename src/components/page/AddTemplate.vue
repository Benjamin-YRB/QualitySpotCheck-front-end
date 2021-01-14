<template>
  <div>
    <el-form :model="form" label-width="80px">
      <el-form-item label="模板名称">
        <el-input v-model="form.templateName" placeholder="请输入模板名称"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddTemplate',
  components: {  },
  directives: {  },
  data() {
    return {
      form: {
        templateName: '',
        startDate: '',
        endDate: '',
        checkPersons: [],
        passScore: '',
        callinmintimes: '',
        callinmaxtimes: '',
        exceptionmintimes: '',
        exceptionmaxtimes: '',
        refusemintimes: '',
        refusemactimes: '',
        callfailminpc: '',//呼损率
        callfailmaxpc: '',
        callreturnminpc: '',//回访率
        callreturnmaxpc: '',
        callinmintimelong: '',//来电时长
        callinmaxtimelong: '',
        callreturnmintimelong: '',//回访时长
        callreturnmaxtimelong: '',
        
      }
    };
  },
  mounted() {
    
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>

</style>