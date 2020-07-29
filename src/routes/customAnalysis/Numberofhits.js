import React, { Component } from 'react'
import Styles from './Numberofhits.less'

import {Button ,Table} from 'antd'

import { reqNextTotal } from '../../services/customAnalysis/Labelapplication'
import Item from 'antd/lib/list/Item'


export default class Numberofhits extends Component {
    constructor(props){
        super(props)
        this.state = {
            pageIndex:1,
            pageSize:5,
            data:[],
            total:0
        }
    }
    callback = ()=>{
        this.props.history.replace('/customAnalysisClassify/labelapplication')
    }

    componentDidMount(nextprops){
        setTimeout(()=>{
          this.getqueryList()
        },300)
    }
    getqueryList = async ()=>{
        const params = JSON.parse(localStorage.getItem('searchItem'))
        params.pageIndex = this.state.pageIndex
        params.pageSize = this.state.pageSize
        if(params.bqid){
            const result = await reqNextTotal(params)
            const total = result.total
            if(result.zbqList){
                result.bqzb = result.zbqList[0].bqz
            }
            let { data } = this.state
            data.push(result)
            this.setState({
              data,
              total
            })
            // console.log(data) 
        }
    }
    render() {
        const {data} = this.state
        const columns = [
            {  
                title: '基础信息',
                    children: [
                      {
                        title: '社会信用代码',
                        dataIndex: 'nsrsbh',
                        key: 'id',
                        width: 150,
                      },
                      {
                        title: '纳税人名称',
                        dataIndex: 'nsrmc',
                        key: 'id',
                        width: 150,
                      },
                      {
                        title: '主管税务机关',
                        dataIndex: 'swjgmc',
                        key: 'id',
                        width: 150,
                      }
                    ]
            },
            {  
                title: '标签名称',
                    children: [
                      {
                        title: '数据项A',
                        dataIndex: 'bqz',
                        key: 'id',
                        width: 150,
                      },
                      {
                        title: '数据项B',
                        dataIndex: 'bqzb',
                        key: 'id',
                        width: 150,
                      }
                    ]
            }            
        ]
        return (
            <div className={Styles.numberofhits}>
                <div className = {Styles.numberofhitsHeader}>
                    <Button onClick={this.callback}>返回</Button>
                </div>
                <div className={Styles.numberofhitsContent}>
                    <Table
                        className='deepColorTableHeight'
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        bordered
                        size="small"
                        scroll={{ x: 'max-content', y: 490 }}
                    />
                </div>
            </div>
        )
    }
}
