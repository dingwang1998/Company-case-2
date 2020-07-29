/*
 * @Description:
 * @Author: [your name]
 * @Date: 2020-05-13 20:33:13
 * @LastEditors: [your name]
 * @LastEditTime: 2020-05-15 22:14:49
 * @FilePath: \labelmiddleplatform\src\models\customAnalysis\resultApplication.js
 */
import * as Service from '../../services/customAnalysis/resultApplication';
import { message } from 'antd';

export default {
	namespace: 'resultApplication',
	state: {
    total:0,
		labelList:[]
	},

	reducers: {
		setLabelList(state, { labelList }) {
			return { ...state, labelList };
    },
    setTotal(state, { total }) {
			return { ...state, total };
    }
	},
	effects: {
    *queryLabelList(action, { put, call, select }) {
      const res = yield call(Service.queryLabelList,action.params);
			if (res.code !== '600') {
        message.error(res.msg);
        return null;
      }else{
        yield put({ type: 'setLabelList', labelList: res.data });
        yield put({ type: 'setTotal', total: res.total });
        return res;
      }
    },
	},
};
