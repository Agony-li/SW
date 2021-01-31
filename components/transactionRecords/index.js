import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';

const app = getApp()
Page({
    data:{
        tabs: ["全部", "待支付", "已支付", "已退款"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 35,
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
            status:'',
            allPages:0,
            loadMoreData: '加载更多……' ,
            istrue:true,
            redbagPrice: 0
    },
    onLoad(){
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    //sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        let url = '/rest/evaluationOrder/list?pageNo='+this.data.pageNo+'&status='+this.data.status
        this.getTransactionList1(url);
    },
    tabClick: function (e) {
        console.log(e.currentTarget.id);
        let url = '';
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        let status = '';
        if(Number(e.currentTarget.id) === 0){
            this.setData({
                status:''
            })
            url = '/rest/evaluationOrder/list?pageNo='+this.data.pageNo+'&status='+this.data.status
        }else if(Number(e.currentTarget.id) === 1){
            this.setData({
                status:e.currentTarget.id
            })
             url = '/rest/evaluationOrder/list?pageNo='+this.data.pageNo+'&status='+this.data.status
        }else if(Number(e.currentTarget.id) === 2){
          this.setData({
            status:e.currentTarget.id
        })
         url = '/rest/evaluationOrder/list?pageNo='+this.data.pageNo+'&status='+this.data.status
        }else if(Number(e.currentTarget.id) === 3){
          this.setData({
            status:e.currentTarget.id
        })
         url = '/rest/evaluationOrder/orderRefundList?pageNo='+this.data.pageNo+'&orderType=2'
        }else if(Number(e.currentTarget.id) === 4){
          this.setData({
            status:e.currentTarget.id
        })
         url = '/rest/evaluationOrder/redpacketsList?pageNo='+this.data.pageNo
        }
        this.getTransactionList1(url);
    },
    cancelOrder(option) {
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确定取消订单吗？',
        success: function (sm) {
          if (sm.confirm) {
            that.cancalSuccess(option.currentTarget.dataset.id);
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
  async confirmOrder(option) {
    let that = this;
	let url = '/pay/getPrepayIdResult?id=' + option.currentTarget.dataset.pid;
	if (option.currentTarget.dataset.id && option.currentTarget.dataset.id != '') {
		url += '&cid=' + option.currentTarget.dataset.id;
	}
    let result = await util.httpRequestWithPromise(url, 'POST', '', wx.getStorageSync('key'));
    var timastemp = Date.parse(new Date()) / 1000 + '';
    wx.requestPayment(
      {
        'appId': result.data.data.appId,
        'timeStamp': result.data.data.timeStamp,
        'nonceStr': result.data.data.nonceStr,
        'package': result.data.data.packageValue,
        'signType': result.data.data.signType,
        'paySign': result.data.data.paySign,
        'success': function (res) {
          if (res.errMsg == "requestPayment:ok") {
            wx.showToast({
              title: '支付成功',
            })
            wx.navigateBack();
          }
        },
        'fail': function (res) {
          console.info(res);

        },
        'complete': function (res) {
          console.info(res);

        }
      })
  },
    async cancalSuccess(id) {
      let data = await util.httpRequestWithPromise('/rest/evaluationOrder/cancelOrder?id=' + id, 'GET', '', wx.getStorageSync('key'));
      if (data.data.message == '200') {
        wx.showToast({
          title: '取消成功',
        })
        wx.navigateBack()
      }
    },
    async getTransactionList(page,status){
        let data = await util.httpRequestWithPromise('/rest/evaluationOrder/list?pageNo='+page+'&status='+status,'GET','',wx.getStorageSync('key'));
        if(data.data.message == '200'){
            let redbagPrice  = 0;
            let list = data.data.page.list;
            for(var i = 0; i < list.length; i++) {
              console.info(list[i])
              redbagPrice += list[i].price/100
            }
            console.info("redbag:" + redbagPrice);
            this.setData({
                recordList:list,
                redbagPrice: redbagPrice
            })
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        }
    },
    async getTransactionList1(url){
        let data = await util.httpRequestWithPromise(url,'GET','',wx.getStorageSync('key'));
          console.log(data);
          if(data.statusCode === 200){
            if(this.data.pageNo == 1){ // 下拉刷新
              let nowDate = new Date();
              nowDate = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate()+' '+'23:59:59'
              data.data.page.list.map(item => {
                // console.log(this.timeFn(item.paymentTime,nowDate));
                if(this.data.status === 0 || this.data.status === 1 ||this.data.status === 2){
                  if(this.timeFn(item.paymentTime,nowDate)>3){
                    item['isShowRefundBtn'] = false
                  }else{
                    item['isShowRefundBtn'] = true
                  }
                }
               
                  
              })
              let redbagPrice  = 0;
              let list = data.data.page.list;
              for(var i = 0; i < list.length; i++) {
                console.info(list[i])
                redbagPrice += list[i].price
              }
              console.info("redbag:" + redbagPrice);
              this.setData({
                allPages: data.data.page.count,
                recordList: list,
                redbagPrice:redbagPrice
                // hideHeader: true
              })
              console.log(this.data.recordList);
              wx.hideNavigationBarLoading();
              // 停止下拉动作
              wx.stopPullDownRefresh();
            }else{ // 加载更多
              console.log('加载更多');
              var tempArray = this.data.recordList;
              tempArray = tempArray.concat(data.data.page.list);
              let nowDate = new Date();
              nowDate = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate()+' '+'23:59:59'
              tempArray.map(item => {
                // console.log(this.timeFn(item.paymentTime,nowDate));
                if(this.data.status === 0 || this.data.status === 1 ||this.data.status === 2){

                  if(this.timeFn(item.paymentTime,nowDate)>3){
                    item['isShowRefundBtn'] = false
                  }else{
                    item['isShowRefundBtn'] = true
                  }
                }
                  
              })
            let redbagPrice  = 0;
            for(var i = 0; i < tempArray.length; i++) {
              console.info(tempArray[i])
              redbagPrice += tempArray[i].price/100
            }
            console.info("redbag:" + redbagPrice);
              this.setData({
                allPages: data.data.page.count,
                articleList: tempArray,
                searchLoading: true,
                redbagPrice: redbagPrice
              })
            }
           
          }
       },
       async refundMoney(e){
         let that = this;
        wx.showModal({
          title: '提示',
          content: '确定退款？',
          success  (res) {
            if (res.confirm) {
              console.log(e);
              console.log(util.formatTime(new Date()));
              let date = util.formatTime(new Date());
              let info = e.currentTarget.dataset.info;
              util.httpRequestWithPromise('/rest/user/refund?orderId='+info.id+'&orderType=2','GET','',wx.getStorageSync('key')).then(res=>{
                   if(res.data.message == 200){
                    wx.showToast({
                      title: '退款申请成功',
                      icon: 'success',
                      duration: 2000
                    })
                    that.getTransactionList1();
                   }else{
                    wx.showToast({
                      title: '退款申请失败',
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
        timeFn(d1,d2) {//di作为一个变量传进来
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
        // console.log(dateBegin)
        var dateEnd = new Date(d2);//获取当前时间
        // console.log(dateEnd)
        var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
        return dayDiff;
        // var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
        // var hours=Math.floor(leave1/(3600*1000))//计算出小时数
        // //计算相差分钟数
        // var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
        // var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
        // //计算相差秒数
        // var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
        // var seconds=Math.round(leave3/1000)
        // console.log(" 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
        // console.log(dateDiff+"时间差的毫秒数",dayDiff+"计算出相差天数",leave1+"计算天数后剩余的毫秒数"
        //     ,hours+"计算出小时数",minutes+"计算相差分钟数",seconds+"计算相差秒数");
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