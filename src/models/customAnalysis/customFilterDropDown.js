/*
 * @Author: your name
 * @Date: 2020-03-17 18:07:36
 * @LastEditTime: 2020-03-28 17:43:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\models\customAnalysis\customFilterDropDown.js
 */

export default {

	namespace: 'customFilterDropDown',

	state: {
    wdMap: {},
    sort: {
      /* sortBy: 'NSRMC',
      sortDirection: 'DESC' */
    },
    allFilterCondition: {
      /* "SHXYDM": {
        operation: 'LIKE',
        values: ['110'],
        vtype: 'CHAR'
      } */
    },
    hint: {
      labelIds: [],
      hints: 0,
      htype: ''
    }
	},

	subscriptions: {
		setup({ dispatch, history }) {  // eslint-disable-line
		},
	},

	effects: {
		*fetch({ payload }, { call, put }) {  // eslint-disable-line
			yield put({ type: 'save' });
    },
    *changeHint({ hint }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeParamStateAux', key: 'hint', value: hint });
      //yield put({ type: 'resultTable/loadTable'});
    },
    *changeFilterCondition({ allFilterCondition }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeParamStateAux', key: 'allFilterCondition', value: allFilterCondition });
      yield put({ type: 'resultTable/loadTable'});
    },
    *changeSort({ sort }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeParamStateAux', key: 'sort', value: sort });
      yield put({ type: 'resultTable/loadTable'});
    },
	},

	reducers: {
    changeParamStateAux(state, { key, value }) {
      return {
        ...state,
        [key]: value
      }
    },
    changeAllCondition(state, { condition }) {
      return {
        ...state,
        allFilterCondition: condition,
      };
    },
	}
};
