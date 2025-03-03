import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  loading?: boolean;
}> {
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    contentStyle: {
      // 这里的height设置，与基座的高度保持一致，只在子应用中保留滚动条，不显示基座的滚动条
      height: 'calc(100vh - 56px)',
      overflowY: 'scroll',
    },

    actionsRender: () => [],

    menuHeaderRender: undefined,

    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  // baseURL: 'https://proapi.azurewebsites.net',
  ...errorConfig,
};
