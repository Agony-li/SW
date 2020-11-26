import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
import config from '../../utils/dev.config.js';
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()

Page({
  data: {
    id: "",
    articleDetail: null,
    price: "",
    title: "",
    createDate: "",
    form:"",
    hidden: true,
    nocancel: true,
    djs: 10
  },
  onLoad: function (option) {  
    this.setData({
      id: option.id,
      price: option.price,
      title: option.title,
      createDate: option.createDate,
      form: option.from,
    })
    this.getDetail(option.id);

  },
  onShow: function(){
   
  },
  async getDetail(id) {
    let that = this;
    var pid = "1214947400883032064";
    console.info(this.data.form)
    if(this.data.form == 4 || this.data.form == 5) {
      pid = "1214985121814990848";
    }
    let data = await util.httpRequestWithPromise('/rest/cms/article?id=' + pid, 'GET', '', wx.getStorageSync('key'));
    console.log(data);
    if (data.statusCode === 200) {
      WxParse.wxParse('article', 'html', data.data.data.articleData.content, that, 10);
      console.info(this.data.form)
      if(this.data.form == 5) {
        var t = setInterval(function() {
          var dj = parseInt(that.data.djs);
          dj = dj - 1;
          if(dj > 0) {
            that.setData({
              djs: dj
            })
          } else {
            that.setData({
              djs: 0
            })
            clearTimeout(t);
          }
          
        }, 1000);
      }
    }
  },
  
  async buyNow() {
    if(this.data.form == 5 && parseInt(this.data.djs) > 0) return;
    if(this.data.form == 4) {
      this.setData({
        hidden: false
      });
    } else if(this.data.form == 5){
      wx.switchTab({
        url: '../../pages/index/index'
      })
    }  else {
      wx.navigateTo({
        url: '../../components/lessonContent/index?id=' + this.data.id + '&price=' + this.data.price + '&title=' + this.data.title + '&createDate=' + this.data.createDate + '&from=3'
      })
    }
  },
  cancel: function () {
    this.setData({
      hidden: true
    });
  },

  async confirm () {
    this.setData({
      hidden: true
    });
    let data = await util.httpRequestWithPromise('/rest/evaluationOrder/open?id=' + this.data.id, 'GET', '', '');
    wx.switchTab({
      url: '../../pages/index/index'
    })
  }
})