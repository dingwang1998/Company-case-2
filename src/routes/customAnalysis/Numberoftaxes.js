import React, { Component } from 'react'
import Styles from './Numberoftaxes.less'

import { Button ,Table } from 'antd'
import { reqLabelnextquery,reqTaxationqueryNext} from '../../services/customAnalysis/Labelapplication'

export default class Numberoftaxes extends Component {
    constructor(props){
        super(props)
        this.state = {
            pageIndex:1,
            pageSize:5,
            data:[],
            total:0
        }
    }
    componentDidMount(){
        setTimeout(()=>{
            this.getqueryList()
        },200)
    }
    componentWillReceiveProps(){
        this.getqueryList()
    }
    callback = ()=>{
        this.props.history.replace('/customAnalysisClassify/labelapplication')
    }
    getqueryList = async ()=>{
        this.setState({
            data:[],
            total:0
        })
        const params = JSON.parse(localStorage.getItem('searchItem'))
        params.pageIndex = this.state.pageIndex
        params.pageSize = this.state.pageSize
        // debugger;
        if(params.bqid){
            const result = await reqLabelnextquery(params)
            console.log(result)
            const data = result.data
            const total = result.total
            this.setState({
                data,
                total
            })
            localStorage.clear();
        }else if(params.swjgdm !== ''){

            params.aswjgdm = params.swjgdm
            delete params.swjgdm
            console.log(params)
            const result = await reqTaxationqueryNext(params)
            const data = result.data
            const total = result.total
            this.setState({
                data,
                total
            })
            localStorage.clear();
        }else{
            console.log('cuowu')
        }
    }


    render() {
        const {data} = this.state
        const columns = [
            {
                title:"序号",
                dataIndex:'xh',
                width:100,
                render: (text, record, index) => index + 1
            },
            {
                title:"税务机关名称",
                dataIndex:'swjgmc',
                width:300
            },
            {
                title:"命名纳税人户次",
                dataIndex:'nsrhc',
                width:300
            }
        ]
        return (
            <div className={Styles.numberofhits}>
                <div className = {Styles.numberofhitsHeader}>
                    <Button onClick={this.callback} onClick={this.callback}>返回</Button>
                </div>
                <div className={Styles.numberofhitsContent}>
                    <Table
                        className='deepColorTableHeight'
                        columns={columns}
                        dataSource={data}
                        pageIndex = {this.state.pageIndex}
                        pageSize = {this.state.pageSize}
                        bordered
                        size="small"
                        pagination={{
                            showSizeChanger: true,
                            total: this.state.total,
                            pageSizeOptions: ['5', '10', '20'],
                            showQuickJumper: true,
                            size: 'small',
                            showTotal: (total, range) => `当前第 ${range[0]} 到 ${range[1]} 条，共 ${total} 条`
                        }}
                        scroll={{ x: 'max-content', y: 490 }}
                    />
                </div>
            </div>
        )
    }
}
