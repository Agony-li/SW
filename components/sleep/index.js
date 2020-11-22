import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
var WxParse = require('../../wxParse/wxParse.js');

const app = getApp()

Page({
  data: {
    text: "",
    tz:"",
    upload: [],
    tzUpload:[],
    b: false,
    week: 0
  },
  onLoad: function (option) {
    this.setData({
      week: option.week
    })
    this.getLogList();
  },
  onReady() {

  },
  async getLogList() {
    let that = this;
    let { data } = await util.httpRequestWithPromise('/rest/user/sleep?week='+this.data.week+'&type=1', 'GET', '', wx.getStorageSync('key'));
    if (data.message == 600) {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: config.imageUrlPrefix + '/wx/user/wx2f4af9802d72f78a/login',
              data: {
                code: res.code
              },
              success: function (res) {
                if (res.statusCode === 200) {
                  try {
                    wx.setStorageSync('key', res.data.token);
                    wx.setStorageSync('info', res.data.userInfo);
                  } catch (e) {

                  }
                  that.getLogList();

                } else {
                  wx.showToast({
                    title: '登录失败',
                    icon: 'none',
                    duration: 2000
                  })

                }

              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else {
      var uploadFile = [];
      var tzUploadFile = [];
      if(data.upload != null){
        for(var i = 0; i < data.upload.length; i++) {
          uploadFile[i] = config.imageUrlPrefix + data.upload[i].fileUrl
        }
      }
     
      if(data.tzFilterList != null) {
        for(var i = 0; i < data.tzFilterList.length; i++) {
          tzUploadFile[i] = config.imageUrlPrefix + data.tzFilterList[i].fileUrl
        }
      }
      that.setData({
        text: data.score,
        tz:data.tzScore,
        upload: uploadFile,
        tzUpload: tzUploadFile,
        b: data.b
      })
    }
  },
  onClickShow: function () {
    var that = this;
    wx.previewImage({
      current: that.data.upload[0], // 当前显示图片的http链接
      urls: that.data.upload // 需要预览的图片http链接列表
    })
  },
  onClickShowTz: function(){
    var that = this;
    wx.previewImage({
      current: that.data.tzUpload[0], // 当前显示图片的http链接
      urls: that.data.tzUpload // 需要预览的图片http链接列表
    })
  }
})