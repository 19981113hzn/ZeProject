// pages/login/login.js
const app = getApp()
let store = app.store
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 手机快捷登录
  toPhoneLogin() {
    wx.navigateTo({
      url: '/pages/login/inputPhone',
    })
  },

  // 注册
  onRegister(phone) {
    app.rp({
      url: '/app/v1/register',
      data: {
        mobile: phone
      }
    }).then(res => {
      let data = res.data.data.session,
        pages = getCurrentPages(),
        lastPage = pages[pages.length - 2],
        url = `/pages/guidance/guidance?name=${data.user.name}&uid=${data.user.uid}`,
        popupObj = res.data.data.register_popup;
      if (popupObj) { //是否显示注册成功弹窗
        url = `/pages/guidance/guidance?name=${data.user.name}&uid=${data.user.uid}&popupObj=${encodeURIComponent(JSON.stringify(popupObj))}`;
      }
      if (lastPage.route.indexOf('pages/my/my') != -1) {
        wx.reLaunch({
          url: `${url}0`,
        })
      } else if (lastPage.route.indexOf('pages/home/home') != -1) {
        wx.reLaunch({
          url: `${url}1`,
        })
      }
    })
  },

  // 获取手机号并登录
  getPhoneNumber(e) {
    if (e.detail.errMsg.indexOf('fail') != -1) return
    let {
      encryptedData,
      iv
    } = e.detail, _this = this
    wx.checkSession({
      success() {
        _this.wxPhoneLogin(encryptedData, iv)
      },
      fail() {
        _this.silenceLogin().then(() => {
          _this.wxPhoneLogin(encryptedData, iv)
        })
      }
    })
  },

  // 手机号登录
  wxPhoneLogin(encryptedData, iv) {
    app.rp({
      url: '/app/v1/login/weixin/mobile',
      data: {
        encrypted_data:encryptedData,
        iv
      },
      hideModel:true,
      hiddenLogin:true
    }).then(res => {
      console.log('loginres',res);
      if ('extra' in res.data) {
        this.onRegister(res.data.extra.mobile)
      } else {
        let data = res.data.data.session
        wx.setStorageSync('userInfo', data.user || {})
        wx.setStorageSync(app.saveSid(), data.sid || '')
        wx.setStorageSync(app.saveToken(), data.csrf_token || '')
        let pages = getCurrentPages();
        console.log('pages',pages);
        let lastPage = pages[pages.length - 2];
        if (lastPage.route.indexOf('paintersList') != -1) {
          lastPage.setData({
            finished: false,
            page: 1,
            list: [],
          }, () => {
            lastPage.getList()
          })
        }
        if (lastPage.route.indexOf('worksList') != -1) {
          lastPage.setData({
            finished: false,
            page: 1,
            list: [],
            columns: [
              [],
              []
            ],
            columnsHeight: [0, 0]
          }, () => {
            lastPage.getList()
          })
        } else if (lastPage.route.indexOf('workDetails') != -1) {
          lastPage.setData({
            onLikeStatus: true
          })
          lastPage.loginRequest()
          let lastTwoPage = pages[pages.length - 3];
          if (lastTwoPage) {
            if (lastTwoPage.route.indexOf('worksList') != -1) {
              lastTwoPage.setData({
                finished: false,
                page: 1,
                list: [],
                columns: [
                  [],
                  []
                ],
                columnsHeight: [0, 0]
              }, () => {
                lastTwoPage.getList()
              })
            }

          }
        }
        wx.navigateBack({})
      }
    }).catch(err => {
      if (Object.keys(err).length == 0) return
      wx.showModal({
        content: err.data.error,
        showCancel: false,
        success() {}
      })
    })
  },

  // 静默登录
  silenceLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(o) {
          app.rp({
            url: '/app/v1/login/weixin/code',
            data: {
              code: o.code
            }
          }).then(res => {
            let data = res.data.data
            wx.setStorageSync(app.saveSid(), data.sid)
            resolve() 
          })
        }
      })

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.silenceLogin()
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