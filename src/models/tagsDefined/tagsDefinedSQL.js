/*
 * @Author: your name
 * @Date: 2020-03-16 18:38:40
 * @LastEditTime: 2020-03-25 15:40:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\models\tagsDefined\tagsDefinedSQL.js
 */
import * as Service from '../../services/tagsDefined/tagsDefinedSQL';
export default {

	namespace: 'tagsDefinedSQL',

	state: {
		sql: '',
		isPass: null,
		tableResult: [],
		errorMsg: ''

	},

	subscriptions: {
		setup({ dispatch, history }) {  // eslint-disable-line
		},
	},

	effects: {
		*fetch({ payload }, { call, put }) {  // eslint-disable-line
			yield put({ type: 'save' });
		},

		/**
		 * @description: 标签自定义sql查看详情
		 * @param {type} 
		 * @return: 
		 */
		*checkedSql(action, { call, put, select }) {
			const sql = yield select(state => state.tagsDefinedSQL.sql);
			var params = {
				sql,
			};
			const res = yield call(Service.checkedSql, params);
			const isPass = res.data.checkState;
			const tableResult = res.data.result;
			const errorMsg = res.data.errorMsg;
			yield put({
				type: 'changeAllState',
				allState: {
					isPass,
					tableResult,
					errorMsg
				},
			});
		},
	},

	reducers: {
		/**
		 * @description: 改变多个参数
		 * @param {type} 
		 * @return: 
		 */
		changeAllState(state, { allState }) {
			return {
				...state,
				...allState,
			};
		},
		/**
		 * @description: 改变传入参数值
		 * @param {type} 
		 * @return: 
		 */
		changeParamState(state, { key, value }) {
			return {
				...state,
				[key]: value,
			};
		},
	}
};
