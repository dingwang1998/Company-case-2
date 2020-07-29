import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less'
import { Tree, Input, Table } from 'antd';
import IconFont from '@/components/common/iconFont/iconFont';
const { Search } = Input;

const TreeNode = Tree.TreeNode;


//需要的工具类方法
/**
 * 树搜索时获取父级
 * @method getParentKey
 */
const getParentKey = (key, tree) => {
	let parentKey;
	for (let i = 0; i < tree.length; i++) {
		const node = tree[i];
		if (node.children) {
			if (node.children.some(item => item.key === key)) {
				parentKey = node.key;
			} else if (getParentKey(key, node.children)) {
				parentKey = getParentKey(key, node.children);
			}
		}
	}
	return parentKey;
};

//需要的工具类方法结束

/**
 * 标签定义选择树表格联动组件
 * @method TreeTable
 */
class TreeTable extends Component {
	state = {
		expandedKeys: [],
		searchValue: '',
		autoExpandParent: true,
		dataList: [],
		treeData: [],
		curKey: "",
		tableData: [],
		mapTreeData: {},
		selectedKeys: [],
		selectedRowKeys: [],
		originTreeData: []
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

	componentDidMount() {
		this.props.onRef(this);
		this.getDataList();
	}

	/**
	 * 获取表格数据
	 * @method getTableData
	 * @param {String} id 选中的类目id
	 * @param {String} searchName 筛选关键字
	 */

	getTableData(id = "", searchName = "", callback = () => { }) {
		const { tableApi, tableProps } = this.props;
		let obj = {};
		obj[tableProps.id] = id;
		obj[tableProps.searchName] = searchName;

		tableApi(obj).then(res => {
			this.setState({
				tableData: res.data
			})
			callback(res);
		})
	}

	/**
	 * 获取树数据
	 * @method getDataList
	 */
	getDataList() {
		const { treeApi, treeProps } = this.props;
		treeApi().then(res => {
			if (res.code === "600") {
				const data = res.data;
				let dataList = data.map(item => {
					return {
						key: item[treeProps.key],
						title: item[treeProps.title],
						parent: item[treeProps.parent]
					}
				})
				this.setState({
					dataList: dataList
				})
				this.getTreeData(dataList);
			}
		})
	}

	/**
	 * 将平铺的逻辑树数组组合成树
	 * @param {Arrary}  data 需处理的逻辑树数组
	 * @return {Arrary} 树数组
	 * @method getTreeData
	 */
	getTreeData(data) {
		const { mapTreeData, originTreeData } = this.state;
		const mapTree = {};
		data.forEach(function (item) {
			delete item.children;
		});
		data.forEach(function (item) {
			!mapTreeData[item.key] && (mapTreeData[item.key] = item);
			mapTree[item.key] = item;
		});
		var val = [];
		data.forEach(item => {
			var parent = mapTree[item.parent];
			if (parent && item.key !== item.parent) {
				(parent.children || (parent.children = [])).push(item);
			} else {
				val.push(item);
			}
		});

		this.setState({
			treeData: val
		})

		if (!originTreeData.length) {
			this.setState({
				originTreeData: JSON.parse(JSON.stringify(val)),
				mapTreeData:mapTreeData
			})
		}

	}

	/**
	 * 重置数据
	 * @method resetData
	 */
	resetData() {
		this.setState({
			searchName: '',
			curKey: '',
			selectedKeys: [],
			searchValue: '',
			tableData: [],
			selectedRowKeys: []
		});
	}

	/**
	 * 设置默认数据
	 * @method setDefaultData
	 */
	setDefaultData() {
		const { treeNodeKey, tableRowKey } = this.props.defaultData;
		const { originTreeData, dataList } = this.state;

		//获取搜索到的相关父节点
		const expandedKeys = dataList.map(item => {
			if (item.key === treeNodeKey) {
				return getParentKey(item.key, originTreeData);
			}
			return null;
		}).filter((item, i, self) => item && self.indexOf(item) === i);

		this.setState({
			expandedKeys,
			autoExpandParent: true,
			curKey: treeNodeKey,
			selectedKeys: [treeNodeKey]
		});
		this.getTableData(treeNodeKey, '', () => {
			this.setState({
				selectedRowKeys: tableRowKey
			})
		})
	}

	/**
	 * 展开树
	 * @method onExpand
	 */
	onExpand = expandedKeys => {
		this.setState({
			expandedKeys,
			autoExpandParent: false
		});
	};

	/**
	 * 树搜索
	 * @method onChange
	 */
	onChange = e => {
		const { value } = e.target;
		const { dataList, originTreeData } = this.state;
		if (!value) {
			this.setState({
				expandedKeys: [],
				searchValue: value,
				autoExpandParent: false,
			});
			this.getTreeData(dataList);
			return;
		}
		//获取搜索到的相关父节点
		const keys = [];
		const expandedKeys = dataList
			.map(item => {
				if (item.title.indexOf(value) > -1) {
					keys.push(item.key);
					return getParentKey(item.key, originTreeData);
				}
				return null;
			})
			.filter((item, i, self) => item && self.indexOf(item) === i);
		const arr = dataList.filter(item => keys.concat(expandedKeys).indexOf(item.key) > -1);
		this.getTreeData(arr);
		this.setState({
			expandedKeys,
			searchValue: value,
			autoExpandParent: true
		});
	};

	/**
	 * 触发表格筛选
	 * @method onTableSearchChange
	 */
	onTableSearchChange(e) {
		const { curKey } = this.state;
		const { value } = e.target;
		this.getTableData(curKey, value);
	}

	/**
	 * 树选中节点处理
	 * @method selectTreeNode
	 * @param {String} key 选中的节点key值
	 */
	selectTreeNode(key, obj) {
		if (!obj.selected) return;
		const curKey = typeof key === "string" ? key : key[0]
		const { mapTreeData } = this.state;
		const { onlySelectLeafNode } = this.props;
		if (onlySelectLeafNode && mapTreeData[curKey] && mapTreeData[curKey].children && mapTreeData[curKey].children.length) {
			return;
		}
		this.setState({
			searchName: '',
			curKey: curKey,
			selectedKeys: [curKey]
		});
		this.getTableData(curKey);

	}

	/**
	 * 处理表格的单选change
	 * @method onRadioChange
	 * @param {Arrary} selectedRowKeys 选中的当前行key值
	 * @param {Object} selectedRows 选中的当前行数据对象
	 */
	onRadioChange(selectedRowKeys, selectedRows) {
		const { onRadioSelect } = this.props;
		const { curKey, mapTreeData } = this.state;
		this.setState({
			selectedRowKeys: selectedRowKeys
		})
		if (onRadioSelect) {
			const curObj = mapTreeData[curKey];

			let parentArr = curObj ? [curObj] : [];
			this.getParentByCurData(curObj, parentArr);
			onRadioSelect(selectedRows, parentArr);
		}
	}
	/**
	 * 获取当前父级集合
	 * @method getParentByCurData
	 */
	getParentByCurData(curDataObj, parentArr) {
		const { mapTreeData } = this.state;
		if (curDataObj && curDataObj.parent && curDataObj.parent !== curDataObj.key) {
			const parentItem = mapTreeData[curDataObj.parent];
			parentItem && parentArr.unshift(parentItem);
			this.getParentByCurData(parentItem, parentArr);
		}
	}

	/**
	 * 根据当前搜索关键字将树对应展开，并高亮显示关键字
	 * @method loop
	 * @param {Arrary} data 当前树数组
	 */
	loop(data) {
		const { searchValue } = this.state;
		return data.map(item => {
			const index = item.title.indexOf(searchValue);
			const beforeStr = item.title.substr(0, index);
			const afterStr = item.title.substr(index + searchValue.length);
			const title =
				index > -1 ? (
					<span title={item.title}>
						{beforeStr}
						<span className="site-tree-search-value">{searchValue}</span>
						{afterStr}
					</span>
				) : (
						<span title={item.title}>{item.title}</span>
					);
			if (item.children) {
				return { title, key: item.key, children: this.loop(item.children) };
			}
			return {
				title,
				key: item.key,
			};
		});
	}

	renderTreeNodes = data => data.map((item) => {
		const title = item.title.props.children[2];
    if (item.children) {
      return (
        <TreeNode   title={<span title={title}>{item.title}</span>} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode  key={item.key} title={<span title={title}>{this.props.showIcon?<span><IconFont style={{ fontSize: '8px',position:'relative',top:'-3px' }} type="svy-fxicon-jilu-xian" />&nbsp;</span>:''}{item.title}</span>} dataRef={item} />;
  })

	render() {
		const { expandedKeys, autoExpandParent, treeData, tableData, selectedKeys, selectedRowKeys, dataList } = this.state;
		const { columns, tableProps, showRadio, onRowClick } = this.props;
		return (
			<div className={[styles.treeTableBox, 'util-clearfix'].join(' ')}>
				<div className={styles.treeBox}>
					<Search style={{ marginBottom: 8 }} className={styles.treeSearch} placeholder="请输入目录关键字" onChange={this.onChange.bind(this)} />
					<Tree
						className={styles.tree}
						onExpand={this.onExpand}
						expandedKeys={expandedKeys}
						autoExpandParent={autoExpandParent}
						onSelect={this.selectTreeNode.bind(this)}
						selectedKeys={selectedKeys}
					>
						{this.renderTreeNodes(this.loop(treeData))}
					</Tree>
				</div>
				<div className={styles.tableBox}>
					<div className={styles.tableTop}>
						<Search style={{ marginBottom: 9 }} className={styles.tableSearch} placeholder="请输入列名称" onChange={this.onTableSearchChange.bind(this)} />
					</div>
					<Table
						className={[styles.table, 'deepColorTableHeight'].join(' ')}
						rowSelection={showRadio ? {
							type: 'radio',
							selectedRowKeys: selectedRowKeys,
							onChange: this.onRadioChange.bind(this)
						} : null}
						columns={columns}
						dataSource={tableData}
						loading={!dataList.length && showRadio}
						bordered
						size="small"
						pagination={false}
						rowKey={row => row[tableProps.key]}
						onRow={record => {
							return {
								onClick: event => { onRowClick(record) }
							};
						}}
					/>
				</div>
			</div>
		)
	}
}

const defaultProps = {
	columns: [],
	treeProps: {
		key: 'key',
		title: 'title',
		parent: 'parent'
	},
	tableProps: {
		id: 'id',
		searchName: 'searchName',
		key: 'key'
	},
	showRadio: false,
	onRowClick: () => { },
	onlySelectLeafNode: false,
	defaultData: {
		treeNodeKey: '',
		tableRowKey: ''
	}
};

const propTypes = {
	columns: PropTypes.array.isRequired
};

TreeTable.defaultProps = defaultProps;
TreeTable.propTypes = propTypes;

export default TreeTable;