<template>
  <div>
      <el-card>
    <div id="container">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-ruleForm">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模板名称"></el-input>
        </el-form-item>

        <el-form-item label="时间段" prop="date" required>
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="至"
            @blur="dateBlur"
            value-format="yyyy-MM-dd"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="抽检人员" prop="checkPersonText" v-if="params[0].status == undefined ? false : params[0].status">
          <el-popover
            placement="right"
            width="200"
            trigger="click">
            <el-tree
              :props="personProps"
              @check="personNameCheck"
              default-expand-all
              :data="checkNames"
              node-key="id"
              show-checkbox>
            </el-tree>
            <el-input v-model="form.checkPersonText" placeholder="请选择抽检人员" style="width:250px" slot="reference"></el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="抽检项目" prop="checkProjectText">
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <div style=" overflow-y:auto; overflow-x:auto;  width:400px; height:600px;">
              <el-tree
                :props="projectProps"
                :data="baseProjects"
                node-key="id"
                @check="projectCheck"
                default-expand-all 
                show-checkbox>
              </el-tree>
            </div>
            <!-- <el-button slot="reference">click 激活</el-button> -->
            <el-input v-model="form.checkProjectText" placeholder="请选择抽检项目" style="width:250px" slot="reference"></el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="合格分数" prop="passScore" required >
          <el-input-number v-model="form.passScore" controls-position="right" :min="0" :max="maxPassScore"></el-input-number> <span style="color:#909399; margin-left:20px">当前满分为：{{maxPassScore}},建议合格分数为：{{maxPassScore * 0.6}}</span>
        </el-form-item>

        <el-form-item label="呼入次数（次）" v-if="params[5].status == undefined ? false : params[5].status">
          <el-col :span="11">
            <el-form-item prop="callinmintimes">
              <el-input placeholder="最小值" v-model="form.callinmintimes" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line"  :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="callinmaxtimes">
              <el-input placeholder="最大值" v-model="form.callinmaxtimes" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="异常次数（次）" v-if="params[6].status == undefined ? false : params[6].status" >
          <el-col :span="11">
            <el-form-item prop="exceptionmintimes">
              <el-input placeholder="最小值" v-model="form.exceptionmintimes" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line"  :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="exceptionmintimes">
              <el-input placeholder="最大值" v-model="form.exceptionmaxtimes" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="拒绝次数（次）" v-if="params[7].status == undefined ? false : params[7].status">
          <el-col :span="11">
            <el-form-item prop="refusemintimes">
              <el-input placeholder="最小值" v-model="form.refusemintimes" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="refusemaxtimes">
              <el-input placeholder="最大值" v-model="form.refusemaxtimes" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="呼损率(%)" v-if="params[8].status == undefined ? false : params[8].status">
          <el-col :span="11">
            <el-form-item prop="callfailminpc">
              <el-input placeholder="最小值" v-model="form.callfailminpc" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="callfailmaxpc">
              <el-input placeholder="最大值" v-model="form.callfailmaxpc" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="回访率(%)" v-if="params[9].status == undefined ? false : params[9].status">
          <el-col :span="11">
            <el-form-item prop="callreturnminpc">
              <el-input placeholder="最小值" v-model="form.callreturnminpc" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="callreturnmaxpc">
              <el-input placeholder="最大值" v-model="form.callreturnmaxpc" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="通话时长（秒）" v-if="params[10].status == undefined ? false : params[10].status">
          <el-col :span="11">
            <el-form-item prop="callinmintimelong">
              <el-input placeholder="最小值" v-model="form.callinmintimelong" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="callinmaxtimelong">
              <el-input placeholder="最大值" v-model="form.callinmaxtimelong" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="回访时长（秒）" v-if="params[11].status == undefined ? false : params[11].status">
          <el-col :span="11">
            <el-form-item prop="callreturnmintimelong">
              <el-input placeholder="最小值" v-model="form.callreturnmintimelong" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="callreturnmaxtimelong">
              <el-input placeholder="最大值" v-model="form.callreturnmaxtimelong" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="回访次数（次）" v-if="params[12].status == undefined ? false : params[12].status">
          <el-col :span="11">
            <el-form-item prop="callreturnmintimes">
              <el-input placeholder="最小值" v-model="form.callreturnmintimes" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="callreturnmaxtimes">
              <el-input placeholder="最大值" v-model="form.callreturnmaxtimes" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

<!-- 1、96166工单，2、12345系统工单，3、微信工单，4、在线客服工单，5、转接工单，6、12345电话工单，7、数字城管，8、网站，9、其他 -->
        <el-form-item label="工单来源" v-if="params[3].status == undefined ? false : params[3].status">
          <el-select v-model="form.orderrescource" placeholder="请选择">
            <el-option v-for="item in orderFrom" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> 
        </el-form-item>

        <el-form-item label="是否超时" v-if="params[2].status == undefined ? false : params[2].status">
          <el-select v-model="form.overtime" placeholder="请选择">
            <el-option label="未超时" value="1"></el-option>
            <el-option label="已超时" value="2"></el-option>
          </el-select> 
        </el-form-item>

       <el-form-item label="工单时效" v-if="params[1].status == undefined ? false : params[1].status">
          <el-select v-model="form.orderpres" placeholder="请选择">
            <el-option label="未超时" value="1"></el-option>
            <el-option label="已超时" value="2"></el-option>
          </el-select> 
        </el-form-item>

       <el-form-item label="工单状态" v-if="params[4].status == undefined ? false : params[4].status">
          <el-select v-model="form.orderstatus" placeholder="请选择">
            <el-option label="未结单" value="1"></el-option>
            <el-option label="已结单" value="2"></el-option>
          </el-select> 
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
    <el-dialog title="是否进行人均">
      <el-form :model="sureForm">
        <el-form-item label=""></el-form-item>
        <el-form-item label=""></el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Axios from 'axios';

export default {
  name: 'AddTemplate',
  components: {  },
  directives: {  },
  data() {
    return {
      date: undefined,
      dateStartChange: false,
      dateEndChange: false,
      personProps: {
        children: 'children',
        label: 'name',
      },
      maxPassScore: 0,
      checkPersonText: '',
      checkPersonIds: [],
      checkProjectText: '',
      checkProjectIds: [],
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择开始日期与结束日期', trigger: 'blur' }
        ],
        checkPersonText: [
          { required: true, message: '请选择抽检人员', trigger: 'blur' }
        ],
        checkProjectText: [
          { required: true, message: '请选择抽检项目', trigger: 'blur' }
        ],
        passScore: [
          { required: true, message: '请输入合格分数', trigger: 'blur' }
        ]
      },
      projectProps: {
        children: 'children',
        label: 'name'
      },
      params: [],
      checkNames: [
        {
          id: 0,
          name: '全部',
          children: []
        }
      ],
      baseProjects: [
        {
          id: 0,
          name: '全部',
          score: 0,
          children: []
        }
      ],
      passScore: undefined,
      matchNum: 0,
      form: {
        name: '',
        date:[],
        checkPersons: [],
        passScore: '',
        checkPersonText: '',
        checkProjectText: '',
        callinmintimes: '',    
        callinmaxtimes: '',
        exceptionmintimes: '',
        exceptionmaxtimes: '',
        refusemintimes: '',
        refusemaxtimes: '',
        callfailminpc: '',//呼损率
        callfailmaxpc: '',
        callreturnminpc: '',//回访率
        callreturnmaxpc: '',
        callinmintimelong: '',//来电时长
        callinmaxtimelong: '',
        callreturnmintimelong: '',//回访时长
        callreturnmaxtimelong: '',
        callreturnmintimes: 0,
        callreturnmaxtimes: 0,
        orderpres: undefined, //工单时效，1、特急，2、紧急，3、一般
        overtime: undefined,
        orderrescource: undefined,//工单来源，1、96166工单，2、12345系统工单，3、微信工单，4、在线客服工单，5、转接工单，6、12345电话工单，7、数字城管，8、网站，9、其他
        orderstatus: undefined,//工单状态

      },
      orderFrom:[ {label: '96166工单',value: 1},{label: '12345系统工单',value: 2},{label: '微信工单',value: 3},{label: '在线客服工单',value: 4},{label: '转接工单',value: 5},{label: '12345电话工单',value: 6},{label: '数字城管',value: 7},{label: '网站',value: 8},{label: '其他',value: 9}],
    };
  },
  created() {
    this.init();
    this.initBaseProject();
  },
  methods: {
    personNameCheck(tree,data){
      console.log(data);
      this.form.checkPersonText =  data.checkedKeys.length == 0 ?  '' : '已选'+(data.checkedKeys.length - 1)+'人';
      this.checkPersonIds = data.checkedKeys;
    },
    projectCheck(tree,data){
      console.log(data);
      this.maxPassScore = 0;
      this.form.checkProjectText = data.checkedKeys.length == 0 ? '' : '已选'+(data.checkedKeys.length - 1)+'项';//获取当前选中的项目数量并且设置到input
      this.checkProjectIds = data.checkedKeys;

      //计算选中项的总分,循环累加每一项的分数，限制及格分数不得超过最高分
      for(var i = 0 ;i<data.checkedNodes.length;i++){
        this.maxPassScore += data.checkedNodes[i].score;
      }
      console.log('当前所选项总分为：'+this.maxPassScore);
    },
    dateBlur(){//选取时间段之后获取该时间段之内的所有有工单的话务人员以供选中
      Axios({
        headers:{
          'token': this.$store.getters.getToken
        },
        url: '/checkNames?dateStart='+this.form.date[0]+'&dateEnd='+this.form.date[1],
        method: 'get'
      }).then(Response => {
        console.log(Response);
        if(Response.data.code == '000000'){
          this.checkNames[0].children = Response.data.data;  
          console.log(this.checkNames);
        }else{
          this.$message.error(Response.msg);
        }
      }).catch(error => {
        console.log(error);
      })
    },
    init(){
      Axios({
        headers: {
            'token': this.$store.getters.getToken
        },
        url: '/baseParams',
        method: 'get',
      }).then(Response => {
          console.log(Response.data);
          if(Response.data.code == '100003'){
              this.$message.error('当前会话已过期，请重新登录！')
              localStorage.clear();
              this.$router.replace('login');
          }
          this.params = Response.data.data;
      }).catch(error => {
          this.$message.error('初始化数据失败'+error.name);
      })
    },
    initBaseProject(){
        console.log('开始初始化');
        Axios({
            headers: {
                'token': this.$store.getters.getToken
            },
            url: '/baseProjects',
            method: 'get',
        }).then(Response => {
            console.log(Response);
            this.baseProjects[0].children = Response.data.data;
        }).catch(error => {
          console.log(error);
            this.$notify.error({
            title: '错误',
            message: '初始化数据异常'
        });
    })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //通过校验
          Axios({
            headers: {
                'token': this.$store.getters.getToken
            },
            url: '/matchOrder',
            method: 'post',
            data: { //占时只用时间段两个参数匹配工单数量
              start: this.form.date[0],
              end: this.form.date[1]
            }
          }).then(Response => {
            console.log(Response);
            if(Response.data.code == '000000'){
              this.matchNum = Response.data.data;
            }else{
              this.$message.error(Response.msg);
            }
          }).catch(error => {
            this.$message.error(error.name);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
};
</script>

<style  scoped>
  #container{
    width: 70%;
    margin: 0 auto;
  }
  .line{
    text-align: center;
  }
</style>