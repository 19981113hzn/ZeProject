const app = getApp()
Component({
  properties:{
    columns:Object,
    color:{
      type:String,
      value:'grey'
    },
    isShowLoading:{
      type:Boolean,
      value:false
    },
    isShowPanel:{
      type:Boolean,
      value:false
    },
    fromList:{
      type:Boolean,
      value:false
    }
  },
  data:{

  },
  methods:{
    // 去画师主页
    toPainters(e) {

    },
    // 点击图片  绑定事件  点击触发父组件中的事件
    onClick(e) {
      let obj = e.currentTarget.dataset.item
      // 图片所在的行
      let index = e.currentTarget.dataset.idx
      // 图片所在的列
      let secondIdx = e.currentTarget.dataset.index
      this.triggerEvent('onClick',{
        'obj':obj,
        'index':index,
        'secondIdx':secondIdx
      })
    },
    //点赞
    clickLike(e) {

    }
  }
})