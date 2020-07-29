import React, { Component } from 'react';
import { connect } from 'dva';
import TreeTable from "@/components/tagsDefined/tagsDefined/TreeTable";
import BasicMsg from "@/components/tagsDefined/tagsDefined/BasicMsg";
import ProcessingContract from "@/components/tagsDefined/tagsDefined/ProcessingContract";
import IconFont from '@/components/common/iconFont/iconFont';

import { Button, Modal } from 'antd';


import * as Service from "@/services/tagsDefined/tagsDefined";
import styles from "./tagsDefinedBasic.less";

const columns = [
	{
		title: '序号',
		render: (text, record, index) => <span>{index + 1}</span>,
		width: '80px'
	},
	{
		title: '中文列名',
		dataIndex: 'zwlm',
		width: '200px'
	},
	{
		title: '英文列名',
		dataIndex: 'ywlm',
		width: '120px'
	},
	{
		title: '类型',
		dataIndex: 'lx',
		width: '80px'
	},
	{
		title: '可空',
		width: '80px',
		dataIndex: 'kk',
	},
	{
		title: '描述',
		width: '80px',
		dataIndex: 'ms'
	},
];
class TagsDefined extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bqdyZw: '',//选中类目-选中表-选中
			ysjzd: {
				ysjzddm: "",//ysjzddm：树叶子节点代码.英文列名
				ysjzdmc: ""//ysjzdmc：中文列名
			},
			saveLoading: false,
			defaultValues: {
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
			treeTableDefaultData: {
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
		Service.jcbqXgcx(bqdm).then(res => {
			if (res.code === '600') {
				const data = res.data;
				const { defaultValues } = this.state;
				let obj = {};
				for (let key in defaultValues) {
					obj[key] = data[key];
				}
				const arr = data.ysjzd.ysjzddm.split(".");
				this.setState({
					ysjzd: data.ysjzd,
					defaultValues: obj,
					treeTableDefaultData: {
						treeNodeKey: data.mlsjddm,
						tableRowKey: arr[arr.length - 1],
					},
					bqdyZw: data.bqdyZw
				}, () => {
					setTimeout(() => {
						this.treeTableRef.setDefaultData();
					}, 500);
					this.basicMsgRef.setFieldsValue();
					this.processingContractRef.setDefaultData(data.jgydList);
				})
			}
		})
	}

	getFormValue() {
		return this.basicMsgRef.getFieldsValue();
	}

	/**
	 * 获取基础信息表单值集合
	 * @method onRadioSelect
	 * @param {arrary} selectedRows 选中集合数据
	 * @param {arrary} selectTreeNode 选中节点
	 */
	onRadioSelect(selectedRows, selectTreeNode) {
		let bqdyZw = selectTreeNode.map(item => item.title).join('-');
		let rowObj = selectedRows[0];
		bqdyZw += '：' + rowObj.zwlm + "(" + rowObj.ywlm + ")"
		let ysjzd = {};
		ysjzd.ysjzddm = selectTreeNode[selectTreeNode.length - 1].key + '.' + rowObj.ywlm;
		ysjzd.ysjzdmc = rowObj.zwlm;
		this.setState({
			bqdyZw: bqdyZw,
			ysjzd: ysjzd
		})
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

	render() {
		const { bqdyZw, defaultValues, treeTableDefaultData, saveLoading } = this.state;

		const treeProps = {
			key: 'wdz',
			title: 'wdmc',
			parent: 'pid'

		}
		const tableProps = {
			id: 'ysjb',
			searchName: 'zwlm',
			key: 'ywlm'
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
								showIcon={true}
								onRef={this.onRefTreeTable.bind(this)}
								onlySelectLeafNode={true}
								onRowClick={(row) => { }}
								onRadioSelect={this.onRadioSelect.bind(this)}
								showRadio={true}
								columns={columns}
								tableProps={tableProps}
								treeProps={treeProps}
								tableApi={Service.queryYsjbzdList}
								treeApi={Service.treeSelect}
								defaultData={treeTableDefaultData}
							/>
						</div>
						<div className={styles.selectDataBox}>
							<p className={styles.selectTitle}>已选数据项</p>
							<p>{bqdyZw}</p>
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
	handleSave() {
		this.basicMsgRef.validateForm()().then(res => {
			const { bqdyZw } = this.state;
			const ProcessingContractData = this.processingContractRef.getData();
			if (!bqdyZw) {
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
			Service.save(this.getAllDatas()).then(res => {
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
		isRefresh === true && refresh();
	}

	resetAllDatas() {
		this.setState({
			bqdyZw: '',//选中类目-选中表-选中
			ysjzd: {
				ysjzddm: "",//ysjzddm：树叶子节点代码.英文列名
				ysjzdmc: ""//ysjzdmc：中文列名
			},
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
			this.processingContractRef.resetData();
		})


	}

	getAllDatas() {
		const { bqdyZw, ysjzd, bqdm } = this.state;
		let datas = {
			bqdyZw: bqdyZw,
			ysjzd: ysjzd,
			jgydList: this.processingContractRef.getData(),
			dmBqlx: 'JC'
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