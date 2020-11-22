import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';

const app = getApp()

Page({
    data: {
        hidden:true,
        minHour: 10,
        maxHour: 20,
        currentDate4: '12:00',
        message:'',
        choiceList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        lbList:[
            {dictLabel:'睡眠自我感受',
            childList:[
                {dictLabel:'很满意',
                 checked:false},
                {dictLabel:'满意',
                checked:false},
                {dictLabel:'一般',
                checked:false},
                {dictLabel:'不满意',
                checked:false},
                {dictLabel:'很不满意',
                checked:false}
            ]},
            {dictLabel:'白天精神状态',
            childList:[
                {dictLabel:'非常好',
                checked:false},
                {dictLabel:'良好',
                checked:false},
                {dictLabel:'一般',
                checked:false},
                {dictLabel:'不好',
                checked:false},
                {dictLabel:'非常差',
                checked:false}
            ]},
        ],
            sleep_feel:null,
            day_mentality:null,
            today_joy:null,
            today_sad:null,
            today_worry:null,
            today_thanksgiving:null,
            today_training_feel:null,
            daily_motto:'测试',
            tomorrow_plan:null,
            motion_time:null,
            sleep_time:null,
            meditation_time:null,
            subjective_start_time:null,
            subjective_end_time:null,
            bottom: false,
            userCode:null,
            id:null
    },
    onload(){
        // this.getQuote();
    },
    onShow(){
        console.log(app.globalData.userCode);
        this.setData({
            userCode:app.globalData.userCode
        })
        this.getLogList();
        if(this.data.id == null){
            this.getQuote();
        }
       
    },
    onReady(){
       
    },
    onChange(event) {
        // event.detail 为当前输入的值
        console.log(event);
        let a = event.currentTarget.dataset.type;
        this.setData({
          [a]:event.detail.value
        })
      },
    async getQuote(){
        let that = this;
        wx.request({
            url: 'https://sslapi.hitokoto.cn/?encode=json', //仅为示例，并非真实的接口地址
            data: {
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success (res) {
              console.log(res.data)
              that.setData({
                   daily_motto : res.data.hitokoto
              })
              
            }
          })
    //  let data = await util.httpRequestWithPromise('https://sslapi.hitokoto.cn/?encode=json', 'GET', '', '');

    },
    goToLog() {
       wx.navigateTo({
         url: 'regulations',
       })
    },
    async doSubmit(){
        let params = {
            userCode:this.data.userCode,
            sleepFeel:this.data.sleep_feel,
            dayMentality:this.data.day_mentality,
            subjectiveStartTime:this.data.subjective_start_time,
            subjectiveEndTime:this.data.subjective_end_time,
            todayJoy:this.data.today_joy,
            todaySad:this.data.today_sad,
            todayWorry:this.data.today_worry,
            todayThanksgiving:this.data.today_thanksgiving,
            todayTrainingFeel:this.data.today_training_feel,
            dailyMotto:this.data.daily_motto,
            tomorrowPlan:this.data.tomorrow_plan,
            motionTime:this.data.motion_time,
            sleepTime:this.data.sleep_time
        }
        if(this.data.id!=null){
            params.id = this.data.id
        }
        let data = await util.httpRequestWithPromise('/rest/mylog/save', 'POST', params, wx.getStorageSync('key'));
            console.log(data);
            wx.showToast({
                title: '保存成功',
                icon: 'none',
                duration: 1000
            })
            setTimeout(()=>{
                wx.switchTab({
                    url: '../../pages/CBTI/index'
                  })
            },1000)
    },
     async getLogList(){
        let {data} = await util.httpRequestWithPromise('/rest/mylog/mylog?userCode='+this.data.userCode, 'GET', '', wx.getStorageSync('key'));
          console.log (data);
          if(data.length > 0){
            let sleepFeel = `lbList[0].childList[${data[0].sleepFeel-1}].checked`;
            let dayMentality = `lbList[1].childList[${data[0].dayMentality-1}].checked`
              this.setData({
                sleep_feel:data[0].sleepFeel,
                day_mentality:data[0].dayMentality,
                [sleepFeel]:true,
                [dayMentality]:true,
                today_joy:data[0].todayJoy,
                today_sad:data[0].todaySad,
                today_worry:data[0].todayWorry,
                today_thanksgiving:data[0].todayThanksgiving,
                today_training_feel:data[0].todayTrainingFeel,
                daily_motto:data[0].dailyMotto,
                tomorrow_plan:data[0].tomorrowPlan,
                motion_time:data[0].motionTime,
                sleep_time:data[0].sleepTime,
                meditation_time:data[0].sleepFeel,
                subjective_start_time:data[0].subjectiveStartTime,
                subjective_end_time:data[0].subjectiveEndTime,
                userCode:data[0].sleepFeel,
                id:data[0].id
              })
          }
    },
    bindTimeChange: function(e) {
      if(e.currentTarget.dataset.type == "subjective_start_time") {
        this.setData({
          subjective_start_time: e.detail.value
        })
      } else {
        this.setData({
          subjective_end_time: e.detail.value
        })
      }
      
  },
    choiceOtherAnswer(option) {
        console.log(option);
        if(option.currentTarget.dataset.index === 0){
            this.setData({
                sleep_feel:option.currentTarget.dataset.value+1
            })
        }
        if(option.currentTarget.dataset.index === 1){
            this.setData({
                day_mentality:option.currentTarget.dataset.value+1
            })
        }
        let lbList = this.data.lbList[option.currentTarget.dataset.index].childList;
        lbList.map( item => {
                item.checked = false
        })
        let b = `lbList[${option.currentTarget.dataset.index}].childList`;
        this.setData({
            b:lbList
        })
        let a = `lbList[${option.currentTarget.dataset.index}].childList[${option.currentTarget.dataset.value}].checked`;
        this.setData({
             [a] :true
        })
        // this.setData({
        //     currentId: option.currentTarget.dataset.id
        // })
    },
    onClickParent(){
        this.setData({
           bottom: 'true'
          });
    },
    hideBottom(){
        this.setData({
            bottom: 'false'
           });
    },
    onInput(event) {
        const { detail, currentTarget } = event;
        const result = this.getResult(detail, currentTarget.dataset.type);
    
        // Toast(result);
      },
      getResult(time, type) {
        const date = new Date(time);
        switch (type) {
          case 'datetime':
            return date.toLocaleString();
          case 'date':
            return date.toLocaleDateString();
          case 'year-month':
            return `${date.getFullYear()}/${date.getMonth() + 1}`;
          case 'time':
            return time;
          default:
            return '';
        }
      },
})