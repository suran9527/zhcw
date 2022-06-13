<template>
  <t-card>
    <t-dialog
      width="40%"
      :visible.sync="visible"
      placement="center"
      confirmBtn="编辑"
      :onConfirm="onConfirmAnother1"
    >
      <t-row>
        <t-col :span="12">
          <t-card title="查看编辑" :headerBordered="true" :bordered="false">
            <t-form :data="formData" labelAlign="right" :labelWidth="80">
              <template v-for="item in modelColumns">
                <t-form-item :label="item.title" >
                  <t-textarea v-if="item.colKey=='title'" v-model="formData[item.colKey]" placeholder="标题最多不能超过十个字" :maxlength="10"></t-textarea>
                  <t-textarea
                    v-else-if="item.colKey=='con'"
                    v-model="formData[item.colKey]"
                    placeholder="请输入内容"
                    name="description"
                    autosize
                    :autosize="{minRows: 3, maxRows: 5}"
                  />
                </t-form-item>
              </template>
            </t-form>
          </t-card>
        </t-col>
      </t-row>
    </t-dialog>

    <t-dialog
      width="40%"
      :visible.sync="visible1"
      :onConfirm="onConfirmAnother"
      :onClose="close"
      placement="center"
    >
      <t-row>
        <t-col :span="12">
          <t-card title="填写信息" :headerBordered="true" :bordered="false">
            <t-form style="max-height:500px;overflow-y: auto" :data="formData" labelAlign="right" :labelWidth="150">
              <template v-for="item in modelColumns">
                <t-form-item :label="item.title" >
                  <t-textarea v-if="item.colKey=='title'" v-model="formData[item.colKey]" placeholder="标题最多不能超过十个字" :maxlength="10"></t-textarea>
                  <t-textarea
                    v-else-if="item.colKey=='con'"
                    v-model="formData[item.colKey]"
                    placeholder="请输入内容"
                    name="description"
                    autosize
                    :autosize="{minRows: 3, maxRows: 5}"
                  />
                </t-form-item>
              </template>
            </t-form>
          </t-card>
        </t-col>
      </t-row>
    </t-dialog>
    <t-row :gutter="24" style="height:52px;display:flex;align-items: center">
      <t-col :span="2">
        <h2>通知管理</h2>
      </t-col>
      <t-col :span="2" :offset="8" style="width: 100%;display:flex;justify-content: flex-end">
        <t-button theme="primary" @click="visible1=true;formData={}">
          <icon name="add" style="height:100%"/>
          添加新通知
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
          @page-change="pageChange"
        >
          <template #operation="slotProps">
            <div style="width:100%;display:flex;justify-content: space-around">
            <span style="color: #165dff;cursor:pointer;" @click="open(slotProps)">查看</span>
            <span class="yes" @click="deleteData(slotProps)" >删除</span>
              </div>
          </template>
        </t-table>
      </t-col>

    </t-row>
  </t-card>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';
import {getNoticeList,addNotice,editNotice,delNotice} from "@/api/notice";

export default {
  name: 'Notice',
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
          colKey: 'title',
          title: '标题',
          ellipsis: true,
          fixed:'left',
        },
        {
          colKey: 'con',
          title: '内容',
          ellipsis: true,
        }
      ],
      columns: [
        {
          colKey: 'title',
          title: '标题',
          ellipsis: true,
          fixed:'left',
          width:150
        },
        {
          colKey: 'con',
          title: '内容',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 80,
          cell: 'operation',
          fixed: 'right',
        },

    ],
      data:[],
      visible:false
    }
  },
  created(){
    this.height()
    this.getNoticeList()
  },
  methods: {
    getNoticeList(){
      getNoticeList({
        pages:this.pagination.defaultCurrent,
        limit:this.pagination.defaultPageSize
      }).then(res=>{
        this.pagination.total=res.count
        this.data=res.data;
        // console.log(res.data);
      })
    },
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    pageChange(index){
      this.pagination.defaultCurrent=index.current
      this.getNoticeList()
      // console.log(index)
    },
    open({ text, row }) {
      this.visible=true
      this.formData=row
      console.log(text, row);
    },
    edit({ text, row }) {
      this.visible1=true
      this.formData=row
      console.log(text, row);
    },
    searchChange(value){
      console.log(value)
    },
    deleteData(data){
      delNotice({
        id:data.row.id
      }).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.getNoticeList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
      })
      console.log(data.row.id)
    },
    close(context) {
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
    },
    onConfirmAnother(context){
      // this.formData.img='1'
      addNotice(this.formData).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.getNoticeList();
          this.visible1=false
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
      })
      console.log('点击了确认按钮', context);
    },
    onConfirmAnother1(){
      editNotice(this.formData).then(res=> {
        if (res.code == 211) {
          this.$message.success({content: res.msg, duration: 2000})
          this.getNoticeList();
          this.visible = false
        } else {
          this.$message.error({content: res.msg, duration: 2000})
        }
      })
    },
    onPick(value, context) {
      console.log('onPick:', value, context);
    },
    onChange(value) {
      console.log('onChange:', value);
    },
  }
};
</script>
<style>
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
