/*
 * @Author: lijiam
 * @Date: 2020-03-16 09:23:50
 * @Description: description
 * @LastEditors: [your name]
 * @LastEditTime: 2020-05-13 15:09:46
 */
import * as Services from '../../services/common/common';
import { message } from 'antd';

export default {
	namespace: 'common',
	state: {
    time:{}
	},
	effects: {
		*queryDatabaseTime(actions, { call, put }) {
			const res = yield call(Services.queryDatabaseTime);
			if (res.code !== '600') {
				message.error(res.msg);
				return null;
      }else{
        yield put({ type: 'setTime', time: res.data });
			  return res.data;
      }
		}
	},
	reducers: {
    setTime(state,{time}){
      return {...state,time}
    }
	}
};
