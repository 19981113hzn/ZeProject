import React from 'react';
import { NEWS_ROUTE, TOPIC_ROUTE } from 'Constants/type';

import styles from './index.less';

/**
 * PageName: 滚动新闻
 */
class RollingNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            speed: 30
        };
        this.Marquee = undefined;
    }

    componentDidMount() {
        this.handleMarqueeStart();
    }

    componentWillUnmount() {
        this.handleMarqueeStop();
    }

    handleMarqueeStop = () => {
        this.Marquee && clearInterval(this.Marquee);
    }

    handleMarqueeStart = () => {
        const { speed } = this.state;
        const { marquee, marqueeI, marqueeII } = this.refs;
        if (marqueeI.clientWidth > marquee.clientWidth) {
            this.Marquee && clearInterval(this.Marquee);
            this.Marquee = setInterval(this.handleMarquee, speed);
        } else {
            marqueeII.style.display = 'none';
        }
    }

    handleMarquee = () => {
        const { marquee, marqueeII } = this.refs;
        if (marquee.scrollLeft >= marqueeII.offsetWidth) {
            marquee.scrollLeft = 0;
        } else {
            marquee.scrollLeft += 1;
        }
    }

    handleOnClick = (news) => {
        const { id, contentType, objectType } = news;
        switch (`${objectType}`) {
            case '0':
                window.open(`/${NEWS_ROUTE[contentType]}/${id}`);
                break;
            case '1':
                window.open(`/${TOPIC_ROUTE[contentType]}/${id}`);
                break;
            default:
                break;
        }
    }

    render() {
        const { sourceData } = this.props;
        return (
            <div className={styles['rolling-news-container']}>
                <div className={styles.title}>滚动新闻：</div>
                <div
                    className={styles.marquee}
                    onMouseOver={this.handleMarqueeStop}
                    onMouseOut={this.handleMarqueeStart}
                    ref='marquee'
                >
                    <div className={styles['marquee-content']} ref='marqueeI'>
                        {sourceData.map((item, i) => (
                            <div className={styles['marquee-item']} key={i}>
                                <a title={item.title} onClick={() => { this.handleOnClick(item); }}>{item.title}</a>
                            </div>
                        ))}
                    </div>
                    <div className={styles['marquee-content']} ref='marqueeII'>
                        {sourceData.map((item, i) => (
                            <div className={styles['marquee-item']} key={i}>
                                <a title={item.title} onClick={() => { this.handleOnClick(item); }}>{item.title}</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default RollingNews;
