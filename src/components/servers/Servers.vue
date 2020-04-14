<template>
    <div @keydown.enter="getServersList">
        <div>
            <el-row>
                <el-col :span="12">
                    <h1>服务商信息</h1>
                </el-col>
                <el-col :span="12">
                    <div class="search-box">
                        <el-row>
                            <el-col :span="7">
                                <el-select clearable size="small" v-model="requestParams.type" placeholder="类型">
                                    <el-option
                                            v-for="item in typeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="7" style="padding-right: 5px">
                                <el-input size="small" v-model="requestParams.query" placeholder="服务商名称"></el-input>
                            </el-col>
                            <el-col :span="10">
                                <el-button @click="getServersList" type="danger" size="small" class="modify">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button @click="clearSearchParam" type="danger" size="small">
                                    <i class="el-icon-delete"></i>
                                    <span>清空</span>
                                </el-button>
                                <el-button type="success" size="small">
                                    <i class="el-icon-plus"></i>
                                    <span>新增</span>
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
                        ref="serversTableRef"
                        :data="serversData"
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
                            'font-size':'10px',
                            'color':'black',
                            'text-align':'center',
                        }"
                        :row-style="{
                            'height':'20px'
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
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="identifer"
                            label="服务商编号"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="serverName"
                            label="服务商名称"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="abbreviation"
                            label="简称"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="类型"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="creditCode"
                            label="统一社会信用代码"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="location"
                            label="单位地址"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="present"
                            label="法定代表人"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="registeredCapital"
                            label="注册资本（万元）"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="成立日期"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="manageRange"
                            label="经营范围"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="manageBegintime"
                            label="营业期限（起）"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="manageEndtime"
                            label="营业期限（止）"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="registrar"
                            label="登记机关"
                            width="170">
                    </el-table-column>
                    <el-table-column
                            prop="issueTime"
                            label="颁发日期"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="principal"
                            label="负责人"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="principalContactInfo"
                            label="负责人联系方式"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="leader"
                            label="主管领导"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="leaderContactInfo"
                            label="主管领导联系方式"
                            width="190">
                    </el-table-column>
                    <el-table-column
                            prop="secureLeader"
                            label="安全管理领导"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="secureLeaderContactInfo"
                            label="安全管理领导联系方式"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="secureCode"
                            label="安全生产许可编号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="secureBegintime"
                            label="安全生产许可证日期（开始）"
                            width="260">
                    </el-table-column>
                    <el-table-column
                            prop="secureEndtime"
                            label="安全生产许可证日期（结束）"
                            width="260">
                    </el-table-column>
                    <el-table-column
                            prop="remarks"
                            label="备注"
                            width="140">
                    </el-table-column>
                    <el-table-column width="142px" label="操作" fixed="right">
                        <template>
                            <el-button
                                    size="mini"
                                    class="modify"
                                    type="danger"
                                    >编辑</el-button>
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
                        :page-sizes="[10, 20, 30]"
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
        name: "servers",
        data(){
            return{
                serversData:[],
                requestParams:{
                    "page":1,
                    "size":20,
                    "query":"",
                    "type":""
                },
                typeOptions:[
                    {value:'常规',label:'常规'},
                    {value:'甲供材',label:'甲供材'},
                    {value:'第三方',label:'第三方'},
                ],
                emptyMessage:'未找到匹配记录',
                pagination:{
                    total:0,
                    pagenum:1
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
            async getServersList(){
                const {data:res} = await this.$http.get("servers",{params:this.requestParams});
                if(res.meta.code!==200)
                    return this.$message.error(res.meta.message);
                this.pagination.total=res.data.total;
                this.pagination.pagenum=res.data.pagenum;
                this.serversData = res.data.data;
            },
            clearSearchParam(){
                this.requestParams.query = '';
                this.requestParams.type = '';
            },
            changePageSize(val){
                this.requestParams.size=val;
            },
            changeCurrentPage(val){
                this.requestParams.page=val;
            }
        },
        created(){
            this.getServersList();
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
</style>
