// communityPage/page/replyDetail/replyDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    post_id: '',
    parent_id: '',
    list: [],
    detail: [],
    finished: false,
    count: '', //回复条数
    title: "",
    supernatant: false, //浮层
    isInputAt: false, //是否手动输入@
    replyuser: {},
    isShowInputPanel: false, //输入框操作面板
    isShowEmoji: false, //表情包面板
    getfocus: false, //聚焦
    keyHight: 0,
    canuseBtn: false,
    inputvalue: '',
    statusBarHeight: 0,
    titleBarHeight: 0,
  },

  // 跳转用户详情
  toUser(e) {
    let {
      uid
    } = e.currentTarget.dataset, {
      user
    } = this.data
    if (user && uid == user.uid) {
      wx.navigateTo({
        url: '/myPage/pages/homepage/homepage',
      })
    } else {
      wx.navigateTo({
        url: `/homePage/pages/userHomePage/userHomePage?uid=${uid}`,
      })
    }
  },

  dealDecode(e) {
    let {
      idx,
      index,
      type
    } = e.currentTarget.dataset, {
        list,
        detail,
      } = this.data,
      item = type == 'detail' ? detail[index].decode[idx] : list[index].decode[idx]
    wx.navigateTo({
      url: `/${item.url}`,
    })
  },

  // 举报
  report(e) {
    let {
      idx,
      type
    } = e.currentTarget.dataset, {
        list,
        detail,
        post_id
      } = this.data,
      item = type == 'detail' ? detail[idx] : list[idx]
    if (type == 'detail') {
      wx.navigateTo({
        url: `/communityPage/page/report/report?type=0&post_id=${post_id}`,
      })
    } else {
      wx.navigateTo({
        url: `/communityPage/page/report/report?type=1&comment_id=${item.id}`,
      })
    }

  },

  // 发送
  onSend() {
    let {
      inputvalue,
      canuseBtn,
      post_id,
      parent_id,
      replyuser
    } = this.data
    if (!canuseBtn) return
    let content = inputvalue.substring(0, 100)
    app.rp({
      url: "/app/v1/community/post/comment/add",
      data: {
        content,
        post_id,
        parent_id,
        reply_uid: replyuser.isOne == true ? '' : replyuser.uid
      },
      hideMonolayer: true
    }).then(res => {
      let data = res.data.data
      this.setData({
        inputvalue: '',
        canuseBtn: false,
        isShowInputPanel: false
      }, () => {
        this.data.list = []
        this.data.finished = false
        this.getList()
      })
      if (data.colored_egg) {
        this.setData({
          colored_egg: data.colored_egg
        })
        this.selectComponent('#egg').showEggDialog()
      } else {
        wx.showToast({
          mask: true,
          icon: "success",
          title: '发送成功~',
        })
      }
    })
  },

  // 艾特用户
  setAtUser(e) {
    let {
      count,
      isInputAt,
      inputvalue,
    } = this.data
    let str = isInputAt ? `${inputvalue}${e.detail.name} ` : `${inputvalue}@${e.detail.name} `
    if (str.length > 100) {
      app.wt("字数超出限制")
      this.setData({
        supernatant: false,
        title: `共${count}条回复`,
      })
      return
    }
    this.setData({
      supernatant: false,
      title: `共${count}条回复`,
      canuseBtn: true,
      inputvalue: str
    })
  },

  // 点赞
  dealLike(e) {
    let {
      idx,
      type
    } = e.currentTarget.dataset, {
        list,
        detail,
        post_id
      } = this.data,
      item = type == 'detail' ? detail[idx] : list[idx]
    app.rp({
      url: `/app/v1/community/post/comment/${item.liked?'un':''}like`,
      data: {
        comment_id: item.id,
        post_id
      },
      hideMonolayer: true
    }).then(res => {
      let obj = {
        ...item
      }
      obj.liked = !item.liked
      obj.like_count = parseInt(obj.like_count)
      obj.liked ? obj.like_count++ : obj.like_count--
      this.setData({
        [`list[${i}]`]: obj
      })
    })
  },

  // 删除评论
  delCom(e) {
    let {
      idx,
      type
    } = e.currentTarget.dataset, {
      post_id,
      detail,
      list
    } = this.data, _this = this;
    wx.showModal({
      content: type == 'detail' ? '删除评论后，评论下所有回复都会被删除' : '要删除回复吗？',
      confirmText: "删除",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          app.rp({
            url: "/app/v1/community/post/comment/del",
            data: {
              comment_id: type == "detail" ? detail[idx].id : list[idx].id,
              post_id
            },
            hideMonolayer: true
          }).then(res => {
            _this.data.list = []
            _this.data.finished = false
            _this.getList()
            if (type == "detail") {
              wx.navigateBack({
                fail() {
                  wx.switchTab({
                    url: '/pages/home/home',
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  // 回复评论
  replyCom(e) {
    let {
      idx,
      type
    } = e.currentTarget.dataset, {
        list,
        detail,
        replyuser,
        inputvalue
      } = this.data,
      item = type == 'detail' ? detail[idx] : list[idx]
    inputvalue = item.user.uid == replyuser.uid ? inputvalue : ''
    this.setData({
      inputvalue,
      getfocus: true,
      replyuser: {
        name: item.user.name,
        uid: item.user.uid,
        isOne: type == 'detail' ? true : false
      }
    })
  },

  // 点赞
  dealLike(e) {
    let {
      idx,
      type
    } = e.currentTarget.dataset, {
        list,
        detail,
        post_id
      } = this.data,
      item = type == 'detail' ? detail[idx] : list[idx]
    app.rp({
      url: `/app/v1/community/post/comment/${item.liked?'un':''}like`,
      data: {
        comment_id: item.id,
        post_id
      },
      hideMonolayer: true
    }).then(res => {
      let obj = {
        ...item
      }
      obj.liked = !item.liked
      obj.like_count = parseInt(obj.like_count)
      obj.liked ? obj.like_count++ : obj.like_count--
      type == 'detail' ?
        this.setData({
          [`detail[${idx}]`]: obj
        }) : this.setData({
          [`list[${idx}]`]: obj
        })
    })
  },

  // 聚焦
  basefocus(e) {
    let {
      height
    } = e.detail
    this.setData({
      keyHight: height,
      isShowInputPanel: true,
      isShowEmoji: false
    })
  },

  // 失焦
  baseblur() {
    this.setData({
      keyHight: 0, //键盘高度
    })
  },

  // 输入
  baseinput(e) {
    let {
      cursor,
      value
    } = e.detail, {
      inputvalue
    } = this.data, len = inputvalue.length
    if (value[cursor - 1] == '@' && inputvalue[len - 2] != '@') {
      this.setData({
        supernatant: true,
        title: '我的关注',
        isInputAt: true,
      })
    }
    this.setData({
      inputvalue: value,
      canuseBtn: cursor == 0 ? false : true
    })
  },

  // 点击右上角导航图标
  clickNav(e) {
    let type = e.target.dataset.type,
      {
        count,
        post_id
      } = this.data
    if (type == 0) {
      this.setData({
        supernatant: false,
        title: `共${count}条回复`,
        getfocus: true
      })
    } else {
      const pages = getCurrentPages(),
        beforePage = pages[pages.length - 2];
      if (beforePage.route.indexOf("/infoList/infoList") != -1) {
        wx.redirectTo({
          url: `/communityPage/page/dynamicDetails/dynamicDetails?postId=${post_id}&isShow=true`,
        })
      } else {
        wx.navigateBack({
          fail() {
            wx.switchTab({
              url: '/pages/home/home',
            })
          }
        })
      }
    }
  },

  // 点击输入框图标
  clickInputIcon(e) {
    let type = e.target.dataset.type
    this.isCheckLogin().then(() => {
      if (type == 0) {
        let flag = !this.data.isShowEmoji
        this.setData({
          isShowEmoji: flag,
          getfocus: !flag ? true : false
        })
      } else {
        this.setData({
          supernatant: true,
          isInputAt: false,
          title: '我的关注'
        })
      }
    })
  },

  // 收起键盘
  putaway() {
    let detail = this.data.detail[0]
    this.setData({
      isShowInputPanel: false,
      isShowEmoji: false,
      // replyuser: {
      //   name: detail.user.name,
      //   uid: detail.user.uid,
      //   isOne: true
      // }
    })
  },

  tolower() {
    this.getList()
  },

  dealContentText(text, entities) {
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

  getList() {
    let {
      list,
      post_id,
      finished,
      parent_id
    } = this.data
    if (finished) return
    app.rg({
      url: '/app/v1/community/post/sub_comment_list',
      data: {
        npp: 10,
        post_id,
        parent_id,
        since_id: list.length == 0 ? '' : list[list.length - 1].id
      },
      hideModel: true
    }).then(res => {
      let data = res.data.data
      data.sub_comments.forEach(v => {
        let {
          text,
          entities
        } = v.content
        if (entities.length != 0) {
          v.decode = this.dealContentText(text, entities)
        }
      })
      this.setData({
        count: data.count_desc,
        title: `共${data.count_desc}条回复`,
        list: list.concat(data.sub_comments),
        finished: data.sub_comments.length < 10 ? true : false
      })
    }).catch(() => {})
  },

  getDetail() {
    let {
      post_id,
      parent_id
    } = this.data
    app.rg({
      url: '/app/v1/community/post/comment/detail',
      data: {
        post_id,
        comment_id: parent_id
      },
      hideModel: true
    }).then(res => {
      let arr = [],
        data = res.data.data.comment
      arr.push(data)
      arr.forEach(v => {
        let {
          text,
          entities
        } = v.content
        if (entities.length != 0) {
          v.decode = this.dealContentText(text, entities)
        }
      })
      this.setData({
        detail: arr,
        replyuser: {
          name: data.user.name,
          uid: data.user.uid,
          isOne: true
        }
      })
    }).catch(() => {
      this.setData({
        isNone: true,
        title: `0条回复`
      })
    })
  },

  isCheckLogin() {
    return new Promise((resolve, reject) => {
      let {
        user
      } = this.data
      if (app.isEmpty(user)) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        reject()
      } else {
        resolve()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      post_id,
      parent_id
    } = options
    this.setData({
      post_id,
      parent_id
    }, () => {
      this.getList()
      this.getDetail()
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight,
          titleBarHeight: wx.getMenuButtonBoundingClientRect().bottom + wx.getMenuButtonBoundingClientRect().top - (res.statusBarHeight * 2)
        })
      }
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