<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    labelAlign="top"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'" >
      <t-form-item name="account" label="账号">
        <t-input v-model="formData.account" size="large" placeholder="请输入账号">
          <template #prefix-icon>
            <user-icon />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password" label="密码">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          key="password"
          placeholder="请输入登录密码"
        >
          <template #prefix-icon>
            <lock-on-icon />
          </template>
          <template #suffix-icon>
            <browse-icon v-if="showPsw" @click="showPsw = !showPsw" key="browse" />
            <browse-off-icon v-else @click="showPsw = !showPsw" key="browse-off" />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd" >
<!--选择器-->
        <t-checkbox v-model="formData.checked">记住账号</t-checkbox>
<!--        <span class="tip">忘记账号？</span>-->
      </div>
    </template>

    <!-- 扫码登陆 -->
    <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">请使用微信扫一扫登录</span>
        <span class="refresh"
          >刷新
          <refresh-icon color="#0052D9" />
        </span>
      </div>
      <qrcode-vue value="" :size="192" level="H" />
    </template>

    <!-- 手机号登陆 -->
    <template v-else>
      <t-form-item name="phone">
        <t-input v-model="formData.phone" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <user-icon />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" key="verifyCode" />
        <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit" > 登 录 </t-button>
    </t-form-item>

    <div class="switch-container" v-if="false">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">使用账号密码登录</span>
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">使用微信扫码登录</span>
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">使用手机号登录</span>
    </div>
  </t-form>
</template>
<script lang="ts">
import Vue from 'vue';
import QrcodeVue from 'qrcode.vue';
import { TOKEN } from '@/config/global';
import { UserIcon, LockOnIcon, BrowseOffIcon, BrowseIcon, RefreshIcon } from 'tdesign-icons-vue';
import AES from '@/utils/cpy.js'
// let token = localStorage.getItem('token')
// console.log(token)
const INITIAL_DATA = {
  phone: '',
  account: '',
  password: '',
  verifyCode: '',
  checked: false,
  aes_key:''
};
const FORM_RULES = {
  // phone: [{ required: true, message: '手机号必填', type: 'error' }],
  account: [{ required: false, message: '账号必填', type: 'error' }],
  password: [{ required: false, message: '密码必填', type: 'error' }],
  // verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
};
/** 高级详情 */
export default Vue.extend({
  name: 'Login',
  components: {
    QrcodeVue,
    UserIcon,
    LockOnIcon,
    BrowseOffIcon,
    BrowseIcon,
    RefreshIcon,
  },
  data() {
    return {
      FORM_RULES,
      type: 'password',
      formData: { ...INITIAL_DATA },
      showPsw: false,
      countDown: 0,
      intervalTimer: null,
      key:''
    };
  },
  created(){
    if(localStorage.getItem('userAdmin')){
      let form =JSON.parse(localStorage.getItem('userAdmin'));
      let password = form.password
      let key = form.aes_key
      form.password = JSON.parse(AES.decrypt(password,key));
      this.formData=form
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer);
  },
  methods: {
    switchType(val) {
      this.type = val;
      this.$refs.form.reset();
    },
    getKey() {
      let key = AES.generatekey(16)
      this.key = key
    },
    fuck(data) {
      var encrypts = AES.encrypt(JSON.stringify(data), this.key);
      // var dess = JSON.parse(AES.decrypt(encrypts, key));
      // console.log(encrypts)
      this.formData.aes_key=this.key
      console.log(this.formData)
      return encrypts;
    },
    async onSubmit({ validateResult }) {
      let that = this;
      if (validateResult === true) {
        this.$store.dispatch('user/login', this.formData).then(res=>{
          if(res.code==200){
            //测试记住账号
            if(this.formData.checked){
                this.getKey()
                this.formData.password = this.fuck(this.formData.password)
                localStorage.setItem('userAdmin', JSON.stringify(this.formData))
            }else{
                localStorage.removeItem('userAdmin')
            }
            localStorage.setItem(TOKEN,res.data)
            this.$message.success('登录成功');
            this.$router.replace('/dashboard/home').catch(() => '');
          }else{
            this.$message.error(res.message);
          }
        })
      }
    },
    handleCounter() {
      this.countDown = 60;
      this.intervalTimer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown -= 1;
        } else {
          clearInterval(this.intervalTimer);
          this.countDown = 0;
        }
      }, 1000);
    },
  },
});
</script>
