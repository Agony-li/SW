
//index.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
//获取应用实例
const app = getApp()

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
    hidden: true,
    week: 0,
    contentList:[
      {name:'CBTI',icon:'../../image/cbti_icon@2x.png', courseType:0},
      {name:'运动',icon:'../../image/cbti_icon_1@2x.png',courseType:0},
      {name:'饮食',icon:'../../image/cbti_icon_3@2x.png',courseType:0}
    ],
},
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio');
    this.dialog = this.selectComponent("#dialog");
  },
  onLoad: function () {
  //  this.checkTest();
  this.confirmClass();
  },
  onShow(){
    this.checkTest();
    this.confirmClass();
  },
  goToLog:function(){
    wx.navigateTo({
      url: '../../components/myLog/index'
    })
  },
  goToXinli: function() {
    wx.navigateTo({
      url: '../../components/xinli/index'
    })
  },
  goToTest:function(){
    wx.navigateTo({
      url: '../../components/sleepTest/index'
    })
  },
  goToFz:function() {
    wx.navigateTo({
      url: '../../components/fz/index',
    })
  },
  audioPlay: function () {
    this.audioCtx.play();
    this.setData({
        audioAction: {
          method: 'pause'
        }
      });
  },
  audioPause: function () {
    this.audioCtx.pause();
    this.setData({
        audioAction: {
          method: 'play'
        }
      });
  },
  audioTime(e){
   console.log(e);
   let val = parseInt(e.detail.currentTime/e.detail.duration*100);
   console.log(val);
   let times = this.formatSeconds(e.detail.currentTime);
   let duration = e.detail.duration;
   this.setData({
       currentTime:times,
       totalTime:duration,
       audioValue:val
   })

  },
  timeSliderChanged(e){
    console.log(this.data.totalTime);
    if (!this.data.totalTime)
    return;

  var time = this.data.totalTime * e.detail.value / 100;
   console.log(time);
  this.audioCtx.seek(time)
  },

 formatSeconds(value) {
     
    var secondTime = parseInt(value);// 秒
    console.log(secondTime);
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
  async confirmClass() {
    let that = this;
    let data = await util.httpRequestWithPromise('/rest/user/selectClass','GET','', wx.getStorageSync('key'));
    console.info(data.data.message)
    if(data.data.data == 0 && data.data.message == '601') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '补救次数为0, 请联系管理重新购买课程!',
        confirmText:"确定",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
           } else {
             wx.switchTab({
               url: '../../pages/index/index',
             })
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
    } else if(data.data.message == '201' || data.data.message == '202') {
      wx.showModal({
        title: '提示',
        showCancel: true,
        content: '心理课程未完成学习, 需补缴66元继续学习！',
        confirmText:"确定",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
              wx.switchTab({
                url: '../../pages/index/index',
              })
           } else {
            that.confirm();
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
    } else if(data.data.data == 2) {
      this.setData({
        hidden: false
      });
    } else if(data.data.message == 900){
      wx.showModal({
        title: '提示',
        showCancel: true,
        content: '您已完成所有课程学习!',
        confirmText:"确定",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
              wx.switchTab({
                url: '../../pages/index/index',
              })
           } else {
            wx.switchTab({
              url: '../../pages/index/index',
            });
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
    } else if(data.data.message == 600) {
      console.info("1111")
      this.showDialog();
    } 
  },
  async checkTest(){
    let that = this;
    let data = await util.httpRequestWithPromise('/rest/cbti/mine','GET','', wx.getStorageSync('key'));
    if(data.data.message == '200'){
      if(data.data.maps.length === 0){
        // wx.navigateTo({
        //   url: '../../components/sleepTest/index?testType=slepping_test'
        // })
      }else{
        let arr = [];
        (data.data.maps).map(item =>{
           arr.push({
             name:item.dict_label,
             courseType:item.course_type,
             icon:item.description
           })
        })
        that.setData({
            contentList:arr,
            week: data.data.week
          })
      }
    } else if(data.data.message == '400') {
      wx.showModal({
        title: '提醒',
        content: '请选择作息时间',
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '/components/scheduleConfig/index?id=',
            })
          }
        }
      })
    }
  },
  async checkType(option){
    var key =  wx.getStorageSync('key');
    if(!key) {
        this.showDialog();
        return;
    }
    let that = this;
    let type = option.currentTarget.dataset.type;
    if (type == 0){
        wx.showModal({
          title: '温馨提示',
          content: '查看课程前请先进行睡眠测试并购买课程!',
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../components/sleepTest/index?testType=slepping_test'
              })
            } else {
              console.log('用户点击辅助操作')
            }
          }
        });        
      } else {
      if (that.data.week == 0) {
          wx.showModal({
            content: '请于下周一开始课程学习!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        } else  {
        console.info(that.data.week)
          wx.navigateTo({
            url: 'list?type=' + type + "&week=" + that.data.week
          })
        }
      }
  },
  goToDetail(option){
    console.log(option)
    wx.navigateTo({
      url: '../../components/cbtiLessonList/index?type='+option.currentTarget.dataset.id
    })
  },
  cancel(){
    this.setData({
      hidden: true
    })
    wx.reLaunch({
      url: '../index/index',
    })
  },
  async confirm(){
    let result = await util.httpRequestWithPromise('/pay/getPrepayIdResult?type=2', 'POST', '', wx.getStorageSync('key'));
    var timastemp = Date.parse(new Date()) / 1000 + '';
    wx.requestPayment(
      {
        'appId': result.data.data.appId,
        'timeStamp': result.data.data.timeStamp,
        'nonceStr': result.data.data.nonceStr,
        'package': result.data.data.packageValue,
        'signType': "MD5",
        'paySign': result.data.data.paySign,
        'success': function (res) {
          wx.showToast({
            title: ' 支付成功',
            icon: 'success',
            duration: 2000,
            success:function(){
                wx.reLaunch({
                  url: '../../pages/index/index',
                })
            }
          })
          
        },
        'fail': function (res) {
          console.info(res);

        },
        'complete': function (res) {
          console.info(res);

        }
      })
  },
  showDialog: function(){
    this.dialog.showDialog();
    },
    
    confirmEvent: function(){
    this.dialog.hideDialog();
    },
    
  bindGetUserInfo: function(e) {
    this.login(e)
  
   },
  login: function(e){
    var that = this;
 //授权成功后,通过改变isHide的值，让实现页面显示出来，把授权页面隐藏起来
wx.login({
  success: sult => {
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    if (sult.code) {
      //发起网络请求
      wx.request({
        url: config.imageUrlPrefix+'/wx/user/'+config.appid+'/login',
        data: {
          code: sult.code,
          avatarUrl: e.detail.detail.userInfo.avatarUrl,
          nickName: e.detail.detail.userInfo.nickName,
          gender:e.detail.detail.userInfo.gender
        },
        success: function (suc) {
         console.info("suc = " +  JSON.stringify(suc));
          if(suc.statusCode === 200){
            try {
              wx.setStorageSync('key', suc.data.token);
              wx.setStorageSync('info', suc.data.userInfo);
              that.checkTest();
              that.confirmClass();
            } catch (e) {

            }
          
          }else{
            wx.showToast({
              title: '登录失败',
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
  
  
})
