import request from '../../utils/request';

/**
 * @description: 查询收藏目录列表
 * @param {type} 
 * @return: 
 */
export function querySc() {
  return request('/zzfx/querySc');
}

/**
 * @description: 查询收藏记录列表
 * @param {type} 
 * @return: 
 */
export function queryScList(params) {
  return request('/zzfx/queryScList', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * @description: 新增或修改收藏目录
 * @param {type} 
 * @return: 
 */
export function updateScName(params) {
  return request('/zzfx/updateScName', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * @description: 删除收藏目录
 * @param {type} 
 * @return: 
 */
export function deleteSc(params) {
  return request('/zzfx/deleteSc', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * @description: 新增一条收藏记录
 * @param {type} 
 * @return: 
 */
export function addOneCol(params) {
  return request('/zzfx/addOneCol', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
}
