import { Edit1Icon,  UserAddIcon,QrcodeIcon,FileAddIcon ,MobileIcon,DeleteIcon ,ImageIcon,RootListIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts';

export default[
  {
    path: '/space',
    name: 'space',
    component: Layout,
    redirect: '/space/space',
    meta: { title: '建言献策', icon: RootListIcon },
    children: [
      {
        path: 'space',
        name: 'space',
        component: () => import('@/pages/space/index.vue'),
        meta: { title: '建言献策' },
      },
    ],
  },
{
  path: '/userAdmin',
  name: 'userAdmin',
  component: Layout,
  redirect: '/userAdmin/userAdmin',
  meta: { title: '用户管理', icon: UserAddIcon },
  children: [
    {
      path: 'userAdmin',
      name: 'UserAdmin',
      component: () => import('@/pages/userAdmin/index.vue'),
      meta: { title: '用户管理' },
    },
  ],
},
  {
    path: '/banner',
    name: 'banner',
    component: Layout,
    // component: () => import('@/pages/delRecord/index.vue'),
    redirect: '/banner/banner',
    meta: { title: '轮播', icon: ImageIcon },
    children: [

      {
        path: 'banner',
        name: 'banner',
        component: () => import('@/pages/banner/index.vue'),
        meta: { title: 'banner' },
      },
    ],
  },
  {
    path: '/qrcode',
    name: 'qrcode',
    component: Layout,
    // component: () => import('@/pages/examine/index.vue'),
    redirect: '/qrcode/qrcode',
    meta: { title: '二维码生成', icon: QrcodeIcon },
    children: [
      {
        path: 'qrcode',
        name: 'Qrcode',
        component: () => import('@/pages/qrcode/index.vue'),
        meta: { title: '二维码生成' },
      },
      // {
      //   path: 'step',
      //   name: 'FormStep',
      //   component: () => import('@/pages/form/step/index.vue'),
      //   meta: { title: '分步表单页' },
      // },
    ],
  },

  {
    path: '/delRecord',
    name: 'delRecord',
    component: Layout,
    // component: () => import('@/pages/delRecord/index.vue'),
    redirect: '/delRecord/delRecord',
    meta: { title: '回收站', icon: DeleteIcon },
    children: [

      {
        path: 'delRecord',
        name: 'DelRecord',
        component: () => import('@/pages/delRecord/index.vue'),
        meta: { title: '删除记录' },
      },
    ],
  },
  // {
  //   path: '/user',
  //   name: 'user',
  //   component: Layout,
  //   redirect: '/user/index',
  //   meta: { title: '个人页', icon: 'user-circle' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'UserIndex',
  //       component: () => import('@/pages/user/index.vue'),
  //       meta: { title: '个人中心' },
  //     },
  //   ],
  // },
  // {
  //   path: '/applet',
  //   name: 'applet',
  //   component: Layout,
  //   redirect: '/applet/applet',
  //   meta: { title: '小程序弹窗', icon: MobileIcon },
  //   children: [
  //     {
  //       path: 'applet',
  //       name: 'Applet',
  //       component: () => import('@/pages/applet/index.vue'),
  //       meta: { title: '弹窗管理' },
  //     },
  //     // {
  //     //   path: 'step',
  //     //   name: 'FormStep',
  //     //   component: () => import('@/pages/form/step/index.vue'),
  //     //   meta: { title: '分步表单页' },
  //     // },
  //   ],
  // },
  // {
  //   path: '/result',
  //   name: 'result',
  //   component: Layout,
  //   redirect: '/result/success',
  //   meta: { title: '结果页', icon: 'check-circle' },
  //   children: [
  //     {
  //       path: 'success',
  //       name: 'ResultSuccess',
  //       component: () => import('@/pages/result/success/index.vue'),
  //       meta: { title: '成功页' },
  //     },
  //     {
  //       path: 'fail',
  //       name: 'ResultFail',
  //       component: () => import('@/pages/result/fail/index.vue'),
  //       meta: { title: '失败页' },
  //     },
  //     {
  //       path: 'network-error',
  //       name: 'ResultNetworkError',
  //       component: () => import('@/pages/result/network-error/index.vue'),
  //       meta: { title: '网络异常' },
  //     },
  //     {
  //       path: '403',
  //       name: 'Result403',
  //       component: () => import('@/pages/result/403/index.vue'),
  //       meta: { title: '无权限' },
  //     },
  //     {
  //       path: '404',
  //       name: 'Result404',
  //       component: () => import('@/pages/result/404/index.vue'),
  //       meta: { title: '访问页面不存在页' },
  //     },
  //     {
  //       path: '500',
  //       name: 'Result500',
  //       component: () => import('@/pages/result/500/index.vue'),
  //       meta: { title: '服务器出错页' },
  //     },
  //     {
  //       path: 'browser-incompatible',
  //       name: 'ResultBrowserIncompatible',
  //       component: () => import('@/pages/result/browser-incompatible/index.vue'),
  //       meta: { title: '浏览器不兼容页' },
  //     },
  //     {
  //       path: 'maintenance',
  //       name: 'ResultMaintenance',
  //       component: () => import('@/pages/result/maintenance/index.vue'),
  //       meta: { title: '系统维护页' },
  //     },
  //   ],
  // },
];
