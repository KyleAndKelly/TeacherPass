// index.js
// 获取应用实例
// 获取应用实例
// 获取应用实例
const app = getApp()
var plugin=requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    optionList:[{title:'cs',star :true}],
    value:'所有',
    hideFlag: true,//true-隐藏  false-显示
    animationData: {},//
    isShowAnswer : false,
    isShowCounting :"hidden",
    timeCount:0,
    title:"",
    macOrStop:"/common/images/mac.jpg",
    answer:"",
    lang:"zh_CN",
    asr:"",
    seeOrHide:"看看答案",
    startOrStop:"开始作答",
    writing:false,
    isShowAsr:false,
    recording: false,
    questionIndex:Number(0),
    subjectIndex:Number(0),
    collectImage :"/common/images/collect.png",
    listImage:"/common/images/list.png",
    NextQuesImage:"/common/images/NextQues.png",
    PrevQuesImage:"/common/images/PrevQues.png",
    collectStatus :false,
    changePageStatus:false,
    QuestionDataArray :[],
    RecordText:"开始作答",
    // openid:'',
    //录音相关初始数据
    RecordingData:{
      recorderManager: wx.getRecorderManager(),
      curTime: 0,
      recorder: {
        status: 'ready', // 'ready' | 'recording'
        text: '点击录制',
      },
      timer: null,
      secondes: 0,
      startTimestamp: 0,
      isupload: false
    }

  },

  voiceInput(){
    var recording=this.data.recording
    recording=!recording
    console.log(recording)
    if(recording){
      manager.start({duration:60000, lang: this.data.lang})
      this.setData({
        recording:recording,
        macOrStop:"/common/images/stop.jpg",
        isShowAsr:false
      })
    }else{
      manager.stop()
      this.setData({
        recording:recording,
        macOrStop:"/common/images/mac.jpg",
        isShowAsr:true
      })
    }

    },

  // 点击选项
  getOption:function(e){
    console.log(e)
    var that = this;
    let hashmap=app.globalData.hashmap
    let index=e.currentTarget.dataset.index
    let option=this.data.optionList[index]
    var si=  this.data.subjectIndex,qi= this.data.questionIndex
    let items=app.globalData.folders[index].items
    let key=option.title+si+qi
    console.log(option)
    if(option.star==true){
      option.star=false
      hashmap[key]=false
      for(var i=0;i<items.length;i++){
                if(items[i].questionId==qi&&items[i].subjectId==si){
                  items.splice(i,1)
                  break
             }
      }
    }else{
      option.star=true
      hashmap[key]=true
      let title=this.data.title
      if(title.length>32){
       title=title.slice(0,32)+"..."
       }
      items.push({title:title,subjectId:si,questionId:qi})
    }

    that.setData({
      value:e.currentTarget.dataset.value,
      hideFlag: false,
      optionList:this.data.optionList
    })
    this.updateFolder()
  },
  updateFolder(){
    wx.cloud.callFunction({
      name:'updateFolder',
      data:{
        folders: app.globalData.folders
      },
      success:function(res){
        console.log('callFunction test result:',res)
      },fail:function(res){
        console.log(res)
      }
    })
  },
  //取消
  mCancel: function () {
    var that = this;
    that.hideModal();
  },
  onLoad: function(query){
    console.log(query)
    let that = this
    manager.onStop = function(res) {
      console.log("record file path", res.tempFilePath)
      console.log("result", res.result)
     that.setData({
        asr:res.result
      })
    }

    that.setData({
      subjectIndex : Number(query.subjectId),
      questionIndex :Number(query.questionId),
    })
    let subjectId=query.subjectId
    let questionId=query.questionId
    that.setData({
        title :app.QuestionDataArray[query.subjectId][query.questionId].title,
        answer : app.QuestionDataArray[query.subjectId][query.questionId].answer

      })   
    var options =[]
    for(var i=0;i<app.globalData.folders.length;i++){
      options.push({title:app.globalData.folders[i].title,star:false })
      let key=options[i].title+subjectId+questionId
      if(app.globalData.hashmap[key]==true){
        options[i].star=true
      }      
    }
    that.setData({
        optionList:options,
        questionIndex:questionId,
        subjectIndex:subjectId,
        // openid: app.globalData.openid
      }) 
  }, 



  setTimeCount:function(){
    this.voiceInput()
  let writing=this.data.writing
    if(writing){
      this.setData({
        startOrStop:'开始作答',
        writing:false,
        time:180
      })

    }
   else{
     this.data.writing=true
    this.timegoing()
this.setData({
  startOrStop:'停止作答',
  writing:true
})
   }
    if(this.data.changePageStatus ==true){
      this.setData({
        changePageStatus : false,
        // isShowCounting : "hidden",
      })
      return null;
    }
      this.setData({

        isShowCounting : "visible",
      })
    setTimeout(this.setTimeCount,1000);      
  },

  showAnswer:function(e){
    this.data.isShowAnswer=!this.data.isShowAnswer
    if(this.data.isShowAnswer){
       this.setData({
         seeOrHide:"隐藏答案",
         isShowAnswer:true
       })
    }else{
      this.setData({
        seeOrHide:"看看答案",
        isShowAnswer:false
      })
    }
  },

  collect:function(e){
    var that = this;
    that.setData({
      hideFlag: false
    })
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间
      timingFunction: 'ease',//动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    })
    this.animation = animation; //将animation变量赋值给当前动画
    var time1 = setTimeout(function () {
      that.slideIn();//调用动画--滑入
      clearTimeout(time1);
      time1 = null;
    }, 100)
  },


  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown();//调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 220)//先执行下滑动画，再隐藏模块

  },



  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },


  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  prevQuestion:function(e){

    if(this.data.RecordText == "停止作答"){

      this.setData({
        RecordText:"开始作答"
      })
      this.endRecord()
    }

    if(this.data.questionIndex <= 0){
      wx.showToast({
        title: '已经是第一个题了',
        icon: 'none',
        duration: 2000//持续的时间

      })
    }else{

      this.setData({
        questionIndex : Number(this.data.questionIndex)-1,

      })
      let options=this.data.optionList
      for(var i=0;i<app.globalData.folders.length;i++){
        let key=options[i].title+this.data.subjectIndex+this.data.questionIndex
        if(app.globalData.hashmap[key]==true){
          options[i].star=true
        }else{
          options[i].star=false
        }
      }
      this.setData({
        changePageStatus:true,
        isShowAnswer:"hidden",
        isShowCounting :"hidden",
        time:180,
        optionList:options
      })
        this.setData({
          title :app.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].title,
          answer : app.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].answer
        })
      console.log("debug:isShowCounting",this.data.isShowCounting)
      console.log("debug:changePageStatus",this.data.changePageStatus)
    }
  },
  nextQuestion:function(e){
    if(this.data.RecordText == "停止作答"){

      this.setData({
        RecordText:"开始作答"
      })
      this.endRecord()
    }
    if(this.data.questionIndex >= app.QuestionDataArray[this.data.subjectIndex].length - 1 ){


      wx.showToast({
        title: '已经是最后一个题了',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }else{

      this.setData({
        questionIndex : Number(this.data.questionIndex)+1,

      })
         let options=this.data.optionList
      for(var i=0;i<app.globalData.folders.length;i++){
        let key=options[i].title+this.data.subjectIndex+this.data.questionIndex
        if(app.globalData.hashmap[key]==true){
          options[i].star=true
        }else{
          options[i].star=false
        }
      }
      this.setData({
        changePageStatus:true,
        isShowAnswer:"hidden",
        isShowCounting :"hidden",
        time:180,
        optionList:options,
        writing:false
      })

      this.setData({
        title : app.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].title,
        answer : app.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].answer
      })
    }

  },

  showList:function(e){

      if(this.data.RecordText == "停止作答"){

        this.setData({
          RecordText:"开始作答"
        })
        this.endRecord()
      }
        //参数就在e里面，设置一个变量来得到参数。
        const subjIndex = this.data.subjectIndex
        const questionNum = app.QuestionDataArray[this.data.subjectIndex].length
        console.log("debug:subjIndex ",subjIndex)
        //执行跳转的js
        wx.navigateTo({
        //拼接参数到要跳转的页面
          url: `/pages/list/list?subjIndex=`+subjIndex+`&questionNum=`+questionNum
        })

  },



  startRecordingTest:function(){

    const recorderManager = wx.getRecorderManager()

    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })

    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })

    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }

    recorderManager.start(options)
  
    recorderManager.stop();  
 


    
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath } = res
    })
    
    },



  startRecording: function () {
    let { status } = this.data.RecordingData.recorder;
    
    console.log("debug : RecordText" , this.data.RecordingData.RecordText)
    console.log("debug: status : ", status)

    
    if (status === 'ready') {
        console.log("debug :  switch status ready to  recording")
        this.setData({ RecordText: '停止作答'})
         this.startRecod()
      } else if (status === 'recording') {
        console.log("debug :  switch status recording to  done")
        this.setData({ RecordText: '开始作答'})
         this.endRecord()
      }
    
  },


  startRecod:function() {
    //先进行授权 再开始录音
    let that = this;

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) { // 未授权
          wx.authorize({
            scope: 'scope.record',
            success () { // 一次才成功授权
              that._startRecord()
            },
            fail(err) {
              console.log(err)
              wx.showModal({
                title: '温馨提示',
                content: '您未授权录音，该功能将无法使用',
                showCancel: true,
                confirmText: "授权",
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (!res.authSetting['scope.record']) {
                          //未设置录音授权
                          wx.showModal({
                            title: '提示',
                            content: '您未授权录音，功能将无法使用',
                            showCancel: false,
                            success: function () {}
                          })
                        } else { // 二次才成功授权
                          that._startRecord()
                        }
                      },
                      fail: function () {
                        console.log("授权设置录音失败");
                      }
                    })
                  }
                },
                fail: function (err) {
                  console.log("打开录音弹框失败 => ", err);
                }
              })
            }
          })
        } else { // 已授权
          that._startRecord()
        }
      }
    })
  },


  _startRecord:function(){
    this.data.RecordingData.startTimestamp = Date.now();
    this.data.RecordingData.recorder.status = 'recording'

     
    this.data.RecordingData.recorder.curTime = 0; 
    this.data.timeCount = 0 ;
    const options = {
      duration: 200000,//指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
  
    //点击录制

    this.data.RecordingData.recorderManager.start(options);

    //开始录音计时
    this.countDown();

    this.data.RecordingData.recorderManager.onStart(() => {
      console.log('开始录音')
    })
    wx.showToast({
 
        title: '开始录音',
        icon: 'none',
        duration: 1000

    })
    //错误回调
    this.data.RecordingData.recorderManager.onError((res) => {
      console.log('录音失败', res);
    })
  },
 

  
  countDown:function(e) {
    this.data.RecordingData.timer = setInterval(() => {
        this.data.RecordingData.secondes++;
        if (this.data.RecordingData.secondes > 200) {
            clearInterval(this.data.RecordingData.timer);
            this.data.RecordingData.recorderManager.stop();
            //bug:无法进入OnStop回调函数 
            // this.data.RecordingData.recorderManager.onStop((res) => {
            //     console.log('时间已到，自动跳转')
            //     wx.showModal({
            //       title: '提示',
            //       content: '已经到最大时长，停止作答',
            //       success (res) {
            //         if (res.confirm) {
            //           console.log('用户点击确定')
            //         } else if (res.cancel) {
            //           console.log('用户点击取消')
            //         }
            //       }
            //     })
            //     let filePath = res.tempFilePath;
            //     let duration = 200000;
            //      this.uploadRecord(filePath, duration)
            //     this.setData({
            //       RecordText:'开始作答' 
            //     })
            //  })
            console.log('时间已到，自动跳转')
            wx.showModal({
              title: '提示',
              content: '已经到最大时长，停止作答',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            // let filePath = res.tempFilePath;
            // let duration = 200000;
            // this.uploadRecord(filePath, duration)
                this.setData({
                  RecordText:'开始作答' 
                })
            this.data.RecordingData.secondes = 0
            this.data.timeCount = 0

            // let filePath = res.tempFilePath;
            // let duration = 200000;
            // this.uploadRecord(filePath, duration)
            return;
        }
        this.setData({
            curTime : this.data.RecordingData.secondes,
            timeCount: this.data.RecordingData.secondes
        });
        console.log("debug: timeCount",this.data.timeCount)
    }, 1000);


  },


  


  endRecord:function(e) {


    console.log("debug: endRecord")
    this.data.RecordingData.recorder.status = 'ready';
    clearInterval(this.data.RecordingData.timer);
    this.data.RecordingData.RecordText = "开始作答"
    this.data.RecordingData.secondes = 0
    this.data.timeCount = 0
    this.data.RecordingData.recorderManager.stop();
    console.log("debug: endRecord stop()")


    // const options = {
    //   duration: 200,//指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
    //   sampleRate: 16000,//采样率
    //   numberOfChannels: 1,//录音通道数
    //   encodeBitRate: 96000,//编码码率
    //   format: 'mp3',//音频格式，有效值 aac/mp3
    //   frameSize: 50,//指定帧大小，单位 KB
    // }

    // this.data.RecordingData.recorderManager.start(options)

    // this.data.RecordingData.recorderManager.onStart(() => {
    // console.log('开始录音')
    // })



    this.data.RecordingData.recorderManager.onStop((res) => {

      console.log("debug: endRecord onStop()")
      console.log("debug: this.data.RecordingData.status " ,this.data.RecordingData.recorder.status)
      if(this.data.RecordingData.recorder.status == "recording"){
        return;
      }
  
      let filePath = res.tempFilePath;
      let duration = res.duration;
      console.log(" debug:Date.now() " , Date.now())
      console.log(" debug:startTimestamp " ,this.data.RecordingData.startTimestamp)
      if((Date.now() - this.data.RecordingData.startTimestamp) / 1000 < 60) {
        wx.showModal({
          title: '提示',
          content: '答题时间太短,不能小于60秒',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

        return;
      }
      console.log('开始上传录音')
      this.uploadRecord(filePath, duration)
    })




    //将按键文字改回原来的文字
    //时间清零
 
    console.log(" debug:Date.now() " , Date.now())
    console.log(" debug:startTimestamp " ,this.data.RecordingData.startTimestamp)
    console.log("debug : RecordText" , this.data.RecordingData.RecordText)
    console.log("debug:RecordingData.secondes :", this.data.RecordingData.secondes)
    console.log("debug:RecordingData.timeCount : ", this.data.timeCount)

  },

  uploadRecord:function(recordFilePath, duration){
    

    //注意在PC开发者工具上调试时 录的音无法播放
    //真机调试时录的音可以播放


    wx.showLoading({
      title: '正在上传录音中',
    })
    console.log("正在上传录音中...")
    let nowTime = this.getNowTime();
    let path = app.globalData.openid +'/'+Date.now()+'.mp3'
    let durationTime = duration / 1000 +' s'
    let subjectId = Number(this.data.subjectIndex)
    let questionId = Number(this.data.questionIndex)
    console.log("dbeug subjectId" ,subjectId)
    console.log("debug questionId ", questionId )

    wx.cloud.uploadFile({
      cloudPath: path,
      filePath: recordFilePath,
      success (res){
        console.log("录音上传成功！")
        console.log("debug: res" , res)

        //将录音记录插入 RecordingData 数据库
        const db=wx.cloud.database({
          env : "test-5ga1gsyad0e2c798"
        })
        db.collection('RecordingData').add({
          
          data: {
            openId:  app.globalData.openid,
            timeStamp: nowTime,
            duration: durationTime,
            filePath: "https://7465-test-5ga1gsyad0e2c798-1306885385.tcb.qcloud.la/"+path,
            subjectId:subjectId,
            questionId:questionId

          },
          success: function(res) {
            //把这组数据插入到 全局的recordingListData中
            var tmp ={
              
              openId:  app.globalData.openid,
              timeStamp: nowTime,
              duration: durationTime,
              filePath: "https://7465-test-5ga1gsyad0e2c798-1306885385.tcb.qcloud.la/"+path,
              subjectId:subjectId,
              questionId:questionId,
              
            }
            app.globalData.recordingListData.push(tmp)
            console.log("debug app.globalData.recordingListData ",app.globalData.recordingListData)
            console.log("debug tmp ",tmp)
            console.log("debug Insert recording success ",res)
          }
        }),

        setTimeout(function () {
          wx.hideLoading({
            success: (res) => {
            wx.showModal({
                title:"提示",
                content: '上传成功！点击[ 作答记录 ]查看录音',
                showCancel:false,
              
            })
            },
          })
        }, 2000)

      
      },
      fail(res){
        console.log("录音上传失败")
        console.log("debug: res" , res)
        setTimeout(function () {
          wx.hideLoading({
            success: (res) => {
            wx.showModal({
              title :'提示',
              content: '上传失败',
              showCancel:false,
              
            })
            },
          })
        }, 2000)


      }
    })

  },

 myAnswer:function(e){

  if(this.data.RecordText == "停止作答"){

    this.setData({
      RecordText:"开始作答"
    })
    this.endRecord()
  }
  
  //参数就在e里面，设置一个变量来得到参数。
  const subjIndex = this.data.subjectIndex
  const quesIndex = this.data.questionIndex
  //页面跳转
  wx.navigateTo({
      url: `/pages/recordingList/recordingList?subjIndex=`+subjIndex+`&quesIndex=`+quesIndex
    })
  },
 





 

 square:function(e){
   wx.showToast({
     title: ' 功能开发中！',
   })
 },
 getNowTime: function () {
  let dateTime
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1
  let dd = new Date().getDate()
  let hh = new Date().getHours()
  let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
    :
    new Date().getMinutes()
  let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
    :
    new Date().getSeconds()
  dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  console.log(dateTime)
  return dateTime
},

  onHide:function(){
    if(this.data.RecordText == "停止作答"){

      this.setData({
        RecordText:"开始作答"
      })
      this.endRecord()
    }

  },
  onUnload:function(){
    if(this.data.RecordText == "停止作答"){

      this.setData({
        RecordText:"开始作答"
      })
      this.endRecord()
    }

  }

})
manager.onRecognize = function(res) {
  console.log("current result", res.result)
}

manager.onStart = function(res) {
  console.log("成功开始录音识别", res)
}
manager.onError = function(res) {
  console.error("error msg", res.msg)
}





