// communityPage/page/dynamicDetails/dynamicDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    replyUser:{},          //  要回复谁
    postId:"",
    statusBarHeight:0,
    titleBarHeight:0,
    title:'动态详情',
    supernatant:false,       //浮层 遮罩层 -- 灰色
    isNoe:false,             //改内容是否已不存在
    isShowInputPanel:false,  //输入框操作面板
    isShowSheet:false,       //组件community的操作面板s
    turnoff:true,            //下拉功能
    refreshr:false,          //下拉状态
    isHidden:true,           // 隐藏详情
    detail:[],               //动态详情
    count:0,                 //评论条数
    list:[],                 //评论
    finished:false,          // 评论列表是否加载完毕
    sortObj:{
      select:0,
      list:[
        {
          name:'热度',
          val:'hot'
        },{
          name:'时间',
          val:'newest'
        }
      ]
    },
    getfocus:false,
    keyHeight:0,
    isShowEmoji:false,
    canuseBtn:false,
    inputvalue:'',
    isInputAt:false,
  },

  // 返回上一页 @页恢复详情页  详情页返回home页
  clickNav(e){
   let type = e.target.dataset.type
   if(type == 1) {
   wx.navigateBack({
     fail() {
       wx.switchTab({
         url: '/pages/home/home',
       })
     }
   })
   }else {
     this.setData({
       supernatant:false,
       title:'动态详情',
       getfocus:true
     })
   }
  },

  // 切换sheet
  changeSheet() {
    console.log(1);
    this.setData({
      isShowSheet:!this.data.isShowSheet
    })
  },

  // 获取详情
  getDetail() {
    let {
      postId:post_id
    } = this.data

    app.rg({
      url:'/app/v1/community/post/detail',
      data:{
        post_id
      },
      hiddenModel:true
    }).then(res => {
      let data = res.data.data,arr = []
      arr.push(data.post) 
      this.setData({
        detail:arr,
        count:data.post.comment_count
      })
    })

  },

  //删除详情
  onDelete(){
    let {
      post_id
    } = this.data.detail[0]
    wx.showModal({
      confirmText:'删除',
      content:'确定删除这条动态吗？',
      showCancel:true,
      cancelColor: 'cancelColor',
      success(res) {
        if(res.confirm) {
          app.rp({
            url:'/app/v1/community/post/del',
            data:{
              post_id
            },
            hideMonolayer:true
          }).then(res => {
            app.wt(res.data.info)
            wx.navigateBack({
              fail() {
                wx.switchTab({
                  url: '/pages/home/home',
                })
              }
            })
          })
        }
      }
    })
  },

  // 处理包含 @ 内容
  dealContentText(text,entities) {
    let textArr = [],
    len = text.length,
    lastLen = entities.length - 1,
    loaclIdx = 0;
  entities.forEach((v, idx) => {
    for (let i = 0; i < len; i++) {
      if (loaclIdx == i) {
        if (loaclIdx < v.start) {
          textArr.push({
            type: 0,
            text: text.substring(loaclIdx, v.start)
          })
          loaclIdx = v.start
        } else if (loaclIdx == v.start) {
          textArr.push({
            ...v,
            text: text.substr(v.start, v.len)
          })
          loaclIdx = v.start + v.len
        } else if (loaclIdx > v.start && idx == lastLen) {
          textArr.push({
            type: 0,
            text: text.substr(loaclIdx)
          })
          loaclIdx = v.start + v.len
        }
      }
    }
  })
  return textArr
  },

  // 获取评论列表
  getList(){
    let {
      postId,
      list,
      sortObj,
      finished
    } = this.data
    if(finished) return
    app.rg({
      url:'/app/v1/community/post/comment_list',
      data:{
        npp:10,
        post_id:postId,
        since_id:list.length == 0 ? '' : list[list.length-1].id, //获取ID起始ID是从当前list数组中最后一个评论开始
        order_by:sortObj.list[sortObj.select].val
      },
      hideModel:true
    }).then(res => {
      let data = res.data.data
      data.comments.forEach(v => {
        let {
          entities,
          text
        } = v.content
        if(entities.length != 0) {
          v.decode = this.dealContentText(text,entities)
        }
        if(v.sub_comment_count_digit.length !=0 ) {
          v.sub_comments.forEach(c => {
            let {
              text,entities
            } = c.content
            if(entities.length != 0) {
              c.decode = this.dealContentText(text,entities)
            }
          })
        }
      })
      this.setData({
        list:list.concat(data.comments)
      })
    }).catch(err => {
      console.log('err',err);
    })
  },

  // 切换排列方式
  switchSort(){
    let val = this.data.sortObj.select == 0 ? 1 : 0
    this.data.list = []
    this.setData({
      [`sortObj.select`]:val
    },() => {
      this.data.list = []
      this.getList()
    })
  },

  // 点赞评论
  dealLike(e){
    let i = e.currentTarget.dataset.idx,
    {
      list,
      postId
    } = this.data,
    item = list[i]
    app.rp({
      url:`/app/v1/community/post/comment/${item.liked? 'un' : ''}like`,
      data:{
        comment_id:item.id,
        post_id:postId
      },
      hideMonolayer:true
    }).then(res => {
      let obj ={
        ...item
      }
      obj.liked = !obj.liked
      obj.like_count = res.data.data.like_count
      // 更新APPdata数据中的点赞状态
      this.setData({
        [`list[${i}]`]:obj
      })
    })
  },

  // 回复评论  
  replyCom(e){
    let i = e.currentTarget.dataset.idx,
    item = this.data.list[i]
    this.setData({
      getfocus:true,
      isShowInputPanel:true,
      replyUser:{
        name:item.user.name,
        cid:item.id
      }
    })
  },

  // 举报评论
  tolistReport(e) {
    let {id} = e.currentTarget.dataset
    console.log('id',id);
    wx.navigateTo({
      url: `/communityPage/page/report/report?type=1&comment_id=${id}`
    })
  },

  // 删除
  delCom(e){
    let idx = e.currentTarget.dataset.idx,
    {
      list,
      count,
      postId:post_id
    } = this.data,
    item = list[idx],
    _this = this;
    wx.showModal({
      content: "删除评论后，评论下所有回复都会被删除",
      confirmText: "删除",
      showCancel: true,
      success(res) {
        if(res.confirm) {
          app.rp({
            url: "/app/v1/community/post/comment/del",
            data: {
              comment_id: item.id,
              post_id
            },
            hideMonolayer:true
          }).then(res => {
            let num = --count
            _this.setData({
              [`list[${idx}].isHidden`]: true,
              [`count`]: num
            })
          })
        }
      }
    })
  },

  // 点赞动态
  onlike(){
    let {
      liked,
      post_id
    } = this.data.detail[0]
    app.rp({
      url:`/app/v1/community/post/${liked ? 'un' : ''}like`,
      data:{
        post_id
      },
      hideMonolayer:true
    }).then(res => {
      let data = res.data.data
      this.setData({
        // 当setdata结构层级较深时，需要使用这种中括号的形式
        [`detail[0].liked`]:!liked,
        [`detail[0].like_count`]:res.data.data.like_count
      })
    })
  },

  // 输入评论聚焦
  basefocus(e) {
    let {
      height
    } = e.detail
    this.setData({
      // 长久地拥有焦点  保证不会失焦
      getfocus:true,
      keyHeight:height,
      isShowInputPanel:true,
      isShowEmoji:false
    })
  },

  // 失去焦点
  baseblur(){
    this.setData({
      keyHight: 0, //键盘高度
    })
  },

  // 输入评论
  baseinput(e){
    let {
      cursor,
      value
    } = e.detail,{inputvalue} = this.data,len = inputvalue.length
    if(value[cursor-1] == '@' && inputvalue[len-2] != '@') {
      this.setData({
        supernatant:true,
        title:'我的关注',
        isInputAt:true
      })
    }
    this.setData({
      inputvalue:value,
      canuseBtn:cursor == 0 ? false :true
    })
  },

  // 点击了@
  clickInputIcon(e){
    let type = e.target.dataset.type
    this.isCheckLogin().then(() => {
      if(type == 0) {
        let flag = !this.data.isShowEmoji
        this.setData({
          isShowEmoji: flag,
          getfocus: !flag ? true : false
        })
      } else {
        this.setData({
          supernatant:true,
          isInputAt:false,
          title:'我的关注'
        })
      }
    })
  },

  // @用户
  setAtUser(e) {
    let {
      isInputAt,
      inputvalue
    } = this.data
    let str = isInputAt ? `${inputvalue}${e.detail.name} ` : `${inputvalue}@${e.detail.name} `
    if(str.length > 100) {
      app.wt('字数超出限制')
      this.setData({
        supernatant:false,
        title:'动态详情'
      })
      return
    }
    this.setData({  
      canuseBtn:true,
      inputvalue:str,
      supernatant:false,
      title:'动态详情',
      isShowInputPanel:true
    })
  },

  // 发布评论
  onSend() {
    let {
      inputvalue,
      postId:post_id,
      canuseBtn,
      replyUser
    } = this.data
    if(!canuseBtn) return
    let content = inputvalue.substring(0,100)
    app.rp({
      url:"/app/v1/community/post/comment/add",
      data:{
        content,
        post_id,
        parent_id:replyUser.cid ? replyUser.cid : ''
      },
      hideMonolayer:true
    }).then(res => {
      let data = res.data.data
      this.setData({
        inputvalue:'',
        canuseBtn:false,
        isShowInputPanel:false,
        [`sortObj.select`]:1
      },
      // 重新加载评论列表
      () => {
        this.data.list = []
        this.data.finished = false
        this.getList()
      }
      )
      if(data.colored_egg) {
        console.log('评论触发彩蛋');
      } else {
        wx.showToast({
          title: '发送成功',
          icon:'success'
        })
      }
    })
  },

  // 收起键盘
  putaway() {
    this.setData({
      isShowInputPanel:false,
      isShowEmoji:false,
      replyUser:{
        name:"",
        cid:""
      }
    })
  },

  // 检测登录态
  isCheckLogin() {
    return new Promise((resolve,reject) => {
      let {
        user
      } = this.data
      if(app.isEmpty(user)) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        reject()
      } else {
        resolve()
      }
    })
  },

  // 触底刷新列表
  tolower(){
    this.getList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      postId,
      isShow
    } = options
    this.setData({
      postId:postId,
      isHidden:isShow ? false :true, // 单点击评论过来的则不显示详情  否则显示详情
      turnoff:isShow ? false :true
    })
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          statusBarHeight:result.statusBarHeight,
          titleBarHeight:wx.getMenuButtonBoundingClientRect().bottom + wx.getMenuButtonBoundingClientRect().top - (result.statusBarHeight * 2)
        })
      },
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
    let user = wx.getStorageSync('userInfo')
    this.setData({
      user
    })
    this.list = []
    this.getDetail()
    this.getList()
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
  onShareAppMessage: function () {

  }
})