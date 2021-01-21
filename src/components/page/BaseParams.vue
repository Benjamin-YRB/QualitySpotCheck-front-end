<template>
    <div>
        <div id="inputcontainer">
            <el-input  placeholder="基础参数" v-model="baseparam"></el-input>
            <el-input  placeholder="参数类型" v-model="paramtype"></el-input>
            <el-select v-model="value" placeholder="请选择参数状态" >
              <el-option 
              v-for="item in paramsStatus"  
              :key="item.value" 
              :value="item.value"  
              :label="item.label"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="reset">重置</el-button>
        </div>
        <div id="paramstable">
            <el-table  :data="tableParamPage" style="width: 100%; ">
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
                      {{scope.row.status == true ? "启用":"停用"}}
                  </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                      <el-button type="primary" v-if="scope.row.status!=true" size="mini" @click="showTips(scope.row)">启用</el-button>
                      <el-button type="danger" v-else size="mini" @click="showTips(scope.row)">停用</el-button>
                  </template>
              </el-table-column>
            </el-table>
            <div>
                <el-pagination :total="total" :current-page="currentPage" :page-sizes="[5,10,15,20]"  :page-size="pageSize" @current-change="handlePageChange" @size-change="handleSizeChange" layout="total,sizes,prev,pager,next,jumper"></el-pagination>
            </div>
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
            currentRow: {
                status: false
            },
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
            params:[],
            currentPage: 1,
            pageSize: 5,
            total: 0
        };
    },
    mounted() {
        
    },
    computed: {
        start(){
            return (this.currentPage - 1) * this.pageSize ;
        },
        end(){
            return (this.currentPage * this.pageSize) > this.total != 0 ? this.total : (this.currentPage * this.pageSize);
        },
        tableParams(){
            var result;
            if(this.baseparam != '' ||this.paramtype != ''){
                console.log('修改查询参数');
                 result = this.params
                            .filter(item => (item.name.indexOf(this.baseparam) !== -1))
                            .filter(item => (item.type.indexOf(this.paramtype) !== -1))
                            // .filter(item => item.status == this.selectType)
                if( this.value != ''){
                    result = result.filter(item => item.status == this.selectType)
                }
            }else{
                result = this.params;
                if( this.value != ''){
                    result = result.filter(item => item.status == this.selectType)
                }
            }
            this.total = result.length;
            return result;
        },
        tableParamPage(){
            return  this.tableParams ? this.tableParams.slice(this.start,this.end) : [];
        },
        selectType(){
            return this.value == 1 ? true : false;
        }
    },
    methods: {
        init(){
            Axios({
                headers: {
                    'token': this.$store.getters.getToken
                },
                url: '/baseParams',
                method: 'get',

            }).then(Response => {
                console.log(Response.data);
                var data = Response.data;
                if(data.code == '100003'){
                    this.$message.error('当前会话已过期，请重新登录！')
                    localStorage.clear();
                    this.$router.replace('login');
                }
                this.params = Response.data.data;
                this.total = this.params.length;
            }).catch(error => {
                console.log(error);
            })
        },
        showTips(row){
            //设置当前操作行对象
            this.currentRow = row;
            //动态改变提示内容
            row.status == 1 ? this.message = "确定要停用该参数吗？" : this.message = "确定要启用该参数吗？";
            this.visible = true;
        },
        ensure(){
            console.log('请求前'+this.currentRow.status);
            Axios({
                headers: {
                    'token': this.$store.getters.getToken
                },
                method: 'post',
                url: 'baseParam',
                data: {
                    id: this.currentRow.id,
                    status: !this.currentRow.status
                }
            }).then(Response => {
                console.log(Response);
                console.log(Response.data.data);
                if(Response.data.data == true){

                    this.currentRow.status = !this.currentRow.status;
           
                    this.$message({
                        message: '操作成功！',
                        type: 'success'
                    })
                }else{
                    this.$message.error('操作失败，请重试或联系管理员');
                }
            }).catch(error => {
                console.log(error);
            })
            this.visible = false;
        },
        reset(){
            this.baseparam = "";
            this.paramtype = "";
            this.value = "";
        },
        handlePageChange(value){
            this.currentPage = value;
        },
        handleSizeChange(value){
            this.pageSize = value;
        }
    },
    created(){
        this.init();
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
        margin-top: -5px;
    }
    #paramstable{
        text-align: center;
        max-height: 100%;
    }
    .el-button{
        margin-top: 10px;
    }
</style>