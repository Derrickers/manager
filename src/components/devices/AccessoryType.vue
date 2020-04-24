<template>
    <div @keydown.enter="getDeviceClassificationList">
        <div>
            <el-row>
                <el-col :span="6">
                    <h1>设备分类管理</h1>
                </el-col>
                <el-col :span="18">
                    <div class="search-box">
                        <el-row>
                            <el-col :span="17">
                                <el-row>
                                    <el-col :span="6">
                                        <el-select size="small" v-model="requestParams.classification" clearable
                                                   placeholder="设备分类">
                                            <el-option :value="requestParams.classification"
                                                       style="height: auto;width: 200px">
                                                <el-tree :data="treeOptionList" :props="defaultProps"
                                                         @node-click="saveClassification"></el-tree>
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input size="small" v-model="requestParams.code"
                                                  placeholder="设备类型编号"></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input size="small" v-model="requestParams.query"
                                                  placeholder="设备类型名称"></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input size="small" v-model="requestParams.level"
                                                  placeholder="设备类型层级"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="7">
                                <el-button @click="getDeviceClassificationList" type="danger" size="small" class="modify">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button @click="clearSearchParam" type="danger" size="small">
                                    <i class="el-icon-delete"></i>
                                    <span>清空</span>
                                </el-button>
                                <el-button @click="newClassificationVisible=true" type="success" size="small">
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
                        ref="deviceClassificationTableRef"
                        :data="deviceClassificationList"
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
                            width="40"
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
                            width="300">
                    </el-table-column>
                    <el-table-column
                            prop="classificationCode"
                            label="设备类型编号"
                            width="310">
                    </el-table-column>
                    <el-table-column
                            prop="level"
                            label="设备类型层级"
                            width="300">
                    </el-table-column>
                    <el-table-column width="160px" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    class="modify"
                                    @click="modifyClassification(scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deleteClassification(scope.row)"
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
                :visible.sync="newClassificationVisible"
                width="32%"
                @close="newClassificationDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="newClassificationForm" ref="newClassificationFormRef" label-width="140px"
                             :rules="newClassificationFormRules" class="modifyPassForm">
                        <el-form-item
                                label="设备类型"
                                prop="classification">
                            <el-select style="width: 220px" size="small" v-model="newClassificationForm.classification"
                                       clearable
                                       placeholder="设备分类">
                                <el-option :value="newClassificationForm.classification"
                                           style="height: auto;width: 200px">
                                    <el-tree :data="treeOptionList" :props="defaultProps"
                                             @node-click="saveNewClassification"></el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="设备类型编号"
                                prop="classificationCode">
                            <el-input style="width: 220px" size="small" v-model="newClassificationForm.classificationCode"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="设备类型层级"
                                prop="level">
                            <el-input style="width: 220px" size="small" v-model="newClassificationForm.level"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="newClassificationVisible = false">取 消</el-button>
                <el-button size="small" type="danger" @click="submitNewClassification">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="设备故障基本信息编辑"
                :visible.sync="modifyClassificationVisible"
                width="32%"
                @close="modifyDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="modifyClassificationForm" ref="modifyClassificationFormRef" label-width="140px"
                             :rules="newClassificationFormRules">
                        <el-form-item
                                label="设备类型"
                                prop="classification">
                            <el-select style="width: 220px" size="small" v-model="modifyClassificationForm.classification"
                                       clearable
                                       placeholder="设备分类">
                                <el-option :value="modifyClassificationForm.classification"
                                           style="height: auto;width: 200px">
                                    <el-tree :data="treeOptionList" :props="defaultProps"
                                             @node-click="saveNewClassification"></el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="设备类型编号"
                                prop="classificationCode">
                            <el-input style="width: 220px" size="small" v-model="modifyClassificationForm.classificationCode"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="设备类型层级"
                                prop="level">
                            <el-input style="width: 220px" size="small" v-model="modifyClassificationForm.level"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyDialogClose">关 闭</el-button>
                <el-button size="small" type="danger" @click="submitModifyClassification">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                deviceClassificationList: [],
                requestParams: {
                    "page": 1,
                    "size": 10,
                    "query": "",
                    "code": "",
                    'level':'',
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
                newClassificationVisible: false,
                modifyClassificationVisible: false,
                newClassificationForm: {
                    classification: '',
                    classificationCode: '',
                    level: ''
                },
                modifyClassificationForm: {
                    id: 0,
                    classification: '',
                    classificationCode: '',
                    level:''
                },
                newClassificationFormRules: {
                    classificationCode: [
                        {required: true, message: '请输入故障代码', trigger: 'blur'}
                    ],
                    level: [
                        {required: true, message: '请输入故障描述', trigger: 'blur'},
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
            async getDeviceClassificationList() {
                const {data: res} = await this.$http.get("device/classification", {params: this.requestParams});
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.deviceClassificationList = res.data.data;
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
                this.requestParams.classification = val.label;
            },
            saveNewClassification(val) {
                this.newClassificationForm.classification = val.label;
            },
            async submitNewClassification() {
                this.$refs.newClassificationFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("新增失败")
                        return;
                    }
                    const {data: res} = await this.$http.post("/device/newClassification", this.newClassificationForm);
                    if (res.meta.code !== 200)
                        return this.$message.error(res.meta.message);
                    this.newClassificationVisible=false;
                    this.getDeviceClassificationList();
                });

            },
            async submitModifyClassification() {
                this.$refs.modifyClassificationFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("修改失败")
                        return;
                    }
                    const {data: res} = await this.$http.post("/device/modifyClassification", this.modifyClassificationForm);
                    if (res.meta.code !== 200)
                        this.$message.error(res.meta.message);
                    this.modifyDialogClose()
                });
            },
            async deleteClassification(row) {
                this.$messagebox.confirm('此操作将永久删除该设备分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    const {data:res} = await this.$http.post("/device/deleteClassification",{id:row.id});
                    if(res.meta.code!==200)
                        return this.$message.error(res.meta.message);
                    this.getDeviceClassificationList()
                }).catch(() => {
                });
            },
            modifyClassification(row) {
                this.modifyClassificationVisible = true;
                this.modifyClassificationForm.id = row.id;
                this.modifyClassificationForm.classification = row.classification;
                this.modifyClassificationForm.classificationCode = row.classificationCode;
                this.modifyClassificationForm.level = row.level;
            },
            modifyDialogClose() {
                this.getDeviceClassificationList();
                this.modifyClassificationVisible = false;
                this.modifyClassificationForm.classification='';
                this.modifyClassificationForm.classificationCode='';
                this.modifyClassificationForm.level='';
            },
            newClassificationDialogClose(){
                this.getDeviceClassificationList();
                this.newClassificationVisible=false;
                this.newClassificationForm.classification='';
                this.newClassificationForm.classificationCode='';
                this.newClassificationForm.level='';
            }
        },
        created() {
            this.getDeviceClassificationList();
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
