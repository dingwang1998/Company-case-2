/*
 * @Author: lijiam
 * @Date: 2020-03-17 09:40:08
 * @Description: 查询统计页面的统一布局组件
 * @LastEditors: lijiam
 * @LastEditTime: 2020-03-17 15:02:05
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import styles from './SearchLayout.less';

class SearchLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHeight: document.body.clientHeight - 97 // 页面的高度
    };
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  render() {
    const { pageHeight } = this.state;

    // 按钮
    const btns = <div className={styles.btnitems}>
      <Button type='primary' onClick={this.props.doSearch ? this.props.doSearch : () => console.warn('请设置doSearch查询事件')}>查询</Button>
      <Button style={{ marginLeft: 30 }} onClick={this.props.doReset ? this.props.doReset : () => console.warn('请设置doReset查询事件')}>重置</Button>
    </div>

    return (
      <div className={styles.searchLayout} style={{ height: pageHeight }}>
        <div className={styles.searchArea}>
          <div className={styles.searchConds}>{this.props.searchConds}</div>
          <div className={styles.searchBtns}>{this.props.searchBtns ? this.props.searchBtns : btns}</div>
        </div>
        <div className={styles.searchBody}>
          <div className={styles.bodyHead}>{this.props.tableTitle ? this.props.tableTitle : '请设置列表名称'}</div>
          <div className={styles.bodyContent}>{this.props.tableContent}</div>
        </div>
      </div>

    );
  }
}

SearchLayout.propTypes = {
  searchConds: PropTypes.object.isRequired, // 条件区域dom
  searchBtns: PropTypes.object, // 按钮区域dom
  tableTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]), // 表头标题栏dom、标题名称
  tableContent: PropTypes.object.isRequired, // 表格区域dom
  doSearch: PropTypes.func, // 点击查询事件
  doReset: PropTypes.func, // 点击重置事件
};

export default SearchLayout;
