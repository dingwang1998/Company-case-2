import React, { Component } from 'react';
import styles from './index.less';
import IconFont from '@/components/common/iconFont/iconFont';


/**
 * 标签定义基本信息模块组件
 * @method MathInput
 */
class MathInput extends Component {
	componentDidMount() {
		this.props.onRef(this);
		this.mapSymbol = {
			'1': '1',
			'2': '2',
			'3': '3',
			'4': '4',
			'5': '5',
			'6': '6',
			'7': '7',
			'8': '8',
			'9': '9',
			'0': '0',
			'.': '.',
			'+': '+',
			'-': '-',
			'*': '*',
			'/': '/',
			'=': '=',
			'≠': '!=',
			'<': '<',
			'>': '>',
			'≤': '<=',
			'≥': '>=',
			'恒成立': '恒成立',
			'或': '||',
			'且': '&&',
			'(': '(',
			')': ')'
		}
	}
	state = {
		mathContent: '',
		mathContentEn: '',
		contentArr: [],
		bqdmArr: [],
		contentArrEn: []
	};
	componentWillUnmount = () => {
		this.setState = (state, callback) => {
			return;
		};
	}


	getBtns(btnArr) {
		return btnArr.map(item => {
			return <span key={item} onClick={this.getBtnText.bind(this, item)} className={styles.btn}>{item}</span>
		})
	}

	getBtnText(text) {
		const { mathContent, contentArr, contentArrEn, mathContentEn } = this.state;
		const str = mathContent + text;
		const strEn = mathContentEn + this.mapSymbol[text];
		contentArr.push(str);
		contentArrEn.push(strEn);
		this.setState({
			mathContent: str,
			contentArr: contentArr,
			contentArrEn: contentArrEn,
			mathContentEn: strEn
		})
	}

	handleTableSelectRow(row) {
		const { mathContent, contentArr, contentArrEn, mathContentEn, bqdmArr } = this.state;
		const str = mathContent + row.jcbqmc;
		const strEn = mathContentEn + row.jcbqdm;
		contentArr.push(str);
		contentArrEn.push(strEn);
		if (bqdmArr.indexOf(row.jcbqdm) < 0) {
			bqdmArr.push(row.jcbqdm);
		}
		this.setState({
			mathContent: str,
			contentArr: contentArr,
			contentArrEn: contentArrEn,
			mathContentEn: strEn,
			bqdmArr: bqdmArr
		})
	}

	handleBack() {
		const { contentArr, contentArrEn } = this.state;
		if (!contentArr.length) return;
		contentArr.pop();
		contentArrEn.pop();
		this.setState({
			mathContent: contentArr.length ? contentArr[contentArr.length - 1] : '',
			contentArr: contentArr,
			contentArrEn: contentArrEn,
			mathContentEn: contentArrEn.length ? contentArrEn[contentArrEn.length - 1] : '',
		})
	}

	handleDelete() {
		const { contentArr, contentArrEn, mathContent } = this.state;
		if(!mathContent) return;
		contentArr.push('');
		contentArrEn.push('');
		this.setState({
			mathContent: '',
			contentArr: contentArr,
			contentArrEn: contentArrEn,
			mathContentEn: ''
		})
	}

	handleReset() {
		this.setState({
			mathContent: '',
			mathContentEn: '',
			contentArr: [],
			bqdmArr: [],
			contentArrEn: []
		});
	}

	setDefaultValue(obj) {
		this.setState({
			mathContent: obj.bqdyZw,
			mathContentEn: obj.bqdyYw,
			contentArr: [obj.bqdyZw],
			bqdmArr: obj.bqdy,
			contentArrEn: [obj.bqdyYw]
		});
	}


	getData() {
		const { bqdmArr, mathContentEn, mathContent } = this.state;
		let arr =
			bqdmArr.filter(item => {
				return mathContentEn.indexOf(item) > -1
			})
		return {
			jcbqdms: arr,
			bqdyYw: mathContentEn,
			bqdyZw: mathContent
		}
	}


	render() {
		const { mathContent } = this.state;
		const btnArr1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
		const btnArr2 = ['+', '-', '*', '/', '=', '≠', '<', '>', '≤', '≥', '恒成立'];
		const btnArr3 = ['或', '且', '(', ')'];
		return (<div className={styles.mathInputBox}>
			<p className={styles.mathContent}>{mathContent}</p>
			<div className={styles.btnBox}>
				{this.getBtns(btnArr1)}
				<span className={styles.splitLine}>|</span>
				{this.getBtns(btnArr2)}
				<span className={styles.splitLine}>|</span>
				{this.getBtns(btnArr3)}
				<span className={styles.splitLine}>|</span>
				<span onClick={this.handleBack.bind(this)} className={styles.optionIcon}><IconFont type="svy-fxicon-fanhui" /></span>
				<span onClick={this.handleDelete.bind(this)} className={styles.optionIcon}><IconFont type="svy-fxicon-shanchu" /></span>
			</div>
		</div>);
	}
}

export default MathInput;