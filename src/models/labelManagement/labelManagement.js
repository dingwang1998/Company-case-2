import * as Service from '../../services/labelManagement/labelManagement';

export default {
	namespace: 'labelManagement',
	state: {
		isViewMode:'1'//当前展示的组件
	},
	
	reducers: {
		setViewModel(state, action) {
			return { ...state, isViewMode: action.payload.isViewMode };
		}
	},
	effects: {
    *querySwjgList(action, { call, put, select }) {
      return yield call(Service.querySwjgList);
    },
    *queryMlList(action, { call, put, select }) {
      return yield call(Service.queryMlList);
    },
    *queryLabelList(action, { call, put, select }) {
      return yield call(Service.queryLabelList, action.params);
    },
    *deleteLabel(action, { call, put, select }) {
      return yield call(Service.deleteLabel, action.bqdm);
    },
    *enableLabel(action, { call, put, select }) {
      return yield call(Service.enableLabel, action.bqdm);
    },
    *disableLabel(action, { call, put, select }) {
      return yield call(Service.disableLabel, action.bqdm);
    },
    *viewJcLabel(action, { call, put, select }) {
      return yield call(Service.viewJcLabel, action.bqdm);
    },
    *viewGzLabel(action, { call, put, select }) {
      return yield call(Service.viewGzLabel, action.bqdm);
    },
    *viewSqlLabel(action, { call, put, select }) {
      return yield call(Service.viewSqlLabel, action.bqdm);
    },
	},
};