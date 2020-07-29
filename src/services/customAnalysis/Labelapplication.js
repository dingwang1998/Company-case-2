import request from '../../utils/request';


// 初始化页面,渲染下拉框
export function reqCommonSelect(param){
    return request('commonCombobox?dmlx='+ param)
}

//标签应用情况查询
export function reqSearchquery(param){
    return request('tagUseCount/query',{
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(param),
    })
}

//标签应用情况 按标签钻取
export function reqLabelquery(param){
    return request('tagUseCount/queryAbq',{
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(param),
    })
}

// 按标签钻取-next税务机关
export function reqLabelnextquery(param){
    return request('tagUseCount/queryAbqNextSwjg',{
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(param),
    })
}


// 按命名总数钻取
export function reqNextTotal(param){
    return request('tagUseCount/queryMx',{
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(param),
    })
}

// 标签应用 按税务机关钻取
export function reqTaxationquery(param){
    return request('tagUseCount/queryAswjg',{
        headers: {
            'Content-Type': 'application/json',
         },
       method: 'POST',
        body: JSON.stringify(param),
    })
}

// 按税务机关钻取-next标签
export function reqTaxationqueryNext(param){
    return request('tagUseCount/queryAswjgNextBq',{
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(param),
    })
}
