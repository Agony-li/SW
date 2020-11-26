import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';

const app = getApp()

Page({
  data: {
    id: "",
    price: "",
    remark: "",
    title: "",
    createDate: "",
    from: "",
    imgUrl: '../../image/sleep_no_p@2x.png',
    isOrder: false,
    programId: null,
    resultList: [],
    isShowResult: false,
  },
  onLoad: function (option) {
    console.info(option.title)
    if(option.title != '' && option.title != null && option.title != undefined) {
      wx.setNavigationBarTitle({
        title: '心理原因分析',
      })
    }
    this.setData({
      id: option.id,
      price: option.price,
      title: option.title,
      createDate: option.createDate ,
      from: option.from,
      isOrder: option.isOrder,
      programId: option.pId,
      remark: option.remark
    })
  },
  
  goToLession() {
    wx.navigateBack();
  },
  async endTest() {
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
  async goToOther(e) {
    let type = e.currentTarget.dataset.type;
    let data = await util.httpRequestWithPromise('/rest/evaluationData/getPrograms?dictType=slepping_test' + '&total=' + this.data.score + '&type=' + type, 'GET', '', wx.getStorageSync('key'))
    if (data.data.message === '200') {
      wx.navigateTo({
        url: '../../components/confirmNotic/index?id=' + data.data.data[0].id + '&from=2'
      })
    } else {
      wx.showToast({
        title: data.data.message,
        icon: 'none',
        duration: 2000
      })
      return false
    }
  },
  confirm() {
    wx.navigateTo({
      url: '../../components/confirmNotic/index?id=' + this.data.id + '&price=' + this.data.price + '&title=' + this.data.title + '&createDate=' + this.data.createDate + '&from=3'
    })
  }

})