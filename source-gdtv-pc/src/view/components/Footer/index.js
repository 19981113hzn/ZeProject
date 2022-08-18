import React, { Component } from 'react';
import { Button, Popover } from 'antd';
import { NEWS_ROUTE, TOPIC_ROUTE } from 'Constants/type';

import responsiveStyles from 'Constants/style/responsive.less';
import styles from './index.less';

/**
 * ModuleName: 通用Footer
 *
 * use: [ 页面通用Footer展示 ]
 *
*/
export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderPopoverContent = (data) => (
        <div className={styles['qrcode-popver']}>
            <div className={styles['qrcode-img']}>
                <img src={data.pictureUrl} alt={data.name} />
            </div>
            <div>扫码{data.linkUrl === null ? '关注' : '下载'}{data.name}</div>
        </div>
    );

    renderItem = (item, i) => {
        const {
            objectId,
            objectType,
            contentType,
            externalUrl
        } = item;
        let link = '';
        switch (objectType) {
            case 0: // 外链
                link = externalUrl;
                break;
            case 1: // 新闻
                link = `/${NEWS_ROUTE[contentType]}/${objectId}`;
                break;
            case 2: // 频道
                if (+contentType === 0) {
                    link = `/channels/${objectId}`;
                } else if (+contentType === 1) {
                    link = `/channelDetail/${objectId}`;
                }
                break;
            case 3: // 专题
                link = `/${TOPIC_ROUTE[1]}/${objectId}`;
                break;
            case 4: // 电视栏目
                link = `/tvColumn/${objectId}`;
                break;
            case 5: // 广播栏目
                link = `/audioColumn/${objectId}`;
                break;
            default:
                break;
        }
        return (
            <a href={link} target='_blank' key={i}>
                {i > 0 && <span>|</span>}
                {item.title}
            </a>
        );
    }

    render() {
        const { friendlyLinks = {}, footerNavList = [] } = this.props;
        const { qrcodefriendlyLinkResponses = [] } = friendlyLinks;
        return (
            <div className={[styles.footer, responsiveStyles.layout].join(' ')} id='pageFooter'>
                <div className='global-footer'>
                    <div className={[styles['footer-wrap'], responsiveStyles.content].join(' ')}>
                        <div className={styles['f-w1']}>
                            <div className={styles['footer-left']}>
                                <a href='/' title='荔枝网' className={styles.logo}></a>
                            </div>
                            <div className={styles['footer-right']}>
                                {qrcodefriendlyLinkResponses.map((qrcode, i) => (
                                    <Popover placement='top' content={this.renderPopoverContent(qrcode)} trigger='hover' key={i}>
                                        <Button className={styles['qrcode-btn']} shape='round' icon='qrcode'>{qrcode.name}</Button>
                                    </Popover>
                                ))}
                            </div>
                        </div>
                        <div className={styles['f-w3']}>
                            {footerNavList.map(this.renderItem)}
                        </div>
                        <div className={styles['f-w2']}>
                            <div className={styles['footer-left']}>
                                <dl className={styles.message}>
                                    <dt>地址：中国广东省广州市环市东路331号广东电视中心</dt>
                                    <dt>电话：0086-20-83355188(转) 邮编：510066</dt>
                                    {/* <dt>电子邮箱：gdtv@gdtv.cn</dt> */}
                                    <dt>违法和不良信息举报电话：020-61293176&nbsp;&nbsp;&nbsp;&nbsp;报料电话：020-114转8</dt>
                                </dl>
                            </div>
                            <div className={styles['footer-right']}>
                                <div className={styles.links}>
                                    {/* <a className={styles['links-1']} href='http://www.12377.cn' target='_blank' /> */}
                                    <a className={styles['links-2']} href='http://www.12377.cn' target='_blank' title='国家网信办' />
                                    <a className={styles['links-3']} href='http://bszs.conac.cn/sitename?method=show&id=1473A6A802047AD7E053012819ACED67' target='_blank' title='事业单位' />
                                    <a className={styles['links-4']} href='http://gaj.gz.gov.cn/gsmpro/web/serviceitem/web_alert_view.html' target='_blank' title='网上报警' />
                                </div>
                                <dl className={styles['copy-right']}>
                                    <dt>
                                        <span>&#169;广东广播电视台</span> 丨
                                        <a href='http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010402000408' target='_blank' >
                                            <div className={styles.beian}></div>
                                            粤公网安备 44010402000408号
                                        </a>
                                    </dt>
                                    <dt>
                                        <a href='http://beian.miit.gov.cn/' target='_blank' >粤ICP备11108494号</a> 丨
                                        信息网络传播视听节目许可证号：1905119
                                    </dt>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
