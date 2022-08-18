// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImg: '../../images/head_default.png',
    isLogin: false, //是否登录
    moduleList: [{
      value: '我的工作板',
      url: '/pages/workBoard/workBoard',
      showDot: false,
      icon: "../../images/mine_board@2x.png"
    }, {
      value: '我的消息',
      showDot: false,
      url: '/myPage/pages/information/information',
      icon: "../../images/mine_im@2x.png"
    }, {
      value: '我的钱包',
      showDot: false,
      url: '/myPage/pages/paintersWallet/paintersWallet',
      icon: "../../images/mine_wallet@2x.png"
    }],
    labelList: [{
      value: '上传作品',
      operation: true
    }, {
      value: '我的奖品',
      url: '/myPage/pages/myPrize/myPrize'
    }, {
      value: '账户安全',
      url: '/myPage/pages/accountSecurity/accountSecurity'
    }, {
      value: "画师认证",
      url: '/myPage/pages/painterIdentify/painterIdentify'
    }, {
      value: '实名认证',
      url: '/myPage/pages/realName/realName'
    }, {
      value: '社区公约',
      convention: true
    }],
    pageInfo: {},
    isShowDot: false
  },

 



  // 个人主页
  toHomePage() {
    wx.navigateTo({
      url: '/myPage/pages/homepage/homepage',
    })
  },



  // 处理跳转事件
  dealJumpEven(e) {
    let {
      idx,
      type
    } = e.currentTarget.dataset, jumpType = this.data.pageInfo.workstation_jump_type == 1 ? 1 : 0, {
      labelList,
      moduleList
    } = this.data
    if (type == 1 && 'convention' in labelList[idx]) {
      wx.navigateTo({
        url: `/pages/webview/webview?url=${wx.getStorageSync('agreement').community_convention}`,
      })
      return
    }
    if (!this.data.isLogin) return wx.navigateTo({
      url: '/pages/login/login',
    })
    if (type == 1 && 'operation' in labelList[idx]) {
      this.uploadEven()
      return
    }
    let url = type == 0 ? moduleList[idx].url : labelList[idx].url
    url = url.indexOf('/pages/workBoard/workBoard') != -1 ? `${url}?type=${jumpType}` : url
    wx.navigateTo({
      url
    })
  },

  // 退出
  logout() {
    console.log('退出');
    app.rp({
      url: "/app/v1/login/logout"
    }).then(res => {
      wx.removeStorageSync(app.saveSid())
      wx.removeStorageSync(app.saveToken())
      wx.removeStorageSync('userInfo')
     
      this.setData({
        isLogin: false
      })
    })
  },

  // 页面跳转
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },

  // 我的页面信息
  getMyPage() {
    app.rg({
      url: "/app/v1/account/mypage",
      hiddenToast: true
    }).then(res => {
      let data = res.data.data.account,
        list = this.data.moduleList;
      list[0].showDot = data.has_new_progress
      list[1].showDot = data.has_unread_msg > 0 ? true : false
      this.setData({
        ['pageInfo.workstation_jump_type']: data.workstation_jump_type,
        moduleList: list
      },()=>{
        wx.setStorageSync('userInfo', this.data.pageInfo)
      })
    })
  },

  // 获取个人信息
  getUserInfo() {
    app.rg({
      url: '/app/v1/session',
      hiddenToast: true
    }).then(res => {
      let data = res.data.data.session
      if (!data.user) {
        this.setData({
          isLogin: false
        })
      } else {
        this.setData({
          isLogin: true,
          pageInfo: data.user,
        }, () => {
          let _this = this
          this.getMyPage()
       
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        isActive: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return app.getShareData()
  // }
})