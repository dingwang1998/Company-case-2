/*
 * @Author: lijiam
 * @Date: 2020-03-16 09:23:50
 * @Description: description
 * @LastEditors: lijiam
 * @LastEditTime: 2020-03-19 18:57:53
 */
import * as Services from '../../services/app/app';

export default {

	namespace: 'app',

	state: {
		labels: [],
		curLabel: 'tagsDefined',
		curPageRoute:{
			key:'',
			url:''
		},
		noContent: false,
		user: null, // 用户信息
	},

	subscriptions: {
		setup({ dispatch, history }) {  // eslint-disable-line
		},
	},

	effects: {
		*fetch({ payload }, { call, put }) {  // eslint-disable-line
			yield put({ type: 'save' });
		},
		*queryUserInfo(action, { call, put }) {
			const res = yield call(Services.queryUserInfo);
			if (res.code === '600') yield put({ type: 'initUser', user: res.data });
		}
	},
	reducers: {
		setCurPageRoute(state, action) {
			return { ...state, curPageRoute: action.curPageRoute };
		},
		setLabels(state, action) {
			return { ...state, labels: action.payload.labels };
		},
		setCurLabel(state, action) {
			return { ...state, curLabel: action.payload.curLabel };
		},
		setNoContent(state, action) {
			return { ...state, noContent: action.payload.noContent };
		},
		initUser(state, { user }) {
			return { ...state, user };
		}
	}
};
