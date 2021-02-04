// pages/train/trainUploadPic.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appUrl: config.appUrl,
    isClickEndBtn: false, // 是否可以点击完成任务
    fileList: [], // 图片list
    trainAudio: {}, // 训练对象
    planTitle: '', // 计划名称
    date:'', // 当前日期
    checkRadio: 0, // 选择的手环
    taskType:'', // 训练类型
    jiaAmount: '', // 请假价格
    isShowDialog: false, // 请假弹窗
    dialog: {}, // 弹窗信息
    isShowFinishBtn: false, // 是否显示完成按钮
    courseList: [], // 推荐课程
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

  

  // 获取任务训练详情
  async getTrainAudio(type){
    let data = await util.httpRequestWithPromise('/rest/ryqtask/detail?courseType='+type,'GET','',wx.getStorageSync('key'));
    console.log('获取任务训练详情', data)
    if(data.data.result == "true") {
      this.setData({
        trainAudio: data.data.data,
      })
    }
  },

  
  // 上传图片
  afterRead: function (event) {
    console.log(event)
    const file = event.detail.file;
    var that = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      header: {
        'X-Lite-token': wx.getStorageSync('key')
      },
      url: config.imageUrlPrefix + '/rest/user/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'evaluationLearn_image',
      formData: { id: this.data.trainAudio.id },
      success(res) {
        console.log(res)
        var item = JSON.parse(res.data);
        const files = that.data.fileList;
        for (var i = 0; i < item.data.length; i++) {
          files.push({id: item.data[i].id, url: config.imageUrlPrefix + item.data[i].fileUrl, local: item.data[i].fileEntity.filePath + item.data[i].fileName ,deletable: true,})
        }
        console.info(files)
        // 上传完成需要更新 fileList
        that.setData({
          fileList: files, 
          isClickEndBtn: files.length > 1&&that.data.checkRadio!=0? true:false 
        });
      }
    });
  },

  // 删除图片
  deleteImage(e){
    // 根据index删除fileList中的对象
    let arr = this.data.fileList.splice(e.detail.index+1, 1)
    this.setData({
      fileList: arr
    })
  },

  // 图片识别
  confirmUpload() {
    if(!this.data.isClickEndBtn){
      return
    }
    if(this.data.taskType == 3){
      this.sportRecognition()
    }else if(this.data.taskType == 1){
      this.sleepRecognition()
    }
  },

  // 睡眠图片识别接口
  async sleepRecognition(){
    let img1 = this.data.fileList[0].local
    let fileId1 = this.data.fileList[0].id
    let img2 = this.data.fileList[1].local
    let fileId2 = this.data.fileList[1].id
    let data = await util.httpRequestWithPromise(`/rest/ryqtask/imgupsleep?id=${this.data.trainAudio.id}&dtype=${this.data.checkRadio}&img1=${img1}&fileId1=${fileId1}&img2=${img2}&fileId2=${fileId2}`, 'GET', '', wx.getStorageSync('key'));
    console.log('运动图片识别接口', data);
    let message = data.data.message
    if(message == '200' || message == '613') {
      // 显示完成按钮
      this.setData({
        isShowFinishBtn: true
      })
      wx.showToast({
        icon: 'none',
        title: '训练已完成',
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      console.log('图片识别失败('+message+')');
      // 失败的情况
      // 弹窗信息
      let des = ''
      let btn1 = '取消'
      let btn2 = {type: 1, txt: '重新上传'}
      des = ' 经分析，您的任务数据并未按照计划目标完成，如需指导可联系客服。'
      let dialog = {
        title: '任务失败('+message+')',
        img: '../../images/trainfail.png',
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

  // 运动图片识别接口
  async sportRecognition(){
    let img1 = this.data.fileList[0].local
    let fileId1 = this.data.fileList[0].id
    let img2 = this.data.fileList[1].local
    let fileId2 = this.data.fileList[1].id
    let data = await util.httpRequestWithPromise(`/rest/ryqtask/imgupsport?id=${this.data.trainAudio.id}&dtype=${this.data.checkRadio}&img1=${img1}&fileId1=${fileId1}&img2=${img2}&fileId2=${fileId2}`, 'GET', '', wx.getStorageSync('key'));
    console.log('运动图片识别接口', data);
    if(data.data.message == '200') {
      // 显示完成按钮
      this.setData({
        isShowFinishBtn: true
      })
    }else{
      console.log('图片识别失败');
      // 失败的情况
      // 弹窗信息
      let des = ''
      let btn1 = '取消'
      let btn2 = {type: 1, txt: '重新上传'}
      des = ' 经分析，您的任务数据并未按照计划目标完成，如需指导可联系客服。'
      let dialog = {
        title: '任务失败('+data.data.message+')',
        img: '../../images/trainfail.png',
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

  // 选择手环
  changeRadio(e){
    this.setData({
      checkRadio: e.detail.value,
      isClickEndBtn: this.data.fileList.length > 1
    })
  },

  // 完成任务接口
  async finishTrainImage(){
    if(!this.data.isShowFinishBtn){
      return
    }
    let data = await util.httpRequestWithPromise('/rest/ryqtask/done?id='+this.data.trainAudio.id,'GET','',wx.getStorageSync('key'));
    console.log('完成任务接口', data)
    if(data.data.result == "true") {
      if(data.data.message == 200){
        wx.navigateBack({
          delta: 1
        })
      }
    }
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
        // 1: 眠, 2: 悟, 3: 动, 4: 纳, 5: 静
        let typeName = this.data.taskType == 1 ? '眠':this.data.taskType == 3?'动':'纳'
        des = `您每周每种任务只能请假一次，本次使用类别 [${typeName}]，确定使用吗？`
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