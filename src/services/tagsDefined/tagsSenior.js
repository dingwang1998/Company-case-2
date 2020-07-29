import request from '../../utils/request';

// 请求列表信息 查询请求都在这里
export function reqTagsList(params) {
    return request('tagDefine/advanced/queryList',{
        headers:{
            'Content-Type': 'application/json',
        },
        method:'POST',
        body: JSON.stringify(params)
    });
}

// 更新启用或者停用的状态
export function reqUpdataZT(params){
    return request('tagDefine/advanced/kzQyzt',{
        headers:{
            'Content-Type': 'application/json',
        },
        method:'POST',
        body: JSON.stringify(params)
    })
}

// 修改表数据和保存sql页面都在这
export function reqSaveData(params){
    return request('tagDefine/advanced/save',{
        headers:{
            'Content-Type': 'application/json',
        },
        method:'POST',
        body: JSON.stringify(params)
    })
}

// 根据服务名称去查表对应的sql信息
export function reqGetsql(bqdm) {
    return request(`tagDefine/advanced/query?fwbh=${bqdm}`);
}

// 验证sql
export function compareSql(param) {
    param = JSON.stringify(param);
    return request('tagDefine/sql/checkSql', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: param,
    });
}

// 查询高级标签删除
export function reqDeleteList(bqdm){
    return request(`tagDefine/advanced/del?fwbh=${bqdm}`)
}