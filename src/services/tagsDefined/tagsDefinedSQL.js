/*
 * @Author: your name
 * @Date: 2020-03-16 18:38:40
 * @LastEditTime: 2020-03-24 14:37:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\services\tagsDefined\tagsDefinedSQL.js
 */
import request from '../../utils/request';

export function query() {
  return request('/api/users');
}

/**
 * 标签自定义sql语句验证
 */
export function checkedSql(param) {
  param = JSON.stringify(param);
  return request('tagDefine/sql/checkSql', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: param,
  });
}



