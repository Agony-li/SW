//app.js
// const regeneratorRuntime = require('./common/runtime-module.js');
const mtjwxsdk = require('./utils/mtj-wx-sdk.js');
import config from './utils/dev.config.js';
import util from './utils/util.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let that = this;
   
    
    wx.getSystemInfo({
      success :(res)=> {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform);
        this.globalData.PR = res.pixelRatio;
        this.globalData.windowWidth = res.windowWidth;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.language = res.language;
        this.globalData.version = res.version;
        this.globalData.platform = res.platform;
      }
    })
  },
  globalData: {
    userInfo: null,
    PR:null,
    userCode:null,
    mobileModel:'',
    mobileePixelRatio:'',
    windowWidth:'',
    windowHeight:'',
    language:'',
    version:''
  }
})