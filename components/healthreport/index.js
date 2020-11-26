//index.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
//获取应用实例
const app = getApp()

Page({
  data: {
    totalTime: 0,
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    audioAction: {
      method: 'play'
    },
    currentTime: '00:00',
    audioValue: 0,
    hidden: true,
    week: 0
  },
  onReady: function (e) {
  },
  onLoad: function (option) {
    this.setData({
      week: option.week
    })
  },
  onShow() {
  },
  goToSleep: function () {
    wx.navigateTo({
      url: '../../components/sleep/index?week='+ this.data.week
    })
  },
  goToTestLog: function () {
    wx.navigateTo({
      url: '../../components/testLog/index?week='+ this.data.week
    })
  },
  goToEndReport() {
    wx.navigateTo({
      url: '../../components/endreport/index?week='+ this.data.week
    })
  }

})
