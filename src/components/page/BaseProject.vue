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
                    :data="baseProject"
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
                        <el-select v-model="value" placeholder="类型" >
                            <el-option 
                            v-for="item in projectType"  
                            :key="item.value" 
                            :value="item.value"  
                            :label="item.label"
                            ></el-option>
                        </el-select>
                        <el-button type="primary">查询</el-button>
                        <el-button type="primary" @click="reset">重置</el-button>
                        <el-button type="primary" @click="add">新增</el-button>
                        <br>
                        <br>
                        <el-table :data="currentProject.children" style="width:100%" highlight-current-row >
                          <el-table-column align="center" label="质检名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.name}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="center" label="类型">
                            <template slot-scope="scope">
                                <span>{{scope.row.type}}</span>
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
                        <div>
                            <el-pagination :total="total" :current-page="currentPage" :page-size="pagesize" :page-sizes="[5,10,15,20]" @current-change="handleCurrentChange" layout="prev,pager,next,jumper"></el-pagination>
                        </div>
                    </div>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'BaseProject',
    components: {  },
    directives: {  },
    data() {
        return {
            currentPage: 1,
            pageSize: 5,
            currentProject: {children:[]},
            value: "",
            projectType: [
                {
                    value: "1",
                    label: "话务"
                },
                {
                    value: "2",
                    label: "维修"
                }
            ],
            projectName: "",
            filterText: "",
            baseProject: [
                {
                    id: 1,
                    label: '一级 1',
                    name: "测试名称",
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        name: "测试名称1",
                    }]
            }, 
            {
                id: 2,
                label: '一级 2',
                name: "测试名称1",
                children: [{
                    id: 5,
                    label: '二级 2-1',
                    name: "测试名称2",
                }, {
                    id: 6,
                    label: '二级 2-2',
                    name: "测试名称3",
                }
            ]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    computed: {
        total() {
            return this.currentProject.children ? this.currentProject.children.length : 0;
        },
    },
    mounted() {
        
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        reset(){
            this.value = "";
            this.projectName = "";
            //重置的逻辑
        },
        nodeClick(data){
            console.log(data);
            this.currentProject = data;
        },
        modify(data){

        },
        add(){

        },
        deleted(){

        },
        handleCurrentChange(){
            console.log(this.pageSize);
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