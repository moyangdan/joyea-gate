var util = require('../../utils/util.js')
var rts = require("../../utils/rts.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doorId: '',
    doorName: '',
    name: '',
    company: '',
    phone: '',
    person: '',
    personId: '',
    height: 20,
    focus: false,
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
    basics: 0,
    isShowList: false,
    personList: [],
    isLoad: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log('doorId', options.doorId)
    rts.rtGet(app.globalData.doorApiUrl + 'find-door/' + options.doorId,
      function(res) {
        console.log(res)
        that.setData({
          doorId: res.id,
          doorName: res.name
        })
      })
  },

  onShow: function(option) {

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

  StartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  EndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  goWait: function() {
    wx.navigateTo({
      url: '../success/success',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  findPerson: function(e) {
    console.log(e.detail.value);
    const name = e.detail.value;
    if (name === '') {
      this.setData({
        isShowList: false
      })
    } else {
      this.setData({
        isShowList: true
      })
      var that = this;
      rts.rtPostForm(app.globalData.doorApiUrl + 'find-auditor-list?filter=' + name + '&page=0&size=30&sort=asc', {},
        function(res) {
          console.log(res)
          that.setData({
            personList: res
          })

        })
    }
  },

  /**
   * 匹配人员
   */
  choosePerson: function(e) {
    console.log(e);
    this.setData({
      isShowList: false,
      person: e.currentTarget.dataset.name.name,
      personId: e.currentTarget.dataset.name.oauthId
    })

  },

  /**
   * 提交表单
   */
  formSubmit: function(e) {
    if (e.detail.value.name == null || e.detail.value.name == '') {
      wx.showToast({
        title: '请维护您的名字',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (e.detail.value.company == null || e.detail.value.company == '') {
      wx.showToast({
        title: '请维护您的公司',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.personId == null || this.data.personId == '') {
      wx.showToast({
        title: '所选人员非我司人员',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    console.log('表单提交', e.detail.formId)
    this.setData({
      isLoad: false
    })
    wx.showLoading({
      title: '提交中',
    })
    const datas = {
      doorId: this.data.doorId,
      guestId: app.globalData.openId,
      guestName: e.detail.value.name,
      guestCompany: e.detail.value.company,
      userId: this.data.personId,
      userName: e.detail.value.person
    }
    console.log('待提交数据', datas);
    var that = this;
    rts.rtPostJson(app.globalData.doorApiUrl + 'submit-access-control?formId=' + e.detail.formId, datas,
      function(res) {
        that.setData({
          isLoad: true
        })
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
          success: function() {
            wx.navigateBack({
              delta: 1,
            })
          }
        });

      })
  },
})