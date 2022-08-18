import { addInnerAdCount, getPreAfterAd } from '../../services';
import { toJson } from '../../utils/utils';
import { AD_TYPE, NEWS_ROUTE } from '../../constants/type';

// eslint-disable-next-line consistent-return
const computedAdLink = ads => {
    const { target, targetType, contentType } = ads;
    switch (`${targetType}`) {
        case `${AD_TYPE.NONE}`:
            break;
        case `${AD_TYPE.OUTLINK}`:
            return target;
        case `${AD_TYPE.NEWS}`: {
            try {
                return `/${NEWS_ROUTE[contentType]}/${target}`;
            } catch (e) {
                return '';
            }
        }
        case `${AD_TYPE.TOPIC}`:
            return `/topic/${target}`;
        default:
            break;
    }
};

export default class VideoContribAds {
    constructor(player, options) {
        this.player = player;
        this.options = options;
        this.ads = {};

        this.player.ads({
            debug: true,
            prerollTimeout: 500,
            postrollTimeout: 1000,
            timeout: 500
        }); // initialize videojs-contrib-ads


        this.initAds();

        // request ads whenever there's new video content
        this.player.on('contentchanged', () => {
            console.log('contentchanged');
            this.player.trigger('adsready');
        });
    }

    fetchAds() {
        const { columnPk } = this.options;
        if (!columnPk) return Promise.resolve({});
        return getPreAfterAd({ columnPk });
    }

    getVideoUrl(ads) {
        if (!ads) ads = {};
        const { videoInfo } = ads;
        const { playUrl } = toJson(videoInfo);
        return toJson(playUrl)?.hd;
    }

    getPosterUrl(ads) {
        if (!ads) ads = {};
        const { images } = ads;
        const { web } = toJson(images);
        return web;
    }

    bindAdListener(ads) {
        const {
            playSecond = 0, skipSecond = 0,
            cornerMark, images, pk, filterSecond
        } = ads;

        this.ads.pk = pk;
        this.ads.canSkipAd = skipSecond > 0;
        this.ads.adLink = computedAdLink(ads);
        this.ads.images = toJson(images);
        this.ads.cornerMark = toJson(cornerMark);
        this.ads.filterSecond = filterSecond;
        this.ads.skipSecond = skipSecond;
        this.ads.isEnd = false;

        this.initAdsDuration(playSecond);
    }

    initAdsDuration(playSecond) {
        this.ads.playSecond = playSecond;
        this.ads.skipSecond -= 1;
        if (playSecond >= 1) {
            this.sto = setTimeout(() => {
                this.initAdsDuration(playSecond - 1);
            }, 1000);
        } else {
            this.player.trigger('adended');
            this.ads.isEnd = true;
        }
        this.player.videoAd.updateComponent(this.ads);
    }

    async initAds() {
        const ads = await this.fetchAds();
        const duration = await new Promise(resolve => {
            this.player.one('loadedmetadata', () => resolve(this.player.duration()));
        });
        const isNeedShowAd = ad => ad && ((ad.filterSecond === 0) || (duration >= ad.filterSecond));

        // 前贴广告
        ads.preAd && isNeedShowAd(ads.preAd) && this.player.on('readyforpreroll', () => {
            this.player.ads.startLinearAdMode();
            this.player.controls(false);
            // play your linear ad content
            this.player.src(this.getVideoUrl(ads.preAd));
            addInnerAdCount({ pks: ads.preAd.pk, type: 1 });
            this.player.poster(this.getPosterUrl(ads.preAd));

            this.bindAdListener(ads.preAd);

            // send event when ad is playing to remove loading spinner
            this.player.on('adplaying', () => {
                this.player.trigger('ads-ad-started');
            });

            // resume content when all your linear ads have finished
            this.player.on('adended', () => {
                console.log('adended');
                this.player.ads.endLinearAdMode();
                this.player.controls('true');
                this.ads.isEnd = true;
                this.player.videoAd.updateComponent(this.ads);
                clearTimeout(this.sto);
            });
        });

        /*
        * To implement midroll ads, you might listen to `timeupdate` events to monitor the progress of the content video's playback. To implement postroll ads, you'd listen to the `readyforpostroll` event.
        * 要实现中期广告，您可以收听“timeupdate”事件以监控内容视频的播放进度。要实现后贴广告，您需要收听“readyforpostroll”事件。
        *  */

        // 后贴广告
        ads.afterAd && isNeedShowAd(ads.afterAd) && this.player.on('readyforpostroll', () => {
            this.player.ads.startLinearAdMode();
            // play your linear ad content
            this.player.controls(false);
            this.player.src(this.getVideoUrl(ads.afterAd));
            addInnerAdCount({ pks: ads.afterAd.pk, type: 1 });
            this.player.poster(this.getPosterUrl(ads.afterAd));

            this.bindAdListener(ads.afterAd);

            // send event when ad is playing to remove loading spinner
            // http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4
            this.player.on('adplaying', () => {
                this.player.trigger('ads-ad-started');
            });

            // resume content when all your linear ads have finished
            this.player.on('adended', () => {
                console.log('adended');
                this.player.ads.endLinearAdMode();
                this.player.controls('true');
                this.ads.isEnd = true;
                this.player.videoAd.updateComponent(this.ads);
                clearTimeout(this.sto);
            });
        });


        this.player.trigger('adsready');
    }
}
