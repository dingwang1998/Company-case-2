import React, { Component, cloneElement } from 'react'
import { Row, Col, Input ,Select ,DatePicker,Table,Modal, Button,message} from 'antd';
import moment from 'moment';
import _ from 'lodash'

import SearchLayout from '../../components/common/SearchLayout/SearchLayout'
import Styles from  './channel.less'

import { 
    reqChinnel,
    Auth,reqCancelAuth,
    reqDetelelist,
    reqTreeList,
    reqTreeNodeList,
    reqAddlist,
    reqUpdataList      
} from '../../services/customAnalysis/channel'

const startTime = moment(moment().year(moment().year()).startOf('year').valueOf())
const endTime = moment(moment().year(moment().year()).endOf('year').valueOf())
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

class Channel extends Component {
    constructor(props){
        super(props)
        this.state = {
            startTime,
            endTime,
            tableData:[],
            loading:false,
            total:0,
            pageIndex:1,
            pageSize:25,
            tableHeight:document.body.clientHeight - 490,
            visible:0,    //服用修改和添加的模态框 1代表添加 2代表修改
            tree:[],      //添加模态框的tree组件对应的接入系统数据
            bqmc:'',      //用于查询标签服务名称
            dmSqzt:'',    //授权状态
            cjsjq:'',     //创建起始时间
            cjsjz:'',     //创建时间止
            jrxt:'',      //接入系统编号
            treeData:[],  //用于存添加模态框的标签服务名称和接入系统编号
            ModalData:[],  //模态框的表格数据
            Selectchange: true, //监听select的change事件(这里主要是想监听onchang的第二次然后处理事件)
            Selectedstatus:false  //监听select的禁用与否
        }
    }
    async componentDidMount(){
        // 进来首先拿到tree的十条数据
        const result = await reqTreeList()
        let tree = []
        for(var i = 0; i < 10; i++){
            tree.push(result.data[i])
        }
        this.setState({
            tree
        })
    }
    //查询表格所有数据
    getServiceList = async ({ bqmc, dmSqzt, jrxt,cjsjq,cjsjz})=>{
        const result = await reqChinnel({ bqmc, dmSqzt, jrxt,cjsjq,cjsjz})
        if(result.code === '600'){
            const {data, total} = result
            this.setState({
                tableData:data,
                total
            })
        }
    }
    // 点击查询进行数据渲染
    SearchList = ()=>{
        console.log(123)
        const cjsjq = this.state.startTime
        const cjsjz = this.state.endTime
        const { bqmc, dmSqzt, jrxt} = this.state
        const result =  this.getServiceList({ bqmc, dmSqzt, jrxt,cjsjq,cjsjz})
        console.log(result)
    }
    // 控制新增模态框
    showModal = () => {
        this.setState({
          visible: 1,
          Selectedstatus:false
        });
    };
    // 新增板块模态框确认
    handleOk = async e =>{
       const { ModalData, jrxt } = this.state
       //console.log(ModalData, jrxt)
       if(jrxt){
            let bqxx = JSON.parse(JSON.stringify(ModalData).replace(/dm/g,"fwbh"))
            const result = await reqAddlist({bqxx,jrxt})
            if(result.code === '600')
            {
                message.success('添加成功')
                //刷新查询列表?????
                this.setState({
                    visible: 0,
                    ModalData:[],
                    jrxt:'',
                    tree:[],
                    treeData:[]
                })
            }else{
                message.error('添加失败')
            }
       }else{
            const {squuid,yxqq,yxqz} = ModalData
            const result = await reqUpdataList({squuid,yxqq,yxqz})
            // console.log(result)
            if(result.code === '600'){
                message.success('修改成功')
                this.setState({
                    visible: 0,
                    ModalData:[]
                })
            }
       }
    }
    // 新增板块模态框取消  
    handleCancel = e => {
        const {ModalData} = this.state
        console.log(e);
        this.setState({
          visible: 0,
          ModalData:[]
        });
    }
    // 授权
    authHandle = async (record)=>{
        const { squuid } = record
        const result =  await Auth(squuid)
        console.log(result)
        if(result.code === '600'){
            message.success('授权成功')
        }

    }
    // 取消授权
    cancelauth = async (record)=>{
        const { squuid } = record
        const result = await reqCancelAuth(squuid)
        // console.log(result)
        if(result.code === '600'){
            message.success('已取消授权')
        }
    }
    // 删除标签
    deteleList = async (record)=>{
        const { squuid } = record
        const result = await reqDetelelist(squuid)
        // console.log(result)
        if(result.code === '600'){
            message.success('删除成功')
        }
    }
    // 修改表格数据
    putlist = (record)=>{
        const { ModalData } = this.state
        const data = JSON.parse(JSON.stringify(record).replace(/fwmc/g, 'mc'))
        data.key = 1
        ModalData.push(data)
        this.setState({
            visible: 2,
            Selectedstatus:true,
            ModalData
        })
    }
    // 通过接入系统的下拉框去渲染标签服务名称的数据
    treeChangehandle = async (value)=>{
        if(this.state.Selectchange){
            const result = await reqTreeNodeList(value)
            // 通过接入系统请求的dm,mc对应fwbh和标签服务名称
            // console.log(value)
            if(result.code === '600'){
                const data = result.data
                this.setState({
                    treeData:data,
                    jrxt:value,
                    Selectchange:false
                })
            }
        }else{
            let { ModalData } = this.state
            ModalData = null
            this.setState({
                ModalData,
                jrxt:value
            })
        }
    }
    // 模态框服务标签名称的渲染
    fwmcHandleChange = (value)=>{
        let index = 1
        let { treeData, ModalData} = this.state
        const cItem = treeData.find(item=>item.mc === value)
        cItem.key = index++
        // console.log(cItem)
        ModalData.push(cItem)
        this.setState({
            ModalData
        })
    }
    // 给模态框的每条数据加起始时间
    editRow(key, value) {
		let { ModalData } = this.state;
		this.setState({
			ModalData: ModalData.map(item => {
				if (item.key === key) {
					item.yxqq = value;
				}
				return item
			})
        })
    }
    // 给模态框的每条数据加结束时间
    editRow1(key, value) {
		let { ModalData } = this.state;
		this.setState({
			ModalData: ModalData.map(item => {
				if (item.key === key) {
					item.yxqz = value;
				}
				return item
			})
        })
    }
    render() {
        const tagTop = <div className={Styles.InputList}>
            <Row className={Styles.InputListItem}>
                <Col span={12} className={Styles.ItemLeft}>
                    <span>标签服务名称</span>
                    <Input style={{width:'376px'}} placeholder="提示语句"
                        onChange = {(e)=>{
                            const value = e.target.value
                            this.setState({
                                bqmc:value
                            })
                        }}
                    ></Input>
                </Col>
                <Col span={12} className={Styles.ItemRight}>
                    <span>接入系统</span>
                    <Input style={{width:"376px"}} placeholder="提示语句"
                        onChange = {(e)=>{
                            const value = e.target.value
                            this.setState({
                                jrxt:value
                            })
                        }}
                    ></Input>
                </Col>
            </Row>
            <Row className={Styles.InputListItem} style={{marginBottom:'0'}}>
                <Col span={12} className={Styles.ItemLeft}>
                    <span className={Styles.shouquan}>授权状态</span>
                    <Select
                        showSearch
                        style={{ width: 376 }}
                        placeholder="提示语句"
                        optionFilterProp="children"
                        onChange = {(value)=>{
                            this.setState({
                                dmSqzt:value
                            })
                        }}
                    
                    >
                        <Option value="启用">启用</Option>
                        <Option value="停用">停用</Option>      
                    </Select>
                </Col>
                <Col span={12} className={Styles.ItemRight}>
                    <span>创建时间</span>
                    <DatePicker allowClear={false} style={{ width: '143px' }} value={this.state.startTime} onChange={(date, dateString) => this.setState({ startTime: date, cjsjq: dateString })} placeholder='请选择开始日期' />&nbsp;-&nbsp;
                    <DatePicker allowClear={false} style={{ width: '143px' }} value={this.state.endTime} onChange={(date, dateString) => this.setState({ endTime: date, cjsjz: dateString })} placeholder='请选择结束日期' />
                </Col>
            </Row>
        </div>

        // 页面中的表格规则
        const columns = [
            {
            title: '序号',
            align: 'center',
            dataIndex: 'xh',
            width:50,
            render: (text, record, index) => index + 1
            },
            {
            title: '标签服务名称',
            dataIndex: 'fwmc',
            align:'center',
            width:110,
            render: (text, record, index) => (<span style={{ color: '#1D76C4', cursor: 'pointer' }}>{text}</span>)
            },
            {
            title: '系统IP',
            dataIndex: 'xtip',
            align: 'center',
            width:60
            },
            {
            title: '接入系统',
            dataIndex: 'qdmc',
            align: 'center',
            width:80
            },
            {
            title: '所属厂商',
            dataIndex: 'csmc',
            align: 'center',
            width:80,
            },
            {
            title: '最大并发量',
            dataIndex: 'bfl',
            align: 'center',
            width:110,
            },
            {
            title: '服务有效期起',
            dataIndex:'yxqq',
            align: 'center',
            width:110,
            },
            {
            title: '服务有限期止',
            dataIndex:'yxqz',
            align: 'center',
            width:110,
            },
            {
                title: '创建时间',
                dataIndex: 'cjsj',
                align: 'center',
                width:80
            },
            {
                title: '授权状态',
                dataIndex: 'sqztmc',
                align: 'center',
                width:80,
            },
            {
                title: '操作',
                align: 'center',
                dataIndex:'sqzt',
                width:200,
                render: (text, record, index) =>
                  <div>
                    <Button type="link" style={{padding:'0',marginRight:"5px"}} onClick={()=>{this.putlist(record)}}>修改</Button>
                    <Button type="link" style={{padding:'0',marginRight:"5px"}} onClick = {()=>{this.deteleList(record)}}>删除</Button>
                    <Button type="link" style={{padding:'0',marginRight:"5px"}} onClick = {()=>{this.authHandle(record)}}>授权</Button>
                    <Button type="link" style={{padding:'0'}} onClick={()=>{this.cancelauth(record)}}>取消授权</Button>
                  </div>                         
            }
        ]
        const Modalcolumns = [
            {
                title: '序号',
                align:'center',
                dataIndex: 'key'
            },
            {
                title: '标签名称',
                dataIndex: 'mc',
                align:'center'
            },
            {
                title: '服务有效期起',
                align:'center',
                dataIndex:'yxqq',
				render: (text, record, index) => {
					return (
						<DatePicker 
						allowClear={false}
						onChange={(value, dateString) => { this.editRow.bind(this, record.key, dateString)() }} 
						value={record.yxqq ? moment(record.yxqq, dateFormat) : null} />
					)
				}
            },
            {
                title: '服务有效期止',
                align:'center',
                dataIndex:'yxqz',
                render: (text, record, index) => {
					return (
						<DatePicker 
						allowClear={false}
						onChange={(value, dateString) => { this.editRow1.bind(this, record.key, dateString)() }} 
						value={record.yxqz ? moment(record.yxqz, dateFormat) : null} />
					)
				}
            }
        ]
        const content = <div id="tableContent" style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <Table
                    className='deepColorTableHeight'
                    dataSource={this.state.tableData}
                    columns={columns}
                    bordered
                    loading={this.state.loading}
                    rowKey = "squuid"
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
                    <Button type="primary" style={{marginTop:"15px"}} onClick={this.showModal}>新增</Button>

                    {/* 添加模态框 */}
                    <div>
                        <Modal
                        title= {this.state.visible === 1 ? '添加服务':'修改服务'}
                        visible={this.state.visible !== 0}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={700}
                        rowKey="key"
                        >
                        <div className={Styles.modalHeader}>
                                <div className={Styles.HeaderLeft}>
                                    <span>接入系统</span> &nbsp;
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="提示语句"
                                        optionFilterProp="children"
                                        allowClear
                                        onChange = {this.treeChangehandle}
                                        disabled = {this.state.Selectedstatus}
                                    >
                                        {
                                            this.state.tree.map((item,index)=>{
                                                return (
                                                <Option value = {item.wdz} key={index}>{item.wdz}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                                <div className={Styles.HeaderRight}>
                                    <span>标签服务名称</span> &nbsp;
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="提示语句"
                                        optionFilterProp="children"
                                        onChange = {this.fwmcHandleChange}
                                        disabled = {this.state.Selectedstatus}
                                    > 
                                        {
                                            this.state.treeData.map((item,index)=>{
                                                return (
                                                    <Option value = {item.mc} key={index}>{item.mc}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                        </div>
                        <div className={Styles.modalContent}>
                            <Table 
                                columns={Modalcolumns}
                                className={Styles.related}
                                bordered
                                size="small"
                                dataSource={this.state.ModalData}
                                pagination ={false}
                                rowKey="mc"
                            />
                        </div>
                        </Modal>
                    </div>
                </div>
        
        let curConrnt = <SearchLayout
                         tableTitle= "渠道服务情况"
                         searchConds = {tagTop}
                         tableContent ={content}
                         doSearch = {this.SearchList}
        />
        return curConrnt
    }
}

export default Channel
