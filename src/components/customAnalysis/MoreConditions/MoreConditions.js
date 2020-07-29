/*
 * @Author: zhangqy
 * @Date: 2020-03-12 15:05:59
 * @LastEditTime: 2020-03-19 08:37:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \analysisplatform2\src\components\MoreConditions.js
 */
/* eslint-disable*/
import { connect } from "dva";
import PropTypes from "prop-types";
import { Component } from "react";
import styles from "./MoreConditions.less";
import { Menu, TreeSelect, Button, Form, InputNumber } from "antd";

class MoreConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qygm_id: [], //企业规模
      qygm_id_value: [],
      qygm_id_searchValue: "",
      swdjcxys_start: "", //税务机关登记月数
      swdjcxys_end: "",
      nsrzt_id: [{ wdz: "03", wdzd: "NSRZT_ID" }], //纳税人状态

      nsrzt_id_value: ["03"],
      nsrzt_id_searchValue: "",
      zzsnsrlx_id: [], //增值税纳税人类型
      zzsnsrlx_id_value: [],
      zzsnsrlx_id_searchValue: "",
      zsfs_id: [], //企业所得税征收方式
      zsfs_id_value: [],
      zsfs_id_searchValue: "",
      djzclx_id: [], //登记注册类型
      djzclx_id_value: [],
      djzclx_id_searchValue: ""
    };
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 
  componentDidMount() {
    // 条件初始化
    const dispatch = this.props.dispatch;
    dispatch({ type: "conditions/queryDjzclx" });
    dispatch({ type: "conditions/queryQygm" });
    dispatch({ type: "conditions/queryNsrzt" });
    dispatch({ type: "conditions/queryZzslx" });
    dispatch({ type: "conditions/queryQysdszsfs" });
  }

  /**
   * @description: 税务登记月数格式化
   * @param {type}
   * @return:
   */

  formatterNumberInput = val => {
    // eslint-disable-next-line no-restricted-globals
    return isNaN(parseInt(val, 10)) ? "" : parseInt(val, 10);
  };

  /**
   * @description: 税务登记持续月数起改变事件
   * @param {type}
   * @return:
   */
  handleSwdjcxysStartChange = val => {
    this.setState({ swdjcxys_start: val });
  };

  /**
   * @description: 税务登记持续月数止改变事件
   * @param {type}
   * @return:
   */
  handleSwdjcxysEndChange = val => {
    this.setState({ swdjcxys_end: val });
  };

  /**
   * @description: 搜索值改变事件
   * @param {type}
   * @return:
   */
  onSearchValueChange = (stateKey, value) => {
    this.setState({
      [stateKey]: value
    });
  };
  /**
   * @description: 登记注册类型改变事件
   * @param {type}
   * @return:
   */
  handleDjzclxChange = (val, label, extra) => {
    const allCheckedNodes = extra.allCheckedNodes;
    const djzclx_id = allCheckedNodes.map(ele => {
      return {
        wdzd: ele.node ? ele.node.props.wdzd : ele.props.wdzd,
        wdz: ele.node ? ele.node.props.value : ele.props.value
      };
    });
    this.setState({
      djzclx_id_value: val,
      djzclx_id
    });
  };

  /**
   * @description: 企业规模改变事件
   * @param {type}
   * @return:
   */
  handleQygmChange = (val, label, extra) => {
    const allCheckedNodes = extra.allCheckedNodes;
    const qygm_id = allCheckedNodes.map(ele => {
      return {
        wdzd: ele.node ? ele.node.props.wdzd : ele.props.wdzd,
        wdz: ele.node ? ele.node.props.value : ele.props.value
      };
    });
    this.setState({
      qygm_id_value: val,
      qygm_id
    });
  };

  /**
   * @description: 纳税人状态改变事件
   * @param {type}
   * @return:
   */
  handleNsrztChange = (val, label, extra) => {
    const allCheckedNodes = extra.allCheckedNodes;
    const nsrzt_id = allCheckedNodes.map(ele => {
      return {
        wdzd: ele.node ? ele.node.props.wdzd : ele.props.wdzd,
        wdz: ele.node ? ele.node.props.value : ele.props.value
      };
    });
    this.setState({
      nsrzt_id_value: val,
      nsrzt_id
    });
  };

  /**
   * @description: 增值税类型改变事件
   * @param {type}
   * @return:
   */

  handleZzslxChange = (val, label, extra) => {
    const allCheckedNodes = extra.allCheckedNodes;
    const zzsnsrlx_id = allCheckedNodes.map(ele => {
      return {
        wdzd: ele.node ? ele.node.props.wdzd : ele.props.wdzd,
        wdz: ele.node ? ele.node.props.value : ele.props.value
      };
    });
    this.setState({
      zzsnsrlx_id_value: val,
      zzsnsrlx_id
    });
  };

  /**
   * @description: 企业所得税征收方式改变事件
   * @param {type}
   * @return:
   */

  handleZsfsChange = (val, label, extra) => {
    const allCheckedNodes = extra.allCheckedNodes;
    const findAllNodes = arr => {
      let ret = [];
      arr.forEach(item => {
        ret.push({
          wdzd: item.node ? item.node.props.wdzd : item.props.wdzd,
          wdz: item.node ? item.node.props.value : item.props.value
        });
        if (item.children && item.children.length > 0) {
          ret = ret.concat(findAllNodes(item.children));
        }
      });
      return ret;
    };
    const zsfs_id = findAllNodes(allCheckedNodes);
    this.setState({
      zsfs_id_value: val,
      zsfs_id
    });
  };

  /**
   * @description: 查询条件确定按钮点击事件
   * @param {type}
   * @return:
   */
  confirmParam = () => {
    this.props.dispatch({
      type: "conditions/saveParamToStore",
      djzclx_id: this.state.djzclx_id,
      qygm_id: this.state.qygm_id,
      swdjcxys_start: this.state.swdjcxys_start,
      swdjcxys_end: this.state.swdjcxys_end,
      nsrzt_id: this.state.nsrzt_id,
      zzsnsrlx_id: this.state.zzsnsrlx_id,
      zsfs_id: this.state.zsfs_id
    });
  };

  /**
   * @description: 重置筛选条件
   * @param {type}
   * @return:
   */
  resetParam = () => {
    this.setState({
      djzclx_id: [],
      djzclx_id_value: [],
      djzclx_id_searchValue: "",

      qygm_id: [],
      qygm_id_value: [],
      qygm_id_searchValue: "",

      swdjcxys_start: "",
      swdjcxys_end: "",

      nsrzt_id: [{ wdz: "03", wdzd: "NSRZT_ID" }],
      nsrzt_id_value: ["03"],
      nsrzt_id_searchValue: "",

      zzsnsrlx_id: [],
      zzsnsrlx_id_value: [],
      zzsnsrlx_id_searchValue: "",

      zsfs_id: [],
      zsfs_id_value: [],
      zsfs_id_searchValue: ""
    });
  };

  render() {
    // 树选择控件公共样式
    const treeSelectStyle = {
      width: 220,
      overflow: "hidden",
      marginLeft: 10,
      height: 32,
      verticalAlign: "middle"
    };
    const dropStyle = {
      height: "300px",
      overflow: "auto",
      boxShadow: "0px 0px 10px #eee",
      width: "220px"
    };

    return (
      <Menu className={styles.moreConditions}>
        <Menu.Item>
          <span className={styles.label}>登记注册类型：</span>
          <TreeSelect
            treeData={this.props.djzclxList}
            treeDataSimpleMode
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            searchValue={this.state.djzclx_id_searchValue}
            onSearch={this.onSearchValueChange.bind(
              this,
              "djzclx_id_searchValue"
            )}
            value={this.state.djzclx_id_value}
            onChange={this.handleDjzclxChange.bind(this)}
            placeholder="-请选择-"
            style={treeSelectStyle}
            dropdownStyle={{ ...dropStyle, maxHeight: "260px" }}
            treeNodeFilterProp="title"
          />
        </Menu.Item>
        <Menu.Item>
          <span className={styles.label}>企业规模：</span>
          <TreeSelect
            treeData={this.props.qygmList}
            treeDataSimpleMode
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            searchValue={this.state.qygm_id_searchValue}
            onSearch={this.onSearchValueChange.bind(
              this,
              "qygm_id_searchValue"
            )}
            value={this.state.qygm_id_value}
            onChange={this.handleQygmChange.bind(this)}
            placeholder="-请选择-"
            style={treeSelectStyle}
            treeNodeFilterProp="title"
          />
        </Menu.Item>
        <Menu.Item>
          <span className={styles.label}>纳税人状态：</span>
          <TreeSelect
            treeData={this.props.nsrztList}
            treeDataSimpleMode
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            searchValue={this.state.nsrzt_id_searchValue}
            onSearch={this.onSearchValueChange.bind(
              this,
              "nsrzt_id_searchValue"
            )}
            value={this.state.nsrzt_id_value}
            onChange={this.handleNsrztChange.bind(this)}
            placeholder="-请选择-"
            style={treeSelectStyle}
            dropdownStyle={{ ...dropStyle, maxHeight: "260px" }}
            treeNodeFilterProp="title"
          />
        </Menu.Item>
        <Menu.Item>
          <span className={styles.label}>增值税纳税人类型：</span>
          <TreeSelect
            treeData={this.props.zzslxList}
            treeDataSimpleMode
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            searchValue={this.state.zzsnsrlx_id_searchValue}
            onSearch={this.onSearchValueChange.bind(
              this,
              "zzsnsrlx_id_searchValue"
            )}
            value={this.state.zzsnsrlx_id_value}
            onChange={this.handleZzslxChange.bind(this)}
            placeholder="-请选择-"
            style={treeSelectStyle}
            treeNodeFilterProp="title"
          />
        </Menu.Item>
        <Menu.Item>
          <span className={styles.label}>企业所得税征收方式：</span>
          <TreeSelect
            treeData={this.props.qysdszsfsList}
            treeDataSimpleMode
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            searchValue={this.state.zsfs_id_searchValue}
            onSearch={this.onSearchValueChange.bind(
              this,
              "zsfs_id_searchValue"
            )}
            value={this.state.zsfs_id_value}
            onChange={this.handleZsfsChange.bind(this)}
            placeholder="-请选择-"
            style={treeSelectStyle}
            dropdownStyle={{ ...dropStyle, maxHeight: "260px" }}
            treeNodeFilterProp="title"
          />
        </Menu.Item>
        <Menu.Item>
          <span className={styles.label}>税务登记持续月数：</span>
          <InputNumber
            value={this.state.swdjcxys_start}
            onChange={this.handleSwdjcxysStartChange.bind(this)}
            min={0}
            style={{ width: 103, marginLeft: 10 }}
            formatter={this.formatterNumberInput}
          />
          至
          <InputNumber
            value={this.state.swdjcxys_end}
            onChange={this.handleSwdjcxysEndChange.bind(this)}
            min={0}
            style={{ width: 103 }}
            formatter={this.formatterNumberInput}
          />
        </Menu.Item>
        <Menu.Item style={{ textAlign: "right" }}>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={this.confirmParam.bind(this)}
          >
            确定
          </Button>
          <Button onClick={this.resetParam.bind(this)}>重置</Button>
        </Menu.Item>
      </Menu>
    );
  }
}

MoreConditions.propTypes = {
  swjgList: PropTypes.array,
  hyList: PropTypes.array,
  djzclxList: PropTypes.array,
  qygmList: PropTypes.array,
  nsrztList: PropTypes.array,
  zzslxList: PropTypes.array,
  qysdszsfsList: PropTypes.array,
  hy_id: PropTypes.array,
  djzclx_id: PropTypes.array,
  qygm_id: PropTypes.array,
  nsrzt_id: PropTypes.array,
  zzsnsrlx_id: PropTypes.array,
  zsfs_id: PropTypes.array,
  swdjcxys_start: PropTypes.string,
  swdjcxys_end: PropTypes.string
};
export default connect(state => ({
  swjgList: state.conditions.swjgList,
  hyList: state.conditions.hyList,
  djzclxList: state.conditions.djzclxList,
  qygmList: state.conditions.qygmList,
  nsrztList: state.conditions.nsrztList,
  zzslxList: state.conditions.zzslxList,
  qysdszsfsList: state.conditions.qysdszsfsList,
  hy_id: state.conditions.hy_id,
  djzclx_id: state.conditions.djzclx_id,
  qygm_id: state.conditions.qygm_id,
  nsrzt_id: state.conditions.nsrzt_id,
  zzsnsrlx_id: state.conditions.zzsnsrlx_id,
  zsfs_id: state.conditions.zsfs_id,
  swdjcxys_start: state.conditions.swdjcxys_start,
  swdjcxys_end: state.conditions.swdjcxys_end
}))(Form.create({})(MoreConditions));
