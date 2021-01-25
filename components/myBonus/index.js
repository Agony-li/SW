// components/myBonus/index.wxml.js
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取我的奖金
    this.getMyBonus()
  },

  // 获取我的奖金
  async getMyBonus(){
    let data = await util.httpRequestWithPromise(`/rest/ryqmy/bonuslist`, 'get', '', wx.getStorageSync('key'));
    console.log('获取我的奖金', data)
    if (data.statusCode === 200) {
      this.setData({
        balance: data.data.data.balance,
        list: data.data.data.list
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