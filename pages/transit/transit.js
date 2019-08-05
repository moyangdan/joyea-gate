// pages/transit/transit.js
const app = getApp()
var rts = require("../../utils/rts.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doorId: "8a8b03c76bfeb8ce016bfec0c51d0000",
    userType: 0,
  },

  onLoad: function(options) {
    if (options.doorId) {
      this.setData({
        doorId: options.doorId
      })
    }
    console.log('doorId', this.data.doorId)
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
    var that = this
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
        wx.navigateTo({
          url: '../index/index?doorId=' + that.data.doorId,
        })
      } else {
        console.log('判断门禁权限---------------')
        rts.rtGet(app.globalData.doorApiUrl + 'judge-empower?doorId=' + that.data.doorId,
          function(res) {
            console.log('开门成功', res);
            if (res) {  
              wx.reLaunch({
                url: '../success/success',
              })
            } else {
              wx.reLaunch({
                url: '../index/index',
              })
            }
          })
      }

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})