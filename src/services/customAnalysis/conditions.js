/*
 * @Author: your name
 * @Date: 2020-03-17 11:09:23
 * @LastEditTime: 2020-03-25 16:07:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\services\customAnalysis\condition.js
 */
import request from '../../utils/request';

/**
 * @description: 查询税务机关
 * @param {type} 
 * @return: 
 */
export function querySwjg(swjg) {
    return request('treeSelect/swjgGhbm');
}

/**
 * @description: 查询行业
 * @param {type} 
 * @return: 
 */
export function queryHy() {
    return request('/treeSelect/hyTree');
}

/**
 * @description: 查询登记注册类型
 * @param {type} 
 * @return: 
 */
export function queryDjzclx() {
    return request('/zzfx/djzclxTree');
}

/**
 * @description: 查询企业规模
 * @param {type} 
 * @return: 
 */
export function queryQygm() {
    return request('/zzfx/qygmTree');
}

/**
 * @description: 查询纳税人状态
 * @param {type} 
 * @return: 
 */
export function queryNsrzt() {
    return request('/zzfx/nsrztTree');
}

/**
 * @description: 查询增值税纳税人类型
 * @param {type} 
 * @return: 
 */
export function queryZzslx() {
    return request('/zzfx/zzsnsrzgTree');
}

/**
 * @description: 查询企业所得税征收方式
 * @param {type} 
 * @return: 
 */
export function queryQysdszsfs() {
    return request('/zzfx/qysdszsfsTree');
}

/**
 * 查询维度集合
 */
export function queryWdlist(param) {
    param = JSON.stringify(param);
    return request('/bqzt/zdyfx/queryWdList', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: param,
    });
  }

  /**
   * @description: 查询扩展信息
   * @param {type} 
   * @return: 
   */
  export function queryKzxx() {
    return request('/bqzt/zdyfx/kzxx');
  }

   /**
   * @description: 查询标签类型
   * @param {type} 
   * @return: 
   */
  export function queryTagType() {
    return request('/bqzt/zdyfx/queryTags');
  }

    /**
   * @description: 查询标签表格明细
   * @param {type} 
   * @return: 
   */
  export function queryTagList(param) {
    param = JSON.stringify(param);
    return request('/bqzt/zdyfx/queryTagList', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: param,
    });
  }