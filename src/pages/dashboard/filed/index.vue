<template>
  <t-card class="body">

    <t-dialog
      width="40%"
      :visible.sync="visible1"
      :onConfirm="onConfirmAnother"
      placement="center"
    >
      <t-row>
        <t-col :span="12">
          <t-card title="填写信息" :headerBordered="true" :bordered="false">
            <t-form style="max-height:500px;overflow-y: auto" :data="formData" labelAlign="right" :labelWidth="150">
              <template v-for="item in modelColumns">
                <t-form-item :label="item.title" >
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
        <h2>字段配置</h2>
      </t-col>
      <t-col :span="2" :offset="8" style="width: 100%;display:flex;justify-content: flex-end">
        <t-button theme="primary" @click="visible1=true">
          <icon name="add" style="height:100%"/>
          添加字段
        </t-button>
      </t-col>
<!--      <t-col :span="2">-->
<!--        <t-input-->
<!--          v-model="search"-->
<!--          :clearable="true"-->
<!--          placeholder="请输入搜索内容"-->
<!--          :onChange="searchChange"-->
<!--        >-->
<!--          <template #prefix-icon>-->
<!--            <icon name="search"/>-->
<!--          </template>-->
<!--        </t-input>-->
<!--      </t-col>-->
    </t-row>
    <t-row>
      <t-col :span="12">
        <t-table
          :maxHeight="maxHeight"
          rowKey="index"
          hover
          type=multiple
          :data="data"
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          @page-change="pageChange"
        >
          <template #operation="slotProps">
            <div style="width:100%;display:flex;justify-content: space-around">
<!--            <span style="color: #165dff;cursor:pointer;" @click="open(slotProps)">查看</span>-->
            <span class="yes" @click="delField(slotProps.row.key)" >删除</span>
              </div>
          </template>
        </t-table>
      </t-col>

    </t-row>
  </t-card>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';
import {getFieldList} from "@/api/home";
import {addField,delField} from "@/api/filed";
import {getSpeakList} from "@/api/jy";
export default {
  name: 'DashboardBase',
  components: {
    Icon
  },
  data(){
    return {
      search:'',
      maxHeight:600,
      formData:{},
      pagination:{defaultCurrent: 1, defaultPageSize: 20,total: 100, showJumper: true,pageSizeOptions:[]},
      visible1:false,
      modelColumns: [
        {
          colKey: 'val',
          title: '用户看见的字段名',
          ellipsis: true,
          fixed:'left'
        },
        {
          colKey: 'key',
          title: '英文字段名',
          ellipsis: true
        },
      ],
      columns: [
        {
          colKey: 'val',
          title: '用户看见的',
          ellipsis: true,
          fixed:'left',
          width:150
        },
        {
          colKey: 'key',
          title: '键值',
          ellipsis: true,
          fixed:'left',
          width:150
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 50,
          cell: 'operation',
          fixed: 'right',
        },

    ],
      data:[],
      loading: false
    }
  },
  created(){
    this.getFieldList()
    this.height()
    // this.delField('test2')
  },
  methods: {
    getFieldList(){
      this.loading=true
      this.data=[]
      getFieldList({
        pages:this.pagination.defaultCurrent,
        limit:this.pagination.defaultPageSize
      }).then(res=>{
        this.data=res.data
        this.pagination.total=res.count
        // this.pagination.total=100
        this.loading=false
      })
    },
    addField(){
      addField(this.formData).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.visible1=false
          this.formData={}
          this.getFieldList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
      })
    },
    delField(keyData){
      delField({key:keyData}).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.getFieldList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }

      })
    },
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    pageChange(index){
      this.pagination.defaultCurrent=index.current
      this.getFieldList();
      console.log(index)
    },

    searchChange(value){
      console.log(value)
    },
    deleteData(data){
      console.log(data)
    },
    onConfirmAnother(context){
      // console.log(this.formData)
      addField(this.formData).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.visible1=false
          this.formData={}
          this.getFieldList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
      })
    },
  }
};
</script>
<style>
.body {
  height:calc(100%);
}
.yes{
  color: #f53f3f;
  cursor:pointer;
}
</style>
<style scoped>
.row-container {
  margin-bottom: 16px;
}
</style>
