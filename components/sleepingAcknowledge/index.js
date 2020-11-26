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
    loadMoreData: '加载更多……' 

  },
  onLoad: function () {
    this.getNewsList1();
  },

  goToResult: function () {
    wx.navigateTo({
      url: '../../components/sleepResult/index'
    })
  },
  // async getNewsList(){
  //  let data = await util.httpRequestWithPromise('/cms/articles?category=0002','GET',',','');
  //    console.log(data);
  //    if(data.statusCode === 200){
  //      this.setData({
  //        articleList :data.data.list
  //      })
  //    }
  // },
  async getNewsList(num, pNum) {
    let data = await util.httpRequestWithPromise('/rest/cms/articles?category=0002&pageNo=' + pNum, 'GET', '', '');
    console.log(data);
    if (data.statusCode === 200) {
      if (num === 1) {
        let list = data.data.list;
        if (list.length < 20) {
          console.log(1);
          // this.setData({
          //     recommendList:that.data.recommendList.concat(res.data.page.records),
          //     searchLoadingComplete: true, //把“没有数据”设为true，显示
          //     searchLoading: false,  //把"上拉加载"的变量设为false，隐藏
          //     noData:false,
          //   })
          this.setData({
            articleList: this.data.articleList.concat(data.data.list),
            pageNo: data.data.pageNo
          })
        } else {
          this.setData({
            articleList: this.data.articleList.concat(data.data.list),
            pageNo: data.data.pageNo
          })
          // this.setData({
          //     recommendList:that.data.recommendList.concat(res.data.page.records),
          //     searchLoadingComplete: false, //把“没有数据”设为true，显示
          //     searchLoading: true,   //把"上拉加载"的变量设为false，显示
          //     noData:false,
          //   })
        }
        // this.setData({
        //   articleList :data.data.list,
        //   pageNo:data.data.pageNo
        // })
      } else {
        this.setData({
          articleList: data.data.list,
          pageNo: data.data.pageNo
        })
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }

    }
  },
  async getNewsList1(){
    let data = await util.httpRequestWithPromise('/rest/cms/articles?category=0002&pageNo='+this.data.pageNo,'GET','','');
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