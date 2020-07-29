import request from '../../utils/request';

// 公用接口获取下拉框
export function reqTreeList(){
    return request('treeSelect/queryChannelTree')
}


// 查询列表
export function reqChinnel(param) {
    param = JSON.stringify(param);
    return request('tagChannel/query', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: param,
    });
}

//授权
export function Auth(param){
    return request('tagChannel/auth?'+ param)
}

//取消授权
export function reqCancelAuth(param){
    return request('tagChannel/cancelAuth?' + param)
}

// 删除
export function reqDetelelist(param){
    return request('tagChannel/delete?' + param)
}

// 新增模态框里的tree列表的渲染
export function reqTreeNodeList(param){
    return  request('combobox/queryTagByJrxt?' + param)
}

// 新增一条数据
export function reqAddlist(param){
    param = JSON.stringify(param);
    return request('tagChannel/add', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: param,
    })
}

// 修改一条数据
export function reqUpdataList(param){
  param = JSON.stringify(param);
  return request('tagChannel/modify', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: param,
  })
}