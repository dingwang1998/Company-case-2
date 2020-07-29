import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Input, DatePicker, Radio, Checkbox, Select } from 'antd';
import NumericInput from '../../common/NumericInput';
import CustomSort from './customSort';
import styles from './customFilterDropDown.less';

const { Option } = Select;

class CustomFilterDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 命中标签次数类型【all,any】
      hintLabelType: props.htype || 'ANY',
      // 命中的标签列
      hintLabelColums: props.labelIds || [],
      // 暂存当前弹出层的筛选条件
      filterCondion: props.allFilterCondition
    };
    this.curFilterDropId = '';
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      filterCondion: nextProps.allFilterCondition
    });
  }


  // 筛选起始值变更
  handleSetBeginmun(col, e, e1) {
    const value = e1 === undefined ? e : e1;
    const dataIndex = col.dataIndex;
    let filterCondion = JSON.parse(JSON.stringify(this.state.filterCondion));
        
    if (
      filterCondion[dataIndex]
      && filterCondion[dataIndex].values[1] === ''
      && value === ''
    ) {
      delete filterCondion[dataIndex];
      this.setState({filterCondion});
    } else {
      filterCondion = {
        ...filterCondion,
        [dataIndex]: {
          operation: 'BETWEEN',
          values: [value, (filterCondion[dataIndex] && filterCondion[dataIndex].values[1]) || ''],
          vtype: col.vtype,
        },
      }
      this.setState({filterCondion});
    }
  }

  // 筛选结束值变更
  handleSetEndmun(col, e, e1) {
    const dataIndex = col.dataIndex;
    let filterCondion = JSON.parse(JSON.stringify(this.state.filterCondion));
    const value = e1 === undefined ? e : e1;
    if (
      filterCondion[dataIndex]
      && filterCondion[dataIndex].values[0] === ''
      && value === ''
    ) {
      delete filterCondion[dataIndex];
      this.setState({filterCondion});
    } else {
      filterCondion = {
        ...filterCondion,
        [dataIndex]: {
          operation: 'BETWEEN',
          values: [(filterCondion[dataIndex] && filterCondion[dataIndex].values[0]) || '', value],
          vtype: col.vtype,
        },
      }
      this.setState({filterCondion});
    }
  }

  // 筛选文本值变更
  handleSetWbz(col, e) {
    const dataIndex = col.dataIndex;
    let filterCondion = JSON.parse(JSON.stringify(this.state.filterCondion));
    if (e.target.value === '') {
      delete filterCondion[dataIndex];
      this.setState({filterCondion});
    } else {
      filterCondion = {
        ...filterCondion,
        [dataIndex]: {
          operation: 'LIKE',
          values: [e.target.value],
          vtype: col.vtype,
        },
      }
      this.setState({filterCondion});
    }
  }

  // 命中次数类型选择
  handleHintLabelTypeChange = (e) => {
    const hintLabelType = e.target.value;
    this.setState({
      hintLabelType,
    });
  };

  // 命中次数列表选择
  handleMzOptsChange = (value) => {
    const hintLabelColums = value;
    this.setState({
      hintLabelColums,
    });
  };

  // 命中次数确认
  handleFilterHintLabel = () => {
    const { dispatch } = this.props;
    const hintLabelColums = this.state.hintLabelColums;
    const hintLabelType = this.state.hintLabelType;

    const hint = hintLabelColums.length > 0
      ? {
        labelIds: hintLabelColums,
        hints: hintLabelType === 'ANY' ? 1 : hintLabelColums.length,
        htype: hintLabelType,
      }
      : {};
    dispatch({
      type: 'customFilterDropDown/changeHint',
      hint
    });
  };

  // 维度字段筛选
  handleWdChange = (values) => {
    let filterCondion = JSON.parse(JSON.stringify(this.state.filterCondion));
    const vals = [];
    let wdzd = '';
    let col = {};
    values.forEach((val) => {
      const vala = JSON.parse(val);
      vals.push(vala.opt.wdz);
      wdzd = vala.opt.wdzd;
      col = vala.col;
    });
    const dataIndex = col.code || this.curFilterDropId;
    if (values && values.length > 0) {
      filterCondion = {
        ...filterCondion,
        [dataIndex]: {
        operation: 'IN',
        values: vals,
        vtype: col.vtype,
        }
      }
    } else {
      delete filterCondion[dataIndex];
    }
    this.setState({filterCondion});
  };

  // 筛选条件确定按钮
  handleSearch = (confirm, col) => {
    if (confirm !== undefined) {
      confirm();
    }
    if (col.dataIndex === 'AUTO_HINT_NUM') {
      this.handleFilterHintLabel();
}

    const { dispatch, allFilterCondition } = this.props;
    const newAllFilterCon = JSON.parse(JSON.stringify(allFilterCondition));
    const dataIndex = col.dataIndex || col.code || this.curFilterDropId;
    if(!this.state.filterCondion[dataIndex]) {
      delete newAllFilterCon[dataIndex];
    }else {
      newAllFilterCon[dataIndex] = this.state.filterCondion[dataIndex];
    }
    dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'pageIndex',
			value: 1
		});
    dispatch({
      type: 'customFilterDropDown/changeFilterCondition',
      allFilterCondition: newAllFilterCon
    });
  
    /* const { dispatch } = this.props;
    dispatch({
      type: 'resTable/changePageIndex',
      pageIndex: 1,
    });
    if (isCache === 'cache') {
      dispatch({
        type: 'resTable/cacheTableData',
      });
    } else {
      dispatch({
        type: 'resTable/queryTableData',
      });
    } */
  };

  // 筛选条件取消按钮
  handleReset = (dataIndex, clearFilters) => {
    if (clearFilters !== undefined) {
      clearFilters();
    }
  };

  handleChangeSort(col, e) {
    const { sort, dispatch } = this.props;
    const newSort = e.target.value;
    this.props.dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'pageIndex',
			value: 1
		});
    if (newSort === 'NOSORT') {
      if (sort.sortBy === col.dataIndex) {
        dispatch({ type: 'customFilterDropDown/changeSort', sort: { sortBy: '', sortDirection: '' } })
      }
    } else {
      dispatch({ type: 'customFilterDropDown/changeSort', sort: { sortBy: col.dataIndex, sortDirection: newSort } })
    }
  }

  render() {
    const { mzCheckOpts, col, confirm, wdMap } = this.props;
    const { filterCondion } = this.state;
    if (col.dataIndex === 'AUTO_HINT_NUM') {
      return (
        <div className={styles.sxContent}>
          <Radio.Group
            style={{marginBottom: '10px'}}
            onChange={this.handleHintLabelTypeChange.bind(this)}
            value={this.state.hintLabelType}
          >
            <Radio value="ANY">任意命中</Radio>
            <Radio value="ALL">同时命中</Radio>
          </Radio.Group>
          <div className={styles.splitLine}></div>
          <Checkbox.Group
            options={mzCheckOpts}
            value={this.state.hintLabelColums}
            onChange={this.handleMzOptsChange.bind(this)}
          />
          <div className={styles.btnRight}>
            <Button
              type="primary"
              //onClick={() => this.handleSearch(confirm, 'cache')
              onClick={() => this.handleSearch(confirm, col)
              }
              size="small"
              style={{
                width: 50,
              }}
            >
              确定
            </Button>
            { /* <Button
              onClick={() => this.handleReset(col.dataIndex,clearFilters)}
              size="small"
              style={{ width: 50 }}
              >
              取消
              </Button> */ }
          </div>
        </div>
      );
    }
    if (col.vtype === 'CHAR') {
      return (
        <div className={styles.sxContent}>
          <CustomSort sort={this.props.sort} col={col} onChangeSort={this.handleChangeSort.bind(this, col)}></CustomSort>
          <div className={styles.splitLine}></div>
          <p className={styles.tit}>筛选</p>
          <Input
            placeholder="请输入"
            allowClear
            value={
              (filterCondion
                && filterCondion[col.dataIndex]
                && filterCondion[col.dataIndex].values[0])
              || ''
            }
            onChange={this.handleSetWbz.bind(this, col)}
            onPressEnter={() => this.handleSearch(confirm, col)
            }
            style={{
              width: 218,
              marginBottom: 8,
              display: 'block',
            }}
          />
          <div className={styles.btnRight}>
            <Button
              type="primary"
              onClick={() => this.handleSearch(confirm, col)
              }
              size="small"
              style={{
                width: 50
              }}
            >
              确定
            </Button>
            { /* <Button
              onClick={() => this.handleReset(col.dataIndex,clearFilters)}
              size="small"
              style={{ width: 50 }}
              >
              取消
              </Button> */ }
          </div>
        </div>
      );
    } else if (col.vtype === 'PERCENT') {
      return (
        <div className={styles.sxContent}>
          <CustomSort sort={this.props.sort} col={col} onChangeSort={this.handleChangeSort.bind(this, col)}></CustomSort>
          <div className={styles.splitLine}></div>
          <p className={styles.tit}>筛选</p>
          <div>
            <NumericInput
              placeholder="起始值"
              value={
                (filterCondion
                  && filterCondion[col.dataIndex]
                  && filterCondion[col.dataIndex].values[0])
                || ''
              }
              onChange={this.handleSetBeginmun.bind(this, col)}
              onPressEnter={() => this.handleSearch(confirm, col)
              }
              style={{
                width: 125,
                marginBottom: 8,
                marginRight: 2,
              }}
            />
            <span style={{
              marginRight: 4,
            }}
            >%
            </span>至
            <NumericInput
              placeholder="结束值"
              value={
                (filterCondion
                  && filterCondion[col.dataIndex]
                  && filterCondion[col.dataIndex].values[1])
                || ''
              }
              onChange={this.handleSetEndmun.bind(this, col)}
              onPressEnter={() => this.handleSearch(confirm, col)
              }
              style={{
                width: 125,
                marginBottom: 8,
                marginLeft: 4,
                marginRight: 2,
              }}
            />
            <span>%</span>
          </div>
          <div
            className={styles.btnRight}
            style={{
              marginRight: 12,
            }}
          >
            <Button
              type="primary"
              onClick={() => this.handleSearch(confirm, col)
              }
              size="small"
              style={{
                width: 50
              }}
            >
              确定
            </Button>
            { /* <Button
              onClick={() => this.handleReset(col.dataIndex,clearFilters)}
              size='small'
              style={{ width: 50 }}
              >
              取消
              </Button> */ }
          </div>
        </div>
      );
    } else if (
      col.vtype === 'MONEY'
      || col.vtype === 'DOUBLE'
      || col.vtype === 'NUMBER'
    ) {
      return (
        <div className={styles.sxContent}>
          <CustomSort sort={this.props.sort} col={col} onChangeSort={this.handleChangeSort.bind(this, col)}></CustomSort>
          <div className={styles.splitLine}></div>
          <p className={styles.tit}>筛选</p>
          <div>
            <NumericInput
              placeholder="起始值"
              value={
                (filterCondion
                  && filterCondion[col.dataIndex]
                  && filterCondion[col.dataIndex].values[0])
                || ''
              }
              onChange={this.handleSetBeginmun.bind(this, col)}
              onPressEnter={() => this.handleSearch(confirm, col)
              }
              style={{
                width: 125,
                marginBottom: 8,
                marginRight: 4,
              }}
            />
            至
            <NumericInput
              placeholder="结束值"
              value={
                (filterCondion
                  && filterCondion[col.dataIndex]
                  && filterCondion[col.dataIndex].values[1])
                || ''
              }
              onChange={this.handleSetEndmun.bind(this, col)}
              onPressEnter={() => this.handleSearch(confirm, col)
              }
              style={{
                width: 125,
                marginBottom: 8,
                marginLeft: 4,
              }}
            />
          </div>
          <div className={styles.btnRight}>
            <Button
              type="primary"
              onClick={() => this.handleSearch(confirm, col)
              }
              size="small"
              style={{
                width: 50,
                marginTop: 10,
              }}
            >
              确定
            </Button>
          </div>
        </div>
      );
    } else if (col.vtype === 'DATE' || col.vtype === 'TIME') {
      return (
        <div className={styles.sxContent}>
          <CustomSort sort={this.props.sort} col={col} onChangeSort={this.handleChangeSort.bind(this, col)}></CustomSort>
          <div className={styles.splitLine}></div>
          <p className={styles.tit}>筛选</p>
          <div>
            <DatePicker
              placeholder=""
              format="YYYY-MM-DD"
              // value={allFilterCondition && allFilterCondition[col.dataIndex] && allFilterCondition[col.dataIndex][0] || ''}
              onChange={this.handleSetBeginmun.bind(this, col)}
              style={{
                width: 125,
                marginBottom: 8,
                marginRight: 4,
              }}
            />
            至
            <DatePicker
              placeholder=""
              format="YYYY-MM-DD"
              // value={allFilterCondition && allFilterCondition[col.dataIndex] && allFilterCondition[col.dataIndex][1] || ''}
              onChange={this.handleSetEndmun.bind(this, col)}
              style={{
                width: 125,
                marginBottom: 8,
                marginLeft: 4,
              }}
            />
          </div>
          <div className={styles.btnRight}>
            <Button
              type="primary"
              onClick={() => this.handleSearch(confirm, col)
              }
              size="small"
              style={{
                width: 50,
                marginTop: 10,
              }}
            >
              确定
            </Button>
          </div>
        </div>
      );
    } else if (col.vtype === 'WD') {
      const code = col.code;
      const opts = wdMap[code] || [];
      const options = [];
      opts.forEach((opt, i) => {
        options.push(
          <Option
            key={opt.wdz}
            value={JSON.stringify({
              col: {
                dataIndex: col.dataIndex,
                code: col.code,
                vtype: col.vtype
              },
              opt,
            })}
          >
            {opt.wdmc}
          </Option>,
        );
      });
      // const colb = JSON.stringify(col);
      return (
        <div className={styles.sxContent}>
          <CustomSort sort={this.props.sort} col={col} onChangeSort={this.handleChangeSort.bind(this, col)}></CustomSort>
          <div className={styles.splitLine}></div>
          <p className={styles.tit}>筛选</p>
          <div
            className={styles.rqLine}
            onMouseDown={(e) => {
              e.preventDefault();
              this.curFilterDropId = col.code;
              return false;
            }}
          >
            <Select
              className="wdSelect"
              mode="multiple"
              style={{
                width: '100%',
              }}
              placeholder="-请选择-"
              onChange={this.handleWdChange.bind(this)}
            >
              {options}
            </Select>
          </div>
          <div className={styles.btnRight}>
            <Button
              type="primary"
              onClick={() => this.handleSearch(confirm, col)
              }
              size="small"
              style={{
                width: 50,
                marginTop: 10,
              }}
            >
              确定
            </Button>
          </div>
        </div>
      );
    }
  }
}

CustomFilterDropDown.propTypes = {
  wdMap: PropTypes.object,
  allFilterCondition: PropTypes.object,
  sort: PropTypes.object,
  key4Rerender: PropTypes.number,
};

export default connect((state) => ({
  wdMap: state.conditions.wdMap,
  allFilterCondition: state.customFilterDropDown.allFilterCondition, // 过滤条件
  sort: state.customFilterDropDown.sort, // 排序条件
}))(CustomFilterDropDown);