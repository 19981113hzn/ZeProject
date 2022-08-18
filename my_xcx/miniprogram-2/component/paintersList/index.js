// component/paintersList/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 图片翻页
    bindchange(e) {
      let current = e.detail.current,
      // 当前画师
      idx = e.currentTarget.dataset.idx,
      // 当前画师 --> 当前作品
      item = this.data.listData[idx].detailed_show_works[current],
      obj = {
        current:current,
        item:item,
        idx:idx
      }
      // 图片变化  增加当前current
      let items = obj.item
      items.current = obj.current + 1
      this.setData({
        [`listData[${obj.idx}].bottomPanel`] :item
      })
    },

    // 点赞
    clickLike(e) {
      app.wl()
      let {idx,item} = e.currentTarget.dataset,
      url = item.liked ? '/app/v1/like/unlike' : '/app/v1/like/like'
      console.log(item,idx);
      app.rp({
        url:url,
        data:{
          work_id:item.id
        },
        hideMonolayer:true
      }).then(res => {
        app.wh()
        console.log('res',res);
        let data =res.data
        let current = --item.current,
        count = item.liked ? --this.data.listData[idx].bottomPanel.like_count : ++this.data.listData[idx].bottomPanel.like_count
        this.setData({
          [`listData[${idx}].bottomPanel.liked`] :item.liked ? false :true,
          [`listData[${idx}].bottomPanel.like_count`] :count,
          [`listData[${idx}].detailed_show_works[${current}].liked`] :item.liked ? false :true,
          [`listData[${idx}].detailed_show_works[${current}].like_count`] :count,
        })

      })

    },

    // 查看图片
    onClickImg(e) {
      let {item,index,idx} = e.currentTarget.dataset,
      {
        avatar,
        uid,
        name
      } = item,
      obj= {
        headImg:avatar,
        name:name,
        uid:uid,
        page:1,
        count:3,
        index:index
      }
      console.log(item);
      wx.setStorageSync('paintersWork', item.detailed_show_works)
      wx.navigateTo({
        url: `/homePage/pages/workDetails/workDetails?idx=${idx}&info=${encodeURIComponent(JSON.stringify(obj))}&type=home`,
      })
    }
  },

  pageLifetimes:{
    show() {
      let {listData} = this.data
      listData.forEach(v => {
        v.bottomPanel.current = 1
      })
      this.setData({
        listData:listData
      })
    }
  }
})
