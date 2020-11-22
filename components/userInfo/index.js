import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';

const app = getApp()
Page({
    data:{
            userCode:null,
            phone:null,
            extend_s1:null,//身高
            extend_s2:null,//体重
            extend_s3:null,//年龄
            array: ['女','男'],
            sex:0,
            array1: ['美国', '中国', '巴西', '日本'],
            index:null
    },
    onLoad(){
     this.getUserInfo()
    },
    onShow:function(){
        this.getRestTime();
    },
    async getUserInfo(){
        let res = await util.httpRequestWithPromise('/rest/user/info','GET','',wx.getStorageSync('key'));
        console.log(res);
        if(res.data.message == "200"){
            if(res.data.data.extend){
                this.setData({
                  extend_s1: res.data.data.extend.extendS1,
                  extend_s2: res.data.data.extend.extendS2,
                  extend_s3: res.data.data.extend.extendS3,
                  index: (res.data.data.extend.extendS4) - 1
                })
            }
            var sex = res.data.data.sex;
            if(sex != undefined){
                this.setData({
                    sex: res.data.data.sex
                });
            }
            this.setData({
                userCode:res.data.data.userCode,
                phone: res.data.data.phone
            })
        }
    },
    // goToPay(){
    //     wx.navigateTo({
    //         url: '../../components/payMoney/index'
    //       })
    // },
  bindPickerChange(val) {
    console.log(val);
    this.setData({
      index: val.detail.value,

    })
  },
  bindSexChange(val) {
    console.log(val.detail.value);
    this.setData({
      sex: val.detail.value,

    })
  },
 async saveUserInfo(){
    var age = this.data.extend_s3;
    var tz = this.data.extend_s2;
    var sg = this.data.extend_s1;
    var sjh = this.data.phone;
    if(age == null || age == "") {
        wx.showToast({
          title: '请填写年龄',
        })
        return;
    }
    if(sg == null || sg == "") {
        wx.showToast({
          title: '请填写身高',
        })
        return;
    }
    if(tz == null || tz == "") {
        wx.showToast({
          title: '请填写体重',
        })
        return;
    }
    
    if(sjh == null || sjh == "") {
        wx.showToast({
          title: '请填写手机号',
        })
        return;
    }
        let params = {
            "userCode":this.data.userCode,
              "phone":this.data.phone,
              "extendS1":this.data.extend_s1,//身高
              "extendS2":this.data.extend_s2,//体重
              "extendS3":this.data.extend_s3,//age
              "sex":this.data.sex,
              "extendS4":(this.data.index-0+1)
        }
        console.log(params);
       let res = await util.httpRequestWithPromise('/rest/user/update','POST',params,wx.getStorageSync('key'));
       console.log(res);
       if(res.data.message == '200'){
        wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          }) 
          console.info(res.data.data)
          wx.setStorageSync('info', res.data.data);
          wx.switchTab({
            url: "../../pages/userCenter/index",
          })
          
       }else{
        wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          })
          
       }
    },
    changeAge(val){
        this.setData({
            extend_s3:val.detail.value
        })

    },
    changeTall(val){
        this.setData({
            extend_s1:val.detail.value
        })

    },
    changeWeight(val){
        this.setData({
            extend_s2:val.detail.value
        })

    },
    changePhone(val){
        this.setData({
            phone:val.detail.value
        })

    },
    async getRestTime(){
        const  { data } = await util.httpRequestWithPromise('/rest/dict/sys_rest_work','GET','',wx.getStorageSync('key'));
        console.log(data);
        if(data.message === '200'){
            let arrays = [];
            (data.data).forEach(item =>{
                console.log(item);
                arrays.push(item.treeNames)
            })
            console.log(arrays);
            this.setData({
                array1:arrays
            })
        }

    },
})