//index.js
import util from '../../utils/util.js';
import config from '../../utils/dev.config.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
//获取应用实例
const app = getApp()

Page({
  data: {
    totalTime:0,
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    audioAction: {
        method: 'play'
      },
      currentTime:'00:00',
      audioValue:0,
      hidden: true,
      week: 0,
    contentList:[
      {name:'心理建设基础课程',icon:'../../image/cbti_icon_2@2x.png', code:'0005001'},
      {name:'心理疗愈课程',icon:'../../image/cbti_icon_2@2x.png',code:'0005002'},
      {name:'积极心理学课程',icon:'../../image/cbti_icon_2@2x.png',code:'0005003'},
      {name:'心理学工具课程',icon:'../../image/cbti_icon_2@2x.png',code:'0005004'}
    ],
},
  onReady: function (e) {
  },
  onLoad: function () {
  },
  onShow(){
  },
  async goToList(option){

      wx.navigateTo({
        url: '../../components/xinli/list?id=' + option.currentTarget.dataset.type
      })
  },
})
