// component/tabBar/tabBar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isActive: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList: [{
        icon: "../images/tab/home_off@2x.png",
        clickIcon: "../images/tab/home_on@2x.png",
        url: "/pages/home/home",
        txt: "首页"
      },
      {
        icon: "../images/tab/mine_off@2x.png",
        clickIcon: "../images/tab/mine_on@2x.png",
        url: "/pages/my/my",
        txt: "我的"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击事件
    onClick(e) {
      let {
        item,
        idx
      } = e.currentTarget.dataset;
      if (idx == this.data.isActive) return
      wx.switchTab({
        url: item.url
      })
    }
  }
})