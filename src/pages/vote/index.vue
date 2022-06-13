<template>
  <t-card class="body">
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
              <template v-for="item in columns1">
                <t-form-item :label="item.title" v-if="item.colKey=='img'">
                <template  v-for="img in formData[item.colKey]">
                  <img  :src="img" style="width:140px;">
                </template>
                </t-form-item>
                <t-form-item v-else :label="item.title" >
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
      placement="center"
    >
      <t-row>
        <t-col :span="12">
          <t-card title="填写信息" :headerBordered="true" :bordered="false">
            <t-form style="max-height:500px;overflow-y: auto" :data="formData" labelAlign="right" :labelWidth="150">
              <template v-for="item in modelColumns">
                <t-form-item :label="item.title">
                  <t-textarea v-if="item.colKey=='title'" v-model="formData[item.colKey]" placeholder="标题最多不能超过三十个字" :maxlength="30"></t-textarea>
                  <t-textarea
                    v-else-if="item.colKey=='con'"
                    v-model="formData[item.colKey]"
                    placeholder="请输入内容"
                    name="description"
                    :autosize="{minRows: 3, maxRows: 5}"
                  />
                  <t-upload v-else
                            action="https://i.yltest.top/api/v1/upload"
                            v-model="files"
                            @fail="handleFail"
                            theme="image"
                            tips="允许选择多张图片文件上传，最多只能上传 3 张图片"
                            accept="image/*"
                            multiple
                            :max="3"
                  ></t-upload>
                </t-form-item>
              </template>
            </t-form>
          </t-card>
        </t-col>
      </t-row>
    </t-dialog>
    <t-row :gutter="24" style="height:52px;display:flex;align-items: center">
      <t-col :span="2">
        <h2>投票管理</h2>
      </t-col>
      <t-col :span="2" :offset="8" style="width: 100%;display:flex;justify-content: flex-end">
        <t-button theme="primary" @click="visible1=true">
          <icon name="add" style="height:100%"/>
          添加投票
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
          <template #sup="slotProps">
            <span style="font-size: 20px;color: #01cd6d">{{slotProps.row.sup}}</span>
          </template>
          <template #opp="slotProps">
              <span class="yes" style="font-size: 20px">{{slotProps.row.opp}}</span>
          </template>
          <template #img="slotProps">
            <div style="height:60px;display:flex;width:100%;align-items:center;justify-content: flex-start">
              <template v-for="item in slotProps.row.img">
                <img :src="item" style="width:60px;height:60px;margin-left:5px;border-radius: 2px;">
              </template>
            </div>
          </template>
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
import {getVoteList} from "@/api/vote";
import {addVote, delVote} from "../../api/vote";
export default {
  name: 'DashboardBase',
  components: {
    Icon
  },
  data(){
    return {
      files:[],
      search:'',
      maxHeight:600,
      formData:{},
      pagination:{defaultCurrent: 1, defaultPageSize: 20,total: 100, showJumper: true,pageSizeOptions:[]},
      visible1:false,
      modelColumns: [
        {
          colKey: 'title',
          title: '标题'
        },
        {
          colKey: 'con',
          title: '内容'
        },
        {
          colKey: 'img',
          title: '图片'
        },
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
          colKey: 'date',
          title: '时间',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'sup',
          title: '支持',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'opp',
          title: '反对',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'img',
          title: '图片',
          ellipsis: true,
          width:200
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 150,
          cell: 'operation',
          fixed: 'right',
        },

    ],
      columns1: [
        {
          colKey: 'title',
          title: '标题',
        },
        {
          colKey: 'con',
          title: '内容',
        },
        {
          colKey: 'date',
          title: '时间',
        },
        {
          colKey: 'sup',
          title: '支持',
        },
        {
          colKey: 'opp',
          title: '反对',
        },
        {
          colKey: 'img',
          title: '图片',
        }
      ],
      data:[],
      visible:false
    }
  },
  created(){

    this.getVoteList()
    this.height()
  },
  methods: {
    handleFail({ file }) {
      this.$message.error(`文件 ${file.name} 上传失败`);
    },
    getVoteList(){
      getVoteList({
        pages:this.pagination.defaultCurrent,
        limit:this.pagination.defaultPageSize
      }).then(res=>{
        for(let i in res.data) {
          res.data[i].img=res.data[i].img.split(',')
        }
        this.data=res.data;
        this.pagination.total=res.count
      })
    },
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    pageChange(index) {
      this.pagination.defaultCurrent=index.current
      this.getVoteList()
    },
    open({ text, row }) {
      this.visible=true
      this.formData=row
      console.log(text, row);
    },
    searchChange(value){
      console.log(value)
    },
    deleteData(data){
      console.log(data)
      delVote({
        id:data.row.id,
      }).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.getVoteList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
      })
    },
    onConfirmAnother(context){
      console.log(this.files)
      let arr = []
      for(let i in this.files){
          arr.push(this.files[i].response.data.links.url)
      }
      this.formData.img=arr.join(',')
      addVote(this.formData).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.formData={}
          this.visible=false
          this.getVoteList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
      })
      console.log(arr)
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
.body {
  height:calc(100%);
}
</style>
<style scoped>
.row-container {
  margin-bottom: 16px;
}

</style>
