// pages/train/trainUploadPic.js
import config from '../../utils/dev.config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: '', // 课程id
    fileList: [], // 图片list
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      courseId: options.courseId
    })
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
      filePath: file.path,
      name: 'evaluationLearn_image',
      formData: { id: that.data.courseId },
      success(res) {
        console.log(res)
        var item = JSON.parse(res.data);
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