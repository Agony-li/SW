import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
var WxParse = require('../../wxParse/wxParse.js');


const app = getApp()

Page({
    data: {
        checkboxItems: [
            { name: 'standard is dealt for u.', value: '0', checked: true },
            { name: 'standard is dealicient for u.', value: '1' }
        ],
        testInfo: null,
        finishP: 0,
        choiceList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        currentId: null,
        current: 0,
        total: 0,
        isShowResult: false,
        resultList: [],
        testType: null,
        index: 0,
        hidden: true,
        content: "",
       nocancel: false,
        currentData:{},
        lbList: [],
        ctype: "",
        resultItem: "",
        kg: "",
        cm: "",
        age: 0,
        sex: 0,
        notifyHidden: true,
        notifyContent: ""
    },
    onLoad: function (option) {
        this.setData({
            testType: option.testType
        });
        if (option.from) {
            this.getTestList1(option.testType)
        } else {
            this.getTestList(option.testType);
        }

    },
    getBMI: function(option) {
      var value = option.detail.value;
      console.info(option)
      if(option.currentTarget.dataset.type == "cm") {
          this.setData({
            cm: value
          })
      }
      if (option.currentTarget.dataset.type == "kg") {
        this.setData({
          kg: value
        })
      }

        if(this.data.kg != "" && this.data.cm != "") {
          var BMI = (this.data.kg / (this.data.cm * this.data.cm)) * 10000;
          this.setData({
            resultItem: BMI.toFixed(2)
          })
        }
    },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (checkboxItems[i].value == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });
    },
    goToResult: function () {
        wx.navigateTo({
            url: '../../components/sleepResult/index'
        })
    },
    onShow() {
    },
    async getTestList(type, sort) {
        var that = this;
        var sortUrl = "";
        console.info(sort);
        if(sort != undefined && type != 'spiritual') {
          sortUrl += '&treeSort=' + sort;
        }
        var dictCodeUrl = "";
        if(this.data.currentId != null) {
          dictCodeUrl += '&dictCode=' + this.data.currentId
        }
        let data = await util.httpRequestWithPromise('/rest/evaluationType/listData.json?dictType=' + type +'' + sortUrl + ''+dictCodeUrl+ '&type=2', 'GET', '', wx.getStorageSync('key'));
        if (data.statusCode === 200) {
          console.log(data.data);
            if (data.data.message == '200') {
                if(data.data.data.current == 11) {
                  var info = wx.getStorageSync('info');
                  console.info(info)
                  this.setData({
                    kg: 1,
                    cm: 2
                  })
                }
                WxParse.wxParse('article', 'html', data.data.data.dictLabel, that, 2);
                this.setData({
                    testInfo: data.data.data,
                    finishP: data.data.data.current / data.data.data.total * 100,
                    current: data.data.data.current,
                    total: data.data.data.total
                });
              if (type == 'spiritual') {
                this.setData({
                  currentId: data.data.data.dictCode
                });
              } 
            } else if (data.data.message == '500' && type == 'slepping_test') {
              wx.navigateTo({
                url: '../../components/sleepResult/index?score=' + data.data.data
              })
            } else if (data.data.message == '400') {
              WxParse.wxParse('article', 'html', " ", that, 2);

               this.setData({
                 lbList: data.data.data,
                 testInfo: {},
                 testType: data.data.data[0].childList[0].dictType
               })
            } else if(data.data.message == '999') {
              console.info(data);
              this.setData({
                hidden: false,
                content: data.data.data.remarks,
                currentData: data.data.data
              })
            }
        }

    },
    async getTestList1(type) {
      var that = this;
        let data = await util.httpRequestWithPromise('/rest/evaluationType/listData.json?dictType=' + type + '&clean=true', 'GET', '', wx.getStorageSync('key'));
        if (data.statusCode === 200) {
            if (data.data.message == '200') {
              if(data.data.data.current == 11) {
                var info = wx.getStorageSync('info');
                console.info(info)
                this.setData({
                  kg: 1,
                  cm: 2
                })
              }
                this.setData({
                    testInfo: data.data.data,
                    finishP: data.data.data.current / data.data.data.total * 100,
                    current: data.data.data.current,
                    total: data.data.data.total,
                });
                WxParse.wxParse('article', 'html', data.data.data.dictLabel, that, 2);

            }
            if (data.data.message == '500' && type == 'slepping_test') {
                wx.navigateTo({
                    url: '../../components/sleepResult/index?score=' + data.data.data
                })
            }

        }

    },
    async nextQuestion(option) {
      let that = this;
      if (this.data.currentId === null && option.currentTarget.dataset.type == 2) {
            wx.showToast({
                title: '请选择答案',
                icon: 'none',
                duration: 2000
            })
            return false
        }
      if(this.data.testType == 'spiritual' && this.data.currentId == "002004") {
          wx.showModal({
            title: '提示',
            showCancel:'false',
            content: '您可能是由于摄入精神类活性物质导致的失眠，请在医生指导下停止摄入至少三个月后重新进行测试。',
            confirmText:"确定",//默认是“确定”
            success: function (res) {
               if (res.cancel) {
                  //点击取消,默认隐藏弹框
               } else {
                 wx.switchTab({
                   url: '../../pages/index/index',
                 })
               }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
         })
          return;
        }
      if (this.data.currentId == null) {
        if (this.data.testInfo.childList.length <= 0) {
          this.setData({
            currentId: this.data.testInfo.dictCode
          })
        } else {
          this.setData({
            currentId: this.data.testInfo.childList[0].dictCode
          })
        }
      }
        let treeSort = option.currentTarget.dataset.sort + '';
      if (treeSort == "undefined") {
          treeSort = 30;
        }
        console.info("nextQuestion:")
      let data = await util.httpRequestWithPromise('/rest/evaluationType/listData.json?dictType=' + this.data.testType + '&treeSort=' + treeSort + '&dictCode=' + this.data.currentId + '&type=' + option.currentTarget.dataset.type, 'GET', '', wx.getStorageSync('key'))
        if (data.statusCode === 200) {
          if (option.currentTarget.dataset.type == '1') {
            if (data.data.data.dictType == 'restless_legs' || data.data.data.dictType == 'apnea' || data.data.data.dictType == 'spiritual' || data.data.data.dictType == 'plm') {
              wx.setNavigationBarTitle({
                title: '生理原因分析',
              })
              console.info('生理原因分析')
            } else if (data.data.data.length > 0 && data.data.data[0].dictType == 'phq') {
              wx.setNavigationBarTitle({
                title: '心理原因分析-第一部分',
              })
              console.info('心理原因分析-第一部分')
            } else if (data.data.data.length > 0 && data.data.data[0].dictType == 'sas') {
              wx.setNavigationBarTitle({
                title: '心理原因分析-第二部分',
              })
              console.info('心理原因分析-第二部分')
            } else if (data.data.data.dictType == 'slepping_test') {
              wx.setNavigationBarTitle({
                title: '失眠严重程度测试',
              })
              console.info('失眠严重程度测试')
            }
          }
          if(data.data.message == "300") {
                var remark = "";
                if(that.data.testType == 'apnea'){
                  remark = "经测试，您属于原发性失眠，非其它生理性失眠，下面进行心理原因分析。"
                } else if(that.data.testType == 'phq'){
                  remark = "经测试，您属于原发性失眠，非其它生理性失眠，下面进行心理原因分析。"
                }
                wx.navigateTo({
                  url: '../../components/sleepOtherResult/index?remark=' + remark
                }) 
                this.setData({
                  lbList: data.data.data,
                  testInfo: {},
                  testType: data.data.data[0].childList[0].dictType,
                  current: null
                })
          } else if(data.data.message == '999'){
            console.info(data);
            this.setData({
              hidden: false,
              content: data.data.data.remarks,
              currentData: data.data.data
            })
          } else {
            var info = wx.getStorageSync('info');
            var c = null;
              if(data.data.data.current == 11) {
                var kg = info.extend.extendS2;
                var cm = info.extend.extendS1;
                var BMI = (kg / (cm * cm)) * 10000;
                this.setData({
                  kg: kg,
                  cm: cm,
                  resultItem: BMI.toFixed(2)
                })
              } else if(data.data.data.current == 12) {
                if(info.extend.extendS3 > 50) {
                  c = "001702"
                } else {
                  c = "001701"
                }
              } else if(data.data.data.current == 14) {
                if(info.extend.extendS4 == 1) {
                  c = "001902"
                } else {
                  c = "001901"
                }
              } 
              this.setData({
                lbList:null,
                testInfo: data.data.data,
                currentId: c,
                finishP: data.data.data.current / data.data.data.total * 100,
                total: data.data.data.total,
                current: data.data.data.current
              })
               
            if (data.data.data.dictCode == '0020') {
              this.setData({
                testType: "spiritual"
              })
            } else {
              this.setData({
                testType: data.data.data.childList[0].dictType
              })
            }
          }
          var label = data.data.data.dictLabel == null ? "" : data.data.data.dictLabel;
          WxParse.wxParse('article', 'html', label, that, 2);
        }
    },
    choiceAnswer(option) {
        this.setData({
            currentId: option.currentTarget.dataset.id
        })
    },
    choiceOtherAnswer(option) {
      var value = option.currentTarget.dataset.value;
      var id = option.currentTarget.dataset.id;
      var lbList = this.data.lbList;
      for(var i = 0; i < lbList.length; i++) {
        var lb = lbList[i];
        if(value == lb.dictCode) {
          var childList = lb.childList;
          for(var j = 0; j < childList.length; j++){
            var child = childList[j];
            if(id == child.dictCode) {
              child.checked = true;
            } else {
              child.checked = false;
            }
          }
        }
      }
      console.info(lbList)
      this.setData({
        lbList: lbList
      })
    },

    /**
     * 结束测试
     */
    async endTest(){
        // let data = await util.httpRequestWithPromise('/rest/evaluationData/closeTest', 'GET', '', wx.getStorageSync('key'))
        //  if(data.data.message == '200'){
            wx.switchTab({
                url: '../../pages/index/index'
              })
        //  }else{
        //     wx.showToast({
        //         title: data.data.message,
        //         icon: 'none',
        //         duration: 2000
        //     })
        //     return false
        //  }
     },

    /**
     * 查看结果
     */
    async submit(option) {
      let that = this;
      wx.setNavigationBarTitle({
        title: '生理原因分析',
      })
      var sort = option.currentTarget.dataset.sort;
      if (this.data.currentId === null && option.currentTarget.dataset.type == 2) {
            wx.showToast({
                title: '请选择答案',
                icon: 'none',
                duration: 2000
            })
            return false
        }
        if(this.data.testType == 'spiritual' && this.data.currentId == "002004") {
          wx.showModal({
            title: '提示',
            showCancel:'false',
            content: '您可能是由于摄入精神类活性物质导致的失眠，请在医生指导下停止摄入至少三个月后重新进行测试。',
            confirmText:"确定",//默认是“确定”
            success: function (res) {
               if (res.cancel) {
                  //点击取消,默认隐藏弹框
               } else {
                 that.endTest();
                 wx.switchTab({
                   url: '../../pages/index/index',
                 })
               }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
         })
          return;
        }
        let data = await util.httpRequestWithPromise('/rest/evaluationData/submit?dictType=' + this.data.testType + '&dictCode=' + this.data.currentId, 'GET', '', wx.getStorageSync('key'))
        if (data.data.message == '500') {
            this.setData({
                isShowResult: true,
                resultList: data.data.data
            })
        } else if (data.data.message == '200') {
            if(data.data.total != 0&&this.data.testType == 'slepping_test'){
                  wx.navigateTo({
                url: '../../components/sleepResult/index?score='+data.data.data
              })
            }
          if (option.currentTarget.dataset.type == 2) {
            let res = await util.httpRequestWithPromise('/rest/evaluationProgram/valid_program?dictType=' + this.data.testType, 'GET', '', wx.getStorageSync('key'))
            if (res.data.message == '500') {
              let data = res.data.data;
              if (data.type == '2') {
                that.setData({
                  hidden: false,
                  content: data.remarks
                });
              } else if (data.type == "1" && that.data.testType != 'slepping_test') {
                if ((that.data.testType == 'apnea' || that.data.testType == 'phq' || that.data.testType == 'sas') && data.remarks != '') {
                  that.setData({
                    hidden: false,
                    content: data.remarks,
                    currentData: data
                  })
                } else {
                  wx.navigateTo({
                    url: '../../components/confirmNotic/index?id=' + data.id + '&price=' + data.price + '&title=' + data.title + '&createDate=' + data.createDate + '&from=3'
                  })
                }

              }
            } else {
              if ((that.data.testType == 'apnea' || that.data.testType == 'phq')){
                wx.setNavigationBarTitle({
                  title: '心理原因分析-第一部分',
                })
                var remark = "";
                if(that.data.testType == 'apnea'){
                  remark = "经测试，您属于原发性失眠，非其它生理性失眠，下面进行心理原因分析。"
                } else if(that.data.testType == 'phq'){
                  remark = "经测试，您属于原发性失眠，非其它生理性失眠，下面进行心理原因分析。"
                }
                wx.navigateTo({
                  url: '../../components/sleepOtherResult/index?remark=' + remark
                })
                if (res.data.data.length > 1 ) {
                  that.setData({
                    testType: res.data.data[that.data.index].dictType
                  });
                  that.getTestList(res.data.data[that.data.index].dictType, sort);
                }
              } else {
                that.setData({
                  testType: res.data.data[that.data.index].dictType
                });
                that.getTestList(res.data.data[that.data.index].dictType, sort);
              }
            }
          }
        }
    },

  async submitLb(option) {
    let that = this;
    var lbList = this.data.lbList;
    var status = true;
    var label = "";
    for(var i = 0; i < lbList.length; i++){
      var childList = lbList[i].childList;
      for (var j = 0; j < childList.length; j++) {
        if (childList[j].checked == true) {
          status = false;
          break;
        }
      }
    }

    if (status == true) {
      wx.showToast({
        title: "还有未选择的项目， 请选择!",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.setNavigationBarTitle({
      title: '心理原因分析-第二部分',
    })
    let data = await util.httpRequestWithPromise('/rest/evaluationData/submitLb?dictType=' + this.data.testType, 'POST', { lbList: JSON.stringify(lbList)}, wx.getStorageSync('key'))
    if (data.data.message == '500') {
      this.setData({
        isShowResult: true,
        resultList: data.data.data
      })
    } else if (data.data.message == '200') {
      if (data.data.total != 0 && this.data.testType == 'slepping_test') {
        wx.navigateTo({
          url: '../../components/sleepResult/index?score=' + data.data.data
        })
      }
      let res = await util.httpRequestWithPromise('/rest/evaluationProgram/valid_program?dictType=' + this.data.testType, 'GET', '', wx.getStorageSync('key'))
      if (res.data.message == '500') {
        let data = res.data.data;
        if (data.type == '2') {
          wx.navigateTo({
            url: '../../components/sleepOtherResult/index?remark=' + data.remarks + '&id=' + data.id + '&price=' + data.price + '&title=' + data.title + '&createDate=' + data.createDate + '&from=3'
              })
        } else if (data.type == "1" && that.data.testType != 'slepping_test') {
          if ((that.data.testType == 'apnea' || that.data.testType == 'phq' || that.data.testType == 'sas') && data.remarks != "") {
            wx.navigateTo({
              url: '../../components/sleepOtherResult/index?remark=' + data.remarks + '&id=' + data.id + '&price=' + data.price + '&title=' + data.title + '&createDate=' + data.createDate + '&from=3'
            })
          } else {
            wx.navigateTo({
              url: '../../components/confirmNotic/index?id=' + data.id + '&price=' + data.price + '&title=' + data.title + '&createDate=' + data.createDate + '&from=3'
            })
          }

        }
      } else {
        if(that.data.testType == 'apnea' || that.data.testType == 'phq'){
          var remark = "";
          console.info(that.data.testType)
          if (that.data.testType == 'apnea'){
              remark = "经测试，您属于原发性失眠，非其它生理性失眠，下面进行心理原因分析。"
              wx.navigateTo({
                url: '../../components/sleepOtherResult/index?remark=' + remark
              })
          } else if (that.data.testType == 'phq'){
            that.setData({
              testType: res.data.data[that.data.index].dictType
            });
            that.getTestList(res.data.data[that.data.index].dictType);
          }
        }  else {
          that.setData({
            testType: res.data.data[that.data.index].dictType
          });
          that.getTestList(res.data.data[that.data.index].dictType);
        }
      }


    }
  },
  cancel: function () {
    this.setData({
      hidden: true
    });
  },

  confirm: function () {
    var that = this;
    if (that.data.testType == 'apnea' || that.data.testType == 'phq' || that.data.testType == 'sas') {
      wx.navigateTo({
        url: '../../components/confirmNotic/index?id=' + that.data.currentData.id + '&price=' + that.data.currentData.price + '&title=' + that.data.currentData.title + '&createDate=' + that.data.currentData.createDate + '&from=3'
      })
    } else {
      this.setData({
        hidden: true
      });
    } 
  },
  ok: function() {
    this.setData({
      notifyHidden: true
    });
    this.getTestList(this.data.testType);
  }
})