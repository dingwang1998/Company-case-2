import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './iconFont.less'

class IconFont extends Component {
	state = {
	}

	render() {
		const { type, fontSize, color, margin, className, onClick } = this.props
		const styleObj = {
			fontSize: fontSize,
			color: color,
			margin: margin,
			verticalAlign: 'middle'
		}
		let xlinkHref = type.replace('svy-fxicon-', '');
		return (
			<svg onClick={onClick ? (e) => this.props.onClick(e) : () => { }} className={[styles.icon, className ? className : ''].join(" ")} aria-hidden="true" style={styleObj}>
				<use xlinkHref={`#icon-${xlinkHref}`}></use>
			</svg>
		)
	}
}

const defaultProps = {
	fontSize: '25px',
	color: undefined,
	type: 'not-find'
};

const propTypes = {
	type: PropTypes.string.isRequired,
};

IconFont.defaultProps = defaultProps;
IconFont.propTypes = propTypes;

export default IconFont;