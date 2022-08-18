import React from 'react';
import PropTypes from 'prop-types';
import ImageLoad from 'Components/ImageLoad';
import './components/PlayNext';
import './components/PlayPrev';
import styles from './index.less';

/**
 * ModuleName: 广播播放组件
 *
 * Author: 赖昌荣
 * use: [ 用于广播详情页音频播放，UI采用videoJs ]
 *
 */
class AudioPlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 正常音频播放结束
            isEnded: false,
            // 广告结束
            isAdEnded: false,
            // 广告时间
            adTime: 0
        };
        this.myPlayer = undefined;
    }

    componentDidMount() {
        const { isLiving } = this.props;
        const _this = this;
        const videoJs = require('video.js').default;
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
            'You aborted the media playback': '音频播放被终止',
            'A network error caused the media download to fail part-way.': '网络错误导致音频下载中途失败。',
            'The media could not be loaded, either because the server or network failed or because the format is not supported.': '音频因格式不支持或者服务器或网络的问题无法加载。',
            'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.': '由于音频文件损坏或是该音频使用了你的浏览器不支持的功能，播放终止。',
            'No compatible source was found for this media.': '无法找到此音频兼容的源。',
            'The media is encrypted and we do not have the keys to decrypt it.': '音频已加密，无法解密。'
        });
        const myPlayer = videoJs('video', {
            controls: true,
            language: 'zh-CN',
            autoplay: true,
            controlBar: {
                children: [
                    { name: 'playToggle' }, // 播放按钮
                    // { name: 'currentTimeDisplay' }, // 当前已播放时间
                    { name: 'volumePanel' }, // 音量控制
                    { name: 'progressControl' }, // 点播流进度条
                    ...(isLiving ? [] : [
                        { name: 'currentTimeDisplay' }, // 当前已播放时间
                        { name: 'durationDisplay' }, // 总时长
                        { name: 'playPrev' }, // 上一首
                        { name: 'playNext' }, // 下一首
                    ])
                ]
            }
        }, function () {
            this.on('play', _this.handleOnPlay);
            this.on('ended', _this.handleOnEnded);
            this.on('error', _this.handleOnError);
            this.on('playPrev', _this.handleOnPlayPrev);
            this.on('playNext', _this.handleOnPlayNext);
        });
        this.myPlayer = myPlayer;
    }

    /** 播放地址变更,记录旧地址的播放时长 */
    componentDidUpdate = (oldProps) => {
        const { videoUrl } = this.props;
        if (videoUrl && oldProps.videoUrl != videoUrl) {
            // this.handleSetHistory(oldProps.videoUrl, this.myPlayer.currentTime());
            this.handlePlayUrl();
        }
    }

    componentWillUnmount() {
        if (this.myPlayer) {
            this.myPlayer.dispose();
        }
    }

    /** 播放当前链接 */
    handlePlayUrl = () => {
        const { poster, videoUrl, playTime } = this.props;
        this.myPlayer.poster(poster);
        this.myPlayer.src(videoUrl);
        this.myPlayer.controls(true);
    }

    handleOnPlay = () => {
        this.setState({ isEnded: false });
    }

    handleOnPlayPrev = async () => {
        const { onPlayPrev } = this.props;
        onPlayPrev && onPlayPrev();
    }

    handleOnPlayNext = () => {
        const { onPlayNext } = this.props;
        onPlayNext && onPlayNext();
    }

    /** 音频播放完毕 */
    handleOnEnded = () => {
        const { isAdEnded } = this.state;
        const { videoUrl, onEnd = _ => null } = this.props;
        if (isAdEnded) {
            this.setState({ isEnded: true });
            localStorage.removeItem(videoUrl);
            onEnd();
        } else {
            onEnd();
            this.setState({ isAdEnded: true });
            this.handlePlayUrl();
        }
    }

    /** 音频播放错误 */
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

    render() {
        const {
            className,
            title,
            logoUrl,
            slogan,
            videoUrl,
            isLiving,
            isReview
        } = this.props;

        const url = videoUrl;
        const isHls = url.indexOf('.m3u8') >= 0;
        return (
            <div className={[styles['audio-play'], className, 'audio-play'].join(' ')}>
                <video
                    id='video'
                    className={`video-js ${isLiving ? 'is-living' : ''}`}
                    autoPlay='autoplay'
                    style={{ width: '100%', height: '100%' }}
                    data-setup='{}'
                >
                    <source src={url} type={isHls ? 'application/x-mpegURL' : 'video/mp4'} />
                </video>

                <div className={styles['custom-play']}>
                    <div className={styles['video-info']}>
                        <div className={styles.logo} style={{ width: 75, height: 75 }}>
                            <ImageLoad src={logoUrl}/>
                        </div>
                        <div style={{
                            display: 'flex', height: 75, flexDirection: 'column', justifyContent: 'space-around'
                        }}>
                            <h3 className={styles['ellipsis-title']}>{title}</h3>
                            <p>{slogan}</p>
                            {isLiving && <div className={styles['is-living']}>
                                直播中
                            </div>}

                            {isReview && <div className={styles['is-review']}>
                                回顾
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AudioPlay.propTypes = {
    // 海报
    poster: PropTypes.string,
    // 音频地址
    videoUrl: PropTypes.string,
    // 不设置播放记录
    noHistory: PropTypes.bool,
    // 播放结束
    onEnd: PropTypes.func,
    // 有广告,初始化不能设播放时间,音频地址变更要重新播广告
    hasAd: PropTypes.bool,
};

export default AudioPlay;
