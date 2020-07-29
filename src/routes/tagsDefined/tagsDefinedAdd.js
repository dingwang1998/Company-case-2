import React, { Component } from 'react'
import { connect } from 'dva';
import SearchLayout from '../../components/common/SearchLayout/SearchLayout'


export class TagsDefinedadd extends Component {
    render() {
        return (
            <div>
                <SearchLayout
                    tableTitle= "我是新增加的"
                />
            </div>
        )
    }
}

export default connect(
	({ labelManagement }) => ({ labelManagement })
)(TagsDefinedadd);
