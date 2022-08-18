import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Radio, Button, Icon,
} from 'antd';

import HelmetSEO from 'Components/HelmetSEO';
import CardFlow from 'Components/CardFlow';
import { DISPLAY_TYPE_COUNT } from 'Constants/type';

import { colSpan } from 'Constants/antProps';
import responsiveStyles from 'Constants/style/responsive.less';
import * as GlobalActions from 'Global/actions';

import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import styles from './index.less';

const groupSize = {
    xxl: 16,
    xl: 12,
    xs: 8
};

/**
 * PageName: 全部分类
 * 推荐频道不能点击
 */
@connect(selectors, {
    getCommonChannel: GlobalActions.getCommonChannel.request,
    getChannelInfo: Actions.getChannelInfo.request,
    getAllSubChannelNews: Actions.getAllSubChannelNews.request,
    getChannelNews: Actions.getChannelNews.request
})
class ChannelsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fixed: false,
            currentChannel: {},
            checkChannel: undefined,
            packUp: true
        };
    }

    static prefetch = prefetchSaga;

    async componentDidMount() {
        if (!this.props.isPrefetch) {
            const { channelId } = this.props.match.params;
            await new Promise((resolve, reject) => {
                this.props.getChannelInfo({ channelPk: channelId }, resolve, reject);
            });
        }
        const { channelInfo } = this.props;
        const { childChannels = [] } = channelInfo;
        const [channel = {}] = childChannels;
        this.setState({ checkChannel: channel.pk });
        window.addEventListener('scroll', this.fixedBar);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.fixedBar);
    }

    // 监听固定悬浮导航栏
    fixedBar = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const fixed = scrollTop > 400;
        this.setState({ fixed });
    }

    handleCheckChannel = (e) => {
        const { value } = e.target;
        window.location.href = `#${value}`;
        this.setState({ checkChannel: value });
    }

    /** 换一批 */
    handleRefreshNews = (child) => {
        const { channelNews, channelInfo } = this.props;
        const { lastScore } = channelNews[child.pk] || {};
        const data = {
            beginScore: lastScore || 0,
            channelId: child.pk,
            pageSize: DISPLAY_TYPE_COUNT[channelInfo.displayType]
        };
        this.props.getChannelNews(data);
    }

    /** 渲染分类选择 */
    renderRadioGroup = () => {
        const { channelInfo, screenSize } = this.props;
        const { checkChannel, packUp } = this.state;

        console.log(groupSize[screenSize], screenSize);


        return (
            <div>
                <Radio.Group
                    className={styles['nav-channels']}
                    buttonStyle='solid'
                    value={checkChannel}
                    onChange={this.handleCheckChannel}
                >
                    <Row gutter={24}>
                        {channelInfo?.childChannels?.filter(item => item.name !== '推荐')
                            .filter((item, i) => {
                                if (packUp) {
                                    return i < groupSize[screenSize];
                                } return true;
                            })
                            .map((item, i) => (
                                <Col {...colSpan} key={i}>
                                    <a title={item.name}>
                                        <Radio.Button
                                            className={styles.channel}
                                            value={item.pk}
                                        >
                                            {item.name}
                                        </Radio.Button>
                                    </a>
                                </Col>
                            ))}
                    </Row>
                </Radio.Group>

                <div style={{ textAlign: 'center' }}>
                    <Icon
                        type={packUp ? 'caret-down' : 'caret-up'}
                        className={styles['pack-up-btn']}
                        onClick={() => { this.setState({ packUp: !packUp }); }}
                    />
                </div>
            </div>
        );
    }

    /** 渲染信息流 */
    renderCardFlow = (data) => {
        const { channelRequesting, channelNews, channelInfo } = this.props;
        const { list } = channelNews[data.pk] || {};
        const { displayType } = channelInfo;
        if (data.name == '推荐' && !list?.length) {
            return null;
        }
        return (
            <div className={styles['sub-channel']} key={data.pk}>
                <div className={styles['anchor-point']} id={data.pk}></div>
                <div className={styles['sub-channel-title']}>
                    {data.name == '推荐'
                        ? data.name
                        : <a href={data.tvColumnPk ? `/tvColumn/${data.tvColumnPk}` : `/channelDetail/${data.pk}`}>
                            {data.name}
                        </a>
                    }
                </div>
                {list?.length > 0 &&
                    <div className={styles['btn-refresh']}>
                        <Button type='link' icon='sync' onClick={() => { this.handleRefreshNews(data); }}>换一批</Button>
                    </div>
                }
                <div className={styles['sub-channel-content']}>
                    <CardFlow
                        flowData={channelRequesting[data.pk] ? [] : list}
                        displayType={displayType}
                    />
                </div>
            </div>
        );
    }

    render() {
        const { channelInfo } = this.props;
        const { fixed } = this.state;

        let keywords;
        try {
            keywords = JSON.parse(channelInfo.keyword).join(',');
        } catch (error) {
            keywords = '';
        }
        const helmetData = {
            title: [channelInfo.name, '荔枝网'].filter(Boolean).join('-'),
            keywords,
            description: channelInfo.description,
            imgUrl: channelInfo.coverUrl
        };
        return (
            <div className={styles['page-channels']}>
                <HelmetSEO {...helmetData} />
                {fixed &&
                    <div
                        className={[
                            responsiveStyles.layout,
                            styles.nav,
                            styles.fixed || ''
                        ].join(' ')}
                    >
                        <div className={responsiveStyles.content}>
                            {this.renderRadioGroup()}
                        </div>
                    </div>
                }
                <div className={responsiveStyles.layout}>
                    <div className={responsiveStyles.content}>
                        <div className={styles.nav}>
                            <div className={styles['nav-title']}>{channelInfo.name}</div>
                            {this.renderRadioGroup()}
                        </div>
                        <div className={styles['sub-channels']}>
                            {channelInfo?.childChannels?.map((child) => this.renderCardFlow(child))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChannelsPage;
