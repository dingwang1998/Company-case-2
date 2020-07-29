/*
 * @Author: lijiam
 * @Date: 2020-03-16 09:23:50
 * @Description: description
 * @LastEditors: lijiam
 * @LastEditTime: 2020-03-19 15:29:45
 */
import request from '../../utils/request';

export function queryDatabaseTime() {
  return request('/queryDatabaseTime');
}

export function commonCombobox(dmlx) {
  return request(`/commonCombobox?dmlx=${dmlx}`);
}