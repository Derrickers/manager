<template>
    <div @keydown.enter="getAccessoryTypeList">
        <div>
            <el-row>
                <el-col :span="12">
                    <h1>配件类型管理</h1>
                </el-col>
                <el-col :span="12">
                    <div class="search-box">
                        <el-row>
                            <el-col :span="14">
                                <el-row>
                                    <el-col :span="12">
                                        <el-select size="small" v-model="requestParams.deviceType" clearable
                                                   placeholder="设备类型">
                                            <el-option
                                                    v-for="item in deviceTypeOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-input size="small" v-model="requestParams.accessoryTypeName"
                                                  placeholder="配件类型名称"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="10">
                                <el-button @click="getAccessoryTypeList" type="danger" size="small" class="modify">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button @click="clearSearchParam" type="danger" size="small">
                                    <i class="el-icon-delete"></i>
                                    <span>清空</span>
                                </el-button>
                                <el-button @click="newAccessoryTypeVisible=true" type="success" size="small">
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
                        ref="accessoryTypeTableRef"
                        :data="accessoryTypeList"
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
                            prop="deviceType"
                            label="设备类型"
                            width="300">
                    </el-table-column>
                    <el-table-column
                            prop="accessoryTypeName"
                            label="配件类型名称"
                            width="310">
                    </el-table-column>
                    <el-table-column
                            prop="accessoryTypeIndex"
                            label="配件类型编号"
                            width="300">
                    </el-table-column>
                    <el-table-column width="160px" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    class="modify"
                                    @click="modifyAccessoryType(scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deleteAccessoryType(scope.row)"
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
                title="新增配件类型基本信息"
                :visible.sync="newAccessoryTypeVisible"
                width="32%"
                @close="newDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="newAccessoryTypeForm" ref="newAccessoryTypeFormRef" label-width="140px"
                             :rules="accessoryTypeFormRules" class="modifyPassForm">
                        <el-form-item
                                label="设备类型"
                                prop="deviceType">
                            <el-select style="width: 220px" size="small" v-model="newAccessoryTypeForm.deviceType"
                                       clearable
                                       placeholder="设备分类">
                                <el-option
                                        v-for="item in deviceTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="配件类型编号"
                                prop="accessoryTypeIndex">
                            <el-input style="width: 220px" size="small"
                                      v-model="newAccessoryTypeForm.accessoryTypeIndex"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="配件类型名称"
                                prop="accessoryTypeName">
                            <el-input style="width: 220px" size="small" v-model="newAccessoryTypeForm.accessoryTypeName"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="newDialogClose">取 消</el-button>
                <el-button size="small" type="danger" @click="submitNewAccessoryType">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="配件类型基本信息编辑"
                :visible.sync="modifyAccessoryTypeVisible"
                width="32%"
                @close="modifyDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="modifyAccessoryTypeForm" ref="modifyAccessoryTypeFormRef" label-width="140px"
                             :rules="accessoryTypeFormRules">
                        <el-form-item
                                label="设备类型"
                                prop="deviceType">
                            <el-select style="width: 220px" size="small"
                                       v-model="modifyAccessoryTypeForm.deviceType"
                                       clearable
                                       placeholder="设备类型">
                                <el-option
                                        v-for="item in deviceTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                                label="配件类型编号"
                                prop="accessoryTypeIndex">
                            <el-input style="width: 220px" size="small"
                                      v-model="modifyAccessoryTypeForm.accessoryTypeIndex"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="配件类型名称"
                                prop="level">
                            <el-input style="width: 220px" size="small" v-model="modifyAccessoryTypeForm.accessoryTypeName"
                                      autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyDialogClose">关 闭</el-button>
                <el-button size="small" type="danger" @click="submitModifyAccessoryType">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                accessoryTypeList: [],
                requestParams: {
                    "page": 1,
                    "size": 10,
                    'accessoryTypeName': '',
                    'deviceType': '',
                },
                emptyMessage: '未找到匹配记录',
                pagination: {
                    total: 0,
                    pagenum: 1
                },
                deviceTypeOptions: [
                    {
                        value: '加油机',
                        label: '加油机'
                    },
                    {
                        value: '油气回收设备',
                        label: '油气回收设备'
                    },
                    {
                        value: '多用途箱柜',
                        label: '多用途箱柜'
                    },
                    {
                        value: '便利店电气设备',
                        label: '便利店电气设备'
                    },
                    {
                        value: '防撞柱杆',
                        label: '防撞柱杆'
                    },
                    {
                        value: '办公用具（非电气类）',
                        label: '办公用具（非电气类）'
                    },
                    {
                        value: '其他办公用具',
                        label: '其他办公用具'
                    },
                    {
                        value: '生活电气设备',
                        label: '生活电气设备'
                    },
                    {
                        value: '给水排水设备',
                        label: '给水排水设备'
                    },
                    {
                        value: '生活家具及用具',
                        label: '生活家具及用具'
                    },
                    {
                        value: '其他生活设施',
                        label: '其他生活设施'
                    },
                    {
                        value: '消防器材',
                        label: '消防器材'
                    },
                    {
                        value: '报警设备',
                        label: '报警设备'
                    },
                    {
                        value: '视频监控',
                        label: '视频监控'
                    },
                    {
                        value: '站房电气设施',
                        label: '站房电气设施'
                    },
                    {
                        value: '站房系统设备',
                        label: '站房系统设备'
                    },
                    {
                        value: '站房其他设备设施',
                        label: '站房其他设备设施'
                    },
                    {
                        value: '广告媒体发布系统',
                        label: '广告媒体发布系统'
                    },
                    {
                        value: '普通广告牌',
                        label: '普通广告牌'
                    },
                    {
                        value: '主标识立牌',
                        label: '主标识立牌'
                    },
                    {
                        value: '办公桌椅箱柜',
                        label: '办公桌椅箱柜'
                    },
                    {
                        value: '便利店其他设备',
                        label: '便利店其他设备'
                    },
                    {
                        value: '配电柜',
                        label: '配电柜'
                    },
                    {
                        value: '安全物品',
                        label: '安全物品'
                    },
                    {
                        value: '发电机',
                        label: '发电机'
                    },
                    {
                        value: '潜油泵',
                        label: '潜油泵'
                    },
                    {
                        value: '液位仪',
                        label: '液位仪'
                    },
                    {
                        value: '安防雷达',
                        label: '安防雷达'
                    },
                    {
                        value: '油罐附件及管线',
                        label: '油罐附件及管线'
                    },
                    {
                        value: '人体静电释放报警仪',
                        label: '人体静电释放报警仪'
                    },
                    {
                        value: '标识标牌',
                        label: '标识标牌'
                    },
                    {
                        value: '配套服务其他辅助设施',
                        label: '配套服务其他辅助设施'
                    }
                ],
                newAccessoryTypeVisible: false,
                modifyAccessoryTypeVisible: false,
                newAccessoryTypeForm: {
                    deviceType: '',
                    accessoryTypeName: '',
                    accessoryTypeIndex: ''
                },
                modifyAccessoryTypeForm: {
                    id: 0,
                    deviceType: '',
                    accessoryTypeName: '',
                    accessoryTypeIndex: ''
                },
                accessoryTypeFormRules: {
                    deviceType: [
                        {required: true, message: '请输入故障代码', trigger: 'blur'}
                    ],
                    accessoryTypeName: [
                        {required: true, message: '请输入故障描述', trigger: 'blur'},
                    ],
                    accessoryTypeIndex: [
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
                this.requestParams.accessoryTypeName = '';
                this.requestParams.deviceType = '';
            },
            changePageSize(val) {
                this.requestParams.size = val;
            },
            changeCurrentPage(val) {
                this.requestParams.page = val;
            },
            async getAccessoryTypeList() {
                const {data: res} = await this.$http.get("device/accessoryType", {params: this.requestParams});
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.accessoryTypeList = res.data.data;
                this.pagination.pagenum = res.data.pagenum;
                this.pagination.total = res.data.total;
            }
            ,
            async submitNewAccessoryType() {
                this.$refs.newAccessoryTypeFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("新增失败")
                        return;
                    }
                    const {data: res} = await this.$http.post("/device/newAccessoryType", this.newAccessoryTypeForm);
                    if (res.meta.code !== 200)
                        return this.$message.error(res.meta.message);
                    this.newAccessoryTypeVisible = false;
                    this.getAccessoryTypeList();
                });

            },
            async submitModifyAccessoryType() {
                this.$refs.modifyAccessoryTypeFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("修改失败")
                        return;
                    }
                    const {data: res} = await this.$http.post("/device/modifyAccessoryType", this.modifyAccessoryTypeForm);
                    if (res.meta.code !== 200)
                        this.$message.error(res.meta.message);
                    this.modifyDialogClose()
                });
            },
            async deleteAccessoryType(row) {
                this.$messagebox.confirm('此操作将永久删除该设备分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.post("/device/deleteAccessoryType", {id: row.id});
                    if (res.meta.code !== 200)
                        return this.$message.error(res.meta.message);
                    this.getAccessoryTypeList()
                }).catch(() => {
                });
            },
            modifyAccessoryType(row) {
                this.modifyAccessoryTypeVisible = true;
                this.modifyAccessoryTypeForm.id = row.id;
                this.modifyAccessoryTypeForm.deviceType = row.deviceType;
                this.modifyAccessoryTypeForm.accessoryTypeIndex = row.accessoryTypeIndex;
                this.modifyAccessoryTypeForm.accessoryTypeName = row.accessoryTypeName;
            },
            modifyDialogClose() {
                this.getAccessoryTypeList();
                this.modifyAccessoryTypeVisible = false;
                this.$refs.modifyAccessoryTypeFormRef.resetFields();
            },
            newDialogClose() {
                this.getAccessoryTypeList();
                this.newAccessoryTypeVisible = false;
                this.$refs.newAccessoryTypeFormRef.resetFields();
            }
        },
        created() {
            this.getAccessoryTypeList();
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
