import React, { Component } from 'react'

import { Row, Col, Input ,Select ,DatePicker,Table,Modal, Button, message} from 'antd';

import Styles from './tagsSenior.less'

import EllipsisTooltip from '../../components/common/EllipsisTooltip';
import moment from 'moment';

// 框架抽离出来的icon
import IconFont from '@/components/common/iconFont/iconFont';

import SearchLayout from '../../components/common/SearchLayout/SearchLayout'

import { reqTagsList,
         reqUpdataZT,
         reqSaveData,
         reqGetsql,
         reqDeleteList
} 
from '../../services/tagsDefined/tagsSenior.js'


const { Option } = Select;
const { confirm } = Modal;

const startTime = moment(moment().year(moment().year()).startOf('year').valueOf());
const endTime = moment(moment().year(moment().year()).endOf('year').valueOf())


class TagsSenior extends Component {
    constructor(props){
        super(props)
        this.state= {
            startTime,
            endTime,
            loading:false,
            tableHeight: document.body.clientHeight - 490, //表格高度
            tableData: [], // 表格数据
            total: 0,
            pageIndex: 1, // 表格分页页码，从1开始
            pageSize: 5, // 表格分页每页条数,
            visible:false, //修改模态框,
            record:{},   //表格单行拿到的对象
            fwmc:'',    // 服务名称用于查询
            qyzt:'',    // 启用状态用于查询
            ListSql:{}  //单行数据对应的sql
        }
    }
    componentDidMount(){
        const {pageIndex, pageSize} = this.state
        this.getTaglist({pageIndex,pageSize})
    }
    // 请求表格数据
    getTaglist = async ({pageIndex,pageSize})=>{
        const result =  await reqTagsList({pageIndex,pageSize})
        const tableData = result.data
        this.setState({
          tableData
        })
    }
    // 控制表格的启用和停用服务
    postList = async (record)=>{
        // 改变状态
        const fwbh = record.fwbh
        let sfqy = record.qyztDm === 'Y' ? 'N' : 'Y'
        const result = await reqUpdataZT({fwbh,sfqy})
        console.log(result)
    }
    // 跳转到新增页面
    addList =()=>{
      this.props.history.replace('/labelManagementClassify/tagssenior1')
    }
    // 点击删除,删除表格里面的其中一项
    DeleteItem = (record)=>{
      console.log(record)
      const { fwbh } = record
      confirm({
        title: '确认要删除此项吗?',
        icon: <IconFont type="svy-fxicon-tishi" style={{ fontSize: '24px', color: '#FF7E6E' }} />,
        content: '删除后将无法恢复',
        onOk: async ()=>{
          console.log('ok')
           const result = await reqDeleteList(fwbh)
           if(result.code === '600')
           {
             message.success('删除成功')
             const {pageIndex, pageSize} = this.state
             this.getTaglist({pageIndex,pageSize})
           }else{
             message.error('删除失败')
           }
        },
        onCancel:()=> {
          console.log('Cancel');
        },
      })
    }
    // 点击修改跳出模态框
    putItem = async (record)=>{
      // 请求该标签对应的sql,然后保存
      const {fwbh} = record
      const result = await reqGetsql(fwbh)
      const ListSql = result.data
      this.setState({
        ListSql
      })
      console.log(result)
      console.log(fwbh)
      reqGetsql
      this.setState({
        visible: true,
        record
      })
    }
    // 点击查询按钮渲染表格
    Searchtag = async ()=>{
      const {pageIndex, pageSize,fwmc,qyzt} = this.state
      if(fwmc === '' || qyzt === '')
      {
          message.error('请输入服务名称和状态')
      }else{
          const result = await reqTagsList({pageIndex,pageSize,fwmc,qyzt})
          console.log('查询成功')
      }
    }
    // 模态框点击确定就行修改
    handleOk = async () => {
      const {ListSql,record} = this.state
      // 此处因为后端接口名称对不上，在sql里面拿到的超时时间为cssz
      const scsz = ListSql.cssz
      const kj = ListSql.kj
      
      const {fwmc, bfl, fwbh} = record

      const result = await reqSaveData({scsz, fwmc, bfl, fwbh,kj})
      if(result.code === '600')
      {
        this.getTaglist({pageIndex:1,pageSize:5})
        console.log('修改成功')
      }
      this.setState({
        visible: false,
      })
    }
    // 模态框点击取消 
    handleCancel = () => {
      console.log('Clicked cancel button');
      this.setState({
        visible: false,
      });
    };
    render() {
        // 顶部区域
        const tagTop = <div>
            <Row>
                <Col span={8} className={Styles.tagTopCol}>
                    <span className={Styles.tagTitle}>标签服务名称</span>
                    <Input style={{width:'256px'}} onChange={(e)=>{
                       const fwmc = e.target.value
                       this.setState({
                            fwmc
                       })
                    }}></Input>
                </Col>
                <Col span={8} className={Styles.tagTopCol}>
                    <span className={Styles.tagTitle}>状态</span>
                    <Select
                        showSearch
                        style={{ width: 256 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange= {(value)=>{this.setState({qyzt:value})}}
                        >
                        <Option value="Y">启用</Option>
                        <Option value="N">停用</Option>
                    </Select>
                </Col>
                <Col span={8} className={Styles.tagTopCol}>
                    <span className={Styles.tagTitle}>创建时间</span>
                    <DatePicker allowClear={false} style={{ width: '143px' }} value={this.state.startTime} onChange={(date, dateString) => this.setState({ startTime: date, cjsjq: dateString })} placeholder='请选择开始日期' />&nbsp;-&nbsp;
                    <DatePicker allowClear={false} style={{ width: '143px' }} value={this.state.endTime} onChange={(date, dateString) => this.setState({ endTime: date, cjsjz: dateString })} placeholder='请选择结束日期' />
                </Col>
            </Row>
        </div>
        // 表格渲染区域
        // 表格属性配置
        const columns = [
            {
              title: '序号',
              align: 'center',
              width: 50,
              dataIndex: 'fwbh',
              render: (text, record, index) => index + 1
            },
            {
              title: '标签服务名称',
                      dataIndex: 'fwmc',
                      width:150,
              align:'center',
              render: (text, record, index) => (<span style={{ color: '#1D76C4', cursor: 'pointer' }}>{text}</span>)
            },
            {
              title: '创建税务机关',
              dataIndex: 'cjjgMc',
              align: 'center',
              width: 120,
            },
            {
              title: '创建人',
              dataIndex: 'cjryMc',
              align: 'center',
              width: 80,
            },
            {
              title: '创建时间',
              dataIndex: 'cjsj',
              align: 'center',
              width: 100,
            },
            {
              title: '并发量',
              dataIndex: 'bfl',
              align: 'center',
              width: 120,
            },
            {
              title: '超时限制',
              dataIndex: 'cssz',
              align: 'center',
                      width: 200,
                      render:text=> <EllipsisTooltip title={text}> {text} </EllipsisTooltip>
            },
            {
              title: '状态',
              dataIndex: 'qyztMc',
              align: 'center',
              width: 120,
            },
            {
              title: '操作',
              align: 'center',
              render: (text, record, index) =>
                <div>
                  <Button type="link" disabled={record.qyztDm === 'N'} onClick={()=>{this.putItem(record)}}
                  >修改
                  </Button>
                  <Button type="link"  onClick={()=>{this.DeleteItem(record)}}>删除</Button>
                  {record.qyztDm === 'N' ? (<Button type="link" onClick = {(record)=>{this.postList(record)}}>启用</Button>) : (<Button type="link" onClick = {this.postList.bind(this,record)}>停用</Button>)}
                </div>                         
            }
        ];
        // 表格主体结构
        const content = <div id="tableContent" style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Table
                        className='deepColorTableHeight'
                        dataSource={this.state.tableData}
                        columns={columns}
                        bordered
                        loading={this.state.loading}
                        rowKey='fwbh'
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
                        <Button style={{marginTop:'10px'}} type="primary" onClick={this.addList}>新增</Button>
                        {/* 修改modal */}
                        <div>
                            <Modal
                              title="修改"
                              visible={this.state.visible}
                              onOk={this.handleOk}
                              onCancel={this.handleCancel}
                            >
                              <div>
                                <span>标签服务名称</span>
                                <Input defaultValue={this.state.record.fwmc}  onChange={(e)=>{this.state.record.fwmc=e.target.value}}></Input>
                              </div>
                              <div>
                                <span>并发量</span>
                                <Input defaultValue={this.state.record.bfl} onChange={(e)=>{this.state.record.bfl=e.target.value}}></Input>
                              </div>
                              <div>
                                <span>超时时间</span>
                                <Input defaultValue={this.state.record.cssj} onChange={(e)=>{this.state.record.cssj=e.target.value}}></Input>
                              </div>
                            </Modal>
                        </div>
                    </div>
        //调用searchlayout区域 
        let curContent = 
        <SearchLayout
            tableTitle ="标签列表"
            searchConds = {tagTop}
            tableContent ={content}
            doSearch = {this.Searchtag}
        />;
        
        return curContent
    }

}

export default TagsSenior
