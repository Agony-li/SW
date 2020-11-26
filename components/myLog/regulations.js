import util from '../../utils/util.js';
import regeneratorRuntime from '../../common/regenerator-runtime/runtime';
import config from '../../utils/dev.config.js';
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()

Page({
  data: {
  },
  onLoad: function (option) {
    let content = '<!--HTML--><p style="text-align: center; font-family: Calibri; font-size: 14px; white-space: normal; text-indent: 2em;"><strong><span style="font-family: 宋体;font-size: 19px"><span style="font-family:宋体">日志管理规定</span></span></strong></p><p style="font-family: Calibri; font-size: 14px; white-space: normal; text-align: center;"><strong><span style="font-family: 宋体;font-size: 19px">&nbsp;</span></strong></p><p style="font-family: Calibri; font-size: 14px; white-space: normal; text-align: left; text-indent: 2em;"><strong><span style="font-family: 宋体;font-size: 19px"><span style="font-family:宋体">日志的主要功能和要求如下：</span></span></strong></p><p style="text-align: left; font-family: Calibri; font-size: 14px; white-space: normal; text-indent: 2em;"><span style="font-family: 宋体;font-size: 19px">1、睡眠是一种意识状态，除了客观的测量，主观感受也非常重要。由于普通手环仅采用体动和脉搏两个指标作为睡眠监测依据，而专业的睡眠监测还有呼吸、心电、脑电、肌电等指标，故手环测量存在一定的测量偏差。另一方面，由于心理因素的存在，睡眠的主观感受与实际状况也存在一定偏差，因此我们需要将客观和主观两个因素结合起来，使用户对睡眠状态有一个更加准确的判断。</span></p><p style="text-align: left; font-family: Calibri; font-size: 14px; white-space: normal; text-indent: 2em;"><span style="font-family: 宋体;font-size: 19px">2、列明计划是一种心理疗愈手段，可以固化飘逸的思绪，有助于消除焦虑状态，也有助于合理安排生活日程和工作事项，减少由于计划拖延带来的压力。</span></p><p style="text-align: left; font-family: Calibri; font-size: 14px; white-space: normal; text-indent: 2em;"><span style="font-family: 宋体;font-size: 19px">3、常怀喜悦和感恩之心也是一种很好的疗愈方式。医学和心理学证明，正面情绪可以从生理和心理两方面促进身心健康，在人体体验正面情绪的同时，身体会分泌一系列有益的神经递质和有益物质，修复身心，并建立积极的心理模式。</span></p><p style="text-align: left; font-family: Calibri; font-size: 14px; white-space: normal; text-indent: 2em;"><span style="font-family: 宋体;font-size: 19px">4、记录自己的担心、难过等负面情绪也是一种的心理疗愈，可以有效的舒缓精神压力。</span></p><p style="text-align: left; font-family: Calibri; font-size: 14px; white-space: normal; text-indent: 2em;"><span style="font-family: 宋体;font-size: 19px">&nbsp;5、日志的填写没有严格要求，客户只需根据自身情况填写内容即可。</span></p><p><br style="text-align: left; text-indent: 2em;"/></p>';
    WxParse.wxParse('article', 'html', content, this, 10);

  },

})