/*
 * @Author: your name
 * @Date: 2020-03-16 18:38:40
 * @LastEditTime: 2020-03-24 16:05:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\services\customAnalysis\customAnalysis.js
 */
import request from '../../utils/request';

export function loadTable(params) {
  return request('/bqzt/zdyfx/loadTable', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function exportTable(params) {
  return request('/bqzt/zdyfx/export', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}