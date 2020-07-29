
import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import { dropByCacheKey } from 'react-router-cache-route';

class Blank extends Component {

	componentDidMount() {
		const curPageRoute = this.props.app.curPageRoute;
		dropByCacheKey(curPageRoute.key)
		setTimeout(() => {
			this.props.history.push(curPageRoute.url);
		}, 500);
	}
	componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
}
 

	render() {
		return (
			<div>
			</div>
		)
	}
}
export default connect(
	({ app }) => ({ app })
)(withRouter(Blank));  