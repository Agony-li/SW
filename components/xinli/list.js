import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
const app = getApp()

Page({
  data: {
    icon60: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    articleList: [],
    pageNo: 1,
    shuimian:'../../image/cbti.png',
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    allPages:0,
    loadMoreData: '加载更多……' ,
    id: ""

  },
  onLoad: function (option) {
    this.setData({
      id: option.id
    })
    this.getNewsList1(option.id);
  },

  async getNewsList1(id){
    let data = await util.httpRequestWithPromise('/rest/cms/articles?category='+id+'&pageNo='+this.data.pageNo,'GET','',wx.getStorageSync('key'));
      console.log(data);
      if(data.statusCode === 200){
        if(this.data.pageNo == 1){ // 下拉刷新
          this.setData({
            allPages: data.data.count,
            articleList: data.data.list,
            // hideHeader: true
          })
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
        }else{ // 加载更多
          console.log('加载更多');
          var tempArray = this.data.articleList;
          tempArray = tempArray.concat(data.data.list);
          this.setData({
            allPages: data.data.count,
            articleList: tempArray,
            searchLoading: true
          })
        }
       
      }
   },
   async getDetail(option){
      console.info(option)
      var id = option.currentTarget.dataset.id;
      var from = option.currentTarget.dataset.from;
      console.info(this.data.id)
      let { data } = await util.httpRequestWithPromise('/rest/cms/checkLearn?id=' + this.data.id, 'GET', '', wx.getStorageSync('key'));
      if(data.message == "200") {
        wx.navigateTo({
          url: '../../components/articles/index?id='+id+'&form='+from
        })
      } else {
  
        wx.showModal({
          title: '提示',
          showCancel:'false',
          content: '请先完成心理建设基础课程后再来学习',
          confirmText:"确定",//默认是“确定”
       })
      }
   },
  onReachBottom: function() {
    // Do something when page reach bottom.
     console.log('circle 下一页');
     var self = this;
     // 当前页是最后一页
     if (self.data.articleList.length == self.data.allPages){
       self.setData({
         loadMoreData: '已经到顶'
       })
       return;
     }
     setTimeout(function(){
       console.log('上拉加载更多');
       var tempCurrentPage = self.data.pageNo;
       tempCurrentPage = tempCurrentPage + 1;
       self.setData({
         pageNo: tempCurrentPage,
         hideBottom: false  
       })
       self.getNewsList1();  
     },300);
  },
  onPullDownRefresh: function () {
   // Do something when pull down.
   console.log('刷新');
  let that = this;
  wx.showNavigationBarLoading() 
    // 请求数据
  that.getNewsList1();
  },
})