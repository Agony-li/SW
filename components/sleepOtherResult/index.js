import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
var  WxParse= require('../../wxParse/wxParse.js');
const app = getApp()

Page({
  data: {
    id: "",
    price: "",
    remark: "",
    title: "",
    createDate: "",
    from: "",
    imgUrl: '../../image/sleep_no_p@2x.png',
    isOrder: false,
    programId: null,
    resultList: [],
    isShowResult: false,
    tjId: '', // 推荐文章id
    articleDetail: '',
  },
  onLoad: function (option) {
    console.info(option.title)
    if(option.title != '' && option.title != null && option.title != undefined) {
      wx.setNavigationBarTitle({
        title: '心理原因分析',
      })
    }
    this.setData({
      tjId: option.tjId,
      id: option.id,
      price: option.price,
      title: option.title,
      createDate: option.createDate ,
      from: option.from,
      isOrder: option.isOrder,
      programId: option.pId,
      remark: option.remark
    })
    this.getArticleDetail(option.tjId)
  },
  
  goToLession() {
    wx.navigateBack();
  },
  async getArticleDetail(id, form){
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
        articleDetail:data.data.data
      })
    }
  },
  async endTest() {
    // let data = await util.httpRequestWithPromise('/rest/evaluationData/closeTest', 'GET', '', wx.getStorageSync('key'))
    // if (data.data.message == '200') {
      wx.switchTab({
        url: '../../pages/index/index'
      })
    // } else {
    //   wx.showToast({
    //     title: data.data.message,
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false
    // }
  },
  async goToOther(e) {
    let type = e.currentTarget.dataset.type;
    let data = await util.httpRequestWithPromise('/rest/evaluationData/getPrograms?dictType=slepping_test' + '&total=' + this.data.score + '&type=' + type, 'GET', '', wx.getStorageSync('key'))
    if (data.data.message === '200') {
      wx.navigateTo({
        url: '../../components/confirmNotic/index?id=' + data.data.data[0].id + '&from=2'
      })
    } else {
      wx.showToast({
        title: data.data.message,
        icon: 'none',
        duration: 2000
      })
      return false
    }
  },
  confirm() {
    wx.navigateTo({
      url: '../../components/confirmNotic/index?id=' + this.data.id + '&price=' + this.data.price + '&title=' + this.data.title + '&createDate=' + this.data.createDate + '&from=3'
    })
  }

})