import React, { Component } from 'react'
import styles from './index.less';

export default class Home extends Component {
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 
	render() {
		return (
			<div id="header" className={styles.header}>
				<div className={styles.logo}>
					<img src={require('../../../assets/img/app/logo.png')} alt=""/>
				</div>
				<div className={styles.logoTitle}>标签中台</div>
			</div>
		)
	}
}
