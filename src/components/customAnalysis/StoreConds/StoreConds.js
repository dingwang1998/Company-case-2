import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button, Popover, Badge, List, Empty, message, Popconfirm, Modal } from 'antd';
import IconFont from '../../common/iconFont/iconFont';
import styles from './StoreConds.less';

class StoreConds extends Component {
  /**
   * 获取当前时间的格式化(时分秒)
   * hhMMss
   */
  getCurrentTime = () => {
    const now = new Date();
    const hh = now.getHours();
    const MM = ((now.getMinutes() + 1).toString().length === 1) ? (`0${(now.getMinutes()).toString()}`) : (now.getMinutes());
    const ss = (now.getSeconds().toString().length === 1) ? (`0${now.getSeconds().toString()}`) : now.getSeconds();
    return `${hh}:${MM}:${ss}`;
  }

  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  }

  /**
   * 暂存当前查询条件
   */
  storeCurCondtion = () => {
    const cndList = JSON.parse(JSON.stringify(this.props.cndList));
    if (this.props.total <= 0) {
      Modal.confirm({
        title: '提示',
        content: '查询无数据，是否暂存',
        onOk: () => {
          const cndition = {
            key: cndList.length,
            name: '记录',
            time: this.getCurrentTime(),
            cnd: {},
          };
          const { dispatch } = this.props;
          dispatch({
            type: 'storeCnd/storeCurCondtion',
            cndition,
          });
        },
        onCancel() { },
      });
      return;
    }
    if (cndList.length >= 8) {
      message.warn('系统只允许暂存8次记录，请先做删除处理！');
      return;
    }
    const cndition = {
      key: cndList.length,
      name: '记录',
      time: this.getCurrentTime(),
      cnd: {},
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'storeCnd/storeCurCondtion',
      cndition,
    });
  }

  /**
   * 修改条件名称
   */
  editCurCondtion = (item, index) => {
    if (typeof item.isEdit === 'undefined') { item.isEdit = false; }
    item.isEdit = !item.isEdit;
    const cndList = JSON.parse(JSON.stringify(this.props.cndList));
    cndList[index] = item;
    const { dispatch } = this.props;
    dispatch({
      type: 'storeCnd/changeParamStateAux',
      key: 'cndList',
      value: cndList,
    });
  }

  /**
   * 输入框变化
   */
  handlerChangeName = (index, e) => {
    const cndList = JSON.parse(JSON.stringify(this.props.cndList));
    const val = e.target.value || '';
    if (val.length > 18) {
      message.warn('暂存记录名称过长，请重新输入！');
      return;
    }
    cndList[index].name = val;
    cndList[index].hasEdit = true;
    const { dispatch } = this.props;
    dispatch({
      type: 'storeCnd/changeParamStateAux',
      key: 'cndList',
      value: cndList,
    });
  }

  /**
   * 删除条件
   */
  handleDeleteCnd = (index) => {
    const cndList = JSON.parse(JSON.stringify(this.props.cndList));
    cndList.splice(index, 1);
    const { dispatch } = this.props;
    dispatch({
      type: 'storeCnd/changeParamStateAux',
      key: 'cndList',
      value: cndList,
    });
  }

  /**
   * 还原条件
   * @param {*} index
   */
  handlerRecoverCnd = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storeCnd/recoverCondtion',
      index,
    });
  }

  render() {
    const list = this.props.cndList;
    const content = list.length <= 0 ? <Empty /> : (
      <List
        itemLayout="horizontal"
        dataSource={list}
        className={styles.cndItem}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <a><IconFont type="svy-fxicon-xiugai" onClick={this.editCurCondtion.bind(this, item, index)} /></a>,
              <Popconfirm
                title="确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={this.handleDeleteCnd.bind(this, index)}
              >
                <a><IconFont type="svy-fxicon-shanchu" /></a>
              </Popconfirm>,
            ]}
          >
            <Row className={styles.cndCard}>
              <Col span={16} className={styles.label}>
                <div className={item.isEdit ? styles.hide : styles.name} title={item.name + (item.hasEdit ? '' : item.time)}>
                  {item.name + (item.hasEdit ? '' : item.time)}
                </div>
                <Input style={{ display: (item.isEdit ? 'block' : 'none'), marginTop: 6 }} value={item.name} onPressEnter={this.editCurCondtion.bind(this, item, index)} onChange={this.handlerChangeName.bind(this, index)} placeholder="请输入记录名称" />
              </Col>
              <Col span={6} className={styles.count} title={`${item.total}户`} onClick={this.handlerRecoverCnd.bind(this, index)}>{item.total}户</Col>
            </Row>
          </List.Item>
        )}
      />
    );
    return (
      <span id="storeContent" style={{ position: 'relative' }}>
        {JSON.stringify(this.props.resStateStroe) === '{}'
          ? (
            <Popover
              placement="topRight"
              content="请先查询后，再暂存条件"
            >
              <Button disabled>暂存</Button>
            </Popover>
          )
          : <Button onClick={this.storeCurCondtion}>暂存</Button>
        }
        {
          list.length <= 0 ? null
            : (
              <Popover
                title="暂存条件记录"
                content={content}
                placement="topRight"
                trigger="click"
                getPopupContainer={() => document.getElementById('storeContent')}
              >
                <Badge className={`${list.length <= 0 ? styles.hide : ''} storeCount`} count={list.length} overflowCount={20}>
                  <IconFont type="svy-fxicon-chakanxinxi" style={{ fontSize: 18 }} />
                </Badge>
              </Popover>
            )

        }
      </span>
    );
  }
}

StoreConds.propTypes = {
  cndList: PropTypes.array,
  total: PropTypes.number,
  resStateStroe: PropTypes.object,
};

export default connect(state => ({
  cndList: state.storeCnd.cndList,
  total: state.resultTable.total,
  resStateStroe: state.resultTable.resStateStroe,
}))(StoreConds);
