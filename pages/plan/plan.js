// pages/mastersaidlist/mastersaidlist.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOrder: false, // 是否有订单
    planInfo: {}, // 计划信息
    imgActive: '_active',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dialogphone: true,
    plan_ready: false, // 是否做好计划前准备
    plan_start: true, // 计划是否开启
    userInfo: '',
    active_plan: 0, // 0 表示课程, 1 表示任务 2 表示月历 3 表示添加作息时间
    week: 0,
    optionList: [
      
    ], // 课程
    options: [
      // {
      //   status: false
      // },
    ],
    // 课程
    contentList: [], // 课程
    chooseContent:{}, // 选中的课程对象
    course_active: '',  // 1: 眠, 2: 悟, 3: 动, 4: 纳, 5: 静
    course_num: 0,
    // 月历
    show: false,
    minDate: new Date(2010, 12, 7).getTime(),
    maxDate: new Date(2011, 2, 7).getTime(),
    // 弹窗
    isShowDialog: false,
    dialogType: 1, // 1: 周任务提示弹窗 2: 课程暂停通知 3: 领取红包
    dialog: {
      title: '',
      img: '',
      des: '',
      btn: []
    },
    /**
     * 任务数据
     */
    day: 0, // 当天日
    mustRiskNum: 0, // 本周需要完成的任务数
    weekDay:['一', '二', '三', '四', '五', '六', '日'], // 常量周
    dayList: [],
    taskObj: {},
    dong: {},
    mian: {},
    jing: {},
    na: {},
    redbag: [],
    showSchedulet: '', // 显示的作息时间
    /**
     * 作息时间
     */
    scheduleList: [],
    scheduleId: '', // 选中的作息时间id
    // 弹窗对象信息
    dialog: {}, //  
   },
   onReady: function (e) {
    let userInfo = wx.getStorageSync('info')
    if(!userInfo){
      wx.navigateTo({
        url: '../userCenter/login',
      })
      return
    }else{
      this.setData({
        userInfo: wx.getStorageSync('info')
      })
    }
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
    // 进入计划判断
    this.checkPlan()
    
    // // 获取准备页的接口
    // this.getPlanOptions()
  },

  // 进入计划判断
  async checkPlan(){
    let data = await util.httpRequestWithPromise('/rest/ryqke/ckplan','GET','', wx.getStorageSync('key'));
    console.log('进入计划判断',data);
    let status = data.data.message
    // let status = 200
    if(status == 604){
      this.setData({
        isOrder: false
      })
    }else{
      this.setData({
        isOrder: true
      })
      if (status == 200) {
        // 获取课程接口
        this.checkTest()
        this.getPlan()
      }else if(status == 600){ // 用户失效
        wx.navigateTo({
          url: '../userCenter/login',
        })
        return
      }else if(status == 605){ // 学习已结束
        
      }else if(status == 607){ // 请于下周一开始学习
        this.setData({
          plan_ready: true, // 是否做好计划前准备
          plan_start: false, // 计划是否开启
        })
        this.getPlanOptions()
      }else if(status == 606){ // 当前周计划未准备好
        this.setData({
          plan_ready: false, // 是否做好计划前准备
          plan_start: false, // 计划是否开启
        })
        // 获取准备页的接口
        this.getPlanOptions()
      }else if(status == 400){  // 请设置作息时间
        this.setData({
          active_plan: 3
        })
        this.geScheduletList()
      }else if (status == 410){ // 上周计划未完成
        this.setData({
          isOrder: false
        })
        // 付费重启
        let data = await util.httpRequestWithPromise('/rest/user/amount?label=reopen','GET','',wx.getStorageSync('key'));
        console.log('获取计划重启价格', data)
        let reopenAmount = data.data.data
        // 红包弹窗信息
        let des = ''
        let btn1 = '稍后'
        let btn2 = '支付（'+reopenAmount+'.00元）'
        des = '由于您本周的任务未完成，您的训练计划已经暂停，请缴纳重启费用后，再次开始训练。'
        let dialog = {
          title: '课程暂停通知',
          type: 'stopPlan',
          img: '../../images/stop_plan.png',
          des: des,
          btn1,
          btn2
        }
        this.setData({
          dialog,
          dialogType: 3, 
          isShowDialog: true
        })
      }
    }
  },

  // 切换计划tab
  cutPlanType(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      active_plan: type
    })
    if(type == 0){
      // 获取课程接口
      this.checkTest()
    }else if(type==1){
      // 获取任务接口
      this.getTask()
      // 周任务提醒
      this.getWeekTaskTips()
      // 查询作息时间
      this.getScheduletStr()
    } else {
      // 获取月历接口

    }
  },

  // 支付重启课程
  async payReOpen(){
    let that = this;
    let result = await util.httpRequestWithPromise('/ryqpay/reopen', 'POST', '', wx.getStorageSync('key'));
    wx.requestPayment({
      'appId': result.data.data.appId,
      'timeStamp': result.data.data.timeStamp,
      'nonceStr': result.data.data.nonceStr,
      'package': result.data.data.packageValue,
      'signType': "MD5",
      'paySign': result.data.data.paySign,
      'success': function (res) {
        if (res.errMsg == "requestPayment:ok") {
          that.reOpenPaySuccess();
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

  // 课程重启接口
  // async reOpenPaySuccess(){
  //   let data = await util.httpRequestWithPromise(`/ryqpay/reopen`, 'get', '', wx.getStorageSync('key'));
  //   console.log('课程重启接口', data);
  //   if (data.statusCode === 200) {
  //     this.checkPlan()
  //   }
  // },

  /**
   *  任务部分
   */
  // 查询任务信息
  async getTask(week) {
    let data = await util.httpRequestWithPromise(`/rest/ryqtask/week?week=${week}`, 'get', '', wx.getStorageSync('key'));
    console.log('查询任务信息', data);
    if (data.statusCode === 200) {
      let taskObj = data.data.data
      this.setData({
        taskObj: taskObj,
        dayList: taskObj.dayList,
        dong: taskObj.ctypes[3]?taskObj.ctypes[3]:false,
        mian: taskObj.ctypes[1]?taskObj.ctypes[1]:false,
        jing: taskObj.ctypes[5]?taskObj.ctypes[5]:false,
        na: taskObj.ctypes[4]?taskObj.ctypes[4]:false,
        redbag: taskObj.redbag,
        day: new Date().getDate()
      })
      if(this.data.week == 0){
        this.setData({
          week: taskObj.curWeek
        })
      }
    }
  },

  // 查询作息时间
  async getScheduletStr(){
    let data = await util.httpRequestWithPromise(`/rest/ryqke/cfgtimesave`, 'get', '', wx.getStorageSync('key'));
    console.log('查询作息时间', data);
    if (data.statusCode === 200) {
      this.setData({
        showSchedulet: data.data.data
      })
    }
  },
  
  // 上一周 下一周
  cutWeekTask(e){
    let week = e.currentTarget.dataset.week
    console.log(e);
    
    this.getTask(week)
  },

  // 跳转到训练上传图片
  gotoTrainUploadPic(e){
    // 判断是否是当天
    let curWeek = this.data.taskObj.curWeek
    let date = e.currentTarget.dataset.date
    let tasktype = e.currentTarget.dataset.tasktype
    if(curWeek==this.data.week && date==this.data.day){
      wx.navigateTo({
        url: `../train/trainUploadPic?tasktype=${tasktype}&plantitle=${this.data.planInfo.title}`,
      })
    }else {
      wx.showToast({
        title: '只能选择当天的任务',
        icon: 'none'
      })
    }
  },
  
  // 跳转到训练音频播放
  gotoTrainAudio(e){
    // 判断是否是当天
    let curWeek = this.data.taskObj.curWeek
    let date = e.currentTarget.dataset.date
    let tasktype = e.currentTarget.dataset.tasktype
    if(curWeek==this.data.week && date==this.data.day){
      wx.navigateTo({
        url: `../train/trainAudio?tasktype=${tasktype}&plantitle=${this.data.planInfo.title}`,
      })
    }else {
      wx.showToast({
        title: '只能选择当天的任务',
        icon: 'none'
      })
    }
  },

  // 点击领取红包弹窗
  async getRedBag(e) {
    // 判断是否是当天
    let curWeek = this.data.taskObj.curWeek
    let date = e.currentTarget.dataset.date
    let type = e.currentTarget.dataset.type
    if(curWeek==this.data.week && date==this.data.day){
      if(type == 1){
        wx.showToast({
          title: '已领过红包',
          icon: 'none'
        })
      }else if(type == 2){
        wx.showToast({
          title: '请先完成当日任务',
          icon: 'none'
        })
      }else{
        let data = await util.httpRequestWithPromise('/rest/ryqtask/getredbagprice','GET','',wx.getStorageSync('key'));
        console.log('获取红包价格', data)
        let redBagAmount = data.data.data
        // 红包弹窗信息
        let des = ''
        let btn1 = '稍后'
        let btn2 = '领取（'+redBagAmount+'.00元）'
        des = '恭喜您本日任务全部完成，快来领取红包吧！！！'
        let dialog = {
          title: '领取红包',
          type: 'redbag',
          img: '../../images/redbag_dialog.png',
          des: des,
          btn1,
          btn2
        }
        this.setData({
          dialog,
          dialogType: 3, 
          isShowDialog: true
        })
      }
    }else {
      wx.showToast({
        title: '只能领取当天红包',
        icon: 'none'
      })
    }
  },

  // 领取红包接口
  async getBag() {
    let response = await util.httpRequestWithPromise('/rest/ryqtask/sendRedpack','GET','', wx.getStorageSync('key'));
    console.log('领取红包接口',response);
    if(Number(response.data.message) === 200){
      wx.showToast({
        title: '领取成功!',
      })
    }else{
      wx.showToast({
        title: response.data.message,
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      isShowDialog: false
    })
  },

  // 周任务提醒
  async getWeekTaskTips() {
    let data = await util.httpRequestWithPromise(`/rest/evaluationProgramLearn/weektasktips`, 'get', '', wx.getStorageSync('key'));
    console.log('周任务提醒', data);
    if (data.statusCode === 200) {
      this.setData({
        mustRiskNum: data.data.data
      })
    }
  },




  /**
   *  计划部分
   */

  // 查询计划
  async getPlan() {
    let data = await util.httpRequestWithPromise(`/rest/evaluationProgramLearn/learncycle`, 'get', '', wx.getStorageSync('key'));
    console.log('查询计划', data);
    if (data.statusCode === 200) {
      if(data.data.message == 200){
        this.setData({
          planInfo: data.data,
          isOrder: true
        })
        // 获取课程信息
        this.checkTest();
      }else if(data.data.message == 601){ // 未有订单
        this.setData({
          isOrder: false
        })
      }
    }
  },

  // 获取准备页的接口
  async getPlanOptions() {
    let data = await util.httpRequestWithPromise(`/rest/cms/articles?category=0013001&orderBy=a.title`, 'get', '', wx.getStorageSync('key'));
    console.log('准备页的接口', data.data.list);
    if (data.statusCode === 200) {
      let options = []
      for(let i = 0; i<data.data.list.length+1; i++){
        options.push({status: false})
      }
      // console.log(options)
      this.setData({
        options: options
      })
      this.setData({
        optionList: data.data.list
      })
    }
    // 查询计划准备状态
    this.saveOrGetPlanPrepareStatues(2)
  },

  // 保存/查询计划准备状态
  async saveOrGetPlanPrepareStatues(op) {
    let data = await util.httpRequestWithPromise(`/rest/evaluationOrder/orderJhzb?op=${op}`, 'get', '', wx.getStorageSync('key'));
    console.log('保存/查询计划准备状态', data)
    if (data.statusCode === 200) {
      this.setData({
        plan_ready: data.data.result
      })
      if(data.data.result){
        for (let i = 0; i < this.data.options.length; i++) {
          this.setData({
            ['options['+i+'].status']: true
          })
        }
      }
    }
  },

  // 获取课程信息
  async checkTest(){
    let that = this;
    let data = await util.httpRequestWithPromise('/rest/ryqke/coursetype','GET','', wx.getStorageSync('key'));
    console.log('获取课程信息', data);
    if(data.data.message == '200'){
      let arr = [];
      (data.data.data).map(item =>{
          arr.push({
            id: item.id,
            name:item.name,
            content: item.content,
            num: item.num,
            icon:item.img.split('|')[0],
            icon_active:item.img.split('|')[1],
          })
      })
      that.setData({
        contentList: arr,
        chooseContent: arr[0],
        course_active: arr[0].id
      })
    }
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
      url: '../plan/planExplain?id='+this.data.planInfo.id,
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
      // this.setData({
      //   plan_ready: true
      // })
      // 调用保存接口
      this.saveOrGetPlanPrepareStatues(1)
    }else{
      console.log('验证不通过')
    }
  },

  // 切换课程
  currentCourse(e){
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    let chooseContent = this.data.contentList[index]
    this.setData({
      course_active: type,
      chooseContent: chooseContent
    })
  },

  // 跳转到课程列表页
  gotoCourseList(){
    wx.navigateTo({
      url: '../course/courselist?course_active='+this.data.course_active,
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

  // 获取作息时间列表
  async geScheduletList() {
    let { data } = await util.httpRequestWithPromise('/rest/ryqke/cfgtime', 'GET', '', wx.getStorageSync('key'));
    console.log('获取作息时间列表', data)
    if(data.message == 200){
      this.setData({
        scheduleList: data.data
      })
    }
  },

  // 选择作息时间
  chooseSchedule(e){
    let id = e.currentTarget.dataset.id
    this.setData({
      scheduleId: id
    })
  },

  // 保存作息时间
  saveSchedule(){
    if(this.data.scheduleId){
      this.saveSchendule()
    } else {
      wx.showToast({
        title:'请选择作息时间',
        icon: 'none'
      })
    }
  },

  // 保存作息时间接口
  async saveSchendule() {
    let id = this.data.scheduleId
    let { data } = await util.httpRequestWithPromise('/rest/ryqke/cfgtimesave?id='+ id, 'GET', '', wx.getStorageSync('key'));
    if(data.message == '200') {
      this.setData({
        active_plan: 1
      })
      wx.showToast({
        title: '选择成功',
      })
    }
  },



  // 展示周任务提示弹窗
  showDialog(e){
    let type = e.currentTarget.dataset.type
    console.log('弹窗类型'+ type)
    this.setData({
      isShowDialog: true,
      dialogType: type,
    })
  },

  // 取消弹窗
  cancelDialog(){
    this.setData({
      isShowDialog: false
    })
  },

  async goToTest () {
    let userInfo = wx.getStorageSync('info')
    if(!userInfo){
      wx.navigateTo({
        url: '../userCenter/login',
      })
      return
    }
    let that = this;
    let isCheck = await  util.httpRequestWithPromise('/rest/evaluationType/listData.json?dictType=slepping_test&type=2', 'GET', '', wx.getStorageSync('key'));
    try {
      var value = wx.getStorageSync('key');
      console.info('value' + value);
      console.info('isCheck' + isCheck);
      if (value && isCheck.data.message != '600') {
        if(isCheck.data.message=='200'){
          // that.closeTotest();
          console.log('应该弹窗')
          wx.navigateTo({
            url: '../../components/testIntro/testIntro',
          })
        }else if(isCheck.data.message=='500'){
          wx.navigateTo({
            url: '../../components/serviceOpen/index?score='+isCheck.data.total+'&isOrder='+isCheck.data.isOrder+'&pId='+isCheck.data.programId
          })
        } else if(isCheck.data.message=='501') {
          wx.showToast({
            title: '请在订单中进行付款!',
          })
        } else if(isCheck.data.message=='601') {
          wx.showModal({
        title: '提示',
        content: '请完善个人信息',
        showCancel: false,
        confirmText:'确定',
        success(res){
          if(res.confirm){
              wx.navigateTo({
                url: '../../components/userInfo/index',
              })
          }
        }
      })
      } 
      }
    } catch (e) {
      // Do something when catch error
    }
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