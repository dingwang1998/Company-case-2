/*
 * @Author: your name
 * @Date: 2020-03-16 18:38:40
 * @LastEditTime: 2020-03-26 09:57:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\routes\tagsDefined\tagsDefinedSQL.js
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import SqlDefined from '../../components/tagsDefined/tagsDefined/SqlDefined/SqlDefined';
import styles from "./tagsDefinedSQL.less";
import BasicMsg from "@/components/tagsDefined/tagsDefinedSQL/BasicMsg";
import ProcessingContract from "@/components/tagsDefined/tagsDefined/ProcessingContract";
import IconFont from '@/components/common/iconFont/iconFont';


import * as Service from "@/services/tagsDefined/tagsDefined";
import { Button, Modal } from 'antd';

class TagsDefined extends Component {
	constructor(props) {
		super(props);
		this.state = {
			saveLoading: false,
			defaultValues: {
				name: '',
				dmSydx: '',
				bqmlDm: '',
				syjgDm: null,
				bqsm: '',
				cjjgDm: '',
				cjryDm: '',
				dmBqlx: '',
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
		Service.sqlbqXgcx(bqdm).then(res => {
			if (res.code === '600') {
				const data = res.data;
				const { defaultValues } = this.state;
				let obj = {};
				for (let key in defaultValues) {
					obj[key] = data[key];
				}
				this.props.dispatch({
					type: "tagsDefinedSQL/changeParamState",
					key: "sql",
					value: data.bqdySql
				});
				this.setState({
					defaultValues: obj,
					bqdyZw: data.bqdyZw
				}, () => {

					this.basicMsgRef.setFieldsValue();
					this.processingContractRef.setDefaultData(data.jgydList);
				})
			}
		})
	}

	getFormValue() {
		return this.basicMsgRef.getFieldsValue();
	}

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

	onRefProcessingContract(ref) {
		this.processingContractRef = ref;
	}

	onRefSqlDefined(ref) {
		this.sqlDefinedRef = ref;
	}

	render() {
		const { defaultValues, saveLoading  } = this.state;
		return (
			<div className={styles.sqlContent}>
				<div className={styles.basicTop}>
					<p className={styles.itemTitle}>基本信息</p>
					<div className={styles.contentBox}>
						<BasicMsg defaultValues={defaultValues} onRef={this.onRefBasicMsg.bind(this)} />
					</div>
				</div>
				<SqlDefined onRef={this.onRefSqlDefined.bind(this)}></SqlDefined>
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
			const ProcessingContractData = this.processingContractRef.getData();
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

			Service.saveSqlDefined(this.getAllDatas()).then(res => {
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

	resetAllDatas() {
		this.props.dispatch({
			type: "tagsDefinedSQL/changeParamState",
			key: "sql",
			value: ''
		});
		this.setState({
			//	bqdyZw: '',//选中类目-选中表-选中
			defaultValues: {
				name: '',
				dmSydx: '',
				bqmlDm: '',
				syjgDm: '',
				bqsm: ''
			}
		}, () => {
			this.basicMsgRef.setFieldsValue();
			this.processingContractRef.resetData();
		})
	}

	getAllDatas() {
		const { bqdyZw, ysjzd, bqdm } = this.state;
		let datas = {
			bqdyZw: bqdyZw,
			ysjzd: ysjzd,
			jgydList: this.processingContractRef.getData(),
			bqdySql: this.sqlDefinedRef.props.sql
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