import React, { Component } from 'react';
import { Input } from 'antd';
import { urlParams } from 'Utils/utils';

import styles from './index.less';

const { Search } = Input;

/**
 * ModuleName: 首页搜索模块
 * 
 * Author: xuchunhua 
 * use: [ 首页搜索模块 ]
 */
class SearchBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: ''
        };
    }

    componentDidMount() {
        const { key } = urlParams();
        if (key) {
            this.setState({ keyword: decodeURIComponent(key) });
        }
    }

    /** 点击按钮搜索 */
    handleClickSearch = () => {
        const { keyword } = this.state;
        if (keyword) {
            window.location.href = `/search?key=${encodeURIComponent(keyword)}`;
        }
    }

    /** 输入 */
    handleOnChange = (e) => {
        const { value } = e.target;
        this.setState({ keyword: value.replace(/(^\s*)|(\s*$)/g, '') });
    }

    render() {
        const { keyword = '' } = this.state;
        const { opaque, placeholder = '' } = this.props;
        const opaqueClassName = opaque ? styles.opaque : '';
        return (
            <div className={[styles['search-wrap'], opaqueClassName].join(' ')}>
                <div className={styles['search-box']}>
                    <Search
                        ref='keyInput'
                        className={styles.keywords}
                        placeholder={placeholder}
                        size='large'
                        enterButton='搜索'
                        value={keyword}
                        maxLength={40}
                        onChange={this.handleOnChange}
                        onSearch={this.handleClickSearch}
                    />
                </div>
            </div>
        );
    }
}

export default SearchBox;
