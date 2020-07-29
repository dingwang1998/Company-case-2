import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Input, Modal, message, Table, Button, Row, Col, Select } from 'antd';
import NewScModal from '../NewScModal/NewScModal';
import styles from './ScModal.less';

class ScModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 弹框显示控制
      scjlmc: '', // 收藏记录名称
      scmlid: '', // 收藏目录
      keyWord: '', // 关键词
      editVisible: false, // 新增分类modal控制
      updateName: '', // 新增分类名称
      updateDesc: '', // 新增分类描述
    };
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  componentDidMount() {
    this.changeTableSize();
    this.props.dispatch({ type: 'scSelect/querySc' });
  }

  componentDidUpdate() {
    this.changeTableSize();
  }

  /**
   * @description: 改变表格大小
   * @param {type} 
   * @return: 
   */  
  changeTableSize = () => {
    const tableBody = document.querySelector('#fxTable .ant-table-body');
    const tableBodyInner = document.querySelector('#fxTable .ant-table-body-inner');
    if (tableBody !== null) {
      const height = parseInt(tableBody.style.maxHeight.replace('', ''), 10);
      const scrollH = Math.max(this.scrollY, height);
      tableBody.style.maxHeight = `${scrollH}px`;
      tableBody.style.height = `${scrollH}px`;
      if (tableBodyInner !== null) {
        tableBodyInner.style.maxHeight = `${scrollH}px`;
        tableBodyInner.style.height = `${scrollH}px`;
      }
    }
  }

  /**
   * @description: 点击确定
   * @param {type} 
   * @return: 
   */
  handleOk = () => {
    const { scjlmc, scmlid, keyWord } = this.state;
    if (scjlmc === '') {
      message.info('请填写收藏记录名称');
      return;
    }
    if (scmlid === '') {
      message.info('请填写收藏目录');
      return;
    }
    const params = {
      scjlmc,
      scmlid,
      keyWord,
      bqList: this.props.bqList,
    };
    this.props.dispatch({ type: 'scSelect/addOneCol', params }).then((res) => {
      if (res.code === '1') {
        message.info('操作成功');
        this.setState({
          editVisible: false,
        });
      } else {
        message.warning(res.msg);
      }
    }).catch(() => {
      message.warning('操作失败，请检查您的网络');
    });
  }

  /**
   * @description: 改变收藏目录
   * @param {type} 
   * @return: 
   */
  handleScmlChange = (scmlid) => {
    this.setState({ scmlid });
  };

  /**
   * @description: 增加收藏目录
   * @param {type} 
   * @return: 
   */
  updateScName = (updateName, updateDesc) => {
    this.props.dispatch({ type: 'scSelect/updateScName', editType: 'new', id: '', name: updateName, desc: updateDesc }).then((res) => {
      if (res.code === '1') {
        message.info('操作成功');
        this.setState({
          editVisible: false,
        });
        this.props.dispatch({ type: 'scSelect/querySc' });
      } else {
        message.warning(res.msg);
      }
    }).catch(() => {
      message.warning('操作失败，请检查您的网络');
    });
  }

  /**
   * @description: 处理收藏名称
   * @param {type} 
   * @return: 
   */
  handleScjlmc = (e) => {
    const scjlmc = e.target.value;
    if (scjlmc.length > 30) return;
    this.setState({ scjlmc });
  }

  /**
   * @description: 处理关键字
   * @param {type} 
   * @return: 
   */
  handleKeyword = (e) => {
    let keyWord = e.target.value;
    keyWord = keyWord.replace(/\s+/g, ' ');
    if (keyWord.split(' ').length > 10) return;
    this.setState({ keyWord });
  }

  render() {
    const columns = [
      { dataIndex: 'index', title: '序号', width: '10%', align: 'center' },
      { dataIndex: 'bqmc', title: '标签名称', width: '45%', align: 'center', ellipsis: true, render: text => <div style={{ textAlign: 'left' }}>{text}</div> },
      { dataIndex: 'bqsm', title: '标签说明', align: 'center', width: '45%', ellipsis: true, render: text => <div style={{ textAlign: 'left' }}>{text}</div> },
    ];
    const treeSelectStyle = {
      width: '60%', verticalAlign: 'middle', overflow: 'hidden', marginLeft: 4, marginRight: 4,
    };
    return (
      <span style={{ marginRight: 10 }}>
        <Button onClick={() => this.setState({ visible: true })}>收藏</Button>
        <Modal
          title='收藏'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: false, scjlmc: '', keyWord: '', scmlid: '' })}
          width={1080}
          cancelText='取消'
          okText='确定'
        >
          <div className={styles.scBtn}>
            <Row>
              <Col span={12}>
                <span className={styles.formLabel}><em className={styles.formIcon}>*</em>收藏记录名称：</span>
                <Input
                  allowClear
                  value={this.state.scjlmc}
                  onChange={this.handleScjlmc}
                  className={styles.formInput}
                  placeholder="请输入收藏记录名称" />
              </Col>
              <Col span={12}>
                <span className={styles.formLabel}><em className={styles.formIcon}>*</em>收藏目录：</span>
                <Select
                  allowClear
                  defaultValue={this.state.scmlid}
                  placeholder="-请选择-"
                  style={treeSelectStyle}
                  onSelect={this.handleScmlChange}>
                  {this.props.scTypes.map(item => <Select.Option key={item.scDm}>{item.scMc}</Select.Option>)}
                </Select>
                <Button icon="plus" type="dashed" size="small" onClick={() => this.setState({ editVisible: true })} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <span className={styles.formLabel}>关键词：</span>
                <Input
                  allowClear
                  value={this.state.keyWord}
                  onChange={this.handleKeyword}
                  className={styles.formInput}
                  placeholder="请输入关键词，以空格分隔" />
              </Col>
            </Row>
            <h3 style={{ marginTop: 20 }}>标签内容：</h3>
            <div id="fxTable">
              <Table
                style={{ marginTop: 5 }}
                columns={columns}
                rowKey="INDEX"
                dataSource={this.props.bqList}
                scroll={{ y: this.scrollY }}
                pagination={false}
                size="small"
                bordered
              />
            </div>
          </div>
        </Modal>
        <NewScModal type='new'
          editVisible={this.state.editVisible}
          onModalOk={this.updateScName}
          cancelIt={() => this.setState({ editVisible: false })} />
      </span>
    );
  }
}


ScModal.propTypes = {
  scTypes: PropTypes.array,
  bqList: PropTypes.array,
}

export default connect(state => ({
  scTypes: state.scSelect.scTypes,
  bqList: state.scSelect.bqList,
}))(ScModal)