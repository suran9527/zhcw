<template>
  <t-card class="body">
    <t-dialog header="信息详情" width="80%" :visible.sync="visible" :onClose="close" :onConfirm="onConfirmAnother"
      placement="center">
      <t-row>
        <t-col :span="8">
          <t-card title="家庭成员信息" :headerBordered="true" :bordered="false">
            <t-table rowKey="index" :data="newData" :columns="modelColumns" :loading="loading1" hover maxHeight="500"
              @row-click="onRowClick"></t-table>
          </t-card>
        </t-col>
        <t-col :span="4">
          <t-card title="成员信息" :headerBordered="true" :bordered="false">
            <t-form style="height:500px;overflow-y: auto" :data="formData" labelAlign="right" :labelWidth="80" class="scoll">
              <template v-for="item in modelColumns">
                <t-form-item :label="item.title" v-if="item.colKey=='role'" variant="false" >
                  <t-select v-model="formData[item.colKey]" placeholder="请选择关系" style="width:150px">
                    <template v-for="item in list">
                      <t-option v-for="(list,index) of item" :value="list" :label="list" :key="index"></t-option>
                    </template>
                  </t-select>
                  <t-input v-model="formData.relation" :disabled="true" placeholder="输入户主身份证(选择户主不填)">
                  </t-input>
                </t-form-item>
                <t-form-item :label="item.title" v-else >
                  <t-input v-model="formData[item.colKey]" :disabled="item.colKey=='id'" :onChange="change" :name="item.colKey"></t-input>
                </t-form-item>
              </template>
            </t-form>
          </t-card>
        </t-col>
        <t-col :span="2" :offset="10" style="display:flex;justify-content: center">
          <t-button theme="success" @click="edit">修改信息</t-button>
        </t-col>
      </t-row>
    </t-dialog>
    <t-dialog width="40%" :visible.sync="visible1" :onClose="close" :onConfirm="onConfirmAnother1" placement="center">
      <t-row>
        <t-col :span="12">
          <t-card title="填写信息" :headerBordered="true" :bordered="false">
            <t-form style="max-height:500px;overflow-y: auto" :data="formData" labelAlign="right" :labelWidth="80">
              <template v-for="item in modelColumns" v-if="item.colKey!='index'">
                <t-form-item :label="item.title" v-if="item.colKey=='role'" variant="false">
                  <t-select v-model="formData[item.colKey]" placeholder="请选择关系" style="width:150px">
                    <template v-for="item in list">
                      <t-option v-for="(list,index) of item" :value="list" :label="list" :key="index"></t-option>
                    </template>
                  </t-select>
                  <t-input v-model="formData.relation" :disabled="formData.role=='户主'" placeholder="输入户主身份证(选择户主不填)">
                  </t-input>
                </t-form-item>
                <t-form-item :label="item.title" v-else>
                  <t-input v-model="formData[item.colKey]"></t-input>
                </t-form-item>
              </template>
            </t-form>
          </t-card>
        </t-col>
      </t-row>
    </t-dialog>
    <t-row :gutter="24" style="height:52px;display:flex;align-items: center">
      <t-col :span="2">
        <h2>综合信息管理</h2>
      </t-col>
      <t-col :span="1" :offset="5">
        <router-link target="_blank" tag="a" :to="{path:'/echarts',query:{}}">打开数据大屏</router-link>
      </t-col>
      <t-col :span="2" style="width: 100%;display:flex;justify-content: flex-end">
        <t-button theme="primary" @click="visible1=true;getKey()">
          <icon name="add" style="height:100%" />
          添加信息
        </t-button>
      </t-col>
      <t-col :span="2">
        <t-input v-model="search" :clearable="true" placeholder="请输入搜索内容" :onChange="searchChange">
          <template #prefix-icon>
            <icon name="search" />
          </template>
        </t-input>
      </t-col>
    </t-row>
    <t-row>
      <t-col :span="12">
        <t-table :maxHeight="maxHeight" rowKey="id_md5" hover type=multiple :data="data" :columns="columns" :loading="loading"
          :pagination="pagination" :selected-row-keys="selectedRowKeys" @select-change="rehandleSelectChange"
          @page-change="pageChange">
          <template #operation="slotProps">
            <div style="width:100%;display:flex;justify-content: space-around">
              <span style="color: #165dff;cursor:pointer;" @click="open(slotProps)">查看</span>
              <span style="color: #f53f3f;cursor:pointer;" @click="deleteData(slotProps)">删除</span>
            </div>
          </template>
        </t-table>
        <t-button v-if="btnShow" style="position:absolute;left: 8%;bottom: 2%;" theme="danger" @click="delAll">删 除</t-button>
      </t-col>

    </t-row>
  </t-card>
</template>

<script>
  import {
    Icon
  } from 'tdesign-icons-vue';
  import {
    getFieldList,
    getVillagerList,
    getPrivateKey,
    getVillagerInfo,
    getPublicKey,
    addVillager,
    delVillager,
    editVillager,
    delVillagerBatch
  } from "@/api/home";
  import md5 from 'js-md5'
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
      Icon
    },
    data() {
      return {
        search: '',
        maxHeight: 600,
        formData: {},
        pagination: {
          defaultCurrent: 1,
          defaultPageSize: 20,
          total: 100,
          showJumper: true,
          pageSizeOptions: []
        },
        selectedRowKeys: [],
        visible: false,
        visible1: false,
        modelColumns: [{
            colKey: 'full_name',
            title: '姓名',
            ellipsis: true,
            fixed: 'left',
            width: 150
          },
          {
            colKey: 'id',
            title: '身份证',
            ellipsis: true,
            width: 150
          },
          {
            colKey: 'role',
            title: '与户主关系',
            ellipsis: true,
            width: 150
          },

          {
            colKey: 'sex',
            title: '性别',
            ellipsis: true,
            width: 150
          },
          {
            colKey: 'age',
            title: '年龄',
            ellipsis: true,
            width: 150
          },
          {
            colKey: 'live_address',
            title: '住址',
            ellipsis: true,
            width: 150
          },
        ],
        columns: [{
            colKey: 'row-select',
            type: 'multiple',
            className: 'demo-multiple-select-cell',
            // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删）。disabled 参数：{row: RowData; rowIndex: number })
            // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
            // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

            // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删）
            // 这种方式禁用行选中，行文本不会变灰
            width: 64,
          },
          {
            colKey: 'full_name',
            title: '姓名',
            ellipsis: true,
            fixed: 'left',
            width: 150
          },
          {
            colKey: 'sex',
            title: '性别',
            ellipsis: true,
            width: 150
          },
          {
            colKey: 'age',
            title: '年龄',
            ellipsis: true,
            width: 150
          },
          {
            colKey: 'live_address',
            title: '住址',
            ellipsis: true,
            width: 150
          },
          {
            colKey: 'operation',
            title: '操作',
            width: 150,
            cell: 'operation',
            fixed: 'right',
          },

        ],
        data: [],
        newData:[],
        list: [
          ['户主', '配偶', '父亲', '母亲', '儿子', '儿媳', '女儿', '女婿', '爷爷', '奶奶', '孙子', '孙女', '曾祖父', '曾祖母', '曾孙', '曾孙女']
        ],
        btnShow: false,
        loading: false,
        loading1: false,
        key:''
      }
    },
    created() {

      this.getFieldList()
      this.getVillagerList()
      this.height()
    },
    methods: {
      getFieldList() {

        // this.data=[]
        getFieldList({
          pages: 1,
          limit: 9999
        }).then(res => {
          for (let i in res.data) {
            this.modelColumns.push({
              colKey: res.data[i].key,
              title: res.data[i].val,
              width: 150,
              cell: 'operation',
            })
          }
          // this.data=res.data
          // console.log(res.data)
          // this.data=res.data
          // this.pagination.total=100
        })
      },
      getVillagerList() {
        this.loading = true
        getPrivateKey().then(key => {
          // this.data=[]
          getVillagerList({
            pages: this.pagination.defaultCurrent,
            limit: this.pagination.defaultPageSize
          }).then(res => {
            this.pagination.total=res.data.count
            let data = res.data.data
            for (let i in data) {
              let id = ''
              let aes_key = ''
              let relation = ''
              for (let j in data[i]) {
                j == 'aes_key' ? aes_key = data[i][j] : ''
                j == 'id' ? id = data[i][j] : ''
                // j == 'relation' ? relation = this.data[i][j] : ''
              }
              let MSG = rsaDecrypt(aes_key, key.data)
              // if (relation) {
              //   this.data[i].relation = AES.decrypt(relation, MSG).substr(1, 18)
              // }
              // console.log(AES.decrypt(relation,MSG))
              data[i].id = JSON.parse(JSON.parse(JSON.stringify(AES.decrypt(id, MSG))))
              data[i].age = getAnalysisIdCard(data[i].id, 3)
              // console.log(AES.decrypt(id,MSG))
            }
            // this.pagination.total=100
            this.data=data
            this.loading = false
          })
        })
      },
      height() {
        this.maxHeight = window.innerHeight * 0.75
        console.log(this.maxHeight)
      },
      pageChange(index) {
        this.pagination.defaultCurrent=index.current
        this.getVillagerList()
      },

      delAll(){
        delVillagerBatch({
          id_md5_arr:this.selectedRowKeys
        }).then(res=>{
          if(res.code==211){
            this.$message.success({ content: res.msg, duration: 2000 })
            this.getVillagerList()
            this.btnShow=false
          }else{
            this.$message.error({ content: res.msg, duration: 2000 })
          }
        })
      },
      rehandleSelectChange(value, {
        selectedRowData
      }) {
        this.selectedRowKeys = value;
        this.btnShow = value.length == 0 ? false : true
      },
      searchChange(value) {
        console.log(value)
      },
      change(value,e){
        let key =e.e.path[0].name
        this.formData[key]=value
        this.$forceUpdate()
       // console.log(this.formData[key])
      },
      edit(){
        let data = this.formData
        let newData = {};
        getPrivateKey().then(key => {
          let id = ''
          let aes_key = ''
          let relation = ''
          for (let j in data) {
            j == 'aes_key' ? aes_key = data[j] : ''
            j == 'id' ? id = data[j] : ''
            j == 'relation' ? relation = data[j] : ''
          }
          let MSG = rsaDecrypt(aes_key, key.data)
          this.key=MSG
          for (let i in data) {
            if(i!='age'&&i!='aes_key'&&i!='relation'){
              if (i == 'id') {
                data[i] == '' ? newData[i] = '' : newData[i] = this.fuck(data[i])
              } else {
                if (i == 'role') {
                  data[i] == '' ? newData[i] = '户主' : newData[i] = data[i]
                } else {
                  newData[i] = data[i]
                }
              }
            }
          }
          editVillager(newData).then(res=> {
            if(res.code==211){
              this.$message.success({ content: res.msg, duration: 2000 })
              this.getVillagerInfo(newData.id_md5)
              this.getVillagerList()
            }else{
              this.$message.error({ content: res.msg, duration: 2000 })
            }
          })
        })
  },
      delVillager(id){
        delVillager({
          id_md5:id
        }).then(res=>{
          if(res.code==211){
            this.$message.success({ content: res.msg, duration: 2000 })
            this.getVillagerList()
          }else{
            this.$message.error({ content: res.msg, duration: 2000 })
          }
        })
      },
      deleteData(data) {
        this.delVillager(data.row.id_md5)
        // console.log(data.row)
      },
      getVillagerInfo(id){
        this.loading1 = true
        getPrivateKey().then(key => {
          getVillagerInfo({
            id_md5: id
          }).then(res => {
            let data = res.data.data
            // this.newData = res.data.data;
            // console.log(this.newData)
            for (let i in data) {
              let id = ''
              let aes_key = ''
              let relation = ''
              for (let j in data[i]) {
                j == 'aes_key' ? aes_key = data[i][j] : ''
                j == 'id' ? id = data[i][j] : ''
                j == 'relation' ? relation = data[i][j] : ''
              }
              let MSG = rsaDecrypt(aes_key, key.data)
              // if (relation) {
              //   this.data[i].relation = AES.decrypt(relation, MSG).substr(1, 18)
              // }
              // console.log(AES.decrypt(relation,MSG))

              data[i].id = JSON.parse(AES.decrypt(id, MSG))
              data[i].age = getAnalysisIdCard(data[i].id, 3)
              // console.log(AES.decrypt(id,MSG))
            }
            this.newData=data
            this.loading1=false
          })
        })
      },
      open({
        text,
        row
      }) {
        this.visible = true
        this.getVillagerInfo(row.id_md5)
      },
      onRowClick(data) {
        console.log('点击了这一行单元格', data);
        for (let i in data.row) {
          this.formData[i] = data.row[i]
        }
        for(let i in this.newData){
          this.newData[i].role=='户主'?this.formData.relation=this.newData[i].id:''
        }
        // this.formData.relation=this.ID
        // console.log(this.formData)
        this.$forceUpdate();
      },

      onConfirmAnother(context) {
        // this.formData={}
        this.visible=false
        // console.log('点击了确认按钮', context);
      },
      getKey() {
        let key = AES.generatekey(16)
        this.key = key
        getPublicKey().then(res => {
          // console.log(res.data)
          // 加密后的aes秘钥
          let encryptMsg = rsaEncrypt(key, res.data)
          this.formData.key_encrypt = encryptMsg
        })
      },
      fuck(data) {
        var encrypts = AES.encrypt(JSON.stringify(data), this.key);
        // var dess = JSON.parse(AES.decrypt(encrypts, key));
        // console.log(encrypts)
        return encrypts;
      },
      //添加
      onConfirmAnother1(context) {
        let data = this.formData
        let newData = {};
        for (let i in data) {
          if (i == 'id') {
            data[i] == '' ? newData[i] = '' : newData[i] = this.fuck(data[i])
          } else {
            if (i == 'role') {
              data[i] == '' ? newData[i] = '户主' : newData[i] = data[i]
            } else {
              i=='relation'?newData[i] = md5(data[i]) :newData[i] = data[i]

            }

          }
        }
        addVillager(newData).then(res=>{
          console.log(res)
          if(res.code==211){
            this.$message.success({ content: res.msg, duration: 2000 })
              this.formData={id:''}
              this.getVillagerList()
          }else{
            this.$message.error({ content: res.msg, duration: 2000 })
          }
        })
        // newData.relation=md5()
      },
      close(context) {

        this.formData={id:''}
        console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
      },
      onCancel(context) {
        console.log('点击了取消按钮', context);
      },
      onKeydownEsc(context) {
        console.log('按下了ESC', context);
      },
      onClickCloseBtn(context) {
        console.log('点击了关闭按钮', context);
      },
      onClickOverlay(context) {
        console.log('点击了蒙层', context);
      },
    },
    watch: {
      'formData.id': function(newValue, oldValue) {
        if (newValue.length == 18) {
          //用户唯一ID
          this.formData.id_md5 = md5(newValue)
          this.formData.sex = getAnalysisIdCard(newValue, 2)
          // this.formData.age = getAnalysisIdCard(newValue, 3)
          // this.$forceUpdate();
        }
          if (newValue.length ==0) {
            // this.formData.age = ''
            this.formData.sex = ''
          }
      }
    }
  };
</script>
<style>
.body {
  height:calc(100%);
}
.scoll::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
.scoll::-webkit-scrollbar-thumb{
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: content-box;
  background-color: var(--td-scrollbar-color);
}
</style>
<style scoped>
  .row-container {
    margin-bottom: 16px;
  }
</style>
