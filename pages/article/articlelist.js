// pages/mastersaidlist/mastersaidlist.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: config.imageUrlPrefix,
    articleType: '0007003', // 默认选中的tab 亚健康(0007003)  减脂(0007001) 睡眠(0007002)
    count: '',
    pageNo: '1',
    pageSize: '10',
    articleList: [], // 文章列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleList()
  },

  // 切换列表tab
  currentTab(e){
    let activeTab = e.currentTarget.dataset.type
    console.log(activeTab)
    this.setData({
      articleType: activeTab
    })
    this.getArticleList()
  },

  // 获取文章列表
  async getArticleList() {
    let data = await util.httpRequestWithPromise(`/rest/cms/articles?category=${this.data.articleType}&pageNo=${this.data.pageNo}&pageSize=${this.data.pageSize}`, 'get', '', wx.getStorageSync('key'));
    console.log('文章列表', data.data);
    if (data.statusCode === 200) {
      this.setData({
        articleList: data.data.list
      })
    }
  },

  // 跳转到文章详情
  gotoArticleDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../article/articledetail?id='+id,
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