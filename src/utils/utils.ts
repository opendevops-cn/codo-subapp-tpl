import { history } from '@umijs/max';
import Cookies from 'js-cookie';

export const AUTH_KEY = 'auth-key';
export function getUserToken() {
  return localStorage.getItem(AUTH_KEY);
}

export function setUserToken(token: string) {
  return localStorage.setItem(AUTH_KEY, token);
}

export const USER_INFO_KEY = 'user-info';

export function delUserInfo() {
  return localStorage.removeItem(USER_INFO_KEY);
}

/**
 * Get the root domain of the current website
 */
export function getRootDomain() {
  const hostname = window.location.hostname;
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/; // Regular expression to check if hostname is an IP address
  if (ipPattern.test(hostname)) {
    // If hostname is an IP address, return it directly
    return hostname;
  }
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return '.' + parts.slice(-2).join('.');
  }
  return hostname;
}

export function delUserToken() {
  Cookies.remove('auth_key'); // 暂用
  Cookies.remove('sso_token'); // 暂用
  Cookies.remove('is_login'); // 暂用
  Cookies.remove('auth_key', { domain: getRootDomain() }); // 暂用
  localStorage.removeItem(AUTH_KEY);
  delUserInfo();
}

/**
 * 跳转到登录页面，并携带当前页面的路径，登录成功后跳转回来
 */
export function redirectToLogin() {
  const { search, pathname } = window.location;
  const urlParams = new URL(window.location.href).searchParams;
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect') || urlParams.get('c_url');
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    if (window.__POWERED_BY_QIANKUN__) {
      // 当为微前端模式，跳转到主应用登录页
      window.location.href = `${location.origin}/user/login?c_url=${encodeURIComponent(
        window.location.href,
      )}`;
    } else {
      // 实际上用不到，因为由基座来控制登录
      history.replace({
        pathname: '/user/login',
        search: new URLSearchParams({
          // redirect: pathname + search,
          c_url: pathname + search,
        }).toString(),
      });
    }
  }
}

/**
 * 处理未认证用户
 */
export function handleUnauthenticatedUser() {
  delUserToken();
  redirectToLogin();
}
