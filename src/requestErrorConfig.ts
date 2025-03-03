import { getRootDomain, getUserToken, handleUnauthenticatedUser } from '@/utils/utils';
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig {
//   headers: AxiosRequestHeaders;
// }

// 与后端约定的响应数据格式
export interface ResponseStructure<T = any> {
  // 其他字段
  success: boolean;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;

  data?: T;
  code?: number;
  msg?: string;
  [key: string]: any;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围

        if (error.response.status === 401) {
          // 如果url包含了logout，说明是用户主动退出登录，不需要提示
          if (!error.response.config.url?.includes('logout')) {
            message.info('登录信息已过期，请重新登录！');
          }

          handleUnauthenticatedUser();
        }

        if (error.response.data) {
          message.error(error.response.data);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: InternalAxiosRequestConfig) => {
      // 拦截请求配置，进行个性化处理。
      // const url = config?.url?.concat('?token = 123');
      // 当body code码不为0时显示后端返回msg
      // 所有经过axios的请求自动携带默认header头

      if (Cookies.get('auth_key')) {
        config.headers['auth-key'] = Cookies.get('auth_key');
      }
      config.headers['X-Xsrftoken'] = Cookies.get('_xsrf');
      config.headers['Codo-root-domain'] = getRootDomain(); // 添加新的header，不能用下划线

      return config;

      // return { ...config, };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      const responseData = data as ResponseStructure;

      // 当body code码不为0时显示后端返回msg
      // if (responseData.code === 66) {
      //   message.error('需要二次认证！');
      // }

      if (responseData.code !== 0) {
        const msgText = responseData.data || responseData.msg;
        const isNormalBehavior = responseData.code === 66;

        //这里要判断msgText是否是字符串，如果是字符串就直接显示，否则message.error会报错。而且还要判断是否是正常行为，如果是正常行为就不显示错误信息，而是显示正常信息
        if (typeof msgText === 'string') {
          message[isNormalBehavior ? 'info' : 'error'](msgText);
        }
      }

      return response;
    },
  ],
};
