//app.js
var rts = require("/utils/rts.js");
//var api = "https://nextxx.joyea.cn:8899/openapi/";
var api = "http://192.168.0.181:8999/";
App({
  globalData: {
    //小程序集成框架基础变量
    wxappId: "wxdca464000eb358ba", //小程序id
    isServer: 0, //服务是否正常 0正常 1服务异常 2UAA异常
    user: {}, //微信用户信息
    session: null, //业务系统登录态(包含token、状态等)
    doorApiUrl: api + "joyeayhyaccess/openapi/", //门禁认证服务
    wxApiUrl: api + "joyeayhyaccess/oapi/", //微信认证服务
    userInfo: null,
    openId: '',
    userType: 0,
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },

  //更新session域
  upSession: function(session) {
    var that = this;
    if (session != null && session.openId != null && session.token != null) {
      wx.setStorageSync('session', session);
      that.globalData.session = wx.getStorageSync("session");
      that.globalData.tenantId = that.globalData.session.tenantId
    }
  },

  //用户在线状况
  isOnline: function(cb) {
    var that = this;


    if (that.globalData.session == null || that.globalData.isServer == 1) {
      rts.initLogin(that.globalData, function() { //登录授权信息
        that.globalData.session = wx.getStorageSync("session");
        console.log(that.globalData.session)
      }, function() {
        that.globalData.isServer = wx.getStorageSync('isServer');
        that.globalData.user = wx.getStorageSync("user");
        that.globalData.userInfo = wx.getStorageSync("userInfo");
        that.globalData.openId = wx.getStorageSync("openId");
        that.globalData.userType = wx.getStorageSync("userType");
        if (that.globalData.session == null || that.globalData.isServer == 1) {
          rts.initLogin(that.globalData, function() { //2次容错
            that.globalData.session = wx.getStorageSync("session");
          }, function() {
            if (typeof cb == "function") {
              cb();
            }
          });
        } else {
          if (typeof cb == "function") {
            cb();
          }
        }
      });
    } else {
      wx.checkSession({ //session登录态检测
        success: function() {
          if (typeof cb == "function") {
            cb();
          }
        },
        fail: function() { //session失效重连
          rts.initLogin(that.globalData, function() { //登录授权信息
            that.globalData.session = wx.getStorageSync("session");

          }, function() {
            that.globalData.isServer = wx.getStorageSync('isServer');
            that.globalData.user = wx.getStorageSync("user");
            that.globalData.userInfo = wx.getStorageSync("userInfo");
            that.globalData.openId = wx.getStorageSync("openId");
            that.globalData.userType = wx.getStorageSync("userType");
            if (that.globalData.session == null || that.globalData.isServer == 1) {
              rts.initLogin(that.globalData, function() { //2次容错
                that.globalData.session = wx.getStorageSync("session");

              }, function() {
                if (typeof cb == "function") {
                  cb();
                }
              });
            } else {
              if (typeof cb == "function") {
                cb();
              }
            }
          });
        },
        complete: function() {
          that.globalData.user = wx.getStorageSync("user");
          that.globalData.userInfo = wx.getStorageSync("userInfo");
          that.globalData.session = wx.getStorageSync("session");
          that.globalData.isServer = wx.getStorageSync('isServer');
          that.globalData.openId = wx.getStorageSync("openId");
          that.globalData.userType = wx.getStorageSync("userType");
        }
      })
    }
  },

})