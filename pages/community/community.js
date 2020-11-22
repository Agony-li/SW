// pages/community/community.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: config.imageUrlPrefix,
    imgUrls: [],
    qrcodeImg: '', // 二维码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBannersList()
    this.getQrcode()
  },

  // 获取banner接口
  async getBannersList() {
    let data = await util.httpRequestWithPromise('/rest/cms/articles?category=0010', 'get', '', '');
    console.log('社区banner', data.data.list);
    if (data.statusCode === 200) {
      this.setData({
        imgUrls: data.data.list
      })
    }
  },

  // 获取二维码
  async getQrcode() {
    let data = await util.httpRequestWithPromise('/rest/cms/articles?category=0011', 'get', '', '');
    console.log('二维码', data.data.list[0].image);
    if (data.statusCode === 200) {
      this.setData({
        qrcodeImg: data.data.list[0].image
      })
    }
  },

  // 跳转到文章详情
  gotoArticleDetail(){
    wx.navigateTo({
      url: '../community/gooditemlist',
    })
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