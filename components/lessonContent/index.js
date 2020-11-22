import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
import config from '../../utils/dev.config.js';
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()

Page({
  data: {
    id: "",
    icon60: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    articleDetail: null,
    showPay: false,
    isActive:1,
    vUrl:null,
    isShowBuyBtn:true,
    hidden: true
  },
  onLoad: function (option) {
    console.info(option)
    // this.getResultDetail('1151718303618605056')
    if (option.from == 1) {
      this.getDetail(option.id);
    } else if (option.from == 2) {
      this.getResultDetail(option.id);
    } else if(option.from == 3){
      this.getResultDetail(option.id);
      this.setData({
        isShowBuyBtn:!option.isOrder
      })
    }else {
      this.setData({
        articleDetail: {
          createDate: option.createDate,
          title: option.title,

        },
        showPay: true
      })
    }
    this.setData({
      id: option.id
    })


  },
  async getDetail(id) {
    let that = this;
    let data = await util.httpRequestWithPromise('/cms/article?id=' + id, 'GET', '', '');
    if (data.statusCode === 200) {
      WxParse.wxParse('article', 'html', data.data.articleData.content, that, 2);

      that.setData({
        articleDetail: data.data
      })
    }
  },
  async getResultDetail(id) {
    let that = this;
    let data = await util.httpRequestWithPromise('/rest/evaluationProgram/form?id=' + id, 'GET', '', wx.getStorageSync('key'));
    console.log(data);
    if (data.statusCode === 200) {
      if (data.data.message == '200') {
        var vUrl = "";
        if (data.data.data.imageUploads != null && data.data.data.imageUploads.length > 0) {
            vUrl = config.imageUrlPrefix + data.data.data.imageUploads[0].fileUrl;
        }
        this.setData({
          articleDetail: data.data.data,
          vUrl:vUrl
        });

      wx.setNavigationBarTitle({
        title: 'CBTI PLUS' + data.data.data.title,
      })
        WxParse.wxParse('article', 'html', data.data.data.evaluationProgramData.content, that, 20);

        if (data.data.data.price > 0) {
          this.setData({
            showPay: true
          })
        }
      }

    }
  },
  imgYu() {
    var that = this;
    var src = that.data.vUrl;//获取data-src
    var list = [that.data.vUrl];
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  async buyNow() {
    wx.navigateTo({
      url: '../../components/payMoney/index?id='+this.data.id +'&title='+this.data.articleDetail.title +'&description='+this.data.articleDetail.remark +'&price='+this.data.articleDetail.price +'&total='+this.data.articleDetail.price
    })
        // let that = this;
        // let result = await util.httpRequestWithPromise('/pay/getPrepayIdResult?id=' + this.data.id, 'POST', '', wx.getStorageSync('key'));
        // var timastemp = Date.parse(new Date()) / 1000 + '';
        // wx.requestPayment(
        //   {
        //     'appId': result.data.data.appId,
        //     'timeStamp': result.data.data.timeStamp,
        //     'nonceStr': result.data.data.nonceStr,
        //     'package': result.data.data.packageValue,
        //     'signType': result.data.data.signType,
        //     'paySign': result.data.data.paySign,
        //     'success': function (res) {
        //       if (res.errMsg == "requestPayment:ok") {
        //         that.paySuccess();
                
        //       }
        //     },
        //     'fail': function (res) {
        //       console.info(res);

        //     },
        //     'complete': function (res) {
        //       console.info(res);

        //     }
        //   })
  },
  async paySuccess() {
    let { data } = await util.httpRequestWithPromise('/rest/evaluationOrder/form', 'POST', '', wx.getStorageSync('key'));
    console.info(data);
    var that = this;
    if (data.message == '200') {
      wx.redirectTo({
        url: '../../components/confirmNotic/index?id=&price=&title=&createDate=&from=5'
      })
    } 
  },
  
  goToResult: function () {
    wx.navigateTo({
      url: '../../components/sleepResult/index'
    })
  },
  tab1(){
    this.setData({
      isActive:1
    })
  },
  tab2(){
    this.setData({
      isActive:2
    })
  },
  handleContact(){
    console.log(e.path)
    console.log(e.query)
  },
  async ok() {
    let {data} = await util.httpRequestWithPromise('/rest/evaluationOrder/form', 'POST', '', wx.getStorageSync('key'));
    console.info(data);
    var that = this;
    if(data.message == '200') {
      wx.navigateTo({
        url: '../../components/confirmNotic/index?id=' + data.data.id + '&price=' + data.data.price + '&title=' + data.data.evaluationProgram.title+'&createDate='+data.data.createDate+'&from=4'
      })
    } else if(data.message == '600') {
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
                  } catch (e) {

                  }
                  that.ok();

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
  },
  cancel() {
    wx.switchTab({
      url: '../../pages/index/index',
    })
  }
})