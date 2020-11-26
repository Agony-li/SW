import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
const app = getApp()

Page({
  data: {
    icon60: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    articleList: [],
    pageNo: 1,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    allPages: 0,
    loadMoreData: '加载更多……',
    pid:"",
    score:"",
    hidden:true,
    nocancel: true
  },
  onLoad: function (option) {
    var score = option.score;
    var isOrder = option.isOrder;
    var pid = option.pId;
    this.setData({
      pid: pid,
      score: score
    })
    if(!isOrder) {
      this.setData({
        hidden: false
      })
    } else {
      this.getNewsList1(pid);
    }
  },

  goToResult: function () {
    wx.navigateTo({
      url: '../../components/sleepResult/index'
    })
  },
  async getNewsList1() {
    let that = this;
    let data = await util.httpRequestWithPromise('/rest/evaluationOrder/list?pageNo=' + this.data.pageNo, 'GET', '', wx.getStorageSync('key'));
    console.log(data);
    if (data.statusCode === 200) {
      if (this.data.pageNo == 1) { // 下拉刷新
        console.info(data.data.page.count)
        console.info(data.data.page.list)
        that.setData({
          allPages: data.data.page.count,
          articleList: data.data.page.list
        })
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      } else { // 加载更多
        console.log('加载更多');
        var tempArray = this.data.articleList;
        tempArray = tempArray.concat(data.data.page.list);
        this.setData({
          allPages: data.data.page.count,
          articleList: tempArray,
          searchLoading: true
        })
      }

    }
  },
  async goToTest() {
    let isCheck = await util.httpRequestWithPromise('/rest/evaluationType/listData.json?dictType=slepping_test&type=2', 'GET', '', wx.getStorageSync('key'));
    console.info(isCheck);
    try {
      var value = wx.getStorageSync('key');
      if (value || isCheck.data.message == '600') {
        if (isCheck.data.message == '200') {
          wx.navigateTo({
            url: '../../components/sleepTest/index?testType=slepping_test&type=2'
          })
        } else if (isCheck.data.message == '500') {
          wx.navigateTo({
            url: '../../components/serviceOpen/index?score=' + isCheck.data.total + '&isOrder=' + isCheck.data.isOrder + '&pId=' + isCheck.data.programId
          })
        }
      } else {
        console.info("600")
        wx.login({
          success(res) {
            if (res.code) {
              //发起网络请求
              wx.request({
                url: config.imageUrlPrefix + '/wx/user/wx880f93983df81037/login',
                data: {
                  code: res.code
                },
                success: function (res) {
                  console.log(res);
                  if (res.statusCode === 200) {
                    try {
                      wx.setStorageSync('key', res.data.token)
                    } catch (e) {

                    }
                    if (isCheck.data.message == '200') {
                      wx.navigateTo({
                        url: '../../components/sleepTest/index?testType=slepping_test&type=2'
                      })
                    } else if (isCheck.data.message == '500') {
                      wx.navigateTo({
                        url: '../../components/sleepResult/index?score=' + isCheck.data.data
                      })
                    }
                    // wx.navigateTo({
                    //   url: '../../components/sleepTest/index?testType=slepping_test'
                    // })
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
      }
    } catch (e) {
      // Do something when catch error
    }

    // wx.navigateTo({
    //   url: '../../components/sleepTest/index'
    // })
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
    console.log('circle 下一页');
    var self = this;
    // 当前页是最后一页
    if (self.data.articleList.length == self.data.allPages) {
      self.setData({
        loadMoreData: '已经到顶'
      })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      var tempCurrentPage = self.data.pageNo;
      tempCurrentPage = tempCurrentPage + 1;
      self.setData({
        pageNo: tempCurrentPage,
        hideBottom: false
      })
      self.getNewsList1();
    }, 300);
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
    console.log('刷新');
    let that = this;
    wx.showNavigationBarLoading()
    // 请求数据
    that.getNewsList1();
  },

  cancel: function () {
    this.setData({
      hidden: true
    });
  },

  confirm: function () {
    this.setData({
        hidden: true
    });
    this.goToTest();
  }

})