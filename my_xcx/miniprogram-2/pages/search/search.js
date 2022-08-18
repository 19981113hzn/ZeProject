// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:false,
    text:'',
    searchTypes:['搜画师','搜作品'],
    searchIndex:0,  //当前搜索 类型
    isHaveSearch:false,//是否已搜索
    words:[] ,//热门搜索
    artists:[],//画师列表
    columns:[[],[]],//作品列表 行
    columnsHeight: [0, 0],
    painterWorks:[],//作品列表
    painterFinished:false,//是否搜索完毕  防抖
    painterPage:1,//页数
    page:1,       //页码
    historicals:[], //历史搜索
  },

  // 搜索
  searchInfo() {
    if(this.data.searchIndex == 0) {
      this.data.artists = []
      this.searchPainters() //搜画师
    }else {
      this.data.painterWorks = []
      this.getWorks() //搜作品
    }
  },

  // 搜索画师
  searchPainters() {
    if(this.data.painterFinished ||!this.data.text.trim().length)return
    app.rg({
      url:'/app/v1/search/artist',
      data:{
        name:this.data.text,
        order_by:'score',
        npp:30,
        page:this.data.painterPage,
        detailed_show_works:1
      }
    }).then(res => {
      this.push(this.data.text)
      let data = res.data.data.artists
      // 设置画师展示作品的画板
      data.forEach(v => {
        v.bottomPanel = {}
        if(v.detailed_show_works.length == 0) return
        // 第一次进去当前bottom为第一张
        v.bottomPanel = v.detailed_show_works[0]
        v.bottomPanel.current = 1
      })
      this.setData({
        isHaveSearch:true,
        artists:this.data.artists.concat(data),
        historicals:this.data.historicals
      })
      this.painterPage ++
    }).catch(err => {

    })
  },

  // 搜索作品
  getWorks() {
    if(this.data.finished || !this.data.text.trim().length) return
    app.rg({
      url:'/app/v1/work/list',
      data:{
        order_by:'like_count',
        search:this.data.text,
        page:this.data.page,
        npp:30
      }
    }).then(res => {
      this.push(this.data.text)
      let data = res.data.data
      this.setData({
        isHaveSearch:true,
        painterWorks:data.works,
      })
      this.data.page++
      this.setList(data.works)   //瀑布流渲染数据
    }).catch(err => {})
  },

  // 设置瀑布流
  setList(data) {
    let index = 0,{columns,columnsHeight} = this.data
    data.forEach(v => {
      index = columnsHeight[1] < columnsHeight[0] ? 1 : 0
      columns[index].push(v)
      columnsHeight[index] += v.image_height * 750 / v.image_width
    })
    this.setData({
      columns:columns,
    })
    this.data.columnsHeight = columnsHeight
  },

  // 获取热门搜索词汇
  getHotWord() {
    app.rg({
      url:'/app/v1/search/hot_word',
    }).then(res => {
      let data = res.data.data
      this.setData({
        words:data.words
      })
    })
  },

  // 通过热门词汇搜索
  seek(e) {
    let {text,url} = e.currentTarget.dataset
    if(url) {
      app.rg({
        url:'/app/v1/token',
        hiddenLogin:true
      }).then(res => {
        let url = `${url}${url.indexOf('?') == -1 ? '?token=' :'&token='}${res.data.token}`
        wx.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
        })
      }).catch(err => {
        wx.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
        })
      })
      this.setData({
        text:''
      })
      this.push(text)
    }else {
      this.setData({
        text:text
      })
      this.btnSearchStatus()
      this.searchInfo()
    }
  },

  // 添加历史搜索
  push(text) {
		var data = wx.getStorageSync('historicals') ? wx.getStorageSync('historicals') : [];
    var status = true // 是否重复 先假定可追加
    this.data.historicals.filter((v,idx) => {
      // 只要在已有的数组中找到一个一样的 则不追加
      if(v == text.trim()) {
        status = false
      }
    })

    if(status) {
      this.data.historicals.unshift(text)
      if(!text.trim().length) {
        return
      }
      wx.setStorageSync('historicals', data.concat(text))
    }
  },

  // 切换搜索类型
  switchType(e) {
    let {idx} = e.currentTarget.dataset
    this.setData({
      searchIndex:idx
    },() => {
      this.searchInfo()
    })
  },

  // 搜索框输入时
  textInput(e) {
    let value = e.detail.value
    this.setData({
      text:value
    })
    this.btnSearchStatus()
  },

  // 更新可搜索状态
  btnSearchStatus() {
    this.setData({
      status:this.data.text.trim().length == 0 ? false : true
    })
  },

  // 清空搜索框
  clearSearch() {
    this.setData({
      text:'',
      status:false,
      isHaveSearch:false
    })
  },

  // 清空历史记录
  clear() {
    const _this = this
    wx.removeStorage({
      key:'historicals',
      success() {
        _this.setData({
          historicals:[]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHotWord()
    // 获取历史搜索记录
    var data = wx.getStorageSync('historicals') ? wx.getStorageSync('historicals') : []
    let count = 1
    data.reverse().forEach(v => {
      if(count <= 8) {
        if(!v.trim().length) {
          return
        }
        count ++
        this.data.historicals.push(v)
      }
    })
    this.setData({
      historicals:this.data.historicals
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