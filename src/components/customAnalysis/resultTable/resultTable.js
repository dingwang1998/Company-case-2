/* eslint-disable react/no-unused-state */
/* eslint-disable eqeqeq */
/* eslint-disable react/sort-comp */
/* eslint-disable no-useless-escape */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table } from 'antd';
import ResizeableTitle from './resizeableTitle';
import CustomFilterDropDown from '../customFilterDropDown/customFilterDropDown';
import * as CommonUtils from '../../../utils/commonUtils';
import styles from './resultTable.less';

// 表格字体大小
const tableFontSize = 14;

const resizeClickHandler = (e) => {
  e.stopPropagation();
};

class ResultTable extends Component {
  constructor(props) {
    super(props);
    // 返回表格列及列属性
    const cols = this.setColumsSize(props, {});
    this.state = {
      // 记录表格列宽度等属性信息
      colProps: {},
      // 表格列及列属性
      ...cols
    };
    // 表格分页高度
    this.tableFooterHeight = 58;
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 判断是否有新的单元格
    if (nextProps.tagSetList !== this.props.tagSetList
      || nextProps.selectedTags !== this.props.selectedTags
    ) {
      const colProps = {
        ...this.state.colProps,
      };
      const cols = this.setColumsSize(nextProps, colProps);
      this.setState({
        ...cols,
      });
    }



  }

  componentDidMount() {
    this.changeTableSize();
    window.addEventListener('resize', this.doLayout.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.doLayout.bind(this));
  }

  UNSAFE_componentWillUpdate() {
    // 重置表头文本框的maxWidth宽度
    document.querySelectorAll('.ant-table-column-title').forEach((element) => {
      element.style.maxWidth = '120px';
    });
  }

  componentDidUpdate() {
    // 移除命中标签样式
    document.querySelectorAll('.isHintBg').forEach((element) => {
      CommonUtils.removeClass(element, 'isHintBg');
    });

    // 添加命中标签样式
    document.querySelectorAll('.isHint').forEach((element) => {
      CommonUtils.addClass(element.parentNode.parentNode, 'isHintBg');
    });

    // 表头以及数据列添加文字悬浮提示 title
    document.querySelectorAll('.ant-table-column-title, .res-cell-ellipsis').forEach((dom) => {
      dom.removeEventListener('mousemove', CommonUtils.titleMouseMove);
      dom.addEventListener('mousemove', CommonUtils.titleMouseMove);
      dom.removeEventListener('mouseout', CommonUtils.titleMouseOut);
      dom.addEventListener('mouseout', CommonUtils.titleMouseOut);
    });

    // 防止拖动列宽的时候触发表格排序
    document.querySelectorAll('.react-resizable-handle').forEach((dom) => {
      dom.removeEventListener('click', resizeClickHandler);
      dom.addEventListener('click', resizeClickHandler);
    });

    // 调整表格宽度
    this.changeTableSize();

    // 暂存表头列对象
    const { dispatch } = this.props;
    dispatch({
      type: 'resultTable/changeParamStateAux',
      key: 'columns',
      value: this.state.columns
    });

    // 是否有列的改变 改变时再次调整表格
    if (this.props.isAddCol) {
      this.doLayout();
    }
  }

  /**
   * 更新数据以达到render的目的 重新布局表格大小
   */
  doLayout() {
    setTimeout(() => {
      const { dispatch, tableData } = this.props;
      // 更新表格数据重绘表格部分
      let newTableData = JSON.parse(JSON.stringify(tableData));
      dispatch({
        type: 'resultTable/changeParamStateAux',
        key: 'tableData',
        value: newTableData,
      });

      // 更新表头数据重绘表头部分
      const colProps = {
        ...this.state.colProps,
      };
      const cols = this.setColumsSize(this.props, colProps);
      this.setState({
        ...cols,
      });
      dispatch({
        type: 'resultTable/changeParamStateAux',
        key: 'isAddCol',
        value: false,
      });
    }, 200);
  }

  /**
   * 调整表格列宽度
   */
  setColumsSize = (props, colProps) => {
    const baseCols = this.getBaseInfoHeaderColums(props, colProps);
    let sums = 4;
    sums += colProps.bWidth;
    let labelCols = this.getLabelHeaderColums(props, colProps);
    sums += colProps.rWidth;
    const extensionCols = this.getExtensionCols(props, colProps);
    sums += colProps.eWidth;

    // 标签列表
    const { tagSetList, dispatch } = props;


    // 添加空白列-解决最后一列不能拖拽调整宽度的问题
    const wraperWidth = ((document.getElementById('tableWrapper') || {}).clientWidth || (document.getElementById('root') || {}).clientWidth || (window.innerWidth - 20)) - 54;
    const isHasSpace = wraperWidth > sums;

    // 设置倒数第二列的长度-解决表格不能被撑满容器的问题
    if (isHasSpace) {
      // 没有标签
      if (tagSetList.length <= 0) {
        labelCols.width += wraperWidth - sums;
        const dataIndex = labelCols.dataIndex;
        colProps[dataIndex] = {
          width: labelCols.width,
          minWidth: labelCols.width,
        };
      } else {
        // 标签元素个数
        const lastlabelCol = labelCols[labelCols.length - 1];
        if (lastlabelCol && lastlabelCol.children) {
          const nextChilren = lastlabelCol.children;
          // 空余宽度
          const spaceWidth = wraperWidth - sums;
          // 平分到每个列
          const childLen = nextChilren.length;
          for (let i = 0; i < childLen; i++) {
            nextChilren[i].width += spaceWidth / childLen;
            const dataIndex = nextChilren[i].dataIndex;
            colProps[dataIndex] = {
              width: nextChilren[i].width,
              minWidth: nextChilren[i].width,
            };
          }

          labelCols = [
            ...labelCols.splice(0, labelCols.length - 1),
            lastlabelCol,
          ];
        }
      }
    }

    const columns = this.concatColums(baseCols, labelCols, extensionCols);
    dispatch({
      type: 'resultTable/changeParamStateAux',
      key: 'columns',
      value: columns
    });

    return {
      colProps,
      columns,
    };
  }

  /**
   * 改变表格大小
   */
  changeTableSize() {
    let scrollY = this.getScrollY();
    const tableBody = document.querySelector('#tableWrapper .ant-table-body');
    const tableBodyInner = document.querySelector('#tableWrapper .ant-table-body-inner');
    if (tableBody !== null) {
      const height = parseInt(tableBody.style.maxHeight.replace('px', ''), 10);
      const scrollH = Math.max(scrollY, height);
      tableBody.style.maxHeight = `${scrollH}px`;
      tableBody.style.height = `${scrollH}px`;
      if (tableBodyInner !== null) {
        tableBodyInner.style.maxHeight = `${scrollH}px`;
        tableBodyInner.style.height = `${scrollH}px`;
      }
    }
    // 标识最后一行
    document.querySelectorAll('.res-last-row').forEach((element) => {
      CommonUtils.removeClass(element, 'res-last-row');
    });
    document.querySelectorAll('.res-last-row-cell').forEach((element) => {
      CommonUtils.addClass(element.parentNode, 'res-last-row');
    });

    // 滚动到上次滚动的位置
    const scrollTable = document.querySelector('#tableWrapper .ant-table-content');
    if (scrollTable !== null) {
      scrollTable.scrollTop = scrollTable.scrollHeight;
      // scrollTable.scrollLeft = scrollTable.scrollWidth;
    }
    // 调整table-body样式
    const antBodyEl = document.querySelector('#tableWrapper .ant-table-tbody');
    if (this.tableDataLen <= 0) {
      if (antBodyEl) {
        antBodyEl.parentNode.style.height = '99%';
        const botColLen = (document.querySelectorAll('.res-bottom-column') || []).length;
        const html = `<tr id="empty-row"><td  style="background: #ffffff;border: 0;" colspan="${botColLen}"></td></tr>`;
        antBodyEl.innerHTML = html;
      }
    } else {
      if (antBodyEl) { antBodyEl.parentNode.style.height = 'unset'; }
      if (antBodyEl && antBodyEl.firstChild && antBodyEl.firstChild.id === 'empty-row') {
        antBodyEl.removeChild(antBodyEl.firstChild);
      }
    }

    // 调整表头文字宽度使自适应
    document.querySelectorAll('.ant-table-column-title').forEach((element) => {
      const width = `${element.parentNode.parentNode.parentNode.clientWidth * 0.8}px`;
      element.style.maxWidth = width;
    });
    // 调整表头高度
    setTimeout(() => {
      let trHeight = '';
      document.querySelectorAll('.ant-table-fixed .ant-table-thead tr').forEach((element) => {
        if (element && element.style.height) {
          trHeight = element.style.height;
        }
      });
      if (trHeight) {
        document.querySelectorAll('.ant-table-fixed .ant-table-thead tr').forEach((element) => {
          element.style.height = trHeight;
        });
      }
    }, 0);
  }

  handleResize = index => (e, { size }) => {
    e.stopPropagation();
    this.setState(({ columns, colProps }) => {
      const nextColumns = [...columns];
      const nextColProps = {
        ...colProps,
      };
      const width = size.width < (nextColProps[index] && nextColProps[index].minWidth)
        ? nextColProps[index].minWidth
        : size.width;
      nextColumns.forEach((col, i) => {
        if (col.dataIndex === index) {
          col.width = width;

          // 暂存当前列的宽度
          nextColProps[index] = {
            ...nextColProps[index],
            width,
          };
        } else if (col.children) {
          col.children.forEach((colc, i) => {
            if (colc.dataIndex === index) {
              colc.width = width;
              // 暂存当前列的宽度
              nextColProps[index] = {
                ...nextColProps[index],
                width,
              };
            }
          });
        }
      });
      return {
        columns: nextColumns,
        colProps: nextColProps,
      };
    });
  };

  handleTableChange(pagination, filters, sorter, extra) {
    const { current, pageSize } = pagination;
    this.props.dispatch({ type: 'resultTable/changePager', pageIndex: current, pageSize });
  }

  // 切换单位
  qhDwFormat = (str) => {
    const dwValue = 1;
    const afterDwValue = parseInt(this.state.afterDwValue, 10);

    let bs = 1;
    if (dwValue < afterDwValue) {
      bs = afterDwValue / dwValue;
      str = (str / bs).toFixed(2);
    } else if (dwValue > afterDwValue) {
      bs = dwValue / afterDwValue;
      str = (str * bs).toFixed(2);
    } else if (dwValue === afterDwValue) {
      str = str.toFixed(2);
    }
    // 判断是否有小数点
    const s = str.toString().indexOf('.');
    if (s == -1) {
      // 是整数
      return (
        `${(str || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}.00`
      );
    } else {
      // 是小数
      const arr = str.toString().split('.');
      if (arr.length > 1 && arr[1].length < 2) {
        // 一位小数
        return (
          `${(arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
          }.${
          arr[1]
          }0`
        );
      } else {
        // 两位小数
        return (
          `${(arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
          }.${
          arr[1]}`
        );
      }
    }
  };


  // 处理数据列数据格式化
  // forMat
  columFormatRender(res) {
    const that = this;
    res.vtype = res.vtype || null;
    if (res.children) return;
    const lastRowCls = (rowIndex, a) => {
      const cls = that.tableDataLen - 1 === rowIndex ? 'res-last-row-cell' : '';
      return <span className={cls}>{a}</span>;
    };
    // 是否标签下的分析元素
    if (res.isFxys) {
      res.render = (text, record, rowIndex) => {
       // if (text!="") return <span />;
        const cls = record.AUTO_HINT_DMS || '';
        return lastRowCls(rowIndex, <span className={cls.indexOf(res.dataIndex) > -1 ? 'isHint' : ''}>{that.forMateComp(res.vtype, text)}</span>);
      };
    } else if (res.vtype === 'MONEY') {
      res.render = (text, record, rowIndex) => {
        return lastRowCls(rowIndex, that.forMateComp('MONEY', text));
      };
    } else if (res.vtype === 'PERCENT') {
      res.render = (text, record, rowIndex) => {
        return lastRowCls(rowIndex, that.forMateComp('PERCENT', text));
      };
    } else if (res.vtype === 'NUMBER') {
      res.render = (text, record, rowIndex) => {
        return lastRowCls(rowIndex, that.forMateComp('NUMBER', text));
      };
    } else if (res.vtype === 'DATE' || res.vtype === 'TIME') {
      res.render = (text, record, rowIndex) => {
        return lastRowCls(rowIndex, that.forMateComp('DATE', text));
      };
    } else {
      res.render = (text, record, rowIndex) => {
        return lastRowCls(rowIndex, that.forMateComp('', text));
      };
    }
  }

  /**
   * 数据格式化
   */
  forMateComp = (vtype, text) => {
    const that = this;
    let tStr = '';
    let align = 'left';
    if (text === '--') {
      tStr = text;
    } else if (vtype === 'MONEY') {
      // 金额：居右，添加千分位并保留两位小数
      align = 'right';
      if (that.state.afterDwValue === '' && that.state.afterDwValue !== '1') {
        tStr = typeof text === 'undefined' || text === '' || text === 'NaN'
          ? ''
          : CommonUtils.formatMoneyString(parseFloat(text).toFixed(2));
      } else {
        tStr = typeof text === 'undefined' || text === '' || text === 'NaN'
          ? ''
          : that.qhDwFormat(parseFloat(text));
      }
    } else if (vtype === 'PERCENT') {
      // 百分比：居右，保留两位小数且有%号
      align = 'right';
      tStr = text === 'undefined' || text === '' || text === 'NaN'
        ? ''
        : `${(parseFloat(text) * 100).toFixed(2)}%`;
    } else if (vtype === 'PERCET') {
      // 百分比：居右
      align = 'right';
    } else if (vtype === 'NUMBER') {
      // 数值类型的都居右显示
      align = 'right';
      tStr = typeof text === 'undefined' || text === '' || text === 'NaN'
        ? ''
        : text;
    } else if (vtype === 'DATE') {
      align = 'center'; // 时间类型的都居中显示
      tStr = typeof text === 'undefined' || text === '' || text === 'NaN'
        ? ''
        : text;
    } else {
      tStr = typeof text === 'undefined' || text === '' || text === 'NaN'
        ? ''
        : text;
    }
    return (
      <span
        className="v-format"
        style={{
          textAlign: align,
        }}
      >{tStr}
      </span>
    );
  }

  // 设置列信息
  setColums(col, index, columns) {
    const that = this;
    // 头部单元格样式名称
    if (!col.className) { col.className = ''; }

    // bottom-column样式
    if (!col.children) {
      CommonUtils.addClass(col, 'res-bottom-column');
    }
    // 分析元素添加新的样式(识别分析元素)
    if (col.isFxys) {
      CommonUtils.addClass(col, 'isFxys');
    }

    col.xh = index;
    col.key = col.dataIndex;
    if (!col.children) {
      col.onHeaderCell = (column) => {
        const cls = {
          className: column.className,
        };
        CommonUtils.removeClass(cls, 'res-cell-ellipsis');
        CommonUtils.addClass(cls, 'res-cell-ellipsis-2');
        CommonUtils.addClass(cls, `res-header-${col.dataIndex}`);
        return {
          width: column.width,
          // title: otitle,
          className: cls.className,
          onResize: that.handleResize(col.dataIndex),
        };
      };
    } else {
      col.onHeaderCell = (column) => {
        const cls = {
          className: column.className,
        };
        CommonUtils.removeClass(cls, 'res-cell-ellipsis');
        CommonUtils.addClass(cls, 'res-cell-ellipsis-2');
        return {
          width: column.width,
          // title: otitle,
          className: cls.className,
          // onResize: that.handleResize(col.dataIndex),
        };
      };
    }

    // 添加单元格的格式化
    that.columFormatRender(col);

    if (index === 0) {
      col.align = 'center';
    }

    if (
      col.dataIndex === 'AUTO_HINT_NUM'
      || col.vtype === 'CHAR'
      || col.vtype === 'NUMBER'
      || col.vtype === 'DATE'
      || col.vtype === 'DOUBLE'
      || col.vtype === 'TIME'
      || col.vtype === 'PERCENT'
      || col.vtype === 'MONEY'
      || col.vtype === 'WD'
    ) {
      const { allFilterCondition, sort, hint } = this.props;
      col.filterDropdown = ({ confirm }) => {
        col.key4Rerender = col.key4Rerender ? ++col.key4Rerender : 1;
        return <CustomFilterDropDown key4Rerender={col.key4Rerender} mzCheckOpts={this.mzCheckOpts} col={col} confirm={confirm}></CustomFilterDropDown>
      };
      // col.filterIcon= filtered => (
      //   <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      // );

      if (
        JSON.stringify(allFilterCondition) !== '{}'
        && allFilterCondition[col.dataIndex] || sort.sortBy === col.dataIndex || (col.dataIndex === 'AUTO_HINT_NUM' && hint.labelIds && hint.labelIds.length > 0)
      ) {
        col.filteredValue = 'YES';
        // col.filtered = true;
      } else {
        col.filteredValue = null;
        // col.filtered = false;
      }
    }
    // 添加一户式链接（结果集中等后台返回‘NSR.NSRDZDAH’值即可）
    if (index === 1) {
      col.render = (text, record) => {
        const url = `${that.yhsUrl
          }?xtdm=FXGL&nsrdzdah=${
          record['NSR.NSRDZDAH']
          }&qx_swjg_dm=${
          that.qxSwjgDm
          }&current_swry_dm=${
          that.swryDm}`;
        return (
          <a
            href={url}
            target="_black"
            style={{
              textDecoration: 'none',
            }}
          >
            {text}
          </a>
        );
      };
    }

    // 宽度设置
    if (index < columns.length - 1) {
      col.width = col.width;
    }
  }

  // 获取基本列
  getBaseInfoHeaderColums(props, colProps) {
    const { baseInfoColumns, tagSetList } = props;
    const mzxColums = [];
    let bWidth = 0;
    // 12个字符 6 （字符宽度） + 4 （筛选按钮宽）
    const colWidth = tableFontSize * 10;
    baseInfoColumns.forEach((item, index) => {
      item.title = item.name;
      item.dataIndex = item.vtype === 'WD' ? `${item.id || item.code}$MC` : item.code;
      item.key = item.code;
      item.sorter = false;
      item.width = colWidth;
      item.className = 'res-base-column res-cell-ellipsis';
      colProps[item.dataIndex] = {
        width: colWidth,
        minWidth: colWidth,
      };
      bWidth += colWidth;
    });
    if (tagSetList && tagSetList.length > 0) {
      // 7个字符 3 （字符宽度） + 4 （筛选按钮宽）
      const labelColWidth = tableFontSize * 11;
      mzxColums.push({
        code: 'AUTO_HINT_NUM',
        format: 'NUMBER',
        index: 3,
        name: '命中标签数',
        sfzs: 'Y',
        vtype: 'NUMBER',
        ywlx: 'NSR',
        sfkpx: null,
        sfkgl: null,
        sfkfz: null,
        head: null,
        dataIndex: 'AUTO_HINT_NUM',
        key: 'AUTO_HINT_NUM',
        title: '命中标签数',
        width: labelColWidth,
        className: 'res-base-column res-cell-ellipsis',
      });
      colProps.AUTO_HINT_NUM = {
        width: labelColWidth,
        minWidth: labelColWidth,
      };
      bWidth += labelColWidth;
    }
    const childColums = baseInfoColumns.concat(mzxColums);

    // 添加分隔线样式

    CommonUtils.addClass(childColums[childColums.length - 1], 'split-cell-r');

    colProps.INDEX = {
      width: 80,
      minWidth: 80,
    };
    colProps.bWidth = bWidth + 80;
    return [
      {
        title: '序号',
        dataIndex: 'INDEX',
        key: 'INDEX',
        width: 80,
        minWidth: 80,
        className: 'split-cell-r',
      },
      {
        title: '基本信息',
        children: childColums,
        className: 'split-cell-r',
      },
    ];
  }

  // 获取标签列
  getLabelHeaderColums(props, colProps) {
    let labelCols = [];
    const mzCheckOpts = [];
    const mzOpts = [];
    let rWidth = 0;
    // 8个字 8 （字符宽度） + 4 （筛选按钮宽）
    const labelColWidth = tableFontSize * 11;
    const { tagSetList } = props;
    if (tagSetList.length <= 0) {
      labelCols = {
        title: '请选择标签',
        className: 'split-cell-r',
        width: 200,
        align: 'center',
        dataIndex: 'labelCols',
      };
      colProps.labelCols = {
        width: 200,
        minWidth: 200,
      };
      rWidth += 200;
    } else {
      // 分解标签构造列
      tagSetList.forEach(tag => {
        mzCheckOpts.push({
          label: tag.bqMc,
          value: tag.bqZd
          
        });
        let col = {
          title: tag.bqMc
        };
        if (tag.bqMxList && tag.bqMxList.length > 0) {
          const children = [{
            title: tag.bqMc,
            code:tag.bqId,
            name:tag.bqMc,
            dataIndex: tag.bqZd,
            key: tag.bqZd,
            vtype: tag.vtype,
            isFxys: true,
            width: labelColWidth,
            className: 'res-ys-column res-cell-ellipsis',
            ywlx:tag.ywlx
          }];
          colProps[`${tag.bqZd}`] = {
            width: labelColWidth,
            minWidth: labelColWidth,
          };
          rWidth += labelColWidth;
          // 遍历标签中的数据项来构造列
          tag.bqMxList.forEach(sjx => {
            children.push({
              ...sjx,
              code:sjx.mxId,
              name:sjx.mxMc,
              title: sjx.mxMc,
              dataIndex: sjx.mxZd,
              key: sjx.mxZd,
              vtype: sjx.vtype,
              isFxys: true,
              width: labelColWidth,
              className: 'res-ys-column res-cell-ellipsis',
              ywlx:sjx.ywlx
            });
            colProps[`${sjx.MxZd}`] = {
              width: labelColWidth,
              minWidth: labelColWidth,
            };
            rWidth += labelColWidth;
            //mzOpts.push(`${k}.${childObj[k1].dm}.${childObj[k1].vtype}`);
          })
          col.children = children;
        } else {
          col = {
            title: tag.bqMc,
            dataIndex: tag.bqZd,
            key: tag.bqZd,
            vtype: tag.vtype,
            isFxys: true,
            width: labelColWidth,
            className: 'res-ys-column res-cell-ellipsis',
            code:tag.bqId,
            name:tag.bqMc,
            ywlx:tag.ywlx
          };
          colProps[`${tag.bqZd}`] = {
            width: labelColWidth,
            minWidth: labelColWidth,
          };
          rWidth += labelColWidth;
        }
        labelCols.push(col);
      });

      // 添加分隔线
      if (labelCols.length > 0) {
        const lastCol = labelCols[labelCols.length - 1];
        CommonUtils.addClass(lastCol, 'split-cell-r');
        if (lastCol.children) {
          const lastColChild = lastCol.children[lastCol.children.length - 1];
          CommonUtils.addClass(lastColChild, 'split-cell-r');
        }
      }
    }

    this.mzCheckOpts = mzCheckOpts;
    this.mzOpts = mzOpts;
    colProps.rWidth = rWidth;
    return labelCols;
  }

  // 获取扩展信息列
  getExtensionCols(props, colProps) {
    let extensionCols = [];
    let eWidth = 0;
    let { selectedTags } = props;
    // 8个字 8 （字符宽度） + 4 （筛选按钮宽）
    const extColWidth = tableFontSize * 11;
    if (selectedTags.length <= 0) {
      extensionCols = {
        title: '扩展信息',
        align: 'center',
        dataIndex: 'extensionCols',
        width: 120,
      };
      colProps.extensionCols = {
        width: 120,
        minWidth: 120,
      };
      eWidth += 120;
    } else {
      selectedTags = selectedTags.map((item) => {
        const itemWidth = extColWidth;
        //const dataIndex = item.vtype === 'WD' ? `${item.id || item.code}$MC` : item.code;
        const dataIndex = item.id;
        colProps[dataIndex] = {
          width: itemWidth,
          minWidth: itemWidth,
        };
        eWidth += itemWidth;
        return {
          ...item,
          title: item.name,
          dataIndex,
          // item.dataIndex: item.code,
          key: item.code,
          isKzl: true,
          width: itemWidth,
          className: 'res-ys-column res-cell-ellipsis',
        };
      });
      extensionCols = {
        title: '扩展信息',
        children: selectedTags,
      };
    }

    colProps.eWidth = eWidth;
    return extensionCols;
  }

  concatColums(baseCols, labelCols, extensionCols) {
    return baseCols.concat(labelCols, extensionCols);
  }

  /**
   * 设置列信息返回scrollX
   * @memberof ResultTable
   */
  processColAndGetSX() {
    // 横向滚动宽度 最后一列的默认宽度
    let scrollX = 0;
    // column index的值
    let colIndex = 0;
    let columns = this.state.columns;
    columns.forEach((col) => {
      colIndex++;
      this.setColums(col, colIndex - 1, columns);
      if (col.children && col.children.length > 0) {
        col.children.forEach((scol) => {
          colIndex++;
          this.setColums(scol, colIndex - 1, columns);
          scrollX += scol.width ? scol.width : 0;
        });
      } else {
        scrollX += col.width ? col.width : 0;
      }
    });
    return scrollX;
  }
  /**
   * @returns 表格scrollY
   * @memberof ResultTable
   */
  getScrollY() {
    let scrollY = 0;
    if (
      document.querySelector('#tableWrapper')
      && document.querySelector('#tableWrapper .ant-table-header')
    ) {
      scrollY = document.querySelector('#tableWrapper').offsetHeight
        - document.querySelector('#tableWrapper .ant-table-header').offsetHeight - this.tableFooterHeight;
    } else {
      scrollY = 200;
    }
    return scrollY;
  }


  render() {
    const props = this.props;
    const scrollX = this.processColAndGetSX();
    const scrollY = this.getScrollY();

    // 命中标签过滤条件选项
    const opts = this.mzOpts;
    const dataSource = props.tableData.map((row, i) => {
      // 解决column key必须唯一的问题,计算命中标签数
      const retRow = {
        ...row,
        INDEX: (props.pageIndex - 1) * props.pageSize + i + 1,
        key: (props.pageIndex - 1) * props.pageSize + i + 1,
      };
      /* opts.forEach((opt) => {
        const valKs = opt.split('.');
        retRow[opt.substr(0, opt.lastIndexOf('.'))] = [opt, retRow[valKs[1]]];
      }); */
      return retRow;
    });
    // 表格数据长度
    this.tableDataLen = dataSource.length;

    return (
      <div className={styles.tableWrapper} id="tableWrapper">
        <Table
          style={
            props.total === -1 ? {
              paddingBottom: 40,
            } : {
                paddingBottom: 0,
              }
          }
          dataSource={dataSource}
          bordered
          loading={props.tableLoading}
          rowKey="INDEX"
          components={{
            header: {
              cell: ResizeableTitle
            }
          }}
          columns={this.state.columns}
          size="small"
          scroll={{
            x: scrollX,
            y: scrollY,
          }}
          onChange={this.handleTableChange.bind(this)}
          pagination={{
            showTotal: () => <div>总户数{props.total}户</div>,
            showSizeChanger: true,
            total: props.total,
            current: props.pageIndex,
            pageSize: props.pageSize,
            pageSizeOptions: ['25', '50', '100'],
            size: 'small',
          }}
        />
        <div
          className={styles.pageTip}
          style={
            props.total === -1 ? {
              display: 'block',
            } : {
                display: 'none',
              }
          }
        >
          分页信息正在载入中...
        </div>
      </div>
    );
  }
}

ResultTable.propTypes = {
  baseInfoColumns: PropTypes.array,
  tagSetList: PropTypes.array,
  allFilterCondition: PropTypes.object,
  sort: PropTypes.object,
  tableLoading: PropTypes.bool,
  tableData: PropTypes.array,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
};

export default connect((state) => ({
  baseInfoColumns: state.resultTable.baseInfoColumns, // 基本信息列
  tagSetList: state.conditions.tagSetList, // 标签列
  selectedTags: state.conditions.selectedTags, // 扩展信息列
  allFilterCondition: state.customFilterDropDown.allFilterCondition, // 过滤条件
  sort: state.customFilterDropDown.sort, // 排序条件
  hint: state.customFilterDropDown.hint, // 排序条件
  tableLoading: state.resultTable.tableLoading,
  tableData: state.resultTable.tableData,
  pageIndex: state.resultTable.pageIndex,
  pageSize: state.resultTable.pageSize,
  total: state.resultTable.total,
}))(ResultTable);
