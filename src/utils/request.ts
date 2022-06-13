import axios from 'axios';
import proxy from '../config/host';
import { DialogPlugin,MessagePlugin } from 'tdesign-vue';
import { TOKEN_NAME,TOKEN } from '@/config/global';
import store from '@/store'
const env = import.meta.env.MODE || 'development';

const API_HOST = env === 'mock' ? '/' : proxy[env].API; // 如果是mock模式 就不配置host 会走本地Mock拦截
// const API_HOST = proxy[env].API; // 如果是mock模式 就不配置host 会走本地Mock拦截
const CODE = {
  LOGIN_TIMEOUT: 3000,
  REQUEST_SUCCESS: 0,
  REQUEST_FOBID: 1001,
};

const instance = axios.create({
  baseURL: API_HOST,
  timeout: 1000,
  withCredentials: false,
});

// eslint-disable-next-line
// @ts-ignore
// axios的retry ts类型有问题
instance.interceptors.retry = 3;

instance.interceptors.request.use(
  config => {
    // do something before request is sent
    if(localStorage.getItem(TOKEN)){
      config.headers.token=localStorage.getItem(TOKEN)
    }
    return config
});

instance.interceptors.response.use(
  (response) => {
    const res=response;
    // return res;
    if (res.data.code === 211) {
      return res.data;
    }else if(res.data.code==521){
        // const confirmDia=DialogPlugin.confirm({
        //   header: '您已在其他地方登陆',
        //   body: '请重新登录！',
        //   confirmBtn: '重新登录',
        //   cancelBtn: 'null',
        //   onConfirm: ({ e }) => {
        //     console.log('confirm e: ', e);
        //     store.dispatch('user/logout').then(() => {
        //       location.reload() // 为了重新实例化vue-router对象 避免bug
        //     })
        //     confirmDia.destroy();
        //   },
        //   onClose: ({ e, trigger }) => {
        //     console.log('close e: ', e);
        //     console.log('trigger: ', trigger);
        //     confirmDia.hide();
        //   },
        // })

        return res.data
    }else{
      // MessagePlugin.error(res.data.msg)
    }
  },
  (err) => {
    const { config } = err;
    MessagePlugin.error('出现意外错误')
    if (!config || !config.retry) return Promise.reject(err);

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
      return Promise.reject(err);
    }

    config.retryCount += 1;

    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, config.retryDelay || 1);
    });

    return backoff.then(() => instance(config));
  },
);

export default instance;
