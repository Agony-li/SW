// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dialogphone: true,
    plan_ready: false, // 是否做好计划前准备
    userInfo: '',
    active_plan: 0, // 0 表示课程, 1 表示任务 2 表示月历
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

  // 切换计划tab
  cutPlanType(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      active_plan: type
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