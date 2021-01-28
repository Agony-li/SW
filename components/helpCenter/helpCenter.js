import util from '../../utils/util.js';
import config from '../../utils/dev.config';
var  WxParse= require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleDetail(options.id)
    this.setTitle(options.type)
  },

  // 获取课程详情
  async getArticleDetail(id) {
    let data = await util.httpRequestWithPromise(`/rest/cms/article?id=${id}`, 'get', '', wx.getStorageSync('key'));
    console.log('获取课程详情', data.data.data)
    if (data.statusCode === 200) {
      if(data.data.data.articleData.content!=undefined){
        WxParse.wxParse('article', 'html', data.data.data.articleData.content, this, 2);
        this.setData({
          detail:data.data.data.articleData.content.replace(/\<img/gi, '<img style="width:100%;height:auto;display:block" '),
        })
      }
    }
  },

  // 设置标题
  setTitle(type){
    if(type == 1){
      wx.setNavigationBarTitle({
        title:'版本'
      })
    }else if(type == 2){
      wx.setNavigationBarTitle({
        title:'帮助中心'
      })
    }else if(type == 3){
      wx.setNavigationBarTitle({
        title:'关于我们'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})