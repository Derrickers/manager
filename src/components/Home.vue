<template>
    <div>
        <el-container class="home-container">
            <!--            页头-->
            <el-header height="74px">
                <div class="home-header-left">
                    <img src="../assets/img/logo.png" alt="">
                    <span>加油站设备管理云平台</span>
                </div>
                <div class="home-header-right">
                    <span @click="showModifyPassDialog">
                        <el-icon class="el-icon-user-solid" style="margin-right: 8px"></el-icon>
                        <span>{{user.username}}</span>
                    </span>
                    <span @click="logout">
                        <el-icon class="el-icon-switch-button" style="margin-right: 8px"></el-icon>
                        <span>登出</span>
                    </span>
                </div>
            </el-header>
            <el-container>
                <el-aside width="209px" style="border-right: 1px solid silver;">
                    <el-menu
                            :router="true"
                            :collapse="isCollapse"
                            :default-active="activeIndex"
                            background-color="#fafafa"
                            text-color="#848484"
                            unique-opened>
                        <el-menu-item index="/welcome" key="0" @click="saveNavState('/welcome')">
                            <i class="el-icon-s-data"></i>
                            <span slot="title">首页统计</span>
                        </el-menu-item>
                        <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                            <template slot="title">
                                <i :class="iconList[item.id]"></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                                          @click="saveNavState('/'+subItem.path)">
                                <template slot="title">
                                    <i class="el-icon-document"></i>
                                    <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog
                title="修改密码"
                :visible.sync="modifyPassDialogVisible"
                width="40%"
        >
            <div class="modify-card-box">
                <el-card class="box-card">
                    <el-form :model="modifyPassForm" ref="modifyPassFormRef" label-width="140px"
                             :rules="modifyPassFormRules" class="modifyPassForm">
                        <el-form-item
                                label="请输入当前密码"
                                prop="oldPass">
                            <el-input type="password" v-model="modifyPassForm.oldPass" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="输入新密码"
                                prop="newPass">
                            <el-input type="password" v-model="modifyPassForm.newPass" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="再次输入新密码"
                                prop="dupNewPass">
                            <el-input type="password" v-model="modifyPassForm.dupNewPass" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyPassDialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="submitModifyPass">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            var checkNewPass = (rule, value, callback) => {
                if (value === this.modifyPassForm.oldPass)
                    callback(new Error("新密码不能与旧密码相同"))
                callback();
            };
            var checkDupNewPass = (rule, value, callback) => {
                if (value !== this.modifyPassForm.newPass)
                    callback(new Error("两次输入密码不相同"))
                callback();
            };
            return {
                user: {
                    username: '测试',
                },
                activeIndex: '1',
                menulist: [],
                isCollapse: false,
                iconList: {
                    '1': 'el-icon-share',
                    '2': 'el-icon-s-goods',
                    '3': 'el-icon-s-order',
                    '4': 'el-icon-s-tools'
                },
                modifyPassDialogVisible: false,
                modifyPassForm: {
                    oldPass: '',
                    newPass: '',
                    dupNewPass: '',
                },
                modifyPassFormRules: {
                    'oldPass': [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    'newPass': [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 22, message: '新密码长度为6-22个字符之间', trigger: 'blur'},
                        {validator: checkNewPass, trigger: 'blur'}

                    ],
                    'dupNewPass': [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: checkDupNewPass, trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            let jwtcode = this.$jwt.decode(window.sessionStorage.getItem('token'));
            this.setUsername(jwtcode.username);
            this.getMenuList();
            this.activeIndex = window.sessionStorage.getItem('activeIndex');
        },
        methods: {
            logout: function () {
                window.sessionStorage.removeItem('token');
                window.sessionStorage.removeItem('activeIndex');
                this.$router.push('/login');
            },
            getMenuList: async function () {
                const {data: res} = await this.$http.get('menus');
                if (res.meta.code !== 200)
                    return this.$message.error(res.meta.message);
                this.menulist = res.data;
            },
            saveNavState: function (index) {
                this.activeIndex = index;
                window.sessionStorage.setItem('activeIndex', index);
            },
            setUsername: function (name) {
                this.user.username = name;
            },
            showModifyPassDialog() {
                this.modifyPassDialogVisible = true;
            },
            submitModifyPass(){
                this.$refs.modifyPassFormRef.validate(async valid =>{
                    if(!valid){
                        return this.$message.error("密码不符合规则");
                    }
                    const {data:res} = await this.$http.post("users/modifyPass",this.modifyPassForm);
                    if(res.meta.code!==200){
                        return this.$message.error(res.meta.message);
                    }
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #df5749;
        width: 100%;

        .home-header-left {
            display: flex;
            align-items: center;
            font-size: 20px;
            font-weight: bold;

            span {
                margin-left: 20px;
                text-shadow: white 2px 2px 2px;
            }

            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }

        .home-header-right {
            color: white;
            display: flex;
            align-items: center;
            font-size: 17px;
            font-weight: bold;
            right: 0;

            span {
                cursor: pointer;
                margin-right: 18px;
            }
        }
        .el-main{
            height: 100%;
            background-color: #f7f7f7;
        }
        .modify-card-box {
            border: 1px solid grey;
        }

    }
</style>
