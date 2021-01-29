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
                                <el-popconfirm title="确认删除当前项目以及子项目？" @confirm="deleted(scope.row)">
                                    <el-button type="danger"  icon="el-icon-delete" size="mini" slot="reference" ></el-button>
                                </el-popconfirm>
                            </template>
                          </el-table-column>
                        </el-table>
                        <br>
                        <div>
                            <el-pagination 
                            :total="total" 
                            :current-page="currentPage" 
                            :page-size="pageSize" 
                            :page-sizes="[5,10,15,20]" 
                            @size-change="handleSizeChange" 
                            @current-change="handleCurrentChange" 
                            layout="total,sizes,prev,pager,next,jumper">
                            </el-pagination>
                        </div>
                    </div>
                </el-card>
            </el-main>
        </el-container>

        <el-dialog title="添加基础项目" :visible.sync="addProject">
        <el-form :model="addForm" label-position="left" label-width="80px">
            <el-form-item label="父节点" >
                  <el-cascader
                    :options="parentNode"
                    :props="addProjectProps"
                    :show-all-levels="false"
                    clearable
                    filterable
                    @change="addParentChange"
                    ></el-cascader>
            </el-form-item>
            <el-form-item label="名称" >
                <el-input v-model="addForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="等级" >
                <el-select v-model="addForm.level" placeholder="请选择级别">
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
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click="ensureAddProject">确 定</el-button>
        </div>
        </el-dialog>

        <el-dialog title="更新基础项" :visible.sync="updateProject">
            <el-form :model="updateForm" label-position="left" label-width="80px">
            <el-form-item label="名称" >
                <el-input v-model="updateForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="等级" >
                <el-select v-model="updateForm.level" placeholder="请选择要更改的级别">
                    <el-option label="无级别" value="0"></el-option>
                    <el-option label="一般" value="1"></el-option>
                    <el-option label="严重" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分值" >
                <el-input v-model="updateForm.score" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="updateProject = false">取 消</el-button>
            <el-button type="primary" @click="ensureUpdateProject">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import Axios from 'axios';
export default {
    name: 'BaseProject',
    data() {
        return {
            updateProject: false,
            updateForm: {
                id: 0,
                name: '',
                level: undefined,
                score: 0
            },
            addProject: false,
            addProjectProps: {
                label: 'name',  
                value: 'id',
                checkStrictly: true,
                expandTrigger: 'click',
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
                parentId: 0,
                name: '',
                level: "",
                score: 0
            },
            parentNode:[],//添加模板时的父级节点
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
        },
    },
    created() {//初始化数据
        this.init();
    },
    methods: {
        ensureUpdateProject(){
            Axios({
                headers:{
                    'token': this.$store.getters.getToken
                },
                url: '/baseProject',
                method: 'put',
                data: {
                    id: this.updateForm.id,
                    name: this.updateForm.name,
                    score: this.updateForm.score,
                    level: this.updateForm.level ?  this.updateForm.level : null 
                }
            }).then(Response => {
                if(Response.data.data == true){
                    this.$message.success( '更新成功');
                    this.init();
                }else{
                    this.$message.error('更新失败');
                }
            }).catch(error => {
                this.$message.error('系统出现异常'+error);
            })
            this.updateProject = false;
        },
        addParentChange(value){
            this.addForm.parentId = value[value.length - 1];
        },
        ensureAddProject(){
            console.log('添加基础项目');
            Axios({
                headers:{
                    'token': this.$store.getters.getToken
                },
                url: '/baseProject',
                method: 'post',
                data: {
                    parentId: this.addForm.parentId,
                    name: this.addForm.name,
                    level: this.addForm.level,
                    score: this.addForm.score
                }
            }).then(Response => {
                if(Response.data.code == '000000'){
                    this.$message.success( '添加成功');
                    this.init();
                }
            }).catch(error => {
                this.$message.error('出现异常'+error);
            })
            this.addProject = false;
            this.init();
        },
        recursion(project){ //递归删除空白子数组，避免级联选择器出现空白
            for(var i = 0; i < project.length;i++){
                if(project[i].children.length != 0){
                    this.recursion(project[i].children);
                }else{
                   delete project[i].children; 
                }
            }
            return project;
        },
        cancelAdd(){
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
            this.addForm.parentId = 0;
            this.addForm.level = "";
            this.addForm.name = "";
            this.addForm.score = 0;
            this.updateForm.id = 0;
            this.updateForm.name = '';
            this.updateForm.level = undefined;
            this.updateForm.score = 0;
            this.currentPage = 1;
        },
        nodeClick(data){
            console.log(data);
            this.currentPage = 1;
            this.nodeHasClick = true;
            this.currentProject = data;
        },
        modify(data){
            console.log(data);
            this.updateForm.name = data.name;
            this.updateForm.score = data.score;
            this.updateForm.id = data.id;

            console.log(this.updateForm);
            this.updateProject = true;
        },
        add(){
            this.addProject = true;
        },
        deleted(data){
            console.log(data);
            Axios({
                headers:{
                    'token': this.$store.getters.getToken
                },
                url: '/baseProject/'+data.id,
                method: 'delete'
            }).then(Response => {
                if(Response.data.code == '000000'){
                    this.$message.success( '删除成功')
                    this.init();
                }else{
                    this.$message.error('删除失败')
                }
            }).catch(error => {
                this.$message.error('出现异常'+error)
            })
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
        },
        init(){
            console.log('开始初始化');
            this.reset();
            Axios({
                headers: {
                    'token': this.$store.getters.getToken
                },
                url: '/baseProjects',
                method: 'get',
            }).then(Response => {
                console.log(Response);
                this.baseProject.children = Response.data.data;
                this.parentNode = this.recursion(this.baseProject.children);
            }).catch(error => {
                this.$notify.error({
                title: '错误',
                message: '初始化数据异常'
            });
        })
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