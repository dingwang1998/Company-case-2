import React, { Component } from 'react';
import { connect } from 'dva';
import {message, Input, Row, Col, Select, DatePicker, Table, Button, TreeSelect, Modal } from 'antd';
/* import { InfoCircleOutlined } from '@ant-design/icons'; */
import SearchLayout from '../../components/common/SearchLayout/SearchLayout'
import EllipsisTooltip from '../../components/common/EllipsisTooltip';
import LabelView from '../../components/labelManagement/labelView/labelView';
import TagsDefinedBasic from '@/routes/tagsDefined/tagsDefinedBasic';
import TagsDefinedRule from '@/routes/tagsDefined/tagsDefinedRule';
import TagsDefinedSQL from '@/routes/tagsDefined/tagsDefinedSQL';

import * as commonService from "@/services/common/common";
import moment from 'moment';
import IconFont from '@/components/common/iconFont/iconFont';


const { Option } = Select;
const { confirm } = Modal;

const startTime = moment(moment().year(moment().year()).startOf('year').valueOf());
const endTime = moment(moment().year(moment().year()).endOf('year').valueOf())

class LabelManagement extends Component {
  constructor(props) {
		super(props);
		// const { swryId } = this.props.app.user.swryId;
    this.state = {
      isViewMode: '1', // 当前模式 1:标签列表 2：详情 3：基础标签修改 4：规则标签修改 5：sql标签修改
      curOpLabel: null, // 当前操作查看的标签
      sydxOptions: [], // 适用对象选择列表
      glswjgOptions: [], // 管理税务机关选择列表
      bqmlOptions: [], // 标签目录选择列表
      loading: false, // 表格加载动画
      pageIndex: 1, // 表格分页页码，从1开始
      pageSize: 25, // 表格分页每页条数
      sydxdm: '', // 参数：适用对象
      bqmc: '', // 参数：标签名称
      bqmldm: '', // 参数：标签目录
      glswjgdm: this.props.app.user.qxSwjgId, // 参数：管理机关
      cjsjq: '', // 创建开始时间
      cjsjz: '', // 创建结束时间
      startTime:startTime,
      endTime:endTime,
      tableData: [], // 表格数据
      total: 0,
			tableHeight: document.body.clientHeight - 490, // 表格高度
			curBqdm:'',//当前修改的标签代码
			sydxList:[],
			rootBqId:''
		};
		this.getSydxList();
  }

 
  componentDidMount() {
    this.props.dispatch({type: 'labelManagement/querySwjgList'}).then(res => {
      if(res.code === '600') {
        this.setState({glswjgOptions: res.data.map(item => {
          item.pId = item.pid;
          item.id = item.wdz;
          item.title = item.wdmc;
          item.value = item.wdz;
          return item;
        })});
      }
    })
    this.props.dispatch({type: 'labelManagement/queryMlList'}).then(res => {
      if(res.code === '600') {
				const arr = res.data.map(item => {
          item.pId = item.pid;
          item.id = item.wdz;
          item.title = item.wdmc;
          item.value = item.wdz;
          return item;
				});
				const treeData = this.toTree(arr);
        this.setState({bqmlOptions: treeData,
				bqmldm:treeData[0].value,
				rootBqId:treeData[0].value
			});
			this.doSearch();
      }
		})
	}
	componentWillUnmount = () => {
		this.setViewModel('1');
    this.setState = (state,callback)=>{
      return;
    };
}
 
	
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
   * 税务机关改变事件
   * @param {*} val 
   * @param {*} label 
   * @param {*} extra 
   */ 
  handleSwjgChange(val, label, extra) {
    const allCheckedNodes = extra.allCheckedNodes;
    const glswjgdm = allCheckedNodes.map((ele) => {
      return ele.node && ele.node.props.value || ele.props.value;
    }).join(',');
    this.setState({ glswjgdm });
  }

  /**
   * 标签目录改变事件
   * @param {*} val 
   * @param {*} label 
   * @param {*} extra 
   */
  handleBqmlChange(val, label, extra) {
    const bqmldm = val;
    this.setState({ bqmldm });
  }

	/**
  * @description: 查询事件
  * @param {type} any
  * @return: void
  */
  doSearch = (pagination) => {
		const { pageIndex, pageSize, sydxdm, bqmc, bqmldm, glswjgdm, startTime, endTime } = this.state;
		if(!startTime || !endTime){
			message.error('创建开始时间和结束时间必填！');
			return;
		}
    this.setState({
      loading: true,
      pageIndex: pagination ? pagination.current : this.state.pageIndex,
      pageSize: pagination ? pagination.pageSize : this.state.pageSize
    }, () => {
      this.props.dispatch({
        type: 'labelManagement/queryLabelList', params: {
          pageIndex,
          pageSize,
          sydxdm,
          bqmc,
          bqmldm,
          glswjgdm,
          cjsjq:startTime,
          cjsjz:endTime
        }
      }).then((res) => {
				if(res.code === '600'){
        this.setState({ 
          loading: false,
          tableData: res.data.map((item,i) => ({...item, key: item.bqdm+''+i}))
        });
      }});
    });
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
			var parent = mapTreeData[item.pId];
			if (parent && item.value !== item.pId) {
				(parent.children || (parent.children = [])).push(item);
			} else {
				val.push(item);
			}
		});
		return val;

	}

	/**
  * @description: 重置事件
  * @param {type} any
  * @return: void
  */
  doReset = () => {
		const { rootBqId } = this.state;
    this.setState({
      sydxdm: '',
      bqmc: '',
      bqmldm: rootBqId,
      glswjgdm: this.props.app.user.qxSwjgId,
      cjsjq: '',
      cjsjz: '',
      startTime: startTime,
      endTime: endTime,
    })
  }

  /**
   * 查看标签详情、修改标签
   * @memberof LabelManagement
   */
  goToDetail(row, op) {
    if(op === 'view') {
      this.setState({
        curOpLabel: row
			});
			this.setViewModel('2');		
    }else if(op === 'edit'){
			this.setState({
				curBqdm:row.bqdm
			})
			this.setViewModel(row.bqdylx==='JC'?'3':row.bqdylx==='GZ'?'4':'5');
	}
}

  /**
   * 删除标签
   * @memberof LabelManagement
   */
  doDelete(label) {
    const self = this;
    confirm({
      title: `${label.bqmc}中所有信息将删除，是否继续？`,
      icon: <IconFont type="svy-fxicon-tishi" style={{fontSize: '24px', color: '#FF7E6E'}} />,
      onOk() {
        self.props.dispatch({
          type: 'labelManagement/deleteLabel', bqdm: label.bqdm
        }).then((res) => {
          if(res.code === '600') {
            self.doSearch();
          }
        });
      },
      onCancel() {},
    });
  }

  /**
   * 停用/启用
   * @memberof LabelManagement
   */
  changeStatus(label) {
    const url = label.ztmc === '停用' ? 'labelManagement/enableLabel' : 'labelManagement/disableLabel'
    this.props.dispatch({
      type: url, bqdm: label.bqdm
    }).then((res) => {
      if(res.code === '600') {
        this.doSearch();
      }
    });
	}

	/**
   * 设置当前展示组件
   * @memberof LabelManagement
   */
	setViewModel(viewMode){
		const { dispatch } = this.props;
		dispatch({
			type: 'labelManagement/setViewModel',
			payload: {
				isViewMode: viewMode
			}
		})
	}
  onRefSqlDefined(ref) {
		this.sqlDefinedRef = ref;
	}

  render() {
    // 每个条件的label样式
    const labelStyle = {
      fontSize: 14,
      color: '#333'
    }
    const treeSelectStyle = {
      width: 220, verticalAlign: 'middle', overflow: 'hidden',
    };
    const dropStyle = {
      height: '300px', overflow: 'auto', boxShadow: '0px 0px 10px #eee', width: '220px',
		};
    // 条件区域的dom
    const conds = <div>
      <Row gutter={30}>
        <Col span={12} style={labelStyle}>
          标签名称&nbsp;&nbsp;
          <Select
            value={this.state.sydxdm}
            onChange={sydxdm => this.setState({ sydxdm })}
            style={{ width: '100px' }}
            placeholder="请选择"
          >
						{this.state.sydxList.map(item => {
								return (<Option key={item.dm} value={item.dm}>{item.mc}</Option>)
						})}
            {/* <Option value="1">纳税人</Option>
            <Option value="2">自然人</Option>
            <Option value="3">税务机关</Option> */}
          </Select>&nbsp;&nbsp;
          <Input allowClear onChange={e => this.setState({ bqmc: e.target.value })} value={this.state.bqmc} placeholder='请输入标签名称' style={{ width: '268px' }} />
        </Col>
        <Col span={12} style={labelStyle}>
          管理机关&nbsp;&nbsp;
          <TreeSelect
            treeData={this.state.glswjgOptions}
            treeDataSimpleMode
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            value={this.state.glswjgdm.split(',')}
            onChange={this.handleSwjgChange.bind(this)}
            treeDefaultExpandedKeys={[this.state.glswjgOptions.length ? this.state.glswjgOptions[0].id : '']}
            placeholder="-请选择税务机关-"
            treeNodeFilterProp="title"
            style={{ ...treeSelectStyle, width: '376px' }}
            dropdownStyle={{ ...dropStyle, width: '200px' }}
          />
        </Col>
      </Row>
      <Row gutter={30} style={{ marginTop: '16px' }}>
      <Col span={12} style={labelStyle}>
          标签目录&nbsp;&nbsp;
          <TreeSelect
						allowClear={true}
            treeData={this.state.bqmlOptions}
            treeDataSimpleMode
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            value={this.state.bqmldm?this.state.bqmldm.split(','):''}
            onChange={this.handleBqmlChange.bind(this)}
            treeDefaultExpandedKeys={[this.state.bqmlOptions.length ? this.state.bqmlOptions[0].id : '']}
            placeholder="-请选择标签目录-"
            treeNodeFilterProp="title"
            style={{ ...treeSelectStyle, width: '376px' }}
            dropdownStyle={{ ...dropStyle, width: '200px' }}
          />
        </Col>
        <Col span={12} style={labelStyle}>
					<span style={{color:'red'}}>*&nbsp;&nbsp;</span>
          创建时间&nbsp;&nbsp;
          <DatePicker allowClear={false} style={{ width: '143px' }} value={this.state.startTime} onChange={(date, dateString) => this.setState({ startTime: date, cjsjq: dateString })} placeholder='请选择开始日期' />&nbsp;-&nbsp;
          <DatePicker allowClear={false} style={{ width: '143px' }} value={this.state.endTime} onChange={(date, dateString) => this.setState({ endTime: date, cjsjz: dateString })} placeholder='请选择结束日期' />
        </Col>
      </Row>
    </div>;
    // 表格列属性配置
    const columns = [
      {
        title: '序号',
        align: 'center',
        width: 50,
        dataIndex: 'xh',
        render: (text, record, index) => index + 1
      },
      {
        title: '标签名称',
				dataIndex: 'bqmc',
				width:260,
        render: (text, record, index) => (<span style={{ color: '#1D76C4', cursor: 'pointer' }} onClick={this.goToDetail.bind(this,record,'view')}>{text}</span>)
      },
      {
        title: '标签目录',
        dataIndex: 'bqmlmc',
        align: 'center',
        width: 120,
      },
      {
        title: '适用对象',
        dataIndex: 'sydxmc',
        align: 'center',
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'ztmc',
        align: 'center',
        width: 100,
      },
      {
        title: '管理税务机关',
        dataIndex: 'glswjgmc',
        align: 'center',
        width: 120,
      },
      {
        title: '使用机关',
        dataIndex: 'syswjgmc',
        align: 'center',
				width: 200,
				render:text=> <EllipsisTooltip title={text}> {text} </EllipsisTooltip>
      },
      {
        title: '创建人',
        dataIndex: 'cjrymc',
        align: 'center',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'cjsj',
        align: 'center',
        width: 120,
      },
      {
        title: '操作',
        dataIndex: 'cz',
        align: 'center',
        width: 240,
        render: (text, record, index) => <div>
          <Button type="link" disabled={this.props.app.user.swryId!==record.cjrydm} onClick={this.goToDetail.bind(this,record,'edit')}>修改</Button>
          <Button type="link" disabled={this.props.app.user.swryId!==record.cjrydm} onClick={this.doDelete.bind(this,record)}>删除</Button>
          <Button type="link" disabled={this.props.app.user.swryId!==record.cjrydm} onClick={this.changeStatus.bind(this,record)}>{ record.ztmc === '启用' ? '停用' : '启用' }</Button>
        </div>
      },
    ];

    // 表格区域的dom
    const content = <div id="tableContent" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Table
        className='deepColorTableHeight'
        dataSource={this.state.tableData}
        columns={columns}
        bordered
        loading={this.state.loading}
        rowKey='key'
        onChange={this.doSearch}
        pagination={{
          showSizeChanger: true,
          total: this.state.total,
          current: this.state.pageIndex,
          pageSize: this.state.pageSize,
          pageSizeOptions: ['25', '50', '100'],
          showQuickJumper: true,
          size: 'small',
          showTotal: (total, range) => `当前第 ${range[0]} 到 ${range[1]} 条，共 ${total} 条`
        }}
        scroll={{ y: this.state.tableHeight, x: 'max-content'}}
        size="small" />
    </div>
		let curContent ;
		const {isViewMode}  = this.props.labelManagement;
		const {curBqdm} = this.state;
		switch (isViewMode) {
			case '2':
				curContent = <LabelView label={this.state.curOpLabel} onBack={this.setViewModel.bind(this,'1')}></LabelView>
				break;
			case '3':
				curContent = <TagsDefinedBasic refresh={this.doSearch} bqdm={curBqdm}></TagsDefinedBasic>
				break;
			case '4':
				curContent = <TagsDefinedRule refresh={this.doSearch} bqdm={curBqdm}></TagsDefinedRule>
				break;
			case '5':
				curContent = <TagsDefinedSQL refresh={this.doSearch} bqdm={curBqdm}></TagsDefinedSQL>
				break;	
			default: 
			curContent = 
				<SearchLayout
					searchConds={conds}
					tableTitle='标签列表'
          tableContent={content}
					doSearch={() => this.setState({ pageIndex: 1 }, this.doSearch)}
					doReset={this.doReset}
				/>;
			}
		return curContent;  
  }
}

LabelManagement.propTypes = {}

export default connect(
	({ app,labelManagement }) => ({ app,labelManagement })
)(LabelManagement);