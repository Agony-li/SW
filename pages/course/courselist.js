// pages/course/course.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList: [], // 课程分类
    courseList: [], // 课程列表
    course_active: '' // 1: 眠, 2: 悟, 3: 动, 4: 纳, 5: 静
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.course_active){
      this.setData({
        course_active: options.course_active
      })
    }
    this.checkTest()
  },

  // 切换tab
  currentTab(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      course_active: type
    })
    this.getCourseList(type)
  },

  // 获取课程信息
  async checkTest(){
    let that = this;
    let data = await util.httpRequestWithPromise('/rest/cbti/mine','GET','', wx.getStorageSync('key'));
    console.log('获取课程信息', data);
    if(data.data.message == '200'){
      if(data.data.maps.length === 0){
        
      }else{
        let arr = [];
        (data.data.maps).map(item =>{
           arr.push({
             name:item.dict_label,
             courseType:item.course_type,
             icon:item.description.split('|')[0],
             icon_active:item.description.split('|')[1],
           })
        })
        that.setData({
          contentList:arr,
        })
        this.getCourseList(this.data.course_active)
      }
    }
  },

  // 获取课程列表
  async getCourseList(type) {
    let data = await util.httpRequestWithPromise(`/rest/cbti/course/${type}`, 'get', '', wx.getStorageSync('key'));
    console.log('获取课程列表', data)
    if (data.statusCode === 200) {
      this.setData({
        courseList: data.data.course
      })
    }
  },
  
  // 跳转到课程详情
  gotoCourseDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/course/coursedetail?id='+id,
    })
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