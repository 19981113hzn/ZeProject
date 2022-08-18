// homePage/pages/workDetails/workDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:0,
    titleBarHeight:0,
    list:[],
    index:0,
    secondIdx:0,
    count:1,
    current:1,
    paintersInfo:{},
    isMe:false,
    pageData:{},
    pageCheer:{},
    isShowTips:false,
    mode:'page',
    isShare:false,
    onLikeStatus:true, //点赞节流 
  },

  // 滑动图片
  bindchange(e) {
    let idx = e.detail.current,
    {list,count,mode} = this.data
    // 如果最后一张
    if(idx + 1 == list.length && list.length < count) return this.getList(idx)
    if(list[idx].deleted) {
      wx.showToast({
        title: '图片已经被删除',
        icon:'none'
      })
    }
    let localuser = wx.getStorageSync('userInfo'),
    isMe = list[idx].author ? list[idx].author.uid : list[idx].id == localuser.uid ? true : false
    this.setData({
      isMe,
      current:idx,
      isShowTips:false,
      pageData:list[idx],
      paintersInfo: mode == 'list' ? {
        ...this.data.paintersInfo,
        headImg: list[idx].author.avatar,
        name: list[idx].author.name,
        uid: list[idx].author.uid
      } : this.data.paintersInfo,
    })
  },

  // 获取数据
  getList(idx) {
    let {uid,page} = this.paintersInfo
    app.wl()
    app.rg({
      url:'/app/v1/artist/works',
      data:{
        uid:uid,
        npp:30,
        page:page
      }
    }).then(res => {
      this.data.paintersInfo.page++
      this.setData({
        list:this.data.list.concat(res.data.data.list),
        count:res.data.data.count,
        current:idx,
        pageData:this.data.list[idx]
      })
    })
  },

  // 返回上一页
  toReturn() {
    wx.navigateBack({
     fail() {
       wx.switchTab({
         url: '/pages/home/home',
       })
     }
    })
  },

  // 回到主页
  toHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  // 点赞
  onLike() {
    if(!this.data.onLikeStatus) return
    this.setData({
      onLikeStatus:false
    })
    let pages = getCurrentPages()
    let lastPage = pages[pages.length - 2]
    let columns = lastPage ? lastPage.data.columns : undefined
    let item = this.data.pageData,url = item.liked ? '/app/v1/like/unlike' : '/app/v1/like/like',
    count = item.liked ? --item.like_count : ++item.like_count
    let columns1 = []
    let columns2 = []
    if(columns) {
      columns1 = columns[0].filter((v,index) => {
        if(v.id == item.id) {
          v.like_count = count
          v.liked = item.liked ? true : false
        }
        return v
      })
      columns2 = columns[1].filter((v,index) => {
        if(v.id == item.id) {
          v.like_count = count
          v.liked = item.liked ? true : false
        }
        return v
      })
    }
    app.rp({
      url:url,
      data:{
        work_id:this.data.pageData.id
      },
      hideMonolayer:true
    }).then(res => {
      app.wh()
      lastPage ? lastPage.setData({
        columns:[columns1,columns2]
      }) : ''
      let data = res.data
      this.setData({
        [`pageData.liked`] :item.liked ? false : true,
        [`pageData.like_count`] :count,
        [`pageData.index`] : this.data.list[this.data.current].index,
        [`list[${this.data.current}]`]:this.data.pageData,
        onLikeStatus:true

      })
    })

  },

  // 举报
  onReport() {
    let {pageData} = this.data
    wx.navigateTo({
      url: `/communityPage/page/report/report?type=3&work_id=${pageData.id}`,
    })
  },

  // 展示提示
  onShowTips() {
    let {isShowTips} = this.data
    this.setData({
      isShowTips:!isShowTips
    })
  },

  // 预览图片
  viewImg(e) {
    let list  = this.data.list,
    idx = e.currentTarget.dataset.idx,
    urls = []
    list.forEach(v => {
     urls.push(v.file_url)
    })
    wx.previewImage({
      urls: urls,
      current:urls[idx].file_url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let pages = getCurrentPages()
    let lastPage = pages[pages.length - 2]
    // 设置系列高度
    wx.getSystemInfo({
      success: (res) => {
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
        this.setData({
          // 状态栏高度 顶部电量 信号格
          statusBarHeight:res.statusBarHeight,
          titleBarHeight:wx.getMenuButtonBoundingClientRect().bottom + wx.getMenuButtonBoundingClientRect().top - (res.statusBarHeight * 2),
          menuHeight:menuButtonInfo.height,
          menuBottom:menuButtonInfo.top - res.statusBarHeight
        })
      },
    })

    // 如果是点击进入该页面  获取列表....
    let {idx,index,info,secondIdx,type,isMe} = options,list = wx.getStorageSync('paintersWork'),obj = JSON.parse(decodeURIComponent(info))
    let paramsObj = obj.type == 'list' ? {
      ...obj,
      headImg: list[idx].author.avatar,
      name: list[idx].author.name,
      uid: list[idx].author.uid
    } : obj

    this.setData({
      idx:idx,
      secondIdx:secondIdx
    })
    let localUser = wx.getStorageSync('userInfo')
    this.setData({
      list,
      paintersInfo:paramsObj,
      current:Number(idx),
      count:obj.count,
      pageData:list[idx],
      isMe: isMe == 'true' ? true : paramsObj.uid == localUser.uid ? true : false,
      mode:type ? type : obj.type == 'list' ? 'list' : 'page'
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
    let pages = getCurrentPages()
    let lastPage = pages[pages.length - 2]
    if(lastPage) {
    }
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