import React from 'react';
import PropTypes from 'prop-types';
import { AD_URL, AD_LINK } from 'Constants/hardCode';

// import 'Public/css/theme/video-js.less';
import styles from './index.less';

/**
 * ModuleName: 视频播放组件
 *
 * Author: xuchunhua
 * use: [ 用于视频详情页视频播放，UI采用videoJs ]
 *
 */
class VideoPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 正常视频播放结束
            isEnded: false,
            // 广告结束
            isAdEnded: false,
            // 广告时间
            adTime: 0
        };
        this.myPlayer = undefined;
    }

    componentDidMount() {
        const {
            videoUrl,
            playTime,
            hasAd,
        } = this.props;
        const videoJs = require('videojs');
        const _this = this;
        videoJs.addLanguage('zh-CN', {
            Play: '播放',
            Pause: '暂停',
            'Stream Type': '媒体流类型',
            LIVE: '直播',
            Loaded: '加载完毕',
            Progress: '进度',
            Fullscreen: '全屏',
            'Non-Fullscreen': '退出全屏',
            Mute: '静音',
            Unmute: '取消静音',
            'You aborted the media playback': '视频播放被终止',
            'A network error caused the media download to fail part-way.': '网络错误导致视频下载中途失败。',
            'The media could not be loaded, either because the server or network failed or because the format is not supported.': '视频因格式不支持或者服务器或网络的问题无法加载。',
            'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.': '由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。',
            'No compatible source was found for this media.': '无法找到此视频兼容的源。',
            'The media is encrypted and we do not have the keys to decrypt it.': '视频已加密，无法解密。'
        });
        const myPlayer = videoJs('video', {
            controls: !hasAd,
            language: 'zh-CN',
            autoplay: true
        }, function () {
            this.on('play', _this.handleOnPlay);
            this.on('ended', _this.handleOnEnded);
            this.on('error', _this.handleOnError);
            this.on('timeupdate', _this.handleOnTimeupdate);
            const playPromise = this.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    const time = playTime || localStorage.getItem(videoUrl);
                    this.play();
                    if (!hasAd && time) {
                        this.currentTime(time);
                    }
                }).catch(() => {
                    console.log('play failed');
                });
            }
        });
        this.myPlayer = myPlayer;
        window.addEventListener('beforeunload', this.handleSaveTime);
    }

    /** 播放地址变更,记录旧地址的播放时长 */
    componentDidUpdate = (oldProps) => {
        const { videoUrl, hasAd } = this.props;
        if (videoUrl && oldProps.videoUrl != videoUrl) {
            this.handleSetHistory(oldProps.videoUrl, this.myPlayer.currentTime());
            if (hasAd) {
                this.setState({ isAdEnded: false });
                // 有广告要重新播广告
                this.handlePlayAd();
            } else {
                this.handlePlayUrl();
            }
        }
    }

    componentWillUnmount() {
        if (this.myPlayer) {
            this.handleSaveTime();
            this.myPlayer.dispose();
        }
    }

    /** 离开页面保存播放时长 */
    handleSaveTime = () => {
        if (this.myPlayer) {
            const { videoUrl } = this.props;
            this.handleSetHistory(videoUrl, this.myPlayer.currentTime());
            window.removeEventListener('beforeunload', this.handleSaveTime);
        }
    }

    /** 保存播放时长 */
    handleSetHistory = (url, time) => {
        if (!this.state.isEnded && !this.props.noHistory) {
            localStorage.setItem(url, time);
        }
    }

    /** 播放当前链接 */
    handlePlayUrl = () => {
        const { poster, videoUrl, playTime } = this.props;
        this.myPlayer.poster(poster);
        this.myPlayer.src(videoUrl);
        this.myPlayer.controls(true);
        const time = playTime || localStorage.getItem(videoUrl);
        if (time) {
            setTimeout(() => {
                this.myPlayer.currentTime(parseInt(time, 10));
            }, 500);
        }
    }

    handlePlayAd = () => {
        this.myPlayer.src(AD_URL);
        this.myPlayer.controls(false);
    }

    handleOnPlay = () => {
        this.setState({ isEnded: false });
    }

    /** 视频播放完毕 */
    handleOnEnded = () => {
        const { isAdEnded } = this.state;
        if (isAdEnded) {
            const { videoUrl, onEnd = _ => null } = this.props;
            this.setState({ isEnded: true });
            localStorage.removeItem(videoUrl);
            onEnd();
        } else {
            this.setState({ isAdEnded: true });
            this.handlePlayUrl();
        }
    }

    /** 视频播放错误 */
    handleOnError = (e) => {
        const { isAdEnded } = this.state;
        const { hasAd, onError = _ => null } = this.props;
        if (hasAd && !isAdEnded) {
            // 广告有问题
            this.handlePlayUrl();
            return;
        }
        onError();
    }

    handleOnTimeupdate = (e) => {
        const { isAdEnded } = this.state;
        const { hasAd } = this.props;
        if (hasAd && !isAdEnded) {
            const currentTime = parseInt(this.myPlayer.currentTime(), 10);
            const duration = parseInt(this.myPlayer.duration(), 10);
            this.setState({ adTime: duration - currentTime });
        }
    }

    render() {
        const { isAdEnded, adTime } = this.state;
        const {
            className,
            title,
            poster,
            videoUrl,
            loop = false,
            hasAd
        } = this.props;

        const url = hasAd && !isAdEnded ? AD_URL : videoUrl;
        const isHls = url.indexOf('.m3u8') >= 0;
        return (
            <div className={[styles['video-play'], className].join(' ')}>
                <video
                    id='video'
                    className='video-js vjs-big-play-centered'
                    poster={poster}
                    autoPlay='autoplay'
                    style={{ width: '100%', height: '100%' }}
                    data-setup='{}'
                    loop={loop}
                >
                    <source src={url} type={isHls ? 'application/x-mpegURL' : 'video/mp4'} />
                </video>
                {title &&
                    <div className={styles.title}>{title}</div>
                }
                {hasAd && !isAdEnded &&
                    <div className={styles['ad-container']}>
                        <div className={styles['ad-time']}>广告 {adTime}s</div>
                        <a className={styles['ad-link']} href={AD_LINK} target='_blank'>了解详情 &gt;</a>
                    </div>
                }
            </div>
        );
    }
}

VideoPlay.propTypes = {
    // 海报
    poster: PropTypes.string,
    // 视频地址
    videoUrl: PropTypes.string,
    // 不设置播放记录
    noHistory: PropTypes.bool,
    // 播放结束
    onEnd: PropTypes.func,
    // 有广告,初始化不能设播放时间,视频地址变更要重新播广告
    hasAd: PropTypes.bool,
};

export default VideoPlay;
