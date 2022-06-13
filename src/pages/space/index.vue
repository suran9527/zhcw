<template>
  <t-card class="body">
    <t-dialog
      width="50%"
      :visible.sync="visible"
      placement="center"
      :onConfirm="onConfirmAnother1"
      :onClose="close1"
      :cancelBtn="null"
    >
      <t-row>
        <t-col :span="12">
          <t-card title="查看详情" :headerBordered="true" :bordered="false">
            <t-form style="max-height:500px;overflow-y: auto" :data="formData" labelAlign="right" :labelWidth="80">
              <template v-for="item in modelColumns">
                <t-form-item :label="item.title" >
                  <t-textarea v-if="item.colKey=='title'" v-model="formData[item.colKey]" placeholder="标题最多不能超过三十个字" :maxlength="30"></t-textarea>
                  <t-textarea
                    v-else-if="item.colKey=='con'"
                    v-model="formData[item.colKey]"
                    placeholder="请输入内容"
                    name="description"
                    :autosize="{minRows: 8}"
                  />

                  <template v-else-if="item.colKey=='img'">
                    <template v-if="formData[item.colKey].length!=0&&Array.isArray(formData[item.colKey])" v-for="(url,index) in formData[item.colKey]">
                      <div style="position: relative">
                        <el-image
                          style="width:140px;margin-right: 20px"
                          :src="url">
                        </el-image>
<!--                        <icon name="close-circle-filled" size="large" style="color:red;position: absolute;top: -12px;right: 12px;cursor: pointer" @click="delUrl(index)"/>-->
                      </div>

                    </template>
                    <template v-if="upShow">
                      <t-upload
                        action="https://i.yltest.top/api/v1/upload"
                        v-model="files"
                        @fail="handleFail"
                        theme="image"
                        accept="image/*"
                        multiple
                        :max="3"
                      ></t-upload>
                    </template>
                  </template>
                </t-form-item>
              </template>
            </t-form>
          </t-card>
        </t-col>

      </t-row>
    </t-dialog>
    <t-row :gutter="24" style="height:52px;display:flex;align-items: center">
      <t-col :span="2">
        <h2>建言献策</h2>
      </t-col>
      <t-col :span="2" :offset="6" style="width: 100%;display:flex;justify-content: flex-end"></t-col>
      <t-col :span="2" v-if="false">
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
    <t-row v-if="loading">
      <t-col :span="2" :offset="5">
        <t-loading :loading="loading" />
      </t-col>
    </t-row>
      <t-row :gutter="[10,10]" v-show="!loading">
        <!--      .slice(
              pagination.defaultPageSize * (pagination.defaultCurrent - 1),
              pagination.defaultPageSize * pagination.defaultCurrent,
              )-->
        <template v-for="item in data">
          <t-col :lg="4"
                 :xs="6"
                 :xl="3">
            <t-card :cover="Array.isArray(item.img)?item.img[0]:item.img" :style="{ height: '400px',overflow: 'hidden'}">
              <template #avatar>
              <t-row>
                  <t-divider align="left">
                    <t-tooltip :content="item.title">
                      {{item.newTitle?item.newTitle:item.title}}
                    </t-tooltip>
                  </t-divider>
                <p class="text">
                  {{item.con}}
                </p>
              </t-row>

              </template>
              <template #footer>
              <t-row>
                <t-col :span="8" class="txt">
                  {{item.date}}
                </t-col>
                <t-col :span="4" >
                  <t-dropdown
                    :options="options"
                    placement="top-left"
                    trigger="click"
                    :hideAfterItemClick="true"
                    @click="clickHandler"
                    :minColumnWidth="100"
                  >
                    <t-button variant="text" @click="open(item)">
                      管理<icon name="more" size="12"/></t-button>
                  </t-dropdown></t-col>
              </t-row>
              </template>
            </t-card>

          </t-col>
        </template>
      </t-row>
    <t-pagination
      style="margin-top:20px"
      v-model="pagination.defaultCurrent"
      :total="pagination.total"
      :pageSizeOptions="pagination.pageSizeOptions"
      :showJumper="pagination.showJumper"
      :maxPageBtn="5"
      :onCurrentChange="pageChange"
    />
  </t-card>
</template>

<script>
import {Icon} from 'tdesign-icons-vue';
import {getSpeakList,delSpeak} from '@/api/jy';
export default {
  name: 'Notice',
  components: {
    Icon
  },
  data(){
    return {
      options: [{
        content: '查看',
        value: 1,
      },{
        content: '删除',
        value: 2,
      }, ],
      files:[],
      search:'',
      maxHeight:600,
      formData:{},
      pagination:{defaultCurrent: 1, defaultPageSize: 8,total: 100, showJumper: true,pageSizeOptions:[]},
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
        },{
          colKey: 'img',
          title: '图片',
          ellipsis: true,
          fixed:'left',
        }
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
      visible:false,
      index:'',
      loading:false,
      upShow:false,
    }
  },
  created(){
  this.getSpeakList();
    this.height()
  },
  methods: {
    delUrl(index){
      console.log(index)
      this.formData.img.splice(index,1)
      this.formData.img.length==0?this.upShow=true:this.upShow=false
      console.log(this.files)
    },
    getSpeakList(){
      this.loading=true
      getSpeakList({
        pages:this.pagination.defaultCurrent,
        limit:this.pagination.defaultPageSize
      }).then(res=>{
        this.data=res.data;
        this.pagination.total=res.count
          this.loading=false
        for(let i in res.data) {
          res.data[i].img.indexOf(',')?this.data[i].img=res.data[i].img.split(','):''
        }
        console.log(this.data)
      });
    },
    // 一旦 formatResponse 返回值包含 error，便会被组件判定为上传失败
    formatResponse() {
      return { error: '网络异常，图片上传失败' };
    },
    handleFail({ file }) {
      this.$message.error(`文件 ${file.name} 上传失败`);
    },
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    pageChange(index) {
      this.pagination.defaultCurrent=index
      this.getSpeakList()
    },
    open(data) {
      console.log(data)
      this.formData=JSON.parse(JSON.stringify(data))
      // this.formData=row
    },
    clickHandler(data) {
      if(data.content=="查看") {
        this.visible=true
        Array.isArray(this.formData.img)?"":this.formData.img=this.formData.img.split(',')
      }else{
        delSpeak({id:this.formData.id}).then(res=>{
          if(res.code==211){
            this.$message.success({ content: res.msg, duration: 2000 })
            this.visible=false
            this.getSpeakList();
          }else{
            this.$message.error({ content: res.msg, duration: 2000 })
          }
        })
      }
    },
    searchChange(value){
      console.log(value)
    },
    deleteData(data){
      console.log(data)
    },
    close1(context) {
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
    },
    close(context) {
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
    },
    onConfirmAnother1(){
        // this.files=[]
        this.visible=false
    },
    onConfirmAnother(context){
      this.addNews()
      console.log('点击了确认按钮', context);
    },
    onPick(value, context) {

      console.log('onPick:', value, context);
    },
  }
};
</script>
<style>
.body {
  height:calc(100%);
}
.txt{
  display: -webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient:vertical;
  text-overflow: ellipsis; /* 文本溢出显示省略标记 是一种生声明需要配合下面俩个属性才能生效*/
  overflow: hidden; /*溢出隐藏*/
}
.text{
  margin-top: 10px;
  height: 105px;
  display: -webkit-box;
  -webkit-line-clamp:5;
  -webkit-box-orient:vertical;
  text-overflow: ellipsis; /* 文本溢出显示省略标记 是一种生声明需要配合下面俩个属性才能生效*/
  overflow: hidden; /*溢出隐藏*/

}

.t-card{
  min-height: 389px;
}
.t-card__footer{
  width:100%;
  position: absolute;
  background-color:#fff;
  bottom:0
}
.t-card__footer .t-row{
  display: flex;
  justify-content: center;
  align-items: center;
}
.t-card__cover{
  width:80%;
  margin-left: 10%;
}
.el-image img{
  width:100%;
  height:100%;
}
</style>
<style scoped>
.row-container {
  margin-bottom: 16px;
}
.t-divider{
  margin:0;
}
</style>
