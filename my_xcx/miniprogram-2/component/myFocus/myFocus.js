const app = getApp()
Component({
   /**
   * 组件的属性列表
   */
  properties: {
    navigateHeight:{
      type:Number,
      value:0
    }
  },

  lifetimes: {
    attached() {
      this._getList()
    },
    detached() {},
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],        //关注列表
    page:1,
    val:'',
    finished:false,
    _tips:'你的关注列表为空，先去关注好友吧'
  },

  methods:{
    _getList() {
      let {
        list,val,page,finished
      } = this.data
      if(finished) return
      app.rg({
        url:'/app/v1/follow/search/followings',
        data:{
          npp:20,
          page,
          name:val
        }
      }).then(res => {
        let data = res.data.data.followings
        this.data.page++
        this.data.finished = data.length < 20 ?  true : false
        // 如果是搜索 
        if(val && data.length == 0) {
          this.setData({
            _tips:'没有找到相关用户'
          })
        }
        this.setData({
          list:list.concat(data)
        })
      })
    },

    _tolower() {
      this._getList()
    },

    _input(e) {
      this.data.val = e.detail.value
      this.data.finished = false
      this.data.list = []
      this.data.page = 1
      this._getList()
    },

    _select(e) {
      let item = e.currentTarget.dataset.item
      this.triggerEvent('selectAt',item)
    }
  },

})