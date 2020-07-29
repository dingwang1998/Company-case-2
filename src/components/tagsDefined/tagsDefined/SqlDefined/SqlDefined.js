/*
 * @Author: zhangqy
 * @Date: 2020-03-19 15:25:45
 * @LastEditTime: 2020-03-31 14:07:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\components\tagsDefined\tagsDefined\SqlDefined\SqlDefined.js
 */
import { connect } from "dva";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Input, Modal, Table, Form,message } from "antd";
import styles from "./SqlDefined.less";

const { TextArea } = Input;
class SqlDefined extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ylvisible: false, //样例弹窗显示标识
      yzvisible: false, //语句验证弹窗显示标识
      sql: this.props.sql, //sql内容
    };
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  componentDidMount() {
    // 条件初始化
    this.props.onRef(this);

  }

  /**
   * @description: 样例点击事件弹窗
   * @param {type}
   * @return:
   */
  exampleOpen = () => {
    this.setState({
      ylvisible: true
    });
  };

  /**
   * @description: 样例弹窗点击事件
   * @param {type}
   * @return:
   */
  ylhandleOk = () => {
    this.setState({
      ylvisible: false
    });
  };

  /**
   * @description: 样例弹窗取消事件
   * @param {type}
   * @return:
   */
  ylhandleCancel = () => {
    this.setState({
      ylvisible: false
    });
  };

  /**
   * @description: 语句验证点击事件弹窗
   * @param {type}
   * @return:
   */
  checkedOpen = () => {
    const dispatch = this.props.dispatch;
    const sql =this.state.sql;
    if(!sql){
        message.warning("请输入sql!");
        return;
    }
    dispatch({ type: "tagDefine/advanced/checkSql"});
      // dispatch({ type: "finetagsDedSQL/checkedSql"});
    this.setState({
      yzvisible: true
    });
  };

  /**
   * @description: 语句验证弹窗点击事件
   * @param {type}
   * @return:
   */
  yzhandleOk = () => {

    this.setState({
      yzvisible: false
    });
  };

  /**
   * @description: 语句验证弹窗取消事件
   * @param {type}
   * @return:
   */
  yzhandleCancel = () => {
    this.setState({
      yzvisible: false
    });
  };

  /**
   * @description: sql改变事件
   * @param {type} 
   * @return: 
   */
  sqlChange = (value) => {
    const sql = value.target.value;
    this.setState({
      sql: sql,
    });
    this.props.dispatch({
      type: "tagsDefinedSQL/changeParamState",
      key: "sql",
      value: sql
    });

  }

  render() {
    const checkedResule = this.props.isPass;
    const dataSource = this.props.tableResult || [];
    const objFirst = dataSource? dataSource[0] : {};
    let columns = [
      { dataIndex: "index", title: "序号", width: "10%", align: "center" }
    ];
    for (var key in objFirst) {
      const colunmobj = { dataIndex: key, title: key, align: "center" };
      columns.push(colunmobj);
    }

    const passContent = (
      <div className={styles.passContent}>
        <div style={{ overflow: "hidden" }}>
          <div className={styles.leftFont}>返回测试结果：</div>
          <div className={styles.rightFont}>注：随机抽取5条</div>
        </div>
        <Table
          bordered
          className={[styles.SqlDefinedTable, 'deepColorTableHeight'].join(' ')}
          size="small"
          rowKey={(row) => row.key}
          dataSource={dataSource.map((row, i) => ({
            ...row,
            index: i + 1,
            key: row.id
          }))}
          pagination={false}
          columns={columns}
        ></Table>
      </div>
    );
    const faildContent = (
      <div className={styles.faildContent}>
        <div>不通过原因：</div>
        <div className={styles.resultContent}>
          {this.props.errorMsg}
        </div>
      </div>
    );

    const placeholder =
      "请输入取值sql！例如： select t.nsrdzdah,t.zq_id,case when t.ynse > 100 then 1 else 0 end result_col from sb_sbxx t      注意:取值SQL中除维度以外，必须要有一个字段名或者别名为result_col。";
    return (
      <div className={styles.sqlDefined}>
        <div className={styles.titleLine}>
          <div className={styles.fontLeft}>标签定义(sql)</div>
          <div className={styles.bottonRight}>
            <Button size="small" onClick={this.exampleOpen.bind(this)}>
              样例
            </Button>
            <Button
              size="small"
              onClick={this.checkedOpen.bind(this)}
              style={{ marginLeft: "12px" }}
            >
              语句验证
            </Button>
          </div>
        </div>
        <div className={styles.sqlJy}>
          <TextArea placeholder={placeholder} value={this.props.sql} onChange={this.sqlChange.bind(this)} className={styles.srcontent} />
        </div>
        <Modal
          title="SQL样例"
          visible={this.state.ylvisible}
          onOk={this.ylhandleOk.bind(this)}
          onCancel={this.ylhandleCancel.bind(this)}
        >
          <div className={styles.exampleContent}>
            <div>典型的sql如下：</div>
            <div>
              select t.nsrdzdah,
              <br />
              t.zq_id,
              <br />
              case
              <br />
              when t.ynse  100 then
              <br />
              1<br />
              else
              <br />
              0<br />
              end result_col
              <br />
              from sb_sbxx t<br />
            </div>
            <div className={styles.attention}>
              注意:取值SQL中除维度以外，必须要有一个字段名或者别名为result_col。
            </div>
          </div>
        </Modal>
        <Modal
          title="SQL语句验证"
          destroyOnClose
          visible={this.state.yzvisible}
          onOk={this.yzhandleOk.bind(this)}
          onCancel={this.yzhandleCancel.bind(this)}
        >
          <div className={styles.checkContent}>
            <div>
              验证结果：
              <span className={checkedResule ? styles.pass : styles.faild}>
                {checkedResule ? "通过" : checkedResule===false ? "不通过": ''}
              </span>
            </div>
            {checkedResule ? passContent : faildContent}
          </div>
        </Modal>
      </div>
    );
  }
}

SqlDefined.propTypes = {
  sql: PropTypes.string,
  isPass: PropTypes.any,
  tableResult: PropTypes.array,
  errorMsg: PropTypes.string
};
export default connect(state => ({

  sql: state.tagsDefinedSQL.sql,
  isPass: state.tagsDefinedSQL.isPass,
  tableResult: state.tagsDefinedSQL.tableResult,
  errorMsg: state.tagsDefinedSQL.errorMsg,
}))(Form.create({})(SqlDefined));
