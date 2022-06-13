
<template>
  <div class="app">
    <div :style="{width:canvasWidth+'px',height:canvasHeight+'px'}" class="canvasBox">
      <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
      <div class="canvasLoading" v-if="isLoading">
        <t-progress theme="circle" :percentage="percent" :size="'large'"></t-progress>
      </div>
    </div>

    <vue-qr :text="qrCon" :callback="test" :bindElement = 'false'></vue-qr>
    <div style="margin-top: 10px;;width:100%;display:flex;justify-content: center">
      <t-button  @click='start'>开始渲染</t-button>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export default{
  props:['list'],
  components: { VueQr },
  name: 'Test',
  data(){
    return{
      percent:0,
      canvasWidth:400,
      canvasHeight:620,
      isLoading:false,
      num:0,
      src:'',
      canvas:null,
      canvasCtx:null,
      qrcodeUrl:null,
      isQrcode:null,
      status:'',
      qrCon:'世间所有的美好都会如期而至',
      size: 200,
      jszip:null,
      downLoading:false,
      qrhieght:250,
      qrwidth:250,
    }
  },
  created() {
  },
  methods:{
  down(i) {
    if(i == 100){
      this.isLoading = false
      this.downLoading = true
    }else{
      return i+'%'
    }
  },
  test(dataUrl){
    this.qrcodeUrl = dataUrl
  },
  creatQrCode() {
    console.log(this.$refs.qrcode)
    let text = '二维码内容';
    let qrcode = new QRCode(this.$refs.qrcode, {
      text: text, //二维码内容字符串
      width: 200, //图像宽度
      height: 200, //图像高度
      colorDark: '#000000', //二维码前景色
      colorLight: '#ffffff', //二维码背景色
      correctLevel: QRCode.CorrectLevel.H, //容错级别
    })
    setTimeout(()=>{
      console.log(qrcode);
      // console.log(qrcode._oDrawing._elImage.src);
      // this.drwImg(qrcode._oDrawing._elImage.src)
    },1000)

  },
  // 背景图
  darwBg(url,width,height){
    return new Promise((rel)=>{
      let that = this
      var img= new Image();
      img.src= url
      //增加这一行：
      img.setAttribute( "crossOrigin" , 'anonymous' );
      img.onload = function (){
        that.canvasCtx.drawImage(img,0,0,width,height);
        rel(true)
        // that.canvasCtx.clearRect(0,0,this.canvasWidth,this.canvasHeight)
        // setTimeout(() => {

        // }, 1000);
      }
    })
  },
  // 添加二维码
  drwImg(url,width,height){
    return new Promise((rel)=>{
      let that = this
      var img= new Image();
      img.src= url
      //增加这一行：
      img.setAttribute( "crossOrigin" , 'anonymous' );
      img.onload = function (){
        that.canvasCtx.drawImage(img,110,240,width,height);
        var dataURL = that.canvas.toDataURL();
        that.src = dataURL
        rel(that.src)
      }
    })
  },
  // 首先创建画布
  initCanvas(){
    this.canvas = document.querySelector('#canvas');
    this.canvasCtx = this.canvas.getContext( "2d" );
  },
  addQr(i){
    // console.log(i)
    return new Promise((rel)=>{
      // 设定变量
      this.qrCon = i.toString()
      // 设定定时器等待二维码base64
      this.isQrcode = setInterval(async ()=>{
        //  当二维码base64不为空时清除定时器
        if(this.qrcodeUrl != ''){
          // console.log(this.qrCon);
          clearInterval(this.isQrcode)
          this.isQrcode = null
          // 取得canvas图片base64地址
          let url =  await this.drwImg(this.qrcodeUrl,180,180)
          this.qrcodeUrl = ''
          rel(url)
        }
      },100)
    })
  },
  start(){
    this.initCanvas()
    this.isLoading = true
    let x = 0
    let that = this
    //设置画布的背景
    this.darwBg('https://img2.baidu.com/it/u=1538549871,2080937302&fm=253&fmt=auto&app=138&f=JPEG?w=374&h=500',this.canvasWidth,this.canvasHeight).then(async res=>{
      console.log(that);
      if(res)
        // 开始渲染二维码
        for(let i of this.list){
          x += 1
          // 同步取得canvas图片base64
          let bbb = await this.addQr(i.id_md5)
          // 切割字符串
          let d = bbb.split('data:image/png;base64,')[1]
          // 添加进压缩包内
          this.jszip.file(this.repeatName(i.full_name)+'.png',d,{base64: true})
          // 百分比进度条
          // console.log(x,this.list.length)
          this.percent = Math.trunc(( x / (this.list.length)) * 100)
          if(i==this.list[this.list.length-1]){
            this.jszip.generateAsync({type:"blob"})
              .then(function(content) {
                // see FileSaver.js
                FileSaver.saveAs(content, "智慧村务.zip");
                console.log('下载完成');
                that.downLoading = false
                that.$notify.success({
                  title: '下载成功！',
                  content: '请前往下载管理器查看'
                });
              });
          }
        }
    })
  },
  repeatName(full_name){
    let nameList = this.list.filter(val=>{
      if(val.full_name == full_name){
        return val
      }
    })
    if(full_name==null){
      return Math.floor(Math.random()*100)
    }
    if(nameList.length != 1){
      return full_name+'('+ Math.floor(Math.random()*10) +')'
    }else{
      return full_name
    }
  }
},
mounted() {
  this.jszip = new JSZip()
  // for(var i=0;i<4000;i++){
  //   this.list.push((Math.random()*10+i).toString())
  // }
}
}
</script>
<style>
#app{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.canvasBox{
  position: relative;
}
.t-progress__info{
color: white !important;
}
.canvasLoading{
  background-color: rgba(0, 0, 0, 0.35);
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
canvas {
  border: 1px dashed black;
}
.arco-progress-circle-text{
  color: white;
  font-size: 24px;
}
</style>
