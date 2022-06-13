<template>
  <t-card>
    <t-dialog
      width="40%"
      :visible.sync="visible"
      @confirm="onConfirm"
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
        <t-col :span="4" :offset="8" style="width:100%;display:flex;justify-content: space-around">
          <t-button>通 过</t-button>
          <t-button theme="danger">不 通 过</t-button>
        </t-col>
      </t-row>
    </t-dialog>

    <t-row :gutter="24" style="height:52px;display:flex;align-items: center">
      <t-col :span="2">
        <h2>审核信息</h2>
      </t-col>
      <t-col :span="2" :offset="6" style="width: 100%;display:flex;justify-content: flex-end">
<!--        <t-button theme="primary" @click="visible1=true">-->
<!--          <icon name="add" style="height:100%"/>-->
<!--          添加信息-->
<!--        </t-button>-->
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
          :selected-row-keys="selectedRowKeys"
          @select-change="rehandleSelectChange"
          @page-change="pageChange"
          :filter-value="filterValue"
          @filter-change="onFilterChange"
        >
          <template #operation="slotProps">
            <div style="width:100%;display:flex;justify-content: space-around;align-items: center">
              <span style="color: #165dff;cursor:pointer;" @click="open(slotProps)">查看</span>
<!--              <span style="color: #f53f3f;cursor:pointer;" @click="deleteData(slotProps)">删除</span>-->
              <t-button>通 过</t-button>
              <t-button theme="danger">不 通 过</t-button>
            </div>
          </template>
        </t-table>
        <t-button v-if="btnShow" style="position:absolute;left: 8%;bottom: 2%;" theme="danger">删 除</t-button>
      </t-col>

    </t-row>
  </t-card>
</template>

<script>
import { Icon } from 'tdesign-icons-vue';
export default {
  name: "examine",
  components: {
    Icon
  },
  data(){
    return{
      search:'',
      maxHeight:600,
      visible:false,
      btnShow:false,
      columns: [
        {
          align: 'center',
          className: 'row',
          colKey: 'index',
          title: '序号',
          width:100
        },
        {
          colKey: 'platform',
          title: '管理员账号',
          ellipsis: true,
          fixed:'left',
          width:150
        },
        {
          colKey: 'type',
          title: '修改时间',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'default',
          title: '来源',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'needed',
          title: '状态',
          ellipsis: true,
          width:150,
          filter: {
            type: 'multiple',
            // 是否显示重置取消按钮，一般情况不需要显示
            showConfirmAndReset: true,
            list: [
              { label: '通过', value: 0 },
              { label: '未通过', value: 1 },
              { label: '审核中', value: 2 },
            ],
          },
        },
        {
          colKey: 'position',
          title: '修改内容',
          ellipsis: true,
          width:150
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 220,
          cell: 'operation',
          fixed: 'right',
        },

      ],
      data:[],
      pagination:{defaultCurrent: 1, defaultPageSize: 20,total: 100, showJumper: true,pageSizeOptions:[]},
      selectedRowKeys: [],
      formData:{},
      filterValue: {}
    }
  },
  created() {
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
    for(let i in this.columns) {
      this.formData[this.columns[i].colKey]=i
    }
    this.$forceUpdate();
    this.height()
  },
  methods:{
    height() {
      this.maxHeight = window.innerHeight * 0.7
      console.log(this.maxHeight)
    },
    searchChange(value){
      console.log(value)
    },
    open({ text, row }) {
      this.visible=true
      console.log(text, row);
    },
    onConfirm(context) {
      console.log('@confirm与onConfirm任选一种方式即可，其他几个事件类似', context);
      this.visible = false;
    },
    pageChange(index){
      console.log(index)
    },
    rehandleSelectChange(value, { selectedRowData }) {
      this.selectedRowKeys = value;
      this.btnShow=value.length ==0?false:true
      console.log(value, selectedRowData);
    },
    onFilterChange(filters) {
      console.log('filter-change', filters);
      this.filterValue = filters;
      // 模拟异步请求进行数据过滤
      // this.request(this.filterValue.needed);
    },
  }
}
</script>

<style scoped>

</style>
