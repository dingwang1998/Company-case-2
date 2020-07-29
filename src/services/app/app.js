import request from '../../utils/request';

export function queryUserInfo() {
  return request('/bqzt/queryUserInfo');
}