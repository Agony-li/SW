import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
var  WxParse= require('../../wxParse/wxParse.js');
const app = getApp();
const bgm = wx.getBackgroundAudioManager()

Page({
  data: {
    detail:null,
    id: 0,
    form: 0,
    audioplaying: false, // 默认暂停
    audio: "",
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
  },
  onReady : function() {
    this.audioCtx = wx.createAudioContext('myAudio');
  },
  onLoad: function (option) {
    var that = this
    bgm.onError(
      error => {
        console.log(error);
      }
    );

    bgm.onPlay(
      res => {
        console.log('play');
      }
    )

    bgm.onEnded(res => {
      that.learnDone();
    })
    this.setData({
      id:option.id,
      form: option.form
    })
    this.getDetail(option.id, option.form);
  
  },
  async learnDone(){
    let data = await util.httpRequestWithPromise('/rest/cms/learnDown?id=' + this.data.id + '&form=' + this.data.form, 'GET', '', wx.getStorageSync('key'));
    if(data.data.message == "200") {
      wx.showToast({
        title: '您已完成学习',
        icon: 'none',
        duration: 2000
      })
    }
  },
async getDetail(id, form){
  let that = this;
  if (form == undefined) {
     form = 0;
  }
  let data = await util.httpRequestWithPromise('/rest/cms/article?id=' + id + '&form=' + form, 'GET', '', wx.getStorageSync('key'));
  console.info(data);
  if(data.statusCode ===  200){
    if(data.data.message == "600") {
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
                    wx.setStorageSync('key', res.data.token)
                    wx.setStorageSync('info', res.data.userInfo)
                  } catch (e) {

                  }
                  that.getDetail(that.data.id, that.data.form);

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
    }
    if(data.data.data.articleData!=undefined){
      WxParse.wxParse('article', 'html', data.data.data.articleData.content, that, 2);
    }
    that.setData({
      detail:data.data.data
    })
  }
},
  playaudio:function(e) {
    const _this = this;
    let audio = encodeURI(e.currentTarget.dataset.src);
    let audioplaying = this.data.audioplaying
    if (audioplaying) {
      console.log("暂停")
      bgm.stop();
      //初始化  
      this.setData({
        audioplaying: false
      })
    } else {
      console.log("播放")
        bgm.protocol = 'http'
        bgm.title = this.data.detail.title
        bgm.src = audio;
        bgm.play();
      this.setData({
        audioplaying: true
      })

    }
  }
})