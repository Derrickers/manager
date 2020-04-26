<template>
    <div @keydown.enter="getAccessoryDeviceList">
        <div>
            <el-row>
                <el-col :span="8">
                    <h1>配件设施</h1>
                </el-col>
                <el-col :span="16">
                    <div class="search-box">
                        <el-row>
                            <el-col :span="14">
                                <el-row>
                                    <el-col :span="8">
                                        <el-select size="small" v-model="requestParams.affiliation" clearable
                                                   placeholder="所属单位">
                                            <el-option :value="requestParams.affiliation"
                                                       style="height: auto;width: 200px">
                                                <el-tree :data="affiliationTreeList" :props="defaultProps"
                                                         @node-click="saveAffiliation"></el-tree>
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-select size="small" v-model="requestParams.accessoryType" clearable
                                                   placeholder="配件类型">
                                            <el-option
                                                    v-for="item in accessoryTypeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-input size="small" v-model="requestParams.accessoryName"
                                                  placeholder="配件名称"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="10">
                                <el-button @click="getAccessoryDeviceList" type="danger" size="small" class="modify">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button @click="clearSearchParam" type="danger" size="small">
                                    <i class="el-icon-delete"></i>
                                    <span>清空</span>
                                </el-button>
                                <el-button @click="newAccessoryDeviceVisible=true" type="success" size="small">
                                    <i class="el-icon-plus"></i>
                                    <span>新增</span>
                                </el-button>
                                <el-button type="success" size="small">
                                    <i class="el-icon-plus"></i>
                                    <span>导入</span>
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
                        ref="accessoryDeviceListTableRef"
                        :data="accessoryDeviceList"
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
                            prop="affiliation"
                            label="所属单位"
                            width="280">
                    </el-table-column>
                    <el-table-column
                            prop="affiliateDevice"
                            label="所属设备"
                            width="220">
                    </el-table-column>
                    <el-table-column
                            prop="accessoryName"
                            label="配件名称"
                            width="220">
                    </el-table-column>
                    <el-table-column
                            prop="accessoryType"
                            label="配件类型"
                            width="220">
                    </el-table-column>
                    <el-table-column width="140px" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    class="modify"
                                    @click="modifyAccessoryDevice(scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deleteAccessoryDevice(scope.row)"
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
                title="新增配件设施基本信息"
                :visible.sync="newAccessoryDeviceVisible"
                width="32%"
                @close="newDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="newAccessoryDeviceForm" ref="newAccessoryDeviceFormRef" label-width="140px"
                             :rules="AccessoryDeviceFormRules" class="modifyPassForm">
                        <el-form-item
                                label="加油站"
                                prop="affiliation">
                            <el-select style="width: 80%" size="mini" v-model="newAccessoryDeviceForm.affiliation"
                                       clearable
                                       placeholder="所属单位">
                                <el-option :value="newAccessoryDeviceForm.affiliation"
                                           style="height: auto;width: auto">
                                    <el-tree :data="affiliationTreeList" :props="defaultProps"
                                             @node-click="saveNewAffiliation"></el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="设备名称"
                                prop="affiliateDevice">
                            <el-select style="width: 80%" size="mini" v-model="newAccessoryDeviceForm.affiliateDevice" clearable placeholder="设备名称">
                                <el-option
                                        v-for="item in affiliateDeviceOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="配件类型"
                                prop="accessoryType">
                            <el-select style="width: 80%" size="mini" v-model="newAccessoryDeviceForm.accessoryType" clearable placeholder="配件类型">
                                <el-option
                                        v-for="item in accessoryTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="配件名称"
                                prop="accessoryName">
                            <el-input style="width: 80%" size="mini" v-model="newAccessoryDeviceForm.accessoryName"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="newDialogClose">取 消</el-button>
                <el-button size="small" type="danger" @click="submitNewAccessoryDevice">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="配件设施基本信息编辑"
                :visible.sync="modifyAccessoryDeviceVisible"
                width="32%"
                @close="modifyDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="modifyAccessoryDeviceForm" ref="modifyAccessoryDeviceFormRef" label-width="140px"
                             :rules="AccessoryDeviceFormRules">
                        <el-form-item
                                label="加油站"
                                prop="affiliation">
                            <el-select style="width: 80%" size="mini" v-model="modifyAccessoryDeviceForm.affiliation"
                                       clearable
                                       placeholder="设备分类">
                                <el-option :value="modifyAccessoryDeviceForm.affiliation"
                                           style="height: auto;width: auto">
                                    <el-tree :data="affiliationTreeList" :props="defaultProps"
                                             @node-click="saveModifyAffiliation"></el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="设备名称"
                                prop="affiliateDevice">
                            <el-select style="width: 80%" size="mini" v-model="modifyAccessoryDeviceForm.affiliateDevice" clearable placeholder="设备名称">
                                <el-option
                                        v-for="item in affiliateDeviceOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="配件类型"
                                prop="accessoryType">
                            <el-select style="width: 80%" size="mini" v-model="modifyAccessoryDeviceForm.accessoryType" clearable placeholder="配件类型">
                                <el-option
                                        v-for="item in accessoryTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="配件名称"
                                prop="accessoryName">
                            <el-input style="width: 80%" size="mini" v-model="modifyAccessoryDeviceForm.accessoryName"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyDialogClose">关 闭</el-button>
                <el-button size="small" type="danger" @click="submitModify">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                accessoryDeviceList: [],
                requestParams: {
                    "page": 1,
                    "size": 10,
                    "affiliation": "",
                    "accessoryName": "",
                    'accessoryType': '',
                },
                emptyMessage: '未找到匹配记录',
                pagination: {
                    total: 0,
                    pagenum: 1
                },
                affiliationTreeList: [],
                accessoryTypeOptions: [
                    {
                        value:'油枪',
                        label:'油枪'
                    },
                    {
                        value: '油枪2',
                        label:'油枪2'
                    }
                ],
                affiliateDeviceOptions:[
                    {
                        value:'5号加油机',
                        label:'5号加油机'
                    },{
                        value:'1号加油机',
                        label:'1号加油机'
                    },{
                        value:'2号加油机',
                        label:'2号加油机'
                    },{
                        value:'3号加油机',
                        label:'3号加油机'
                    },{
                        value:'4号加油机',
                        label:'4号加油机'
                    },{
                        value:'测试机',
                        label:'测试机'
                    },{
                        value:'6号加油机',
                        label:'6号加油机'
                    },{
                        value:'其他油气设备设施',
                        label:'其他油气设备设施'
                    },{
                        value:'测试',
                        label:'测试'
                    },{
                        value:'挂式空调',
                        label:'挂式空调'
                    },{
                        value:'立式空调',
                        label:'立式空调'
                    },{
                        value:'液晶电视',
                        label:'液晶电视'
                    },{
                        value:'台式电脑',
                        label:'台式电脑'
                    },{
                        value:'税控收款机',
                        label:'税控收款机'
                    },{
                        value:'微型电子计算机',
                        label:'微型电子计算机'
                    },{
                        value:'打印机',
                        label:'打印机'
                    },{
                        value:'电缆',
                        label:'电缆'
                    },{
                        value:'路由器',
                        label:'路由器'
                    },{
                        value:'交换机',
                        label:'交换机'
                    },{
                        value:'电子计算机其他设备',
                        label:'电子计算机其他设备'
                    },
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                newAccessoryDeviceVisible: false,
                modifyAccessoryDeviceVisible: false,
                newAccessoryDeviceForm: {
                    affiliation:'',
                    affiliateDevice:'',
                    accessoryType:'',
                    accessoryName:''
                },
                modifyAccessoryDeviceForm: {
                    id: 0,
                    affiliation:'',
                    affiliateDevice:'',
                    accessoryType:'',
                    accessoryName:''
                },
                AccessoryDeviceFormRules: {
                    affiliation: [
                        {required: true, message: '此处不能为空', trigger: 'blur'}
                    ],
                    affiliateDevice: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],
                    accessoryType: [
                        {required: true, message: '此处不能为空', trigger: 'blur'}
                    ],
                    accessoryName: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
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
                this.requestParams.affiliation = '';
                this.requestParams.accessoryType = '';
                this.requestParams.accessoryName = '';
            },
            changePageSize(val) {
                this.requestParams.size = val;
            },
            changeCurrentPage(val) {
                this.requestParams.page = val;
            },
            async getAccessoryDeviceList() {
                const {data: res} = await this.$http.get("device/accessoryDevice", {params: this.requestParams});
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.accessoryDeviceList = res.data.data;
                this.pagination.pagenum = res.data.pagenum;
                this.pagination.total = res.data.total;
            },
            async getAffiliationTree() {
                const {data: res} = await this.$http.get("tree/affiliation");
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.affiliationTreeList = res.data;
            },
            saveAffiliation(val) {
                if (!val.children)
                    this.requestParams.affiliation = val.label;
            },
            saveNewAffiliation(val) {
                if (!val.children)
                    this.newAccessoryDeviceForm.affiliation = val.label;
            },
            saveModifyAffiliation(val){
                if (!val.children)
                    this.modifyAccessoryDeviceForm.affiliation = val.label;
            },
            async submitNewAccessoryDevice() {
                this.$refs.newAccessoryDeviceFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("新增失败")
                        return;
                    }
                    const {data: res} = await this.$http.post("/device/newAccessoryDevice", this.newAccessoryDeviceForm);
                    if (res.meta.code !== 200)
                        return this.$message.error(res.meta.message);
                    this.newAccessoryDeviceVisible = false;
                    this.getAccessoryDeviceList();
                });

            },
            async submitModify() {
                this.$refs.modifyAccessoryDeviceFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("修改失败")
                        return;
                    }
                    const {data: res} = await this.$http.post("/device/modifyAccessoryDevice", this.modifyAccessoryDeviceForm);
                    if (res.meta.code !== 200)
                        this.$message.error(res.meta.message);
                    this.modifyDialogClose()
                });
            },
            async deleteAccessoryDevice(row) {
                this.$messagebox.confirm('此操作将永久删除该设备分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.post("/device/deleteAccessoryDevice", {id: row.id});
                    if (res.meta.code !== 200)
                        return this.$message.error(res.meta.message);
                    this.getAccessoryDeviceList()
                }).catch(() => {
                });
            },
            modifyAccessoryDevice(row) {
                this.modifyAccessoryDeviceVisible = true;
                this.modifyAccessoryDeviceForm.id = row.id;
                this.modifyAccessoryDeviceForm.affiliation = row.affiliation;
                this.modifyAccessoryDeviceForm.affiliateDevice = row.affiliateDevice;
                this.modifyAccessoryDeviceForm.accessoryName = row.accessoryName;
                this.modifyAccessoryDeviceForm.accessoryType = row.accessoryType;
            },
            modifyDialogClose() {
                this.getAccessoryDeviceList();
                this.modifyAccessoryDeviceVisible = false;
                this.$refs.modifyAccessoryDeviceFormRef.resetFields();
            },
            newDialogClose() {
                this.getAccessoryDeviceList();
                this.newAccessoryDeviceVisible = false;
                this.$refs.newAccessoryDeviceFormRef.resetFields();
            }
        },
        created() {
            this.getAccessoryDeviceList();
            this.getAffiliationTree();
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
