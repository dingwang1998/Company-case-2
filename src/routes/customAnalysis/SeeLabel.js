import React, { Component } from 'react'

import {Input, Button, Table} from 'antd'

import Styles from './SeeLabel.less'

import { reqLabelquery, reqTaxationquery } from '../../services/customAnalysis/Labelapplication'

export default class SeeLabel extends Component {
    constructor(props){
        super(props)
        this.state = {
            tableData:[],       //表格数据
            loading:false,
            total:0,
            pageIndex:1,
            pageSize:5,
            tableHeight:document.body.clientHeight -490,
            bqmc:''             //查询的标签名称
        }
    }

    componentWillMount(){
        setTimeout(()=>{
            const { bqmc } = this.state
            this.getqueryList(bqmc)
        },200)
    }
    componentWillReceiveProps(){
        const { bqmc } = this.state
        this.getqueryList(bqmc)
    }
    //获取页面
    getqueryList = async (bqmc)=>{
        const params = JSON.parse(localStorage.getItem('searchItem'))
        params.pageIndex = this.state.pageIndex
        params.pageSize = this.state.pageSize
        params.bqmc = bqmc
        // 存储toggleNumber 来控制命中问题的禁用
        this.toggleNumber = params.toggleNumber
        if(params.toggleNumber === 1 ){
            const result = await reqLabelquery(params)
            let { tableData } = this.state
            // console.log(result.data)
            tableData = result.data
            this.setState({
                tableData
            })
        }else if( params.toggleNumber === 2 ){
            const result = await reqTaxationquery(params)
            let { tableData } = this.state
            tableData = result.data
            this.setState({
                tableData
            })
        }
    }
    //查询
    searchName = ()=>{
        const { bqmc } = this.state
        this.getqueryList(bqmc)
    }
    // 去往命名总数界面
    seeNumbero = (record)=>{
        // 分别判断存储bqid 或者swjgdm
        // console.log(record)
        if(record.bqid){
            const params = JSON.parse(localStorage.getItem('searchItem'))
            params.bqid = record.bqid
            localStorage.setItem('searchItem', JSON.stringify(params))
        }else{
            const params = JSON.parse(localStorage.getItem('searchItem'))
            params.swjgdm = record.swjgdm
            localStorage.setItem('searchItem', JSON.stringify(params))
        }
        this.props.history.replace('/customAnalysisClassify/numberofhits')
    }
    // 去往机关个数界面
    seeNumbero1 = (record)=>{
        if(record.bqid){
            const params = JSON.parse(localStorage.getItem('searchItem'))
            params.bqid = record.bqid
            localStorage.setItem('searchItem', JSON.stringify(params))
        }else{
            const params = JSON.parse(localStorage.getItem('searchItem'))
            params.swjgdm = record.swjgdm
            localStorage.setItem('searchItem', JSON.stringify(params))
        }
        this.props.history.replace('/customAnalysisClassify/numberoftaxes')  
    }
    render() {
        const columns = [
            {
                title: '序号',
                align: 'center',
                width: 60,
                dataIndex: 'xh',
                render: (text, record, index) => index + 1
            },
            {
                title: '标签名称',
                align: 'center',
                width: 50,
                render:(record)=> <div>
                    {record.bqmc ? <span>{record.bqmc}</span>: <span>{record.swjgmc}</span>}
                </div>
            },
            {
                title: '税务机关个数',
                align: 'center',
                width: 70,
                dataIndex: 'swjgs', 
                render: (text, record, index) => <div>
                    {record.swjgs ?
                    <Button 
                    type="link" 
                    style={{ color: '#1D76C4', cursor: 'pointer'}}  
                    onClick={()=>{
                        this.seeNumbero1(record)
                    }}>{text}</Button>:
                    <Button 
                    type="link" 
                    style={{ color: '#1D76C4', cursor: 'pointer'}}  
                    onClick={()=>{
                        this.seeNumbero1(record)
                    }}>{record.bqs}</Button>
                    }
                </div>
            },
            {
                title: '加工期间',
                align: 'center',
                width: 50,
                dataIndex: 'jgqj'
            },
            {
                title: '命中问题总数',
                align: 'center',
                width: 80,
                dataIndex: 'nsrhc',
                render: (text, record, index) => (
                <Button type="link" 
                style={{ color: '#1D76C4', cursor: 'pointer' }}
                disabled = {this.toggleNumber === 2 ? true:false} 
                onClick={()=>{
                    this.seeNumbero(record)
                }}>{text}
                </Button>)
            }
        ]
        return (
            <div className = {Styles.label}>
                <div className = {Styles.labelHeader}>
                    <div className = {Styles.labelLfet}>
                        <span>标签名称</span>&nbsp;&nbsp;
                        <Input placeholder="提示语句" style={{width:'376px'}} onChange={(e)=>{
                            const value = e.target.value
                            this.setState({
                                bqmc:value
                            })
                        }}></Input>
                    </div>
                    <div className={Styles.labelRight}>
                        <Button type="primary" style={{marginRight:'40px'}} onClick ={this.searchName}>查询</Button>
                        <Button>重置</Button>
                    </div>
                </div>
                <div className = {Styles.labelContent}>
                    <Table
                        className='deepColorTableHeight'
                        dataSource={this.state.tableData}
                        columns={columns}
                        bordered
                        loading={this.state.loading}
                        rowKey='xh'
                        pagination={{
                            showSizeChanger: true,
                            total: this.state.total,
                            pageSizeOptions: ['5', '10', '20'],
                            showQuickJumper: true,
                            size: 'small',
                            showTotal: (total, range) => `当前第 ${range[0]} 到 ${range[1]} 条，共 ${total} 条`
                        }}
                        scroll={{ y: 300, x: 'max-content'}}
                        size="small" 
                    />
                </div>
            </div>
        )
    }
}
