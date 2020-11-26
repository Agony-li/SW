import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
const app = getApp()

Page({
  data: {
    icon60:'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    articleList:[],
    noData:false,
     pageNo:1,
     searchLoading: false, //"上拉加载"的变量，默认false，隐藏
     searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏

  },
  onLoad: function (option) {
   this.getNewsList(option.type);
  },

goToResult:function(){
    wx.navigateTo({
        url: '../../components/sleepResult/index'
      })
},
async getNewsList(pNum){
 let data = await util.httpRequestWithPromise('/rest/cbti/course/'+pNum,'GET','',wx.getStorageSync('key'));
   console.log(data);
   if(data.statusCode === 200){
     this.setData({
       articleList:data.data.data
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
  this.getNewsList(1,this.data.pageNo);
},
onPullDownRefresh: function() {
  // Do something when pull down.
   console.log('刷新');
   wx.showNavigationBarLoading();

   this.getNewsList(2,1);
},



})