import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table, Button, Row, Col } from 'antd';
import styles from './labelView.less';


class LabelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // JC:基础标签  GZ:规则标签  SQL:sql标签
      bqdylx: '',
      // 基础信息
      baseInfo: {
				name: '',
				dmBqlx:'',
        sydxMc: '',
        bqmlMc: '',
        cjjgMc: '',
        cjryMc: '',
        syswjgVo: '',
				bqsm: '',
      },
      // 标签定义表格数据
      bqdy: [],
      // 计算公式（规则标签需要用）
      bqdyZw : '',
      // 加工约定表格数据
      jgydList: [],
    };
    this.baseInfoTitleMap = {
      name: '标签名称',
      dmBqlx: '标签类型',
      sydxMc: '适用对象',
      bqmlMc: '标签目录',
      cjjgMc: '创建机关',
      cjryMc: '创建人员',
      syswjgVo: '使用机关',
      bqsm: '标签说明'
    };
    this.jgydColumns = [
      {
        title: '序号',
        align: 'center',
        width: 50,
        dataIndex: 'xh',
        key: 'xh',
        render: (text, record, index) => index + 1
      },
      {
        title: '分析期间粒度',
        dataIndex: 'dmFxqjldZq',
        key: 'dmFxqjldZq',
        align: 'center',
				width: 120,
				render: (text, record, index) => {
				const {bqdylx} = this.state;
					return	<span> {bqdylx==='SQL'?record.dmFxqjldZqMc:record.dmFxqjldZq}、{bqdylx==='SQL'?record.dmFxqjldSqMc:record.dmFxqjldSq}</span>
				}
      },
      {
        title: '加工范围起始',
        dataIndex: 'jgfwqs',
        key: 'jgfwqs',
        align: 'center',
        width: 120
      }
    ];
    // 根据标签定义类型选择不同的渲染列
    this.colMap = {
      'JC': [
        {
          title: '数据表名称',
          dataIndex: 'ysjb',
          key: 'ysjb',
          align: 'center',
          width: 120
        },
        {
          title: '中文列名',
          align: 'center',
          dataIndex: 'ysjzdZw',
          key: 'ysjzdZw',
        },
        {
          title: '英文列名',
          align: 'center',
          dataIndex: 'ysjzdYw',
          key: 'ysjzdYw',
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'lx',
          key: 'lx',
        },
        {
          title: '可空',
          dataIndex: 'kk',
          key: 'kk',
          align: 'center',
        },
        {
          title: '描述',
          align: 'center',
          dataIndex: 'ms',
          key: 'ms',
        }
      ],
      'GZ': [
        {
          title: '基础标签名称',
          align: 'center',
          dataIndex: 'jcbqmc',
          key: 'jcbqmc',
        },
        {
          title: '适用对象',
          align: 'center',
          dataIndex: 'sydxmc',
          key: 'sydxmc',
        },
        {
          title: '创建机关',
          align: 'center',
          dataIndex: 'cjjgmc',
          key: 'cjjgmc',
        }
      ]
		};
		this.lxMap = {
			JC:'基础标签',
			GZ:'规则标签',
			SQL:'SQL标签'
		}
    this.queryLabelDetail();
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

  queryLabelDetail() {
    const {label,dispatch} = this.props;
    const urlMap = {
      'JC': 'viewJcLabel', // bqdylx=JC : 基础标签
      'GZ': 'viewGzLabel', // bqdylx==GZ : 规则标签
      'SQL': 'viewSqlLabel' // bqdylx=SQL : sql标签
    }
    dispatch({type: `labelManagement/${urlMap[label.bqdylx]}`, bqdm: label.bqdm}).then(res => {
      if(res.code === '600') {
        const data = res.data;
				const {name,sydxMc,bqmlMc,cjjgMc,cjryMc,bqsm,jgydList,bqdySql,bqdyZw } = data;
				const dmBqlx = this.lxMap[data.dmBqlx],
				syswjgVo = data.syswjgVo.map(item=>item.swjgmc).join(',');
				const bqdylx = label.bqdylx;
				let bqdy  = data.bqdy;
        let baseInfo = {};
        jgydList && jgydList.forEach((item,i) => item.key = 'jg'+i);
        if(bqdylx=== 'SQL') { // 如果是sql标签的话需要多显示一项「标签类型」
          baseInfo = { name,dmBqlx,sydxMc,bqmlMc,cjjgMc,cjryMc,syswjgVo,bqsm };
          this.setState({ bqdylx, baseInfo, bqdySql, jgydList });
        }else {
					baseInfo = { name,sydxMc,bqmlMc,cjjgMc,cjryMc,syswjgVo,bqsm };
					if(bqdy && !bqdy.length){
						bqdy = [bqdy]
					}
					bqdy.forEach((item,i) => item.key = 'dy'+i);
          this.setState({ bqdylx, baseInfo, bqdy, jgydList, bqdyZw  });
        }
      }
    })
  }

  render() {
		const {baseInfo,bqdylx,bqdy,jgydList,bqdySql,bqdyZw } = this.state;
    return (
      <div className={styles.labelView}>
        {/* 基本信息 */}
        <p className={styles.title}>基本信息</p>
        <div className={styles.baseInfo}>
          <Row>
          {
            Object.keys(baseInfo).map(k => {
              if(k === 'bqsm') {
                return (
                  <Col key={k} span={24}>
                    <Row>
                      <Col span={2} style={{textAlign: 'right'}}>{this.baseInfoTitleMap[k]}：</Col>
                      <Col span={22}>{baseInfo[k]}</Col>
                    </Row>
                  </Col>
                );
              }else {
                return (
                  <Col key={k} span={12} className={styles.row}>
                    <Row>
                      <Col span={4} style={{textAlign: 'right'}}>{this.baseInfoTitleMap[k]}：</Col>
                      <Col span={20}>{baseInfo[k]}</Col>
                    </Row>
                  </Col>
                );
              }
            })
          }
          </Row>
        </div>
        {/* 标签定义 */}
        <p className={styles.title}>标签定义</p>
        <div className={styles.labelDefined}>
          {(() => {
            if(bqdylx === 'SQL') { // sql
              return (
                <div>
                  <p className={styles.tipTitle}>SQL定义</p>
                  <p>{bqdySql}</p>
                </div>
              );
            }else {
              const tableContent = <div key='tableContent'>
                {<Table
                  className='deepColorTableHeight noBottomBorder'
                  dataSource={bqdy}
                  columns={this.colMap[bqdylx]}
                  bordered
                  pagination={false}
                  rowKey='key'
                  size="small" />}
              </div>;
              const extraContent = bqdylx === 'GZ' ? <div key='extraContent' className={styles.extraContent}><p className={styles.tipTitle} style={{marginTop: '10px'}}>计算公式</p><p>{bqdyZw }</p></div> : '';
              return [tableContent, extraContent];
            }
          })()}
        </div>
        {/* 加工约定 */}
        <p className={styles.title}>加工约定</p>
        <div className={styles.processingContract}>
          {<Table
            className='deepColorTableHeight noBottomBorder'
            dataSource={jgydList}
            columns={this.jgydColumns}
            bordered
            pagination={false}
            rowKey='key'
            size="small" />}
        </div>
        <div className={styles.footer}>
          <Button ghost={true} type='primary' onClick={this.props.onBack}>关闭</Button>
        </div>
      </div>
    )
  }
}

LabelView.propTypes = {
  label: PropTypes.object,
  onBack: PropTypes.func
};

export default connect()(LabelView);