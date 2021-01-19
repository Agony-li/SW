import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
const app = getApp()

Page({
   data:{
    icon60:'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    discountCode:null,
    nums:1,
    title:null,
    description:null,
    price:null,
    id:null,
    total:null,
    payEnd:true,
    couponId: "",
    coupon: ""

   },
   onLoad(option){
        this.setData({
            title:option.title,
            description:option.remarks,
            price:option.price,
            id:option.id,
            total:option.price
        })
        
   },
   onShow(option) {
     console.info(option)
    if(option.couponId != null || option.couponId != undefined) {
      this.loadCoupon();
    }
   },
   addNum(){
       console.log(111);
       this.setData({
           nums:++this.data.nums,
           total:this.data.price*(++this.data.nums)
       })
   },
   minusNum(){
       if(this.data.nums!=0){
        this.setData({
            nums:--this.data.nums,
            total:(--this.data.nums)*this.data.price
        })
       }
   
   },
   async payNow(){
     let that = this;
    let result = await util.httpRequestWithPromise('/rest/ryqpay/buyplan?id=' + this.data.id + '&couponId=' + this.data.couponId, 'POST', '', wx.getStorageSync('key'));
    var timastemp = Date.parse(new Date()) / 1000 + '';
    console.info(timastemp)
    console.info(result.data)

    wx.requestPayment(
      {
        'appId': result.data.data.appId,
        'timeStamp': result.data.data.timeStamp,
        'nonceStr': result.data.data.nonceStr,
        'package': result.data.data.packageValue,
        'signType': "MD5",
        'paySign': result.data.data.paySign,
        'success': function (res) {
          console.info(res);
          that.setData({
            payEnd:false
          })
          if (res.errMsg == "requestPayment:ok") {
                    that.paySuccess();
                    
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
   async paySuccess() {
    let { data } = await util.httpRequestWithPromise('/rest/evaluationOrder/form', 'POST', '', wx.getStorageSync('key'));
    console.info(data);
    var that = this;
    if (data.message == '200') {
      // wx.redirectTo({
      //   url: '../../components/confirmNotic/index?id=&price=&title=&createDate=&from=5'
      // })
      wx.switchTab({
        url: '../../pages/plan/plan',
      })
    } 
  },
  selectcoupon : function() {
      wx.navigateTo({
        url: '../coupon/my',
      })
  },
   async loadCoupon() {
    let data = await util.httpRequestWithPromise('/rest/coupon/list?type=my&id='+ this.data.couponId, 'GET', '', wx.getStorageSync('key'));
    if(data.statusCode === 200){
        console.info(data); 
        var item = data.data.data[0]; 
        this.setData({
          total:this.data.price - item.usedAmount,
          coupon: "-" + item.usedAmount
      })
    }
   },
   payFinish(){
    wx.switchTab({
                url: "../../pages/index/index",
              })
   },
   goToOrder(){
    wx.navigateTo({
      url: '../../components/transactionRecords/index'
    })
   }
   
})