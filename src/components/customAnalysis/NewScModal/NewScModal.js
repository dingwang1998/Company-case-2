import PropTypes from 'prop-types';
import { Input, Modal, Row, Col, message } from 'antd';
import React, { Component } from 'react';
import styles from './NewScModal.less';

class NewScModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: typeof this.props.editVisible === 'undefined' ? false : this.props.editVisible, // 新增分类modal控制
      updateName: typeof this.props.updateName === 'undefined' ? '' : this.props.updateName, // 新增分类名称
      updateDesc: typeof this.props.updateDesc === 'undefined' ? '' : this.props.updateDesc, // 新增分类描述
    };
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  UNSAFE_componentWillReceiveProps(nextProps) {
    // props改变时需要重新更改state状态
    if (this.props.editVisible !== nextProps.editVisible) {
      this.setState({
        visible: nextProps.editVisible,
      });
    }
    if (this.props.updateName !== nextProps.updateName) {
      this.setState({
        updateName: nextProps.updateName,
      });
    }
    if (this.props.updateDesc !== nextProps.updateDesc) {
      this.setState({
        updateDesc: nextProps.updateDesc,
      });
    }
  }

  /**
   * @description: 点击确定
   * @param {type} 
   * @return: 
   */
  modalOk = () => {
    const { updateName, updateDesc } = this.state;
    if (updateName === '') {
      message.info('请输入名称');
      return;
    }
    if (updateDesc === '') {
      message.info('请输入描述');
      return;
    }
    this.setState({
      updateName: '',
      updateDesc: '',
    }, () => {
      this.props.onModalOk(updateName, updateDesc);
    });
  }

  /**
   * @description: 取消操作
   * @param {type} 
   * @return: 
   */
  cancelIt = () => {
    this.setState({
      updateName: '',
      updateDesc: '',
    }, () => {
      this.props.cancelIt();
    });
  }

  render() {
    return (
      <Modal
        centered
        width={400}
        bodyStyle={{ minHeight: 90 }}
        title={this.props.type === 'new' ? '新增分类名称' : '修改分类名称'}
        visible={this.state.visible}
        onOk={this.props.onModalOk ? this.modalOk : () => { }}
        onCancel={this.props.cancelIt ? this.cancelIt : () => { }}
        cancelText='取消'
        okText='确定'
      >
        <div className={styles.newScModal}>
          <Row>
            <Col span={24}>
              <span className={styles.formLabel}><em className={styles.formIcon}>*</em>名称：</span>
              <Input
                allowClear
                className={styles.formInput}
                placeholder="请输入收藏目录名称"
                value={this.state.updateName}
                style={{ marginBottom: 10 }}
                onChange={(e) => { if (e.target.value.length > 30) return; this.setState({ updateName: e.target.value }); }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <span className={styles.formLabel}><em className={styles.formIcon}>*</em>描述：</span>
              <Input
                allowClear
                className={styles.formInput}
                placeholder="请输入收藏目录描述"
                value={this.state.updateDesc}
                onChange={e => this.setState({ updateDesc: e.target.value })}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

NewScModal.propTypes = {
  cancelIt: PropTypes.func.isRequired,
  editVisible: PropTypes.bool,
  type: PropTypes.string,
  onModalOk: PropTypes.func,
  updateName: PropTypes.string,
  updateDesc: PropTypes.string,
};

export default NewScModal;
