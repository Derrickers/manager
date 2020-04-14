<template>
    <div @keydown.enter="getDeviceErrorCodeList">
        <div>
            <el-row>
                <el-col :span="9">
                    <h1>设备故障管理</h1>
                </el-col>
                <el-col :span="15">
                    <div class="search-box">
                        <el-row>
                            <el-col :span="16">
                                <el-row>
                                    <el-col :span="8">
                                        <el-select size="small" v-model="requestParams.classification" clearable
                                                   placeholder="设备分类">
                                            <el-option :value="requestParams.classification"
                                                       style="height: auto;width: 200px">
                                                <el-tree :data="treeOptionList" :props="defaultProps"
                                                         @node-click="saveClassification"></el-tree>
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input size="small" v-model="requestParams.code"
                                                  placeholder="设备故障代码"></el-input>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input size="small" v-model="requestParams.query"
                                                  placeholder="设备故障描述"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="8">
                                <el-button @click="getDeviceErrorCodeList" type="danger" size="small" class="modify">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button @click="clearSearchParam" type="danger" size="small">
                                    <i class="el-icon-delete"></i>
                                    <span>清空</span>
                                </el-button>
                                <el-button @click="newErrorCodeVisible=true" type="success" size="small">
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
                        ref="deviceErrorCodeTableRef"
                        :data="deviceErrorCodeList"
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
                            prop="classification"
                            label="设备类型名称"
                            width="260">
                    </el-table-column>
                    <el-table-column
                            prop="errorCode"
                            label="设备故障代码"
                            width="260">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            label="设备故障描述"
                            width="260">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            width="120">
                    </el-table-column>
                    <el-table-column width="160px" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    class="modify"
                                    @click="modifyErrorCode(scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                            >删除
                            </el-button>
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
        <el-dialog
                title="新增设备故障基本信息"
                :visible.sync="newErrorCodeVisible"
                width="32%"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="newErrorCodeForm" ref="newErrorCodeFormRef" label-width="140px"
                             :rules="newErrorCodeFormRules" class="modifyPassForm">
                        <el-form-item
                                label="设备类型"
                                prop="classification">
                            <el-select style="width: 220px" size="small" v-model="newErrorCodeForm.classification" clearable
                                       placeholder="设备分类">
                                <el-option :value="newErrorCodeForm.classification"
                                           style="height: auto;width: 200px">
                                    <el-tree :data="treeOptionList" :props="defaultProps"
                                             @node-click="saveNewClassification"></el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="设备故障代码"
                                prop="errorCode">
                            <el-input style="width: 220px" size="small" v-model="newErrorCodeForm.errorCode" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="设备故障描述"
                                prop="description">
                            <el-input style="width: 220px" size="small" v-model="newErrorCodeForm.description" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyPassDialogVisible = false">取 消</el-button>
                <el-button size="small" type="danger" @click="submitNewErrorCode">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="设备故障基本信息编辑"
                :visible.sync="modifyErrorCodeVisible"
                width="32%"
                @close="modifyDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="modifyErrorCodeForm" ref="modifyErrorCodeFormRef" label-width="140px"
                             :rules="newErrorCodeFormRules">
                        <el-form-item
                                label="设备类型"
                                prop="classification">
                            <el-select style="width: 220px" size="small" v-model="modifyErrorCodeForm.classification" clearable
                                       placeholder="设备分类">
                                <el-option :value="modifyErrorCodeForm.classification"
                                           style="height: auto;width: 200px">
                                    <el-tree :data="treeOptionList" :props="defaultProps"
                                             @node-click="saveNewClassification"></el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="设备故障代码"
                                prop="errorCode">
                            <el-input style="width: 220px" size="small" v-model="modifyErrorCodeForm.errorCode" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="设备故障描述"
                                prop="description">
                            <el-input style="width: 220px" size="small" v-model="modifyErrorCodeForm.description" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyDialogClose">关 闭</el-button>
                <el-button size="small" type="danger" @click="submitModifyErrorCode">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                deviceErrorCodeList: [],
                requestParams: {
                    "page": 1,
                    "size": 20,
                    "query": "",
                    "code": "",
                    'classification': '',
                },
                emptyMessage: '未找到匹配记录',
                pagination: {
                    total: 0,
                    pagenum: 1
                },
                treeOptionList: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                newErrorCodeVisible:false,
                modifyErrorCodeVisible:false,
                newErrorCodeForm:{
                    classification:'',
                    errorCode:'',
                    description:''
                },
                modifyErrorCodeForm:{
                    id:0,
                    classification:'',
                    errorCode:'',
                    description:''
                },
                newErrorCodeFormRules: {
                    errorCode: [
                        {required: true, message: '请输入故障代码', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入故障描述', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
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
            clearSearchParam() {
                this.requestParams.query = '';
                this.requestParams.code = '';
                this.requestParams.classification = '';
            },
            changePageSize(val) {
                this.requestParams.size = val;
            },
            changeCurrentPage(val) {
                this.requestParams.page = val;
            },
            async getDeviceErrorCodeList() {
                const {data: res} = await this.$http.get("device/errorCode", {params: this.requestParams});
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.deviceErrorCodeList = res.data.data;
                this.pagination.pagenum = res.data.pagenum;
                this.pagination.total = res.data.total;
            },
            async getTreeOptionList() {
                const {data: res} = await this.$http.get("tree/deviceClassification");
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.treeOptionList = res.data;
            }
            ,
            saveClassification(val) {
                if(!val.children)
                    this.requestParams.classification = val.label;
            },
            saveNewClassification(val){
                if(!val.children)
                    this.newErrorCodeForm.classification = val.label;
            },
            async submitNewErrorCode(){
                const {data:res} = await this.$http.post("/device/newErrorCode",this.newErrorCodeForm);
                if(res.meta.code!==200)
                    return this.$message.error(res.meta.message);
                this.newErrorCodeVisible=false;
                this.getDeviceErrorCodeList();
                this.clearErrorCodeForm();
            },
            async submitModifyErrorCode(){
                const {data:res} = await this.$http.post("/device/modifyErrorCode",this.modifyErrorCodeForm);
                if(res.meta.code!==200)
                    this.$message.error(res.meta.message);
                this.modifyDialogClose()
            },
            clearErrorCodeForm(){
                this.newErrorCodeForm.description = '';
                this.newErrorCodeForm.errorCode = '';
                this.newErrorCodeForm.classification = '';
            },
            modifyErrorCode(row){
                this.modifyErrorCodeVisible=true;
                this.modifyErrorCodeForm.id = row.id;
                this.modifyErrorCodeForm.classification = row.classification;
                this.modifyErrorCodeForm.description = row.description;
                this.modifyErrorCodeForm.errorCode=row.errorCode;
            },
            modifyDialogClose(){
                this.getDeviceErrorCodeList();
                this.modifyErrorCodeVisible=false;
                this.clearErrorCodeForm();
            }
        },
        created() {
            this.getDeviceErrorCodeList();
            this.getTreeOptionList();
        }
    }
</script>

<style lang="less" scoped>
    h1 {
        border-left: #df5749 4px solid;
        padding-left: 8px;
    }

    .el-table {
        border: 1px solid #dee2e6;
        border-radius: 5px;
    }

    .modify {
        color: white;
        background-color: #df5749;
    }

    .search-box {
        padding-top: 23px;

        .el-select {
            width: 150px;
        }

        .el-input {
            width: 150px;
        }
    }

    .pagination-box {
        position: absolute;
        right: 10px;
    }

    .el-select-dropdown__item.hover {
        background-color: white;
    }

</style>
