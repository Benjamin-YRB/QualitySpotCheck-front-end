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
                                <span v-if="scope.row.level == 0">无级别</span>
                                <span v-else-if="scope.row.level == 1">一般</span>
                                <span v-else style="color: red">严重</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="分值">
                            <template slot-scope="scope">
                                <span>{{scope.row.score}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="创建时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="操作" width="180">
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


        <el-dialog title="添加基础项目" :visible.sync="addProject">
        <el-form :model="addForm" label-position="left" label-width="80px">
            <el-form-item label="父节点" >
                
            </el-form-item>
            <el-form-item label="名称" >
                <el-input v-model="addForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="等级" >
                <el-select v-model="addForm.level" placeholder="请选择活动区域">
                    <el-option label="无级别" value="0"></el-option>
                    <el-option label="一般" value="1"></el-option>
                    <el-option label="严重" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分值" >
                <el-input v-model="addForm.score" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="concelAdd">取 消</el-button>
            <el-button type="primary" @click="addProject = false">确 定</el-button>
        </div>
        </el-dialog>
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
            addProject: false,
            addProjectProps: {
                label: 'name', 
                value: 'id',
                checkStrictly: true,
                lazyLoad: true
            },
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
            },
            addForm: {
                parentProject: {},
                name: '',
                level: 0,
                score: 0
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
    created() {
        Axios({
            headers: {
                'token': this.$store.getters.getToken
            },
            url: '/baseProjects',
            method: 'get',
        }).then(Response => {
            console.log(Response);
            this.baseProject.children = Response.data.data;
        }).catch(error => {
            console.log(error);
        })
    },
    methods: {
        concelAdd(){
            this.addForm.parentProject = {};
            this.addForm.name = '';
            this.addForm.level = '';
            this.addForm.score = 0;
            this.addProject = false;
        },
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
            console.log(data);
        },
        add(){
            this.addProject = true;
        },
        deleted(data){
            console.log(data);
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