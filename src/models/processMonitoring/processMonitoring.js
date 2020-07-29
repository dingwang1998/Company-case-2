/*
 * @Author: lijiam
 * @Date: 2020-03-16 09:23:50
 * @Description: 加工结果监控的state
 * @LastEditors: lijiam
 * @LastEditTime: 2020-03-19 14:45:13
 */
import * as Service from '../../services/processMonitoring/processMonitoring';

export default {
	namespace: 'processMonitoring',
	state: {
		total: 0,
		tableList: []
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
		*tagJgjkCx(action, { call, put, select }) {
			const res = yield call(Service.tagJgjkCx, action.params);
			yield put({ type: 'changeParamStateAux', key: 'total', value: res.total });
			yield put({ type: 'changeParamStateAux', key: 'tableList', value: res.data || [] });
		},
		*tagJgjkRerun(action, { call, put, select }) {
			return yield call(Service.tagJgjkRerun, action.bqdms);
		},
	},
};
