/*
 * @Description:
 * @Author: [your name]
 * @Date: 2020-05-13 14:51:16
 * @LastEditors: [your name]
 * @LastEditTime: 2020-05-15 13:47:31
 * @FilePath: \labelmiddleplatform\src\services\customAnalysis\resultApplication.js
 */
import request from '../../utils/request';

//标签内容列表查询
export function queryLabelList(params) {
  return request(`tagUse/queryTagUse`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//标签关联应用
export function linkLabelApp(params) {
  return request(`tagUse/saveTagUse`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}

