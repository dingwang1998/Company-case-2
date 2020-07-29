/*
 * @Author: your name
 * @Date: 2020-03-16 18:38:40
 * @LastEditTime: 2020-04-21 13:26:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\routes\customAnalysis\customAnalysis.js
 */
import React, { Component } from 'react';
import { Button, Divider, TreeSelect, Radio, Select, Modal, Tag, Icon } from 'antd';
import ResultTable from '../../components/customAnalysis/resultTable/resultTable';
// import './App.less';
// import ScModal from '../../components/customAnalysis/ScModal/ScModal';
import { connect } from 'dva';
import PropTypes from 'prop-types';
// import ScSelect from '../../components/customAnalysis/ScSelect/ScSelect';
import ExportBtn from '../../components/customAnalysis/ExportBtn';
import StoreConds from '../../components/customAnalysis/StoreConds/StoreConds';
// import IconFont from '../../components/common/iconFont/iconFont';
import Extension from '../../components/customAnalysis/Extension/Extension';
// import MoreConditions from '../../components/customAnalysis/MoreConditions/MoreConditions';
import styles from './customAnalysis.less';
import TagSet from '../../components/customAnalysis/TagSet/TagSet'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class CustomAnalysis extends Component {
	constructor(props) {
		super(props);
		this.state = {
			swjg_id_value: this.props.swjg_id_value,//税务机关
			hy_id_value: [],//行业
			hy_id: [],
			isHidenConds: false, // 是否隐藏条件区域
			tableHeight: document.body.clientHeight - 380, // 表格区域高度
			kzconfirmLoading: false,
		};
		this.dateYear = new Date().getFullYear() - 1;
	}

	componentWillUnmount = () => {
		this.setState = (state, callback) => {
			return;
		};
	}

	componentDidMount() {

		window.onresize = () => {
			this.setState({
				tableHeight: document.body.clientHeight - 380
			});
		}
		// 条件初始化
		const dispatch = this.props.dispatch;
		new Promise((resolve) => {
			dispatch({ type: 'conditions/querySwjg', resolve });
		}).then(() => {
			this.setSwjgValue();
		});


		// 查询扩展信息
		new Promise((resolve) => {
			dispatch({ type: 'conditions/queryKzxx', resolve });
		}).then(() => {
			dispatch({ type: 'conditions/changeTagKzxx', tagKzxx: JSON.parse(JSON.stringify(this.props.tagKzxx)) });
		})
		this.conditionsReset();
	}

	/**
	 * @description: 设置税务机关的值
	 * @param {type} 
	 * @return: 
	 */
	setSwjgValue() {
		const swjg_id = [];
		const swjg = this.props.user ? this.props.user.qxSwjgId : ''
		if (this.props.swjgList && this.props.swjgList.length > 0) {
			for (let i = 0, length = this.props.swjgList.length; i < length; i++) {
				const sw = this.props.swjgList[i];
				if (sw.wdz === swjg) {
					swjg_id.push({
						wdzd: sw.wdzd,
						wdz: sw.wdz,
						name: '税务机关',
					});
					break;
				}
			}


		}
		this.setState({
			swjg_id_value: swjg,
		})
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'swjg_id', value: swjg_id });
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'swjg_id_value', value: swjg });
	}

	/**
	 * @description: 分析期间年份点击事件
	 * @param {type} 
	 * @return: 
	 */
	handlePanelChange = (e) => {
		const value = parseInt(e.target.value, 10);
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'yearValue', value });
	}
	/**
	 * @description: 年份维度改变事件
	 * @param {type} 
	 * @return: 
	 */
	handleTimeNfChange = (value) => {
		const yearValue = parseInt(value, 10);
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'yearValue', yearValue });
	}

	/**
	 * @description: 分析期间粒度改变事件
	 * @param {type} 
	 * @return: 
	 */
	handleTimeWdChange = (value) => {
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'sjwd', value });
	}

	/**
	* @description:  时间改变
	* @param {type} 
	* @return: 
	*/
	handleRqChange(e) {
		const date_value = e.target.value;
		this.props.dispatch({
			type: 'conditions/changeAllState',
			allState: {
				sjwd: date_value,
				rq_value: date_value,
				rq_content: e.currentTarget.labels[0].innerText,
			},
		});
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'sjwd', value: e.target.value });
	}

	/**
	 * @description: 行业改变事件
	 * @param {type} 
	 * @return: 
	 */
	handleHyChange(val, label, extra) {
		const allCheckedNodes = extra.allCheckedNodes;
		const hy_id = allCheckedNodes.map((ele) => {
			return ({
				wdzd: ele.node ? ele.node.props.wdzd : ele.props.wdzd,
				wdz: ele.node ? ele.node.props.value : ele.props.value,
				name: '行业',
			});
		});

		this.props.dispatch({ type: 'conditions/changeParamState', key: 'hy_id', value: hy_id });
	}
	/**
	 * @description: 税务机关改变事件
	 * @param {type} 
	 * @return: 
	 */
	handleSwjgChange(val, label, extra) {
		const allCheckedNodes = extra.allCheckedNodes;
		const swjg_id = allCheckedNodes.map((ele) => {
			return ({
				wdzd: ele.node ? ele.node.props.wdzd : ele.props.wdzd,
				wdz: ele.node ? ele.node.props.value : ele.props.value,
				name: '税务机关',
			});
		});
		this.setState({
			swjg_id_value: val,
		})
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'swjg_id', value: swjg_id });
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'swjg_id_value', value: val });
	}

	/**
	* @description:  标签设置关闭
	* @param {type}
	* @return:
	*/
	tagWindowhandleCancel() {
		this.props.dispatch({
			type: "conditions/changeParamState",
			key: "tagWindowShow",
			value: false
		});

	}
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
	setTagDefaultType() {
		const treeData = this.buildTree(this.props.tagType);
		for (const item in treeData) {
			this.props.dispatch({
				type: "conditions/changeParamState",
				key: "tagCheck",
				value: [item]
			});
			this.props.dispatch({ type: 'conditions/queryTagList' });
			return;
		}
	}
	/**
	 * @description: 标签框添加按钮
	 * @param {type} 
	 * @return: 
	 */
	showTagModal() {
		const dispatch = this.props.dispatch;
		dispatch({
			type: "conditions/changeParamState",
			key: "keyWord",
			value: ''
		  });
		// 查询扩展信息
		new Promise((resolve) => {
			dispatch({ type: 'conditions/queryTagType', resolve });
		}).then(() => {
			this.setTagDefaultType();

		})


		// 查询标签列表
		//this.props.dispatch({ type: "conditions/queryTagList" });
		this.props.dispatch({
			type: "conditions/changeParamState",
			key: "tagWindowShow",
			value: true
		});
	}
	/**
	 * @description: 
	 * @param {type} 标签信息确定按钮
	 * @return: 
	 */
	handleTagOk() {
		this.tagset.handleTagOkcallBack();
	}
	/**
	* @description: 扩展信息确定按钮
	* @param {type} 
	* @return: 
	*/
	handlekzxxOk() {
		this.extension.confirmKzxxSelect();

	}
	/**
	 * @description:  扩展属性ref
	 * @param {type} 
	 * @return: 
	 */
	onExtensionRef = (ref) => {
		this.extension = ref;
	}
	/**
	 * @description: 扩展属性ref
	 * @param {type} 
	 * @return: 
	 */
	onTagonRef = (ref) => {
		this.tagset = ref;
	}

	/**
	 * @description:  扩展信息关闭
	 * @param {type} 
	 * @return: 
	 */
	kzWindowhandleCancel() {
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'kzWindowShow', value: false });
		this.extension.resetState();
	}

	/**
	 * @description: 扩展信息tag删除
	 * @param {type} 
	 * @return: 
	 */
	kzxxClose(kzxx, e) {
		const valueList = JSON.parse(JSON.stringify(this.props.tagKzxx));
		const allFilterCondition = this.props.allFilterCondition;
		let sort = this.props.sort;
		let kzxxCode = '';
		const tagKzxxDetail = this.props.tagKzxxDetail;
		for (let i = 0; i < tagKzxxDetail.length; i++) {
			const kzxxs = tagKzxxDetail[i].kzxxs;
			for (let j = 0; j < kzxxs.length; j++) {
				if (kzxx === kzxxs[j].name) {
					kzxxCode = kzxxs[j].code;
				}

			}
		}
		if (sort && sort.sortBy) {
			if (kzxxCode === sort.sortBy) {
				sort = {};
			}
		}
		for (let i = 0; i < valueList.length; i++) {
			if (kzxx === valueList[i]) {
				valueList.splice(i, 1);
			}
		}
		delete allFilterCondition[kzxxCode];
		this.props.dispatch({ type: 'customFilterDropDown/changeParamStateAux', key: "allFilterCondition", value: allFilterCondition });
		this.props.dispatch({ type: 'customFilterDropDown/changeParamStateAux', key: "sort", value: sort });
		this.props.dispatch({ type: 'conditions/changeTagKzxx', tagKzxx: valueList });
		this.props.dispatch({
			type: "conditions/changeParamState",
			key: "isTagLoad",
			value: !this.props.isTagLoad
		});

	}

	/**
	 * @description: 扩展信息弹窗展示
	 * @param {type} 
	 * @return: 
	 */
	showkzModal() {
		this.props.dispatch({ type: 'conditions/changeParamState', key: 'kzWindowShow', value: true });

		// 重置弹窗中的状态
		if (this.extension) {
			this.extension.resetState();
		}
	}
	/**
	 * @description: 表格查询
	 * @param {type} 
	 * @return: 
	 */
	doSearch() {
		this.props.dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'pageIndex',
			value: 1
		});
		this.props.dispatch({ type: 'resultTable/loadTable' });
	}
	/**
  * @description: 标签删除
  * @param {type}
  * @return:
  */
	tagClose(tag, e) {
		const allFilterCondition = this.props.allFilterCondition;
		const valueList = JSON.parse(JSON.stringify(this.props.tagSetList));
		let sort = this.props.sort;
		const dispatch = this.props.dispatch;
		for (let i = 0; i < valueList.length; i++) {
			if (tag.bqId === valueList[i].bqId) {
				valueList.splice(i, 1);
			}
		}
		if (sort && sort.sortBy) {
			if (tag.bqId === sort.sortBy) {
				sort = {};
			}
		}

		const bqmx = tag.bqMxList;
		if (allFilterCondition[tag.bqId]) {
			delete allFilterCondition[tag.bqId];
		}
		if (bqmx && bqmx.length > 0) {
			for (var j = 0; j < bqmx.length; j++) {
				if (allFilterCondition[bqmx[j].mxId]) {
					delete allFilterCondition[bqmx[j].mxId];
				}
				if (sort && sort.sortBy) {
					if (bqmx[j].mxZd === sort.sortBy) {
						sort = {};
					}
				}

			}
		}



		delete allFilterCondition[tag.bqId];
		this.props.dispatch({ type: 'customFilterDropDown/changeParamStateAux', key: "allFilterCondition", value: allFilterCondition });
		this.props.dispatch({ type: 'customFilterDropDown/changeParamStateAux', key: "sort", value: sort });
		dispatch({
			type: "conditions/changeParamState",
			key: "tagSetList",
			value: valueList
		});

		this.props.dispatch({
			type: "conditions/changeParamState",
			key: "isTagLoad",
			value: !this.props.isTagLoad
		});

	}

	/**
	 * @description: 条件重置
	 * @param {type} 
	 * @return: 
	 */
	conditionsReset() {
		this.setSwjgValue();
		this.setTagDefaultType();
		this.props.dispatch({
			type: 'conditions/changeAllState',
			allState: {
				sjwd: '',
				rq_value: 'n',
				rq_content: 'n',
				tagKzxx: [], // 主页面上展示的扩展信息名称(默认选中纳税人识别号)
				//tagKzxxDetail: [],
				yearValue: new Date().getFullYear() - 1, // 年份
				tagpageIndex: 1, // 标签分页相关数据
				tagTotal: 0, // 标签总条数
				tagpageSize: 25, // 标签分页
				//tagCheck: [tagCheck], // 标签默认全部
				// tagCode:'',
				//tagList:[],//tag表格查询结果
				selectedTags: [
					// {
					// 	id: "NSRSBH",
					// 	code: "NSRSBH",
					// 	name: "纳税人识别号",
					// 	ywlx: "NSR",
					// 	vtype: "CHAR"
					// }
				], // 选中的标签对象
				wdMap: {}, // 维度查询结果
				tagSetList: [],
			},
		});
		this.props.dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'tableData',
			value: []
		});
		this.props.dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'total',
			value: 0
		});
		this.props.dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'pageIndex',
			value: 1
		});
		this.props.dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'pageSize',
			value: 25
		});
		this.props.dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'resStateStroe',
			value: {}
		});
		this.props.dispatch({
			type: 'customFilterDropDown/changeHint',
			hint: {}
		});
		this.props.dispatch({
			type: 'customFilterDropDown/changeParamStateAux',
			key: 'sort',
			value: {}
		});
		this.props.dispatch({
			type: 'customFilterDropDown/changeParamStateAux',
			key: 'allFilterCondition',
			value: {}
		});
		
		this.props.dispatch({
			type: 'resultTable/changeParamStateAux',
			key: 'baseInfoColumns',
			value: [
				{
					code: 'SHXYDM',
					format: null,
					index: 1,
					name: '社会信用代码',
					sfzs: 'Y',
					vtype: 'CHAR',
					sfkpx: null,
					sfkgl: null,
					sfkfz: null,
					head: null,
					link: null,
					sort: null,
					ywlx: 'NSR',
				},
				{
					code: 'NSRMC',
					format: null,
					index: 3,
					name: '纳税人名称',
					sfzs: 'Y',
					vtype: 'CHAR',
					ywlx: 'NSR',
					sfkpx: null,
					sfkgl: null,
					sfkfz: null,
					head: null,
					sort: null,
				}
			],
		});
	}


	render() {
		//const moreConditionsContent =(<MoreConditions></MoreConditions>);
		const dropStyle = {
			height: '300px', overflow: 'auto', boxShadow: '0px 0px 10px #eee', width: '220px',
		};
		return (
			<div className={styles.customAnalysis}>
				<div className={styles.pageHead}>
					<h3>标签结果查看</h3>
					{/* <ScSelect /> */}
				</div>
				<div className={styles.conds}>
					<div className={styles.conditionsLine}>
						{/* <span className={styles.conLable2}>分析群体</span> */}
						<em className={styles.formIcon}>*</em>税务机关： <TreeSelect
							treeData={this.props.swjgList}
							treeDataSimpleMode
							treeCheckable
							showCheckedStrategy={TreeSelect.SHOW_PARENT}
							value={this.state.swjg_id_value || []}
							onChange={this.handleSwjgChange.bind(this)}
							placeholder="-请选择税务机关-"
							className={styles.treeSelectStyle}
							dropdownStyle={{ ...dropStyle, width: '200px' }}
							treeNodeFilterProp="title"
						/>

						{/* <span style={{marginLeft:'20px'}}>行业：</span>
                            <TreeSelect
                              treeData={this.props.hyList}
                              treeDataSimpleMode
                              treeCheckable
                              showCheckedStrategy={TreeSelect.SHOW_PARENT}
                              value={this.props.hy_id_value || []}
                              onChange={this.handleHyChange.bind(this)}
                              placeholder="-请选择行业-"
							  className={styles.treeSelectStyle}
                              dropdownStyle={{ ...dropStyle, maxHeight: '260px' }}
                              treeNodeFilterProp="title"
                            /> */}
						<span style={{ marginLeft: '20px' }}>分析期间：</span>
						<div className={styles.rqLine} onMouseDown={(e) => { e.preventDefault(); return false; }}>
							<Select
								defaultValue={this.dateYear}
								style={{ width: 100 }}
								value={`${this.props.yearValue}年`}
								onChange={this.handleTimeNfChange.bind(this)}
								dropdownMatchSelectWidth={false}
								dropdownRender={() => (
									<div style={{ width: 140, marginTop: 8, marginBottom: 16 }} className={styles.myRadion}>
										<RadioGroup
											value={this.props.yearValue}
											buttonStyle="solid"
										>
											<div className={styles.left5}>
												<RadioButton value={this.dateYear - 2} onClick={this.handlePanelChange.bind(this)}>{this.dateYear - 2}年</RadioButton>
												<RadioButton value={this.dateYear - 1} onClick={this.handlePanelChange.bind(this)}>{this.dateYear - 1}年</RadioButton>
											</div>
											<div className={styles.left5}>
												<RadioButton value={this.dateYear} onClick={this.handlePanelChange.bind(this)}>{this.dateYear}年</RadioButton>
												<RadioButton value={this.dateYear + 1} onClick={this.handlePanelChange.bind(this)}>{(this.dateYear + 1)}年</RadioButton>
											</div>
										</RadioGroup>
									</div>
								)}
							/>
						</div>
						<div className={styles.rqLine} onMouseDown={(e) => { e.preventDefault(); return false; }}>
							<Select
								defaultValue={new Date().getMonth() > 0 ? `${new Date().getMonth()}y` : `${new Date().getMonth() + 1}y`}
								style={{ width: 120, marginLeft: 10 }}
								value={this.props.rq_content.replace('y', '月').replace(/\b(0+)/gi, '').replace('n', '全年')
									.replace('1j', '第一季度')
									.replace('2j', '第二季度')
									.replace('3j', '第三季度')
									.replace('4j', '第四季度')}
								onChange={this.handleTimeWdChange}
								dropdownMatchSelectWidth={false}
								dropdownRender={() => (
									<div style={{ width: 280, marginTop: 8, marginBottom: 16 }} className={styles.myRadion}>
										<RadioGroup
											value={this.props.rq_value}
											buttonStyle="solid"
										>
											<div className={styles.left5}>
												<RadioButton value="n" onClick={this.handleRqChange.bind(this)}>全年</RadioButton>
											</div>
											<div className={styles.left5}>
												<RadioButton value="1j" onClick={this.handleRqChange.bind(this)}>第一季度</RadioButton>
												<RadioButton value="2j" onClick={this.handleRqChange.bind(this)}>第二季度</RadioButton>
												<RadioButton value="3j" onClick={this.handleRqChange.bind(this)}>第三季度</RadioButton>
												<RadioButton value="4j" onClick={this.handleRqChange.bind(this)}>第四季度</RadioButton>
											</div>
											<div className={styles.left5}>
												<RadioButton value="01y" onClick={this.handleRqChange.bind(this)}>1月</RadioButton>
												<RadioButton value="02y" onClick={this.handleRqChange.bind(this)}>2月</RadioButton>
												<RadioButton value="03y" onClick={this.handleRqChange.bind(this)}>3月</RadioButton>
												<RadioButton value="04y" onClick={this.handleRqChange.bind(this)}>4月</RadioButton>
												<RadioButton value="05y" onClick={this.handleRqChange.bind(this)}>5月</RadioButton>
												<RadioButton value="06y" onClick={this.handleRqChange.bind(this)}>6月</RadioButton>
												<RadioButton value="07y" onClick={this.handleRqChange.bind(this)}>7月</RadioButton>
												<RadioButton value="08y" onClick={this.handleRqChange.bind(this)}>8月</RadioButton>
												<RadioButton value="09y" onClick={this.handleRqChange.bind(this)}>9月</RadioButton>
												<RadioButton value="10y" onClick={this.handleRqChange.bind(this)}>10月</RadioButton>
												<RadioButton value="11y" onClick={this.handleRqChange.bind(this)}>11月</RadioButton>
												<RadioButton value="12y" onClick={this.handleRqChange.bind(this)}>12月</RadioButton>
											</div>
										</RadioGroup>
									</div>
								)}
							/>
						</div>
						{/* <div className={styles.rqLine}>
									<Dropdown
										overlay={moreConditionsContent}
										overlayStyle={{ top: '10px' }}
										trigger={['click']}
									>
										<Icon type="double-right" className={styles.toggleMore} />
									</Dropdown>
								</div> */}
						{/* TODO放第一行条件 */}
					</div>
					<Divider dashed />
					<div className={styles.conditionsLine}>

						<span style={{ marginRight: 25 }}>标签设置</span>
						<span>
							{this.props.tagSetList.map((key, i) => {
								return (
									<Tag closable key={key.bqId} onClose={this.tagClose.bind(this, key)}>

										<span>{key.bqMc}</span>
									</Tag>
								);
							})}
							<Icon
								type="plus-square"
								style={{
									fontSize: "20px",
									color: "#428DF5",
									verticalAlign: "middle"
								}}
								onClick={this.showTagModal.bind(this)}
							/>
							<Modal
								title="标签设置"
								visible={this.props.tagWindowShow}
								onOk={this.handleTagOk.bind(this)}
								destroyOnClose
								onCancel={this.tagWindowhandleCancel.bind(this)}
								width={900}
								cancelText="取消"
								okText="确定"
								centered
							>
								<TagSet onRef={this.onTagonRef} />
							</Modal>
						</span>

						{/* TODO放第二行条件 */}
					</div>
					<Divider dashed />
					<div className={styles.conditionsLine}>
						<span className={styles.conLable2}>扩展信息</span>
						<div className={styles.rqLine2}>
							{
								this.props.tagKzxx.map((key, i) => {
									return (
										<Tag closable key={key} onClose={this.kzxxClose.bind(this, key)}><span>{key}</span></Tag>
									);
								})
							}<Icon type="plus-square" style={{ fontSize: '20px', color: '#428DF5', verticalAlign: 'middle' }} onClick={this.showkzModal.bind(this)} />
							<Modal
								title="扩展信息"
								visible={this.props.kzWindowShow}
								onOk={this.handlekzxxOk.bind(this)}
								//confirmLoading={this.state.kzconfirmLoading}
								onCancel={this.kzWindowhandleCancel.bind(this)}
								width={900}
								cancelText="取消"
								okText="确定"
								centered
							>
								<Extension onRef={this.onExtensionRef} />
							</Modal>
						</div>
						{/* TODO放第三行条件 */}
					</div>
					{/* <Divider dashed /> */}
				</div>
				<div className={styles.condsBtns}>
					<Button type='primary' style={{ marginRight: 40 }} onClick={this.doSearch.bind(this)}>查询</Button>
					<Button onClick={this.conditionsReset.bind(this)}>重置</Button>
				</div>
				{/* 收起线条 */}
				{/* <Divider className={styles.hidenShowLine}>
					{this.state.isHidenConds ? '展开' : '收起'}&nbsp;&nbsp;
					<IconFont onClick={() => this.setState({ isHidenConds: !this.state.isHidenConds })}
						type={`svy-fxicon-${this.state.isHidenConds ? 'xialajiantou' : 'xiangshangjiantou'}`}
						style={{ fontSize: 20, cursor: 'pointer' }} />
				</Divider> */}
				<div className={styles.custTable} style={{ height: this.state.isHidenConds ? this.state.tableHeight + 85 : this.state.tableHeight }}>
					<ResultTable isTagLoad={this.props.isTagLoad}></ResultTable>
					<div className={styles.custTableBtns}>
						<ExportBtn />
						{/* <ScModal /> */}
						<StoreConds />
					</div>
				</div>
			</div>
		)
	}
}
CustomAnalysis.propTypes = {
	swjgList: PropTypes.array,
	hyList: PropTypes.array,
	swjg_id: PropTypes.array,
	hy_id: PropTypes.array,
	rq_value: PropTypes.string,
	rq_content: PropTypes.string,
	yearValue: PropTypes.number,
	tagKzxx: PropTypes.array,
	tagKzxxDetail: PropTypes.array,
	user: PropTypes.any,
	kzWindowShow: PropTypes.any,
	tagSetList: PropTypes.array,
	tagWindowShow: PropTypes.any,
	isTagLoad: PropTypes.any,
	allFilterCondition: PropTypes.object,
	tagType: PropTypes.array,
	sort: PropTypes.object

};
export default connect(state => ({
	swjgList: state.conditions.swjgList,
	hyList: state.conditions.hyList,
	swjg_id: state.conditions.swjg_id,
	hy_id: state.conditions.hy_id,
	rq_value: state.conditions.rq_value,
	rq_content: state.conditions.rq_content,
	yearValue: state.conditions.yearValue,
	tagKzxx: state.conditions.tagKzxx,
	tagKzxxDetail: state.conditions.tagKzxxDetail,
	user: state.app.user,
	tagWindowShow: state.conditions.tagWindowShow,
	kzWindowShow: state.conditions.kzWindowShow,
	tagSetList: state.conditions.tagSetList,
	isTagLoad: state.conditions.isTagLoad,
	tagType: state.conditions.tagType,
	allFilterCondition: state.customFilterDropDown.allFilterCondition, // 过滤条件
	sort: state.customFilterDropDown.sort


}))(CustomAnalysis);               