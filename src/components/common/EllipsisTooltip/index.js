
import {Tooltip} from 'antd';
import React from 'react';

class EllipsisTooltip extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			DtStyle: {},
			DtClass: '',
		}
	}
	componentDidMount() { this.getItemWidth() }
	getItemWidth = () => {
		if (this.container) {
			this.setState({
				DtStyle: { width: `${this.container.clientWidth}px` },
				DtClass: 'NowrapAndTitle'
			})
		}
	}
	render() {
		const { DtStyle, DtClass } = this.state;
		return (
			<div className="PublicTableTooltip">
				<Tooltip placement="topLeft" title={this.props.title} overlayClassName="ItemPublicTableTooltip">
					<div ref={node => this.container = node} style={DtStyle} className={DtClass}>{this.props.children}</div>
				</Tooltip>
			</div>
		)
	}
}
export default EllipsisTooltip