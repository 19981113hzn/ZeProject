// homePage/pages/manuscripts/manuscriptslist/manuscriptslist.js
const app = getApp()
let twoLineHeight = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:0,
    titleBarHeight:0,
    navMenu:[
      {
        name:'约稿',
      },
      {
        name:'画师自荐'
      }
    ],//顶部导航栏
    tabMenu:['商业约稿','个人约稿'],//约稿导航栏
    isActive:0,//0约稿1自荐
    isTabActive:0,//0商业约稿1个人约稿
    list:[],//约稿列表
    finished:false, //是否有下一页
    page:1,//页码
    anchor:0,//约稿列表顶部锚点
    recommendTags:[],//画师自荐顶部导航栏
    filterRecTags:[],//筛选tags
    isFilter:false,//是否已开启筛选
    isActiveTag:0,//被选中的tag
    isShowPanel:false,//是否展示筛选弹窗
    painterType:[
      {
        name:'商业画师',
        type:19
      },
      {
        name:'同人画师',
        type:20
      },
      {
        name:'海外画师',
        type:31
      },
      {
        name:'绘圈萌新',
        type:21
      },
      {
        name:'我自己',
        type:32
      },
    ],//画师类型
    isPainterIdx:-1,//筛选画师  是否
    isTypeTag:-1,//约稿类型
    showAmountArr:['',''],//稿酬区间
    showDateArr:['',''],//档期
    nowDate:'',//今日
    scrollTop:0,//滚动条位置
    localUser:{},//当前用户
  },

   //返回上一页
   onReturn() {
    wx.navigateBack({
      delta: 1,
      fail() {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    })
  },

  //切换顶部tab
  switchNavTab(e) {
    let idx = e.currentTarget.dataset.idx
    this.changeEvent(idx)
  },

  //切换顶部tab -- 页面切换
  changeEvent(isActive) {
    this.data.page = 1
    this.data.finished = false
    this.setData({
      isActive,
      list:[],
      anchor:0,
    },() => {
      isActive == 0 ? this.getList() : this.getRecommendTags()
    }
    )
  },

  //navchange
  navChange(){

  },

  // 切换约稿tab
  switchTab(e) {
    let isTabActive = e.currentTarget.dataset.idx
    this.data.page = 1
		this.data.finished = false
    this.setData({
			list: [],
			isTabActive
		}, () => {
			this.getList()
		})
  },

  // 约稿详情页面-跳转
  toDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/homePage/pages/manuscripts/manuscriptsDetails/manuscriptsDetails?id=${id}`,
    })
  },

  //获取约稿列表
  getList() {
    app.wl()
    let {
      finished,list,page,isTabActive
    } = this.data
    if(finished) return app.wh()
    app.rg({
      url:'/app/v1/employer/project/list_by_tag',
      data:{
        page,
        npp:30,
        business_type:isTabActive == 0 ? 1 : 2
      },
      hideModel:true
    }).then(res => {
      this.data.page++
      let data = res.data.data
      console.log('data',data);
      this.setData({
        refreshFlag:false,
        list:list.concat(data.projects),
        finished:data.projects.length < 30 ? true : false
      },() => {
        app.wh()
      }
      )
    }).catch(() => {
      app.wh()
    })
  },

  //获取画师自荐列表
  getRecommendList() {
      let {
        list,
        finished,
        isActiveTag,
        recommendTags,
        filterRecTags,
        isFilter,
        isShowPanel,
        painterType,
        isTypeTag,
        showDateArr,
        showAmountArr,
        isPainterIdx

      } = this.data,params = {
        npp:20,
        since_id:list.length == 0 ? '' : list[list.length - 1].self_reco_id
      }
      if (finished) return
      if(isShowPanel || isFilter) {
        // 画师分类 约稿类型 档期 稿酬区间
        params['artist_sub_type'] = isPainterIdx == -1 ? '' : painterType[isPainterIdx].type
        params['type_tag'] = isTypeTag == -1 ? '' : filterRecTags[isTypeTag].type
        params['min_price'] = showAmountArr[0]
        params['max_price'] = showAmountArr[1]
        params['begin_date'] = showDateArr[0]
        params['end_date'] = showDateArr[1]
        isActiveTag = isTypeTag + 1
      } else if(isActiveTag != 0) {
        params['type_tag'] = recommendTags[isActiveTag].type
      }
      app.rg({
        url:'/app/v1/self_reco/list',
        data:{
          ...params
        }
      }).then(res => {
        console.log('reco',res);
        let data = res.data.data.self_recos
        data.forEach((v,idx) => {
          v.st = app.isEmpty(v.begin_date) ? false : this.dealTimeStamp(v.begin_date,'MM.DD')
          v.et = app.isEmpty(v.end_date) ? false : this.dealTimeStamp(v.end_date,'MM.DD')
          v.count = v.images.length - 3
          v.isUnfold = false
          v.isShow = false
          // if(v.content.length > 20) {
          //   this.getTextHeight(idx).then(flag => {
          //     v.isShow = flag
          //     this.setData({
          //       [`list[${list.length+idx}].isShow`] :flag
          //     })
          //   })
          // }
        })
        this.data.finished = data.length < 20 ? true : false
        if(this.data.list.length == 0) {
          this.setData({
            scrollTop:0
          })
        }
        this.setData({
          isFilter:this.checkFilterStatus(),
          isActiveTag,
          list:list.concat(data),
          isShowPanel:false
        })
      })
  },

  // 时间转换戳
  dealTimeStamp(date,format) {
    date = new Date(date)
    let config = {
      YYYY:date.getFullYear(),
      MM: date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${(date.getMonth() + 1)}`,
			DD: date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
			HH: date.getHours() > 10 ? date.getHours() : '0' + (date.getHours()),
			mm: date.getMinutes(),
			ss: date.getSeconds()
    }
    for(const key in config) {
      format = format.replace(key,config[key])
    }
    return format
  },

  // 获取文本高度
  getTextHeight(idx) {
    return new Promise(resolve => {
      this.getTwoLineHeight().then(lineHeight => {
        wx.createSelectorQuery().in(this).select(`#text${idx}`).boundingClientRect(res => {
          resolve(res.height > lineHeight)
        }).exec()
      })
    })
  },

  getTwoLineHeight() {
    if(twoLineHeight) {
      return twoLineHeight;
    } else {
      twoLineHeight = new Promise(resolve => {
        // const systemW = wx.getSystemInfoAsync().screenWidth;
        const systemW = wx.getSystemInfoAsync({
          success: (result) => {
            return result.screenWidth
          },
        })
        const lineHeight = (systemW * 28 / 750) * 1.5
        resolve(Math.ceil(lineHeight * 2.5))
      })
      return twoLineHeight
    }
  },

  // 检查筛选按钮的状态
  checkFilterStatus() {

  },

  // 画师自荐tag
  getRecommendTags() {
    app.rg({
      url:'/app/v1/self_reco/add/conf'
    }).then(res => {
      console.log('res',res);
      let data = res.data.data.type_tag,
        tags = JSON.parse(JSON.stringify(data))
        data.unshift({
          title:'全部',
          type:''
        })
      this.setData({
        recommendTags:data,
        filterRecTags:tags
      },() => {
        this.getRecommendList()
      }
      )
    })
  },

  // 选择画师自荐类型
  selectRecTags(e) {
    console.log('e',e);
    let idx = e.currentTarget.dataset.idx,
    {isFilter,isTypeTag} = this.data,
    idxs = idx - 1
    this.setData({
      isActiveTag:idx,
      isTypeTag:isFilter ? idxs :isTypeTag
    },() => {
      this.data.list = []
      this.data.finished = false
      this.getRecommendList()
    })


  },

  // 画师自荐增加筛选条件
  changeFilter() {
    this.setData({
      isShowPanel:!this.data.isShowPanel
    })
  },

  // 筛选画师分类选择
  selectType(e) {
    let {idx} = e.currentTarget.dataset,item = this.data.painterType[idx]
    this.setData({
      isPainterIdx:idx,
      [`painterType[${idx}].isClick`]:!item.isClick
    })
  },

  // 筛选约稿类型选择
  selectTypeTag(e) {
    let {idx} = e.currentTarget.dataset
    this.setData({
      isTypeTag:idx
    })
  },

  // 选择档期
  bindDateChange(e) {
    let type = e.currentTarget.dataset.type,value = e.detail.value
    this.setData({
      [`showDateArr[${type}]`]:value
    })

  },

  // 输入稿酬区间
  inputAmount(e) {
    let type = e.currentTarget.dataset.type,value = e.detail.value
    this.setData({
      [`showAmountArr[${type}]`]:value
    })
  },

  // 重置筛选条件
  onReset() {
    let {painterType} = this.data
    painterType.forEach(v => {
      v.isClick = false
    })

    this.setData({
      painterType,
      isTypeTag:-1,
      isPainterIdx:-1,
      showDateArr:['',''],
      showAmountArr:['','']
    })
  },

  // 确认筛选条件并搜索
  onSearch() {
    this.data.list = []
    this.data.finished = false
    this.getRecommendList()
  },

  //刷新列表
  onRefresh(){
    this.data.page = 1
		this.data.list = []
		this.data.finished = false
		this.getList()
  },

  // 获取设备、用户信息
  getSessionInfo() {
    app.rg({
      url:'/app/v1/session'
    }).then(res => {
      console.log('user',res);
      this.setData({
        localUser:res.data.data.session.user
      })
    })
  },

  // 邀请画师
  onInvite() {

  },

  // 删除动态
  onDelete() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSessionInfo()
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight:res.statusBarHeight,
          titleBarHeight:wx.getMenuButtonBoundingClientRect().bottom+wx.getMenuButtonBoundingClientRect().top - (res.statusBarHeight * 2)
        })
      },
    })
    this.getList()
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
    this.setData({
      localUser:wx.getStorageSync('userInfo')
    })
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