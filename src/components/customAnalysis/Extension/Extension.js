/* eslint-disable*/
import styles from "./Extension.less";
import { connect } from "dva";
import PropTypes from "prop-types";
import { Component } from "react";
import { Checkbox, Empty, message } from "antd";
class Extension extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kzxxList: [] //选中的扩展信息对象数组
    };
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  }


  componentDidMount() {
    this.props.onRef(this);
    this.resetState();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //扩展信息弹窗取消时，不在tagKzxx中的，state中都要置为未选中状态
    if (nextProps.tagKzxx !== this.props.tagKzxx) {
      this.setState({
        kzxxList: nextProps.tagKzxx
      });
    }
  }

  /**
   * @description: 扩展信息弹窗取消时，不在tagKzxx中的，state中都要置为未选中状态
   * @param {type}
   * @return:
   */

  //
  resetState() {
    this.setState({
      kzxxList: this.props.tagKzxx
    });
  }

  /**
   * @description: 确认扩展信息选择
   * @param {type}
   * @return:
   */

  //
  confirmKzxxSelect() {

    const dispatch = this.props.dispatch;
    const { kzxxList } = this.state;
    if (kzxxList.length > 5) {
      message.warn('扩展信息最多选择5个！');
      return;
    }
    this.props.dispatch({ type: 'conditions/changeParamState', key: 'kzWindowShow', value: false });
    dispatch({ type: "conditions/changeTagKzxx", tagKzxx: kzxxList });
    let selectedTags = this.props.tagKzxxDetail.reduce((all, cur) => {
      return all.concat(cur.kzxxs);
    }, []).filter(tag => kzxxList.indexOf(tag.name) > -1);
    dispatch({ type: "conditions/changeParamState", key: 'selectedTags', value: selectedTags });
    let kzxxID = [];
    for (var i = 0; i < selectedTags.length; i++) {
      kzxxID.push(selectedTags[i].code);
    }
    const sortCode = this.props.sort ? this.props.sort.sortBy : '';
    if (kzxxID.indexOf(sortCode) < 0) {

      this.props.dispatch({ type: 'customFilterDropDown/changeParamStateAux', key: "sort", value: {} });

    }
  }

  /**
   * @description: 根据tagKzxx，构造扩展信息对象
   * @param {type}
   * @return:
   */

  //
  buildExtensionColums(kzxxStrs) {
    const kzxxArray = [];
    const kzxxKeyMap = {};
    for (let i = 0; i < this.props.tagKzxxDetail.length; i++) {
      const kzxxs = this.props.tagKzxxDetail[i].kzxxs;
      for (let j = 0; j < kzxxs.length; j++) {
        kzxxKeyMap[kzxxs[j].name] = kzxxs[j];
      }
    }
    for (let i = 0; i < kzxxStrs.length; i++) {
      // eslint-disable-next-line no-prototype-builtins
      if (kzxxKeyMap.hasOwnProperty(kzxxStrs[i])) {
        kzxxArray.push(kzxxKeyMap[kzxxStrs[i]]);
      }
    }
    return kzxxArray;
  }

  /**
   * 扩展信息选择
   * @param {*} e
   */
  kzxxSelect(e) {
    const dispatch = this.props.dispatch;
    let element = e.target.value;
    const { kzxxList } = this.state;
    const newKzxxList = [...kzxxList];
    if (e.target.checked === true) {
      newKzxxList.push(element);
    } else if (e.target.checked === false) {
      for (var i = 0; i < newKzxxList.length; i++) {
        if (newKzxxList[i] === element) {
          newKzxxList.splice(i, 1);
        }
      }
    }
    this.setState({
      kzxxList: newKzxxList
    });
  }

  render() {
    return (
      <div style={{ minHeight: 100 }}>
        {this.props.tagKzxxDetail && this.props.tagKzxxDetail.length > 0 ? (
          this.props.tagKzxxDetail.map((key, i) => {
            return (
              <div key={i} className={styles.kzxxList}>
                <div>{key.sxdlmc}</div>
                <div>
                  {key.kzxxs &&
                    key.kzxxs.map((item, j) => {
                      return (
                        <Checkbox
                          checked={
                            this.state.kzxxList.indexOf(item.name) !== -1
                          }
                          value={item.name}
                          key={item.code}
                          onChange={this.kzxxSelect.bind(this)}
                          className={styles.kzxxlb}
                        >
                          <span>{item.name}</span>{" "}
                        </Checkbox>
                      );
                    })}
                </div>
              </div>
            );
          })
        ) : (
            <Empty style={{ marginTop: 60 }} />
          )}
      </div>
    );
  }
}

Extension.propTypes = {
  tagKzxx: PropTypes.array,
  tagKzxxDetail: PropTypes.array,
  sort: PropTypes.object
};

export default connect(state => ({
  tagKzxx: state.conditions.tagKzxx,
  tagKzxxDetail: state.conditions.tagKzxxDetail,
  sort: state.customFilterDropDown.sort
}))(Extension);
