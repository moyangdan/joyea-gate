//index.js
//获取应用实例
const app = getApp()
var rts = require("../../utils/rts.js");
var util = require("../../utils/util.js");
Page({
  data: {
    isHeader: false,
    page: 0,
    userType: 0,
    doorId: "8a8b03c76bfeb8ce016bfec0c51d0000",
    userInfo: {},
    recordList: [],
    title: '预约记录',
    text1: '一号园诚挚欢迎您的到来，点击下方按钮开始预约吧.',
    text2: '暂无您的预约记录',
    //无限滚动
    searchLoading: true,
    searchLoadingComplete: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    console.log('doorId', this.data.doorId)
    if (options.doorId) {
      this.setData({
        doorId: options.doorId
      })
    }
    var that = this;
    //登录状态判断
    app.isOnline(function() {
      console.log('全局變量', app.globalData);
      that.setData({
        user: app.globalData.user.userInfo,
        userInfo: app.globalData.userInfo,

      })
      if (app.globalData.session == null || app.globalData.session.access_token == null) {
        wx.navigateTo({
          url: '../auth/auth',
        })
      }
      if (app.globalData.userType && app.globalData.userType == 1) {
        that.setData({
          userType: 1,
          title: '待审核记录',
          text1: '作为内部员工，您可审核记录或直接下方按钮开门',
          text2: '暂无待审核记录'
        })
      }

    })
    this.loadList();
  },

  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'shareTipShow',
      success: function(res) {
        that.setData({
          shareTipShow: false
        })
      },
      fail: function(res) {
        that.setData({
          shareTipShow: true
        })
        wx.setStorage({
          key: 'shareTipShow',
          data: 'true',
        })
      }
    })


  },

  loadList: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    // 数据条数
    var datas = {
      page: this.data.page,
      size: 7,
      sort: 'desc'
    }
    var listapi = 'find-my-access-control-list'
    if (app.globalData.userType == 1) {
      listapi = 'find-my-audit-access-control-list'
    }
    console.log(app.globalData.doorApiUrl + listapi);
    rts.rtPostForm(app.globalData.doorApiUrl + listapi, datas,
      function(res) {
        wx.hideLoading()
        that.setData({
          recordList: res
        })
        var list = that.data.recordList;
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          item.createdDate = util.formatTime(new Date(item.createdDate))
        }
        that.setData({
          recordList: list
        })
      })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 开始预约
  start: function() {
    wx.navigateTo({
      url: '../record/record?doorId=' + this.data.doorId,
    })
  },

  // 详情
  goDetail: function(e) {
    console.log(e);
    if (app.globalData.userType == 0) {
      wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.dataset.item.id,
      })
    } else {
      wx.navigateTo({
        url: '../confirm/confirm?id=' + e.currentTarget.dataset.item.id,
      })
    }

  },

  //回到顶部
  backTop: function() {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.loadList();
  },

  // onPageScroll: app.util.throttle(function(e) {
  //   if (e.scrollTop > 60 && !this.data.isHeader) {
  //     this.setData({
  //       isHeader: true
  //     })
  //   }
  //   if (e.scrollTop < 60 && this.data.isHeader) {
  //     this.setData({
  //       isHeader: false
  //     })
  //   }
  // }, 10),

  onReachBottom() {
    this.setData({
      searchLoading: false,
      searchLoadingComplete: false,
    })
    // 如果非空则可以请求
    if (this.data.recordList && this.data.recordList.length > 0) {
      this.setData({
        searchLoading: true,
        searchLoadingComplete: false,
        page: this.data.page + 1 //pageIndex+1  
      });
    } else {
      this.setData({
        searchLoading: false,
        searchLoadingComplete: true
      })
    }
    this.loadPageList();

  },

  loadPageList: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    // 数据条数
    var datas = {
      page: this.data.page,
      size: 7,
      sort: 'desc'
    }
    var listapi = 'find-my-access-control-list'
    if (app.globalData.userType == 1) {
      listapi = 'find-my-audit-access-control-list'
    }
    console.log(app.globalData.doorApiUrl + listapi);
    rts.rtPostForm(app.globalData.doorApiUrl + listapi, datas,
      function(res) {
        wx.hideLoading()
        console.log(res);
        if (res.length <= 0) {
          console.log('加載結束')
          that.setData({
            searchLoading: false,
            searchLoadingComplete: true
          })
        } else {
          that.setData({
            searchLoading: false,
            searchLoadingComplete: false,
            recordList: that.data.recordList.concat(res)
          })
          var list = that.data.recordList;
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            item.createdDate = util.formatTime(new Date(item.createdDate))
          }
          that.setData({
            recordList: list
          })
        }

      })
  },

  //开门
  openDoor: function() {
    wx.showLoading({
      title: '开门中',
    })
    rts.rtGet(app.globalData.doorApiUrl + 'judge-empower?doorId=' + this.data.doorId,
      function(res) {
        wx.hideLoading();
        if (res) {
          wx.reLaunch({
            url: '../success/success',
          })
        } else {
          wx.showToast({
            title: '暂无权限开门',
            icon: 'none',
            duration: 2000,
          })
        }
      })
  }
})