/*
 * @Author: zhangqy
 * @Date: 2020-03-12 15:05:59
 * @LastEditTime: 2020-04-02 09:26:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \analysisplatform2\src\components\MoreConditions.js
 */
/* eslint-disable*/
import { connect } from "dva";
import PropTypes from "prop-types";
import { Component } from "react";

import { Input, Table, Row, Col, Tree, message } from "antd";
import styles from "./TagSet.less";

const Search = Input.Search;
const { TreeNode } = Tree;


class TagSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: props.keyWord, // 搜索词
      selectedRowKeys: [], // 表格选中的行
      selectedContent: [], //选中行内容
      checkedTag: props.tagCheck // ree选中元素类型
    };
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };

  }

  componentDidMount() {
    // 条件初始化
    this.props.onRef(this);

  }





  /**
   * @description: 标签设置确定
   * @param {type}
   * @return:
   */
  handleTagOkcallBack() {
    const tagSetList = JSON.parse(JSON.stringify(this.props.tagSetList));
    const dqxzTag = this.state.selectedContent;
    let tagId = [];

    if (dqxzTag.bqMc) {
      for (var i = 0; i < tagSetList.length; i++) {
        tagId.push(tagSetList[i].bqId);
      }
      if (tagId.indexOf(dqxzTag.bqId) === -1) {
        tagSetList.push(dqxzTag);
      }

    } else {
      message.warning('请设置标签！');
    }


    this.props.dispatch({
      type: "conditions/changeParamState",
      key: "tagWindowShow",
      value: false
    });
    this.props.dispatch({
      type: "conditions/changeParamState",
      key: "isTagLoad",
      value: !this.props.isTagLoad
    });

    this.props.dispatch({
      type: "conditions/changeParamState",
      key: "tagSetList",
      value: tagSetList
    });

  };

  /**
   * 对分类列表的处理，转换为树型结构
   * @param {Object*} list
   */
  buildTree = list => {
    const temp = [];
    const tree = [];
    for (const i in list) {
      temp[list[i].bqMlId] = list[i];
    }
    for (const i in temp) {
      if (temp[i].pid) {
        if (!temp[temp[i].pid].children) {
          temp[temp[i].pid].children = {};
        }
        temp[temp[i].pid].children[temp[i].bqMlId] = temp[i];
      } else {
        tree[temp[i].bqMlId] = temp[i];
      }
    }
    return tree;
  };

  /**
   * 生成元素分类菜单
   */
  showYslxTree = list => {
    const tree = [];
    for (const item in list) {
      if (list[item].children) {
        // 有子节点的情况checkedTag
        tree.push(
          <TreeNode
            key={list[item].bqMlId}
            title={
              <span
                //    className={this.state.checkedTag.indexOf(list[item].bqMlId) > -1 ? styles.isSelect : ''}
                key={`tiltekey${list[item].bqMlId}`}
              >{`${list[item].bqMlMc} (${list[item].gs})`}</span>
            }
          >
            {this.showYslxTree(list[item].children)}
          </TreeNode>
        );
      } else {
        tree.push(
          <TreeNode
            key={list[item].bqMlId}
            title={
              <span
                //    className={this.state.checkedTag.indexOf(list[item].bqMlId) > -1 ? styles.isSelect : ''}
                key={`tiltekey${list[item].bqMlId}`}
              >{`${list[item].bqMlMc} (${list[item].gs})`}</span>
            }
          />
        );
      }
    }
    return tree;
  };

  /**
   * 设置检索词
   * @param {*} e
   */
  changeKeyword(e) {
    const value = e.target.value;
    this.setState({
      keyWord: value
    });
    this.props.dispatch({
      type: "conditions/changeParamState",
      key: "keyWord",
      value: value
    }); // 搜索后回到第一页
  }

  /**
   * 关键词搜索元素详情
   */
  searchYsList() {
    this.props.dispatch({
      type: "conditions/changeParamState",
      key: "yspageIndex",
      value: 1
    }); // 搜索后回到第一页
    // 查询标签列表
    this.props.dispatch({ type: "conditions/queryTagList" });
  }

  /**
   * 选中元素
   * @param {Object*} record 选择的行记录属性
   */
  selectRow = record => {
    // 状态同步
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  };

  /**
   * 表格分页过滤
   * @param {*} pagination
   * @param {*} filters
   * @param {*} sorter
   * @param {*} extra
   */
  handleYsListTableChange(pagination, filters, sorter, extra) {
    const { dispatch } = this.props;
    dispatch({
      type: "conditions/changeParamState",
      key: "tagpageSize",
      value: pagination.pageSize
    });
    dispatch({
      type: "conditions/changeParamState",
      key: "tagpageIndex",
      value: pagination.current
    });
     // 查询标签列表
     this.props.dispatch({ type: "conditions/queryTagList" });
  }

  /**
   * 获取元素列表
   * @param {[]} selectedKeys 选中的分类
   * @param {{selected: bool, selectedNodes, node, event}} eventFire 当前是否选中
   */
  getElementList(selectedKeys, eventFire) {
    const { checkedTag } = this.state;
    // 不能取消选中
    if (!eventFire.selected) {
      return;
    }

    this.setState({
      checkedTag: selectedKeys
    });

    // 设置参数
    this.props.dispatch({
      type: "conditions/changeAllState",
      allState: {
        tagpageIndex: 1, // 点标签回到第一页
        tagCheck: selectedKeys// 类型代码
      }
    });
    // 查询元素列表
    this.props.dispatch({ type: "conditions/queryTagList" });
  }

  render() {
    const dataSource = this.props.tagList || [];
    const owner = this;
    const columns = [
      { dataIndex: "index", title: "序号", width: "10%", align: "center" },
      {
        dataIndex: "bqMc",
        title: "标签名称",
        width: "60%",
        align: "left",
        ellipsis: true
      },
      { dataIndex: "jgplMc", title: "加工频率", align: "center", width: "25%" }
    ];
    const treeData = this.buildTree(this.props.tagType);
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      columnTitle: <div style={{ width: "16px" }}></div>,
      type: "radio",
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedContent: selectedRows[0] });
      }
    };
    return (
      <div>
        <div>
          <Row style={{ height: 378 }}>
            <Col span={6}>
              <div
                style={{
                  border: "1px solid #DFE1E6",
                  margin: "5px 10px",
                  padding: "0 3px",
                  height: 378,
                  overflow: "auto"
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #DFE1E6",
                    margin: "10px 8px",
                    paddingBottom: 8,
                    fontSize: 14
                  }}
                >
                  标签名称
                    </div>
                <Tree
                  //  defaultSelectedKeys={["ALL"]}

                  onSelect={this.getElementList.bind(this)}
                  selectedKeys={this.props.tagCheck}
                >
                  {this.showYslxTree(treeData)}
                </Tree>
              </div>
            </Col>
            <Col span={18}>
              <div className="pane">
                <div className="pane-header lay-float">
                  <Search
                    placeholder="请输入标签名称"
                    onChange={this.changeKeyword.bind(this)}
                    value={this.state.keyWord}
                    onSearch={this.searchYsList.bind(this)}
                    style={{ width: 330, marginLeft: 5 }}
                  />
                </div>
                <Table
                  dataSource={dataSource.map((row, i) => ({
                    ...row,
                    index:
                      (this.props.tagpageIndex - 1) *
                      this.props.tagpageSize +
                      i +
                      1,
                    key: row.id
                  }))}
                  columns={columns}
                  style={{ margin: 5, marginTop: 13 }}
                  bordered
                  className={[styles.TagSetContractTable, 'deepColorTableHeight'].join(' ')}
                  size="small"
                  rowKey="id"
                  scroll={{ y: this.scrollY }}
                  rowSelection={rowSelection}
                  onRow={record => ({
                    onClick: () => {
                      this.selectRow(record);
                    }
                  })}
                  onChange={this.handleYsListTableChange.bind(this)}
                  pagination={{
                    showTotal: () => <div>共{this.props.tagTotal}条</div>,
                    showSizeChanger: true,
                    total: this.props.tagTotal,
                    current: this.props.tagpageIndex,
                    pageSize: this.props.tagpageSize,
                    
                    pageSizeOptions: ["25", "50", "100"],
                    size: "small"
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>

      </div>
    );
  }
}

TagSet.propTypes = {
  tagSetList: PropTypes.array,
  tagList: PropTypes.array,
  tagTotal: PropTypes.number,
  tagpageIndex: PropTypes.number,
  tagpageSize: PropTypes.number,
  tagCheck: PropTypes.array,
  keyWord: PropTypes.string,
  tagType: PropTypes.array,
  isTagLoad: PropTypes.any,
};
export default connect(state => ({
  tagSetList: state.conditions.tagSetList,
  tagList: state.conditions.tagList,
  tagTotal: state.conditions.tagTotal,
  tagpageIndex: state.conditions.tagpageIndex,
  tagpageSize: state.conditions.tagpageSize,
  tagCheck: state.conditions.tagCheck,
  keyWord: state.conditions.keyWord,
  tagType: state.conditions.tagType,
  isTagLoad: state.conditions.isTagLoad
}))(TagSet);
