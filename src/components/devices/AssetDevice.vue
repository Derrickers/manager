<template>
    <div @keydown.enter="getDeviceGoodsList">
        <div>
            <el-row>
                <el-col :span="4">
                    <h1>资产设备设施</h1>
                </el-col>
                <el-col :span="20">
                    <div class="search-box">
                        <el-row>
                            <el-col :span="16">
                                <el-row>
                                    <el-col :span="6">
                                        <el-select size="small" v-model="requestParams.affiliation" clearable
                                                   placeholder="所属单位">
                                            <el-option :value="requestParams.affiliation"
                                                       style="height: auto;width: 200px">
                                                <el-tree :data="affiliationTreeList" :props="defaultProps"
                                                         @node-click="saveAffiliation"></el-tree>
                                            </el-option>
                                        </el-select>
                                    </el-col>
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
                                        <el-input size="small" v-model="requestParams.manufacture"
                                                  placeholder="制造厂家"></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input size="small" v-model="requestParams.deviceName"
                                                  placeholder="设备名称"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="8">
                                <el-button @click="getDeviceGoodsList" type="danger" size="small" class="modify">
                                    <i class="el-icon-search"></i>
                                    <span>查询</span>
                                </el-button>
                                <el-button @click="clearSearchParam" type="danger" size="small">
                                    <i class="el-icon-delete"></i>
                                    <span>清空</span>
                                </el-button>
                                <el-button @click="newAssetDeviceVisible=true" type="success" size="small">
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
                        ref="deviceClassificationTableRef"
                        :data="deviceGoodsList"
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
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="deviceName"
                            label="设备名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="assetCode"
                            label="资产编码"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="classification"
                            label="设备分类"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="count"
                            label="数量"
                            width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.count+scope.row.unit}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="manufacture"
                            label="制造厂家"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="specification"
                            label="规格型号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="productDate"
                            label="出厂日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="useDate"
                            label="投用日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="serviceLife"
                            label="使用年限"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="warrantyDate"
                            label="质保日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="storageLocation"
                            label="存放地点"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="storageCharge"
                            label="保管负责"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="资产状态"
                            width="180">
                    </el-table-column>
                    <el-table-column width="140px" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    class="modify"
                                    @click="modifyGoods(scope.row)"
                            >编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deleteGoods(scope.row)"
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
                title="新增设备基本信息"
                :visible.sync="newAssetDeviceVisible"
                width="45%"
                @close="newAssetDeviceDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="newAssetDeviceForm" ref="newAssetDeviceFormRef" label-width="80px"
                             :rules="AssetDeviceFormRules" class="modifyPassForm">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item
                                        label="资产编码"
                                        prop="assetCode">
                                    <el-input size="mini" v-model="newAssetDeviceForm.assetCode"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="设备名称"
                                        prop="deviceName">
                                    <el-input size="mini" v-model="newAssetDeviceForm.deviceName"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="加油站"
                                        prop="affiliation">
                                    <el-select style="width: 100%" size="mini" v-model="newAssetDeviceForm.affiliation"
                                               clearable
                                               placeholder="设备分类">
                                        <el-option :value="newAssetDeviceForm.affiliation"
                                                   style="height: auto;width: auto">
                                            <el-tree :data="affiliationTreeList" :props="defaultProps"
                                                     @node-click="saveNewAffiliation"></el-tree>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="设备名称"
                                        prop="deviceName">
                                    <el-select style="width: 100%" size="mini"
                                               v-model="newAssetDeviceForm.classification"
                                               clearable
                                               placeholder="设备分类">
                                        <el-option :value="newAssetDeviceForm.classification"
                                                   style="height: auto;width: auto">
                                            <el-tree :data="treeOptionList" :props="defaultProps"
                                                     @node-click="saveNewClassification"></el-tree>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="规格型号"
                                        prop="specification">
                                    <el-input size="mini" v-model="newAssetDeviceForm.specification"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                        label="数量"
                                        prop="count">
                                    <el-input size="mini" v-model="newAssetDeviceForm.count"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                        label="计量单位"
                                        prop="unit">
                                    <el-input size="mini" v-model="newAssetDeviceForm.unit"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="制造厂家" prop="manufacture">
                                    <el-input size="mini" v-model="newAssetDeviceForm.manufacture"
                                              auto-complete="off" placeholder="无法查明的场合填写“不明”"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="出厂日期" prop="productDate">
                                    <el-input size="mini" v-model="newAssetDeviceForm.productDate"
                                              auto-complete="off" placeholder="形如yyyy-mm-dd"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="保管负责" prop="storageCharge">
                                    <el-input size="mini" v-model="newAssetDeviceForm.storageCharge"
                                              auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="投用日期" prop="useDate">
                                    <el-input size="mini" v-model="newAssetDeviceForm.useDate"
                                              auto-complete="off" placeholder="形如yyyy-mm-dd"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                        label="使用年限"
                                        prop="serviceLife">
                                    <el-input size="mini" v-model="newAssetDeviceForm.serviceLife"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                        label="资产状态"
                                        prop="status">
                                    <el-select v-model="newAssetDeviceForm.status" clearable placeholder="资产状态">
                                        <el-option
                                                v-for="item in statusOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="质保日期"
                                        prop="warrantyDate">
                                    <el-input size="mini" v-model="newAssetDeviceForm.warrantyDate"
                                              autocomplete="off" placeholder="形如yyyy-mm-dd"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="newAssetDeviceDialogClose">取 消</el-button>
                <el-button size="small" type="danger" @click="submitNewAssetDevice">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="设备故障基本信息编辑"
                :visible.sync="modifyAssetDeviceVisible"
                width="45%"
                @close="modifyDialogClose"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="modifyAssetDeviceForm" ref="modifyAssetDeviceFormRef" label-width="80px"
                             :rules="AssetDeviceFormRules">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item
                                        label="资产编码"
                                        prop="assetCode">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.assetCode"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="设备名称"
                                        prop="deviceName">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.deviceName"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="加油站"
                                        prop="affiliation">
                                    <el-select style="width: 100%" size="mini" v-model="modifyAssetDeviceForm.affiliation"
                                               clearable
                                               placeholder="设备分类">
                                        <el-option :value="modifyAssetDeviceForm.affiliation"
                                                   style="height: auto;width: auto">
                                            <el-tree :data="affiliationTreeList" :props="defaultProps"
                                                     @node-click="saveNewAffiliation"></el-tree>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="设备名称"
                                        prop="deviceName">
                                    <el-select style="width: 100%" size="mini"
                                               v-model="modifyAssetDeviceForm.classification"
                                               clearable
                                               placeholder="设备分类">
                                        <el-option :value="modifyAssetDeviceForm.classification"
                                                   style="height: auto;width: auto">
                                            <el-tree :data="treeOptionList" :props="defaultProps"
                                                     @node-click="saveNewClassification"></el-tree>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="规格型号"
                                        prop="specification">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.specification"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                        label="数量"
                                        prop="count">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.count"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                        label="计量单位"
                                        prop="unit">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.unit"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="制造厂家" prop="manufacture">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.manufacture"
                                              auto-complete="off" placeholder="无法查明的场合填写“不明”"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="出厂日期" prop="productDate">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.productDate"
                                              auto-complete="off" placeholder="形如yyyy-mm-dd"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="保管负责" prop="storageCharge">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.storageCharge"
                                              auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="投用日期" prop="useDate">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.useDate"
                                              auto-complete="off" placeholder="形如yyyy-mm-dd"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                        label="使用年限"
                                        prop="serviceLife">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.serviceLife"
                                              autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item
                                        label="资产状态"
                                        prop="status">
                                    <el-select v-model="modifyAssetDeviceForm.status" clearable placeholder="资产状态">
                                        <el-option
                                                v-for="item in statusOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item
                                        label="质保日期"
                                        prop="warrantyDate">
                                    <el-input size="mini" v-model="modifyAssetDeviceForm.warrantyDate"
                                              autocomplete="off" placeholder="形如yyyy-mm-dd"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
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
                deviceGoodsList: [],
                requestParams: {
                    "page": 1,
                    "size": 10,
                    "affiliation": "",
                    "manufacture": "",
                    'deviceName': '',
                    'classification': '',
                },
                emptyMessage: '未找到匹配记录',
                pagination: {
                    total: 0,
                    pagenum: 1
                },
                affiliationTreeList: [],
                treeOptionList: [],
                statusOptions:[
                    {
                        value:'在用',
                        label:'在用'
                    },{
                        value:'生产经营用-其他',
                        label:'生产经营用-其他'
                    },{
                        value:'其他原因停用',
                        label:'其他原因停用'
                    },
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                newAssetDeviceVisible: false,
                modifyAssetDeviceVisible: false,
                newAssetDeviceForm: {
                    assetCode: '',
                    classification: '',
                    level: '',
                    deviceName: '',
                    affiliation: '',
                    specification: '',
                    count: 0,
                    unit: '',
                    manufacture: '',
                    productDate:'',
                    useDate:'',
                    storageCharge:'',
                    serviceLife:'',
                    status:'',
                    warrantyDate:''
                },
                modifyAssetDeviceForm: {
                    id: 0,
                    assetCode: '',
                    classification: '',
                    level: '',
                    deviceName: '',
                    affiliation: '',
                    specification: '',
                    count: 0,
                    unit: '',
                    manufacture: '',
                    productDate:'',
                    useDate:'',
                    storageCharge:'',
                    serviceLife:'',
                    status:'',
                    warrantyDate:''
                },
                AssetDeviceFormRules: {
                    assetCode: [
                        {required: true, message: '此处不能为空', trigger: 'blur'}
                    ],
                    deviceName: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],
                    affiliation: [
                        {required: true, message: '此处不能为空', trigger: 'blur'}
                    ],
                    classification: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],
                    specification: [
                        {required: true, message: '此处不能为空', trigger: 'blur'}
                    ],
                    count: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                        {min:0,message: '数量不得小于0',trigger:'blur'}
                    ],
                    unit: [
                        {required: true, message: '此处不能为空', trigger: 'blur'}
                    ],
                    manufacture: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],
                    productDate: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],
                    storageCharge: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],
                    useDate: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],serviceLife: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],status: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],warrantyDate: [
                        {required: true, message: '此处不能为空', trigger: 'blur'},
                    ],
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
                this.requestParams.deviceName = '';
                this.requestParams.classification = '';
                this.requestParams.manufacture = '';
            },
            changePageSize(val) {
                this.requestParams.size = val;
            },
            changeCurrentPage(val) {
                this.requestParams.page = val;
            },
            async getDeviceGoodsList() {
                const {data: res} = await this.$http.get("device/assetDevice", {params: this.requestParams});
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.deviceGoodsList = res.data.data;
                this.pagination.pagenum = res.data.pagenum;
                this.pagination.total = res.data.total;
            },
            async getTreeOptionList() {
                const {data: res} = await this.$http.get("tree/deviceClassification");
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.treeOptionList = res.data;
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
            saveClassification(val) {
                if (!val.children)
                    this.requestParams.classification = val.label;
            },
            saveNewAffiliation(val) {
                if (!val.children)
                    this.newAssetDeviceForm.affiliation = val.label;
            },
            saveNewClassification(val) {
                if (!val.children)
                    this.newAssetDeviceForm.classification = val.label;
            },
            async submitNewAssetDevice() {
                this.$refs.newAssetDeviceFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("新增失败")
                        return;
                    }
                    const {data: res} = await this.$http.post("/device/newAssetDevice", this.newAssetDeviceForm);
                    if (res.meta.code !== 200)
                        return this.$message.error(res.meta.message);
                    this.newAssetDeviceVisible = false;
                    this.getDeviceGoodsList();
                });

            },
            async submitModify() {
                this.$refs.modifyAssetDeviceFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("修改失败")
                        return;
                    }
                    const {data: res} = await this.$http.post("/device/modifyAssetDevice", this.modifyAssetDeviceForm);
                    if (res.meta.code !== 200)
                        this.$message.error(res.meta.message);
                    this.modifyDialogClose()
                });
            },
            async deleteGoods(row) {
                this.$messagebox.confirm('此操作将永久删除该设备分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.post("/device/deleteAssetDevice", {id: row.id});
                    if (res.meta.code !== 200)
                        return this.$message.error(res.meta.message);
                    this.getDeviceGoodsList()
                }).catch(() => {
                });
            },
            modifyGoods(row) {
                this.modifyAssetDeviceVisible = true;
                this.modifyAssetDeviceForm.id = row.id;
                this.modifyAssetDeviceForm.affiliation = row.affiliation;
                this.modifyAssetDeviceForm.deviceName = row.deviceName;
                this.modifyAssetDeviceForm.assetCode = row.assetCode;
                this.modifyAssetDeviceForm.classification = row.classification;
                this.modifyAssetDeviceForm.specification = row.specification;
                this.modifyAssetDeviceForm.count = row.count;
                this.modifyAssetDeviceForm.unit = row.unit;
                this.modifyAssetDeviceForm.manufacture = row.manufacture;
                this.modifyAssetDeviceForm.productDate = row.productDate;
                this.modifyAssetDeviceForm.storageCharge = row.storageCharge;
                this.modifyAssetDeviceForm.useDate = row.useDate;
                this.modifyAssetDeviceForm.serviceLife = row.serviceLife;
                this.modifyAssetDeviceForm.status = row.status;
                this.modifyAssetDeviceForm.warrantyDate = row.warrantyDate;
            },
            modifyDialogClose() {
                this.getDeviceGoodsList();
                this.modifyAssetDeviceVisible = false;
                this.$refs.modifyAssetDeviceFormRef.resetField();
            },
            newAssetDeviceDialogClose() {
                this.getDeviceGoodsList();
                this.newAssetDeviceVisible = false;
                this.$refs.newAssetDeviceFormRef.resetField();
            }
        },
        created() {
            this.getDeviceGoodsList();
            this.getTreeOptionList();
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
