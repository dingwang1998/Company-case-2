/*
 * @Author: your name
 * @Date: 2020-05-16 17:25:25
 * @LastEditTime: 2020-05-16 17:31:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\models\customAnalysis\taskMonitoring.js
 */
import * as Service from '../../services/customAnalysis/taskMonitoring';
import { message } from 'antd';

export default {
  namespace: 'taskMonitoring',
  state: {
    total: 0,
    labelList: []
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
