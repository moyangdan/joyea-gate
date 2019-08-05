// pages/detail/detail.js
const app = getApp();
var rts = require("../../utils/rts.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: {},
    basicsList: [{
      icon: 'usefullfill',
      name: '预约登记'
    }, {
      icon: 'radioboxfill',
      name: '等待确认'
    }, {
      icon: 'roundcheckfill',
      name: '完成预约'
    }, ],
    basics: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    rts.rtGet(app.globalData.doorApiUrl + 'find-access-control/' + options.id,
      function(res) {
        console.log(res)
        that.setData({
          record: res
        })
        if (res.status == 2) {
          that.setData({
            basics: 1
          })
        } else if (res.status == 4) {
          that.setData({
            basicsList: [{
              icon: 'usefullfill',
              name: '预约登记'
            }, {
              icon: 'radioboxfill',
              name: '等待确认'
            }, {
              icon: 'roundclosefill',
              name: '预约未通过'
            }, ]
          })
        }
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