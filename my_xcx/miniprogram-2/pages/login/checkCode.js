// pages/login/checkCode.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom: '',
    bottomNumber: '',
    regionCode: '', //区号
    phone: '', //手机号,
    iptValue: "",
    isFocus: false,
    isRegister: false, //是否已注册
    duration: 60, //秒数
    timing: false, //是否已在倒计时
  },
  timer: null, //计时器
  isFirst: false, //是否初次

  // 获取验证码
  getCode() {
    let {
      regionCode,
      phone
    } = this.data
    app.wl('获取中...')
    app.rp({
      url: '/app/v1/sms/send',
      data: {
        mobile: regionCode + phone
      }
    }).then((res) => {
      app.wh()
      this.setData({
        isRegister: res.data.extra.register ? 1 : 0
      })
      this.countDown()
    })
  },

  // 倒计时
  countDown() {
    if (this.data.timing) return
    this.setData({
      timing: true
    }, () => {
      this.timer = setInterval(() => {
        this.setData({
          duration: this.data.duration - 1,
        });
        if (this.data.duration === 0) {
          clearInterval(this.timer);
          this.setData({
            timing: false,
            duration: 60,
          });
        }
      }, 1000);
    })
  },

  // 聚焦
  onFocus() {
    this.setData({
      isFocus: true
    });
  },

  keyboard(e) {
    // var str = 'bottom:'+ (parseInt(e.detail.height) + 30) +'px';
    // this.setData({bottom: str, bottomNumber: e.detail.height + 30})
    // console.info("bottomNumber", this.data.bottomNumber)
  },

  // 显示输入值
  setValue(e) {
    let {
      regionCode,
      phone,
      isRegister
    } = this.data, smsCode = e.detail.value
    this.setData({
      iptValue: smsCode
    }, () => {
      if (smsCode.length > 4) {
        smsCode = smsCode.slice(0, 4)
      }
      if (smsCode.length == 4) {
        app.wl('验证中...')
        if (this.isFirst) return this.isFirst = false
        this.login(regionCode + phone, smsCode, isRegister)
        return
        if (isRegister == 1) {
          if (this.isFirst) return this.isFirst = false
          this.login(regionCode + phone, smsCode)
        } else {
          app.rp({
            url: '/app/v1/sms/verify',
            data: {
              mobile: regionCode + phone,
              smscode: smsCode
            }
          }).then(res => {
            app.wh()
            wx.redirectTo({
              url: `/pages/login/selectIdentity?phone=${regionCode + phone}`,
            })
          }).catch(err => {
            this.setData({
              iptValue: ''
            })
          })
        }
      }
    });
  },

  // 登录
  login(phone, code, type) {
    this.isFirst = this.isFirst ? false : true
    app.rp({
      url: '/app/v1/login/sms',
      data: {
        mobile: phone,
        smscode: code,
        permanent: 1,
        auto_register: type == 1 ? 0 : 1
      }
    }).then(res => {
      app.wh()
      let data = res.data.data.session
      wx.setStorageSync(app.saveSid(), data.sid || '')
      wx.setStorageSync(app.saveToken(), data.csrf_token || '')
      wx.setStorageSync('userInfo', data.user || {})
      let pages = getCurrentPages();
      let lastPage = pages[pages.length - 4];
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
        let lastTwoPage = pages[pages.length - 5];
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
      } else if (lastPage.route.indexOf('manuscriptslist') != -1) {
        lastPage.setData({
          needRefresh: true
        })
      }
      if (res.data.data.is_new_user) { //是否新用户
        let popupObj = res.data.data.register_popup
        let url = `/pages/guidance/guidance?name=${data.user.name}&uid=${data.user.uid}`;
        if (popupObj) { //是否显示注册成功弹窗
          url = `/pages/guidance/guidance?name=${data.user.name}&uid=${data.user.uid}&popupObj=${encodeURIComponent(JSON.stringify(popupObj))}`;
        }
        wx.reLaunch({
          url,
        })
      } else {
        wx.navigateBack({
          delta: 3
        })
      }
    }).catch(err => {
      console.log('账号异常', err);
      wx.showModal({
        title: '账号异常',
        content: err.data.error,
        showCancel: false,
        success() {
          wx.navigateBack({})
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      code,
      phone,
      status,
      bottom
    } = options

    let res = wx.getSystemInfoSync()
    //判断是否为iphonex
    let num = res.model.includes("iPhone") ? 0 : 30;
    var str = `bottom: ${parseInt(bottom) + num}px`;
    this.setData({
      regionCode: code,
      phone: phone,
      isRegister: status,
      bottom: bottom,
      bottomNumber: str
    })

    this.onFocus()
    this.countDown()
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