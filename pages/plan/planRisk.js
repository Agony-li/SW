// pages/plan/planRisk.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
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
    this.getPlanRisk()
  },

  // 获取风险提示确认书
  async getPlanRisk() {
    let data = await util.httpRequestWithPromise(`/rest/cms/articles?category=0013002`, 'get', '', wx.getStorageSync('key'));
    console.log('获取风险提示确认书', data)
    if (data.statusCode === 200) {
      this.setData({
        detail:data.data.data.articleData.content
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