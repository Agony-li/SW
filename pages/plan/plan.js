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
    active_plan: 1, // 0 表示课程, 1 表示任务 2 表示月历
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
    },
    /**
     * 任务数据
     */
    mustRiskNum: 0, // 本周需要完成的任务数
    weekDay:['一', '二', '三', '四', '五', '六', '日'], // 常量周
    taskObj: {},
    dong: [],
    mian: [],
    jing: [],
    na: []
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
    
    // // 获取准备页的接口
    // this.getPlanOptions()
    // 查询计划
    this.getPlan()
    // // 是否需要补救
    // this.confirmClass();
    
    // 获取任务接口
    this.getTask()
    // 周任务提醒
    this.getWeekTaskTips()
  },

  // 切换计划tab
  cutPlanType(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      active_plan: type
    })
    if(type==1){
      // 获取任务接口
      this.getTask()
      // 周任务提醒
    this.getWeekTaskTips()
    }
  },

  /**
   *  任务部分
   */
  // 查询任务信息
  async getTask() {
    let data = await util.httpRequestWithPromise(`/rest/evaluationProgramLearn/weektask`, 'get', '', wx.getStorageSync('key'));
    console.log('查询任务信息', data);
    if (data.statusCode === 200) {
      let coursetype = data.data.curData.coursetype
      // let dong = curData.filter(item => item.courseType == 3)
      // let mian = curData.filter(item => item.courseType == 1)
      // let jing = curData.filter(item => item.courseType == 5)
      // let na = curData.filter(item => item.courseType == 4)
      this.setData({
        taskObj: data.data,
        // dong: coursetype,
        // mian: mian.slice(0,7),
        // jing: jing.slice(0,7),
        // na: na.slice(0,7),
      })
    }
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
    let data = await util.httpRequestWithPromise('/rest/cbti/mine','GET','', wx.getStorageSync('key'));
    console.log('获取课程信息', data);
    if(data.data.message == '200'){
      if(data.data.maps.length === 0){
        // wx.navigateTo({
        //   url: '../../components/sleepTest/index?testType=slepping_test'
        // })
      }else{
        let arr = [];
        (data.data.maps).map(item =>{
           arr.push({
             name:item.dict_label,
             remarks: item.remarks,
             courseType:item.course_type,
             icon:item.description.split('|')[0],
             icon_active:item.description.split('|')[1],
           })
        })
        that.setData({
          contentList:arr,
          chooseContent: arr[0],
          week: data.data.week,
          course_active: data.data.maps[0].course_type
        })
        // 获取课程数量
        this.getCourseNum(data.data.maps[0].course_type)
        if (data.data.week == 0) {
          this.setData({
            plan_start: false
          })
        }else{
          this.setData({
            plan_start: true
          })
        }
      }
    } else if(data.data.message == '400') {
      wx.showModal({
        title: '提醒',
        content: '请选择作息时间',
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '/components/scheduleConfig/index?id=',
            })
          }
        }
      })
    }
  },

  // 获取课程数量
  async getCourseNum(course_type) {
    let data = await util.httpRequestWithPromise(`/rest/cbti/course/${course_type}?op=2`, 'get', '', wx.getStorageSync('key'));
    console.log('获取课程数量', data)
    if (data.statusCode === 200) {
      this.setData({
        course_num: data.data.total
      })
    }
  },

  // 
  async checkType(option){
    var key =  wx.getStorageSync('key');
    if(!key) {
        this.showDialog();
        return;
    }
    let that = this;
    let type = option.currentTarget.dataset.type;
    if (type == 0){
        wx.showModal({
          title: '温馨提示',
          content: '查看课程前请先进行睡眠测试并购买课程!',
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../components/sleepTest/index?testType=slepping_test'
              })
            } else {
              console.log('用户点击辅助操作')
            }
          }
        });        
      } else {
      if (that.data.week == 0) {
          wx.showModal({
            content: '请于下周一开始课程学习!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        } else  {
        console.info(that.data.week)
          wx.navigateTo({
            url: 'list?type=' + type + "&week=" + that.data.week
          })
        }
      }
  },

  // 是否需要补救
  async confirmClass() {
    let that = this;
    let data = await util.httpRequestWithPromise('/rest/user/selectClass','GET','', wx.getStorageSync('key'));
    console.info('是否需要补救', data.data.message)
    if(data.data.data == 0 && data.data.message == '601') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '补救次数为0, 请联系管理重新购买课程!',
        confirmText:"确定",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
           } else {
             wx.switchTab({
               url: '../../pages/index/index',
             })
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
    } else if(data.data.message == '201' || data.data.message == '202') {
      wx.showModal({
        title: '提示',
        showCancel: true,
        content: '心理课程未完成学习, 需补缴66元继续学习！',
        confirmText:"确定",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
              wx.switchTab({
                url: '../../pages/index/index',
              })
           } else {
            that.confirm();
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
    } else if(data.data.data == 2) {
      this.setData({
        hidden: false
      });
    } else if(data.data.message == 900){
      wx.showModal({
        title: '提示',
        showCancel: true,
        content: '您已完成所有课程学习!',
        confirmText:"确定",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
              wx.switchTab({
                url: '../../pages/index/index',
              })
           } else {
            wx.switchTab({
              url: '../../pages/index/index',
            });
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
    } else if(data.data.message == 600) {
      console.info("1111")
      // this.showDialog();
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
    this.getCourseNum(type)
  },

  // 跳转到课程列表页
  gotoCourseList(){
    wx.navigateTo({
      url: '../course/courselist?course_active='+this.data.course_active+'&week='+this.data.week,
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

  

  // showDialog: function(){
  //   this.dialog.showDialog();
  // },

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
      } else {
        that.showDialog();
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  // 跳转到训练上传图片
  gotoTrainUploadPic(){
    wx.navigateTo({
      url: '../train/trainUploadPic',
    })
  },
  
  // 跳转到训练音频播放
  gotoTrainAudio(){
    wx.navigateTo({
      url: '../train/trainAudio',
    })
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