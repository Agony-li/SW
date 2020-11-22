//index.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
var  WxParse= require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.loadCoupons()
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

  },

  async loadCoupons() {
    let data = await util.httpRequestWithPromise('/rest/coupon/list', 'GET', '', wx.getStorageSync('key'));
    if(data.statusCode === 200){
      this.setData({
        list:data.data.data,
      });
    }
  },
  async receive(o) {
      let data = await util.httpRequestWithPromise('/rest/coupon/receive?id=' + o.currentTarget.dataset.id, 'GET', '', wx.getStorageSync('key'));
      if(data.statusCode == 200){
        this.loadCoupons();
      }
  }
})