// pages/mastersaidlist/mastersaidlist.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgActive: '_active',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dialogphone: true,
    plan_ready: false, // 是否做好计划前准备
    plan_start: true, // 计划是否开启
    userInfo: '',
    active_plan: 0, // 0 表示课程, 1 表示任务 2 表示月历
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
    course_active: '1',  // 1: 眠, 2: 悟, 3: 动, 4: 纳, 5: 静
    course_num: '',
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

   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取准备页的接口
    this.getPlanOptions()
    // 查询计划
    this.getPlan()
    // 是否开启课程
    this.checkTest();
    // 是否需要补救
    this.confirmClass();
    // 获取课程数量
    this.getCourseNum()
  },

  // 查询计划
  async getPlan() {
    let data = await util.httpRequestWithPromise(`/rest/evaluationProgramLearn/learncycle`, 'get', '', wx.getStorageSync('key'));
    console.log('查询计划', data);
    if (data.statusCode === 200) {
      
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

  // 是否开启课程
  async checkTest(){
    let that = this;
    let data = await util.httpRequestWithPromise('/rest/cbti/mine','GET','', wx.getStorageSync('key'));
    console.log('是否开启课程', data);
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
             courseType:item.course_type,
             icon:item.description
           })
        })
        that.setData({
          contentList:arr,
          week: data.data.week
        })
        if (data.data.week == 0) {
          this.setData({
            // plan_start: false
          })
        }else{
          this.setData({
            // plan_start: true
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
        course_num: data.total
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

  showDialog: function(){
    this.dialog.showDialog();
  },

  // 展示周任务提示弹窗
  // showDialog(e){
  //   let type = e.currentTarget.dataset.type
  //   console.log('弹窗类型'+ type)
  //   this.setData({
  //     isShowDialog: true,
  //     dialogType: type,
  //   })
  //   switch(type){
  //     case '2': 
  //       this.setData({
  //         dialogType: 2,
  //         dialog: {
  //           title: '课程暂停通知',
  //           img: '../../images/dialog_img.png',
  //           des: '由于您本周的任务未完成，您的训练计划已经暂停，请缴纳重启费用后，再次开始训练。',
  //           btn: ['稍后','支付（50.00元）']
  //         }
  //       })
  //     break;
  //     case '3':
  //       this.setData({
  //         dialogType: 3,
  //         dialog: {
  //           title: '请假',
  //           img: '../../images/dialog_img.png',
  //           des: '您每周每种任务只能请假一次，本次使用类别 [悟]，确定使用吗？',
  //           btn: ['取消','支付（1.00元）']
  //         }
  //       })
  //     break;
  //     case '4':
  //       this.setData({
  //         dialogType: 4,
  //         dialog: {
  //           title: '领取红包',
  //           img: '../../images/dialog_img.png',
  //           des: '恭喜您本日全部完成，快来领取红包吧！！！',
  //           btn: ['稍后','领取']
  //         }
  //       })
  //     break;
  //     case '5':
  //       this.setData({
  //         dialogType: 5,
  //         dialog: {
  //           title: '任务失败',
  //           img: '../../images/dialog_img.png',
  //           des: '经分析，您的任务数据并未按照计划目标完成，如需指导可联系客服。',
  //           btn: ['取消','重新上传']
  //         }
  //       })
  //     break;
  //   }
    
  // },

  // 取消弹窗
  cancelDialog(){
    this.setData({
      isShowDialog: false
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