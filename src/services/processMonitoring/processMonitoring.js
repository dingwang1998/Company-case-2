/*
 * @Author: lijiam
 * @Date: 2020-03-16 09:23:50
 * @Description: 加工结果监控服务层
 * @LastEditors: lijiam
 * @LastEditTime: 2020-03-17 16:36:43
 */
import request from '../../utils/request';

export function tagJgjkCx(params) {
  return request('/tagJgjk/cx', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function tagJgjkRerun(bqdms) {
  return request('tagJgjk/rerun', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ bqdms })
  });
}