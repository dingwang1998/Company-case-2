/*
 * @Author: your name
 * @Date: 2020-05-16 17:11:43
 * @LastEditTime: 2020-05-20 10:21:44
 * @LastEditors: [your name]
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\services\customAnalysis\taskMonitoring.js
 */
import request from '../../utils/request';

//标签内容列表查询
export function queryLabelList(params) {
  return request(`tagUse/queryTagUseJhjk`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//标签关联应用
export function reRun(params) {
  return request(`tagUse/reRun`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}
