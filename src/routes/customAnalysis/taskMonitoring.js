/*
 * @Author: your name
 * @Date: 2020-05-16 17:07:02
 * @LastEditTime: 2020-05-20 10:47:40
 * @LastEditors: [your name]
 * @Description: In User Settings Edit
 * @FilePath: \labelmiddleplatform\src\routes\customAnalysis\taskMonitoring.js
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import * as commonService from "@/services/common/common";
import * as taskMonitoringQuery from '@/services/customAnalysis/taskMonitoring'
import SearchLayout from '../../components/common/SearchLayout/SearchLayout'
import moment from 'moment';
import { Button,Table,Modal, message,Input,Select,Row,Col,DatePicker } from 'antd';
import styles from './taskMonitoring.less';

const { Option } = Select;
class TaskMonitoring extends Component {
  constructor(props) {
    super(props)
    this.state={
      loading: false,
      errorMsg: '', // 报错提示信息
      errorMsgVisible: false, // 报错信息提示框是否可见

      pagination:null,
      pageIndex: 1,// 表格分页页码，从1开始
      pageSize: 25,// 表格分页每页条数,
      selectedRowKeys:[],//标签表格勾选项key
      jhjkid:[],//需要重新执行的的标签项
      tableHeight: document.body.clientHeight - 490, // 表格高度

      bqmc:'',
      // dmJhztArray:[],
      dmJhzt:'',
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
    commonService.commonCombobox('JHZT').then(res => {
      if (res.code === '600') {
        this.setState({
          dmJhztArray: res.data
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
      dmJhzt:'',
      dmZcyy:'',
      sjq:defaultStartValue,
      sjz:defaultEndValue,
      startValue:moment(defaultStartValue, 'YYYY-MM-DD'),
      endValue:moment(defaultEndValue, 'YYYY-MM-DD'),
      selectedRowKeys:[],//标签表格勾选项key
      jhjkid:[],//需要重新聚合的标签项
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
    // console.log("表格查询")
    const {pageIndex,pageSize,bqmc,dmJhzt,dmZcyy,sjq,sjz}=this.state
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
          type: 'taskMonitoring/queryLabelList', params: {
            bqmc,
            dmJhzt,
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
   * @method: reExcute
   * @description: 选择重新聚合，选择某一行时，record为当前行，多选后点击按钮，record为undefined
   * @param {type} record
   * @return:
   */
  reExcute=(record)=>{
    //标签表格选择项-需要重新聚合的标签项
    let labels=this.state.selectedRowKeys;
    if(record && record.jhjkid){
      labels=[];
      labels.push(record.jhjkid)
    }
    if(labels.length===0){
      message.info('请勾选需要重新聚合的标签')
      return;
    }
    this.setState({
      jhjkid:[...labels]
    },()=>{
        taskMonitoringQuery.reRun({
        jhjkid:[...labels]
      }).then(res=>{
        if(res.code!=="600"){
          message.error('服务器错误，请联系管理员');
        }else{
          this.doSearch()
        }
      })
    })
    // this.setState({
    //   jhjkid:[...labels]
    // },()=>{
    //   this.doSearch();
    // })
  }

  render(){
    const {selectedRowKeys,startValue, endValue,defaultStartValue,defaultEndValue,bqmc,dmJhzt,dmZcyy,dmZcyyArray}=this.state;
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
            &nbsp;&nbsp;&nbsp;聚合状态&nbsp;&nbsp;
            <Select
              style={{ width: '376px' }}
              placeholder="请选择聚合状态"
              value={dmJhzt}
              onChange={(value)=>{
                // console.log("聚合状态",value)
                this.setState({
                  dmJhzt:value
                })
              }}
            >
              {/* {dmJhztArray && dmJhztArray.map(item=>{
                return (<Option key={item.dm} value={item.dm}>{item.mc}</Option>)
              })} */}
              <Option value="JHSB">聚合失败</Option>
              <Option value="JHCG">聚合成功</Option>
              <Option value="JHZ">聚合中</Option>
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
          聚合时间&nbsp;&nbsp;
          <DatePicker
            style={{ width: '143px' }}
            defaultValue={moment(defaultStartValue, 'YYYY-MM-DD')}
            defaultPickerValue={moment(defaultStartValue, 'YYYY-MM-DD')}
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
            defaultValue={moment(defaultEndValue, 'YYYY-MM-DD')}
            defaultPickerValue={moment(defaultEndValue, 'YYYY-MM-DD')}
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
        title: '加工时间',
        align: 'center',
        key: 'fxqj',
        dataIndex: 'fxqj',
        width:200
      },
      {
        title: '支撑应用',
        align: 'center',
        key: 'zcyymc',
        dataIndex: 'zcyymc',
        width: 200
      },
      {
        title: '聚合时间',
        align: 'center',
        dataIndex: 'jhsj',
        key: 'jhsj',
        width: 200
      },
      {
        title: '聚合状态',
        align: 'center',
        key: 'jhztmc',
        dataIndex: 'jhztmc',
        width:100,
        render: (text, record, index)=>
          record.jhztdm==='JHSB'?<a onClick = {()=>this.setState({errorMsg:record.sbyy,errorMsgVisible:true})}> {text} </a>:`${text}`
          // {
          //   switch(record.jhztdm){
          //     case 'CG':
          //       return (<span>聚合成功</span>);
          //     case 'SB':
          //       return (<a onClick = {()=>this.setState({errorMsg:record.sbyy,errorMsgVisible:true})}> 聚合失败 </a>);
          //     case 'JHZ':
          //       return (<span> 聚合中 </span>)
          //     default:
          //       return;
          //   }
          // }
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text,record,index) => (
          <span>
            <a onClick={()=>this.reExcute(record)}>重新聚合</a>
          </span>
        ),
        width:100
      },
    ];

    const content=
    <div className={styles.taskMonitoring}>
      <Table
        className='deepColorTableHeight'
        id = 'tableTaskMonitoring'
        rowSelection={{
          selectedRowKeys,
          onChange: this.onSelectChange
        }}
        bordered
        loading={this.state.loading}
        dataSource={this.props.labelList}
        columns={columns}
        rowKey='jhjkid'
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
      <Button type='primary' onClick={this.reExcute} style={{ position: 'absolute', bottom: 3, left: 0, zIndex: 1 }}>重新聚合</Button>
      <Modal
				title="失败原因"
				width={354}
				centered
				bodyStyle={{ minHeight: 'auto' }}
				visible={this.state.errorMsgVisible}
				onOk={() => this.setState({ errorMsgVisible: false })}
				onCancel={() => this.setState({ errorMsgVisible: false })}
				getContainer={document.getElementById('tableTaskMonitoring')}
			>{this.state.errorMsg}</Modal>
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
TaskMonitoring.propTypes = {
	total: PropTypes.number,
  labelList: PropTypes.array,
  time:PropTypes.object
}
function mapStateToProps(state) {
  const { total,labelList }=state.taskMonitoring;
  const { time }=state.common
  return {
    total,
    labelList,
    time
  }
}

export default connect(mapStateToProps)(TaskMonitoring);


