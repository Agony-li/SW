// pages/course/course.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: ['1'],
    courseType: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCourseList(this.data.courseType)
  },

  // 切换tab
  currentTab(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      courseType: type
    })
    this.getCourseList(type)
  },

  // 获取课程列表
  async getCourseList(type) {
    let data = await util.httpRequestWithPromise(`/rest/cbti/course/${type}`, 'get', '', wx.getStorageSync('key'));
    console.log('获取课程列表', data)
    if (data.statusCode === 200) {
      
    }
  },
  
  // 跳转到课程详情
  gotoCourseDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/course/coursedetail?id='+id,
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