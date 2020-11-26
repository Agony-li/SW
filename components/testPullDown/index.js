//index.js
import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
//获取应用实例
var app = getApp()
Page({
  data: {
    loading: false,//是否在加载中  
    pull: true,//下拉刷新状态 false释放刷新状态  上拉加载更多状态   false释放加载更多状态
    refreshing_text:'下拉刷新',
    loading_text: '上拉加载更多',
    loadingHeight:90,//正在加载时高度
    refreshHeight: 0,//刷新布局高度  
    loadMoreHeight:0,//加载更多布局高度
    scrolling:false,//滚动中
    isUpper:true,//scroll-view 滚动条默认在最上
    isLower:false,
    windowHeight: 0,//获取屏幕高度  
    currentSize:1,
    words: [],
    downY: 0,//触摸时Y轴坐标  
  },
  onLoad: function () {
    var _this = this;
    //获取屏幕高度  
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
        console.log("屏幕高度: " + res.windowHeight)
      }
    })
    //获取words  
    this.doLoadData(1,20);
  },
  async doLoadData(currendSize,PAGE_SIZE){
      wx.showLoading({
        title: 'loading...',
      });
      var that = this;
   
       
        setTimeout(function(){
            // var length = currendSize+PAGE_SIZE;
            // console.log('currendSize:', currendSize);
            // for(var i= currendSize;i < length;i++){
            //    that.data.words.push('内容'+i);
            // }
            // var words = that.data.words;
         util.httpRequestWithPromise('/cms/articles?category=0001&pageNo='+currendSize,'GET','','').then(data=>{
            that.data.currentSize += 1;
            that.setData({
              words:data.data.list
            });
            // that.data.currentSize += PAGE_SIZE;
            // that.setData({
            //   words:words
            // });
            wx.hideLoading();
            that.loadFinish();
         });
            // articleList :this.data.articleList.concat(data.data.list),
    
            // var words = that.data.words;
           
          },2000);
     
  },
  scroll: function () {
    console.log("scroll...");
    this.data.scrolling = true;
    this.data.isLower = false;
    this.data.isUpper = false;
  },
  //上拉  滚动条 滚动到底部时触发
  lower: function () {
    console.log("lower...")
    this.data.isLower = true;
    this.data.scrolling = false;
    
  },
   //下拉  滚动条 滚动顶底部时触发
  upper: function () {
    console.log("upper....");
    this.data.isUpper = true;
    this.data.scrolling = false;    
  },
  start: function (e) {
    console.log('start ');
    if (this.data.scrolling || this.data.loading){
      return;
    }
    var startPoint = e.touches[0]
    var clientY = startPoint.clientY;
    this.setData({
      downY: clientY,
      refreshHeight: 0,
      loadMoreHeight: 0,
      pull: true,
      refreshing_text: '下拉刷新',
      loading_text: '上拉加载更多'
    });
  },
  end: function (e) {
    this.data.scrolling = false;
    if ( this.data.refreshing) {
      return;
    }
    console.log('end');
    //释放开始刷新
    var height = this.data.loadingHeight;
    if (this.data.refreshHeight > this.data.loadingHeight){
      this.setData({
        refreshHeight: height,
        loading:true,
        pull: false,
        refreshing_text: '正在刷新...'
      });
      this.refresh();
    } else if (this.data.loadMoreHeight > height){
        this.setData({
          loadMoreHeight: height,
          loading: true,
          pull: false,
          loading_text: '正在加载更多...'
        });
        this.loadMore();
    }else{
      this.setData({
        refreshHeight: 0,
        loadMoreHeight:0,
        loading: false,
        pull: true
      })
    }
   
  },
  //模拟刷新数据
  refresh:function(){
    
    this.setData({
      words:[],
      currentSize:1
    });
    this.doLoadData(1, 20);
  },
  //模拟加载更多数据
  loadMore: function () {
      console.log(11);
    this.doLoadData(this.data.currentSize, 20);
  },
  loadFinish:function(){
    var that = this;
    setTimeout(function () {
      //2s后刷新结束
      that.setData({
        refreshHeight: 0,
        loadMoreHeight:0,
        loading: false
      })

    }, 1000);
  },
  move: function (e) {
    // console.log("move...:scrolling:" + this.data.scrolling, 'loading:' + this.data.loading
    //   + 'isLower:' + this.data.isLower);
    if (this.data.scrolling || this.data.loading) {
      return;
    }
    var movePoint = e.changedTouches[0]
    var moveY = (movePoint.clientY - this.data.downY) * 0.6;
    //1.下拉刷新
    if (this.data.isUpper && moveY  > 0){
      console.log("下拉...dy:", moveY);
      this.setData({
        refreshHeight: moveY
      })
      if (this.data.refreshHeight > this.data.loadingHeight){
        this.setData({
          pull: false,
          refreshing_text: '释放立即刷新'
        })
      }else{
        this.setData({
          pull: true,
          refreshing_text: '下拉刷新'
        })
      }
    } else if (this.data.isLower && moveY < 0){//2上拉加载更多
      console.log("上拉...dy:", moveY);
      this.setData({
        loadMoreHeight: Math.abs(moveY)
      })
      if (this.data.loadMoreHeight > this.data.loadingHeight) {
        this.setData({
          pull: false,
          loading_text: '释放加载更多'
        })
      } else {
        this.setData({
          pull: true,
          refreshing_text: '上拉加载更多'
        })
      }
    }
  }
})