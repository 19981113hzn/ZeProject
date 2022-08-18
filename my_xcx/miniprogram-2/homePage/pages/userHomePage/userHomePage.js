// homePage/pages/userHomePage/userHomePage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
    userInfoHeight:0,
    page:1,
    detail: {},
    uid: '',
    name: '',
    accid: '',
    isUnfold: false,
    moreBtn: false,
    tabNav: {
      list: [{
        name: '动态',
        type: 0
      }, {
        name: '作品',
        type: 1
      }, {
        name: '约稿',
        type: 2
      }, {
        name: '评价',
        type: 3
      }],
      idx: 0
    },
    tabWidth: 0, //tab宽度
    communityList:[],
    list:[], //作品列表
    list2:[],//约稿列表
    columns: [
      [],
      []
    ],
    count:'',
    columnsHeight: [0, 0],
    communityFinished:false,
    finished:false,
  },

  // 导航栏 -- 返回
  toReturn(){
    wx.navigateBack({
      fail:() => {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    })
  },

  // 获取用户详情
  getDetail() {
    let {
      uid,
      name,
      accid
    } = this.data, obj = uid ? {
      uid,
    } : {
      accid,
    }
    app.wl()
    app.rg({
      url: '/app/v1/user/detail',
      data: {
        ...obj,
        name
      },
      hideModel: true
    }).then(res => {
      wx.hideLoading()
      let data = res.data.data
      this.setData({
        detail: data.user,
        uid: data.user.uid
      }, () => {
        this.resetData(this.data.tabNav.idx)
        this.getTextHeight()
      })
    }).catch(err => {
      wx.showModal({
        content: err,
      })
    })
  },

  // 获取社区动态列表
  getCommunityList() {
    let {uid,communityFinished,communityList} = this.data
    if(communityFinished) return
    app.rg({
      url:'/app/v1/community/user/post_list',
      data:{
        uid,
        since_id:communityList.length == 0 ? '' :communityList[communityList.length-1].post_id,
        npp:10
      }
    }).then(res => {
      let data = res.data.data.posts
      this.setData({
        communityFinished:data.length < 10 ? true : false,
        communityList:this.data.communityList.concat(data)
      })
    })
  },

  // 获取作品列表
  getList() {
    if(this.data.finished) return
    app.rg({
      url:'/app/v1/artist/works',
      data:{
        uid:this.data.uid,
        npp:30,
        page:this.data.page
      }
    }).then(res => {
      let data = res.data.data
      this.setData({
        list:this.data.list.concat(data.works),
        finished:data.works.length<30?true:false,
        count:data.count
      },() => {
        this.setList(data.works)
      })
    })
  },

  // 设置瀑布流
  setList(data) {
    console.log('data',data);
    let index = 0,
      columns = this.data.columns,
      columnsHeight = this.data.columnsHeight
      data.forEach(v => {
        // 先给第一个数组  再给第二个数组
        index = columnsHeight[1] < columnsHeight[0] ? 1 : 0
        columns[index].push(v)
        columnsHeight[index] = v.image_height * 750 / v.image_width
      })
      this.setData({
        columns:columns,
        columnsHeight:columnsHeight
      })
  },

  // 作品详情
  onClickImg(e) {
    let {index,secondIdx} = e.detail,
      item = e.detail.obj,
    idx = Number(item.index - 1),
    {avatar,name} = this.data.detail,
    {uid,page,count} = this.data,
    obj = {
      headImg:avatar,
      name:name,
      uid:uid,
      page:page,
      count:count
    }
    wx.setStorageSync('paintersWork', this.data.list)
    wx.navigateTo({
      url: `/homePage/pages/workDetails/workDetails?idx=${idx}&index=${index}&secondIdx=${secondIdx}&info=${encodeURIComponent(JSON.stringify(obj))}&type=home`,
    })
  },



  // 获取文本高度
  getTextHeight() {
    this.getTwoLineHeight().then(h => {
      // 获取位置信息
      wx.createSelectorQuery().in(this).select('.desc').boundingClientRect(res => {
        this.setData({
          isUnfold:true
        })
        if(res.height > h) {
          this.setData({
            moreBtn:true
          })
        }
        this.getUserInfoHeight().then(res=>{
          this.setData({
            userInfoHeight:res
          })
        })
      }).exec()
    })
  },

  // 用户信息高度
  getUserInfoHeight() {
    return new Promise((resolve,reject) => {
      wx.createSelectorQuery().in(this).select('.userInfo').boundingClientRect(res => {
        resolve(res.height)
      }).exec()
    })
  },

  // 切换文本
  toggleText() {
    this.setData({
      isUnfold:!this.data.isUnfold
    },() => {
      this.getUserInfoHeight().then(res => {
        this.setData({
          userInfoHeight:res
        })
      })
    })
  },

  // 
  changeSwiper(e) {
    let obj = e.detail
    if (obj.source != "touch") return
    this.setData({
      'tabNav.idx': obj.current
    }, () => {
      this.resetData(obj.current)
    })
  },

  // 重置数据
  resetData(idx) {
    this.data.communityList = []
    this.data.list2 = []
    this.data.columns = [[],[]]
    this.data.communityFinished = false
    idx == 0 ? this.getCommunityList() : idx == 1 ? this.getList() : idx == 2 ? this.getProject() : ''
  },

  // 获取两行文本高度
  getTwoLineHeight() {
    return new Promise((resolve, reject) => {
      const systemW = wx.getSystemInfoSync().screenWidth;
      const lineHeight = (systemW * 28 / 750) * 1.5;
      resolve(Math.ceil(lineHeight * 2.5));
    })
  },

  // 切换tab栏
  changeTab(e) {
    let {idx} = e.currentTarget.dataset
    this.setData({
      [`tabNav.idx`]: idx
    },() => {
      this.resetData(idx)
    })
  },

    // 获取约稿列表
  getProject() {
      if(this.data.finished) return
      app.rg({
        url:'/app/v1/employer/project/list',
        data:{
          uid:this.data.uid,
          page:this.data.page,
          npp:10
        }
      }).then(res => {
        let data = res.data.data
        console.log('res',res);
        this.setData({
          list2:data.projects
        })
      })
    },

    // 去到约稿详情
  toProject(e) {
      console.log(e);
      let {idx} = e.currentTarget.dataset,
      item = this.data.list2[idx]
      wx.navigateTo({
        url: `/homePage/pages/manuscripts/manuscriptsDetails/manuscriptsDetails?id=${item.id}`,
      })
    },

    // 列表触底
    bindscrolltolower() {
      let idx = this.data.tabNav.idx
      idx == 0 ? this.getCommunityList() : idx == 1 ? this.getList() : idx == 2 ? this.getProject() : ''
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {
      uid,
      name
    } = options, user = wx.getStorageSync('userInfo')
    if (user.uid == uid) {
      wx.redirectTo({
        url: '/myPage/pages/homepage/homepage',
      })
      return
    }
    this.setData({
      uid,
      name: name || ''
    }, () => {
      this.getDetail()
    })

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // 导航栏的宽度 = 
          tabWidth: (res.screenWidth - 24) / 4,
          statusBarHeight: res.statusBarHeight,
          titleBarHeight: wx.getMenuButtonBoundingClientRect().bottom + wx.getMenuButtonBoundingClientRect().top - (res.statusBarHeight * 2)
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})