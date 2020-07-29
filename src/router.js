/*
 * @Description:
 * @Author: [your name]
 * @Date: 2020-05-11 14:02:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-16 18:06:16
 * @FilePath: \labelmiddleplatform\src\router.js
 */
import React from 'react';
// import { Router } from 'dva/router';
import { HashRouter as Router,Route } from 'react-router-dom'

import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import App from './routes/app/app';

import CacheRoute, { CacheSwitch } from 'react-router-cache-route';


//按需加载
import Loadable from 'react-loadable';
import Loading from './components/common/Loading/Loading';
import fakeDelay from './utils/fakeDelay';
import path from 'path';

import Blank  from './routes/blank/blank';

//标签定义
let TagsDefinedBasic = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/tagsDefined/tagsDefinedBasic')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/tagsDefined/tagsDefinedBasic')
});

let TagsDefinedRule = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/tagsDefined/tagsDefinedRule')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/tagsDefined/tagsDefinedRule')
});

let TagsDefinedSQL = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/tagsDefined/tagsDefinedSQL')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/tagsDefined/tagsDefinedSQL')
});



//标签维护
let LabelManagement = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/labelManagement/labelManagement')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/labelManagement/labelManagement')
});
let TagsDirectory = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/labelManagement/tagsDirectory')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/labelManagement/tagsDirectory')
});
let TagsSenior = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/labelManagement/tagsSenior')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/labelManagement/tagsSenior')
});

let TagsSenior1 = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/labelManagement/tagsSenior1')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/labelManagement/tagsSenior1')
});

//加工监控
let ProcessMonitoring = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/processMonitoring/processMonitoring')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/processMonitoring/processMonitoring')
});
//自定义分析

let CustomAnalysis = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/customAnalysis/customAnalysis')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/customAnalysis/customAnalysis')
});

//标签结果应用
let ResultApplication = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/customAnalysis/resultApplication')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/customAnalysis/resultApplication')
});

//聚合任务监控
let TaskMonitoring = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/customAnalysis/taskMonitoring')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/customAnalysis/taskMonitoring')
});
// 渠道服务管理
let Channel = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/customAnalysis/channel')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/customAnalysis/channel')
});
//标签应用情况
let Labelapplication = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/customAnalysis/Labelapplication')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/customAnalysis/Labelapplication')
});
// 标签应用情况里面的跳转页面第一层
let SeeLabel = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/customAnalysis/SeeLabel')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/customAnalysis/SeeLabel')
});
// 标签应用情况里面的跳转页面第二层
let Numberofhits = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/customAnalysis/Numberofhits')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/customAnalysis/Numberofhits')
});
// 标签应用情况里面的跳转页面第三层
let Numberoftaxes = Loadable({
  loader: () => fakeDelay(400).then(() => import('./routes/customAnalysis/Numberoftaxes.js')),
  LoadingComponent: Loading,
  serverSideRequirePath: path.resolve(__dirname, './routes/customAnalysis/Numberoftaxes.js')
});

function RouterConfig({ history }) {
	return (
		<ConfigProvider locale={zhCN}>
			<Router history={history}>
				<App>
					<CacheSwitch>
            {/* 第一个标签页路由 */}
						<CacheRoute cacheKey="tagsDefinedBasic" path="/tagsDefinedClassify/tagsDefinedBasic" exact component={TagsDefinedBasic} />
						<CacheRoute cacheKey="tagsDefinedRule" path="/tagsDefinedClassify/tagsDefinedRule" exact component={TagsDefinedRule} />
						<CacheRoute cacheKey="tagsDefinedSQL" path="/tagsDefinedClassify/tagsDefinedSQL" exact component={TagsDefinedSQL} />
            {/* 第二个标签页路由 */}
						<CacheRoute cacheKey="tagsDirectory" path="/labelManagementClassify/tagsDirectory" exact component={TagsDirectory} />
						<CacheRoute cacheKey="labelManagement" path="/labelManagementClassify/labelManagement" exact component={LabelManagement} />
            <CacheRoute cacheKey="tagsSenior" path="/labelManagementClassify/tagssenior" exact component={TagsSenior} />
            <CacheRoute cacheKey="tagsSenior1" path="/labelManagementClassify/tagssenior1" exact component={TagsSenior1} />
            {/* 第三个路由标签页 */}
						<CacheRoute cacheKey="processMonitoring" path="/processMonitoringClassify/processMonitoring" exact component={ProcessMonitoring} />

            {/* 第四个路由标签页 */}
						<CacheRoute cacheKey="customAnalysis" path="/customAnalysisClassify/customAnalysis" exact component={CustomAnalysis} />
            <CacheRoute cacheKey="resultApplication" path="/customAnalysisClassify/resultApplication" exact component={ResultApplication} />
            <CacheRoute cacheKey="taskMonitoring" path="/customAnalysisClassify/taskMonitoring" exact component={TaskMonitoring} />
            <CacheRoute cacheKey="channel" path="/customAnalysisClassify/channel" exact component={Channel} />
            <CacheRoute cacheKey="labelapplication" path="/customAnalysisClassify/labelapplication" exact component={Labelapplication} />
            <CacheRoute cacheKey="SeeLabel" path="/customAnalysisClassify/seelabel" exact component={SeeLabel} />
            <CacheRoute cacheKey="Numberofhits" path="/customAnalysisClassify/numberofhits" exact component={Numberofhits}/>
            <CacheRoute cacheKey="Numberoftaxes" path="/customAnalysisClassify/numberoftaxes" exact component={Numberoftaxes} />
						<Route path="/blank" exact component={Blank} />
					</CacheSwitch>
				</App>
			</Router>
		</ConfigProvider>
	);
}

export default RouterConfig;
