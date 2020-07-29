/* eslint-disable*/
/**
 * 平铺树数据结构生成器
 * Treeslect treeDataSimpleMode
 * @param {*} listData
 * @return [{},{}]  {id,value,title,wdzd,pId}
 */
export function buildTreeSelectData(listData) {
  return listData && listData.length > 0 && listData.map((item) => {
    return ({
      ...item,
      id: item.wdid || item.wdz,
      value: item.wdz,
      title: item.wdmc,
      pId: item.pid,
    });
  }) || [];
}
/**
 * 多级树数据结构生成器
 * Treeslect treeDataSimpleMode
 * @param {*} data
 * @param {*} pId
 *
 * @return {}
 */
export function convertToTreeData(list) {
  const temp = {};
  const tree = {};
  for (const i in list) {
    temp[list[i].id] = list[i];
  }
  for (const i in temp) {
    if (temp[i].pId) {
      if (!temp[temp[i].pId].children) {
        temp[temp[i].pId].children = {};
      }
      temp[temp[i].pId].children[temp[i].id] = temp[i];
    } else {
      tree[temp[i].id] = temp[i];
    }
  }
  return tree;
}

export function praseSjInfo(yearValue, sjwd) {
  let fxsj = `${yearValue}`;
  let sjld = '';
  if (!sjwd || sjwd === 'n') {
    sjld = 'ND';
  } else {
    if (sjwd.charAt(sjwd.length - 1) === 'j') {
      sjld = 'JD';
    } else {
      sjld = 'YF';
    }
    fxsj += sjwd.substr(0, sjwd.length - 1);
  }
  return {
    sjld,
    fxsj,
  };
}

/**
 * 判断风险点中元素的个数
 * @param {*} condition Object
 */
export function countYsSizeInCondition(condition) {
  const countCondtionItems = (condition, objNum) => {
    if (condition) {
      if (condition.element) {
        // eslint-disable-next-line no-param-reassign
        objNum.num++;
      }

      if (condition.condition) {
        countCondtionItems(condition.condition, objNum);
      }

      if (condition.length > 0) {
        for (let i = 0; i < condition.length; i++) {
          countCondtionItems(condition[i], objNum);
        }
      }
    }
  };
  const objNum = {
    num: 0,
  };
  countCondtionItems(condition, objNum);
  return objNum.num;
}

/**
 * 对象的深拷贝
 * JSON.parse(),JSON.stringify()兼容性问题
 * @param {*} obj
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
const ErrInfo = {
  TJCS: '条件参数未设置',
  GDZ: '固定值未设置',
  DATE: '起止日期未设置',
  TIME: '起止时间未设置',
  BOOL: '未设置值',
  NULL: ' 未设置值',
};
const creatErrInfo = (ret, errType, errEle) => {
  ret.push({
    errType,
    errDesc: ErrInfo[errType],
    errEle,
  });
};
/**
 * 校验风险点中元素值
 * @param {*} condition Object
 */
export function validateCondition(condition) {
  const validateOnecnd = (cnd, retObj) => {
    if (cnd.element) {
      if (cnd.element.name === '请选择') {
        creatErrInfo(retObj, 'NULL', cnd.element);
        return;
      }
      if (cnd.element.vtype === 'BOOL' && (cnd.element.operator === undefined || cnd.element.operator === '')) {
        creatErrInfo(retObj, 'BOOL', cnd.element);
        return;
      }
      if (cnd.element.operator !== 'FOREVEREQ' && cnd.element.operator !== 'NOTNULL' && cnd.element.operator !== 'ISNULL' && cnd.element.vtype !== 'BOOL') {
        if (cnd.element.values === undefined) {
          // 未设置值
          creatErrInfo(retObj, 'NULL', cnd.element);
          return;
        }
        if (cnd.element.value === '1jy' || cnd.element.value === '1bjy' || cnd.element.value === '4jy' || cnd.element.value === '4bjy') {
          // 未设置起始值或者结束值
          if (cnd.element.values[0] === undefined || cnd.element.values[0] === '' || cnd.element.values[1] === undefined || cnd.element.values[1] === '') {
            creatErrInfo(retObj, 'NULL', cnd.element);
          }
        } else if (cnd.element.vtype === 'DATE' || cnd.element.vtype === 'TIME') {
          // 未设置起始值和结束值
          if ((cnd.element.values[0] === undefined || cnd.element.values[0] === '') && (cnd.element.values[1] === undefined || cnd.element.values[1] === '')) {
            creatErrInfo(retObj, cnd.element.vtype, cnd.element);
          }
        } else if (cnd.element.value === '1day' || cnd.element.value === '4day'
          || cnd.element.value === '1xy' || cnd.element.value === '4xy'
          || cnd.element.value === '1xydy' || cnd.element.value === '4xydy'
          || cnd.element.value === '1dydy' || cnd.element.value === '4dydy') {
          if (cnd.element.cslx === 'GDZ') {
            // 固定值未设置值
            if (cnd.element.values[0] === undefined || cnd.element.values[0] === '') {
              creatErrInfo(retObj, 'GDZ', cnd.element);
            }
          } else if (cnd.element.cslx === 'TJCS') {
            const tjcs = cnd.element.tjcs;
            if (!tjcs) {
              // 条件参数未设置
              creatErrInfo(retObj, 'TJCS', cnd.element);
            } else {
              if (tjcs.mrz === undefined || tjcs.mrz === '') {
                // 条件参数未设置默认值
                creatErrInfo(retObj, 'TJCS', cnd.element);
              }
              // 条件参数未设置明细值
              const tjcsMx = tjcs.tjcsMx;
              if (tjcsMx && tjcsMx.length > 0) {
                for (let i = 0; i < tjcsMx.length; i++) {
                  if (tjcsMx[i].csz === undefined || tjcsMx[i].csz === '') {
                    creatErrInfo(retObj, 'TJCS', cnd.element);
                  }
                }
              }
            }
          }
        } else if (cnd.element.values[0] === undefined || cnd.element.values[0] === '') {
          // 未设置值
          creatErrInfo(retObj, 'NULL', cnd.element);
        }
      }
    }
  };

  const validateCnd = (cnd, ret) => {
    if (cnd && cnd.length > 0) {
      for (let i = 0, ilen = cnd.length; i < ilen; i++) {
        validateOnecnd(cnd[i], ret);
        if (cnd[i].condition) {
          validateCnd(cnd[i].condition, ret);
        }
      }
    } else {
      validateOnecnd(cnd, ret);
      if (cnd.condition) {
        validateCnd(cnd.condition, ret);
      }
    }
  };
  const infoList = [];
  validateCnd(condition, infoList);
  return infoList;
}


export function titleMouseMove(e) {
  const cellEl = e.currentTarget || e.srcElement;
  if (cellEl) {
    if (cellEl.scrollWidth > cellEl.clientWidth || cellEl.scrollHeight > cellEl.clientHeight) {
      const s = (cellEl.innerText || cellEl.textContent || '').trim();
      cellEl.title = s.length > 50 ? `${s.substr(0, 50)}\n${s.substr(50)}` : s;
    } else {
      cellEl.title = '';
    }
  }
}

export function titleMouseOut(e) {
  const cellEl = e.currentTarget || e.srcElement;
  if (cellEl && cellEl.length > 0) {
    cellEl.title = '';
  }
}

/**
 * 金额格式化
 * 输出 格式：##,###.###,#
 * @param {*} str
 */
export function formatMoneyString(str) {
  // 格式化字符串
  let money = 0;
  if (typeof str !== 'undefined' && str !== null) {
    money = str.toString().replace(/\s/g, ''); // 去空格
  }

  let sign = ''; // 正负符号
  if (str === '') {
    return 0;
  } else if (money.charAt(0) === '-') {
    sign = '-';
    money = money.substring(1);
  }
  // 小数点
  const i = money.indexOf('.');
  let intpart = null;
  let floatpart = null;
  if (i !== -1) {
    intpart = money.substring(0, i);
    floatpart = money.substring(i + 1);
  } else {
    intpart = money;
  }
  const r = new RegExp('(\\d{3})', 'g');
  if (intpart != null) {
    const t = intpart.length % 3;
    intpart = intpart.substring(0, t) + intpart.substring(t).replace(r, ',$1');
  }
  if (floatpart != null) {
    floatpart = floatpart.replace(r, '$1,');
  } else {
    floatpart = '';
  }
  let rtvlue = `${intpart}.${floatpart}`;
  rtvlue = sign
    + rtvlue
      .replace(/^,/, '')
      .replace(/\,$/, '')
      .replace(/\.$/, '');
  return rtvlue;
}

/**
 * 延时
 * @param {*} timeout
 */
export function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * 校验非空
 */
export function isNull(val) {
  if (val) {
    return false;
  }
  return true;
}

/**
 * 去除所有空格
 * @param {*} str 
 */
export function trimString(str) {
  return str.replace(/\s+/g, "")
}

export function dataFactory(number, money, days) {
  var data = []
  var Middle = 0
  for (var i = 0; i < number; i++) {
    var hMoney = Math.floor(Math.random() * money * 0.5 + money * 0.5);
    var mMoney = function () { return Math.floor(Math.random() * money - money * 0.5) };
    var lMoney = Math.floor(Math.random() * money * 0.5 - money * 0.5);

    var Money = [hMoney, mMoney(), mMoney(), mMoney(), mMoney(), lMoney];
    var key = Math.floor(Math.random() * 6);

    var Days = Math.floor(Math.random() * days)

    var item = [Days, Money[key]]
    data.push(item)

    Middle += Days
  }
  Middle = Math.floor(Middle / number);

  return { data, Middle }
}

export function formatValue(val, type) {
  let str = ''
  if (val === 'undefined' || val === '' || val === 'NaN') {
    return '';
  }
  if (type === 'MONEY') {
    str = formatMoneyString(parseFloat(val).toFixed(2));
  } else if (type === 'PERCENT') {
    str = `${(parseFloat(text) * 100).toFixed(2)}%`;
    str = val;
  } else if (type === 'PERCET') {
    str = val;
  } else if (type === 'NUMBER' || type === 'DATE') {
    str = val;
  } else {
    str = val;
  }

  return str;
}

export function hasClass(ele, cls) {
  return ele.className && ele.className.indexOf(cls) > -1;
}

export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) { ele.className += ` ${cls}`; }
}

export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    ele.className = ele.className.replace(cls, '');
  }
}
/**
 * @description: 拼装GET请求的参数
 * @param {object} 参数对象
 * @return: string 格式类似：a=1&b=2
 */
export function buildGETParams(params) {
  let returnStr = '?';
  for (const key in params) {
    returnStr += `${key}=${params[key]}&`
  }
  return returnStr.substr(0, returnStr.length - 1);
}
