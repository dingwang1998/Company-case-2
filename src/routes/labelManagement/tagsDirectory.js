import React, { Component } from 'react';
import { Button, Table, Modal, Input } from 'antd';
import styles from './tagsDirectory.less';
import * as Service from "@/services/labelManagement/tagsDirectory";
import IconFont from '@/components/common/iconFont/iconFont';

const { confirm } = Modal;

class TagsDirectory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			treeList: [],
			curWdz: '',
			addVisible: false,
			addName: '',
			mapTreeData: {},
			expandedRowKeys: [],
			editVisible: false,
			editName: ''
		};
		this.getTreeData();
		this.columns = [
			{
				title: '目录名称',
				dataIndex: 'wdmc',
				key: 'wdmc',
				align: 'left',

			},
			{
				title: '操作',
				dataIndex: 'wdz',
				width: '528px',
				key: 'wdz',
				align: 'center',
				render: (text, record) => {
					const withPermissions = record.sfkyxg;
					const hasChildren = record.children && record.children.length;
					return (
						<div className={styles.optionBox}>
							<span onClick={this.showAddLm.bind(this, record.wdz)}>新增子类目</span>
							<span className={withPermissions === 'N' ? styles.disableBtn : ''} onClick={withPermissions === 'Y' ? this.showEditLm.bind(this, record) : () => { }}>修改</span>
							<span onClick={withPermissions === 'Y' && !hasChildren ? this.doDelete.bind(this, record) : () => { }} className={withPermissions === 'N' || hasChildren ? styles.disableBtn : ''}>删除</span>
							{record.dmMlzt === 'QY' ?
								(<span onClick={withPermissions === 'Y' ? this.doEnableDisable.bind(this, record, 'TY') : () => { }} className={withPermissions === 'N' ? styles.disableBtn : ''}>停用</span>) :
								(<span onClick={withPermissions === 'Y' ? this.doEnableDisable.bind(this, record, 'QY') : () => { }} className={withPermissions === 'N' ? styles.disableBtn : ''}>启用</span>)}
						</div>
					)
				}
			},
		];
	}
	componentWillUnmount = () => {
		this.setState = (state, callback) => {
			return;
		};
	}
	/**
	 * 启用、停用
	 * @method doEnableDisable
	 * @for TagsDirectory
	 * @param {Object} row 当前行数据
	 * @param {String} enable QY/TY
	 */
	doEnableDisable(row, enable) {
		let api = Service.mlQy;
		const { treeList,mapTreeData } = this.state;
		if (enable === 'TY') {
			api = Service.mlTy; 
		}
		api(row.wdz).then(res => {
			if (res.code === '600') {
				row.dmMlzt = 	mapTreeData[row.wdz].dmMlzt = enable === 'TY' ? "TY" : "QY";
				this.setState({
					treeList: [].concat(treeList)
				})
			}
		})
	}
	/**
	 * 删除行
	 * @method doEnadoDeletebleDisable
	 * @for TagsDirectory
	 * @param {Object} row 当前行数据
	 */
	doDelete(row) {
		const self = this;
		this.setState({
			curWdz: row.wdz
		})
		const { mapTreeData, treeList, expandedRowKeys } = this.state;

		confirm({
			title: `${row.wdmc}目录将被删除，是否继续？`,
			icon: <IconFont type="svy-fxicon-tishi" style={{ fontSize: '24px', color: '#FF7E6E' }} />,
			onOk() {
				Service.mlSc(row.wdz).then(res => {
					if (res.code === '600') {
						const curItem = mapTreeData[row.wdz];
						const parent = mapTreeData[curItem.pid];
						parent.children = parent.children.filter(item => item.wdz !== row.wdz);
						if (!parent.children.length) {
							self.setState({
								expandedRowKeys: expandedRowKeys.filter(item => item !== curItem.pid)
							})
						}
						self.setState({
							treeList: [].concat(treeList),
						})
					}
				})
			},
			onCancel() { },
		});
	}
	/**
	 * 获取逻辑树平铺数组
	 * @method getTreeData
	 * @for TagsDirectory
	 */
	getTreeData() {
		Service.whcx().then(res => {
			if (res.code === '600') {
				this.setState({
					treeList: this.setDataToTree(res.data)
				})
			}
		})
	}
	/**
	 * 将数组组合成树
	 * @method setDataToTree
	 * @for TagsDirectory
	 * @param {Arrary} data 平铺的逻辑树数组
	 * @return {Arrary} 树数组
	 */
	setDataToTree(data) {
		let { mapTreeData } = this.state;
		this.setState({
			mapTreeData: {}
		})
		data.forEach(function (item) {
			delete item.children;
		});
		data.forEach(function (item) {
			mapTreeData[item.wdz] = item;
		});
		var val = [];
		data.forEach(item => {
			var parent = mapTreeData[item.pid];
			if (parent && item.wdz !== item.pid) {
				(parent.children || (parent.children = [])).push(item);
			} else {
				val.push(item);
			}
		});
		this.setState({
			mapTreeData: mapTreeData
		})
		return val
	}
	/**
	 * 展示添加类弹窗
	 * @method showAddLm
	 * @for TagsDirectory
	 * @param {String} wdz 当前行id
	 */
	showAddLm(wdz = '') {
		this.setState({
			curWdz: wdz,
			addVisible: true,
			addName: ''
		})
	}
	/**
	 * 展示修改弹窗
	 * @method showEditLm
	 * @for TagsDirectory
	 * @param {Object} row 当前行数据
	 */
	showEditLm(row) {
		this.setState({
			curWdz: row.wdz,
			editVisible: true,
			editName: row.wdmc
		})
	}
	/**
	 * 处理点击展开或点击收起
	 * @method onExpand
	 * @for TagsDirectory
	 * @param {Boolean} onExpanded false:收起 true:展开
	 * @param {Object} row 当前行数据
	 */
	onExpand(onExpanded, row) {
		const { expandedRowKeys } = this.state;
		if (onExpanded) {
			expandedRowKeys.indexOf(row.wdz) < 0 && expandedRowKeys.push(row.wdz)
			this.setState({
				expandedRowKeys: expandedRowKeys
			})
		} else {
			this.setState({
				expandedRowKeys: expandedRowKeys.filter(item => item !== row.wdz)
			})
		}
	}
	/**
	 * 取消添加
	 * @method handleCancel
	 * @for TagsDirectory
	 */
	handleCancel() {
		this.setState({
			addVisible: false,
			addName:''

		})
	}
	/**
	 * 取消修改
	 * @method handleEditCancel
	 * @for TagsDirectory
	 */
	handleEditCancel() {
		this.setState({
			editVisible: false
		})
	}
	/**
	 * 修改弹窗点击确定
	 * @method editRow
	 * @for TagsDirectory
	 */
	editRow() {
		const { curWdz, editName, mapTreeData, treeList } = this.state;
		Service.save({
			sjbqmldm: mapTreeData[curWdz].pid,
			mlmc: editName,
			mldm:curWdz
		}).then(res => {
			if (res.code === "600") {
				mapTreeData[curWdz].wdmc = editName;
				this.setState({
					treeList: [].concat(treeList),
					mapTreeData: mapTreeData,
					editVisible: false,
					editName: ''
				})
			}
		})
	}
  /**
	 * 添加弹窗点击确定
	 * @method addRow
	 * @for TagsDirectory
	 */
	addRow() {
		const { curWdz, addName, mapTreeData, treeList, expandedRowKeys } = this.state;
		Service.save({
			sjbqmldm: curWdz,
			mlmc: addName
		}).then(res => {
			const dm = res.data;
			if (res.code === "600") {
				const newItem = {
					wdz: dm,
					pid: curWdz,
					sfkyxg: 'Y',
					dmMlzt: 'QY',
					wdmc: addName,
					addName: ''
				}
				mapTreeData[dm] = newItem;
				//新增非一级目录
				if (curWdz) {
					let item = mapTreeData[curWdz];
					(item.children || (item.children = [])).unshift(newItem)
					expandedRowKeys.push(curWdz);
					this.setState({
						treeList: [].concat(treeList),
						mapTreeData: mapTreeData,
						addVisible: false,
						expandedRowKeys: expandedRowKeys
					})
				} else {//新增一级目录
					treeList.unshift(newItem);
					this.setState({
						treeList: [].concat(treeList),
						addVisible: false,
						mapTreeData: mapTreeData,
						addName: ''
					})
				}
			} 
			// else {
			// 	Modal.error({
			// 		okText: '确定',
			// 		title: res.msg,
			// 		icon: <IconFont type="svy-fxicon-tishi" style={{ fontSize: '24px', color: '#FF7E6E' }} />
			// 	});
			// }
		})
	}

	render() {
		const { treeList, addVisible, addName, expandedRowKeys, editName, editVisible } = this.state;
		return (
			<div className={styles.tagsDirectoryBox}>
				<div className={styles.directoryTitle}>标签目录列表</div>
				<div className={styles.directoryContent}>
					<Button onClick={this.showAddLm.bind(this, '')} type="primary" size="default">添加目录</Button>
					<div className={styles.directoryTable}>
						<Table
							expandedRowKeys={expandedRowKeys}
							className='deepColorTableHeight'
							columns={this.columns}
							size="small"
							dataSource={treeList}
							rowKey={row => row.wdz}
							pagination={false}
							bordered
							onExpand={this.onExpand.bind(this)}
						/>
					</div>
				</div>
				<Modal
					title="添加类目"
					visible={addVisible}
					onOk={this.addRow.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					okButtonProps={{ disabled: !addName }}
				>
					<div>
						<span className={styles.addLabel}>类目名称：</span>
						<Input value={addName} style={{ width: 'calc(100% - 100px)' }} onChange={(e) => this.setState({ addName: e.target.value })} />
					</div>
				</Modal>

				<Modal
					title="添加"
					visible={addVisible}
					onOk={this.addRow.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					okButtonProps={{ disabled: !addName }}
				>
					<div>
						<span className={styles.addLabel}>类目名称：</span>
						<Input value={addName} style={{ width: 'calc(100% - 100px)' }} onChange={(e) => this.setState({ addName: e.target.value })} />
					</div>
				</Modal>
				<Modal
					title="修改"
					visible={editVisible}
					onOk={this.editRow.bind(this)}
					onCancel={this.handleEditCancel.bind(this)}
					okButtonProps={{ disabled: !editName }}
				>
					<div>
						<span className={styles.addLabel}>类目名称：</span>
						<Input value={editName} style={{ width: 'calc(100% - 100px)' }} onChange={(e) => this.setState({ editName: e.target.value })} />
					</div>
				</Modal>
			</div>
		)
	}
}

export default TagsDirectory;