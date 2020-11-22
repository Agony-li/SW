// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

import config from './dev.config'
var data = [];
var doWhatAfterLog = "";
//经纬度转换
function bMapTransQQMap(lng, lat) {

  let x_pi = 3.14159265358979324 * 3000.0 / 180.0;

  let x = lng - 0.0065;

  let y = lat - 0.006;

  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);

  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);

  let lngs = z * Math.cos(theta);

  let lats = z * Math.sin(theta);

  return {

    lng: lngs,

    lat: lats

  }

}


//修改http为https
function httpToHttps(url){
  let a = url;
  if(a != null){
    let index = a.indexOf('https')
    if (index == -1) {
      a = a.replace('http', 'https')
    }
  }
  return a
}
function getPhoneNumber() {
  wx.request({
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'sessionid': wx.getStorageSync('key'),
      'X-Lite-Token': wx.getStorageSync('key')
    },
    url: config.imageUrlPrefix + '/user/setUserMobile',
    data: {
      iv: wx.getStorageSync('iv'),
      wxCode: wx.getStorageSync('code'),
      encrypteData: wx.getStorageSync('encrypteData')
    },
    success: function(res) {
      if (res.data.code == 601) {
        // wx.showToast({
        //   title: res.data.msg,
        //   icon: 'none'
        // })
      }
    }
  })
  return data;
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function noDateTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [hour, minute].map(formatNumber).join(':')
}

function newFormatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('/');
}

function xieGangTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('/');
}

function minFormatTime(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getUserInfoFunction() {
  let arr = [];
  wx.login({
    success: function(res) {
      let code = res.code;
      wx.request({
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': "SESSION=" + wx.getStorageSync('key'),
          'X-Lite-Token': wx.getStorageSync('key')
        },
        url: config.imageUrlPrefix + '/user/setUserMobile',
        data: {
          iv: wx.getStorageSync('iv'),
          wxCode: code,
          encrypteData: wx.getStorageSync('encrypteData')
        },
        success: function(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '绑定成功',
            })
            arr = res.data.data;
            wx.setStorageSync('userInfo', res.data.data);
          }
        }
      })
    }
  })
  return arr;
}
// 去前后空格
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息
function isError(msg, that) {
  wx.showToast({
    title: '网络错误',
    icon: 'none'
  })
}

function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}


function httpRequest(url, method, data, success, fail) {
  wx.request({
    url: url,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'sessionId': wx.getStorageSync('key'),
      'plantDomain': config.testUrl,
      'X-Lite-Token': wx.getStorageSync('key')
    },
    method: method,
    data: data,
    success(res) {
      success(res);
    },
    fail(res) {
      fail(res);
    }
  });

}
async function httpRequestWithPromise(url,methods, params,token, message) {
	
	let dt = await httpRequestWithPromise2(url,methods, params,token, message);
	console.log(dt)
	if (data && data.message == '600') {
		
		let url2 = '/wx/user/' + config.appid + '/uptoken';
		let params2 = {"oid": wx.getStorageSync('oid')};
		let res = await httpRequestWithPromise2(url2,'GET',params2);
		console.log(res);
		if (res.data.message == "200") {
			wx.setStorageSync('key', res.data.token);
			
			dt = await httpRequestWithPromise2(url,methods, params,token, message);
		}
		
	}
	
	return dt;
}

function httpRequestWithPromise2(url,methods, params,token, message) {
  // let sessionId = wx.getStorageSync("key");
  //console.log(params)
  // if (message != "") {
  //   wx.showLoading({
  //     title: message,
  //   })
  // }
	return new Promise(function(resolve, reject) {
		wx.request({
			url: config.imageUrlPrefix + url,
			data: params,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'token': token?token:'',
				'X-Lite-Token': token ? token : ''
			},
			method: methods,
			success(res) {
				if (message != "") {
					wx.hideLoading()
				}
				if (res.statusCode == 200) {
					resolve(res);
				} else {
					wx.showToast({
						title: '网络错误',
						icon: 'none'
					})
				}
			},
			fail: function(res) {
				if (message != "") {
					wx.hideLoading()
				}
				// fail()
				reject("系统异常，请重试！")
			}
		})
	})

}

function postLoading(url, params, message, success, fail, that, postType) {
  var tt = 0; // 默认0
  //tt = 0：不需要自定义code  1： 需要自定义code
  if (postType == 1) tt = 1;
  let sessionId = wx.getStorageSync("key");
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: config.imageUrlPrefix + url,
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'sessionId': sessionId,
      'plantDomain': config.testUrl
    },
    method: 'POST',
    success: function(res) {
      if (message != "") {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        if (tt == 0) {
          if (res.data.code == 200) {
            success(res)
          } else {
            if (res.data.code == 600) {
              success(res)
              // that.setData({
              //   isLogin: true
              // })
            } if(res.data.code == 601){
              success(res)
            } if (res.data.code == 203) {
              success(res)
            }if(res.data.code == 906){
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
            // else {
            //   wx.showToast({
            //     title: res.data.msg,
            //     icon: 'none'
            //   })
            // }
          }
        } else {
          if (res.data.code == 600) {
            that.setData({
              isLogin: true
            })
          } else {
            success(res)
          }
        }
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    },
    fail: function(res) {
      if (message != "") {
        wx.hideLoading()
      }
      fail()
    }
  })
}
function getUserProfile(that) {
  postLoading('/user/profile', {}, '', res => {}, fail => {}, this)
}
function timeFn(d1,d2) {//di作为一个变量传进来
  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
  var dateEnd = new Date(d2);//获取当前时间
  var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
  var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
  var hours=Math.floor(leave1/(3600*1000))//计算出小时数
  //计算相差分钟数
  var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
  var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
  //计算相差秒数
  var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
  var seconds=Math.round(leave3/1000)
  console.log(" 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
  console.log(dateDiff+"时间差的毫秒数",dayDiff+"计算出相差天数",leave1+"计算天数后剩余的毫秒数"
      ,hours+"计算出小时数",minutes+"计算相差分钟数",seconds+"计算相差秒数");
}

module.exports = {
  formatTime: formatTime,
  getUserInfoFunction: getUserInfoFunction,
  formatTime: formatTime,
  isError: isError,
  imgUrl: config.uploadUrl,
  imgSrc: config.imgSrc,
  imageMainUrl: config.imageMainUrl,
  testUrl: config.testUrl,
  interfaces: config.imageUrlPrefix,
  newFormatTime: newFormatTime,
  mergeDeep: mergeDeep,
  minFormatTime: minFormatTime,
  getUserProfile: getUserProfile,
  getPhoneNumber: getPhoneNumber,
  httpRequest: httpRequest,
  trim: trim,
  xieGangTime: xieGangTime,
  httpRequestWithPromise: httpRequestWithPromise,
  postLoading: postLoading,
  bMapTransQQMap: bMapTransQQMap,
  noDateTime: noDateTime,
  doWhatAfterLog:doWhatAfterLog,
  httpToHttps:httpToHttps,
  timeFn:timeFn
}
