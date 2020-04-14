<template>
    <div @keydown.enter="getRepairOrderList">
        <div>
            <el-row>
                <el-col :span="6">
                    <h1>维修工单</h1>
                </el-col>
                <el-col :span="18">
                    <div class="search-box">
                        <el-row>
                            <el-col :span="17">
                                <el-row>
                                    <el-col :span="6">
                                        <el-select  size="small" v-model="requestParams.affiliation" clearable placeholder="请选择单位">
                                            <el-option :value="requestParams.affiliation" style="height: auto;width: 200px">
                                                <el-tree :data="treeOptionList" :props="defaultProps" @node-click="saveAffiliation"></el-tree>
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-select size="small" v-model="requestParams.type" placeholder="报修类型">
                                            <el-option
                                                    v-for="item in typeList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-select size="small" v-model="requestParams.status" placeholder="报修状态">
                                            <el-option
                                                    v-for="item in statusList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input size="small" v-model="requestParams.query" placeholder="设备名称"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="7">
                                <el-button @click="getRepairOrderList" type="danger" size="small" class="modify">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button @click="clearSearchParam" type="danger" size="small">
                                    <i class="el-icon-delete"></i>
                                    <span>清空</span>
                                </el-button>
                                <el-button type="success" size="small">
                                    <i class="el-icon-plus"></i>
                                    <span>导出</span>
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-card>
                <el-table
                        ref="repairTableRef"
                        :data="repairOrderList"
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="500px"
                        @selection-change="handleSelectionChange" stripe highlight-current-row
                        :header-cell-style="{
                            'background-color':'rgb(238,240,244)',
                            'color':'black',
                            'font-size':'14px',
                            'text-align':'center'
                        }"
                        :cell-style="{
                            'font-size':'8px',
                            'color':'black',
                            'text-align':'center',
                        }"
                        :row-style="{
                            'padding':'5px'
                        }"
                        :empty-text="emptyMessage">
                    <el-table-column
                            type="selection"
                            width="37"
                            fixed>
                    </el-table-column>
                    <el-table-column
                            type="index"
                            label="序号"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="affiliation"
                            label="所属单位"
                            width="95">
                    </el-table-column>
                    <el-table-column
                            prop="orderIndex"
                            label="工单编号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="工单类型"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="deviceName"
                            label="设备名称"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            label="故障描述"
                            width="125">
                    </el-table-column>
                    <el-table-column
                            prop="server"
                            label="服务单位"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="工单状态"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="repairMember"
                            label="维修人员"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="valueAdded"
                            label="增值费用（元）"
                            width="120">
                    </el-table-column>
                    <el-table-column width="90px" label="操作" fixed="right">
                        <template>
                            <el-button
                                    size="mini"
                                    type="danger"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <div class="pagination-box">
                <el-pagination
                        layout="total,sizes"
                        :total="pagination.total"
                        :page-sizes="[10, 20]"
                        @size-change="changePageSize"
                >

                </el-pagination>
                <el-pagination
                        :hide-on-single-page="true"
                        @current-change="changeCurrentPage"
                        :current-page="requestParams.page"
                        layout=" prev, pager, next"
                        :page-size="pagination.pagenum"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                repairOrderList:[],
                requestParams:{
                    "page":1,
                    "size":20,
                    "query":"",
                    "type":"",
                    "affiliation":'',
                    'status':'',
                },
                emptyMessage:'未找到匹配记录',
                pagination:{
                    total:0,
                    pagenum:1
                },
                value:[],
                treeOptionList:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                typeList:[
                    {
                        value: '应急维修',
                        label: '应急维修'
                    }, {
                        value: '常规维修',
                        label: '常规维修'
                    }
                ],
                statusList:[
                    {
                        value: '待指派',
                        label: '待指派'
                    }, {
                        value: '待审核',
                        label: '待审核'
                    },{
                        value: '已指派',
                        label: '已指派'
                    }, {
                        value: '已审核',
                        label: '已审核'
                    },{
                        value: '已到场',
                        label: '已到场'
                    }, {
                        value: '已撤销',
                        label: '已撤销'
                    }, {
                        value: '已完成',
                        label: '已完成'
                    }
                ]

            }
        },
        methods:{
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            clearSearchParam(){
                this.requestParams.query = '';
                this.requestParams.type = '';
                this.requestParams.status='';
                this.requestParams.affiliation='';
            },
            changePageSize(val){
                this.requestParams.size=val;
            },
            changeCurrentPage(val){
                this.requestParams.page=val;
            },
            async getRepairOrderList(){
                const {data:res}=await this.$http.get("order/repair",{params:this.requestParams});
                if(res.meta.code!==200)
                    return this.$message.error(res.meta.message);
                this.repairOrderList = res.data.data;
                this.pagination.pagenum=res.data.pagenum;
                this.pagination.total=res.data.total;
            },
            async getTreeOptionList(){
                const {data:res}=await this.$http.get("tree/affiliation");
                if(res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.treeOptionList=res.data;
            }
            ,
            saveAffiliation(val){
                if(!val.children)
                    this.requestParams.affiliation=val.label
            }
        },
        created(){
            this.getRepairOrderList();
            this.getTreeOptionList();
        }
    }
</script>

<style lang="less" scoped>
    h1{
        border-left: #df5749 4px solid;
        padding-left: 8px;
    }
    .el-table{
        border: 1px solid #dee2e6;
        border-radius: 5px;
    }
    .modify{
        color: white;
        background-color: #df5749;
    }
    .search-box{
        padding-top: 23px;
        .el-select{
            width: 150px;
        }
        .el-input{
            width: 150px;
        }
    }
    .pagination-box{
        position: absolute;
        right: 10px;
    }
    .el-select-dropdown__item.hover{
        background-color: white;
    }

</style>
