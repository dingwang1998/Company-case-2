/*
 * @Author: your name
 * @Date: 2020-03-16 18:38:40
 * @LastEditTime: 2020-03-25 14:21:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\services\tagsDefined\tagsDefined.js
 */
import request from '../../utils/request';

export function treeSelect(mapper="") {
  return request(`/treeSelect/queryYsjbTree?mapper=${mapper}`);
}
//基础标签定义获取数据列列表
export function queryYsjbzdList(params={ysjb:""}) {
	return request('/tagDefine/baseTag/queryYsjbzdList', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST', 
    body: JSON.stringify(params),
  });
}
//基础标签目录树
export function queryBqmlTree() {
  return request(`treeSelect/queryBqmlTree`);
}

export function swjgGhbm() {
  return request(`treeSelect/swjgGhbm`);
}

//标签定义（基础标签）保存/修改
export function save(params) {
  return request('/tagDefine/baseTag/save', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST', 
    body: JSON.stringify(params),
  });
}

//标签内容维护（基础标签查看）
export function jcbqCk(bqdm="") {
  return request(`agNrwh/jcbqCk?bqdm=${bqdm}`);
}

//标签内容维护（基础标签修改）
export function jcbqXgcx(bqdm="") {
  return request(`tagNrwh/jcbqXgcx?bqdm=${bqdm}`);
}


//规则标签定义获取数据列列表
export function queryJcbqList(params={bqmldm:""}) {
	return request('tagDefine/ruleTag/queryJcbqList', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST', 
    body: JSON.stringify(params),
  });
}

//规则标签目录树
export function jcbqmlTree() {
  return request(`tagDefine/ruleTag/jcbqmlTree`);
}

//标签内容维护（规则标签修改）
export function gzbqXgcx(bqdm="") {
  return request(`tagNrwh/gzbqXgcx?bqdm=${bqdm}`);
}
//标签内容维护（sql查看详情）
export function sqlbqXgcx(bqdm="") {
  return request(`tagDefine/sql/query?bqdm=${bqdm}`);
}

//标签定义（SQL标签）保存/修改
export function saveSqlDefined(params) {
  return request('tagDefine/sql/save', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST', 
    body: JSON.stringify(params),
  });
}


//标签定义（规则标签）保存/修改
export function saveGZDefined(params) {
  return request('tagDefine/ruleTag/save', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST', 
    body: JSON.stringify(params),
  });
}