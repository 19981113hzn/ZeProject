/* eslint-disable no-sequences */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Radio, Icon, Tabs
} from 'antd';
import HelmetSEO from 'Components/HelmetSEO';
import CardFlow from 'Components/CardFlow';
import ImageLoad from 'Components/ImageLoad';


import { ENTITY_TYPE } from 'Utils/utils';
import { colSpan } from 'Constants/antProps';
import responsiveStyles from 'Constants/style/responsive.less';

import prefetchSaga from './prefetch';
import selectors from './selectors';
import * as Actions from './actions';
import styles from './index.less';

const { TabPane } = Tabs;
const groupSize = {
    xxl: 16,
    xl: 12,
    xs: 8
};

/**
 * PageName: 节目列表
 *
 *
 */
@connect(selectors, {
    getTvChannel: Actions.getTvChannel.request
})
@connect(selectors, {
    getBroadcastChannel: Actions.getBroadcastChannel.request
})
class TvPrograms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fixed: false,
            packUp: true,
            openBroadcast: false, // 展开广播栏目
            keys: null
        };
    }

    static prefetch = prefetchSaga;

    componentDidMount() {
        // if (!this.props.isPrefetch) {
        //     this.props.getTvChannel();
        //     // this.props.getBroadcastChannel();
        // }
        this.props.getBroadcastChannel();
        this.props.getTvChannel();


        window.addEventListener('scroll', this.fixedBar);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.fixedBar);
    }

    
    // 监听固定悬浮导航栏
    fixedBar = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const fixed = scrollTop > 300;
        this.setState({ fixed });
    }

    // 瞄点
    handleCheckChannel = (value) => {
        console.log('value', value);
        // handleCheckChannel = (e) => {
        // const { value } = e.target;
        // this.setState({ checkChannel: e.target.value });
        window.location.href = `#${value}`;
        this.setState({ checkChannel: value, packUp: true, openBroadcast: true });
    }

    /** 解析链接 */
    handleRenderLink = (programs) => {
        const routeName = { 0: 'tvColumn', 1: 'audioColumn' }[programs?.category];
        return `/${routeName}/${programs.pk}`;
    };

    /** 解析广播栏目链接 */
    handleBroadcastLink = (bItem) => {
        this.props.history.push(`/tvColumn/${bItem.pk}`);
    };

    /** 渲染分类选择 */
    renderRagioGroup = () => {
        const { checkChannel, packUp } = this.state;
        const { 
            tvChannels = [], broadcastChannels = [], tvChannelsColumn = {}, broadcastChannelsColumn = {}, screenSize 
        } = this.props;
        const filterTvChannels = tvChannels.filter((item) => tvChannelsColumn[item.pk] && tvChannelsColumn[item.pk].length > 0);
        const filterBroadcastChannels = broadcastChannels.filter((item) => broadcastChannelsColumn[item.pk] && broadcastChannelsColumn[item.pk].length > 0);
        return (
            <div className={packUp && styles['pack-up']}>
                <Radio.Group
                    className={styles['nav-channels']}
                    buttonStyle='solid'
                    value={checkChannel}
                >
                    <Row gutter={24}>
                        {filterTvChannels.map((item, i) => (
                            <Col {...colSpan} key={i}>
                                <a title={item.name}>
                                    <Radio.Button className={styles['tv-programs']} value={item.pk} onClick={() => this.handleCheckChannel(item.pk)}>
                                        {item.name}
                                    </Radio.Button>
                                </a>
                            </Col>
                        ))}
                        {filterBroadcastChannels.map((item, i) => (
                            <Col {...colSpan} key={i}>
                                <a title={item.name}>
                                    <Radio.Button className={styles['tv-programs']} value={item.pk} onClick={() => this.handleCheckChannel(item.pk)}>
                                        {item.name}
                                    </Radio.Button>
                                </a>
                            </Col>
                        ))}
                    </Row>
                </Radio.Group>
                {filterTvChannels.length > groupSize[screenSize] &&
                    <Icon
                        type='caret-up'
                        className={styles['pack-up-btn']}
                        onClick={() => { this.setState({ packUp: !packUp }); }}
                    />
                }
            </div>
        );
    }
    
    render() {
        const { fixed, openBroadcast, keys } = this.state;
        const {
            tvChannels = [], tvChannelsColumn = {}, broadcastChannels = [], broadcastChannelsColumn = {}
        } = this.props;
        // console.log('broadcastChannels', broadcastChannels);
        // console.log('broadcastChannelsColumn', broadcastChannelsColumn);
        // 获取每条广播频率栏目数据
        let broadcastData = [];
        // const oDiv1 = document.querySelector('.broadcast-menus-pic');
        // const oDiv2 = document.querySelector('.broadcast-menus-footer');
        // oDiv1.onmouseover = () => {
        //     console.log(11111);
        //     oDiv2.style.display = 'block';
        // };
        // oDiv2.onmouseout = () => {
        //     console.log(22222);
        //     oDiv2.style.display = 'none';
        // };     
        
        const helmetData = {
            title: ['节目一览', '荔枝网'].filter(Boolean).join('-')
        };
        return (
            <div className={styles['page-tv-programs']}>
                <HelmetSEO {...helmetData} />
                {fixed &&
                    <div
                        className={[
                            responsiveStyles.layout,
                            styles['tv-programs-nav'],
                            styles.fixed
                        ].join(' ')}
                    >
                        <div className={responsiveStyles.content}>
                            {this.renderRagioGroup()}
                        </div>
                    </div>
                }
                <div className={responsiveStyles.layout}>
                    <div className={responsiveStyles.content}>
                        <div className={styles['tv-programs-nav']}>
                            <div className={styles['nav-title']}>节目一览</div>
                            {this.renderRagioGroup()}
                        </div>
                        <div className={styles['tv-menus']}>
                            {tvChannels.map((item) => tvChannelsColumn[item.pk] && tvChannelsColumn[item.pk].length > 0 && (
                                <div className={styles['tv-menu']} key={item.pk}>
                                    <div className={styles['anchor-point']} id={item.pk}></div>
                                    <div className={styles['tv-menu-title']}>
                                        {item.name}
                                    </div>
                                    <div className={styles['tv-menu-content']}>
                                        <CardFlow
                                            flowData={tvChannelsColumn[item.pk]}
                                            displayType={0}
                                            isMulti={true}
                                            extra={{
                                                entityType: ENTITY_TYPE.DATA_JSON,
                                                customLink: this.handleRenderLink
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                        <div className={styles['broadcast-menus']}>
                            {broadcastChannels.map((item) => broadcastChannelsColumn[item.pk] && broadcastChannelsColumn[item.pk].length > 0 && (
                                <div className={styles['broadcast-menus-content']}>
                                    <div className={styles['broadcast-menus-top-content']}>
                                        <div className={styles['broadcast-menus-top-contents']}>
                                            <div className={styles['broadcast-miaodian']} id={item.pk}></div>
                                            <div className={styles['broadcast-menus-pic']}>
                                                <ImageLoad src={item.avatarUrl} className={styles['broadcast-Img']} />
                                            </div>
                                            <div className={styles['broadcast-menu-title']}>
                                                {item.name}
                                            </div>
                                            {/* {openBroadcast && */}
                                            <div className={styles['broadcast-menus-footer']}>
                                                { 
                                                    // const broadcastData = [];
                                                    Object.keys(broadcastChannelsColumn).forEach((key) => {
                                                        // this.setState({ keys: key });
                                                        if (item.pk == key) {
                                                            // 清空数据
                                                            if (broadcastData.length) {
                                                                broadcastData = [];
                                                            } 
                                                            broadcastData.push(broadcastChannelsColumn[key].map((bitem) => bitem));
                                                            // console.log(555555, broadcastData[0]);
                                                        }
                                                    })
                                                }
                                                {(broadcastData[0].map((bItem => (<a target="_blank" className={styles['broadcast-menus-footer-a']} onClick={ () => this.handleBroadcastLink(bItem)} >{bItem.name}</a>))))}
                                            </div> 
                                            {/* } */}
                                            
                                            
                                        </div>
                                           
                                          
                                    </div>
                                </div>
                            ))}
                            {/* {broadcastChannels.map((item) => broadcastChannelsColumn[item.pk] && broadcastChannelsColumn[item.pk].length > 0 && (
                                <div className={styles['broadcast-menus-content']}>
                                    <div className={styles['broadcast-menus-top-content']} id={item.pk}>
                                        <div className={styles['broadcast-menus-top-contents']}>
                                            <div className={styles['broadcast-menus-pic']}>
                                                <ImageLoad src={item.avatarUrl} className={styles['broadcast-Img']} />
                                            </div>
                                            <div className={styles['broadcast-menu-title']}>
                                                {item.name}
                                            </div>
                                        </div>
                                        <div className={styles['broadcast-menus-footer']}>
                                            { 
                                                // const broadcastData = [];
                                                Object.keys(broadcastChannelsColumn).forEach((key) => {
                                                    if (item.pk == key) {
                                                        if (broadcastData.length) {
                                                            broadcastData = [];
                                                        } 
                                                        broadcastData.push(broadcastChannelsColumn[key].map((bitem) => bitem));
                                                        // console.log(555555, broadcastData[0]);
                                                    }
                                                })
                                            }
                                            
                                            {broadcastData[0].map((bItem => (<a target="_blank" className={styles['broadcast-menus-footer-a']} onClick={ () => this.handleBroadcastLink(bItem)} >{bItem.name}</a>)))}
                                        </div>    
                                    </div>       
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TvPrograms;
