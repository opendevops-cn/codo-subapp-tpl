// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { RuleList, RuleListItem } from './data';
// import { TableListItem } from './data';

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<RuleList>('/apitest/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /apitest/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<RuleListItem>('/apitest/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /apitest/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<RuleListItem>('/apitest/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /apitest/rule */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/apitest/rule', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
