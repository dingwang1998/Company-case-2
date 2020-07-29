
import * as Service from '../../services/customAnalysis/conditions.js';
import * as CommonUtils from '../../utils/commonUtils';


export default {
  namespace: 'conditions',
  state: {
    // 条件查询数据
    swjgList: [], // 税务机关
    hyList: [], // 行业
    djzclxList: [], // 登记注册类型
    qygmList: [], // 企业规模
    nsrztList: [], // 纳税人状态
    zzslxList: [], // 增值税纳税人类型
    qysdszsfsList: [], // 企业所得税征收方式
    swjg_id: [], // 税务机关(已选中)
    hy_id: [], // 行业(已选中)
    djzclx_id: [], // 登记注册类型(已选中)
    qygm_id: [], // 企业规模(已选中)
    swdjcxys_start: '', // 税务登记持续月数(开始值)
    swdjcxys_end: '', // 税务登记持续月数（结束值）
    nsrzt_id: [{ wdz: '03', wdzd: 'NSRZT_ID' }],
    zzsnsrlx_id: [], // 增值税纳税人类型(已选中)
    zsfs_id: [],// 企业所得税征收方式(已选中)
    yearValue: new Date().getFullYear() - 1, // 年份
    sjwd: 'n', // 时间维度
    rq_value: 'n',
    rq_content: 'n',
    tagKzxx: [], 
    tagKzxxDetail: [],
    kzWindowShow: false,//扩展信息弹窗状态
    selectedTags: [
      // {
      //   id: "NSRSBH",
      //   code: "NSRSBH",
      //   name: "纳税人识别号",
      //   ywlx: "NSR",
      //   vtype: "CHAR"
      // }
    ], // 选中的标签对象
    wdMap: {}, // 维度查询结果
    tagSetList: [],//标签设置集合
    tagpageIndex: 1, // 标签分页相关数据
    tagTotal: 0, // 标签总条数
    tagpageSize: 25, // 标签分页
    tagCheck: [""], // 标签默认全部
    tagCode: '',
    tagType: [],//标签类型
    tagList: [],//tag表格查询结果
    keyWord: '',
    tagWindowShow: false,
    isTagLoad: false,

  },
  reducers: {
    /**
     * @description: 树形统一转换
     * @param {type} 
     * @return: 
     */
    initCondListData(state, { op, listData }) {
      const newListData = CommonUtils.buildTreeSelectData(listData);
      return {
        ...state,
        [`${op}List`]: newListData,
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
    /**
     * @description: 暂存查询条件
     * @param {type} 
     * @return: 
     */
    saveParamToStore(state, {
      djzclx_id,
      qygm_id,
      swdjcxys_start,
      swdjcxys_end,
      nsrzt_id,
      zzsnsrlx_id,
      zsfs_id,
    }) {
      return {
        ...state,
        djzclx_id,
        qygm_id,
        swdjcxys_start,
        swdjcxys_end,
        nsrzt_id,
        zzsnsrlx_id,
        zsfs_id,
      };
    },

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
  },
  effects: {
    /**
   * 查询行业
   * @param {*} action
   * @param {*} param1
   */
    *queryHy(action, { call, put }) {
      const res = yield call(Service.queryHy);
      yield put({ type: 'initCondListData', op: 'hy', listData: res.data });
    },
    /**
   * 查询税务机关
   * @param {*} action
   * @param {*} param1
   */
    *querySwjg(action, { call, put }) {
      const res = yield call(Service.querySwjg, action.swjg);
      yield put({ type: 'initCondListData', op: 'swjg', listData: res.data || [] });
      action.resolve();
    },
    /**
   * 
   * @param {*} action
   * @param {*} param1
   */
    *queryDjzclx(action, { call, put }) {
      const res = yield call(Service.queryDjzclx);
      yield put({ type: 'initCondListData', op: 'djzclx', listData: res });
    },
    /**
     * 查询企业规模
     * @param {*} action
     * @param {*} param1
     */
    *queryQygm(action, { call, put }) {
      const res = yield call(Service.queryQygm);
      yield put({ type: 'initCondListData', op: 'qygm', listData: res });
    },
    /**
     * 查询纳税人状态类型
     * @param {*} action
     * @param {*} param1
     */
    *queryNsrzt(action, { call, put }) {
      const res = yield call(Service.queryNsrzt);
      yield put({ type: 'initCondListData', op: 'nsrzt', listData: res });
    },
    /**
    * 查询企业所得税征收方式
    * @param {*} action
    * @param {*} param1
    */
    *queryQysdszsfs(action, { call, put }) {
      const res = yield call(Service.queryQysdszsfs);
      yield put({ type: 'initCondListData', op: 'qysdszsfs', listData: res });
    },
    /**
    * 查询类型
    * @param {*} action
    * @param {*} param1
    */
    *queryZzslx(action, { call, put }) {
      const res = yield call(Service.queryZzslx);
      yield put({ type: 'initCondListData', op: 'zzslx', listData: res });
    },
    /**
     * 标签选择
     * @param {*} action
     * @param {*} param1
     */
    *changeTagKzxx(action, { call, put, select }) {
      const tagKzxx = action.tagKzxx;
      // 原扩展信息
      const tagKzxxDetail = yield select(state => state.conditions.tagKzxxDetail);
      const kzxxArray = []; // 选择的所有扩展信息列
      const kzxxKeyMap = {}; // key 去重
      const wdKzxxArray = []; // 选择的所有扩展信息列(维度型的)
      for (let i = 0; i < tagKzxxDetail.length; i++) {
        const kzxxs = tagKzxxDetail[i].kzxxs;
        for (let j = 0; j < kzxxs.length; j++) {
          kzxxKeyMap[kzxxs[j].name] = kzxxs[j];
        }
      }
      for (let i = 0; i < tagKzxx.length; i++) {
        const kzxxDetail = kzxxKeyMap[tagKzxx[i]];
        if (kzxxDetail) {
          kzxxArray.push(kzxxDetail);
          if (kzxxDetail.vtype === 'WD') {
            wdKzxxArray.push(kzxxDetail);
          }
        }
      }
      yield put({
        type: 'changeAllState',
        allState: {
          tagKzxx,
          extensionColums: kzxxArray,
          isAddCol: true,
          selectedTags: kzxxArray,
        },
      });
      for (let i = 0, ilen = wdKzxxArray.length; i < ilen; i++) {
        // 延时2s的作用 1.结束动画 2.判断overtime的准确值
        yield call(CommonUtils.delay, 2000);
        yield put({ type: 'updateWdMap', kzxx: wdKzxxArray[i] });
      }
    },

    /**
    * 更新维度字段
    */
    *updateWdMap(action, { call, put, select }) {
      const kzxx = action.kzxx;
      const code = kzxx.code;
      const wdMap = CommonUtils.deepCopy(yield select(state => state.conditions.wdMap));
      if (kzxx.vtype === 'WD' && !wdMap[code]) {
        const res = yield call(Service.queryWdlist, { ywlx: kzxx.ywlx, wddm: code });
        // 有返回值再暂存
        if (res && res.data.length > 0) {
          wdMap[code] = res.data;
          yield put({ type: 'changeParamState', key: 'wdMap', value: wdMap });
        }
      }
    },
    /**
   * 查询扩展信息
   * @param {*} action
   * @param {*} param1
   */
    *queryKzxx(action, { call, put }) {
      const res = yield call(Service.queryKzxx);
      const tagKzxxDetail = res.data || [];

      yield put({ type: 'changeParamState', key: 'tagKzxxDetail', value: tagKzxxDetail });
      if (action.resolve) {
        action.resolve();
      }
    },

    /**
     * 查询标签类型
     * @param {*} action
     * @param {*} param1
     */
    *queryTagType(action, { call, put }) {
      const res = yield call(Service.queryTagType);
      const tagType = res.data || [];
      yield put({ type: 'changeParamState', key: 'tagType', value: tagType });
      if (action.resolve) {
        action.resolve();
      }
    },

    *queryTagList(action, { call, put, select }) {
      const pageSize = yield select(state => state.conditions.tagpageSize);
      const pageIndex = yield select(state => state.conditions.tagpageIndex);
      let bqMlId = yield select(state => state.conditions.tagCheck);
      const bqMc = yield select(state => state.conditions.keyWord);
      bqMlId = bqMlId[0];
      const params = {
        pageSize,
        pageIndex,
        bqMlId,
        bqMc,
      };
      const res = yield call(Service.queryTagList, params);

      if (res.code === '600') {
        const tagList = res.data;
        yield put({ type: 'changeParamState', key: 'tagList', value: tagList });
        yield put({ type: 'changeParamState', key: 'tagTotal', value: res.total });
      } else {
        yield put({ type: 'changeParamState', key: 'tagList', value: [] });
        yield put({ type: 'changeParamState', key: 'tagTotal', value: 0 });
      }
    }

  },
};
