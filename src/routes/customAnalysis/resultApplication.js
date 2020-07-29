/*
 * @Description:
 * @Author: [your name]
 * @Date: 2020-05-11 18:58:55
 * @LastEditors: [your name]
 * @LastEditTime: 2020-05-20 10:53:44
 * @FilePath: \labelmiddleplatform\src\routes\customAnalysis\resultApplication.js
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import * as commonService from "@/services/common/common";
// import CheckCondition from '@/components/resultApplication/CheckCondition';
import * as resultApplicationQuery from '@/services/customAnalysis/resultApplication'
import SearchLayout from '../../components/common/SearchLayout/SearchLayout'
import moment from 'moment';
import { Form,Button,Table,Modal, message,Input,Select,Row,Col,DatePicker } from 'antd';
import styles from './resultApplication.less';

const { Option } = Select;
class ResultApplication extends Component{
  constructor(props) {
    super(props)
    this.state={
      loading: false,
      modalVisible: false,
      pagination:null,
      pageIndex: 1,// 表格分页页码，从1开始
      pageSize: 25,// 表格分页每页条数,
      selectedRowKeys:[],//标签表格勾选项key
      bqidList:[],//需要关联应用的标签项
      selectedAppRowKeys:[],//支撑应用表格勾选项key
      zcyyList:[],//支撑应用表格勾选项
      tableHeight: document.body.clientHeight - 490, // 表格高度

      bqmc:'',
      dmBqlxArray:[],
      dmBqlx:'',
      dmZcyyArray:[],
      dmZcyy:'',
      sjq:'',
      sjz:'',
      startValue:null,
      endValue:null,
      defaultStartValue:null,
      defaultEndValue:null
    }
  }
  componentDidMount() {
    commonService.commonCombobox('BQLX').then(res => {
      if (res.code === '600') {
        this.setState({
          dmBqlxArray: res.data
        })
      }
    })
    commonService.commonCombobox('ZCYY').then(res => {
      if (res.code === '600') {
        this.setState({
          dmZcyyArray: res.data
        })
      }
    })
    this.props.dispatch({ type: 'common/queryDatabaseTime' }).then((time)=>{
      if(time){
        this.setState({
        sjq:time.nc,
        sjz:time.dt,
        startValue:moment(time.nc, 'YYYY-MM-DD'),
        endValue:moment(time.dt, 'YYYY-MM-DD'),
        defaultStartValue:time.nc,
        defaultEndValue:time.dt,
      },() => this.doSearch())
      }
    })
  }

  /**
   * @description: 限制起始时间不能超过结束时间
   * @param {type}
   * @return:
   */
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  /**
   * @description: 限制结束时间不能低于起始时间
   * @param {type}
   * @return:
   */
  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  /**
   * @description: 选择起始时间
   * @param {type}
   * @return:
   */
  onStartChange = (value,dateString) => {
    this.setState({
      sjq:dateString,
      startValue: value,
    });
  };

  /**
   * @description: 选择结束时间
   * @param {type}
   * @return:
   */
  onEndChange = (value,dateString) => {
    this.setState({
      sjz:dateString,
      endValue: value
    });
  };

  /**
   * @method: doReset
	 * @description: 重置表单
	 * @param {type}
	 * @return:
	 */
  doReset=()=>{
    // console.log("重置表单")
    const { defaultStartValue,defaultEndValue } = this.state
    this.setState({
      bqmc:'',
      dmBqlx:'',
      dmZcyy:'',
      sjq:defaultStartValue,
      sjz:defaultEndValue,
      startValue:moment(defaultStartValue, 'YYYY-MM-DD'),
      endValue:moment(defaultEndValue, 'YYYY-MM-DD'),
      selectedRowKeys:[],//标签表格勾选项key
      bqidList:[],//需要关联应用的标签项
      selectedAppRowKeys:[],//支撑应用表格勾选项key
      zcyyList:[],//支撑应用表格勾选项
    })
  }


  /**
   * @method: onSelectChange
   * @description: 标签表格选择项，获取选取的标签ID即bqid
   * @param {type} selectedRowKeys, selectedRows
   * @return:
   */
  onSelectChange = (selectedRowKeys, selectedRows)=>{
    this.setState({
      selectedRowKeys:selectedRowKeys
    })
  }

  /**
   * @method: onSelectChange
   * @description: 应用支撑表格选择项，获取选取的支撑应用id即dm，以及选中的支撑应用对象
   * @param {type} selectedRowKeys, selectedRows
   * @return:
   */
  onZcyySelectChange=(selectedRowKeys, selectedRows)=>{
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      selectedAppRowKeys:selectedRowKeys,
      zcyyList:selectedRowKeys
    })
  }

  /**
   * @method: handleTableChange
   * @description: 分页查询
   * @param {type}
   * @return:
   */
  handleTableChange=(pagination)=>{
    this.setState({
      pagination
    },()=>{
      this.doSearch(pagination);
    })
  }
  /**
   * @method: doSearch
	 * @description: 表格查询
	 * @param {type}
	 * @return:
	 */
	doSearch=(pagination)=>{
    // console.log("表格查询");
    const {pageIndex,pageSize,bqmc,dmBqlx,dmZcyy,sjq,sjz}=this.state
    if(sjq===""||sjz===""){
      message.error('创建开始时间和结束时间必填！')
      return;
    }
    this.setState({
        loading: true,
        selectedRowKeys: [],
        pageIndex:pagination?pagination.current:this.state.pageIndex,
        pageSize:pagination?pagination.pageSize:this.state.pageSize
    },()=>{
        this.props.dispatch({
          type: 'resultApplication/queryLabelList', params: {
            bqmc,
            dmBqlx,
            dmZcyy,
            sjq,
            sjz,
            pageIndex,
            pageSize,
          }
        }).then(()=>{
          this.setState({
            loading:false,
          })
        })
    })
  }

  /**
   * @method: linkApplication
   * @description: 选择关联应用，选择某一行时，record为当前行，多选后点击按钮，record为undefined
   * @param {type} record
   * @return:
   */
  linkApplication=(record)=>{
    //标签表格选择项-需要关联应用的标签项
    let labels=this.state.selectedRowKeys;
    if(record && record.bqid){
      labels=[];
      labels.push(record.bqid)
    }
    if(labels.length===0){
      message.info('请勾选需要关联应用的标签')
      return;
    }
    this.setState({
      modalVisible:true,
      bqidList:[...labels]
    })
  }

  /**
   * @method: changeSelectedRowsApplication
   * @description: 选择关联应用后保存并请求列表内容
   * @param {type}
   * @return:
   */
  changeSelectedRowsApplication=()=>{
    const { pagination, bqidList,zcyyList}=this.state;
    resultApplicationQuery.linkLabelApp({
      bqidList:bqidList,
      zcyyList:zcyyList
    }).then((res)=>{
      if(res.code!=="600"){
        message.error(`关联失败! 失败原因是:${res.msg}`);
      }else{
        this.doSearch(pagination)
      }
    })
    this.setState({
      modalVisible:false,
      selectedAppRowKeys:[]
    })
  }

  render(){
    const {selectedRowKeys,selectedAppRowKeys,startValue, endValue,defaultStartValue,defaultEndValue,bqmc,dmBqlx,dmBqlxArray,dmZcyy,dmZcyyArray}=this.state;
    // 每个条件的label样式
    const labelStyle = {
      fontSize: 14,
      color: '#333'
    }
    const conds=<div
    >
      <Row gutter={30} >
        <Col span={12} style={labelStyle}>
          标签名称&nbsp;&nbsp;
          <Input
            style={{ width: '376px' }}
            maxLength={50}
            placeholder="输入不超过50字"
            value={bqmc}
            onChange={(e)=>{
            // console.log("标签名称",e.target.value)
            this.setState({
              bqmc:e.target.value
            })
          }}/>
        </Col>
        <Col span={12} style={labelStyle}>
            &nbsp;&nbsp;&nbsp;标签类型&nbsp;&nbsp;
            <Select
              style={{ width: '376px' }}
              placeholder="请选择标签类型"
              value={dmBqlx}
              onChange={(value)=>{
                // console.log("标签类型",value)
                this.setState({
                  dmBqlx:value
                })
              }}
            >
              {dmBqlxArray && dmBqlxArray.map(item=>{
                return (<Option key={item.dm} value={item.dm}>{item.mc}</Option>)
              })}
            </Select>
					</Col>
      </Row>

      <Row gutter={30} style={{ marginTop: '16px' }}>
        <Col span={12} style={labelStyle}>
          支撑应用&nbsp;&nbsp;
          <Select
            style={{ width: '376px' }}
            placeholder="请选择支撑应用"
            value={dmZcyy}
            onChange={(value)=>{
              // console.log("支撑应用",value)
              this.setState({
                dmZcyy:value
              })
            }}
          >
            {dmZcyyArray && dmZcyyArray.map(item=>{
              return (<Option key={item.dm} value={item.dm}>{item.mc}</Option>)
            })}
          </Select>
        </Col>
        <Col span={12} style={labelStyle}>
          <span style={{color:'red'}}>*&nbsp;&nbsp;</span>
          创建时间&nbsp;&nbsp;
          <DatePicker
            style={{ width: '143px' }}
            defaultValue={defaultStartValue?moment(defaultStartValue, 'YYYY-MM-DD'):null}
            defaultPickerValue={defaultStartValue?moment(defaultStartValue, 'YYYY-MM-DD'):null}
            disabledDate={this.disabledStartDate}
            showToday
            format="YYYY-MM-DD"
            value={startValue}
            placeholder="请选择开始日期"
            onChange={this.onStartChange}
          />
          &nbsp;-&nbsp;
          <DatePicker
            style={{ width: '143px' }}
            defaultValue={defaultEndValue?moment(defaultEndValue, 'YYYY-MM-DD'):null}
            defaultPickerValue={defaultEndValue?moment(defaultEndValue, 'YYYY-MM-DD'):null}
            disabledDate={this.disabledEndDate}
            showToday
            format="YYYY-MM-DD"
            value={endValue}
            placeholder="请选择结束日期"
            onChange={this.onEndChange}
          />
				</Col>
      </Row>
    </div>
    const columns = [
      {
        title: '序号',
        align: 'center',
        width:100,
        render: (text, record, index) => ((this.state.pageIndex - 1) * this.state.pageSize) + index + 1
      },
      {
        title: '标签名称',
        align: 'center',
        dataIndex: 'bqmc',
        key: 'bqmc',
      },
      {
        title: '标签类型',
        align: 'center',
        dataIndex: 'bqlxmc',
        key: 'bqlxmc',
        width:200
      },
      {
        title: '创建时间',
        align: 'center',
        key: 'cjsj',
        dataIndex: 'cjsj',
        width:200
      },
      {
        title: '支撑应用',
        align: 'center',
        key: 'zcyymc',
        dataIndex: 'zcyymc',
        width:200
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text,record,index) => (
          <span>
            <a onClick={()=>this.linkApplication(record)}>关联应用</a>
          </span>
        ),
        width:100
      },
    ];
    const modalcolumns = [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => (index+1)
      },
      {
        title: '支撑应用',
        align: 'center',
        key: 'mc',
        dataIndex: 'mc',
      }
    ];

    const content=
    <div className={styles.resultApplication}>
      <Table
        className='deepColorTableHeight'
        rowSelection={{
          selectedRowKeys,
          onChange: this.onSelectChange
        }}
        bordered
        loading={this.state.loading}
        dataSource={this.props.labelList}
        columns={columns}
        rowKey='bqid'
        pagination={{
          showSizeChanger: true,
          total: this.props.total,
          current: this.state.pageIndex,
          pageSize: this.state.pageSize,
          pageSizeOptions: ['25', '50', '100'],
          showQuickJumper: true,
          size: 'small',
          showTotal: (total, range) => `当前第 ${range[0]} 到 ${range[1]} 条，共 ${total} 条`,
        }}
        scroll={{ y: this.state.tableHeight}}
        onChange={this.handleTableChange}
        size="small"
      />
      <Button type='primary' onClick={this.linkApplication} style={{ position: 'absolute', bottom: 3, left: 0, zIndex: 1 }}>关联应用</Button>
      <Modal
        title="支撑应用列表"
        centered
        visible={this.state.modalVisible}
        onOk={this.changeSelectedRowsApplication}
        onCancel={() => this.setState({
          selectedRowKeys:[],
          selectedAppRowKeys:[],
          modalVisible:false
        })}
        scroll={{ y: 100}}
        size="small"
      >
        <Table
          rowSelection={{
            selectedRowKeys:selectedAppRowKeys,
            onChange: this.onZcyySelectChange
          }}
          pagination={false}
          bordered
          dataSource={this.state.dmZcyyArray}
          columns={modalcolumns}
          rowKey='dm'
        />
      </Modal>
    </div>
    return (
      <SearchLayout
        searchConds={conds}
        tableTitle='标签列表'
        tableContent={content}
        doSearch={() => this.setState({ pageIndex: 1 }, this.doSearch)}
        doReset={this.doReset}
      />
    )
  }
}
ResultApplication.propTypes = {
	total: PropTypes.number,
  labelList: PropTypes.array,
  time:PropTypes.object
}
function mapStateToProps(state) {
  const { total,labelList }=state.resultApplication;
  const { time }=state.common
  return {
    total,
    labelList,
    time
  }
}

export default connect(mapStateToProps)(ResultApplication);

