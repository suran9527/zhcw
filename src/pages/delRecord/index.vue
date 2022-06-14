<template>
  <t-card class="body">
    <t-dialog
      width="40%"
      :visible.sync="visible"
      @confirm="onConfirm"
      placement="center"
      :cancelBtn="null"
    >
      <t-row>
        <t-col :span="12">
          <t-card title="查看信息" :headerBordered="true" :bordered="false">
            <t-form style="max-height:500px;overflow-y: auto" :data="formData" labelAlign="right" :labelWidth="100" disabled>
              <template v-for="item in modelColumns" >
                <t-form-item :label="item.title" >
<!--                  <t-input v-model="formData[item.colKey]"></t-input>-->
                  <p style="width:100%;border-bottom:1px solid #dcdcdc;">{{formData[item.colKey]}}</p>
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
      <t-col :span="2" :offset="8" v-if="false">
        <t-input
          v-model="search"
          :clearable="true"
          placeholder="请输入搜索内容"
          :onChange="searchChange"
        >
          <template #prefix-icon>
            <icon name="search"/>
          </template>
        </t-input>
      </t-col>
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
            <span style="color: #165dff;cursor:pointer;" @click="open(slotProps)">查看</span>
<!--            <span style="color: #f53f3f;cursor:pointer;" @click="deleteData(slotProps)">删除</span>-->
              </div>
          </template>
        </t-table>
      </t-col>

    </t-row>
  </t-card>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';
import {getList} from "@/api/delSite";
import {getFieldList} from '@/api/home'
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
      selectedRowKeys: [],
      visible:false,
      modelColumns: [
        {
          colKey: 'date',
          title: '删除时间',
          ellipsis: true,
          width:150
        },
        {
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
          colKey: 'live_address',
          title: '住址',
          ellipsis: true,
          width: 150
        },
      ],
      columns: [
        {
          align: 'center',
          className: 'row',
          colKey: 'full_name',
          title: '姓名',
          width:100
        },
        {
          colKey: 'sex',
          title: '性别',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'live_address',
          title: '住址',
          ellipsis: true,
          fixed:'left',
          width:150
        },

        {
          colKey: 'date',
          title: '删除时间',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 100,
          cell: 'operation',
          fixed: 'right',
        },

    ],
      data:[],
      loading:false
    }
  },
  created(){
    this.getFieldList()
    this.getList()
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
    getList(){
      this.loading=true
      getList({
        pages:this.pagination.defaultCurrent,
        limit:this.pagination.defaultPageSize
      }).then(res=>{
        console.log(res.data)
        this.pagination.total=res.count
        for(let i in res.data){
          res.data[i] = JSON.parse(res.data[i].data)
        }
        this.data=res.data
        this.loading=false
      })
    },
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    pageChange(index){
      this.pagination.defaultCurrent=index.current
      this.getList()
    },

    searchChange(value){
      console.log(value)
    },
    open({ text, row }) {
      this.visible=true
      this.formData=row
      console.log(text, row);
    },
    onRowClick(data){
      console.log('点击了这一行单元格',data);
      for(let i in data.row){
        this.formData[i]=data.row[i]
      }
      this.$forceUpdate();
      console.log(this.formData)
    },
    onConfirm(context) {
      console.log('@confirm与onConfirm任选一种方式即可，其他几个事件类似', context);
      this.visible = false;
    },
    close(context) {
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
