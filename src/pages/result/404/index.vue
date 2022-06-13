<template>
  <result title="404 未找到" tip="抱歉，您访问的页面不存在" type="404">
    <t-button @click="() => $router.push('/dashboard/home')">返回首页</t-button>
  </result>
</template>

<script>
import result from '@/components/result/index.vue';

export default {
  name: 'Result404',
  components: { result },
};
</script>
