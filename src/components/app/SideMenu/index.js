import React, { Component } from 'react'
import { connect } from 'dva';
import { Menu } from 'antd';
import './index.less';
import { getCachingKeys } from 'react-router-cache-route';
import styles from './index.less';



import { Link, withRouter } from 'react-router-dom';

const { SubMenu } = Menu;


class SideMenu extends Component {

	rootSubmenuKeys = ['tagsDefinedClassify', 'processMonitoringClassify', 'customAnalysisClassify'];

	menuMap = {
		processMonitoring: '加工结果监控',
    	customAnalysis: '自定义分析',
    	resultApplication:'标签结果引用',
		labelManagement: '标签内容维护',
		tagsDirectory: '标签目录维护',
		tagsDefinedSQL: 'SQL标签定义',
		tagsDefinedBasic: '基础标签定义',
		tagsDefinedRule: '规则标签定义'
	}

	state = {
		openKeys: ['tagsDefinedClassify'],
	};
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}


	refreshCurPage() {
		const { history, dispatch } = this.props;
		const pathname = history.location.pathname;
		let cacheKey = '';
		getCachingKeys().forEach(item => {
			if (pathname.indexOf(item) > -1) {
				cacheKey = item;
			}
		})
		dispatch({
			type: 'app/setCurPageRoute',
			curPageRoute: {
				url: history.location.pathname,
				key: cacheKey
			}
		})
		history.push('/blank');
	}

	componentDidMount() {
		const { app, dispatch } = this.props;
		let { labels } = app;
		let pathname = this.props.history.location.pathname;
		let arr = pathname.split("/");
		let firstPath = '/tagsDefinedClassify/tagsDefinedBasic';

		if (pathname === "/" || pathname === firstPath) {
			pathname === "/" && this.props.history.push(firstPath);
			arr = firstPath.split("/");
			pathname = firstPath;
		} else {
			this.setState({
				openKeys: [arr[1]]
			})
		}

		dispatch({
			type: 'app/setLabels',
			payload: {
				labels: labels.concat([{
					name: this.menuMap[arr[2]],
					path: pathname,
					id: arr[2]
				}])
			}
		});
		dispatch({
			type: 'app/setCurLabel',
			payload: {
				curLabel: arr[2]
			}
		})

	}
	onSelect = ({ item, key }) => {
		const { app, dispatch } = this.props;

		let pathname = this.props.history.location.pathname;
		let flag = true;
		let { labels } = app;
		labels.forEach(item => {
			if (item.path === pathname) {
				flag = false;
			}
		})
		dispatch({
			type: 'app/setCurLabel',
			payload: {
				curLabel: key
			}
		})
		dispatch({
			type: 'app/setNoContent',
			payload: {
				noContent: false
			}
		})
		//当前tab没有在选中标签中
		if (flag) {
			dispatch({
				type: 'app/setLabels',
				payload: {
					labels: labels.concat([{
						name: item.props.name,
						path: pathname,
						id: key
					}])
				}
			});
			setTimeout(() => {
				this.refreshCurPage();
			}, 100);
		}
	}

	onOpenChange = openKeys => {
		this.setState({ openKeys });
	};

	render() {
		const { app } = this.props;

		return (
			<div id="side-menu" className={styles.slideMenu}>
				<Menu
					mode="inline"
					openKeys={this.state.openKeys}
					onOpenChange={this.onOpenChange}
					selectedKeys={[app.curLabel]}
					onSelect={this.onSelect}
					style={{ width: 220 }}
				>
					<SubMenu
						key="tagsDefinedClassify"
						title={
							<span>
								<span>标签定义</span>
							</span>
						}
					>
						<Menu.Item name="基础标签定义" key="tagsDefinedBasic"><Link to="/tagsDefinedClassify/tagsDefinedBasic">基础标签定义</Link></Menu.Item>
						<Menu.Item name="规则标签定义" key="tagsDefinedRule"><Link to="/tagsDefinedClassify/tagsDefinedRule">规则标签定义</Link></Menu.Item>
						<Menu.Item name="SQL标签定义" key="tagsDefinedSQL"><Link to="/tagsDefinedClassify/tagsDefinedSQL">SQL标签定义</Link></Menu.Item>
					</SubMenu>
					<SubMenu
						key="labelManagementClassify"
						title={
							<span>
								<span>标签维护</span>
							</span>
						}
					>
						<Menu.Item key="tagsDirectory" name="标签目录维护"><Link to="/labelManagementClassify/tagsDirectory">标签目录维护</Link></Menu.Item>
						<Menu.Item key="labelManagement" name="标签内容维护"><Link to="/labelManagementClassify/labelManagement">标签内容维护</Link></Menu.Item>
						<Menu.Item key="tagsSenior" name="高级标签维护"><Link to="/labelManagementClassify/tagssenior">高级标签维护</Link></Menu.Item>
					</SubMenu>
					<SubMenu
						key="processMonitoringClassify"
						title={
							<span>
								<span>加工监控</span>
							</span>
						}
					>
						<Menu.Item key="processMonitoring" name="加工结果监控"><Link to="/processMonitoringClassify/processMonitoring">加工结果监控</Link></Menu.Item>
					</SubMenu>
					<SubMenu
						key="customAnalysisClassify"
						title={
							<span>
								<span>标签分析</span>
							</span>
						}
					>
						<Menu.Item key="customAnalysis" name="自定义分析"><Link to="/customAnalysisClassify/customAnalysis">自定义分析</Link></Menu.Item>
            			<Menu.Item key="resultApplication" name="标签结果应用"><Link to="/customAnalysisClassify/resultApplication">标签结果应用</Link></Menu.Item>
            			<Menu.Item key="taskMonitoring" name="聚合任务监控"><Link to="/customAnalysisClassify/taskMonitoring">聚合任务监控</Link></Menu.Item>
						<Menu.Item key="channel" name="渠道服务管理"><Link to="/customAnalysisClassify/channel">渠道服务管理</Link></Menu.Item>
						<Menu.Item key="labelapplication" name="标签应用情况"><Link to="/customAnalysisClassify/labelapplication">标签应用情况</Link></Menu.Item>
					</SubMenu>
				</Menu>
			</div>
		)
	}
}

export default connect(
	({ app }) => ({ app })
)(withRouter(SideMenu))
