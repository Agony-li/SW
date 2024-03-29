// pages/audio/audio.js
const bgAudioManager = wx.getBackgroundAudioManager()
Component({

  /**
   * 组件对外的属性
   */
  properties: {
    bgAudio: {
      type: Object,
      value: ''
    }, // 音频属性
    train: {
      type: Number,
      value: 0
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 音频信息
     */
    // bgAudio: {
    //   src: 'https://music.163.com/song/media/outer/url?id=32526653.mp3', // 音频链接
    //   title: '冰与火之歌', // 标题
    //   singer: 'Ramin Djawadi' // 作者
    // }, // 音频属性
    max: 0, // 后台返回的音频时长 s
    interval: '',
    isPlay: 0, // 播放状态 0:未播放 1:已播放
    duration: '00:00', // 时长 s(秒) 
    value: 0, // 当前时间
  },

  // 组件生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function(){
    // 监听音频自然播放至结束的事件
    bgAudioManager.onEnded(() => {
      console.log('音频自然播放结束');
      this.setData({
        value: 0,
        duration: '00:00'
      })
      this.triggerEvent('endAutoPlay')
    })
    wx.getBackgroundAudioManager()
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
      success: (res)=>{
        console.log(res);
      },
      fail: (err)=>{
        console.log(err);
      },
    })

    // 音频播放事件
    bgAudioManager.onPlay(() => {
      console.log('播放音频事件')
      this.setData({
        isPlay: 1,
      })
    })
    // 音频暂停事件
    bgAudioManager.onPause(() => {
      console.log('暂停音频事件')
      this.setData({
        isPlay: 0,
      })
    })
    // 音频错误事件
    bgAudioManager.onError(res => {
      console.log('音频错误事件', res);
    })
    
    // 监听背景音乐播放进度更新事件
    // bgAudioManager.onTimeUpdate(() => {
    //   if(this.data.max == ''){
    //     this.setData({
    //       max: bgAudioManager.duration
    //     })
    //   }
    // })
  },
  moved: function(){},
  detached: function(){},

  methods: {
    // 初始化数据
    init(that) {
      var interval = ""
      that.clearTimeInterval(that)
      that.setData({
        interval: interval,
        isPlay: 0
      })
    },
    /**
     * 清除interval
     * @param that
     */
    clearTimeInterval: function (that) {
      var interval = that.data.interval;
      clearInterval(interval)
    },
    /**
     * 重新倒计时
     */
    restartTap: function () {
      var that = this;
      that.init(that);
      console.log("倒计时重新开始")
      that.startTap()
    },
    /**
     * 暂停倒计时
     */
    stopTap: function () {
      var that = this;
      console.log("倒计时暂停")
      that.clearTimeInterval(that)
    },

    /**
     * 开始倒计时
     */
    startTap: function () {
      var that = this;
      that.init(that); //这步很重要，没有这步，重复点击会出现多个定时器
      // console.log("倒计时开始"+value)
      var interval = setInterval(function () {
        var value = that.data.value;
        value++;
        that.setData({
          max: that.data.bgAudio.len,
          value: value,
          duration: that.timesToMinutesAndTimes(that.data.bgAudio.len - value),
        })
        if (value >= that.data.bgAudio.len) { //归0时回到60
          console.log('初始化数据')
          that.setData({
            value: 0,
            isPlay: 0
          })
          that.init(that)
        }
      }, 1000)
      that.setData({
        interval: interval
      })
    },
    // 秒转换成 分:秒 (需要小时自己扩展)
    timesToMinutesAndTimes(duration){
      if (duration <= 0) {
        return '00:00'
      }
      let minutes = parseInt(duration/60) < 10 ? '0'+parseInt(duration/60): parseInt(duration/60)
      let second = parseInt(duration-parseInt(duration/60)*60) < 10 ? '0'+ parseInt(duration-parseInt(duration/60)*60) : parseInt(duration-parseInt(duration/60)*60)
      return minutes+":"+second
    },

    // 播放音频事件
    playAudio() {
      console.log('是否是训练: ',this.data.train);
      if(this.data.train == 1){ // 音频训练
        let logsMins = wx.getStorageSync('logstime').split(':')[0]*60+wx.getStorageSync('logstime').split(':')[1] // 开始作息时间
        let logeMins = wx.getStorageSync('logetime').split(':')[0]*60+wx.getStorageSync('logstime').split(':')[1] // 结束作息时间
        let nowMins = new Date().getHours()*60 + (new Date().getMinutes() +'')
        console.log(nowMins);
        if(logsMins < nowMins && nowMins< logeMins){
          bgAudioManager.src = this.data.bgAudio.src
          bgAudioManager.title = this.data.bgAudio.title
          bgAudioManager.singer = this.data.bgAudio.singer
          if(this.data.value == 0){
            bgAudioManager.play()
          }else{
            // bgAudioManager.seek(this.data.value)
            this.setData({
              duration: this.timesToMinutesAndTimes(this.data.bgAudio.len - this.data.value),
            })
          }
          // 开始倒计时
          this.data.isPlay == 0 ? this.startTap():''
        }else{
          // 调用父方法
          this.triggerEvent('noTimeDialog')
        }
      }else{
        bgAudioManager.src = this.data.bgAudio.src
        bgAudioManager.title = this.data.bgAudio.title
        bgAudioManager.singer = this.data.bgAudio.singer
        if(this.data.value == 0){
          bgAudioManager.play()
        }else{
          // bgAudioManager.seek(this.data.value)
          this.setData({
            duration: this.timesToMinutesAndTimes(this.data.bgAudio.len - this.data.value),
          })
        }
        // 开始倒计时
        this.data.isPlay == 0 ? this.startTap():''
      }
    },

    // 暂停音频事件
    playPause() {
      bgAudioManager.pause()
      // 暂停倒计时
      this.data.isPlay == 1 ? this.stopTap():''
    },

    // 拖动进度条
    changeSlider(e){
      let that = this
      let value = e.detail.value
      // bgAudioManager.seek(value)
      that.setData({
        value: value,
        duration: that.timesToMinutesAndTimes(that.data.bgAudio.len - value),
      })
    },

    // 卸载页面方法
    onUnloadAudio(){
      var that = this;
      that.clearTimeInterval(that)
    }
  
  },

})