import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Button, Popover, message } from 'antd';

class ExportBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  /**
   * exportType: ALL 全部导出   ANY 本页导出
   */
  handleOutput = (exportType) => {
    const { dispatch } = this.props;
    if (this.props.total <= 0) {
      message.destroy();
      message.info('当前无可导出的数据');
      return;
    }
    new Promise((resolve, reject) => {
      dispatch({ type: 'resultTable/exportTable', payload: { resolve, exportType } });
      message.destroy();
      message.loading('正在导出，请稍候。', 0);
    }).then((res) => {
      if (res.code == '600') {
        message.destroy();
        const path = res.data.filePathList[0].fileFullServerPath;
        const elink = document.createElement('a');
        elink.download = res.data.filePathList[0].fileName;
        elink.style.display = 'none';
        elink.href = path;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
        message.success('导出成功');
      } else {
        message.destroy();
        message.error(res.error || '导出失败');
      }
    });
  }

  /**
   * 构造列表表头
   */
  // buildAllHeaders = () => {
  //   const columnHeaders = JSON.parse(JSON.stringify(this.props.columns));

  //   const deepNum = this.getTableDeeps(columnHeaders);

  //   this.buildColumnHeader(columnHeaders, -1, deepNum);

  //   return columnHeaders;
  // }

  /**
   * @description: 构建列表头
   * @param {type} any
   * @return: void
   */
  // buildColumnHeader = (columnHeaders, level, deepNum) => {
  //   for (let i = 0; i < columnHeaders.length; i++) {
  //     const column = columnHeaders[i];
  //     column.header = column.title;
  //     column.name = column.key;
  //     column.field = column.dm ? column.dm : column.key;
  //     column.level = level + 1;
  //     if (column.children && column.children.length > 0) {
  //       column.colspan = column.children.length;
  //       column.rowSpan = 1;
  //       this.buildColumnHeader(column.children, column.level, deepNum);
  //     } else {
  //       column.colspan = 1;
  //       column.rowSpan = deepNum - level - 1;
  //     }
  //   }
  //   return columnHeaders;
  // }

  /**
   * 获取表格层级深度
   */
  // getTableDeeps = (cols) => {
  //   let deep = 0;
  //   let deepNum = 0;
  //   for (let i = 0; i < cols.length; i++) {
  //     const column = cols[i];
  //     if (column.children && column.children.length > 0) {
  //       deep = 1 + this.getTableDeeps(column.children);
  //     } else {
  //       deep = 1;
  //     }
  //     if (deep > deepNum) {
  //       deepNum = deep;
  //     }
  //   }
  //   return deepNum;
  // }

  render() {
    // 导出浮动层内容
    const exportContent = (
      <div style={{ color: '#333' }}>
        <div style={{ padding: '0px', marginBottom: '5px', cursor: 'pointer' }} onClick={() => this.handleOutput('ANY')}>本页导出</div>
        <div style={{ padding: '0px', marginTop: '5px', cursor: 'pointer' }} onClick={() => this.handleOutput('ALL')}>全部导出</div>
      </div>
    );
    return (
      <Popover content={exportContent} placement="bottomLeft">
        <Button type="primary" style={{ marginRight: 10 }}>导出</Button>
      </Popover>
    );
  }
}

ExportBtn.propTypes = {
  total: PropTypes.number,
  columns: PropTypes.array,
};

export default connect(state => ({
  columns: state.resultTable.columns,
  total: state.resultTable.total,
}))(ExportBtn);
