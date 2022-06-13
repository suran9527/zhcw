<template>
  <div>
    <t-button  @click="excel">Primary</t-button>
    <excel :onSuccess="go"></excel>
<!--    <qrDown :list='[1,2]' ></qrDown>-->
    <vue-qr text="Hello world!" :callback="test" qid="testid"></vue-qr>
  </div>
</template>

<script>
import excel from '@/components/tabelIn.vue'
import VueQr from 'vue-qr'
// import qrDown from './canvas';

export default {
  name: 'DashboardBase',
  components: {
    excel,
    VueQr
  },
  methods:{
    go(e){
      console.log(e);
    },
    test(dataUrl,id){
      console.log(dataUrl, id)
    },
    excel(){
      import('@/components/Export2Excel').then(excel => {
        // const tHeader = this.titileValue
        // const data = this.list
        const tHeader = ['1']
        const data = [[1111]]
        excel.export_json_to_excel({
          header: tHeader, //表头 必填
          data, //具体数据 必填
          filename: 'excel-list', //非必填
          autoWidth: true, //非必填
          bookType: 'xlsx' //非必填
        })
      })
    }
  }
};
</script>
<style scoped>
.row-container {
  margin-bottom: 16px;
}
</style>
