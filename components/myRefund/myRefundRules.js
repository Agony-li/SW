// components/myRefund/myRefundRules.js
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ``
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取奖金规则
    let id = '1359492299438600192'
    this.getMyBonusRules(id)
  },

  // 获取奖金规则
  async getMyBonusRules(id){
    let data = await util.httpRequestWithPromise(`/rest/cms/article?id=${id}`, 'get', '', wx.getStorageSync('key'));
    console.log('获取奖金规则', data.data.data)
    if (data.statusCode === 200) {
      if(data.data.data.articleData.content!=undefined){
        this.setData({
          content:data.data.data.articleData.content,
        })
      }
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