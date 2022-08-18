// homePage/pages/publishProject/publishProject.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:0,
    titleBarHeight:0,
    title:'', //约稿标题
    textarea:'',  //约稿描述
    budgetPrice:0,//单张稿酬预算
    expirationDate:'',//截稿日期
    imgList:[],//上传图片列表
    requireds:[
      {
        type:0,
        title:'单张稿酬预算',
        hint:'请选择',
        message:'',
        icon:'input_arrow@2x.png'
      },
      {
        type:0,
        title:'截稿日期',
        hint:'请选择',
        message:'',
        icon:'input_arrow@2x.png'
      },
      {
        type:0,
        title:'稿件用途',
        hint:'请选择',
        message:'',
        icon:'input_arrow@2x.png'
      },
    
      {
        type:0,
        title:'稿件是否保密',
        select:true,
        status:false

      }
    ], //约稿项目基础选择
    remunerations:[
      {
        type:1,
        priceSection:'100-200',
        priceUnit:'元',
        uantityUnit:'/张',
        describe:'(仅对作品有简单要求)',
        icon:'report_select@2x.png'
      },
      {
        type:0,
        priceSection:'100-200',
        priceUnit:'元',
        uantityUnit:'/张',
        describe:'(对作品有明确要求)',
        icon:'report_select@2x.png'
      },
      {
        type:0,
        priceSection:'200-300',
        priceUnit:'元',
        uantityUnit:'/张',
        describe:'(对精度、质量有严格要求)',
        icon:'report_select@2x.png'
      },
      {
        type:0,
        priceSection:'300-500',
        priceUnit:'元',
        uantityUnit:'/张',
        describe:'(极高精度、质量要求)',
        icon:'report_select@2x.png'
      },
      {
        type:0,
        custom:1,
        priceSection:'',
        priceUnit:'元',
        uantityUnit:'/张',
        describe:'自定义',
        icon:'report_select@2x.png'
      },
    ],//单张稿酬预算
    purpose:'',  //稿件用途
    purposeType:0, //稿件用途  type
    purposes:[
      {
        index:1,
        type:1,
        purpose:'头像',
        icon:'report_select@2x.png'
      },
      {
        index:2,
        type:0,
        purpose:'壁纸',
        icon:'report_select@2x.png'
      },
      {
        index:3,
        type:0,
        purpose:'人设',
        icon:'report_select@2x.png'
      },
      {
        index:4,
        type:0,
        purpose:'贺图',
        icon:'report_select@2x.png'
      },
      {
        index:5,
        type:0,
        purpose:'其他',
        icon:'report_select@2x.png'
      }
    ],  //稿件用途列表
    	// 约稿基础信息弹层
		status: [{
			statu: false,
			subclass: {
				statu: false,
			}
		}, {
			statu: false,
		}, {
			statu: false,
    }],
    switchChangeStatus:false,//稿件用途
    maskLayerStatus:false,//遮罩层
    btnPublishStatus:false, // 是否可发布
    protocolStatu:true,
    throttle:true,
    priceRange:0,//价格区间
    hintStatus:false,//提示信息
  },

  //输入约稿标题
  titleInput(e) {
    this.setData({
      title:e.detail.value
    })
    this.dataJudge()
  },

  // 输入约稿描述
  textareaInput(e) {
    this.setData({
      textarea:e.detail.value
    })
    this.dataJudge()
  },

  // 选择区间
  pleaseSelect(e) {
    let idx = e.currentTarget.dataset.index
    let statu,purpose,purposeType,budgetPrice,newBudgetPrice,newPriceRange
    let newStatus = this.data.status.map((v,key) => {
      v.statu = false
      if(key == idx) {
        statu = v.statu = !v.statu
      }
      return v
    })
    if(idx == 0) {
      this.data.remunerations.filter((val,key) => {
        if(val.statu && val.type !== 1) {
          newBudgetPrice = val.title
          budgetPrice = val.title + val.describe
          newPriceRange = val.type
        }
      })
    } else if(idx == 2) {
      this.data.purposes.filter((val,key) => {
        if(val.statu) {
          purpose = val.title
          purposeType = val.type
        }
      })
    }
    this.setData({
      status:newStatus,
      purpose:purpose ? purpose : this.data.purpose,
      [`requireds[${2}].message`]: purpose,
      maskLayerStatus:idx === 1 ? false : statu,
      priceRange:newPriceRange ? newPriceRange :this.data.priceRange,
      purposeType:purposeType ? purposeType : this.data.purposeType
    })
    this.dataJudge()
  },

  //关闭遮罩层
  maskLayer() {
    let newStatus = this.data.status.map((val,key) => {
      val.statu  = false
      return val
    })
    this.setData({
      status:newStatus,
      maskLayerStatus:false
    })
    this.dataJudge()
  },

  //选择价格区间
  selectPrice(e,mask) {
    let {index,mark}= e.currentTarget.dataset
    let newBudgetPrice,budgetPrice,newPriceRange
    let newRemunerations = this.data.remunerations.filter((v,key) => {
      v.statu = 0
      if(key == index || (index == -1 && key == this.data.remunerations.length - 1)) {
        v.statu = 1
        newBudgetPrice = v.title;
				budgetPrice = v.title + v.describe;
				newPriceRange = v.type;
      }
      //自定义
      if(index>-1) {
        if(v.type == 1) {
          v.describe = ''
          this.setData({
            startValue:'',
            endValue:''
          })
        }
      }
      return v

    })

    if(mask) {
      console.log('mask',mask);
    }else {
      this.setData({
        [`status[${mark}].statu`]: false
      })
    }
    this.setData({
      remunerations:newRemunerations,
      [`requireds[${0}].message`]: newBudgetPrice,
      maskLayerStatus:false,
      budgetPrice:budgetPrice,
      priceRange:newPriceRange ? newPriceRange :this.data.priceRange
    })
    this.dataJudge()
  },

  // 选择稿件用途
  purposeSelect(e) {
      let {index,mark}= e.currentTarget.dataset,
      purpose,purposeType
      let purposes = this.data.purposes.filter((val,key) => {
        val.statu = 0
        if(key == index) {
          val.statu = 1
          purpose = val.title
          purposeType = val.type
        }
        return val
      })
      this.setData({
        purposes:purposes,
        [`status[${mark}].statu`]:false,
       purpose:purpose,
       [`requireds[${2}].message`]: purpose,
       maskLayerStatus:false,
       purposeType:purposeType

      })
      this.dataJudge()
  },

  // 稿件是否保密
  switchChange(e) {
    this.setData({
      switchChangeStatus:e.detail.value
    })
  },

  //日期选择
  bindDateChange(e) {
    let date = e.detail.value.split('-')
    this.setData({
      [`requireds[${1}].message`]:date[0]+'/'+date[1]+'/'+date[2],
      expirationDate:e.detail.value
    })
    this.dataJudge()
  },

  // 规则信息
  rule() {
    app.rg({
      url:'/app/v1/project/create/conf'
    }).then(res => {
      console.log('res',res);
      // 单张稿件预算
      let tempRemunerations = []
      res.data.data.personal_project_price.forEach((v,key) => {
          tempRemunerations.push(
            {
              type:v.type,
              title:v.title.split('(')[0],
              describe:v.type == 1 ? '' : "(" + v.title.split('(')[1],
              statu:!key ? 1 : 0,
              icon:'report_select@2x.png'
            }
          )
      })
      //稿件用途
      let tempPurposes = []
      res.data.data.personal_project_use_status.forEach((val,key) => {
        tempPurposes.push(
          {
            title:val.title,
            statu:!key ? 1 : 0,
            icon:'report_select@2x.png',
            type:val.type
          }
        )
      })
      this.setData({
        remunerations:tempRemunerations,
        purposes:tempPurposes
      })
    })
  },

  // 信息判断
  dataJudge() {
    if(!this.data.title || !this.data.budgetPrice || !this.data.expirationDate || !this.data.purpose || !this.data.textarea) {
      this.setData({
        btnPublishStatus:false
      })
      return
    }

    this.setData({
      btnPublishStatus:true
    })
  },

  //复选框
  checkboxChange(e) {
    console.log('e',e);
    if(e.detail.value.length !== 0) {
      this.setData({
        protocolStatu:true,
        protocolHint:false
      })
    }else {
      this.setData({
        protocolStatu:false
      })
    }
  },

  //是否同意用户协议
  protocol() {

  },

  // 发布约稿验证-- 检查是否有未完成的需求单
  publishVerify() {
    if(this.data.textarea.trim().length < 10) {
      this.showToast('需求描述不能小于10字')
      return
    }
    if(!this.data.protocolStatu) {
      this.setData({
        protocolHint:true
      })
      this.showToast('请先同意用户协议')
      return
    }
    let _this = this
    if(this.data.throttle) {
      app.rg({
        url:'/app/v1/project/create/chk'
      }).then(res => {
        let id = res.data.data.project_id
        if(!id) {
          app.rp({
            url:'/app/v1/project/personal/create',
            hideModel:true
          }).then(rs => {
            console.log('rs',rs);
            id = rs.data.data.project_id
            _this.publish(id)
          }).catch(err =>{})
        }else {
          _this.publish(id)
        }
      }).catch(err => {})
    }else {
      return
    }
  },

  //发布约稿
  publish (id) {
    if(this.data.throttle) {
      this.data.throttle = false
      let _this = this
      app.rp({
        url:'/app/v1/project/personal/update',
        data:{
          "project_id":id,
          "name":_this.data.title,
          "sub_corp_type":_this.data.purposeType,
          "end_date":_this.data.expirationDate,
          "price_type":_this.data.priceRange,
          "min_price":_this.data.budgetPrice.split("元")[0].split("-")[0],
          "max_price":_this.data.budgetPrice.split("元")[0].split("-")[0],
          "work_can_public":_this.data.switchChangeStatus ? 2 : 1,
          "work_desc":_this.data.textarea,
          "project_work":JSON.stringify(_this.data.imgList)
        }
      }).then(res => {
        if(res.data.code == 201) {
          app.wt(res.data.info)
          this.onNavigateBack(1)
        }else if(res.data.code == 200) {
          let data = res.data.data
          if(data.colored_egg) {
            wx.showToast({
              title: '触发彩蛋啦!',
            })
          }else {
            this.onNavigateBack()
          }
        }
      }).catch(err => {
        this.data.throttle = false
      })
    }
  },

  // 更新作品后返回
  onNavigateBack(type) {
    let pages = getCurrentPages(),
    lastPage = pages[pages.length - 2]
    if(lastPage.route.indexOf('userHomePage') != -1) {
      lastPage.onEntrust()
      wx.navigateBack()
    }else if(lastPage.route.indexOf('/manuscriptslist') != -1)
    {  wx.navigateBack()}
    else {
      console.log(112);
      setTimeout(() => {
				wx.redirectTo({
					url: "/pages/home/home"
				})
			}, type && type == 1 ? 1500 : 10)
    }

  },

  // 导航栏返回
  goback() {
    if (!this.data.title && !this.data.textarea && !this.data.budgetPrice && !this.data.purpose && !this.data.expirationDate) {
      wx.navigateBack({
        delta: 1,
        fail() {
          wx.switchTab({
            url: '/pages/home/home',
          })
        }
      })
      return
    }
    this.setData({
      hintStatus:true
    })
  },

  //确认离开
  confirm() {
    wx.navigateBack({
      delta: 1,
      fail() {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    })
    this.setData({
      hintStatus:false
    })
  },

  //取消离开
  cancel() {
    this.setData({
      hintStatus:false
    })
  },

  //选择图片上传
  photoAlbum() {
    let _this = this
    wx.chooseImage({
      count: 10 - _this.data.imgList.length,
      sizeType:['original','compressed'],// 原图or压缩图
      sourceType:['album','camera'], //相机or相册
      success(res) {
        let status = false
        let tempFilePaths = res.tempFiles
        tempFilePaths.forEach((v,idx) => {
          if(v.size <= 50000) {
            _this.getToken().then(obj => {
              let {
                object_name,
                bucket_name,
                file_url,
                token
              } = obj
              wx.uploadFile({
                filePath: v.path,
                name: 'file',
                url: `https://${bucket_name}.nos-eastchina1.126.net`,
                formData:{
                  Object:object_name,
                  'x-nos-token' :token
                },
                success(e) {
                  const tempImg = {
                    'work_url':file_url,
                    "file_size":v.size,
                    "work_type":1
                  }
                  _this.setData({
                    imgList:_this.data.imgList.concat(tempImg)
                  })
                }
              })
            })
          }else {
            status = true
          }
          if(status) {
            wx.showToast({
              title: '参考例图不能大于5M',
              icon:'none',
              duration:2000
            })
          }
        })
      }

    })
  },

  // 删除图片
  deletePic(e) {
    let idx = e.currentTarget.dataset.index,
    newImgList = this.data.imgList.filter((v,key) => {
      return key !== idx
    })
    this.setData({
      imgList:newImgList
    })
  },

  // 获取token
  getToken() {
    return new Promise((resolve,rej) => {
      app.rg({
        url:'/app/v1/upload/token',
        data:{
          is_img:1,
          is_prviate:0,
        }
      }).then(res => {
        resolve(res.data.data)
      })
    })
  },

  // toast报错
  showToast(title) {
    wx.showToast({
      title: title,
      icon:'none',
      duration:2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight:res.statusBarHeight,
          titleBarHeight:wx.getMenuButtonBoundingClientRect().bottom + wx.getMenuButtonBoundingClientRect().top - (res.statusBarHeight * 2)
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
    this.rule()
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