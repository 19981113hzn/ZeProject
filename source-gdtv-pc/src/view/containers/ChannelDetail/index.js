import React from 'react';
import { connect } from 'react-redux';
import HelmetSEO from 'Components/HelmetSEO';

import responsiveStyles from 'Constants/style/responsive.less';

import { Route, Switch } from 'react-router';
import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import AudioChannelDetail from './audioChannelDetail';
import TvChannelDetail from './tvChannelDetail';

/**
 * PageName: 电视栏目信息页/频道信息页
 * 除获取详情接口不同，其余逻辑一样
 * 如果后期两者逻辑有不一样，建议复制分开为两个组件
 *
 * 2020年9月28日
 * 新增displayTypeSecond字段，代表二级列表显示类型，0宫格，1图文
 */
@connect(selectors, {
    getColumnInfo: Actions.getColumnInfo.request,
    getColumnVideoList: Actions.getColumnVideoList.request,
    getChannelInfo: Actions.getChannelInfo.request,
    getChannelNews: Actions.getChannelNews.request
})
class ChannelDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static prefetch = prefetchSaga;

    render() {
        const {
            columnInfo,
        } = this.props;

        const helmetData = {
            title: [columnInfo.name, '荔枝网'].filter(Boolean).join('-'),
            keywords: columnInfo.keyword,
            description: columnInfo.desc || columnInfo.source,
            imgUrl: columnInfo.coverUrl
        };
        return (
            <div className={responsiveStyles.layout}>
                <HelmetSEO {...helmetData} />
                <Switch>
                    <Route path={'/audioColumn/:columnPk'} exact={true} render={() => <AudioChannelDetail {...this.props} />}/>

                    <Route path={'/tvColumn/:columnPk'} exact={true} render={() => <TvChannelDetail {...this.props}/>}/>
                    <Route path={'/channelDetail/:channelPk'} render={() => <TvChannelDetail {...this.props}/>}/>
                </Switch>
            </div>
        );
    }
}

export default ChannelDetail;
