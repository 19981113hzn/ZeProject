// commityPage/page/releaseDynamic/releaseDynamic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadList:[],
    noNetwork:false,
    topicList:[],
    iptValue:'',
    canUseBtn:false,
    imgLimit:{},
  },

  // 获取话题列表
  getTopicList() {
    app.rg({
      url:"/app/v1/community/post/add/topic_list",
    }).then(res => {
      // console.log('res',res);
      let data = res.data.data
      data.topics.forEach(v => {
        v.isSelect = false
      })
      this.setData({
        topicList:data.topics
      })
    })
  },

  // 选择话题
  selectTopic(e) {
    let index = e.currentTarget.dataset.idx
    let {
      topicList,iptValue
    } = this.data
    topicList[index].isSelect = true
    let str = `${iptValue}#${topicList[index].title}#`
    if(str.length > 20) {
      app.wt('字数超出限制')
      return
    }
    this.setData({
      iptValue:str
    },() => {
      this.dealSendBtn()
    })
  },

  // 处理按钮状态
  dealSendBtn() {
    let {iptValue,uploadList} = this.data,canUseBtn = false
    canUseBtn = iptValue.length != 0 || uploadList.length != 0 ? true : false
    this.setData({
      canUseBtn
    })
  },

  // 输入文本
  bindinput(e) {
    let {value,cursor} = e.detail,{iptValue} = this.data,len = iptValue.length
    this.setData({
      iptValue:value
    })
    this.dealSendBtn()
  },

  // 获取焦点
  bindfocus() {

  },

  // 失去焦点
  bindblur() {

  },

  // 获取上传图片token
  getToken() {
    return new Promise((resolve,reject) => {
      app.rg({
        url:'/app/v1/upload/token',
        data:{
          is_img:1,
          is_private:0
        }
      }).then(res => {
        resolve(res.data.data)
      })
    })
  },

  // 上传图片
  uploadPic() {
    let _this = this,{uploadList,imgLimit} = this.data,len = uploadList.length
    wx.chooseImage({
      count: 9-len,
      type:'image',
      success(res) {
        console.log('img',res);
        const imgList = res.tempFiles
        imgList.forEach((v,idx) => {
          let index = len + idx
          v.index = index
          if(v.size>imgLimit.max_size) {
            app.wt(imgLimit.max_size)
          }else {
            _this.getToken().then(obj => {
              let {
                token,object_name,file_url,bucket_name
              } = obj
              wx.uploadFile({
                filePath: v.path,
                name: 'file',
                url: `https://${bucket_name}.nos-eastchina1.126.net`,
                formData:{
                  Object:object_name,
                  'x-nos-token':token
                },
                success(e) {
                  _this.setData({
                    [`uploadList[${index}].file_url`]:file_url
                  },() => {
                    _this.dealSendBtn()
                  })
                }
              })
            })
          }
        })
      }
    })

  },

  // 删除图片
  deletePic(e) {
    let idx = e.currentTarget.dataset.idx
    console.log('idx',idx);
    this.data.uploadList.splice(idx,1)
    this.setData({
      uploadList:this.data.uploadList
    },() => {
      this.dealSendBtn()
    })
  },

  // 发布动态
  onSend() {
    let {canUseBtn,iptValue,uploadList} = this.data
    const pages = getCurrentPages(),beforePage = pages[pages.length - 2]
    // 如果beforepage不存在 值为1 最后的1 如果beforepage存在但topicdetail不存在 值为2 如果都存在 值为1 第一个1
    let pageType = beforePage ? beforePage.route.indexOf("/topicDetail") != -1 ? 1 : 2 : 1
    if(!canUseBtn) return
    let content = iptValue.substring(0,800)
    app.wl('发布中...')
    app.rp({
      url:'/app/v1/community/post/add',
      data:{
        content,
        images:JSON.stringify(uploadList)
      },
      hideNetwork:true
    }).then(res => {
      let code = res.data.code
      wx.showToast({
        title: '发布成功',
        icon:"success",
        mask:true

      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.imgLimit = wx.getStorageSync('post_image')
    this.getTopicList()
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