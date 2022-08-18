// communityPage/page/report/report.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    comment_id:'',
    statusBarHeight: 0,
    titleBarHeight: 0,
    showDom:false,          //显示文档
    list:[],
    btncanuse:false,
    count:0,
    images:[],
    desc:''                // 详细描述
  },

  // 获取举报原因列表
  getList() {
    let {
      type
    } = this.data,
    report_type = type == 0 ? 5 : type == 1 ? 6 : type == 2 ? 7 : type == 3 ? 1 : 0
    app.rg({
      url:'/app/v1/report/reasons',
      data:{
        report_type
      },
      hiddenLogin:true
    }).then(res => {
      let list = res.data.data.reasons
      list.forEach(v => {
        v.isSelect = false
      })
      this.setData({
        list
      })
    })
  },

  //返回
  toBack(e) {
      wx.navigateBack({
        fail() {
          wx.switchTab({
            url: '/pages/home/home',
          })
        }
      })
    
  },

  // 选择举报原因
  onSelect(e) {
    let {idx} = e.currentTarget.dataset,{list} = this.data,
    flag = !list[idx].isSelect
    list[idx].isSelect = flag
    this.setData({ 
     [`list[${idx}].isSelect`] : flag,
     btncanuse:list.some(v => {
       return v.isSelect == true ? true : false
     })
    })

  },

  //输入详细描述
  bindinput(e) {
    let {
      value,
      cursor
    } = e.detail
    this.setData({
      count: cursor,
      desc: value
    })
  },

  //获取上传token
  getToken() {
    return new Promise((resolve,reject) =>{
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

  //上传图片
  uploadPic() {
    let _this = this
    let {
      images
    } = _this.data,len = images.length
    wx.chooseImage({
      count: 3-len,
      success(res) {
        const imgList = res.tempFilePaths
        imgList.forEach((v,idx) => {
          let index = len + idx    //第几张 之前已有的张数加上这次的序列号，等于总数数组中的序列号
          _this.getToken().then(obj => {
            let {
              file_url,object_name,bucket_name,token
            } = obj
            wx.uploadFile({
              url: `https://${bucket_name}.nos-eastchina1.126.net`,
              filePath: v,
              name: 'file',
              formData:{
                Object:object_name,
                'x-nos-token':token
              },
              success() {
                _this.setData({
                  [`images[${index}]`] : file_url
                })
              }
            })
          })
        })
      }
    })
  },

  // 删除预选图片
  delPic(e) {
    let {idx} = e.currentTarget.dataset,{images} = this.data
    //splice 删除当前序号的项
    images.splice(idx,1)
    this.setData({
      images
    })

  },

  // 了解画加社区公约
  viewRule() {

  },

  // 举报评论
  postComment(comment_id, reason_types, content, images) {
    app.rp({
      url:'/app/v1/report/post_comment_add',
      data:{
        comment_id,reason_types,content,images
      }
    }).then(res => {
      app.wt(res.data.info)
      setTimeout(() => {
          this.toBack()
      }, 2000);
    })
  },

  //提交举报
  submit() {
    let {type,images,desc,btncanuse,list,comment_id} = this.data
    if(!btncanuse) return
    let reason_types = []
    list.forEach(v => {
      if(v.isSelect) {
        reason_types.push(v.type)
      }
    })
    if(type == 1) {
      this.postComment(comment_id,JSON.stringify(reason_types),desc,JSON.stringify(images))
      return
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {
      comment_id,
      type
    } = options 
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight:res.statusBarHeight,
          titleBarHeight: wx.getMenuButtonBoundingClientRect().bottom + wx.getMenuButtonBoundingClientRect().top - (res.statusBarHeight * 2),
          // type,
          comment_id
        },() => {
          this.getList()
        })
      },
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