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
                <t-form-item :label="item.title">
                  <t-input v-model="formData[item.colKey]"></t-input>
                </t-form-item>
              </template>
              <t-form-item label="是否为管理员">
                <t-checkbox v-model="formData.chacked"></t-checkbox>
              </t-form-item>
            </t-form>
          </t-card>
        </t-col>
      </t-row>
    </t-dialog>
    <t-row :gutter="24" style="height:52px;display:flex;align-items: center">
      <t-col :span="2">
        <h2>用户管理</h2>
      </t-col>
      <t-col v-if="false" :span="2"  style="width: 100%;display:flex;justify-content: flex-end">
        <t-button theme="primary" @click="visible1=true">
          <icon name="add" style="height:100%"/>
          添加用户
        </t-button>
      </t-col>
<!--      <t-col :span="2" :offset="8">-->
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
          <template #avatar="{ row }">
            <img :src="row.avatar" style="width:40px;height:40px">
          </template>
          <template #operation="slotProps">
            <div style="width:100%;display:flex;justify-content: space-around">
            <span style="color: #165dff;cursor:pointer;" @click="updataAuth(slotProps)">修改权限</span>
            <span :class="slotProps.row.length<=1?'none':'yes'" @click="deleteData(slotProps)" >删除</span>
              </div>
          </template>
        </t-table>
      </t-col>
    </t-row>
  </t-card>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';
import {getUserList,setUserAuth} from "@/api/user";
export default {
  name: 'userAdmin',
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
          title: '管理员账号',
          ellipsis: true,
          fixed:'left',
          width:150
        },
        {
          colKey: 'type',
          title: '管理员密码',
          ellipsis: true,
          width:150
        },
      ],
      columns: [
        {
          colKey: 'name',
          title: '工作人员名称',
          ellipsis: true,
          align: 'center',
          fixed:'left',
          width:150
        },
        {
          colKey: 'sex',
          title: '性别',
          ellipsis: true,
          align: 'center',
          width:150
        },
        {
          colKey: 'nickName',
          title: '微信昵称',
          ellipsis: true,
          align: 'center',
          width:150
        },
        {
          colKey: 'avatar',
          title: '微信头像',
          ellipsis: true,
          align: 'center',
          width:150
        },
        {
          colKey: 'tel',
          title: '电话号',
          ellipsis: true,
          align: 'center',
          width:150
        },
        {
          colKey: 'auth',
          title: '权限',
          ellipsis: true,
          align: 'center',
          width:150
        },

        {
          colKey: 'operation',
          title: '操作',
          width: 150,
          cell: 'operation',
          align: 'center',
          fixed: 'right',
        },

    ],
      data:[],
    }
  },
  created(){

    this.getUserList()
    this.height()
  },
  methods: {
    updataAuth(data){
      console.log(data.row)
      let authData=''
      if(data.row.auth=='用户'){
        authData='admin'
      }else{
        authData='user'
      }
      setUserAuth({
        openid:data.row.openid,
        auth:authData
      }).then(res=>{
        console.log(res)
        if(res.code==211){
          this.$message.success({ content: res.msg, duration: 2000 })
          this.getUserList();
        }else{
          this.$message.error({ content: res.msg, duration: 2000 })
        }
      })
    },
    getUserList(){
      getUserList({
        pages:this.pagination.defaultCurrent,
        limit:this.pagination.defaultPageSize
      }).then(res=>{
        this.pagination.total=res.count
        this.data=res.data
        for(let i in res.data){
          this.data[i].auth=='user'?this.data[i].auth='用户':this.data[i].auth='管理员'
        }
        console.log(res)
      })
    },
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    pageChange(index) {
      this.pagination.defaultCurrent=index.current
      this.getUserList()
    },


    searchChange(value){
      console.log(value)
    },
    deleteData(data){
      console.log(data)
    },
    onConfirmAnother(context){
      console.log('点击了确认按钮', context);
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
