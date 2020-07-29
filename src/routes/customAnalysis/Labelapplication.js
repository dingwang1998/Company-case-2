import React, { Component } from 'react'

import Styles from './Labelapplication.less'
import { Row, Col, Input ,Select ,DatePicker,Table,Modal, Button} from 'antd';
import SearchLayout from '../../components/common/SearchLayout/SearchLayout'

import {
    reqCommonSelect,
    reqSearchquery
} from '../../services/customAnalysis/Labelapplication'

import  moment from 'moment'
const { Option } = Select;
const startTime = moment(moment().year(moment().year()).startOf('year').valueOf())
const endTime = moment(moment().year(moment().year()).endOf('year').valueOf())

const dateFormat = 'YYYY-MM-DD';


export default class Labelapplication extends Component {
    constructor(props){
        super(props)
        this.state = {
            startTime,   
            endTime,
            pageIndex:1,
            pageSize:5,
            total:0,
            loading:false,
            tableData:[],
            tableHeight:document.body.clientHeight - 490,
            braceData:[],    //支撑应用
            zcyydm:""       //支撑应用代码
           
        }
    }
    // 初始化页面渲染支撑应用的下拉框
    async componentDidMount(){
        const result = await reqCommonSelect('ZCYY')
        let { braceData} = this.state
        braceData = result.data
        this.setState({
            braceData
        })
    }
    // 跳转到1 state里面toggleNumber对应的页面
    seeLabel1 =(record)=>{
        // console.log(record)
        // toggleNumber: ?  1 代表切换过去的钻取页面为按标签钻取对应的页面 2 代表切换过去的页面为按钻取 
        const { zcyydm } = this.state
        const query = {
            zcyydm:zcyydm,
            zqid:record.zqid,
            toggleNumber:1
        }
        this.props.history.push('/customAnalysisClassify/seelabel')
        // localStorage.setItem('record', JSON.stringify(record))
        localStorage.setItem('searchItem',JSON.stringify(query))
    }
    // 跳转到2 state里面toggleNumber对应的页面
    seeLabel2 = (record)=>{
        const { zcyydm } = this.state
        const query = {
            zcyydm:zcyydm,
            zqid:record.zqid,
            toggleNumber:2
        }
        this.props.history.push('/customAnalysisClassify/seelabel')
        // localStorage.setItem('record', JSON.stringify(record))
        localStorage.setItem('searchItem',JSON.stringify(query))
    }
    // 拿到支撑应用的名称对应的编号
    SelectChange = (value)=>{
        const { braceData} = this.state
        const cItem =  braceData.find(item=>item.mc === value)
        if(cItem){
            let zcyydm = cItem.dm
            console.log(zcyydm)
            this.setState({
                zcyydm
            })
        }
    }
    //点击查找进行相关操作
    SearchLabel = async ()=>{
        localStorage.clear();
        const { zcyydm,pageIndex,pageSize} = this.state
        const jgqjq = this.state.startTime
        const jgqjz = this.state.endTime
        const result = await reqSearchquery({ jgqjq, jgqjz, pageSize, pageIndex, zcyydm })
        // console.log(result)
        const tableData = result.data
        const total = result.data.length  
        this.setState({
            tableData,
            total
        })
    }

    render() {
        const { braceData } = this.state   
        let tagTop =<div className= {Styles.tagTop}>
            <Row>
                <Col span={12} className={Styles.tagTopLeft}>
                    <span>支撑应用</span>&nbsp;&nbsp;
                    <Select
                        showSearch
                        style={{ width: 376 }}
                        placeholder="提示语句"
                        optionFilterProp="children"
                        onChange = {this.SelectChange}
                    >
                        {
                            braceData.map((item,index)=>{
                                return(
                                    <Option value = {item.mc} key={index}>{item.mc}</Option>
                                )
                            })
                        }
                    </Select>
                </Col>
                <Col span={12} className={Styles.tagTopRight}>
                    <span>创建时间</span>&nbsp;&nbsp;
                    <DatePicker 
                        allowClear={false} 
                        style={{ width: '143px' }} 
                        value={this.state.startTime ? moment(this.state.startTime, dateFormat):null} 
                        onChange={(date, dateString) =>{
                            // moment(dateString, dateFormat)
                            this.setState({
                                startTime:dateString
                            })
                        }} 
                        placeholder='请选择开始日期' 
                    />&nbsp;-&nbsp;

                    <DatePicker 
                        allowClear={false} 
                        style={{ width: '143px' }} 
                        value={this.state.endTime ? moment(this.state.endTime) : null} 
                        onChange={
                            (date, dateString) => {
                                this.setState({ 
                                    endTime: dateString,
                                })
                            }}
                        placeholder='请选择结束日期' 
                    />
                </Col>
            </Row>
        </div>

        const columns = [
            {
                title: '序号',
                align: 'center',
                width: 50,
                dataIndex: 'xh',
                render: (text, record, index) => index + 1
            },
            {
                title: '应用名称',
                align: 'center',
                width: 50,
                dataIndex: 'zcyymc',
            },
            {
                title: '命中标签个数',
                align: 'center',
                width: 50,
                dataIndex: 'bqs',
                render: (text, record, index) => (<span style={{ color: '#1D76C4', cursor: 'pointer' }} onClick={this.seeLabel1.bind(this,record)}>{text}</span>)
            },
            {
                title: '税务机关个数',
                align: 'center',
                width: 50,
                dataIndex: 'swjgs',
                render: (text, record, index) => (<span style={{ color: '#1D76C4', cursor: 'pointer' }}  onClick={this.seeLabel2.bind(this,record)}>{text}</span>)
            },
            {
                title: '命中纳税人户次',
                align: 'center',
                width: 50,
                dataIndex: 'nsrhc',
            },
            {
                title: '加工期间',
                align: 'center',
                width: 100,
                dataIndex: 'jgqj'
            }
        ]
        const content = <div id="tableContent" style={{ width: '100%', height: '100%', position: 'relative'}}>
                    <Table
                        className='deepColorTableHeight'
                        dataSource={this.state.tableData}
                        columns={columns}
                        bordered
                        loading={this.state.loading}
                        rowKey="xh"
                        pagination={{
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '15', '20'],
                            showQuickJumper: true,
                            size: 'smanll',
                            showTotal: (total, range) => `当前第 ${range[0]} 到 ${range[1]} 条，共 ${total} 条`
                        }}
                        scroll={{ y: this.state.tableHeight, x: 'max-content'}}
                        size="small" 
                    />
                </div>
        let curConrnt = <SearchLayout
            tableTitle= "渠道服务情况"
            searchConds = {tagTop}
            tableContent ={content}
            doSearch = {this.SearchLabel}
        />

        return curConrnt
    }
}
