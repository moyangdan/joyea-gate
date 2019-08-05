// pages/confirm/confirm.js
const app = getApp();
var rts = require("../../utils/rts.js");
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: {},
    dateNow: '',
    timeNow: '',
    beginDate: '',
    endDate: '',
    beginTime: '',
    endTime: '',
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
    basics: 1,
    status: 3,
    isLoad: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      dateNow: util.formatDate(new Date),
      timeNow: util.formatDateTime(new Date),
      beginDate: util.formatDate(new Date),
      endDate: util.formatDate(new Date),
      beginTime: '08:30',
      endTime: '21:00'
    })
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

  },

  BeginDateChange(e) {
    this.setData({
      beginDate: e.detail.value
    })
  },

  EndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  BeginTimeChange(e) {
    this.setData({
      beginTime: e.detail.value
    })
  },

  EndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  refuse: function() {
    wx.showLoading({
      title: '拒绝中',
    })
    console.log(this.data.record)
    const datas = {
      strBeginDate: this.data.beginDate + ' ' + this.data.beginTime + ':00',
      strEndDate: this.data.endDate + ' ' + this.data.endTime + ':00',
      empower: false,
      userId: this.data.record.userId,
      id: this.data.record.id,
      guestId: this.data.record.guestId,
      guestName: this.data.record.guestName,
      guestCompany: this.data.record.guestCompany,
      doorId: this.data.record.doorId,
      status: 4
    }
    console.log(datas);
    var that = this;
    rts.rtPostJson(app.globalData.doorApiUrl + 'audit-access-control', datas,
      function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '拒绝成功',
          icon: 'success',
          duration: 2000,
          success: function() {
            wx.reLaunch({
              url: '../index/index',
            })
          }
        });

      })

  },

  // 授权更改
  prmitChange: function(e) {

    if (!e.detail.value) {
      this.setData({
        status: 4
      })
    } else {
      this.setData({
        status: 3
      })
    }
    console.log('状态', this.data.status);
  },

  confirm: function() {
    wx.showLoading({
      title: '确认中',
    })
    console.log(this.data.record);


    const datas = {
      strBeginDate: this.data.beginDate + ' ' + this.data.beginTime + ':00',
      strEndDate: this.data.endDate + ' ' + this.data.endTime + ':00',
      empower: true,
      userId: this.data.record.userId,
      id: this.data.record.id,
      guestId: this.data.record.guestId,
      guestName: this.data.record.guestName,
      guestCompany: this.data.record.guestCompany,
      doorId: this.data.record.doorId,
      status: this.data.status
    }
    console.log(datas);
    var that = this;
    rts.rtPostJson(app.globalData.doorApiUrl + 'audit-access-control', datas,
      function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '确认成功',
          icon: 'success',
          duration: 2000,
          success: function() {
            wx.reLaunch({
              url: '../index/index',
            })
          }
        });

      })
  },


})