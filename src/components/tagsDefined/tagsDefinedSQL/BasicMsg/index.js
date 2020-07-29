import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import {
	Form,
	Input,
	Select,
	Row,
	Col,
	TreeSelect
} from 'antd';

import styles from './index.less';
import * as Service from "@/services/tagsDefined/tagsDefined";
import * as commonService from "@/services/common/common";

const { Option } = Select;

/**
 * 标签定义基本信息模块组件
 * @method BasicMsg
 */
class BasicMsg extends Component {
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 
	componentDidMount() {
		this.props.onRef(this)
		// this.getLabelTreeData();
		this.getAgencyTreeData();
		this.setFieldsValue();
		this.getSydxList();
		this.getLabelTreeData();
	}
	state = {
		confirmDirty: false,
		autoCompleteResult: [],
		labelTreeData: [],
		agencyTreeData: [],
		sydxList: []
	};
	/**
	 * 获取适用对象下拉列表
	 * @method getSydxList
	 */
	getSydxList() {
		commonService.commonCombobox('SYDX').then(res => {
			if (res.code === '600') {
				this.setState({
					sydxList: res.data
				})
			}
		})
	}

	/**
	 * 获取标签下拉选择树
	 * @method getLabelTreeData
	 */
	getLabelTreeData() {
		Service.queryBqmlTree().then(res => {
			if (res.code === "600") {
				const data = res.data;
				let treeList = data && data.map(item => {
					return {
						value: item.wdz,
						title: item.wdmc,
						parent: item.pid
					}
				}) || []
				this.setState({
					labelTreeData: this.toTree(treeList)
				})
			}
		})
	}
	/**
	 * 获取税务机关下拉选择树
	 * @method getLabelTreeData
	 */
	getAgencyTreeData() {
		Service.swjgGhbm().then(res => {
			if (res.code === "600") {
				const data = res.data;
				let treeList = data && data.map(item => {
					return {
						value: item.wdz,
						title: item.wdmc,
						parent: item.pid
					}
				}) || []
				this.setState({
					agencyTreeData: this.toTree(treeList)
				})
			}
		})
	}

	/**
	 * 将逻辑树数组组合成树数据
	 * @method getLabelTreeData
	 * @param {Arrary} data 平铺的逻辑树数组
	 * @return {Arrary} 组合好的树数组
	 */
	toTree(data) {
		let mapTreeData = {};
		data.forEach(function (item) {
			delete item.children;
		});
		data.forEach(function (item) {
			mapTreeData[item.value] = item;
		});
		var val = [];
		data.forEach(item => {
			var parent = mapTreeData[item.parent];
			if (parent && item.value !== item.parent) {
				(parent.children || (parent.children = [])).push(item);
			} else {
				val.push(item);
			}
		});
		return val;

	}

	/**
	 * 触发表单验证
	 * @method validateForm
	 */
	validateForm() {
		const { validateFields } = this.props.form;
		return validateFields;
	}
	/**
	 * 获取表单值
	 * @method getFieldsValue
	 */
	getFieldsValue() {
		const { getFieldsValue } = this.props.form;
		let data = getFieldsValue();
		data.syjgDm = data.syjgDm.join(',');
		return data;
	}


	/**
	 * 给表单设置默认值
	 * @method setFieldsValue
	 */
	setFieldsValue() {
		const { setFieldsValue } = this.props.form;
		const { defaultValues, app } = this.props;
		let obj = defaultValues.syjgDm ? Object.assign(defaultValues, { syjgDm: defaultValues.syjgDm.split(',') }) : defaultValues
		setFieldsValue(obj);
		if (!defaultValues.cjryDm) {
			setFieldsValue({
				cjjgDm: app.user.swjgId,
				cjryDm: app.user.swryId,
				cjjgMc:app.user.swjgMc,
				cjryMc: app.user.swryMc
			})
		}
	}

	/**
	* 使用机关改变事件
	* @param {*} val 
	* @param {*} label 
	* @param {*} extra 
	*/
	handleSyjgChange(val, label, extra) {
		const { setFieldsValue } = this.props.form;
		setFieldsValue({
			syjgDm: val
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { labelTreeData, agencyTreeData, sydxList } = this.state;
		const treeSelectStyle = {
			width: 220, verticalAlign: 'middle', overflow: 'auto', textWrap: 'noWrap'
		};
		const dropStyle = {
			height: '300px', overflow: 'auto', boxShadow: '0px 0px 10px #eee', width: '220px',
		};
		return (
			<Form className={[styles.basicForm, 'util-clearfix'].join(' ')}>
				<Row>
					<Col span={11}>
						<Form.Item label="标签名称" labelAlign="left">
							{getFieldDecorator('name', {
								rules: [
									{
										required: true,
										message: '请正确填写标签名称',
									},
								],
							})(<Input maxLength={50}  placeholder="输入不超过50字"/>)}
						</Form.Item>
					</Col>
					<Col span={11} offset={2}>
						<Form.Item label="标签类型" labelAlign="left">
							{getFieldDecorator('dmBqlx', {
								rules: [
									{
										required: true,
										message: '请选择标签类型',
									},
								],
							})(<Select
								placeholder="请选择标签类型"
							>
									<Option  value="JC">基础标签</Option>
									<Option  value="GZ">规则标签</Option>
							</Select>)}
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={11} >
						<Form.Item label="适用对象" labelAlign="left">
							{getFieldDecorator('dmSydx', {
								rules: [
									{
										required: true,
										message: '请正确填写适用对象',
									}
								],
							})(<Select
								placeholder="请选择适用对象"
								onChange={this.handleSelectChange}
							>
								{sydxList.map(item => {
									return (<Option key={item.dm} value={item.dm}>{item.mc}</Option>)
								})}
							</Select>)}
						</Form.Item>
					</Col>
					<Col span={11} offset={2}>
						<Form.Item label="标签目录" labelAlign="left">
							{getFieldDecorator('bqmlDm', {
								rules: [
									{
										required: true,
										message: '请选择标签目录',
									}
								],
							})(<TreeSelect
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
								placeholder="请选择标签目录"
								allowClear
								onFocus={this.getLabelTreeData.bind(this)}
								treeData={labelTreeData}
								treeDefaultExpandAll
							>

							</TreeSelect>
							)}
						</Form.Item>
					</Col>

				</Row>

				<Row>
					<Col span={11} >
					<Form.Item label="创建机关" labelAlign="left">
							{getFieldDecorator('cjjgMc', {
								rules: [
									{
										required: true,
										message: '请正确填写创建机关',
									},
								],
							})(<Input disabled={true} />)}
						</Form.Item>
						<Form.Item style={{display:'none'}} label="创建机关" labelAlign="left">
							{getFieldDecorator('cjjgDm', {
								rules: [
									{
										required: true,
										message: '请正确填写创建机关',
									},
								],
							})(<Input disabled={true} />)}
						</Form.Item>
					</Col>
					<Col span={11} offset={2}>
						<Form.Item label="创建人员" labelAlign="left">
							{getFieldDecorator('cjryMc', {
								rules: [
									{
										required: true,
										message: '请正确填写创建人员',
									},
								],
							})(<Input disabled={true} />)}
						</Form.Item>
						<Form.Item style={{display:'none'}} label="创建人员" labelAlign="left">
							{getFieldDecorator('cjryDm', {
								rules: [
									{
										required: true,
										message: '请正确填写创建人员',
									},
								],
							})(<Input disabled={true} />)}
						</Form.Item>
					</Col>
						
				</Row>
				<Row>
					<Col span={11} >
						<Form.Item label="使用机关" labelAlign="left">
							{getFieldDecorator('syjgDm', {
								rules: [
									{
										required: true,
										message: '请选择使用机关',
									}
								],
							})(<TreeSelect
								placeholder="请选择使用机关"
								allowClear
								treeData={agencyTreeData}
								treeCheckable
								onChange={this.handleSyjgChange.bind(this)}
								showCheckedStrategy={TreeSelect.SHOW_PARENT}
								treeDefaultExpandedKeys={[agencyTreeData.length ? agencyTreeData[0].value : null]}
								style={{ ...treeSelectStyle, width: '100%' }}
								dropdownStyle={{ ...dropStyle, width: '200px' }}
							>

							</TreeSelect>)}
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label="标签说明" labelAlign="left">
					{getFieldDecorator('bqsm', {
						rules: [
							{
								required: true,
								message: '请输入标签说明',
							},
							{
								validator: this.validateToNextPassword,
							},
						],
					})(<Input.TextArea rows={5} maxLength={500} placeholder="请输入标签的业务说明!" />)}
				</Form.Item>
			</Form>
		);
	}
}
const defaultProps = {
	defaultValues: {}

};

const propTypes = {
	type: PropTypes.object
};

BasicMsg.defaultProps = defaultProps;
BasicMsg.propTypes = propTypes;

const WrappedBasicMsg = Form.create({ name: 'register' })(BasicMsg);
export default connect(
	({ app }) => ({ app })
)(WrappedBasicMsg)