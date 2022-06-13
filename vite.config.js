import { loadEnv } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createSvgPlugin } from 'vite-plugin-vue2-svg';

import path from 'path';

const CWD = process.cwd();

export default ({ mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);

  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // 如需自定义组件其他 token, 在此处配置
          },
        },
      },
    },

    plugins: [
      createVuePlugin({
        jsx: true,
      }),

      createSvgPlugin(),
    ],

    build: {
      cssCodeSplit: false,
    },

    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        "/api": {
          target: "https://rcw.yltest.top/admin",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        //会把请求路径中的/api换为后面的代理服务器
        // '/api': {
        //   //提供数据的服务器地址
        //   target: 'https://rcw.yltest.top/api',
        //   changeOrigin : true,
        //   pathRewrite: { '^/api': '' },
        //
        // }
      },
      // proxy: {
        // '/api': {
        //   // 用于开发环境下的转发请求
        //   // 更多请参考：https://vitejs.dev/config/#server-proxy
        //   // target: 'https://service-exndqyuk-1257786608.gz.apigw.tencentcs.com',
        //   target:'http://api.yltest.top',
        //   changeOrigin: true,
        // },
      // },
    },
  };
};
