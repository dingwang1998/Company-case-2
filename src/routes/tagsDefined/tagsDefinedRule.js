import React, { Component } from 'react';
import { connect } from 'dva';
import TreeTable from "@/components/tagsDefined/tagsDefined/TreeTable";
import BasicMsg from "@/components/tagsDefined/tagsDefined/BasicMsg";
import MathInput from "@/components/tagsDefined/tagsDefined/MathInput";
import ProcessingContract from "@/components/tagsDefined/tagsDefined/ProcessingContract";
import IconFont from '@/components/common/iconFont/iconFont';

import { Button, Modal } from 'antd';

import * as Service from "@/services/tagsDefined/tagsDefined";
import styles from "./tagsDefinedRule.less";

const columns = [
	{
		title: '序号',
		key: 'jcbqdm',
		render: (text, record, index) => <span>{index + 1}</span>,
	},
	{
		title: '基础标签名称',
		dataIndex: 'jcbqmc'
	},
	{
		title: '适用对象',
		dataIndex: 'sydxmc'
	},
	{
		title: '创建机关',
		dataIndex: 'cjjgmc',
	}
];
class TagsDefined extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saveLoading: false,
			defaultValues: {//基础信息默认值
				name: '',
				dmSydx: '',
				bqmlDm: '',
				syjgDm: null,
				bqsm: '',
				cjjgDm: '',
				cjryDm: '',
				cjryMc: '',
				cjjgMc: ''
			},
			treeTableDefaultData: {//标签定义默认值
				treeNodeKey: '',
				tableRowKey: ''
			},
			bqdm: ''
		};

	}
	componentWillUnmount = () => {
		this.setState = (state, callback) => {
			return;
		};
	}

	componentDidMount() {
		let bqdm = this.props.bqdm;
		if (bqdm) {
			this.setState({
				bqdm: bqdm
			})
			this.getLabelDetail(bqdm);
		}
	}

	/**
	 * 获取标签详情用于回显编辑
	 * @method getLabelDetail
	 */
	getLabelDetail(bqdm) {
		Service.gzbqXgcx(bqdm).then(res => {
			if (res.code === '600') {
				const data = res.data;
				const { defaultValues } = this.state;
				let obj = {};
				for (let key in defaultValues) {
					obj[key] = data[key];
				}
				this.setState({
					defaultValues: obj,
					bqdyZw: data.bqdyZw
				}, () => {
					this.basicMsgRef.setFieldsValue();
					this.mathInputRef.setDefaultValue(data);
					this.processingContractRef.setDefaultData(data.jgydList);
				})
			}
		})
	}
	/**
	 * 获取基础信息表单值集合
	 * @method getFormValue
	 */
	getFormValue() {
		return this.basicMsgRef.getFieldsValue();
	}

	onRefBasicMsg(ref) {
		this.basicMsgRef = ref;
	}

	onRefTreeTable(ref) {
		this.treeTableRef = ref;
	}

	onRefProcessingContract(ref) {
		this.processingContractRef = ref;
	}

	onRefMathInput(ref) {
		this.mathInputRef = ref;
	}

	render() {
		const { defaultValues, treeTableDefaultData, saveLoading } = this.state;

		const treeProps = {
			key: 'wdz',
			title: 'wdmc',
			parent: 'pid'

		}
		const tableProps = {
			id: 'bqmldm',
			searchName: 'bqmc',
			key: 'jcbqdm'
		}
		return (
			<div className={styles.basicBox}>
				<div className={styles.basicTop}>
					<p className={styles.itemTitle}>基本信息</p>
					<div className={styles.contentBox}>
						<BasicMsg defaultValues={defaultValues} onRef={this.onRefBasicMsg.bind(this)} />
					</div>
				</div>
				<div className={styles.basicMiddle}>
					<p className={styles.itemTitle}>标签定义</p>
					<div className={styles.contentBox}>
						<div className={styles.middleTable}>
							<TreeTable
								onRef={this.onRefTreeTable.bind(this)}
								onRowClick={this.handleRowSelect.bind(this)}
								showRadio={false}
								columns={columns}
								tableProps={tableProps} treeProps={treeProps}
								tableApi={Service.queryJcbqList}
								treeApi={Service.jcbqmlTree}
								defaultData={treeTableDefaultData}

							/>
						</div>
						<div className={styles.selectDataBox}>
							<p className={styles.selectTitle}>计算公式</p>
							<MathInput onRef={this.onRefMathInput.bind(this)} />
							{/* <p>{bqdyZw}</p> */}
						</div>
					</div>
				</div>
				<div className={styles.basicBottom}>
					<p className={styles.itemTitle}>加工约定</p>
					<div className={styles.contentBox}>
						<ProcessingContract onRef={this.onRefProcessingContract.bind(this)} />
					</div>
				</div>
				<div className={styles.basicBtn}>
					<Button type="primary" onClick={this.handleSave.bind(this)} loading={saveLoading}>保存</Button>
					{this.props.bqdm ?
						<span onClick={this.back.bind(this)} style={{ backgroundColor: '#fff', marginLeft: 24, display: 'inline-block', borderRaius: '4px' }}>	<Button type="primary" ghost >关闭</Button></span> :
						<span onClick={this.resetAllDatas.bind(this)} style={{ backgroundColor: '#fff', marginLeft: 24, display: 'inline-block', borderRaius: '4px' }}>	<Button type="primary" ghost >重置</Button></span>}
				</div>
			</div>
		)
	}

	handleRowSelect(row) {
		this.mathInputRef.handleTableSelectRow(row);
	}

	getMathInputData() {
		return this.mathInputRef.getData();
	}
	/**
	 * 点击保存
	 * @method handleSave
	 */
	handleSave() {
		this.basicMsgRef.validateForm()().then(res => {
			const mathInputData = this.getMathInputData();
			const ProcessingContractData = this.processingContractRef.getData();
			if (!mathInputData.bqdyYw) {
				Modal.error({
					okText: '确定',
					title: `请正确填写标签定义！`,
					icon: <IconFont type="svy-fxicon-tishi" style={{ fontSize: '24px', color: '#FF7E6E' }} />
				});
				return;
			}
			if (!ProcessingContractData.length) {
				Modal.error({
					okText: '确定',
					title: `请正确填写加工约定！`
				});
				return;
			}
			this.setState({
				saveLoading: true
			})
			Service.saveGZDefined(this.getAllDatas()).then(res => {
				this.setState({
					saveLoading: false
				})			
				if (res.code === '600') {
					Modal.success({
						onOk: () => {
							this.resetAllDatas();
							if (this.props.bqdm) {
								this.back(true);
							}
						},
						okText: '确定',
						title: `保存成功！`,
						icon: <IconFont type="svy-fxicon-chenggong" style={{ fontSize: '24px', color: '#4abb2f' }} />
					});
				}
			})
		})
	}
	back(isRefresh) {
		const { dispatch, refresh } = this.props;
		dispatch({
			type: 'labelManagement/setViewModel',
			payload: {
				isViewMode: '1'
			}
		})
		isRefresh===true && refresh();
	}
	/**
	 * 点击重置
	 * @method resetAllDatas
	 */
	resetAllDatas() {
		this.setState({
			defaultValues: {
				name: '',
				dmSydx: '',
				bqmlDm: '',
				syjgDm: '',
				bqsm: ''
			}
		}, () => {
			this.basicMsgRef.setFieldsValue();
			this.treeTableRef.resetData();
			this.mathInputRef.handleReset();
			this.processingContractRef.resetData();
		})
	}
	/**
	 * 获取所有数据
	 * @method getAllDatas
	 */
	getAllDatas() {
		const { bqdyZw, bqdm } = this.state;
		let datas = {
			bqdyZw: bqdyZw,
			jgydList: this.processingContractRef.getData(),
			dmBqlx: 'GZ',
			...this.getMathInputData()
		};
		if (bqdm) {
			datas.id = bqdm;
		}
		Object.assign(datas, this.getFormValue());
		return datas;
	}
}

export default connect(
	({ labelManagement }) => ({ labelManagement })
)(TagsDefined);