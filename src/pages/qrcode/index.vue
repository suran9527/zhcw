<template>
  <t-card class="body">
    <t-row :gutter="24" style="height:52px;display:flex;align-items: center">
      <t-col :span="2">
        <h2>二维码生成</h2>
      </t-col>

    </t-row>
    <t-tabs v-model="value" :onChange="valueChange">
      <t-tab-panel :value="1" label="全部渲染">
        <t-row>
          <t-col :span="6" :offset="3" style="width:100%;display:flex;justify-content: center;">
            <qrDown :list='setList'></qrDown>
          </t-col>
        </t-row>
      </t-tab-panel>
      <t-tab-panel :value="2" label="选择渲染">
        <template v-if="value1==1">
          <t-row >
            <t-col :span="6" :offset="3" style="width:100%;display:flex;justify-content: center;margin-top:5%;margin-bottom: 6%">
              <t-transfer theme="primary" :data="list" v-model="targetValue" :search="true" :onChange="change" />
            </t-col>
          </t-row>
          <t-row style="margin-bottom: 5%">
            <t-col :span="2" :offset="5" style="width:100%;display:flex;justify-content: center;">
              <t-button variant="outline" theme="primary" ghost @click="go">前 去 渲 染</t-button>
            </t-col>
          </t-row>
        </template>
        <template v-if="value1==2">
          <icon name="rollback" style="font-size: 30px;cursor: pointer;position: absolute;left: 10px;top: 10px;" @click="value1=1"/>
          <t-row>
            <t-col :span="6" :offset="3" style="width:100%;display:flex;justify-content: center;">
              <qrDown :list='setList'></qrDown>
            </t-col>
          </t-row>
        </template>

      </t-tab-panel>
    </t-tabs>
  </t-card>
</template>

<script>
import qrDown from '@/components/canvas.vue';
import { Icon } from 'tdesign-icons-vue';
import {createQrcode} from "@/api/home";
export default {
  name: 'qrcode',
  components: {
    qrDown,
    Icon
  },
  data(){
    return{
      value:1,
      value1:1,
      maxHeight:600,
      list:[],
      oldList:[],
      newList:[],
      targetValue: [],
      checkedValue: [],
      setList:[],
    }
  },
  async created() {
    let res = await createQrcode()
    this.setList=res.data;
    this.oldList=res.data;
    for (let i in res.data) {
      this.list.push({
        value: res.data[i].id_md5,
        label: res.data[i].full_name,
      });
    }
    // this.list=res.data;
    this.height()
  },
  methods:{
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    change(data){
      this.setList=[]
      for(let i in data){
        for(let j of this.oldList){
          if(data[i]==j.id_md5){
            this.setList.push(j)
            continue
          }
        }
      }
      console.log(this.setList)
      // console.log(this.targetValue)
    },
    //切换页面
    async valueChange(value){
      if(value==1){
        let res = await createQrcode()
        this.setList=res.data;
      }else{
        this.targetValue=[]
      }
      // ?this.targetValue=[]:''
      // value==1?this.setList=this.list:this.setList=[]
      console.log(this.setList)
    },
    go(){
      console.log(this.setList)
      if(this.setList.length==0){
        this.$message.error('请选择指定村民')
        // this.$message.success('用户表示操作顺利达成');
        return
      }
      this.value1=2
    }
  }
};
</script>
<style>
.body {
  height:calc(100%);
}
.t-transfer__search .t-transfer__list{
  /*width:40%;*/
  height:400px;
}
</style>
<style scoped>
.row-container {
  margin-bottom: 16px;
}
</style>
