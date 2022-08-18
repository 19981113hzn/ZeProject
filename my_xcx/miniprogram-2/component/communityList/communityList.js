// component/communityList/communityList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    needCutter: {
      type: Boolean,
      value: false
    }, //是否需要裁剪
    isMy: {
      type: Boolean,
      value: false
    }, //是否本人
    fromExternal: {
      type: Boolean,
      value: false
    }, //是否由父组件展示sheet
    isFollow: {
      type: Boolean,
      value: false
    }, //是否关注列表
    hiddenOperation: {
      type: Boolean,
      value: false
    }, //是否隐藏操作面板
    isFinished: {
      type: Boolean,
      value: false
    },
    list: {
      type: Array,
      value: [],
    }
  },

  observers: {
    'list': function (val) {
      if (!this._isArray(val)) return
      val.forEach(v => {
        v.images.forEach(m => {
          m.file_url = m.file_url + '?imageView'
        })
        if (v.post_type == 1) {
          let {
            text,
            entities
          } = v.content

          if (entities.length != 0) { 
            v.decode = this._dealContentText(text, entities)
            if (this.data.needCutter) {
              let limitTxt = '',
                ctr = ''
              v.decode.forEach((d, idx) => {
                limitTxt += d.text
                // if (limitTxt.length >= 125) return loacl = idx
                if (limitTxt.length >= 125) {
                  for (let i = 0; i < idx; i++) {
                    ctr += v.decode[i].text
                  }
                  limitTxt = limitTxt.substring(0, 125)
                
                  if (idx != 0) {
                    v.isLimit = true
                    v.decode[idx].text = limitTxt.split(ctr)[1]
                    v.decode.splice(idx + 1)
                  }
                }
              })
            
            }
          } else {
            if (this.data.needCutter && v.content.text.length >= 100) {
              v.isLimit = true
              v.content.text = v.content.text.slice(0, 100)
            }
          }
        }
      })
      this.setData({
        _list: val
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _isShowSheet: false,
    _isLogin: false,
    _list: [],
    _user: {},
    _currentDynamic: {}
  },
// 组件生命周期函数
  lifetimes: {
    attached: function () {
      this._dealLogin()
    },

  },
// 组件所在页面生命周期函数
  pageLifetimes: {
    show: function () {
      this._dealLogin()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _toUser(e) {
      let {
        uid
      } = e.currentTarget.dataset, {
        _user
      } = this.data
      if (_user && uid == _user.uid) {
        wx.navigateTo({
          url: '/myPage/pages/homepage/homepage',
        })
      } else {
        wx.navigateTo({
          url: `/homePage/pages/userHomePage/userHomePage?uid=${uid}`,
        })
      }

    },

    _toComment(e) {
      let {
        item
      } = e.currentTarget.dataset
      if (this.data.hiddenOperation) return
      wx.navigateTo({
        url: `/communityPage/page/dynamicDetails/dynamicDetails?postId=${item.post_id}&isShow=true`,
      })
    },

    _dealDecode(e) {
      let {
        idx,
        index
      } = e.currentTarget.dataset, {
        _list
      } = this.data, item = _list[index].decode[idx]
      wx.navigateTo({
        url: `/${item.url}`,
      })
    },

    _dealLike(i) {
      let item = this.data._list[i]
      app.rp({
        url: `/app/v1/community/post/${item.liked?'un':''}like`,
        data: {
          post_id: item.post_id
        }
      }).then(res => {
        let obj = {
            ...item
          },
          data = res.data.data;
        obj.liked = !item.liked
        obj.like_count = data.like_count
        this.setData({
          [`_list[${i}]`]: obj
        })
        if (data.colored_egg) {
          this.triggerEvent('showEgg', data.colored_egg)
        }
        if (data.extra_info) {
          app.wt(data.extra_info)
        }
      })
    },

    _operation(e) {
      let {
        type,
        idx
      } = e.currentTarget.dataset
      if (this.data._isLogin) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        return
      }
      if (type == 0) {
        let postId = this.data._list[idx].post_id
        wx.navigateTo({
          url: `/communityPage/page/dynamicDetails/dynamicDetails?postId=${postId}`,
        })
      } else if (type == 1) {
        this._dealLike(idx)
      }
    },

    _dealLogin() {
      app.rg({
        url: '/app/v1/login/status'
      }).then(res => {
        let data = res.data.data
        this.setData({
          _isLogin: data.user.uid ? false : true,
          _user: data.user
        })
      })
    },

    _viewPic(e) {
      let {
        arr,
        current
      } = e.currentTarget.dataset, urls = [];
      arr.forEach(v => {
        urls.push(v.file_url)
      })
      wx.previewImage({
        current,
        urls,
      })
    },

    _dealContentText(text, entities) {
      let textArr = [],
        len = text.length,
        lastLen = entities.length - 1,
        loaclIdx = 0;
      entities.forEach((v, idx) => {
        for (let i = 0; i < len; i++) {
          if (loaclIdx == i) {
            if (loaclIdx < v.start) {
              textArr.push({
                type: 0,
                text: text.substring(loaclIdx, v.start)
              })
              loaclIdx = v.start
            } else if (loaclIdx == v.start) {
              textArr.push({
                ...v,
                text: text.substr(v.start, v.len)
              })
              loaclIdx = v.start + v.len
            } else if (loaclIdx > v.start && idx == lastLen) {
              textArr.push({
                type: 0,
                text: text.substr(loaclIdx)
              })
              loaclIdx = v.start + v.len
            }
          }
        }
      })
      return textArr
    },

    _close() {
      this.setData({
        _isShowSheet: false
      })
    },

    // 删除
    _onDel() {
      this._close()
      let {
        post_id,
        idx
      } = this.data._currentDynamic, _this = this
      wx.showModal({
        content: "要删除动态吗？",
        confirmText: "删除",
        success(res) {
          if (res.confirm) {
            app.rp({
              url: "/app/v1/community/post/del",
              data: {
                post_id
              }
            }).then(res => {
              app.wt(res.data.info)
              _this.setData({
                [`_list[${idx}].hidden`]: true
              })
            })

          }
        }
      })
    },

    // 举报
    _toReport() {
      this._close()
      let {
        post_id
      } = this.data._currentDynamic
      wx.navigateTo({
        url: `/communityPage/page/report/report?type=0&post_id=${post_id}`,
      })
    },

    _showMenu(e) {
      if (this.data._isLogin) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        return
      }
      let idx = e.currentTarget.dataset.idx,
      _currentDynamic = this.data._list[idx]
      _currentDynamic.idx = idx
      if (this.data.fromExternal) {
        this.triggerEvent('showMenu', _currentDynamic)
      } else {
        this.setData({
          _isShowSheet: true,
          _currentDynamic
        })
      }
    },

    _isArray(obj) {
      if (typeof obj == "object" && obj.constructor == Array) {
        return true;
      }
      return false;
    }
  }
})