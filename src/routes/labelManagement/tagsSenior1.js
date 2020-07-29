import React, { Component } from 'react'
import SqlDefined from '../../components/tagsDefined/tagsDefined/SqlDefined/SqlDefined';
import Styles from './tagsSenior1.less'

import { compareSql, reqSaveData } from '../../services/tagsDefined/tagsSenior'

import {Input,Select,Button } from 'antd'
const { Option } = Select;


export class TagsSenios1 extends Component {
    state = {
        scsz: 0,   //超时时间
        fwmc:'',   //服务名称
        bfl:0 ,    //并发量
        kj:''      //sql
    }
    // 保存并返回table页面，进行数据更新
    saveList = async ()=>{
        const {scsz, fwmc, bfl, kj} = this.state
        const result = await reqSaveData({scsz, fwmc, bfl, kj})
        if(result.code === '600'){
            this.props.history.replace('/labelManagementClassify/tagssenior')
        }
    }
    render() {
        return (
            <div className={Styles.TagsSenios1}>
                <div className={Styles.tagHeader}>
                    <p>基本信息</p>
                    <div className={Styles.tagHeaderContent}>
                        标签服务名称 &nbsp; &nbsp;
                        <Input style={{width:'27.5%'}} onChange = {(e)=>{
                            const value = e.target.value
                            this.setState({
                                fwmc:value
                            })
                        }}></Input>
                    </div>
                </div>
                <div className={Styles.tagContent}>
                    <SqlDefined onRef={this.onRefSqlDefined.bind(this)}></SqlDefined>
                </div>
                <div className= {Styles.tagFooter}>
                    <p>标签服务参数</p>
                    <div className={Styles.Content}>
                        <div className={Styles.ContentLeft}>
                            <span>并发量</span>&nbsp;
                            <Input style={{width:'376px'}}></Input>
                        </div>
                        <div className={Styles.ContentRight}>
                            <span>超时限制</span>&nbsp;
                            <Select
                                style={{width:'376px'}}
                                onChange = {(value)=>{this.setState({scsz:value})}}
                            >
                                <Option value="10">10s</Option>
                                <Option value="20">20s</Option>
                                <Option value="30">30s</Option> 
                            </Select>
                        </div>
                    </div>                  
                </div>
                <div className={Styles.save}>
                    <Button type="primary" onClick={this.saveList}>保存</Button>
                    <Button>重置</Button>
                </div>
            </div>
        )
    }
}

export default TagsSenios1
