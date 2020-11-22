//index.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
//获取应用实例
const app = getApp()

Page({
  data: {
   canIUse: wx.canIUse('button.open-type.getUserInfo'),
   dialogphone: true,
   userInfo: '',
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.dialog = this.selectComponent("#dialog");
    this.setData({
      userInfo: wx.getStorageSync('info')
    })
  },
  onLoad: function () {
      if(!wx.getStorageSync('key')) {
        this.setData({
          loginState: true
        })
      }
  },
  onShow(){
    // this.getMyMission();
  },

  showBindPhone: function(){
    this.setData({
      dialogphone: false
    })
  },

  hiddenBindPhone: function(){
    this.setData({
      dialogphone: true
    })
  },

  // 跳转到我的信息页
  gotoUserInfoPage(){
    if(this.data.userInfo){
      wx.navigateTo({
        url: '../../components/userInfo/index',
      })
    }else{
      wx.navigateTo({
        url: './login',
      })
    }
  },
 
  
  showDialog: function(){
    this.dialog.showDialog();
    },
    
    confirmEvent: function(){
    this.dialog.hideDialog();
    },
    bindGetUserInfo: function(e) {
    var that = this;
    var userInfo = e.detail.userInfo == null ? e.detail.detail.userInfo: e.detail.userInfo;
    console.log(userInfo)
    if (userInfo){
      wx.login({
        success: sult => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(sult)
          if (sult.code) {
            //发起网络请求
            console.log(config.imageUrlPrefix+'/wx/user/wx2f4af9802d72f78a/login')
            wx.request({
              url: config.imageUrlPrefix+'/wx/user/wx2f4af9802d72f78a/login',
              data: {
                code: sult.code,
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                gender:userInfo.gender
              },
              success: function (suc) {
                console.log(suc)
                if(suc.statusCode === 200){
                  try {
                    wx.setStorageSync('key', suc.data.token);
                    wx.setStorageSync('info', suc.data.userInfo);
                    // that.getMyMission();
                    that.setData({
                      loginState: false
                    })
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
    } else {
      //用户按了拒绝按钮
    }
  }
  
})
