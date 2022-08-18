import React from 'react';
import PropTypes from 'prop-types';

import 'Public/css/theme/video-js.less';

import './videoAdComponent';

import VideoContribAds from './video-contrib-ads';
import styles from './index.less';

const videoJs = require('video.js').default;

require('videojs-contrib-ads');

/**
 * ModuleName: 视频广告播放组件
 *
 * Author: laichangrong
 * use: [ 用于视频详情页视频播放，UI采用videoJs ]
 *
 */
class VideoPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 正常视频播放结束
            isEnded: false
        };
        this.myPlayer = undefined;
    }

    endLinearAdMode = () => {
        this.myPlayer.controls(true);
        this.myPlayer.ads.endLinearAdMode();
    }

    async componentDidMount() {
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
        this.myPlayer = videoJs('video', {
            controls: true,
            language: 'zh-CN',
            autoplay: true,
            videoAd: {},
        }, function () {
            this.videoAds = new VideoContribAds(this, {
                columnPk: _this.props.columnPk
            }); // init 广告插件
            this.on('play', _this.handleOnPlay);
            this.on('ended', _this.handleOnEnded);
            this.on('error', _this.handleOnError);
            this.on('timeupdate', _this.handleOnTimeupdate);
        });

        window.addEventListener('beforeunload', this.handleSaveTime);
    }

    /** 播放地址变更,记录旧地址的播放时长 */
    componentDidUpdate = (oldProps) => {
        // this.myPlayer.src('');
        const { videoUrl } = this.props;
        if (videoUrl && oldProps.videoUrl !== videoUrl) {
            this.handleSetHistory(oldProps.videoUrl, this.myPlayer.currentTime());
            this.myPlayer.src(videoUrl);
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

    handleOnPlay = () => {
        console.log('onplay');
        if (this.myPlayer.ads.isInAdMode()) {
            this.myPlayer.pause();
        }
        this.setState({ isEnded: false });
    }

    /** 视频播放完毕 */
    handleOnEnded = () => {
        const { onEnd = _ => null } = this.props;
        console.log('video is End');
        this.myPlayer.ads.startLinearAdMode();
        onEnd();
    }

    /** 视频播放错误 */
    handleOnError = (e) => {
        const { onError = _ => null } = this.props;
        onError(e);
    }

    /* 视频播放时 */
    handleOnTimeupdate = (e) => {}

    render() {
        const {
            className,
            poster,
            videoUrl,
            loop = false,
        } = this.props;

        const url = videoUrl;
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
                    loop={loop}>
                    <source src={url} type={isHls ? 'application/x-mpegURL' : 'video/mp4'} />
                </video>
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
    // 前贴广告
    preAd: PropTypes.object,
    // 后贴广告
    afterAd: PropTypes.object
    // // 有广告,初始化不能设播放时间,视频地址变更要重新播广告
    // hasAd: PropTypes.bool,
};

export default VideoPlay;
