<template>
    <div>
        <div id="inputcontainer">
            <el-input  placeholder="基础参数" v-model="baseparam"></el-input>
            <el-input  placeholder="参数类型" v-model="paramtype"></el-input>
            <el-select v-model="value" placeholder="请选择参数状态" >
              <el-option 
              v-for="item in paramsConditions"  
              :key="item.value" 
              :value="item.value"  
              :label="item.label"
              ></el-option>
            </el-select>
            <el-button type="primary">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
        </div>
        <div id="paramstable">
            <el-table  :data="params" style="width: 100%; ">
              <el-table-column align="center" label="参数名称">
                  <template slot-scope="scope">
                      {{scope.row.name}}
                  </template>
              </el-table-column>
              <el-table-column align="center" label="参数类型">
                  <template slot-scope="scope">
                      {{scope.row.type}}
                  </template>
              </el-table-column>
              <el-table-column align="center" label="参数单位">
                  <template slot-scope="scope">
                      {{scope.row.unit}}
                  </template>
              </el-table-column>
              <el-table-column align="center" label="参数状态">
                  <template slot-scope="scope">
                      {{scope.row.condition == 1 ? "启用":"停用"}}
                  </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                      <el-button type="primary" v-if="scope.row.condition!=1" size="mini" @click="showTips(scope.row)">启用</el-button>
                      <el-button type="danger" v-else size="mini" @click="showTips(scope.row)">停用</el-button>
                  </template>
              </el-table-column>
            </el-table>
        </div>
        <el-dialog 
        title="提示!"
        :visible="visible"
        width="30%"
        center >
        <span>{{message}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="ensure">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import Axios from 'axios';
export default {
    name: 'BaseParams',
    components: {  },
    directives: {  },
    data() {
        return {
            currentRow: {},
            message: "",
            visible: false,
            baseparam: "",
            paramtype: "",
            paramsStatus:[
                {
                    value:1,
                    label:"启用"
                },
                {
                    value:2,
                    label:"停用"
                }
            ],
            value: "",
            params:[
                {
                    id: "",
                    name: "抽检人员",
                    type: "抽检人员",
                    unit: "",
                    condition: "1"
                },
                {
                    id: "",
                    name: "呼入次数",
                    type: "抽检电话",
                    unit: "次",
                    condition: "0"
                },
            ]

        };
    },
    mounted() {
        
    },
    methods: {
        showTips(row){
            //设置当前操作行对象
            this.currentRow = row;
            //动态改变提示内容
            row.condition == 1 ? this.message = "确定要停用该参数吗？" : this.message = "确定要启用该参数吗？";
            this.visible = true;
        },
        ensure(){
            console.log(this.currentRow.name+"的状态修改为"+(this.currentRow.condition == 1 ? "停用" :"启用"));
            this.visible = false;
        },
        reset(){
            this.baseparam = "";
            this.paramtype = "";
            this.value = "";
            //请求全部数据
        }
    },
    // create(){
    //     console.log('basrParams created');
    // }
    created(){
        Axios({
            headers: {
                'token': this.$store.getters.getToken
            },
            url: '/baseParams',
            method: 'get',

        }).then(Response => {
            console.log(Response);
            console.log(Response.data.code);
            var data = Response.data;
            if(data.code == '100003'){
                this.$message.error('当前会话已过期，请重新登录！')
                localStorage.clear();
                this.$router.replace('login');
            }
            this.params = Response.data.data;
        }).catch(error => {
            console.log(error);
        })
    }
};
</script>

<style  scoped>
    .el-input{
        display: inline-block;
        width: 200PX;
        margin-right: 10px;
    }
    .el-select{
        margin-right: 10px;
    }
    #inputcontainer{
        margin-bottom: 15px;
        margin-top: 5px;
    }
    #paramstable{
        text-align: center;
        max-height: 100%;
    }
    .el-button{
        margin-top: 10px;
    }
</style>