import { message } from 'antd';
import * as Service from '../../services/customAnalysis/customAnalysis';
import * as commonUtils from '../../utils/commonUtils';
export default {

  namespace: 'resultTable',

  state: {
    baseInfoColumns: [
      {
        code: 'SHXYDM',
        format: null,
        index: 1,
        name: '社会信用代码',
        sfzs: 'Y',
        vtype: 'CHAR',
        sfkpx: null,
        sfkgl: null,
        sfkfz: null,
        head: null,
        link: null,
        sort: null,
        ywlx: 'NSR',
      },
      {
        code: 'NSRMC',
        format: null,
        index: 3,
        name: '纳税人名称',
        sfzs: 'Y',
        vtype: 'CHAR',
        ywlx: 'NSR',
        sfkpx: null,
        sfkgl: null,
        sfkfz: null,
        head: null,
        sort: null,
      }
    ],
    columns: [],
    // 暂存查询条件
    resStateStroe: {},
    isAddCol: false,
    // 表格loading
    tableLoading: false,
    // 表格数据
    tableData: [],
    pageIndex: 1,
    pageSize: 25,
    total: 0
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *changePager(action, { call, put, select }) {
      yield put({ type: 'changeParamStateAux', key: 'pageIndex', value: action.pageIndex });
      yield put({ type: 'changeParamStateAux', key: 'pageSize', value: action.pageSize });
      yield put({ type: 'loadTable' });
    },
    *loadTable(action, { call, put, select }) {
      const yearValue = yield select(state => state.conditions.yearValue);
      const sjwd = yield select(state => state.conditions.sjwd);
      const { fxsj, sjld } = commonUtils.praseSjInfo(yearValue, sjwd);
      const swjg_id = yield select(state => state.conditions.swjg_id);
      const queryCondition = { swjg_id };
      const columns = yield select(state => state.resultTable.columns);
      const tagSetList = yield select(state => state.conditions.tagSetList);
      const allFilterCondition = yield select(state => state.customFilterDropDown.allFilterCondition);
      const hint = yield select(state => state.customFilterDropDown.hint);
      const sort = yield select(state => state.customFilterDropDown.sort);
      const selectedKzxxList = yield select(state => state.conditions.selectedTags);
      const total = yield select(state => state.resultTable.total);
      const pageIndex = yield select(state => state.resultTable.pageIndex);
      const pageSize = yield select(state => state.resultTable.pageSize);
      if (tagSetList && tagSetList.length > 0) {
        yield put({ type: 'changeParamStateAux', key: 'tableLoading', value: true });
        let params = { fxqj:fxsj, fxld:sjld, queryCondtions:queryCondition, columns, tagSetList, allFilterCondition, hint, sort, selectedKzxxList, total, pageIndex, pageSize};
        // 暂存查询条件
        yield put({ type: 'changeParamStateAux', key: 'resStateStroe', value: params });
        // 查询表格数据
        const res = yield call(Service.loadTable, params);
        yield put({ type: 'changeParamStateAux', key: 'tableLoading', value: false });
        yield put({ type: 'changeParamStateAux', key: 'tableData', value: [] });
        yield put({ type: 'changeParamStateAux', key: 'total', value: 0 });
        if (res.code === '600') {
          if (!res.data || res.data.length <= 0) {
            message.warn('无符合条件的纳税人，请重新选择标签');
          } else {
            yield put({ type: 'changeParamStateAux', key: 'tableData', value: res.data });
            yield put({ type: 'changeParamStateAux', key: 'total', value: res.total });
          }
        }
      } else {
        message.warn('请选择标签');
      }
    },
    *exportTable({ payload }, { call, put, select }) {
      const resStateStroe = yield select(state => state.resultTable.resStateStroe);
      // 查询表格数据
      const res = yield call(Service.exportTable, { ...resStateStroe, exportType: payload.exportType });
      payload.resolve(res);
    }
  },

  reducers: {
    changeParamStateAux(state, { key, value }) {
      return {
        ...state,
        [key]: value
      }
    },
  }
};
