const videoJs = require('video.js').default;

const Component = videoJs.getComponent('Component');


// videoJs.extend方法用来实现继承,videoJs中大部分组件直接或间接的继承自Component
/**
 * 上一首
 * @extends Component
 */
class PlayNext extends Component {
    // The constructor of a component receives two arguments: the
    // player it will be associated with and an object of options.
    // 这个构造函数接收两个参数：
    // player将被用来关联options中的参数
    /**
     * constructor
     * @param {Player} player  the player
     * @param {any} options   the options
     */
    constructor(player, options = {}) {
        // 调用父类的构造方法
        super(player, options);
    }

    // The `createEl` function of a component creates its DOM element.
    // 创建一个DOM元素
    /**
     * creatEl
     * @returns {*} zzf add
     */
    createEl() {
        return super.createEl('div', {

            // Prefixing classes of elements within a player with "vjs-"
            // is a convention used in Video.js.
            // 给元素加vjs-开头的样式名
            className: 'vjs-play-next vjs-control',
            onclick: () => {
                this.player_.trigger('playNext');
            }
        });
    }

    /**
     * build css class
     * @returns {string} the class
     */
    buildCSSClass() {
        return 'vjs-play-next';
    }

    /**
     * when the languagechange
     */
    handleLanguagechange() {
    }
}

PlayNext.prototype.controlText_ = 'play-next';
// Register the component with Component, so it can be used in players.
// 在component中注册这个组件，才可以使用
Component.registerComponent('PlayNext', PlayNext);

export default PlayNext;
