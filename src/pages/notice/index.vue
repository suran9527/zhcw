<template>
  <t-card>
    <t-dialog
      width="40%"
      :visible.sync="visible"
      placement="center"
      :confirmBtn="null"
    >
      <t-row>
        <t-col :span="12">
          <t-card title="查看详情" :headerBordered="true" :bordered="false">
            <t-form style="max-height:500px;overflow-y: auto" :data="formData" labelAlign="right" :labelWidth="80">
              <template v-for="item in columns">
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
        <h2>通知管理</h2>
      </t-col>
      <t-col :span="2" :offset="6" style="width: 100%;display:flex;justify-content: flex-end">
        <t-button theme="primary" @click="visible1=true;formData={}">
          <icon name="add" style="height:100%"/>
          添加新通知
        </t-button>
      </t-col>
      <t-col :span="2">
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
          :height="maxHeight"
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
              <span style="color: #165dff;cursor:pointer;" @click="edit(slotProps)">编辑</span>
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
          colKey: 'platform',
          title: '用户看见的字段名',
          ellipsis: true,
          fixed:'left',
        },
        {
          colKey: 'type',
          title: '英文字段名',
          ellipsis: true,
        },{
          colKey: 'platform',
          title: '平台',
          ellipsis: true,
          fixed:'left',
        },
        {
          colKey: 'type',
          title: '类型',
          ellipsis: true,
        },
        {
          colKey: 'default',
          title: '默认值',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'needed',
          title: '是否必传',
          ellipsis: true,
          width:150
        },
      ],
      columns: [
        {
          colKey: 'platform',
          title: '平台',
          ellipsis: true,
          fixed:'left',
          width:150
        },
        {
          colKey: 'type',
          title: '类型',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'default',
          title: '默认值',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'needed',
          title: '是否必传',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'position',
          title: '详情信息',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 150,
          cell: 'operation',
          fixed: 'right',
        },

    ],
      data:[],
      visible:false
    }
  },
  created(){
    for (let i = 0; i < 100; i++) {
  this.data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
      position: `读取 ${i} 个数据的嵌套信息值`,
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });

}
    this.height()
  },
  methods: {
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    pageChange(index){
      console.log(index)
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
      console.log(data)
    },
    close(context) {
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
    },
    onConfirmAnother(context){
      console.log('点击了确认按钮', context);
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
