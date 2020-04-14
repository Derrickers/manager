<template>
    <div class="s-canvas">
        <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
    </div>
</template>
<script>
    export default {
        name: 'SIdentify',
        props: {
            identifyCode: {
                type: String,
                default: '1234'
            },
            fontSizeMin: {
                type: Number,
                default: 10
            },
            fontSizeMax: {
                type: Number,
                default: 28
            },
            backgroundColorMin: {
                type: Number,
                default: 180
            },
            backgroundColorMax: {
                type: Number,
                default: 240
            },
            colorMin: {
                type: Number,
                default: 50
            },
            colorMax: {
                type: Number,
                default: 160
            },
            contentWidth: {
                type: Number,
                default: 100
            },
            contentHeight: {
                type: Number,
                default: 28
            }
        },
        methods: {
            // 生成一个随机数
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min)
            },
            // 生成一个随机的颜色
            randomColor(min, max) {
                var r = this.randomNum(min, max)
                var g = this.randomNum(min, max)
                var b = this.randomNum(min, max)
                return 'rgb(' + r + ',' + g + ',' + b + ')'
            },
            drawPic() {
                var canvas = document.getElementById('s-canvas')
                var ctx = canvas.getContext('2d')
                ctx.textBaseline = 'bottom'
                // 绘制背景
                ctx.fillStyle = this.randomColor(
                    this.backgroundColorMin,
                    this.backgroundColorMax
                )
                ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
                // 绘制文字
                for (let i = 0; i < this.identifyCode.length; i++) {
                    this.drawText(ctx, this.identifyCode[i], i)
                }
            },
            drawText(ctx, txt, i) {
                ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
                ctx.font =
                    this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
                var x = (i + 1) * (this.contentWidth / (this.identifyCode.length+1))
                var y = this.randomNum(this.fontSizeMax, this.contentHeight-5)
                // 修改坐标原点和旋转角度
                ctx.translate(x, y)
                ctx.fillText(txt, 0, 0)
                // 恢复坐标原点和旋转角度
                ctx.translate(-x, -y)
            },
        },
        watch: {
            identifyCode() {
                this.drawPic()
            }
        },
        mounted() {
            this.drawPic()
        }
    }
</script>
