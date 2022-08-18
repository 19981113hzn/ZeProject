// pages/login/inputPhone.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	bottom: 0,
    isFocus:false,//是否聚焦
    regionCode: '+86', //区域号
    phoneValue: '', //手机号
    showPhone:'',//展示手机号
    isCheck: false, //是否可点击下一步
  },

  bindblur(){
    this.setData({
      isFocus:false
    })
  },

  // 聚焦
  onFocus(){
    this.setData({
      isFocus:true
    })
  },

  // 下一步
  nextStep() {
    if (!this.data.isCheck) return
    let {
      regionCode,
      phoneValue
    } = this.data
    app.wl()
    app.rp({
      url: '/app/v1/sms/send',
      data: {
        mobile: regionCode + phoneValue
      }
    }).then((res) => {  
      app.wh()
      let status = res.data.extra.register ? 1 : 0
      wx.navigateTo({
        url: `/pages/login/checkCode?code=${this.data.regionCode}&phone=${this.data.phoneValue}&status=${status}&bottom=${this.data.bottom}`,
      })
    }).catch(err => {})
  },

  // 选择区域
  changeRegion() {
    wx.navigateTo({
      url: '/pages/login/selectRegion',
    })
  },

  // 获取输入框内容
  bindinput(e) {
    this.validateMobile(e.detail.value)
    this.setData({
      isCheck: e.detail.value.length == 0 ? false : true,
      phoneValue: e.detail.value
    })
  },

  // 手机443显示
  validateMobile(val) {
    let len = val.length;
    let reg = new RegExp("\\s", "g");
    let mobile_ = "";
    let mobile = val;
    //去掉空格
    mobile = mobile.replace(reg, "");
    for (let i = 0; i < len; i++) {
      if (i == 2 || i == 6) {
        mobile_ = mobile_ + mobile.charAt(i) + " ";
      } else {
        mobile_ = mobile_ + mobile.charAt(i);
      }
    }
    this.setData({
      showPhone:mobile_
    })
  },

  // 协议
  toWebView(e) {
    let type = e.target.dataset.type,
      obj = wx.getStorageSync('agreement'),
      url = type == 0 ? obj.service : obj.privacy
    wx.navigateTo({
      url: `/pages/webview/webview?url=${url}`,
    })
  },
  keyboard(e) {
  	this.setData({bottom: e.detail.height + 30})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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