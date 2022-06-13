<template>
<t-card class="body">
  <t-dialog
    width="60%"
    :visible.sync="visible1"
    :onConfirm="onConfirmAnother"
    :cancelBtn="null"
    placement="center"
  >
    <t-row>
      <t-col :span="12">
        <t-card title="未添加进去数据" :headerBordered="true" :bordered="false">
          <div style="width:100%;overflow: auto;white-space: nowrap;height:400px;overflow: auto">
            <div style="float: left;">
              <template v-for="item in modelColumns">
                <div style="display: inline-block;width:120px;margin:10px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align: center">{{item.val}}</div>
              </template>
            </div>
            <template v-for="item in data">
              <div style="float: left;">
                <template v-for="key in modelColumns">
                  <div style="display:inline-block;width:120px;margin:10px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align: center">{{ item[key.key] }}</div>
                </template>
              </div>
            </template>
          </div>


        </t-card>
      </t-col>
    </t-row>
  </t-dialog>
  <t-row :gutter="24" style="height:52px;display:flex;align-items: center">
    <t-col :span="2">
      <h2>Excel操作</h2>
    </t-col>
    <t-col v-if="value==1">
      <t-tag theme="danger" showClose closable>请选择你需要导出的字段</t-tag>
    </t-col>
  </t-row>
  <t-loading :loading="loading" text="加载中..." fullscreen />
  <t-tabs v-model="value">
    <t-tab-panel :value="1" label="Excel导出">
      <t-table
        :maxHeight="maxHeight"
        rowKey="key"
        :data="modelColumns"
        :columns="columns"
        :loading="loading1"
        :selected-row-keys="selectedRowKeys"
        @select-change="rehandleSelectChange"
      >
        <template #operation="slotProps">
          <a class="link" @click="rehandleClickOp(slotProps)">删除</a>
        </template>
      </t-table>
      <t-row style="margin-top:10px">
        <t-col>
          <t-button v-if="btnShow" @click="outTable">导出为表格</t-button>
        </t-col>
      </t-row>
    </t-tab-panel>
    <t-tab-panel :value="2" label="Excel导入">
          <div style="padding: 100px 200px">
            <excel :onSuccess="go"></excel>
          </div>
    </t-tab-panel>
  </t-tabs>
</t-card>
<!--    <t-button  @click="excel">Primary</t-button>-->
<!--    <excel :onSuccess="go"></excel>-->
<!--    &lt;!&ndash;    <qrDown :list='[1,2]' ></qrDown>&ndash;&gt;-->
<!--    <vue-qr text="Hello world!" :callback="test" qid="testid"></vue-qr>-->
</template>

<script>
import excel from '@/components/tabelIn.vue'
import VueQr from 'vue-qr'
// import qrDown from './canvas';
import {
  getFieldList,
  getPublicKey,
  getPrivateKey
} from "@/api/home";
import md5 from 'js-md5'
import {excelOut,excelAdd} from "@/api/table";
import {
  getAnalysisIdCard
} from "@/utils/getId";
import AES from '@/utils/cpy.js'
import {
  rsaEncrypt,
  rsaDecrypt
} from '@/utils/rsa.js'
export default {
  name: 'DashboardBase',
  components: {
    excel,
    VueQr
  },
  data(){
    return{
      value:1,
      data:[],
      maxHeight:600,
      selectedRowKeys: [],
      columns: [
        {
          colKey: 'row-select',
          type: 'multiple',
          className: 'demo-multiple-select-cell',
          width: 64,
        },
        {
          colKey: 'val',
          title: '用户看见的',
          ellipsis: true,
          fixed:'left',
          width:150
        },
        {
          colKey: 'key',
          title: '键值英文',
          ellipsis: true,
          width:150
        }],

      modelColumns:[{
        key: 'full_name',
        val: '姓名',
      },
        {
          key: 'sex',
          val: '性别',
        },
        {
          key:'id',
          val:'身份证'
        },
        {
          key:'relation',
          val:'户主身份证'
        },
        {
          key:'role',
          val:'与户主关系'
        },
        {
          key: 'live_address',
          val: '住址',
        }],
      btnShow:false,
      loading:false,
      loading1:false,
      visible1:false,
      header:[],
      key:'',
      key_encrypt:''
    }
  },
  created() {
    this.getFieldList()
    this.height()
  },
  methods:{
    async getKey() {
      let key = AES.generatekey(16)
      this.key = key
      let res = await getPublicKey()

      let encryptMsg = rsaEncrypt(key, res.data)
      this.key_encrypt = encryptMsg
    },
    fuck(data) {
      var encrypts = AES.encrypt(JSON.stringify(data), this.key);
      // var dess = JSON.parse(AES.decrypt(encrypts, key));
      // console.log(encrypts)
      return encrypts;
    },
    getFieldList(){
      this.loading1=true
      // this.data=[]
      getFieldList({
        pages:1,
        limit:9999
      }).then(res=>{
        for(let i in res.data) {
          this.modelColumns.push({
            key: res.data[i].key,
            val: res.data[i].val,
          })
        }
        // this.data=res.data
        // this.pagination.total=100
        this.loading1=false
      })
    },
    height() {
      this.maxHeight = window.innerHeight * 0.7
    },
    onConfirmAnother(context) {
      // this.formData={}
      this.visible1=false
      console.log('点击了确认按钮', context);
    },
    rehandleSelectChange(value, { selectedRowData }) {
      this.header=[]
        this.selectedRowKeys=value
        value.length !=0?this.btnShow=true:this.btnShow=false
      for(let i of selectedRowData){
        this.header.push(i.val)
      }
        // console.log(value)
    },
    async outTable(){
      this.loading=true
      let key=''
      if(this.selectedRowKeys.indexOf('id')!=-1){
         key = await getPrivateKey()
      }
      let relation=[]
      let allArr=[]
      excelOut({
        field:this.selectedRowKeys
      }).then(res=>{
        if(key){
          for(let i in res.data.data){
            let aes_key=res.data.data[i].aes_key
            let id = res.data.data[i].id
            let MSG = rsaDecrypt(aes_key, key.data)
            res.data.data[i].id =JSON.parse(AES.decrypt(id, MSG))
            if(res.data.data[i].role=='户主'){
              relation.push({
                id:res.data.data[i].id,
                id_md5:res.data.data[i].id_md5
              })
            }
          }
        }
        for(let i in res.data.data){
          let arr = []
          for(let j in res.data.data[i]){
            if(j=='relation'){
              for(let s of relation){
                if(s.id_md5==res.data.data[i].relation){
                  res.data.data[i][j]=s.id
                  console.log(s.id)
                }
              }
            }
          }
          res.data.data[i].id_md5?delete res.data.data[i].id_md5:''
          res.data.data[i].aes_key?delete res.data.data[i].aes_key:''
        }
        for(let i in res.data.data){
          let arr = []
          for(let j in res.data.data[i]){
            arr.push(res.data.data[i][j])
          }
          allArr.push(arr)
        }
        this.data=allArr
        this.excel()
        this.loading=false
      })
    },
    async go(e){
      this.loading=true
      let header =e.header
      let results=e.results
      let allArr=[]
      for(let i in results){
        let gg = await new Promise((res,err)=>{
          res(this.getKey())
        })
        let form = {
          key_encrypt:''
        }
        for(let j of header){
          for(let s of this.modelColumns){
            s.val==j?form[s.key]=results[i][j]:''
            continue;
          }
          // if(j=='身份证'){
          //   results[i][j]=this.fuck(results[i][j])
          //   arr.push(this.key_encrypt)
          // }
          // // j=='身份证'?results[i][j]=this.fuck(results[i][j]):''
          // j=='户主身份证'?results[i][j]=md5(results[i][j]):''
          // arr.push(results[i][j])
        }
        for(let jm in form){
          if(jm=='id'){
            form.id_md5=md5(form.id)
            form.id=this.fuck(form.id)
            form.key_encrypt= this.key_encrypt
          }
          jm=='relation'&&form.relation!=''?form.relation=md5(form.relation):''
        }
        allArr.push(form)
      }
      excelAdd({
        data:allArr
      }).then(res=>{
        console.log(res)
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
          if(res.data){
            this.visible1=true
            this.data=res.data
          }
        }
        this.loading=false
      })
    },
    test(dataUrl,id){
      console.log(dataUrl, id)
    },
    excel(){
      import('@/components/Export2Excel').then(excel => {
        // const tHeader = this.titileValue
        // const data = this.list
        const tHeader = this.header
        const data = this.data
        excel.export_json_to_excel({
          header: tHeader, //表头 必填
          data, //具体数据 必填
          filename: '智慧村务', //非必填
          autoWidth: true, //非必填
          bookType: 'xlsx' //非必填
        })
      })
    }
  }
};
</script>
<style>
.body {
  height:calc(100%);
}
</style>
<style scoped>
.row-container {
  margin-bottom: 16px;
}
</style>
