/* eslint-disable class-methods-use-this */
import { addInnerAdCount } from '../../services';

const videoJs = require('video.js').default;

const Component = videoJs.getComponent('Component');

// videojs.extend方法用来实现继承,videojs中大部分组件直接或间接的继承自Component
/**
 * Video Ad Component
 * @extends Component
 */
class VideoAd extends Component {
    // The constructor of a component receives two arguments: the
    // player it will be associated with and an object of options.
    // 这个构造函数接收两个参数：
    // player将被用来关联options中的参数
    /**
     * constructor
     * @param {Player} player the player
     * @param {any} options the options
     */
    constructor(player, options) {
        // 调用父类的构造方法
        super(player, options);
        this.state = {};
    }

    // The `createEl` function of a component creates its DOM element.
    // 创建一个DOM元素
    /**
     * creatEl
     */
    createEl() {
        return super.createEl('div', {

            // Prefixing classes of elements within a player with "vjs-"
            // is a convention used in Video.js.
            // 给元素加vjs-开头的样式名
            className: 'vjs-video-ad'
        });
    }

    /**
     * 更新组件状态
     * @param ads 广告对象
     */
    updateComponent(ads) {
        videoJs.dom.emptyEl(this.el());
        if (!ads) return;
        // 水印标识
        const { corner, colorinhex, cornerBackgroundColor } = ads.cornerMark;
        const Corner = videoJs.dom.createEl('div', {
            // Prefixing classes of elements within a player with "vjs-"
            // is a convention used in Video.js.
            // 给元素加vjs-开头的样式名，是videojs内置样式约定俗成的做法
            className: 'vjs-ads-corner',
            style: {
                backgroundColor: cornerBackgroundColor,
                color: colorinhex
            }
        });
        if (corner) videoJs.dom.appendContent(Corner, corner);

        const DetailButton = videoJs.dom.createEl('div', {
            // Prefixing classes of elements within a player with "vjs-"
            // is a convention used in Video.js.
            // 给元素加vjs-开头的样式名，是videojs内置样式约定俗成的做法
            className: 'vjs-ads-detail-button',
            onclick: (e) => {
                window.open(ads.adLink, '_blank');
                addInnerAdCount({ pks: ads.pk, type: 2 });
                e.stopPropagation();
            }
        });
        videoJs.dom.appendContent(DetailButton, '了解详情');

        const Countdown = videoJs.dom.createEl('div', {
            // Prefixing classes of elements within a player with "vjs-"
            // is a convention used in Video.js.
            // 给元素加vjs-开头的样式名，是videojs内置样式约定俗成的做法
            className: 'vjs-ads-countdown',
            onclick: e => {
                if (ads.canSkipAd && ads.skipSecond <= 0) {
                    this.player_.trigger('adended');
                }
            },
        });

        const CloseButton = videoJs.dom.createEl('span', {
            // Prefixing classes of elements within a player with "vjs-"
            // is a convention used in Video.js.
            // 给元素加vjs-开头的样式名，是videojs内置样式约定俗成的做法
            className: 'vjs-ads-close',
        });


        const calcCountdownText = () => {
            if (ads.skipSecond > 0) {
                return `<span><span class="vjs-ads-second">${ads.skipSecond}&nbsp;</span>秒后可跳过广告</span>`;
            }
            if (ads.canSkipAd) {
                return `<span><span class="vjs-ads-second">${ads.playSecond}</span>&nbsp;|&nbsp;跳过广告</span>`;
            }
            return `<span><span class="vjs-ads-second">${ads.playSecond}&nbsp;</span>秒</span>`;
        };


        // videoJs.dom.prependTo(videoJs.dom.normalizeContent(countdownText), Countdown)
        Countdown.innerHTML = calcCountdownText();
        if (ads.canSkipAd && ads.skipSecond <= 0) videoJs.dom.appendContent(Countdown, CloseButton);

        // Use Video.js utility DOM methods to manipulate the content
        // of the component's element.
        // 使用Video.js提供的DOM方法来操作组件元素

        if (this.el()) {
            videoJs.dom[ads.isEnd ? 'addClass' : 'removeClass'](this.el(), 'vjs-ad-end');
            if (!ads.isEnd) {
                this.el().style.backgroundImage = ads.images && ads.images.web ? `url("${ads.images.web}")` : '';
                this.el().appendChild(Corner);
                this.el().appendChild(Countdown);
                if (ads.adLink) this.el().appendChild(DetailButton);
            }
        }
    }

    /**
     * build css class
     * @returns {string} the class
     */
    buildCSSClass() {
        return 'vjs-video-ad';
    }

    /**
     * when the languagechange
     */
    handleLanguagechange() {
    }
}

VideoAd.prototype.controlText_ = 'video-ad';
// Register the component with Component, so it can be used in players.
// 在component中注册这个组件，才可以使用

Component.registerComponent('videoAd', VideoAd);
export default VideoAd;
