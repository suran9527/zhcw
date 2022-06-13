<template>
  <t-card class="body">
    <t-dialog
      width="40%"
      :visible.sync="visible1"
      :onConfirm="onConfirmAnother"
      :onClose="close"
      confirmBtn="上传"
      placement="center"
    >
      <t-row>
        <t-col :span="12">
          <t-card title="上传banner" :headerBordered="true" :bordered="false">
            <t-form style="max-height:500px;overflow-y: auto" labelAlign="right" :labelWidth="150">
              <template>
                <t-form-item label="上传图片" >
                  <t-upload
                            action="https://i.yltest.top/api/v1/upload"
                            v-model="files"
                            @fail="handleFail"
                            theme="image"
                            tips="允许选择多张图片文件上传，最多只能上传 1 张图片"
                            accept="image/*"
                            multiple
                            :max="1"
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
        <h2>banner管理</h2>
      </t-col>
      <t-col :span="2" :offset="6" style="width: 100%;display:flex;justify-content: flex-end">
        <t-button theme="primary" @click="visible1=true">
          <icon name="add" style="height:100%"/>
          添加Banner
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
    <t-row v-if="loading">
      <t-col :span="2" :offset="5">
        <t-loading :loading="loading" />
      </t-col>
    </t-row>
    <t-row v-if="data.length ==0">
      <t-col :span="2" :offset="5">
        暂无数据
      </t-col>
    </t-row>
    <t-row :gutter="[16,16]" v-show="!loading">
      <template v-for="item in data">
      <t-col :lg="4"
             :xs="6"
             :xl="3">
          <div class="imgBox">
            <img :src="item.img">
            <div >
<!--              <t-button variant="outline" theme="danger" ghost>删除</t-button>-->
              <icon name="delete" size="large" style="color: red;cursor: pointer;margin-top: 5px" @click="deleteData(item.id)"/>
            </div>
          </div>
      </t-col>
      </template>
    </t-row>
  </t-card>
</template>
<script>
import { Icon } from 'tdesign-icons-vue';
import {addBanner,delBanner,getBannerList} from "@/api/banner";
export default {
  name: 'Banner',
  components: {
    Icon
  },
  data(){
    return {
      search:'',
      maxHeight:600,
      formData:{},
      files:[],
      visible1:false,
      data:[],
      loading:false
    }
  },
  created(){
    this.getBannerList();
  },
  methods: {
    handleFail({ file }) {
      this.$message.error(`文件 ${file.name} 上传失败`);
    },
    getBannerList(){
      this.loading=true
      getBannerList({
        pages:1,
        limit:9999
      }).then(res=>{
        console.log(res.data)
        this.data=res.data;
        this.loading=false
      })
    },
    open({ text, row }) {
      this.visible=true
      this.formData=row
      console.log(text, row);
    },
    close(context) {
      this.files=[]
      console.log('关闭弹窗，点击关闭按钮、按下ESC、点击蒙层等触发', context);
    },
    searchChange(value){
      console.log(value)
    },
    deleteData(data){
      console.log(data)
      delBanner({
        id:data
      }).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.getBannerList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
      })
    },
    onConfirmAnother(context){
      addBanner({
        img:this.files[0].response.data.links.url,
        url:this.files[0].response.data.links.url
      }).then(res=>{
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.visible1=false;
          this.getBannerList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
        this.files=[]
      })
      console.log('点击了确认按钮', context);
    },
  }
};
</script>
<style>
.imgBox{
  width:100%;
  height:200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  border:1px solid #7777;
}
.imgBox div{
  width:90%;
  display:flex;
  align-items: center;
  justify-content: flex-end;
}
.imgBox img{
  width:90%;
  height:150px;
  margin-top:10px;
  border-radius:12px;
  margin-bottom: 5px;
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
