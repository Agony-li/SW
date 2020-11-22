//index.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
var  WxParse= require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp();
const bgm = wx.getBackgroundAudioManager();
Page({
  data: {
    totalTime:0,
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    audioAction: {
        method: 'play'
      },
      currentTime:'00:00',
      audioValue:0,
    contentList:[],
    articleList:[],
    courseId:null,
    notifyHidden: true,
    week: 0,
    type: 0,
    courseClass: 0
},
  onLoad: function (option) {
    var uploadRes = option.uploadRes;
    console.info(uploadRes)
    if(uploadRes == 0 && option.type == 1 && option.week == 1) {
      wx.showModal({
        title: '提示',
        content: '请先上传报告再学习！',
        confirmText:'确定',
        success(res){
          if(res.cancel){
            wx.navigateBack({
              complete: (res) => {},
            })
          }else if(res.confirm){
            wx.navigateBack({
              complete: (res) => {},
            })
          }
        }
      })
    }
    if(option.week > 1 && option.courseClass == 1) {
        this.setData({
          courseClass: option.courseClass
        })
        var logEndTime = option.logEndTime;
        var logStartTime = option.logStartTime;
        var sportEndTime = option.sportEndTime;
        var sportStartTime = option.sportStartTime;
        var date = new Date();
        var m = 0;
        if(date.getMinutes() < 10){
          m = '0' + date.getMinutes();
        } else {
          m = date.getMinutes();
        }
        var currentDate = date.getHours() + '' + m;
        var st = parseInt(logStartTime);
        var et = parseInt(logEndTime);
        console.info(st);
        console.info(et);
        console.info(currentDate);
        // if(option.type  == 1 &&　(st  > parseInt(currentDate)  || et < parseInt(currentDate))) {
        //   wx.showModal({
        //     title: '提示',
        //     content: '请在所选方案规定的时间内进行训练！',
        //     confirmText:'确定',
        //     success(res){
        //       if(res.cancel){
        //         wx.navigateBack({
        //           complete: (res) => {},
        //         })
        //       }else if(res.confirm){
        //         wx.navigateBack({
        //           complete: (res) => {},
        //         })
        //       }
        //     }
        //   })
        // } else if(option.type == 3&&　(parseInt(sportStartTime) > parseInt(currentDate) && parseInt(sportEndTime) < parseInt(currentDate))) {
        //   wx.showModal({
        //     title: '提示',
        //     content: '请在所选方案规定的时间内进行训练！',
        //     confirmText:'确定',
        //     success(res){
        //       if(res.cancel){
        //         wx.navigateBack({
        //           complete: (res) => {},
        //         })
        //       }else if(res.confirm){
        //         wx.navigateBack({
        //           complete: (res) => {},
        //         })
        //       }
        //     }
        //   })
        // }
    }
    var that = this;
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
    bgm.onEnded(() => {
      that.audioEnd();
    })
    bgm.onTimeUpdate(() => {
      let val = parseInt(bgm.currentTime / bgm.duration * 100);
      let times = this.formatSeconds(bgm.currentTime);
      let dt = this.formatSeconds(bgm.duration);
      this.setData({
        currentTime: times,
        totalTime: dt,
        audioValue: val
      })
    })
    this.getNewsList(option.id);
    this.setData({
        courseId:option.id,
        week: option.week,
        type: option.type
    })
  },
  onShow(){
  },

  async getNewsList(id){
      let that = this;
    let data = await util.httpRequestWithPromise('/rest/cbti/course?id='+id,'GET','',wx.getStorageSync('key'));
      console.log(data);
      if(data.statusCode === 200){
        this.setData({
          articleList:data.data.data,
          src:config.imageUrlPrefix+data.data.data.fileUploadList[0].fileUrl
        });
        WxParse.wxParse('article', 'html', data.data.data.content, that, 2);

      }
   },
  audioPlay: function () {
    bgm.protocol = 'http'
    bgm.title = this.data.articleList.title;
    bgm.src = this.data.src;
    bgm.play();
    bgm.duration;
    this.setData({
        audioAction: {
          method: 'pause'
        },

      });
  },
  audioPause: function () {
    bgm.pause();
    this.setData({
        audioAction: {
          method: 'play'
        }
      });
  },
  
  timeSliderChanged(e){
    var time = bgm.duration * e.detail.value / 100;
    bgm.seek(time)
  },
  async audioEnd(){
    if(this.data.week > 1 && this.data.courseClass != '1') {
      this.setData({
        notifyHidden: false
      })
    } else {
      let data = await util.httpRequestWithPromise('/rest/evaluationProgramLearn/done?courseId='+this.data.courseId,'GET','',wx.getStorageSync('key'));
      if(data.data.result == "true") {
          this.setData({
            notifyHidden: false
          })
      }
    }
  },
  ok() {
    this.setData({
      notifyHidden: true
    })
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[ pages.length - 2 ];  
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        week:this.data.week,
        type : this.data.type
    })
    wx.navigateBack({
      delta: 1
    })
  },
 formatSeconds(value) {
     
    var secondTime = parseInt(value);// 秒
    // console.log(secondTime);
    var minuteTime = 0;// 分
    // var hourTime = 0;// 小时
    if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if(minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var result = parseInt(secondTime);
    if(secondTime<10){
        result = '0'+parseInt(secondTime);
    }
    if(secondTime >=10){
        result = parseInt(secondTime);
    }
   
    if(minuteTime < 10) {
        result = "0" + parseInt(minuteTime) + ":" + result;
    }
    if(minuteTime >= 10){
        result =  parseInt(minuteTime) + ":" + result;
    }

    // if(hourTime > 0) {
    //     result = "" + parseInt(hourTime) + "小时" + result;
    // }
    return result;
  },
  
})
