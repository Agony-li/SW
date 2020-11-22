//index.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';


//获取应用实例
const app = getApp()

Page({
	data: {
		SessionKey: '',
		OpenId: '',
		nickName: null,
		avatarUrl: null,
		rUrl: '/pages/index/index',
		rType: 1,//1reLauch,2back,3tab
		isCanUse: wx.getStorageSync('isCanUse') || true, //默认为true,
		isPhoneGet: wx.getStorageSync('isPhoneGet') || true
	},
	onLoad: function (options) {//默认加载
		if (options && options.rurl && options.rurl != '') {
			this.setData({
				rUrl: options.rurl
			})
		}
		if (options && options.rt && options.rt != '') {
			this.setData({
				rType: options.rt
			})
		}
		let userInfo = wx.getStorageSync('info');
		if (!userInfo || userInfo == '') {
			this.setData({isPhoneGet: true});
		} else if (!userInfo.phone || userInfo.phone == '') {
			this.setData({isPhoneGet: false});
		} else {
			this.updateUserInfo();
		}
	},
	getPhoneNumber(e) {
		let that = this;
		//console.log(e);
		if(e.detail.errMsg=="getPhoneNumber:fail user deny"){       //用户决绝授权  
		
			//拒绝授权后弹出一些提示
			wx.showModal({
			  title: '提示',
			  content: '为了更好服务您，请您授权！',
			  showCancel: false
			});

		}else{      //允许授权  
			//console.log(e.detail);
			wx.showLoading({
				title: '登录中...'
			});
			//{errMsg: "getPhoneNumber:ok", encryptedData: "F0roGuowOqiE3LBYIcc1kcdCwOeXYxxJhit3LDJX187iZeO/Z/…1KBaM14aPclWGMZWfrA/WyLWFiIBKSBSjUgAPuaj7ERjcvg==", iv: "KIff/2K5P+M5K3r2CDZrgg=="}
			
			//(@LoginUser String userId, @PathVariable String appid, String sessionKey, String signature,
            // String rawData, String encryptedData, String iv, String userCode, HttpServletRequest request)
			let userInfo = wx.getStorageSync('info');
			let sessionKey = wx.getStorageSync('sessionKey');
			//console.log(userInfo);
			//let pc = new WXBizDataCrypt(config.appid,userInfo.sessionKey);
			//let dt = pc.decryptData(e.detail.encryptedData , e.detail.iv); 
			wx.request({
				url: config.appUrl+'/wx/user/'+config.appid+'/bphone',
				data: {
					userId: userInfo.id,
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
					sessionKey: sessionKey
				},
				success: function (suc) {
					//console.log(suc)
					if(suc.statusCode === 200){
						//console.log(suc.data)
						try {
							userInfo.phone = suc.data.phone;
							wx.setStorageSync('info', userInfo);
							
							that.gotoIndex();
						} catch (e) {
				  
						}
					}else{
						wx.showToast({
						  title: '登录失败',
						})
					}					    
				}
			});
			
		}
		
		//console.log(e);
		
	},
	
	//第一授权获取用户信息===》按钮触发
	wxGetUserInfo(e) {
		let that = this;
		let userInfo = e.detail.userInfo == null ? e.detail.detail.userInfo: e.detail.userInfo;
		//console.log(userInfo)
		if(!userInfo) return;
		wx.login({
			success: sult => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				console.log(sult)
				if (sult.code) {
					if (sult.code) {
						//发起网络请求
						//console.log(config.appUrl+'wx/user/'+config.appid+'/login')
						wx.request({
							url: config.appUrl+'/wx/user/'+config.appid+'/login',
							data: {
								code: sult.code,
								avatarUrl: userInfo.avatarUrl,
								nickName: userInfo.nickName,
								gender: userInfo.gender
							},
							success: function (suc) {
								//console.log(suc)
								if(suc.statusCode === 200){
									//console.log(suc.data)
									try {
										wx.setStorageSync('key', suc.data.token);
										wx.setStorageSync('info', suc.data.userInfo);
										wx.setStorageSync('oid', suc.data.userInfo.id);
										wx.setStorageSync('sessionKey',suc.data.sessionKey);
										if (!suc.data.userInfo.mobile || suc.data.userInfo.mobile == '') {
											that.setData({
												isPhoneGet: false
											});
										} else {
											that.gotoIndex();
										}
										
										//that.setData({
										//	loginState: false
										//})
									} catch (e) {
							  
									}
								}else{
									wx.showToast({
									  title: '登录失败',
									})
								}					    
							}
					  })
					} else {
						console.log('登录失败！')
					}
				}
			}
		})		
	},
	
	async gotoIndex() {		
		if (this.data.rType == '1') {
			wx.reLaunch({url: this.data.rUrl});
		} else if (this.data.rType == '2') {
			//wx.navigation
			wx.navigateBack();
		} else if (this.data.rType == '3') {
			//wx.navigation
			wx.switchTab({url: this.data.rUrl});
		} else {
			wx.reLaunch({url: '/pages/index/index'});
		}
		
	},
	
	async updateUserInfo() {
		//{appid}/loginup
		let url = '/wx/user/' + config.appid + '/uptoken';
		let params = {"oid": wx.getStorageSync('oid')};
		let res = await util.httpRequestWithPromise(url,'GET',params);
		//console.log(res);
		if (res.data.message == "200") {
			wx.setStorageSync('key', res.data.token);
		}
		
		this.gotoIndex();
	}
});
	