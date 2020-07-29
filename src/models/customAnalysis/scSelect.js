import * as Service from '../../services/customAnalysis/scSelect';

export default {
  namespace: 'scSelect',
  state: {
    scTypes: [], // 收藏分类列表
    scList: [], // 收藏记录列表
    scType: '', // 收藏分类代码
    scTypeMc: '', // 收藏分类名称
    keyWord: '', // 搜索关键词
    pageIndex: 1, // 分页相关数据
    total: -1, // 分页相关数据
    pageSize: 25, // 分页相关数据
    selectId: '', // 选中的收藏分类ID
    selectObj: {}, // 选中的收藏分类行
    bqList: [], // 标签列表
  },
  reducers: {
    changeParamStateAux(state, { key, value }) {
      return {
        ...state,
        [key]: value,
      };
    },
    changeAllState(state, { allState }) {
      return {
        ...state,
        ...allState,
      };
    },
  },
  effects: {
    *querySc(action, { call, put }) {
      const res = yield call(Service.querySc);
      yield put({ type: 'changeParamStateAux', key: 'scTypes', value: res.data || [] });
    },
    *queryScList(action, { call, put, select }) {
      const pageSize = yield select(state => state.scSelect.pageSize);
      const pageIndex = yield select(state => state.scSelect.pageIndex);
      const keyWord = yield select(state => state.scSelect.keyWord);
      const scid = yield select(state => state.scSelect.scType);
      const res = yield call(Service.queryScList, { pageSize, pageIndex, keyWord, scid });
      yield put({ type: 'changeParamStateAux', key: 'scList', value: res.data || [] });
      yield put({ type: 'changeParamStateAux', key: 'total', value: res.total });
    },
    *changeTableProps(action, { put, select }) {
      const storePageSize = yield select(state => state.scSelect.pageSize);
      yield put({ type: 'changeParamStateAux', key: 'pageIndex', value: action.pageIndex });
      yield put({ type: 'changeParamStateAux', key: 'pageSize', value: action.pageSize || storePageSize });
      yield put({ type: 'queryScList' });
    },
    *updateScName(action, { call }) {
      const res = yield call(Service.updateScName, { id: action.id, name: action.name, editType: action.editType, desc: action.desc });
      return res;
    },
    *deleteSc(action, { call }) {
      const res = yield call(Service.deleteSc, { id: action.id });
      return res;
    },
    *addOneCol(action, { call }) {
      const res = yield call(Service.addOneCol, action.params);
      return res;
    },
  },
};
