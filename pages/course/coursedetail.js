// pages/course/courselist.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config';
var  WxParse= require('../../wxParse/wxParse.js');
const audioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: '',
    detail:null,
    audio: {},
    imageUrlPrefix: config.imageUrlPrefix
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      courseId: options.id
    })
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
      // audioContext.src = this.data.imageUrlPrefix+fileUpload.fileUrl
      let audio = {
        name: fileUpload.fileName,
        author: fileUpload.createBy, 
        poster: 'https://s3.ax1x.com/2020/11/12/Bxkew6.png',
        src: this.data.imageUrlPrefix+fileUpload.fileUrl,
      }
      this.setData({
        detail:data.data.data,
        audio: audio
      })
      
    }
  },

  // play(){
  //   audioContext.play()
  //   audioContext.onPlay(() => {
  //     console.log('开始播放')
  //     audioContext.duration;
  //     setTimeout(()=>{
  //       console.log('播放时长:'+audioContext.duration)
  //     },200)
  //   })
  // },

  // 音频自动播放完
  endAutoPlay(){
    console.log('音频自动播放完')
    this.audioEnd()
  },

  // 确认完成任务提示
  audioEndDialog(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确认完成该课程!',
      success (res) {
        if (res.confirm) {
          that.audioEnd()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  // 完成课程任务方法
  async audioEnd(){
    let data = await util.httpRequestWithPromise('/rest/evaluationProgramLearn/done?courseId='+this.data.courseId,'GET','',wx.getStorageSync('key'));
    if(data.data.result == "true") {
      wx.showModal({
        title: '提示',
        content: '您已完成本课时!',
        success (res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
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