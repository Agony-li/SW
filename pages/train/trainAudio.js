// pages/train/trainAudio.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appUrl: config.appUrl,
    planTitle:'',
    date: '',
    trainAudio: {}, // 训练对象
    bgAudio:{}, // 音频对象
    isClickEndBtn: false, // 是否可以点击完成任务
    courseList: [], // 推荐阅读列表
    taskType: '', // 任务类型 
    taskName:'',
    isShowDialog: false, // 弹窗
    dialog: {},
    jiaAmount: 0, // 请假价格 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.tasktype
    this.setData({
      planTitle: options.plantitle,
      taskType: type,
      date: new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+new Date().getDate(0)
    })
    // 获取任务训练详情
    this.getTrainAudio(type)
    // 获取推荐阅读课程
    this.getCourseList(type)
    // 获取请假价格
    let label = 'jia'
    this.getAmount(label)
  },

  // 获取请假价格
  async getAmount(label){
    let data = await util.httpRequestWithPromise('/rest/user/amount?label='+label,'GET','',wx.getStorageSync('key'));
    console.log('获取请假价格', data)
    if(data.data.result == "true") {
      this.setData({
        jiaAmount: data.data.data
      })
    }
  },

  // 获取任务训练详情
  async getTrainAudio(type){
    let data = await util.httpRequestWithPromise('/rest/ryqtask/detail?courseType='+type,'GET','',wx.getStorageSync('key'));
    console.log('获取任务训练详情', data)
    if(data.data.result == "true") {
      let fileUpload = data.data.data.fileList[0]
      let audio = {
        title: fileUpload.name,
        singer: '播放完毕即完成课程', 
        src: fileUpload.url,
      }
      this.setData({
        trainAudio: data.data.data,
        bgAudio: audio
      })
    }
  },

  // 获取任务是否允许请假接口
  async planjia(){
    let data = await util.httpRequestWithPromise(`/rest/ryqtask/planjia?type=`+this.data.taskType, 'get', '', wx.getStorageSync('key'));
    console.log('获取任务是否允许请假接口', data)
    if (data.statusCode === 200) {
      let message = data.data.message
      // 弹窗信息
      let des = ''
      let btn1 = '取消'
      let btn2 = {type: 1, txt: '确定'}
      if(message == 603){
        des = '从第四周开始可以每周没项训练请假一次，当前周不能请假'
      }else if(message == 606){
        des = '您本周已经请假过一次了，不能再请假。'
      }else if(message == 200){
        des = '您每周每种任务只能请假一次，本次使用类别 [静]，确定使用吗？'
        btn2 = {type: 2, txt: '支付（'+this.data.jiaAmount+'.00元）'}
      }
      let dialog = {
        title: '请假',
        img: '../../images/qingjia.png',
        des: des,
        btn1,
        btn2
      }
      this.setData({
        dialog,
        isShowDialog: true
      })
    }
  },
  
  // 请假接口
  async taskqingjia(){
    let that = this;
    let result = await util.httpRequestWithPromise('/ryqpay/taskqingjia?courseType=' + this.data.taskType + '&week='+this.data.week, 'POST', '', wx.getStorageSync('key'));
    wx.requestPayment({
      'appId': result.data.data.appId,
      'timeStamp': result.data.data.timeStamp,
      'nonceStr': result.data.data.nonceStr,
      'package': result.data.data.packageValue,
      'signType': "MD5",
      'paySign': result.data.data.paySign,
      'success': function (res) {
        if (res.errMsg == "requestPayment:ok") {
          that.paySuccess();
        }
      },
      'fail': function (res) {
        console.info(res);

      },
      'complete': function (res) {
        console.info(res);
      }
    })
  },

  // 请假信息查询
  async paySuccess() {
    let response = await util.httpRequestWithPromise('/rest/ryqtask/planjiaquery?type='+this.data.taskType,'GET','', wx.getStorageSync('key'));
    if(Number(response.data.message) === 200){
      wx.showToast({
        title: '请假成功!',
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
        title: response.data.message,
        icon: 'none',
        duration: 2000
      })
    }
    wx.reLaunch({
      url: '../index/index',
    })
  },

  // 取消弹窗
  cancelDialog(){
    console.log('取消弹窗');
    this.setData({
      isShowDialog: false
    })
  },


  // 获取课程列表
  async getCourseList(type) {
    let data = await util.httpRequestWithPromise(`/rest/ryqke/courselist?courseType=`+type, 'get', '', wx.getStorageSync('key'));
    console.log('获取课程列表', data)
    if (data.statusCode === 200) {
      this.setData({
        courseList: data.data.data,
      })
    }
  },

  // 跳转到课程详情
  gotoCourseDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/course/coursedetail?id='+id,
    })
  },

  // 音频自动播放完
  endAutoPlay(){
    console.log('音频自动播放完')
    this.setData({
      isClickEndBtn: true
    })
  },

  // 不在作息时间内播放弹窗
  noTimeDialog(){
    wx.showModal({
      title: '提示',
      content: '请在正确的作息时间内完成',
      confirmText: '确认'
    })
  },

  // 完成任务接口
  async finishTrainAudio(){
    if(!this.data.isClickEndBtn){
      return
    }
    let data = await util.httpRequestWithPromise('/rest/ryqtask/done?id='+this.data.trainAudio.id,'GET','',wx.getStorageSync('key'));
    console.log('完成任务接口', data)
    if(data.data.result == "true") {
      if(data.data.message == 200){
        wx.navigateBack({
          delta: 1
        })
      }else if(data.data.message == 607){
        wx.showModal({
          title: '提示',
          content: '请在正确的作息时间内完成任务',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
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