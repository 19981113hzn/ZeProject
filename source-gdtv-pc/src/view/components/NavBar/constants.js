export const menu = [
    {
        name: '看电视',
        className: 'menu-tv',
        icon: require('../../statics/images/menu_tv.png'),
        url: '/tvChannelDetail/43',
        newBlank: true
    },
    {
        name: '听广播',
        className: 'menu-radio',
        url: '/audioChannelDetail/85',
        icon: require('../../statics/images/menu_radio.png'),
        newBlank: true
    },
    {
        name: '节目库',
        className: 'menu-programs-all',
        icon: require('../../statics/images/menu_programs_all.png'),
        url: '/tvPrograms',
        newBlank: true
    },
    {
        name: '节目表',
        className: 'menu-programs',
        icon: require('../../statics/images/menu_programs.png'),
        url: 'http://epg.gdtv.cn',
        newBlank: true
    }
];
