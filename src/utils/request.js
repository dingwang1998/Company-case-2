/*
 * @Author: lijiam
 * @Date: 2020-03-16 09:23:50
 * @Description: description
 * @LastEditors: lijiam
 * @LastEditTime: 2020-03-17 14:43:48
 */
import fetch from 'dva/fetch';
import qs from 'qs';
import { message } from 'antd';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options={}) {
	url = '/tagfactory' +(url[0]==='/'?url:('/'+url)) ;
  // 拼装get参数到url
  if(options && options.method === 'GET') {
    const params = options.params || {};
    url += '?' + qs.stringify(params, { arrayFormat: 'brackets' });
	}
	options.credentials = 'include';
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
			if(data.code!=='600'){
				message.error(data.msg||data.errMsg||`请求失败！地址（${url}）`);
			}
			return data;
		})
    .catch(err => ({ err }));
}
