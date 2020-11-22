import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
var WxParse = require('../../wxParse/wxParse.js');

const app = getApp()

Page({
  data: {
    slepping_test:[],
    apnea: [],
    phq: [],
    plm: [],
    restless_legs: [],
    sas: [],
    spiritual: [],
    text : ""
  },
  onLoad: function () {
    this.getLogList();
  },
  onReady() {

  },
  async getLogList() {
    let that = this;
    let { data } = await util.httpRequestWithPromise('/rest/user/test', 'GET', '', wx.getStorageSync('key'));
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
      WxParse.wxParse('article', 'html', data.spiritual[0].dictLabel, that, 2);
      var stInt = 0;
      for (var i = 0; i < data.slepping_test.length; i++) {
        var item = data.slepping_test[i];
        for (var j = 0; j < item.childList.length; j++) {
          var jitem = item.childList[j];
          if (jitem.checked) {
            stInt += Number(jitem.dictValue);
          }
        }
      }

      var apInt = 0;
      for (var i = 0; i < data.apnea.length; i++) {
        var item = data.apnea[i];
        for (var j = 0; j < item.childList.length; j++) {
          var jitem = item.childList[j];
          if (jitem.checked) {
            apInt += Number(jitem.dictValue);
          }
        }
      }

      var phqInt = 0;
      for (var i = 0; i < data.phq.length; i++) {
        var item = data.phq[i];
        for (var j = 0; j < item.childList.length; j++) {
          var jitem = item.childList[j];
          if (jitem.checked) {
            phqInt += Number(jitem.dictValue);
          }
        }
      }

      var plmInt = 0;
      for (var i = 0; i < data.plm.length; i++) {
        var item = data.plm[i];
        for (var j = 0; j < item.childList.length; j++) {
          var jitem = item.childList[j];
          if (jitem.checked) {
            plmInt += Number(jitem.dictValue);
          }
        }
      }

      var rlInt = 0;
      for (var i = 0; i < data.restless_legs.length; i++) {
        var item = data.restless_legs[i];
        for (var j = 0; j < item.childList.length; j++) {
          var jitem = item.childList[j];
          if (jitem.checked) {
            rlInt += Number(jitem.dictValue);
          }
        }
      }

      var sasInt = 0;
      for (var i = 0; i < data.sas.length; i++) {
        var item = data.sas[i];
        for (var j = 0; j < item.childList.length; j++) {
          var jitem = item.childList[j];
          if (jitem.checked) {
            sasInt += Number(jitem.dictValue);
          }
        }
      }

      var sInt = 0;
      for (var i = 0; i < data.spiritual.length; i++) {
        var item = data.spiritual[i];
        for (var j = 0; j < item.childList.length; j++) {
          var jitem = item.childList[j];
          if (jitem.checked) {
            sInt += Number(jitem.dictValue);
          }
        }
      }
      var text = "";
      if(stInt <= 7) {
        text = "恭喜恭喜,经测评您目前没有显著失眠问题"
      } else if (stInt >= 8 && stInt <= 14) {
        text = "经测评您目前有轻度失眠问题"
      } else if (stInt >= 15 && stInt <= 21) {
        text = "经测评您目前有中度失眠问题"
      } else if (stInt >= 22) {
        text = "经测评您目前有重度失眠问题"
      }
      
      if(data.result != '') {
        text += ", 您选择的是 " + data.result;
      }
      that.setData({
        slepping_test: data.slepping_test,
        apnea: data.apnea,
        phq: data.phq,
        plm: data.plm,
        restless_legs: data.restless_legs,
        sas: data.sas,
        spiritual: data.spiritual,
        text: text
      })
    }
  },
})