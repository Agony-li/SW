import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';

const app = getApp()
Page({
    data:{
        tabs: ["申请奖金"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        userCode:null,
        phone:null,
        extend_s1:null,//身高
        extend_s2:null,//体重
        extend_s3:null,//年龄
        array:['男','女'],
        sex:0,
        recordList:[],
        pageNo:1,
        searchLoading:false,
        searchLoadingComplete:false,
        status:2,
        allPages:0,
        loadMoreData: '加载更多……' ,
        istrue:true,
        week: 0,
        currentWeek: 0,
        done: 0,
        endDone: false
    },
    onLoad(option){
      
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        that.setData({
          currentWeek: option.week,
          done: option.done
        })
        this.getTransactionList1();
    },
    tabClick: function (e) {
      console.info(e)
      if(this.data.endDone && e.currentTarget.id == 1) {
        wx.showModal({
          title: '提示',
          content: '很抱歉, 您已经达到预期效果, 学费不予退还!',
          success  (res) {
            if (res.confirm) {
              wx.navigateBack({
                complete: (res) => {},
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        let status = '';
        if(e.currentTarget.id ==0){
            this.setData({
                status:'2'
            })
        }else{
            this.setData({
                status:'4'
            })
            // status = e.currentTarget.id;
        }
        this.getTransactionList1(this.data.pageNo,this.data.status);
    },
    async getTransactionList(page,status){
        let data = await util.httpRequestWithPromise('/rest/evaluationOrder/list?pageNo='+page+'&status='+status,'GET','',wx.getStorageSync('key'));
        console.log(data);
        if(data.data.message == '200'){
            this.setData({
                recordList:data.data.page.list,
                week:data.data.week
            })
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        }
    },
    async getTransactionList1(){
        const {data} = await util.httpRequestWithPromise('/rest/evaluationOrder/list?pageNo='+this.data.pageNo+'&status='+this.data.status,'GET','',wx.getStorageSync('key'));
          console.log(data);
          console.info(data.message)
          if(data.message == 200){
            var done = false;
            console.info(data.score )
            console.info(data.avgScore)
            if(data.score < 30 && data.avgScore > 29) {
              done = true;
            } else if(data.score > 49 && data.score < 60 && data.avgScore > 24) {
              done = true;
            } else if(data.score > 59 && data.score < 70 && data.avgScore > 19) {
              done = true;
            } else if(data.score > 69 && data.score < 80 && data.avgScore > 14) {
              done = true;
            } else if(data.score > 79 && data.score < 90 && data.avgScore > 9) {
              done = true;
            }
            if(this.data.pageNo == 1){ // 下拉刷新
              this.setData({
                allPages: data.page.count,
                recordList: data.page.list,
                week:data.week,
                endDone:done
                // hideHeader: true
              })
              wx.hideNavigationBarLoading();
              // 停止下拉动作
              wx.stopPullDownRefresh();
            }else{ // 加载更多
              console.log('加载更多');
              var tempArray = this.data.recordList;
              tempArray = tempArray.concat(data.data.page.list);
              this.setData({
                allPages: data.data.data.count,
                articleList: tempArray,
                searchLoading: true,
                endDone:done
              })
            }
           
          }
       },
       async refundMoney(e){
         console.info(e);
         var status = e.currentTarget.dataset.info.status;
         var alert = "";
         if(status == 2) {
          alert = "确定申请奖金？"
         } 
         let that = this;
        wx.showModal({
          title: '提示',
          content: alert,
          success  (res) {
            if (res.confirm) {
              let date = util.formatTime(new Date());
              let info = e.currentTarget.dataset.info;
              var orderType = 0;
              if(info.status == 2) {
                orderType = 1;
              } else if(info.status == 4) {
                orderType = 2;
              }
              util.httpRequestWithPromise('/rest/user/refund?orderId='+info.id+'&orderType='+orderType,'GET','',wx.getStorageSync('key')).then(res=>{
                   if(res.data.message == 200){
                    wx.showToast({
                      title: '申请成功',
                      icon: 'success',
                      duration: 2000
                    })
                    that.getTransactionList1();
                   }else{
                    wx.showToast({
                      title: '申请失败',
                      icon: 'none',
                      duration: 2000
                    })
                   }
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      
   
       },
    onReachBottom: function() {
        // let that=this;
        // let pageNo = that.data.pageNo + 1; //获取当前页数并+1
        // that.setData({
        //     pageNo: pageNo, //更新当前页数
        // })
        // this.searchScrollLower();
        // Do something when page reach bottom.
        var self = this;
        // 当前页是最后一页
        if (self.data.recordList.length == self.data.allPages){
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
            searchLoading: false  
          })
          self.getTransactionList1();  
        },300);



      },
      async searchScrollLower(){
        let data = await util.httpRequestWithPromise('/rest/evaluationOrder/list?pageNo='+that.data.pageNo,'GET','',wx.getStorageSync('key'));
        console.log(data);
        if(data.data.message == '200'){
            let list = data.data.page.list;
            if(list.length>0){
                this.setData({
                    recordList:this.data.recordList.concat(data.data.page.list) 
                })
            }
          
          
        }
    },
    onPullDownRefresh: function() {
        // Do something when pull down.
        //  console.log('刷新');
        //  wx.showNavigationBarLoading();
      
        //  this.getTransactionList(1,"");
        console.log('刷新');
        let that = this;
        wx.showNavigationBarLoading() 
          // 请求数据
        that.getTransactionList1();
      },

})