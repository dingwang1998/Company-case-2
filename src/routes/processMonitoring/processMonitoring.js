/*
 * @Author: lijiam
 * @Date: 2020-03-16 09:23:50
 * @Description: 加工结果监控
 * @LastEditors: lijiam
 * @LastEditTime: 2020-03-19 19:00:05
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Input, Row, Col, Select, DatePicker, Table, Button, message, Modal } from 'antd';
import SearchLayout from '../../components/common/SearchLayout/SearchLayout'
import styles from './processMonitoring.less';

const { Option } = Select;

class ProcessMonitoring extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startTime: null, // 加工开始时间
			endTime: null, // 加工结束时间
			defaultStartTime: null,
			defaultEndTime: null,
			selectedRowKeys: [], // 多选
			loading: false,// 表格加载动画
			pageIndex: 1,// 表格分页页码，从1开始
			pageSize: 25,// 表格分页每页条数
			bqmc: '', // 参数：标签名称
			yxztdm: '', // 参数：运行状态代码
			jgsjq: '', // 参数：加工时间起
			jgsjz: '', // 参数：加工时间止
			errorMsg: '', // 报错提示信息
			errorMsgVisible: false, // 报错信息提示框是否可见
			tableHeight: document.body.clientHeight - 439 // 表格高度
		};
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

	componentDidMount() {
		this.props.dispatch({ type: 'common/queryDatabaseTime' }).then(date => {
			if (date) {
				this.setState({
					startTime: moment(date.nc, 'YYYY-MM-DD'),
					endTime: moment(date.dt, 'YYYY-MM-DD'),
					jgsjq: date.nc,
					jgsjz: date.dt,
					defaultStartTime: date.nc,
					defaultEndTime: date.dt
				}, () => this.doSearch());
			}
		});
	}

	/**
  * @description: 查询事件
  * @param {type} any
  * @return: void
  */
	doSearch = (pagination) => {
		this.setState({
			loading: true,
			selectedRowKeys: [],
			pageIndex: pagination ? pagination.current : this.state.pageIndex,
			pageSize: pagination ? pagination.pageSize : this.state.pageSize
		}, () => {
			const { pageIndex, pageSize, bqmc, yxztdm, jgsjq, jgsjz } = this.state;
			this.props.dispatch({
				type: 'processMonitoring/tagJgjkCx', params: {
					pageIndex,
					pageSize,
					bqmc,
					yxztdm,
					jgsjq,
					jgsjz,
				}
			}).then(() => {
				this.setState({ loading: false });
			});
		});
	}

	/**
  * @description: 重置事件
  * @param {type} any
  * @return: void
  */
	doReset = () => {
		this.setState({
			bqmc: '',
			yxztdm: '',
			jgsjq: this.state.defaultStartTime,
			jgsjz: this.state.defaultEndTime,
			startTime: moment(this.state.defaultStartTime, 'YYYY-MM-DD'),
			endTime: moment(this.state.defaultEndTime, 'YYYY-MM-DD'),
		})
	}

	/**
  * @description: 重新执行
  * @param {type} any
  * @return: void
  */
	reExecute = (record) => {
		let bqdms = this.state.selectedRowKeys;
		if (record && record.bqdm) {
			bqdms = [];
			bqdms.push(record.bqdm);
		}
		if (bqdms.length === 0) {
			message.info('请勾选需要重新执行的标签');
			return;
		}
		this.props.dispatch({ type: 'processMonitoring/tagJgjkRerun', bqdms }).then(res => {
			this.doSearch();
		})
	}

	/**
  * @description: 多选change的事件
  * @param {type} 选中项
  * @return: void
  */
	onSelectChange = selectedRowKeys => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	render() {
		// 每个条件的label样式
		const labelStyle = {
			fontSize: 14,
			color: '#333'
		}
		// 条件区域的dom
		const conds = <Row gutter={30}>
			<Col span={8} style={labelStyle}>
				标签名称&nbsp;&nbsp;<Input allowClear onChange={e => this.setState({ bqmc: e.target.value })} value={this.state.bqmc} placeholder='请输入标签名称' style={{ width: '75%' }} />
			</Col>
			<Col span={8} style={labelStyle}>运行状态&nbsp;&nbsp;<Select
				value={this.state.yxztdm}
				onChange={yxztdm => this.setState({ yxztdm })}
				style={{ width: '75%' }}
				placeholder="请选择"
			>
				<Option value="SB">失败</Option>
				<Option value="CG">成功</Option>
				<Option value="JSZ">计算中</Option>
			</Select></Col>
			<Col span={8} style={labelStyle}>
				加工时间&nbsp;&nbsp;
				<DatePicker style={{ width: '35%' }} value={this.state.startTime} onChange={(date, dateString) => this.setState({ startTime: date, jgsjq: dateString })} placeholder='请选择开始日期' />&nbsp;-&nbsp;
				<DatePicker style={{ width: '35%' }} value={this.state.endTime} onChange={(date, dateString) => this.setState({ endTime: date, jgsjz: dateString })} placeholder='请选择结束日期' />
			</Col>
		</Row>;
		// 表格列属性配置
		const columns = [
			{
				title: '序号',
				align: 'center',
				width: 50,
				render: (text, record, index) => ((this.state.pageIndex - 1) * this.state.pageSize) + index + 1
			},
			{
				title: '标签名称',
				dataIndex: 'bqmc',
			},
			{
				title: '分析期间粒度',
				dataIndex: 'fxqjld',
				align: 'center',
				width: 120,
			},
			{
				title: '加工频率',
				dataIndex: 'jgpl',
				align: 'center',
				width: 80,
			},
			{
				title: '加工时间',
				dataIndex: 'jgsj',
				align: 'center',
				width: 120,
			},
			{
				title: '加工期间',
				dataIndex: 'jgqj',
				align: 'center',
				width: 120,
			},
			{
				title: '运行状态',
				dataIndex: 'yxztmc',
				align: 'center',
				width: 100,
				render: (text, record, index) => record.yxztdm === 'SB' ?
					<a onClick={() => this.setState({ errorMsg: record.bcxx, errorMsgVisible: true })}>{text}</a> : `${text}`
			},
			{
				title: '户数',
				dataIndex: 'hs',
				align: 'center',
				width: 100,
			},
			{
				title: '操作',
				dataIndex: 'cz',
				align: 'center',
				width: 100,
				render: (text, record, index) => <a onClick={() => this.reExecute(record)}>重新执行</a>
			},
		];

		// 表格区域的dom
		const content = <div className={styles.processMonitoring} id="tableContentProcess">
			<Table
				className={`deepColorTableHeight`}
				dataSource={this.props.tableList}
				columns={columns}
				bordered
				loading={this.state.loading}
				rowKey='bqdm'
				rowSelection={{
					selectedRowKeys: this.state.selectedRowKeys,
					onChange: this.onSelectChange
				}}
				onChange={this.doSearch}
				pagination={{
					showSizeChanger: true,
					total: this.props.total,
					current: this.state.pageIndex,
					pageSize: this.state.pageSize,
					pageSizeOptions: ['25', '50', '100'],
					showQuickJumper: true,
					size: 'small',
					showTotal: (total, range) => `当前第 ${range[0]} 到 ${range[1]} 条，共 ${total} 条`
				}}
				scroll={{ y: this.state.tableHeight, x: 1150 }}
				size="small" />
			<Button type='primary' onClick={this.reExecute} style={{ position: 'absolute', bottom: 10, left: 0, zIndex: 1 }}>重新执行</Button>
			<Modal
				title="失败原因"
				width={354}
				centered
				bodyStyle={{ minHeight: 'auto' }}
				visible={this.state.errorMsgVisible}
				onOk={() => this.setState({ errorMsgVisible: false })}
				onCancel={() => this.setState({ errorMsgVisible: false })}
				getContainer={document.getElementById('tableContentProcess')}
			>{this.state.errorMsg}</Modal>
		</div>
		return (
			<SearchLayout
				searchConds={conds}
				tableTitle='计算情况'
				tableContent={content}
				doSearch={() => this.setState({ pageIndex: 1 }, this.doSearch)}
				doReset={this.doReset}
			/>
		)
	}
}

ProcessMonitoring.propTypes = {
	total: PropTypes.number,
	tableList: PropTypes.array,
}

export default connect(state => ({
	total: state.processMonitoring.total,
	tableList: state.processMonitoring.tableList,
}))(ProcessMonitoring);