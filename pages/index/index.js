//index.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
var WxParse = require('../../wxParse/wxParse.js');
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
//获取应用实例
const app = getApp()

Page({
  data: {
    imgBaseUrl: config.imageUrlPrefix,
    imgUrls: [
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    quickList: [], // 快速计划
    articles: [],  // 大咖说
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    urls: config.imageUrlPrefix,
    content: '<!--HTML--><p style=";font-family: Calibri;font-size: 14px;white-space: normal;text-indent: 37px"><span style="font-family: 宋体; font-size: 19px; color: rgb(0, 0, 0);">用户您好，欢迎来到睡美人！\r\n</span></p><p style=";font-family: Calibri;font-size: 14px;white-space: normal;text-indent: 37px"><span style="font-family: 宋体; font-size: 19px; color: rgb(0, 0, 0);">\r\n虽然失眠很常见,但导致失眠的原因非常复杂，为了给您提供更加精准的睡眠服务，请您完成睡眠测试。</span></p><p style=";font-family: Calibri;font-size: 14px;white-space: normal;text-indent: 37px"><span style="font-family: 宋体; font-size: 19px; color: rgb(0, 0, 0);">测试分三个部分，您可能会回答以下问题或部分问题(因情况不同而异)：</span></p><p style=";font-family: Calibri;font-size: 14px;white-space: normal;text-indent: 37px"><span style="font-family: 宋体; color: rgb(255, 0, 0); font-size: 19px;"><span style="color: rgb(0, 0, 0); font-family: 宋体;">1、失眠严重程度测试，回答</span>7个问题。</span></p><p style=";font-family: Calibri;font-size: 14px;white-space: normal;text-indent: 37px"><span style="font-family: 宋体; color: rgb(255, 0, 0); font-size: 19px;"><span style="color: rgb(0, 0, 0); font-family: 宋体;">2、生理原因分析，回答</span>1-14个问题。</span></p><p style=";font-family: Calibri;font-size: 14px;white-space: normal;text-indent: 37px"><span style="font-family: 宋体; color: rgb(255, 0, 0); font-size: 19px;"><span style="color: rgb(0, 0, 0); font-family: 宋体;">3、心理原因测试，回答</span>29个问题。</span></p><p style=";font-family: Calibri;font-size: 14px;white-space: normal;text-indent: 37px"><span style="font-family: 宋体; font-size: 19px; color: rgb(0, 0, 0);">为了您的健康，请务必仔细阅读、认真回答，再次感谢！</span></p><p><br/></p> ',
    notifyHidden: true
  },
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },
  onLoad: function () {
    this.getBannersList();  // 获取banner接口
    this.getQuickList(); // 获取快速入口
    this.getArticle(); // 获取大咖说
    WxParse.wxParse('article', 'html', this.data.content, this, 2);
  },
  onShow: function () {
  },

  // 获取banner接口
  async getBannersList() {
    let data = await util.httpRequestWithPromise('/rest/cms/articles?category=0003', 'get', '', '');
    console.log('首页banner', data.data.list);
    if (data.statusCode === 200) {
      this.setData({
        imgUrls: data.data.list
      })
    }
  },

  // 获取快速入口
  async getQuickList() {
    let data = await util.httpRequestWithPromise('/rest/cms/articles?category=0012', 'get', '', '');
    console.log('获取快速入口', data.data.list);
    if (data.statusCode === 200) {
      this.setData({
        quickList: data.data.list
      })
    }
  },

  // 点击快速入口
  gotoPlanTab(){
    wx.switchTab({
      url: '../../pages/CBTI/index',
    })
  },

  async goToTest () {
    let userInfo = wx.getStorageSync('info')
    if(!userInfo){
      wx.navigateTo({
        url: '../userCenter/login',
      })
      return
    }
    let that = this;
    let isCheck = await  util.httpRequestWithPromise('/rest/evaluationType/listData.json?dictType=slepping_test&type=2', 'GET', '', wx.getStorageSync('key'));
    try {
      var value = wx.getStorageSync('key');
      console.info('value' + value);
      console.info('isCheck' + isCheck);
      if (value && isCheck.data.message != '600') {
        if(isCheck.data.message=='200'){
          // that.closeTotest();
          console.log('应该弹窗')
          wx.navigateTo({
            url: '../../components/testIntro/testIntro',
          })
        }else if(isCheck.data.message=='500'){
          wx.navigateTo({
            url: '../../components/serviceOpen/index?score='+isCheck.data.total+'&isOrder='+isCheck.data.isOrder+'&pId='+isCheck.data.programId
          })
        } else if(isCheck.data.message=='501') {
          wx.showToast({
            title: '请在订单中进行付款!',
          })
        } else if(isCheck.data.message=='601') {
          wx.showModal({
        title: '提示',
        content: '请完善个人信息',
        showCancel: false,
        confirmText:'确定',
        success(res){
          if(res.confirm){
              wx.navigateTo({
                url: '../../components/userInfo/index',
              })
          }
        }
      })
      } 
      } else {
        that.showDialog();
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  async closeTotest() {
    let isData = await util.httpRequestWithPromise('/rest/evaluationData/closeTest', 'GET', '', wx.getStorageSync('key'))
    if(isData.data.message == '200'){
      this.setData({
        notifyHidden:false
      })
    } 
  },
  
  // 获取大咖说接口
  async getArticle() {
    let data = await util.httpRequestWithPromise('/rest/cms/articles?category=0007&pageNo=1&pageSize=2', 'get', '', '');
    console.log('大咖说', data);
    if (data.statusCode === 200) {
      this.setData({
        articles: data.data.list
      })
    }
  },

  // 跳转到大咖说列表
  gotoArticleList(){
    wx.navigateTo({
      url: '../article/articlelist',
    })
  },

  // 跳转到文章详情
  gotoArticleDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../article/articledetail?id='+id,
    })
  },

  ok() {
    this.setData({
      notifyHidden: true
    })
    wx.navigateTo({
      url: '../../components/sleepTest/index?testType=slepping_test&type=2'
    })
  },
  showDialog: function () {
    this.dialog.showDialog();
  },

  confirmEvent: function () {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function (e) {
    this.login(e)
  },
  login: function (e) {
    console.info(e);
    //授权成功后,通过改变isHide的值，让实现页面显示出来，把授权页面隐藏起来
    wx.login({
      success: sult => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (sult.code) {
          //发起网络请求
          wx.request({
            url: config.imageUrlPrefix + '/wx/user/'+config.appid+'/login',
            data: {
              code: sult.code,
              avatarUrl: e.detail.detail.userInfo.avatarUrl,
              nickName: e.detail.detail.userInfo.nickName,
              gender: e.detail.detail.userInfo.gender
            },
            success: function (suc) {
              console.info("suc = " + JSON.stringify(suc));
              if (suc.statusCode === 200) {
                try {
                  wx.setStorageSync('key', suc.data.token);
                  wx.setStorageSync('info', suc.data.userInfo);
                } catch (e) {

                }

              } else {
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