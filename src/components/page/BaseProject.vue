<template>
    <div>
        <el-container>
            <el-aside width="30%">
                <el-card header="基础项目">
                    <el-input
                    placeholder="输入关键字进行查找"
                    v-model="filterText">
                    </el-input>

                    <el-tree
                    class="filter-tree"
                    :data="baseProject.children"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    :expand-on-click-node="false"
                    highlight-current
                    @node-click="nodeClick"
                    ref="projectTree">
                    </el-tree>
                </el-card>
            </el-aside>
            <el-main>
                <el-card>
                    <div id="projectContent">
                        <el-input v-model="projectName" placeholder="质检名称"></el-input>

                        <el-button type="primary" @click="select">查询</el-button>
                        <el-button type="primary" @click="reset">重置</el-button>
                        <el-button type="primary" @click="add">新增</el-button>
                        <br>
                        <br>
                        <el-table :data="currentShowProjectChildren" style="width:100%" highlight-current-row >
                          <el-table-column align="center" label="质检名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="等级">
                            <template slot-scope="scope">
                                <span>{{scope.row.level}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="分值">
                            <template slot-scope="scope">
                                <span>{{scope.row.score}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="创建时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.createtime}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="操作">
                            <template slot-scope="scope" >
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="modify(scope.row)"></el-button>
                                <el-button type="danger"  icon="el-icon-delete" size="mini" @click="deleted(scope.row)"></el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <br>
                        <div>
                            <el-pagination :total="total" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5,10,15,20]" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total,sizes,prev,pager,next,jumper"></el-pagination>
                        </div>
                    </div>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Axios from 'axios';
export default {
    name: 'BaseProject',
    components: {  },
    directives: {  },
    data() {
        return {
            nodeHasClick: false,
            isSelect: false,
            currentPage: 1,
            pageSize: 5,
            currentProject: {children:[]}, //当前选中项目
            projectName: "",
            filterText: "",
            baseProject: {
                children:[]
            },
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        };
    },
    computed: {
        start(){
            return (this.currentPage - 1) * this.pageSize ;
        },
        end(){
            return (this.currentPage * this.pageSize) > this.total ? this.total : (this.currentPage * this.pageSize);
        },
        total() {
            return this.nodeHasClick == false ? (this.baseProject.children ? this.baseProject.children.length : 0) : (this.currentProject.children ? this.currentProject.children.length : 0);
            // return this.currentProject.children ? this.currentProject.children.length : 0;
        },
        currentShowProjectChildren(){
            //当前table展示的项目，分页或条件筛选可能导致展示项与选中项目不一致（部分）
            console.log(this.nodeHasClick);
            var temp ;
            if(this.nodeHasClick == false){
                if(this.isSelect == false){
                    return this.baseProject.children ? this.baseProject.children.slice(this.start,this.end) : [];
                }else{
                    temp = this.baseProject.children.filter(item => (item.name.indexOf(this.projectName) !== -1));
                    return Array.isArray(temp) && temp.length !== 0 ? temp.slice(this.start,this.end) : [];
                }
            }else{
                if(this.isSelect == false){
                    return this.currentProject.children ? this.currentProject.children.slice(this.start,this.end) : [];
                }else{
                    temp = this.currentProject.children.filter(item => (item.name.indexOf(this.projectName) !== -1));
                    return Array.isArray(temp) && temp.length !== 0 ? temp.slice(this.start,this.end) : [];
                }
            }
            // return this.nodeHasClick == false ? this.baseProject.children : (this.currentProject.children ? this.currentProject.children.slice(this.start,this.end) : []);
            // return this.currentProject.children.slice(start,end);
        },
    },
    mounted() {
        
    },
    created() {
        Axios({
            headers: {
                'token': this.$store.getters.getToken
            },
            url: '/baseProjects',
            method: 'get',
        }).then(Response => {
            this.baseProject.children = Response.data.data;
        }).catch(error => {
            console.log(error);
        })
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        reset(){
            this.nodeHasClick = false;
            this.isSelect = false;
            this.projectName = "";
            this.filterText = "";
        },
        nodeClick(data){
            console.log(data);
            this.nodeHasClick = true;
            this.currentProject = data;
        },
        modify(data){

        },
        add(){

        },
        deleted(){

        },
        handleCurrentChange(val){
            this.currentPage = val;
        },
        handleSizeChange(val){
            // console.log(val);
            this.pageSize = val;
        },
        select(){
            this.isSelect = true;
        }
    },
    watch: {
      filterText(val) {
        this.$refs.projectTree.filter(val);
      }
    },
};
</script>

<style  scoped>
    .el-select{
        margin-right: 30px;
    }
    .el-main{
        margin-top: -20px;
    }
    .el-input{
        display: inline-block;
        width: 200PX;
        margin-right: 30px;
    }
    .el-button{
        margin-top: 10px;
    }
</style>