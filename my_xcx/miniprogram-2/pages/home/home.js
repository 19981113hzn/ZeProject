// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    heightTemp: '',
    triggered: false,
    userInfo: {}, // 用户信息
    statusBarHeight: 0, //状态栏高度
    titleBarHeight: 0, //导航栏高度
    moduleArr: [{
      icon: 'jyg_new.png',
      url: '/homePage/pages/manuscripts/manuscriptslist/manuscriptslist?type=0',
      title: '接约稿'
    }, {
      icon: 'icon_add_recommend@2x.png',
      url: '/homePage/pages/manuscripts/manuscriptslist/manuscriptslist?type=1',
      title: '画师自荐'
    }, {
      icon: 'fyg_new.png',
      url: '/homePage/pages/publishProject/publishProject',
      title: '发约稿'
    }, {
      icon: 'zhs_new.png',
      url: '/homePage/pages/paintersList/paintersList',
      title: '找画师'
    }, {
      icon: 'kzp_new.png',
      url: '/homePage/pages/worksList/worksList',
      title: '看作品'
    }], //模块入口
    list: [],
    bannerIdx: 0,
    newArr: [1, 1, 1], //最新约稿
    currentSwiper: 0, //当前显示约稿
    isShowLoginTips: false,
    scrollTop: 0,
    topicList: [], //话题列表
    tabData: {
      select: 1,
      list: [{
          idx: 0,
          txt: '关注'
        },
        {
          idx: 1,
          txt: '热门'
        },
        {
          idx: 2,
          txt: '最新'
        }
      ]
    }, //社区列表tab
    isShowSheet: false, //社区弹窗
    currentDynamic: {}, //社区弹窗详情
    tabHeight: 0, //社区列表tab高度
    isTabFixed: false, //是否固定社区列表tab
    communityList: [], //社区动态列表
    needToTop: false, //是否返回顶部
    refreshFlag: false
  },

  // 删除
  onDelete() {
    let {
      post_id,
      idx
    } = this.data.currentDynamic, _this = this
    wx.showModal({
      content: "要删除动态吗？",
      confirmText: "删除",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          app.rp({
            url: "/app/v1/community/post/del",
            data: {
              post_id
            }
          }).then(res => {
            app.wt(res.data.info)
            _this.setData({
              [`communityList[${idx}].hidden`]: true
            })
          })
        }
      }
    })
  },

  // 举报
  toReport() {
    let {
      post_id
    } = this.data.currentDynamic
    wx.navigateTo({
      url: `/communityPage/page/report/report?type=0&post_id=${post_id}`,
    })
  },

  // 切换sheet
  changeSheet(e) {
    if (e && e.type == 'showMenu') {
      this.setData({
        currentDynamic: e.detail
      })
    }
    this.setData({
      isShowSheet: !this.data.isShowSheet
    })
  },

  // 切换banner
  changeBanner(e) {
    this.setData({
      bannerIdx: e.detail.current
    })
  },

  // 去登录
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 返回顶部
  backToTop() {
    this.setData({
      scrollTop: 0,
      isTabFixed: false
    })
  },

  // 跳转活动页
  dealWebView(link) {
    app.wl()
    app.rg({
      url: "/app/v1/token",
      hiddenLogin: true
    }).then(res => {
      let url = `${link}${link.indexOf('?')==-1?'?token=':'&token='}${res.data.data.token}`
      wx.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
      })
    }).catch(err => {
      wx.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(link)}`,
      })
    })
  },

  // 页面跳转
  jumpPage(e) {
    let link = e.currentTarget.dataset.link
    link.indexOf('http') == 0 ? this.dealWebView(link) : wx.navigateTo({
      url: link,
      fail(err) {}
    })
  },

  // 点击模块
  clickModule(e) {
    let idx = e.currentTarget.dataset.idx,
      item = this.data.moduleArr[idx]
    if (idx === 2) {
      if (this.data.userInfo.user.uid) {
        wx.navigateTo({
          url: item.url,
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    } else {
      wx.navigateTo({
        url: item.url,
      })
    }
  },

  /**
   * 跳转约稿详情
   */
  jump: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/homePage/pages/manuscripts/manuscriptsdetails/manuscriptsdetails?id=' + id
    })
  },

  // 获取当前显示约稿滑块下标
  bindchange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  // 设置面板
  setPanel(e) {
    let obj = e.detail,
      item = this.data.list[obj.idx].bottomPanel
    item = obj.item
    item.current = obj.current + 1
    this.setData({
      [`list[${obj.idx}].bottomPanel`]: item
    })
  },

  // 获取首页数据
  getHomeData() {
    app.rg({
      url: '/app/v1/config/index',
    }).then(res => {
      let data = res.data.data
      // data.recommend_artists.forEach(v => {
      //   v.bottomPanel = v.detailed_show_works[0]
      //   v.bottomPanel.current = 1
      // })
      // let arr = []
      // data.newest_projects.forEach(v => {
      //   arr.push(1)
      // })
      this.setData({
        detail: data,
        // list: data.recommend_artists,
        // newArr: arr
      })
      setTimeout(() => {
        this.setData({
          triggered: false
        })
      }, 1000)
    })
  },

  // 跳转约稿列表页面
  manuscriptPage: function () {
    wx.navigateTo({
      url: "/homePage/pages/manuscripts/manuscriptslist/manuscriptslist"
    })
  },

  // 页面滚动
  bindscroll(ev) {
    let _this = this;
    if (Math.abs(ev.detail.scrollTop - this.data.scrollTop) <= 50) return
    //判断浏览器滚动条上下滚动
    if (ev.detail.scrollTop > this.data.scrollTop) {
      this.setData({
        isShowLoginTips: false
      })
    } else {
      this.setData({
        isShowLoginTips: _this.data.userInfo.user.uid ? false : true
      })
    }
    this.setData({
      isTabFixed: ev.detail.scrollTop >= this.data.tabHeight - 43 ? true : false
    })
    this.data.scrollTop = ev.detail.scrollTop
  },

  toRelease() {
    let {
      userInfo
    } = this.data, url = !userInfo.user.uid ? '/pages/login/login' : '/communityPage/page/releaseDynamic/releaseDynamic'
    wx.navigateTo({
      url,
    })
  },

  // 获取用户信息
  getUserInfo() {
    app.rg({
      url: '/app/v1/login/status'
    }).then(res => {
      let data = res.data.data,
        obj = wx.getStorageSync('userInfo') || {}
      obj.uid = data.user.uid
      wx.setStorageSync('userInfo', obj)
      this.setData({
        userInfo: data,
        isShowLoginTips: data.user.uid ? false : true
      })
    })
  },

  // 切换社区tab
  switchCommunityTab(e) {
    let idx = e.currentTarget.dataset.idx
    this.data.communityList = []
    this.data.finished = false
    this.setData({
      [`tabData.select`]: idx
    }, () => {
      // this.backToTop()
      this.getCommunityList()
    })
  },

  // 获取社区信息
  getCommunityInfo() {
    let _this = this
    const communityQuery = wx.createSelectorQuery()
    communityQuery.select('#tab').boundingClientRect()
    communityQuery.exec(function (res) {
      // console.log(res);
      _this.data.tabHeight = res[0].top - 43
    })
  },

  // 获取话题列表
  getTopicList() {
    app.rg({
      url: '/app/v1/community/topic/list',
      data: {
        npp: 3,
        page: 1
      }
    }).then(res => {
      let data = res.data.data
      this.setData({
        topicList: data.topics
      }, () => {
        // let {tabHeight,isTabFixed} = this.data
        if (!this.data.isTabFixed) {
          this.getCommunityInfo()
        }
      })
    })
  },

  // 获取社区动态列表
  getCommunityList() {
    let {
      tabData,
      finished,
      communityList
    } = this.data
    if (finished) return
    app.rg({
      url: '/app/v1/community/index/post_list',
      data: {
        order_by: tabData.select == 0 ? 'follow' : tabData.select == 1 ? 'hot' : 'newest',
        since_id: communityList.length == 0 ? '' : communityList[communityList.length - 1].post_id,
        npp: 20
      }
    }).then(res => {
      let data = res.data.data
      if (this.data.communityList.length == 0) {
        this.backToTop()
      }
      this.setData({
        needToTop: false,
        finished: data.posts.length < 20 ? true : false,
        communityList: communityList.concat(data.posts)
      })
    })
  },

  showEgg(e) {
    this.setData({
      colored_egg: e.detail
    })
    this.selectComponent('#egg').showEggDialog()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopicList()
    this.getHomeData()
    this.data.finished = false
    this.data.communityList = []
    this.getCommunityList()
    wx.getSystemInfo({
      success: (res) => { 
        this.setData({
          screenHeight: res.screenHeight,
          statusBarHeight: res.statusBarHeight,
          titleBarHeight: wx.getMenuButtonBoundingClientRect().bottom + wx.getMenuButtonBoundingClientRect().top - (res.statusBarHeight * 2)
        })
      }
    })
    this.setData({
      refreshFlag: false
    })
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
    if (this.data.needToTop) {
      this.data.finished = false
      this.data.communityList = []
      this.getCommunityList()
      if (this.data.colored_egg) {
        this.selectComponent('#egg').showEggDialog()
      }
    }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        isActive: 0
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
  onShareAppMessage: function (res) {
    if (res.from != 'menu') {
      let {
        currentDynamic
      } = this.data, params = {}
      params = {
        title: currentDynamic.content.text,
        path: `/communityPage/page/dynamicDetails/dynamicDetails?postId=${currentDynamic.post_id}&isShow=true`
      }
      return params
    }
  }
})