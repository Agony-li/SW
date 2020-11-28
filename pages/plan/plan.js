// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dialogphone: true,
    plan_ready: true, // 是否做好计划前准备
    userInfo: '',
    active_plan: 1, // 0 表示课程, 1 表示任务 2 表示月历
    options: [
      {
        status: false
      },
      {
        status: false
      },
      {
        status: false
      },
      {
        status: false
      },
      {
        status: false
      },
      {
        status: false
      },
    ],
    // 课程
    course_active: '1',  // 1: 动, 2: 眠, 3: 静, 4: 纳, 5: 悟
    // 月历
    show: false,
    minDate: new Date(2010, 8, 1).getTime(),
    maxDate: new Date(2010, 11, 31).getTime(),
    // 弹窗
    isShowDialog: false,
    dialogType: 1, // 1: 周任务提示弹窗 2: 课程暂停通知 3: 请假 4: 领取红包 5: 任务失败
    dialog: {
      title: '',
      img: '',
      des: '',
      btn: []
    }
   },
   onReady: function (e) {
     this.setData({
       userInfo: wx.getStorageSync('info')
     })
   },
   
   // 跳转到风险提确认书
   gotoPlanRisk(){
     wx.navigateTo({
       url: '../plan/planRisk',
     })
   },
   // 跳转到计划说明
   gotoPlanExplain(){
     wx.navigateTo({
       url: '../plan/planExplain',
     })
   },

   // 选中options
   chooseOption(e){
     let index = e.currentTarget.dataset.index
     let status = "options["+index+"].status"
     if(this.data.options[index].status){
      this.setData({
        [status]: false
      })
     }else {
      this.setData({
        [status]: true
      })
     }
    
   },
   
  // 完成准备
  finishPrepare(){
    console.log(this.data.options);
    if(this.data.options.findIndex(obj => obj.status === false) == -1){
      console.log('验证通过')
      this.setData({
        plan_ready: true
      })
    }else{
      console.log('验证不通过')
    }
  },

  // 切换课程
  currentCourse(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      course_active: type
    })
  },

  // 跳转到课程页
  gotoCourseList(){
    wx.navigateTo({
      url: '../course/courselist',
    })
  },

  // 月历
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: `选择了 ${event.detail.length} 个日期`,
    });
  },

  // 切换计划tab
  cutPlanType(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      active_plan: type
    })
  },

  // 展示周任务提示弹窗
  showDialog(e){
    let type = e.currentTarget.dataset.type
    console.log('弹窗类型'+ type)
    this.setData({
      isShowDialog: true,
      dialogType: type,
    })
    switch(type){
      case '2': 
        this.setData({
          dialogType: 2,
          dialog: {
            title: '课程暂停通知',
            img: '../../images/dialog_img.png',
            des: '由于您本周的任务未完成，您的训练计划已经暂停，请缴纳重启费用后，再次开始训练。',
            btn: ['稍后','支付（50.00元）']
          }
        })
      break;
      case '3':
        this.setData({
          dialogType: 3,
          dialog: {
            title: '请假',
            img: '../../images/dialog_img.png',
            des: '您每周每种任务只能请假一次，本次使用类别 [悟]，确定使用吗？',
            btn: ['取消','支付（1.00元）']
          }
        })
      break;
      case '4':
        this.setData({
          dialogType: 4,
          dialog: {
            title: '领取红包',
            img: '../../images/dialog_img.png',
            des: '恭喜您本日全部完成，快来领取红包吧！！！',
            btn: ['稍后','领取']
          }
        })
      break;
      case '5':
        this.setData({
          dialogType: 5,
          dialog: {
            title: '任务失败',
            img: '../../images/dialog_img.png',
            des: '经分析，您的任务数据并未按照计划目标完成，如需指导可联系客服。',
            btn: ['取消','重新上传']
          }
        })
      break;
    }
    
  },

  // 取消弹窗
  cancelDialog(){
    this.setData({
      isShowDialog: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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