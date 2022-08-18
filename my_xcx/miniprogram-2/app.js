// app.js
App({
  onLaunch() {
    wx.setStorageSync(this.saveToken(), wx.getStorageSync(this.saveToken()) || '')
    wx.setStorageSync(this.saveSid(), wx.getStorageSync(this.saveSid()) || '')
    wx.setStorageSync('cv', 'w1.2.9')
    const menuData = wx.getMenuButtonBoundingClientRect()
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.customNavBar = {
          screenHeight: res.screenHeight,
          statusBarHeight: res.statusBarHeight,
          titleBarHeight: menuData.bottom + menuData.top - (res.statusBarHeight * 2)
        }
      },
      complete: (res) => {
        wx.setStorageSync('systemInfo', res)
        if (res.platform == 'devtools' || res.platform == 'windows' || res.platform == 'mac' || res.platform == 'pc') {
          this.isPc = true
        }
      },
    })
    let _this = this
    wx.request({
      url: this.postUrl + '/app/v1/config',
      success(res) {
        let {
          agreement,
          post_image,
          project,
          self_reco
        } = res.data.data.config
        _this.globalData.project = project
        _this.globalData.self_reco = self_reco
        _this.globalData.config = res.data.data
        wx.setStorageSync('agreement', agreement)
        wx.setStorageSync('post_image', post_image)
      }
    })
  },

  saveToken() { 
    return this.postUrl.indexOf('https://ihuajia.cn') != -1 ? 'token' : 'test_token'
  },
  saveSid() {
    const sid = this.postUrl.indexOf('https://ihuajia.cn') != -1 ? 'sid' : 'test_sid'
    return sid
  },

    // 消息提醒
    wt: function (data) {
      wx.showToast({
        title: data,
        icon: 'none'
      })
    },

    // 关闭加载
    wh: function () {
      wx.hideLoading({
        complete: () => {}
      })
    },

    // 加载中
    wl: function (data) {
      let title = '加载中...'
      if (data) title = data
      wx.showLoading({
        icon: 'loading',
        title: title,
        mask: true,
      })
    },

   // get请求接口
   rg: function (data) {
    let _this = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.postUrl + data.url,
        data: data.data,
        header: {
          "cv": wx.getStorageSync('cv'),
          "x-csrf-token": wx.getStorageSync(this.saveToken()),
          "Cookie": `sid=${wx.getStorageSync(this.saveSid())}`,
          "X-Requested-With": "XMLHttpRequest"
        },
        success(res) {
          if (res.statusCode == 200) {
            data.hideModel ? '' : _this.wh()
            if (res.data.code == 200 || res.data.code == 201) {
              resolve(res)
            } else if (res.data.code == 1000 || res.data.code == 1002) {
              reject(res)
              if (data.hideModel) return
              wx.showModal({
                title: res.data.code == 1000 ? '错误' : '参数错误',
                content: res.data.error,
                showCancel: false
              })
            } else {
              console.log('状态码正常，code错误', code, data.url, res)
              let code = res.data.code
              if (data.hiddenLogin) {
                reject(res)
                return
              };
              if (code == 2003 || code == 2004 || code == 2005) return wx.showModal({
                content: res.data.error,
                title: '返回登录提示页',
                confirmText: '去登录',
                cancelText: '回首页',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/login/login',
                    })
                  } else {
                    wx.reLaunch({
                      url: '/pages/home/home',
                    })
                  }
                }
              })
              if (code == 403) {
                wx.showModal({
                  content: res.data.error,
                  confirmText: '回首页',
                  showCancel: false,
                  success() {
                    wx.reLaunch({
                      url: '/pages/home/home',
                    })
                  }
                })
              }
            }
          } else {
            _this.wh()
            if (res.statusCode == 500) wx.showModal({
              content: res.data,
              showCancel: false,
              confirmText: '返回首页',
              success() {
                wx.reLaunch({
                  url: '/pages/home/home',
                })
              }
            })
            console.log('err', res)
          }
        },
        fail(err) {
          _this.wh()
          reject(err)
          if (data.hideNetwork) return
          if (_this.isShowNetFailToast) return
          _this.isShowNetFailToast = true
          wx.showModal({
            content: '网络异常，请稍后重试',
            showCancel: false,
            success() {
              _this.isShowNetFailToast = false
            }
          })
        }
      })
    })
  },

  // post请求接口
  rp: function (data) {
    let _this = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: _this.postUrl + data.url,
        data: data.data,
        method: 'POST',
        header: {
          "x-csrf-token": wx.getStorageSync(this.saveToken()),
          "Cookie": `sid=${wx.getStorageSync(this.saveSid())}`,
          "cv": wx.getStorageSync('cv'),
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest"
        },
        success(res) {
          if (res.statusCode == 200) {
            _this.wh()
            if (res.data.code == 200 || res.data.code == 201) {
              resolve(res)
            } else if (res.data.code == 1000 || res.data.code == 1002) {
              reject(res)
              if (data.hideModel) return
              wx.showModal({
                title: res.data.code == 1000 ? '错误' : '参数错误',
                content: res.data.error,
                showCancel: false
              })
            } else {
              reject(res)
              if (data.hideModel) return
              let code = res.data.code
              if (code == 3001 || code == 3002) { //账号封停、禁言
                wx.showModal({
                  content: res.data.error,
                  showCancel: false,
                  confirmColor: '#00BFBF',
                })
                return
              }
              if (code == 2002 || code == 2003 || code == 2004 || code == 2005) { //登录超时
                wx.showModal({
                  content: res.data.error,
                  confirmText: '去登录',
                  success(e) {
                    if (e.confirm) {
                      wx.navigateTo({
                        url: '/pages/login/login',
                      })
                    }
                  }
                })
              }
            }
          } else if (res.statusCode == 403) {
            _this.wh()
            // 作品点击集赞抛错弹层
            if (data.hideUniversalModel) {
              reject(res)
              return
            }
            if (data.hideMonolayer) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
              return
            }
            var pages = getCurrentPages() //获取加载的页面
            var currentPage = pages[pages.length - 1] //获取当前页面的对象
            var url = currentPage.route //当前页面url
            console.log('url',url);
            if (url.indexOf('login') != -1) {
              console.log('等于-1');
              wx.showModal({
                content: '页面暂时无法访问',
                confirmText: '确定',
                showCancel: false,
                success(res) {
                  wx.reLaunch({
                    url: '/pages/home/home',
                  })
                }
              })
              return
            }
            wx.showModal({
              content: '页面暂时无法访问',
              cancelText: '回首页',
              confirmText: '去登录',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/home/home',
                  })
                }
              }
            })
          } else {
            _this.wh()
            if (data.hideMonolayer) return

            // console.log('err', res)
            res.data ? _this.wt(res.data) : ''
          }
        },
        fail(err) {
          _this.wh()
          reject(err)
          if (data.hideNetwork) return
          if (_this.isShowNetFailToast) return
          _this.isShowNetFailToast = true
          wx.showModal({
            content: '网络异常，请稍后重试',
            showCancel: false,
            success() {
              _this.isShowNetFailToast = false
            }
          })
        }
      })
    })
  },

  isEmpty(obj) {
    return typeof obj === "undefined" || obj === null || obj === "" || obj === [] || obj.length == 0;
  },

  isPc: false, //是否Pc端
  // postUrl: 'https://test.artist.webcgi.163.com', //开发测试服
  // postUrl: 'https://dev.artist.webcgi.163.com', //QA服
  postUrl: 'https://artist-test-front.webapp.163.com', //QA服
  // postUrl: 'https://ihuajia.cn', //正式服
  // postUrl:'http://web.artist.webcgi.163.com',

  globalData: {
    userInfo: null
  }
})
