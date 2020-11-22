import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
var WxParse = require('../../wxParse/wxParse.js');

const app = getApp()

Page({
  data: {
    start:0,
    end: 0,
    score: 0,
    done: true,
    upload: [],
    endUpload:[],
    b:false,
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
    let { data } = await util.httpRequestWithPromise('/rest/user/sleep?week='+ this.data.week+'&type=2', 'GET', '', wx.getStorageSync('key'));
    if (data.message == 600) {
		wx.navigateTo({url: '/pages/userCenter/login?rt=2' });
      // wx.login({
      //   success(res) {
      //     if (res.code) {
      //       //发起网络请求
      //       wx.request({
      //         url: config.imageUrlPrefix + '/wx/user/wx2f4af9802d72f78a/login',
      //         data: {
      //           code: res.code
      //         },
      //         success: function (res) {
      //           if (res.statusCode === 200) {
      //             try {
      //               wx.setStorageSync('key', res.data.token);
      //               wx.setStorageSync('info', res.data.userInfo);
      //             } catch (e) {

      //             }
      //             that.getLogList();

      //           } else {
      //             wx.showToast({
      //               title: '登录失败',
      //               icon: 'none',
      //               duration: 2000
      //             })

      //           }

      //         }
      //       })
      //     } else {
      //       console.log('登录失败！' + res.errMsg)
      //     }
      //   }
      // })
    } else if(data.message == 200){
      var uploadFile = [];
      var endUploadFile = [];
      var tzUploadFile = [];
	  if(data.upload.length < 1){
	  		  that.showMsg();
	  		  return;
	  }
      for(var i = 0; i < data.upload.length; i++) {
        uploadFile[i] = config.imageUrlPrefix + data.upload[i].fileUrl
      }
      if(data.tzFilterList != null) {
        for(var i = 0; i < data.tzFilterList.length; i++) {
        tzUploadFile[i] = config.imageUrlPrefix + data.tzFilterList[i].fileUrl
        }
      }
      if(data.endFileUpload != null) {
        for(var i = 0; i < data.endFileUpload.length; i++) {
          endUploadFile[i] = config.imageUrlPrefix + data.endFileUpload[i].fileUrl
        }
      }
    var done = false;
    if(data.score < 30 && data.avgScore > 29) {
      done = true;
    } else if(data.score > 49 && data.score < 60 && data.avgScore > 24) {
      done = true;
    } else if(data.score > 59 && data.score < 70 && data.avgScore > 19) {
      done = true;
    } else if(data.score > 69 && data.score < 80 && data.avgScore > 14) {
      done = true;
    } else if(data.score > 79 && data.score < 90 && data.avgScore > 9) {
      done = true;
    }
      that.setData({
        start: data.score,
        end: data.endScore,
        tzUpload: tzUploadFile,
        tz:data.tzScore,
        upload: uploadFile,
        endUpload: endUploadFile,
        b: data.b,
        score: data.avgScore,
        done: done
      })
    } else if(data.message == 300) {
      that.showMsg();
    } else {
		that.setData({b:true});
		that.showMsg();
	}
  },
  onClickShow: function () {
    var that = this;
    wx.previewImage({
      current: that.data.upload[0], // 当前显示图片的http链接
      urls: that.data.upload // 需要预览的图片http链接列表
    })
  },
  onClickShowEnd: function () {
    var that = this;
    console.info(this.data.endUpload)
    wx.previewImage({
      current: that.data.endUpload[0], // 当前显示图片的http链接
      urls: that.data.endUpload // 需要预览的图片http链接列表
    })
  },
  showMsg() {
	  wx.showModal({
	     title: '提示',
	     showCancel:'false',
	     content: '请先完成所有任务, 再来查看最终报告!',
	     confirmText:"确定",//默认是“确定”
	     success: function (res) {
	        if (res.cancel) {
	         wx.navigateBack({
	           complete: (res) => {},
	         })
	        } else {
	         wx.navigateBack({
	           complete: (res) => {},
	         })
	        }
	     },
	     fail: function (res) { },//接口调用失败的回调函数
	     complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
	  })
  }
  
})