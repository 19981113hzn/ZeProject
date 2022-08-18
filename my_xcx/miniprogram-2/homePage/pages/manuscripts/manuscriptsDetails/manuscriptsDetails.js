// homePage/pages/manuscripts/manuscriptsDetails/manuscriptsDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    manuscriptsData:{},//需求单详细信息
    manuscriptsId:'',//需求单ID
    shadestatus:false,//是否展示弹窗
  },

  // 获取个人约稿详细信息
  getManuscriptsData() {
    app.rg({
      url:'/app/v1/employer/project/detail',
      data:{
        project_id:this.data.manuscriptsId
      }
    }).then(res => {
      app.wh()
      let data = res.data.data
      this.setData({
        manuscriptsData:data
      })
      var dateTime = this.data.manuscriptsData.project.add_time;
			var date = new Date(dateTime);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var time = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + hour + ':' + minute;
      this.setData({
        [`manuscriptsData.project.add_time`] : time
      })
    })
  },

  // 预览参考例图
  preview() {

  },

  // 约稿描述
  manuscriptsDescribe() {
    this.setData({
      shadestatus:!this.data.shadestatus
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      manuscriptsId:options.id
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
    this.getManuscriptsData()
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