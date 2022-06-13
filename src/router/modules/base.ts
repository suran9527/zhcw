import { ViewModuleIcon } from 'tdesign-icons-vue';
import Layout from '@/layouts';

export default [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/home',
    name: 'dashboard',
    meta: {
      title: '综合信息管理',
      icon: ViewModuleIcon,
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/pages/dashboard/home/index.vue'),
        meta: { title: '信息管理' },
      },
      {
        path: 'filed',
        name: 'Filed',
        component: () => import('@/pages/dashboard/filed/index.vue'),
        meta: { title: '字段配置' },
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/pages/dashboard/table/index.vue'),
        meta: { title: 'Excel导入导出' },
      },
      {
        path: 'vote',
        name: 'Vote',
        component: () => import('@/pages/vote/index.vue'),
        meta: { title: '投票管理' },
      },
      {
        path: 'news',
        name: 'News',
        component: () => import('@/pages/news/index.vue'),
        meta: { title: '新闻管理' },
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/pages/notice/index.vue'),
        meta: { title: '通知管理' },
      },
      {
        path: 'examine',
        name: 'Examine',
        component: () => import('@/pages/dashboard/examine/index.vue'),
        meta: { title: '审核管理' },
      },
    ],
  },
];
