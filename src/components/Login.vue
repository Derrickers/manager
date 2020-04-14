<template>
    <div class="login-background" :style="loginBackground">
        <div class="loginForm-box">
            <div :style="loginFormHeader" class="login-form-header"></div>
            <el-form class="loginForm" :model="loginForm" status-icon :rules="loginFormRules" ref="loginFormRef">
                <el-row>
                    <el-col :span="2">
                        <i class="el-icon-user"></i>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item prop="username">
                            <el-input v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="2">
                        <i class="el-icon-lock"></i>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item prop="password">
                            <el-input type="password" v-model="loginForm.password" autocomplete="off"
                                      placeholder="请输入密码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="2">
                        <i class="el-icon-key"></i>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item prop="verifyCode">
                            <el-input v-model="loginForm.verifyCode" autocomplete="off" placeholder="请输入验证码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" class="checkCode-box">
                        <div @click="refreshCode" style="margin-top: 5px">
                            <s-identify :identify-code="checkCode"></s-identify>
                        </div>
                    </el-col>
                </el-row>

                <el-form-item>
                    <el-button type="danger" @click="submitForm()">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import SIdentify from "@/components/utils/SIdentify";

    export default {
        components: {SIdentify},
        data() {
            var checkUsername = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请输入用户名'));
                }
                callback();
            };
            var checkPassword = function (rule, value, callback) {
                if (!value) {
                    callback(new Error('请输入密码'));
                }
                callback();
            };
            var checkVerifyCode = function (that) {
                return (rules, val, callback) => {
                    val = val + '';
                    let s = that.checkCode;
                    s = s + '';
                    if (val === '') {
                        callback(new Error('请输入验证码'));
                    } else if (s === val.toUpperCase()) {
                        callback();
                    }
                    callback(new Error('验证码不正确'));
                };
            }
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456',
                    verifyCode: ''
                },
                checkCode: '',
                checkCodes: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                loginFormRules: {
                    username: [
                        {validator: checkUsername, trigger: 'blur'}
                    ],
                    password: [
                        {validator: checkPassword, trigger: 'blur'}
                    ],
                    verifyCode: [
                        {validator: checkVerifyCode(this), trigger: 'blur'}
                    ]
                },
                loginBackground:{
                    'background-image':'url('+require('../assets/img/login-mid.png')+')'
                },
                loginFormHeader:{
                    'background-image':'url('+require('../assets/img/logo.jpg')+')'
                }
            }
        },
        methods: {
            submitForm: function () {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) {
                        this.$message.error("登陆失败")
                        return;
                    }
                    const {data: res} = await this.$http.post('login', this.loginForm);
                    console.log(res);
                    if (res.meta.code !== 200)
                        return this.$message.error(res.meta.message)
                    window.sessionStorage.setItem("token", res.data.token);
                    this.$router.push('/home')
                });
            },
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            },
            refreshCode() {
                this.checkCode = '';
                this.makeCode(this.checkCode, 5);
            },
            makeCode(o, l) {
                for (let i = 0; i < l; i++) {
                    this.checkCode += this.checkCodes[this.randomNum(0, this.checkCodes.length)]
                }
                this.loginForm.verifyCode = this.checkCode;
            }
        },
        mounted() {
            this.checkCode = '';
            this.makeCode(this.checkCode, 5);
        }
    }
</script>

<style lang="less" scoped>
    .login-background{
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: 1920px;
        background-repeat: no-repeat;
        background-position: 50%;
    }
    .login-form-header{
        position: absolute;
        transform: translateY(-20%);
        background-size: 300px;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
    }
    .loginForm-box {
        position: absolute;
        width: 320px;
        height: 420px;
        top: 50%;
        transform: translateY(-35%);
        right: 16%;
        text-align: center;
    }

    .el-button {
        background-color: #df5749;
        width: 100%;
    }
    i{
        color: rgb(115,180,255);
        font-size: 22px;
        margin-top: 15px;
        margin-right: 3px;
    }
</style>
