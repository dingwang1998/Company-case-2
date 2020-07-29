import React, { Component } from 'react';
import { Select, Table, DatePicker } from 'antd';
import IconFont from '@/components/common/iconFont/iconFont'
import styles from "./index.less";
import moment from 'moment';
import * as commonService from "@/services/common/common";
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

class ProcessingContract extends Component {
	constructor(props) {
		super(props);
		this.props.onRef(this);
		this.state = {
			fxqjzqList:[],//分析期间周期下拉列表
			fxqjsqList:[],//分析期间时间下拉列表
			tableData: [
				{
					dmFxqjldZq: '',
					dmFxqjldSq: '',
					jgfwqs: moment().locale('zh-cn').format('YYYY-MM-DD')
				}
			]
		};
		this.getFxqjsqList();
		this.getFxqjzqList();
		this.columns = [
			{
				title: '序号',
				align: 'center',
				dataIndex:'key',
				render: (text, record, index) => <span>{index + 1}</span>,
			},
			{
				title: '分析期间粒度',
				align: 'center',
				dataIndex:'dmFxqjldZq',
				render: (text, record, index) => {
					const {fxqjzqList,fxqjsqList} = this.state;
					return (
						<span>
							<Select  style={{ width: 184 }} onChange={(value) => { this.editRow.bind(this, 'dmFxqjldZq', record.key, value)() }} value={record.dmFxqjldZq}>
								{fxqjzqList.map(item => {
									return (<Option key={item.dm} value={item.dm}>{item.mc}</Option>)
								})}
							</Select>
							<Select  style={{ width: 184, marginLeft: 8 }} onChange={(value) => { this.editRow.bind(this, 'dmFxqjldSq', record.key, value)() }} value={record.dmFxqjldSq}>
								{fxqjsqList.map(item => {
									return (<Option key={item.dm} value={item.dm}>{item.mc}</Option>)
								})}
							</Select>
						</span>
					)
				}
			},
			{
				title: '加工范围起始',
				align: 'center',
				dataIndex:'jgfwqs',
				render: (text, record, index) => {
					return (
						<DatePicker 
						allowClear={false} style={{ width: 292 }} 
						onChange={(value, dateString) => { this.editRow.bind(this, 'jgfwqs', record.key, dateString)() }} 
						value={record.jgfwqs ? moment(record.jgfwqs, dateFormat) : null} />
					)
				}
			},
			{
				align: 'center',
				title: '操作',
				width: 150,
				render: (text, record, index) => {
					return (
						<span onClick={this.handleDelete.bind(this, record.key)} style={{ color: '#4285F4', cursor: 'pointer' }}>删除</span>
					)
				}
			}
		];


	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 
	/**
	 * 获取分析期间周期下拉列表
	 * @method getFxqjzqList
	 */
	getFxqjzqList() {
		const {tableData} = this.state;
		commonService.commonCombobox('FXQJLD_ZQ').then(res => {
			if (res.code === '600') {
				!tableData[0].dmFxqjldZq && (tableData[0].dmFxqjldZq=res.data[0].dm);  
				this.setState({
					fxqjzqList: res.data,
					tableData:tableData
				})
			}
		})
	}
	/**
	 * 获取分析期间时期下拉列表
	 * @method getFxqjsqList
	 */
	getFxqjsqList() {
		const {tableData} = this.state;
		commonService.commonCombobox('FXQJLD_SQ').then(res => {
			if (res.code === '600') {
				!tableData[0].dmFxqjldSq && (tableData[0].dmFxqjldSq=res.data[0].dm);
				this.setState({
					fxqjsqList: res.data,
					tableData:tableData
				})
			}
		})
	}
	/**
	 * 处理删除
	 * @method handleDelete
	 */
	handleDelete(key) {
		const { tableData } = this.state;
		this.setState({
			tableData: tableData.filter(item => {
				return item.key !== key;
			})
		})
	}
	/**
	 * 处理添加一行
	 * @method addRow
	 */
	addRow() {
		const { tableData ,fxqjsqList,fxqjzqList} = this.state;
		tableData.push({
			key: this.GenNonDuplicateID(5),
			dmFxqjldZq: fxqjzqList.length?fxqjzqList[0].dm:'',
			dmFxqjldSq: fxqjsqList.length?fxqjsqList[0].dm:'',
			jgfwqs: moment().locale('zh-cn').format('YYYY-MM-DD')
		})
		this.setState({
			tableData: tableData,
		})
	}
	/**
	 * 编辑数据时触发（分析期间粒度、时间起始）
	 * @method editRow
	 * @param {String} attrName 修改字段名
	 * @param {String} key 修改当前行的key
	 * @param {String} value 修改值
	 */
	editRow(attrName, key, value) {
		const { tableData } = this.state;
		this.setState({
			tableData: tableData.map(item => {
				if (item.key === key) {
					item[attrName] = value;
				}
				return item
			})
		})
	}

	getData() {
		const { tableData } = this.state;
		return tableData;
	}

	setDefaultData(arr) {
		this.setState({
			tableData: arr
		})
	}

	resetData() {
		const {fxqjsqList,fxqjzqList} = this.state;
		this.setState({
			tableData: [{
				dmFxqjldZq: fxqjzqList.length?fxqjzqList[0].dm:'',
				dmFxqjldSq: fxqjsqList.length?fxqjsqList[0].dm:'',
				jgfwqs: moment().locale('zh-cn').format('YYYY-MM-DD')
			}]
		})
	}

	/**
* 生成一个不重复的ID
*/
	GenNonDuplicateID(randomLength) {
		return Number(
			Math.random()
				.toString()
				.substr(3, randomLength) + Date.now()
		).toString(36);
	}

	render() {
		const { tableData } = this.state;
		tableData.forEach(item => {
			!item.key && (item.key = this.GenNonDuplicateID(5));
		})
		return (
			<div className={[styles.ProcessingContractBox, 'util-clearfix'].join(' ')}>
				<Table
					bordered
					className={[styles.ProcessingContractTable, 'deepColorTableHeight'].join(' ')}
					size="small"
					columns={this.columns}
					dataSource={tableData}
					rowKey={(row) => row.key}
					pagination={false}
				/>
				<div className={styles.ProcessingContractBottom}>
					<span onClick={this.addRow.bind(this)} className={styles.add}>
						<IconFont type="svy-fxicon-tianjia" />
						<span > 新增一行</span>
					</span>
				</div>
			</div>
		)
	}
}

export default ProcessingContract;