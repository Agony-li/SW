import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';

const app = getApp()

Page({
  data: {
   level:'没有',
   score:0,
   imgUrl:'../../image/sleep_no_p@2x.png',
   isOrder:false,
   programId:null,
   resultList: [],
   isShowResult: false,
  },
  onLoad: function (option) {
    console.log(option);
    this.insomniaType(option.score);
    this.setData({
      isOrder:option.isOrder,
      programId:option.pId,
      score:option.score
    })
  },
  insomniaType(score){
    let scores = score - 0;
    if(scores<=7){
      this.setData({
        level:'没有显著失眠问题',
        imgUrl:'../../image/sleep_no_p@2x.png'
      })
    }else if(scores>=8&&scores<=14){
      this.setData({
        level:'轻度失眠问题',
        imgUrl:'../../image/sleep_level_1@2x.png'
      })
    }else if(scores>=15&&scores<=21){
      this.setData({
        level:'中度失眠问题',
        imgUrl:'../../image/sleep_level_2@2x.png'
      })
    }else if(scores>=22){
      this.setData({
        level:'重度失眠问题',
        imgUrl:'../../image/sleep_level_3@2x.png'
      })
    }
  },
  goToTest:function(){
    wx.navigateTo({
      url: '../../components/sleepTest/index?testType=slepping_test&from=sleepResult'
    })
},
goToLession(){
  // wx.navigateTo({
  //   url: '../../components/lessonContent/index?id='+this.data.programId+'&from=3'+'&isOrder='+this.data.isOrder
  // })
  wx.navigateBack()
},
async endTest(){
  // let data = await util.httpRequestWithPromise('/rest/evaluationData/closeTest', 'GET', '', wx.getStorageSync('key'))
  // if (data.data.message == '200') {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  // } else {
  //   wx.showToast({
  //     title: data.data.message,
  //     icon: 'none',
  //     duration: 2000
  //   })
  //   return false
  // }
},
async goToOther(e){
  console.log(e);
  let type = e.currentTarget.dataset.type;
  let data = await util.httpRequestWithPromise('/rest/evaluationData/getPrograms?dictType=slepping_test'+'&total='+this.data.score+'&type='+type, 'GET', '', wx.getStorageSync('key'))
      if(data.data.message === '200'){
        wx.navigateTo({
          url: '../../components/confirmNotic/index?id=' + data.data.data[0].id + '&from=2'
        })
      }else{
        wx.showToast({
          title: data.data.message,
          icon: 'none',
          duration: 2000
      })
      return false
      }
}

})