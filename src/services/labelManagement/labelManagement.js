import request from '../../utils/request';

export function querySwjgList() {
  return request(`treeSelect/swjgGhbm`);
}
export function queryMlList() {
  return request(`tagMl/whcx`);
}
//标签内容列表查询
export function queryLabelList(params) {
  return request(`tagNrwh/whcx`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(params),
  });
  
}
//标签删除
export function deleteLabel(bqdm) {
  return request(`tagNrwh/bqSc?bqdm=${bqdm}`);
}
//标签启用
export function enableLabel(bqdm) {
  return request(`tagNrwh/bqQy?bqdm=${bqdm}`);
}
//标签停用
export function disableLabel(bqdm) {
  return request(`tagNrwh/bqTy?bqdm=${bqdm}`);
}
//基础标签查看
export function viewJcLabel(bqdm) {
  return request(`tagNrwh/jcbqCk?bqdm=${bqdm}`);
}
//规则标签查看
export function viewGzLabel(bqdm) {
  return request(`tagNrwh/gzbqCk?bqdm=${bqdm}`);
}
//基础标签查看
export function viewSqlLabel(bqdm) {
  return request(`tagDefine/sql/query?bqdm=${bqdm}`);
}
