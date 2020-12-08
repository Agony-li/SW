// pages/course/courselist.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config';
var  WxParse= require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:null,
    audio: {},
    imageUrlPrefix: config.imageUrlPrefix
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCourseDetail(options.id)
  },

  // 获取课程详情
  async getCourseDetail(id) {
    let data = await util.httpRequestWithPromise(`/rest/cbti/course?id=${id}`, 'get', '', wx.getStorageSync('key'));
    console.log('获取课程详情', data.data.data)
    if (data.statusCode === 200) {
      if(data.data.data.content!=undefined){
        WxParse.wxParse('article', 'html', data.data.data.content, this, 2);
      }
      let fileUpload = data.data.data.fileUploadList[0]
      let audio = {
        name: fileUpload.fileName,
        author: fileUpload.createBy, 
        poster: 'https://s3.ax1x.com/2020/11/12/Bxkew6.png',
        src: this.data.imageUrlPrefix+fileUpload.fileUrl
      }
      this.setData({
        detail:data.data.data,
        audio: audio
      })
    }
  },

  // 音频自动播放完
  endAutoPlay(){
    console.log('音频自动播放完')
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