<template>
    <div @keydown.enter="getDetectOrderList">
        <div>
            <el-row>
                <el-col :span="6">
                    <h1>巡检任务</h1>
                </el-col>
                <el-col :span="18">
                    <div class="search-box">
                        <el-row>
                            <el-col :span="17">
                                <el-row>
                                    <el-col :span="6">
                                        <el-select  size="small" v-model="requestParams.affiliation" clearable placeholder="所属单位">
                                            <el-option :value="requestParams.affiliation" style="height: auto;width: 200px">
                                                <el-tree :data="treeOptionList" :props="defaultProps" @node-click="saveAffiliation"></el-tree>
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-date-picker
                                                value-format="yyyy-MM-dd"
                                                size="small"
                                                v-model="requestParams.date"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input size="small" v-model="requestParams.server" placeholder="服务单位"></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input size="small" v-model="requestParams.query" placeholder="巡检编号"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="7">
                                <el-button @click="getDetectOrderList" type="danger" size="small" class="modify">
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
                        ref="detectTableRef"
                        :data="detectOrderList"
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
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="orderIndex"
                            label="巡检编号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="detectDate"
                            label="巡检日期"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="server"
                            label="服务单位"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="detectMember"
                            label="巡检人员"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="relateOrder"
                            label="关联工单"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="备注"
                            width="140">
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
                detectOrderList:[],
                requestParams:{
                    "page":1,
                    "size":20,
                    "query":"",
                    "date":"",
                    "affiliation":'',
                    'server':'',
                },
                emptyMessage:'未找到匹配记录',
                pagination:{
                    total:0,
                    pagenum:1
                },
                treeOptionList:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
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
            async getDetectOrderList(){
                console.log(this.requestParams);
                const {data:res}=await this.$http.get("order/detect",{params:this.requestParams});
                if(res.meta.code!==200)
                    return this.$message.error(res.meta.message);
                this.detectOrderList = res.data.data;
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
            this.getDetectOrderList();
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
