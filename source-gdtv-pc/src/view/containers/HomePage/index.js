import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import HelmetSEO from 'Components/HelmetSEO';
import SwiperBox from 'Components/SwiperBox';
import NavBar from 'Components/NavBar';
import FriendlyLinks from 'Components/FriendlyLinks';
import HotNews from 'Components/HotNews';
import CardFlow from 'Components/CardFlow';

import { OS, ENTITY_TYPE } from 'Utils/utils';
import { DISPLAY_TYPE_COUNT } from 'Constants/type';
import responsiveStyles from 'Constants/style/responsive.less';

import * as actions from 'Global/actions';
import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import styles from './index.less';
import AdCard from '../../components/AdCard';

/**
 * PageName: 首页
 *
 * Author: xuchunhua
 * use: [ ]
 */
@connect(selectors, {
    getSeoConfig: Actions.getSeoConfig.request,
    getChannelFocus: Actions.getChannelFocus.request,
    getHotNews: Actions.getHotNews.request,
    getRollNews: Actions.getRollNews.request,
    getHomeShowChannels: Actions.getHomeShowChannels.request,
    getChannelNews: Actions.getChannelNews.request,
    addInnerAdCount: actions.addInnerAdCount.request
})
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static prefetch = prefetchSaga;

    async componentDidMount() {
        if (!this.props.isPrefetch) {
            this.props.getSeoConfig();
            this.props.getHotNews();
            this.props.getRollNews();
            this.props.getChannelFocus();
            this.props.getHomeShowChannels();
        }
    }

    /** 切换子频道 */
    handleTabChange = (e, parent) => {
        const { channelNews } = this.props.homeChannels;
        const { childChannels, displayType } = parent;
        const [{ pk }] = childChannels.filter((child) => child.pk == e);
        if (!channelNews[pk]) {
            const data = {
                beginScore: 0,
                channelId: e,
                pageSize: DISPLAY_TYPE_COUNT[displayType]
            };
            this.props.getChannelNews(data);
        }
    }

    renderFirstTabPane = (data) => {
        const { pk } = data;
        const url = `/channels/${pk}`;
        return (
            <a href={url} target='_blank'>{data.name}</a>
        );
    }

    /**
     * 渲染信息流TAB
     * 抽出来的目的是以防万一以后TAB之间需要插入一些奇奇怪怪的东西
     */
    renderChannelNews = (channel) => {
        const { channelNews } = this.props.homeChannels;
        const hasChild = channel?.childChannels?.length > 0;
        return (
            <div className={styles['news-body']}>
                <Tabs
                    className={hasChild ? '' : styles['tabs-no-child']}
                    animated={false}
                    onChange={(e) => { this.handleTabChange(e, channel); }}
                >
                    <Tabs.TabPane tab={this.renderFirstTabPane(channel)} key={channel.name} disabled={hasChild} >
                        {!hasChild &&
                            <CardFlow
                                flowData={channelNews[channel.pk]}
                                displayType={channel.displayType}
                                extra={{ channelId: channel.pk, entityType: ENTITY_TYPE.DATA_JSON }}
                            />
                        }
                    </Tabs.TabPane>
                    {hasChild && channel.childChannels.slice(0, 4).map((child) => (
                        <Tabs.TabPane tab={child.name} key={child.pk} animated={false}>
                            <CardFlow
                                flowData={channelNews[child.pk]}
                                displayType={channel.displayType}
                                extra={{ channelId: channel.pk, entityType: ENTITY_TYPE.DATA_JSON }}
                            />
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </div>
        );
    }

    render() {
        const {
            screenSize,
            friendlyLinks,
            navList,
            homeCommon,
            homeChannels,
            hotNews,
            focus,
            channelOperationAd
        } = this.props;

        const helmetData = {
            title: homeCommon.seoConfig.title,
            keywords: homeCommon.seoConfig.keyword,
            description: homeCommon.seoConfig.description,
        };
        return (
            <div className={styles['page-index']}>
                <HelmetSEO {...helmetData} />
                <SwiperBox bannerData={focus.focusList} fullAd={channelOperationAd?.full} />
                <NavBar screenSize={screenSize} channelList={navList} />
                <div className={[styles['page-content'], responsiveStyles.layout].join(' ')}>
                    <div className={[styles['module-list'], responsiveStyles.content].join(' ')}>
                        <div className={styles['module-mod']}>
                            <HotNews
                                addInnerAdCount={this.props.addInnerAdCount}
                                textNews={hotNews.textNews || []}
                                pictrueNews={hotNews.pictrueNews || []}
                                rollNews={hotNews.rollNews}
                                tabVideos={channelOperationAd?.tabVideo}
                            />
                        </div>
                        {homeChannels?.channels?.map((channel, i) => channel?.childChannels?.length > 0 && (
                            <div
                                className={[styles['module-mod'], styles['channel-news']].join(' ')}
                                key={channel.pk}
                            >
                                {this.renderChannelNews(channel)}
                                {channelOperationAd?.channelBanner?.filter(item => item.position === i + 1).map(item => <AdCard
                                    addInnerAdCount={this.props.addInnerAdCount}
                                    sourceData={item}
                                    layoutStyle={{
                                        width: '100%',
                                        paddingTop: '5.625%'
                                    }}
                                    key={item.pk}
                                />) }
                            </div>
                        ))}
                        <div className={[styles['module-mod']].join(' ')}>
                            <FriendlyLinks friendlyLinks={friendlyLinks} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
