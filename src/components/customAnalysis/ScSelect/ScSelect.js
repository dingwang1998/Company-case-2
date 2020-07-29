import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Input, Modal, Form, message, Table, Popconfirm } from 'antd';
import NewScModal from '../NewScModal/NewScModal';
import styles from './ScSelect.less';
import IconFont from '../../common/iconFont/iconFont';

const Search = Input.Search;
class ScSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 是否显示弹出层
      selectedRowKeys: [], // 选中行key数组
      keyWord: '', // 搜索词
      loading: false, // 加载中
      typeIndex: 0, // 当前选择的分类
      newName: '', // 新建/或修改类别的名称
      editType: 'new', // 编辑类型，new、edit
      editVisible: false, // 是否编辑
      dm: '',
      hoverRowIndex: '', // 鼠标浮动的行mxId
    };
    // 默认状态
    this.defState = { ...this.state, };
    // 表格滚动区域高度
    this.scrollY = 350;
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  /**
   * 加载中
   * @param {*} flag 
   */
  showLoading(flag) {
    this.setState({
      loading: flag
    });
  }

  /**
   * 显示弹窗及初始化
   */
  openscSelectModel() {
    this.props.dispatch({ type: 'scSelect/querySc' });
    this.setState({
      visible: true
    });
    this.props.dispatch({ type: 'scSelect/queryScList' }).then(() => {
      this.resetSelect();
      this.showLoading(false);
    })
  }

  /**
   * @description: 点击取消
   * @param {type} 
   * @return: null
   */
  handleCancel() {
    this.setState({
      visible: false,
      loading: false
    });
    this.resetModal();
  }

  /**
   * @description: 构造扩展信息中文名称数组
   * @param {type} 
   * @return: 
   */
  buildTagKzxx() {
    var tagKzxx = [];
    JSON.parse(this.props.selectObj.kzxx).map((item, i) => {
      tagKzxx.push(item.name);
      return null;
    });
    return tagKzxx;
  }

  /**
   * @description: 点击确定
   * @param {type} 
   * @return: 
   */
  handleOk() {
    // 确定选中
    if (!this.props.selectId) {
      message.warn("请选择收藏记录");
      return;
    }
    const { dispatch } = this.props;

    //TODO 设置主页面的对象
    dispatch({ type: 'publicVar/mxRecord', mxId: this.props.selectId });
    dispatch({ type: 'publicVar/changeTagKzxx', tagKzxx: this.buildTagKzxx() });
    dispatch({ type: 'publicVar/updateRiskPoints', riskPoints: JSON.parse(this.props.selectObj.fxd) });

    //重置Modal并关闭
    this.setState({
      visible: false
    });
    this.resetModal();

  }

  /**
   * @description: 模型列表查询
   * @param {type} 
   * @return: 
   */
  getScList(e, index) {
    this.setState({ typeIndex: index });
    this.showLoading(true);
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'scType', value: e.scDm || "" });
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'pageIndex', value: 1 }); //回到第一页
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'keyWord', value: this.state.keyWord });
    this.props.dispatch({ type: 'scSelect/queryScList' }).then(() => {
      this.resetSelect();
      this.showLoading(false);
    });
  }

  /**
   * @description: 设置检索词
   * @param {type} 
   * @return: 
   */
  changeKeyword(e) {
    this.setState({
      keyWord: e.target.value
    });
  }

  /**
   * @description: 搜索收藏记录列表
   * @param {type} 
   * @return: 
   */
  searchMxList(value) {
    this.showLoading(true);
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'keyWord', value: value });
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'pageIndex', value: 1 }); //回到第一页
    this.props.dispatch({ type: 'scSelect/queryScList' }).then(() => {
      this.resetSelect();
      this.showLoading(false);
    });
  }

  /**
   * @description: 重置选中数据为空
   * @param {type} 
   * @return: 
   */
  resetSelect() {
    this.setState({ selectedRowKeys: [] });
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'selectId', value: "" });
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'selectObj', value: {} });
  }

  /**
   * @description: 重置弹出框
   * @param {type} 
   * @return: 
   */
  resetModal() {
    this.setState((state) => {
      return {
        ...this.defState,
      };
    });
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'keyWord', value: '' });
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'pageIndex', value: 1 }); // 回到第一页
    this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'pageSize', value: 25 }); // 分页大小

    this.resetSelect();
  }

  /**
   * @description: 分页触发
   * @param {type} 
   * @return: 
   */
  handleYsListTableChange(pagination, filters, sorter, extra) {
    this.showLoading(true);

    const { dispatch } = this.props;
    dispatch({
      type: 'scSelect/changeTableProps',
      pageSize: pagination.pageSize,
      pageIndex: pagination.current
    }).then(() => {
      this.resetSelect();
      this.showLoading(false);
    });
  }

  /**
   * @description: 选择行事件
   * @param {type} 
   * @return: 
   */
  selectRow = (record) => {
    let selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys = [];
      this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'selectId', value: "" });
      this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'selectObj', value: {} });
    } else {
      selectedRowKeys = [record.key];
      this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'selectId', value: record.key });
      this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'selectObj', value: record });
    }
    this.setState({ selectedRowKeys });
  }

  /**
   * @description: 修改或新增分类
   * @param {type} 
   * @return: 
   */
  updateScName = (updateName, updateDesc) => {
    const { dm, editType } = this.state;
    this.props.dispatch({ type: 'scSelect/updateScName', editType, id: dm, name: updateName, desc: updateDesc }).then(res => {
      if (res.code === '1') {
        message.info('操作成功');
        this.setState({
          editVisible: false,
        })
        this.openscSelectModel();
      }
      else {
        message.warning(res.msg);
      }
    }).catch((e) => {
      message.warning('操作失败，请检查您的网络')
    })
  }

  /**
   * @description: 分类编辑
   * @param {type} 
   * @return: 
   */
  editMx = item => {
    this.setState({
      dm: item.scDm,
      updateName: item.scMc,
      updateDesc: item.scMs,
      editVisible: true,
      editType: 'edit'
    })
  }

  /**
   * @description: 分类删除
   * @param {type} 
   * @return: 
   */
  delMx = item => {
    this.setState({
      dm: item.scDm
    }, () => {
      this.props.dispatch({ type: 'scSelect/deleteSc', id: item.scDm }).then(res => {
        if (res.code === '1') {
          message.info('操作成功');
          this.openscSelectModel();
        }
        else {
          message.warning(res.msg);
        }
      }).catch((e) => {
        message.warning('操作失败，请检查您的网络')
      })
    })
  }

  render() {
    // 表格列配置
    const columns = [
      { dataIndex: 'index', title: '序号', width: '10%', align: 'center' },
      { dataIndex: 'scjlmc', title: '收藏记录名称', width: '60%', align: 'left', ellipsis: true },
      { dataIndex: 'scsj', title: '收藏时间', align: 'center', width: "25%" },
    ];

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      columnTitle: (<div style={{ width: '16px' }}></div>),
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
        this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'selectId', value: selectedRowKeys[0] });
        this.props.dispatch({ type: 'scSelect/changeParamStateAux', key: 'selectObj', value: selectedRows[0] });
      }
    };
    return (
      <span style={{ float: 'right' }}>
        <a className="btn-link" onClick={this.openscSelectModel.bind(this)}>
          <IconFont type="svy-fxicon-shoucangjia" style={{ fontSize: 20, marginRight: 5 }} />
          <span style={{ verticalAlign: 2, fontSize: 14 }}>收藏夹</span>
        </a>
        <Modal
          title={<div>我的收藏&nbsp;&nbsp;<IconFont type="svy-fxicon-tianjia" onClick={() => this.setState({
            dm: '',
            editVisible: true,
            editType: 'new'
          })} style={{ fontSize: 16, color: '#000', cursor: 'pointer' }} /></div>}
          className='largeMdoal noFootBorder'
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width={'1080px'}
          cancelText='取消'
          okText='确定'
        >
          <div>
            <div className={styles.MxLeft}>
              {
                this.props.scTypes && this.props.scTypes.map((item, index) => (
                  <div className={styles.MxLeftItem} key={index} style={{ background: `${this.state.typeIndex === index ? '#F4F6F9' : '#fff'}` }}>
                    <span onClick={this.getScList.bind(this, item, index)}>{item.scMc + ' (' + item.scgs + ')'}</span>
                    <Popconfirm
                      title="是否将该收藏删除？"
                      onConfirm={this.delMx.bind(this, item)}
                      okText="确定"
                      cancelText="取消">
                      <a style={{ marginLeft: '5px' }}><IconFont type="svy-fxicon-shanchu" /></a>
                    </Popconfirm>
                    <a onClick={this.editMx.bind(this, item)} style={{ marginLeft: '5px' }}><IconFont type="svy-fxicon-xiugai" /></a>
                  </div>
                ))
              }
            </div>
            <div id="mxRight" className={styles.MxRight} style={{ display: 'inline-block' }}>
              <div className={styles.rightTab} tab="" key="list" >
                <div className="pane-header lay-float">
                  <Search placeholder="请输入收藏记录名称" onChange={this.changeKeyword.bind(this)} onSearch={this.searchMxList.bind(this)} value={this.state.keyWord} style={{ width: 330, marginLeft: 5 }} />
                </div>
                <Table
                  dataSource={this.props.scList.map((row, i) => ({
                    ...row,
                    index: (this.props.pageIndex - 1) * this.props.pageSize + i + 1,
                    key: row['scid']
                  }))}
                  columns={columns}
                  loading={this.state.loading}
                  className={`${styles.mxxzTable} noheaderborder`}
                  size='small'
                  scroll={{ y: this.scrollY }}
                  rowSelection={rowSelection}
                  rowKey='scid'
                  onRow={(record) => ({
                    onClick: (params) => {
                      if (['svg', 'A', 'I'].indexOf(params.target.tagName) === -1) {
                        this.selectRow(record);
                      }
                    },
                    onMouseEnter: (event) => {
                      this.setState({
                        hoverRowIndex: record.scid
                      })
                    },
                    onMouseLeave: (event) => {
                      this.setState({
                        hoverRowIndex: ''
                      })
                    }
                  })}
                  onChange={this.handleYsListTableChange.bind(this)}
                  pagination={{
                    showTotal: () => (<div>共{this.props.total}条</div>),
                    showSizeChanger: true,
                    total: this.props.total,
                    current: this.props.pageIndex,
                    pageSize: this.props.pageSize,
                    pageSizeOptions: ['25', '50', '100'],
                    size: 'small'
                  }}>
                </Table>
              </div>
            </div>
          </div>
        </Modal>
        <NewScModal type={this.state.editType}
          editVisible={this.state.editVisible}
          onModalOk={this.updateScName}
          updateName={this.state.updateName}
          updateDesc={this.state.updateDesc}
          cancelIt={() => this.setState({ editVisible: false })}
        />
      </span>
    );
  }
}


ScSelect.propTypes = {
  scTypes: PropTypes.array,
  scList: PropTypes.array,
  total: PropTypes.number,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  selectObj: PropTypes.object,
  selectId: PropTypes.string
}

export default connect(state => ({
  scTypes: state.scSelect.scTypes,
  scList: state.scSelect.scList,
  total: state.scSelect.total,
  pageIndex: state.scSelect.pageIndex,
  pageSize: state.scSelect.pageSize,
  selectObj: state.scSelect.selectObj,
  selectId: state.scSelect.selectId
}))(Form.create({})(ScSelect))