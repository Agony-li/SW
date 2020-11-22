import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
const app = getApp()

Page({
  data: {
    icon60:'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    yinshi:'../../image/yinshi.png',
    xinli:'../../image/xinli.png',
    cbti:'../../image/cbti.png',
    sport:'../../image/sport.jpg',
    articleList:[],
    noData:false,
    pageNo:1,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    type: "",
    isLearn: 0,
    uploadRes:  0,
    redBags:  0,
    show: false,
    fileList: [],
    fileListOne: [],
    fileListTwo: [],
    maxCount: 1,
    imgUrl: "",
    week: 0,
    programId:"",
    uploadList:[],
    uploadResult: [],
    reciveResult: [],
    allUp: false,
    recive: false,
    title: "",
    learnDone: 0
  },
  onLoad: function (option) {
    var t = "";
    if(option.type == 1) {
        t = "睡眠"
    } else if(option.type == 3) {
      t = "运动"

    } else if(option.type == 4) {
      t = "饮食"
    }
    this.setData({
      type: option.type,
      week: option.week,
      imgUrl: config.imageUrlPrefix,
      title: t
    })
   
    this.getNewsList(option.type, this.data.week, '1');
  },

  onShow: function () {
    console.info('onshow')
    this.getNewsList(this.data.type, this.data.week, '1');
  },
  goToByClick: function(e) {
    if(e.detail.name == '学习') {
      this.getNewsList(this.data.type, this.data.week, '1');
    } else if(e.detail.name == '训练') {
      this.getNewsList(this.data.type,this.data.week, '1');
    }
  },
async getNewsList(type, week, pageNo){
 let data = await util.httpRequestWithPromise('/rest/evaluationProgramLearn/courseList?courseType='+type + '&week=' + week +'&pageNo=' + pageNo + '&learnDate=' + util.newFormatTime(new Date()),'GET','',wx.getStorageSync('key'));
   if(data.statusCode === 200){
     let result = data.data.result;
     let learnsRes = result.filter((item) => {
      return item.isLearn == 0 && item.course.isFree == 1;
    });
     let uploadRes = result.filter((item) => {
       return item.isUpload == 1;
     });
     let redBags = result.filter((item) => {
      return item.isReceive == 1;
    });
     let isLearn = 0;
    if(week > 1) {
      isLearn = 1;
    } else {
      isLearn = learnsRes.length > 0 ? 0 : 1;
    }

    var allUp = true;
    let uploadMap = data.data.uploadResult;
    for(var key in uploadMap){
      if(uploadMap[key] == false) {
        allUp = false
      }
    }
    let learnMap = data.data.learnDoneMap;
    console.info(learnMap)
    if(parseInt(learnMap.need) == parseInt(learnMap.down)) {
      this.setData({
        learnDone: 1
      })
    }
    let reciveMap = data.data.reciveResult;
    var recive = false;
    for(var key in reciveMap){
      if(reciveMap[key] == true) {
        recive = true
      }
    }
    if(data.data.weelDown == 2 && data.data.maxWeek == this.data.week) {
      wx.showModal({
        title: '提醒',
        showCancel: false,
        content: '您已完成所有训练,可以查看最终报告!',
        success: function (res) {
          if (res.cancel) {
             //点击取消,默认隐藏弹框
          } else {
             
          }
       },
      })
    } else if(data.data.weelDown == 2){
      var title = "您已完成本周训练,可以继续训练!";
      if(week == 1) {
        title = "您已完成本周学习,下周开始训练!";

      }
      wx.showModal({
        title: '提醒',
        showCancel: false,
        content: title,
      })
    } else if(data.data.weelDown == 3 && this.data.week == 3) {
      wx.showModal({
        title: '提醒',
        showCancel: false,
        content: '您已完成本周训练课程,心里课程还未完成, 请继续学习心理课程!',
      })
    }
    this.setData({
      articleList: result,
      config: data.data.config,
      uploadResult: data.data.uploadResult,
      learnDone: data.data.learnDone,
      programId: data.data.programId,
      isLeave: data.data.isLeave,
       isLearn: isLearn,
       uploadRes: uploadRes.length > 0 ? 1 : 0,
       redBags: redBags.length > 0 ? 1 : 0,
      uploadList: uploadRes,
      reciveResult: data.data.reciveResult,
      allUp: allUp,
      recive: recive
     })
   }
},
lower(){
  console.log('xiayiye')
},
onReachBottom: function() {
  // Do something when page reach bottom.
   console.log('circle 下一页');
   this.setData({
    pageNo: this.data.pageNo+1,  //每次触发上拉事件，把searchPageNum+1
  });
  this.getNewsList(this.data.type,this.data.week, this.data.pageNo);
},
onPullDownRefresh: function() {
  // Do something when pull down.
   console.log('刷新');
   wx.showNavigationBarLoading();

   this.getNewsList(this.data.type,this.data.week, '1');
},
uploadReport : function(){
  this.setData({
    show: true
  })
},
async confirmUpload(){
  var list = '';
  if (this.data.fileList.length < 1) {
    wx.showToast({
      title: '请上传第一天报告',
    })
    return;
  }
  list += '&urlone=' + this.data.fileList[0].local;
  if(this.data.week == 1) {
    if( this.data.type != 3 && this.data.type != 4) {
      if (this.data.fileListOne.length < 1 ) {
        wx.showToast({
          title: '请上传第二天报告',
        })
        return;
      }
      if (this.data.fileListTwo.length < 1) {
        wx.showToast({
          title: '请上传第三天报告',
        })
        return;
      }
    }
  }
  if(this.data.fileListOne.length > 0) {
    list += '&urltwo=' + this.data.fileListOne[0].local;
  }
  if(this.data.fileListTwo.length > 0) {
    list += '&urlthree=' + this.data.fileListTwo[0].local;
  }

  wx.showLoading({
    title: "上传分析中"
  })
  let data = await util.httpRequestWithPromise('/rest/user/confirmUpload?id=' + this.data.articleList[0].id + list + '&type=' + this.data.type + '&week=' + this.data.week, 'GET', '', wx.getStorageSync('key'));
  wx.hideLoading();
  if(data.data.message == '200') {
    this.setData({
      show: false
    })
    this.getNewsList(this.data.type, this.data.week, '1');
  } else if(data.data.message == '301') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '当前设备暂未适配， 请与客服联系！',
    })
  } else if (data.data.message == '300') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '请上传三日数据， 便于程序分析报告！',
    })
  } else if (data.data.message == '302') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '基础报告已经上传， 请勿重复上传！',
    })
  } else if (data.data.message == '303') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 1 不是本周数据, 请上传本周报告！',
    })
  } else if (data.data.message == '304') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 2 不是本周数据, 请上传本周报告！',
    })
  } else if (data.data.message == '305') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 3 不是本周数据, 请上传本周报告！',
    })
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
            url: '/components/scheduleConfig/index',
          })
        }
      }
    })
  }else if(data.data.message == '401') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '请上传当天报告！',
    })
  }else if(data.data.message == '402') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '睡眠开始时间超出所选方案作息时间',
    })
  }else if(data.data.message == '403') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '睡眠结束时间超出所选方案作息时间',
    })
  }else if(data.data.message == '404') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 1 运动时间超出所选方案运动时间！',
    })
  }else if(data.data.message == '405') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 1 运动持续时间不足',
    })
  }else if(data.data.message == '406') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 1 有效时间不足',
    })
  }else if(data.data.message == '407') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 2 运动时间超出所选方案运动时间！',
    })
  }else if(data.data.message == '408') {
    wx.showModal({
      title: '提醒',
      
      showCancel: false,
      content: '报告 2 运动持续时间不足 ',
    })
  }else if(data.data.message == '409') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 2 有效时间不足 ',
    })
  } else if(data.data.message == '410') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 2 运动间隔时间不足10分钟! ',
    })
  }  else if(data.data.message == '411') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 3 间隔时间不足10分钟  ！ ',
    })
  }  else if(data.data.message == '412') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '请上传当天报告！',
    })
  }  else if(data.data.message == '413') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 3 运动开始时间超出所选方案运动时间！ ',
    })
  }  else if(data.data.message == '414') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 3 运动持续时间不足! ',
    })
  }  else if(data.data.message == '415') {
    wx.showModal({
      title: '提醒',
      showCancel: false,
      content: '报告 3 有效时间不足! ',
    })
  } 
},
getRedBag(e) {
  console.info(e);
  let type = e.currentTarget.dataset.type;
  var that = this;
  wx.showModal({
    title: '提示',
    content: '确认领取红包!',
    success (res) {
      if (res.confirm) {
        that.getBag(type);
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
},

async qingjia(e){
  var type = e.currentTarget.dataset.type;
  let that = this;
 let result = await util.httpRequestWithPromise('/pay/getPrepayIdResultByQingJia?type=' + type + '&week='+this.data.week, 'POST', '', wx.getStorageSync('key'));
 var timastemp = Date.parse(new Date()) / 1000 + '';
 console.info(timastemp)
 console.info(result.data)

 wx.requestPayment(
   {
     'appId': result.data.data.appId,
     'timeStamp': result.data.data.timeStamp,
     'nonceStr': result.data.data.nonceStr,
     'package': result.data.data.packageValue,
     'signType': "MD5",
     'paySign': result.data.data.paySign,
     'success': function (res) {
       if (res.errMsg == "requestPayment:ok") {
                 that.paySuccess(type);
                 
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
async paySuccess(type) {
  let response = await util.httpRequestWithPromise('/rest/user/qingjia?type='+type,'GET','', wx.getStorageSync('key'));
  if(Number(response.data.message) === 200){
    wx.showToast({
      title: '请假成功!',
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
async getBag(type) {
  
  let article = this.data.articleList[0];
  let response = await util.httpRequestWithPromise('/rest/user/sendRedpack?learnDate='+article.learnDate+'&week='+this.data.week+'&learnId='+article.id+'&type='+this.data.type,'GET','', wx.getStorageSync('key'));
  if(Number(response.data.message) === 200){
    wx.showToast({
      title: '领取成功!',
    })
      this.setData({
        redBags: 1,
        recive:true
      })
  }else{
    wx.showToast({
      title: response.data.message,
      icon: 'none',
      duration: 2000
    })
  }
},

  afterRead: function (event) {
    const file = event.detail.file;
    var that = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      header: {
        'X-Lite-token': wx.getStorageSync('key')
      },
      url: config.imageUrlPrefix + '/rest/user/upload', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'evaluationLearn_image',
      formData: { id: that.data.articleList[0].id },
      success(res) {
        var item = JSON.parse(res.data);
        console.info(item)
        const files = [];
        for (var i = 0; i < item.data.length; i++) {
          files.push({id: item.data[i].id, url: config.imageUrlPrefix + item.data[i].fileUrl, local: item.data[i].fileEntity.filePath + item.data[i].fileName })
        }
        console.info(files)
        // 上传完成需要更新 fileList
        that.setData({ fileList: files });
      }
    });
  },
  afterReadOne: function (event) {
    const file = event.detail.file;
    var that = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      header: {
        'X-Lite-token': wx.getStorageSync('key')
      },
      url: config.imageUrlPrefix + '/rest/user/upload', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'evaluationLearn_image',
      formData: { id: that.data.articleList[0].id },
      success(res) {
        var item = JSON.parse(res.data);
        console.info(item)
        const files = [];
        for (var i = 0; i < item.data.length; i++) {
            files.push({id: item.data[i].id, url: config.imageUrlPrefix + item.data[i].fileUrl, local: item.data[i].fileEntity.filePath + item.data[i].fileName })
          }
        console.info(files)
        // 上传完成需要更新 fileList
        that.setData({ fileListOne: files });
      }
    });
  },
  afterReadTwo: function (event) {
    const file = event.detail.file;
    var that = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      header: {
        'X-Lite-token': wx.getStorageSync('key')
      },
      url: config.imageUrlPrefix + '/rest/user/upload', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'evaluationLearn_image',
      formData: { id: that.data.articleList[0].id },
      success(res) {
        var item = JSON.parse(res.data);
        console.info(item)
        const files = [];
        for (var i = 0; i < item.data.length; i++) {
            files.push({ id: item.data[i].id, url: config.imageUrlPrefix + item.data[i].fileUrl, local: item.data[i].fileEntity.filePath + item.data[i].fileName})          
        }
        console.info(files)
        // 上传完成需要更新 fileList
        that.setData({ fileListTwo: files });
      }
    });
  },
  async delete(e) {
    var id = "";
    if(this.data.fileList.length > 0) {
      id = this.data.fileList[0].id;
    }
    if(id == "") {
      wx.showToast({
        title: '请上传报告!'
      })
      return;
    }
    let data = await util.httpRequestWithPromise('/rest/user/deleteReport?id=' + id, 'GET', '', wx.getStorageSync('key'));

    if(data.data.message == 200) {
      this.setData({
        fileList: []
      })
    }
  },
  async deleteone(e) {
    var id = "";
    if(this.data.fileListOne.length > 0) {
      id = this.data.fileListOne[0].id;
    }
    if(id == "") {
      wx.showToast({
        title: '请上传报告!'
      })
      return;
    }
    let data = await util.httpRequestWithPromise('/rest/user/deleteReport?id=' + id, 'GET', '', wx.getStorageSync('key'));

    if(data.data.message == 200) {
      this.setData({
        fileListOne: []
      })
    }
  },
  async deletetwo(e) {
    var id = "";
    if(this.data.fileListTwo.length > 0) {
      id = this.data.fileListTwo[0].id;
    }
    if(id == "") {
      wx.showToast({
        title: '请上传报告!'
      })
      return;
    }
    let data = await util.httpRequestWithPromise('/rest/user/deleteReport?id=' + id, 'GET', '', wx.getStorageSync('key'));

    if(data.data.message == 200) {
      this.setData({
        fileListTwo
        : []
      })
    }
  }
})