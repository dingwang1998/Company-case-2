import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { Link, withRouter } from 'react-router-dom';
import IconFont from '@/components/common/iconFont/iconFont';
import ContextMenu from 'react-context-menu';

import { getCachingKeys } from 'react-router-cache-route';


class Home extends Component {
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 
	render() {
		return (
			<div className={styles.labelWrap}>
				<ContextMenu
					contextId={'clickable-area'}
					class="test"
					items={[
						{
							label: '刷新',
							onClick: this.refreshCurPage.bind(this)
						}
					]} />
				<ul id='clickable-area'>
					{this.renderMenu()}
				</ul>
			</div>
		)
	}

	renderMenu = data => {
		let that = this;
		const { app } = this.props;
		let { labels, curLabel } = app;
		return labels.map(item => {
			return (
				<li key={item.id} id={item.id} onClick={() => that.selectLabel(item.id)} className={[styles.label, curLabel === item.id ? styles.curLabel : ''].join(' ')}>
					<Link to={item.path}>{item.name}</Link>
					{curLabel === item.id ? (<span onClick={(e) => that.closeLabel(item.id, e)} className={styles.closeIcon}><IconFont type="svy-fxicon-guanbi1" style={{ fontSize: '8px' }} /></span>) : ''}
				</li>
			);
		});
	};

	refreshCurPage() {
		const { history, dispatch } = this.props;
		const pathname = history.location.pathname;
		let cacheKey = '';
		getCachingKeys().forEach(item=>{
			if(pathname.indexOf(item)>-1){
				cacheKey = item;
			}

		})
		dispatch({
			type: 'app/setCurPageRoute',
			curPageRoute: {
				url: history.location.pathname,
				key:cacheKey
			}
		})
		history.push('/blank');
	}

	selectLabel = (id) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'app/setCurLabel',
			payload: {
				curLabel: id
			}
		})
	}

	closeLabel = (id, e) => {
		e.stopPropagation();
		const { app, dispatch } = this.props;
		let { labels } = app;

		let arr = JSON.parse(JSON.stringify(labels));
		arr.forEach((item, index) => {
			if (item.id === id) {
				arr.splice(index, 1);
			}
		})

		dispatch({
			type: 'app/setLabels',
			payload: {
				labels: arr
			}
		});

		if (arr.length) {
			dispatch({
				type: 'app/setCurLabel',
				payload: {
					curLabel: arr[arr.length - 1].id
				}
			})
			this.props.history.push(arr[arr.length - 1].path);
		} else {
			dispatch({
				type: 'app/setNoContent',
				payload: {
					noContent: true
				}
			})
			this.props.history.push('/');
		}
	}
}
export default connect(
	({ app }) => ({ app })
)(withRouter(Home))
