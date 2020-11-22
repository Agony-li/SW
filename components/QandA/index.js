import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
const app = getApp()

Page({
    data:{
     questionList:[],
    },
    onReady: function (e) {
       
      },
      onLoad: function (option) {
          this.getQuestionList(option.id);
      },
      onShow(){
       
      },
      async getQuestionList(id){
        let data = await util.httpRequestWithPromise('/rest/cms/articles?category=' + id,'GET','', wx.getStorageSync('key'));
        this.setData({
            contentList:data.data.list
          })
        // if(data.data.message == '200'){
        //   if(data.data.data.length === 0){
            
        //   }else{
              
        //   }
        // }
      }
})