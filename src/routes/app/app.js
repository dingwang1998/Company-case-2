/*
 * @Author: lijiam
 * @Date: 2020-03-16 12:08:23
 * @Description: description
 * @LastEditors: lijiam
 * @LastEditTime: 2020-03-19 18:59:45
 */
import React, { Component } from 'react';
import { connect } from 'dva';

import '@/assets/css/reset.less';
import '@/assets/css/common.less';


import styles from './app.less';

import { Layout } from 'antd';

import Head from '@/components/app/Header';
import Label from '@/components/app/Label';


import SideMenu from '../../components/app/SideMenu'

const { Header, Content, Sider } = Layout;


class App extends Component {


	componentDidMount() {
		this.props.dispatch({type:'app/queryUserInfo'}); // 获取用户信息
		// 监听浏览器点击返回
		window.history.pushState(null, null, document.URL);
		window.addEventListener('popstate', this.handleBack, false);
	}
	handleBack() {
		//禁止浏览器回退
		window.history.pushState(null, null, document.URL);
	}
	// 页面销毁取消监听
	componentWillUnmount() {
		this.setState = (state,callback)=>{
      		return;
    	};
		window.removeEventListener('popstate', this.handleBack, false);
	}

	render() {
		const { app } = this.props;
		if(!app.user) return null; // 用户未登录时进行拦截
		return (
			<div id="#app" className={styles.app}>
				<Layout className={styles.layout}>
					<Header className={styles.header}>
						<Head></Head>
					</Header>
					<Layout className={styles.layoutBottom}>
						<Sider className={styles.sider}><SideMenu /></Sider>
						<Content id="content">
							<Label></Label>
							<div className={styles.routerWrap} style={app.noContent ? { zIndex: '-1' } : {}}>{this.props.children}</div>
						</Content>
					</Layout>
				</Layout>
			</div>
		)
	}

}
export default connect(
	({ app }) => ({ app })
)(App);
