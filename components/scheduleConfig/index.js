import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
// components/scheduleConfig/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [],
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getList(options.id);
  },
  async getList(id) {
    let that = this;
    let { data } = await util.httpRequestWithPromise('/rest/cbti/schendule/config?id='+id, 'GET', '', wx.getStorageSync('key'));
    if (data.message == 600) {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: config.imageUrlPrefix + '/wx/user/wx2f4af9802d72f78a/login',
              data: {
                code: res.code
              },
              success: function (res) {
                if (res.statusCode === 200) {
                  try {
                    wx.setStorageSync('key', res.data.token);
                    wx.setStorageSync('info', res.data.userInfo);
                  } catch (e) {

                  }
                  that.getList();

                } else {
                  wx.showToast({
                    title: '登录失败',
                    icon: 'none',
                    duration: 2000
                  })

                }

              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else if(data.message == 601){
      wx.showModal({
        title: '提示',
        content: '请完善个人信息',
        showCancel: false,
        confirmText:'确定',
        success(res){
          if(res.confirm){
              wx.navigateTo({
                url: '../userInfo/index',
              })
          }
        }
      })
    }else {
      console.info(data)
      that.setData({
        list: data.data
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

  },

  async save(e) {
    let id = e.currentTarget.dataset.id
    let { data } = await util.httpRequestWithPromise('/rest/cbti/schendule/save?id='+ id, 'GET', '', wx.getStorageSync('key'));
    if(data.message == '200') {
      wx.showToast({
        title: '选择成功',
      })
      wx.navigateBack()
    }
  }
})