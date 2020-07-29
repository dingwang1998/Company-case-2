import { message } from 'antd';
import * as Service from '../../services/customAnalysis/customAnalysis';

export default {
  namespace: 'storeCnd',
  state: {
    cndList: [],
  },
  reducers: {
    changeParamStateAux(state, { key, value }) {
      return {
        ...state,
        [key]: value,
      };
    },
  },
  effects: {
    *storeCurCondtion(action, { put, select }) {
      let cndList = yield select(state => state.storeCnd.cndList);
      // 断开引用关系 重新更新对象（更新引用的DOM执行render方法）
      cndList = JSON.parse(JSON.stringify(cndList));
      const resStateStroe = yield select(state => state.resultTable.resStateStroe);
      const total = yield select(state => state.resultTable.total);
      const cndition = {
        ...action.cndition,
        ...resStateStroe,
        total
      };
      cndList.push(cndition);
      yield put({
        type: 'changeParamStateAux',
        key: 'cndList',
        value: cndList
      });
    },
    *recoverCondtion(action, { call, put, select }) {
      const index = action.index;
      let cndList = yield select(state => state.storeCnd.cndList);
      // 断开引用关系 重新更新对象（更新引用的DOM执行render方法）
      cndList = JSON.parse(JSON.stringify(cndList));
      yield put({ type: 'changeParamStateAux', key: 'tableLoading', value: true });
      const res = yield call(Service.loadTable, cndList[index]);
      const fxsj = cndList[index].fxqj;
      const sjld = cndList[index].fxld;
      const yearValue = Number(fxsj.substr(0, 4));
      let sjwd = 'n';
      if (sjld === 'YF') sjwd = `${fxsj.substr(4, 6)}y`;
      if (sjld === 'JD') sjwd = `${fxsj.substr(4, 5)}j`;
      const kzxx = cndList[index].selectedKzxxList;
      let tagKzxx = [];
      kzxx.map(item => tagKzxx.push(item.name));
      yield put({ type: 'conditions/changeParamState', key: 'yearValue', value: yearValue });
      yield put({ type: 'conditions/changeParamState', key: 'sjwd', value: sjwd });
      yield put({ type: 'conditions/changeParamState', key: 'rq_value', value: sjwd });
      yield put({ type: 'conditions/changeParamState', key: 'rq_content', value: sjwd });
      yield put({ type: 'conditions/changeParamState', key: 'queryCondtions', value: cndList[index].queryCondtions.swjg_id });
      yield put({ type: 'resultTable/changeParamStateAux', key: 'columns', value: cndList[index].columns });
      yield put({ type: 'conditions/changeParamState', key: 'selectedTags', value: cndList[index].selectedKzxxList });
      yield put({ type: 'conditions/changeParamState', key: 'tagSetList', value: cndList[index].tagSetList });
      yield put({ type: 'conditions/changeParamState', key: 'tagKzxx', value: tagKzxx });
      yield put({ type: 'resultTable/changeParamStateAux', key: 'tableLoading', value: false });
      yield put({ type: 'resultTable/changeParamStateAux', key: 'tableData', value: [] });
      yield put({ type: 'resultTable/changeParamStateAux', key: 'total', value: 0 });
      yield put({ type: 'resultTable/changeParamStateAux', key: 'pageIndex', value: 1 });
      yield put({ type: 'resultTable/changeParamStateAux', key: 'pageSize', value: 25 });
      if (res.code === '600') {
        if (!res.data || res.data.length <= 0) {
          message.warn('无符合条件的纳税人，请重新选择标签');
        } else {
          yield put({ type: 'resultTable/changeParamStateAux', key: 'tableData', value: res.data });
          yield put({ type: 'resultTable/changeParamStateAux', key: 'total', value: res.total });
        }
      }
    },
  },
};
