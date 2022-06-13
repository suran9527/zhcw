<template>
  <div class="login-wrapper">
    <div class="bg"></div>
    <login-header />
    <div class="loginBox">
      <div class="left">
        <p>"</p>
        <h1 class="title">智慧村务</h1>
        <h1 class="title1">Enshi</h1>
        <p class="content">恩施自治州政府网2019年3月发布信息显示，恩施州下辖恩施、利川2个县级市；建始、巴东、宣恩、咸丰、来凤、鹤峰6个县。全州共有88个乡、镇、街道办事处，其中46个乡，37个镇，5个办事处；2627个村、居民委员会，其中村民委员会2543个；23510个村、居民小组，其中村民小组22662个</p>
        <span class="line1"></span>
        <span class="line2"></span>
        <div class="js">
          <p>美丽恩施</p>
          <span>Beautiful Enshi</span>
        </div>
      </div>
      <div class="right">
        <div class="login-container">
          <div class="title-container">
            <h1 class="title margin-no">欢迎登陆</h1>
<!--            <h1 class="title">数字马河</h1>-->
<!--            <div class="sub-title">-->
<!--              <p class="tip">{{ type == 'register' ? '已有账号?' : '没有账号吗?' }}</p>-->
<!--              <p class="tip" @click="switchType(type == 'register' ? 'login' : 'register')">-->
<!--                {{ type == 'register' ? '登录' : '注册新账号' }}-->
<!--              </p>-->
<!--            </div>-->
          </div>

          <login v-if="type === 'login'" />
          <register v-else @register-success="switchType('login')" />
          <tdesign-setting />
        </div>
      </div>
    </div>

<!--    <footer class="copyright">Copyright @ 2021-2022 Tencent. All Rights Reserved</footer>-->
  </div>
</template>
<script>
import Login from './components/components-login.vue';
import Register from './components/components-register.vue';
import LoginHeader from './components/components-header.vue';
import TdesignSetting from '@/layouts/setting.vue';

export default {
  name: 'LoginIndex',
  components: {
    LoginHeader,
    Login,
    Register,
    TdesignSetting,
  },
  data() {
    return {
      type: 'login',
    };
  },
  methods: {
    switchType(val) {
      this.type = val;
    },
  },
};
</script>
<style lang="less">
@import url('./index.less');
.loginBox{
  width:100%;
  height:100%;
  display:flex;
  align-items: center;
  z-index:999;
}
.left{
  align-self: flex-start;
  width:70%;
  padding:0% 0 5% 10%;
  color: #fff;
}
.left p{
  font-size: 48px;
}
.left .content{
  margin-left:15%;
  width:60%;
  color: rgba(255, 255, 255, 1);
  letter-spacing: 1px;
  font-size: 16px;
  line-height: 30px;
  box-sizing: border-box;
}
.left .title{
  font-size: 72px;
  margin-bottom: 4%;
}
.left .title1{
  letter-spacing: 1px;
  font-size: 80px;
  margin-left: 5%;
  margin-bottom: 15%;
}
.left .line1{
  position: absolute;
  display: inline-block;
  width:1px;
  top: 42%;
  height: 483px;
  background-color:white;
}
.left .line2{
  position: absolute;
  display: inline-block;
  width:74px;
  height: 1px;
  background-color:white;
}
.js{
  margin-left:15%;
  margin-top: 10%;
}
.js p{
  color: rgba(255, 255, 255, 1);
  letter-spacing: 1px;
  font-size: 16px;
  line-height: 30px;
}
.js span{
  color: rgba(255, 255, 255, 1);
  letter-spacing: 1px;
  font-size: 10px;
  line-height: 30px;
}
.right{
  width:50%;
  //background-color:rgba(255, 255, 255,1);
}
</style>
