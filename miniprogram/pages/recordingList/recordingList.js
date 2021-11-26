const app = getApp()

Page({


  data: {
    post: "/common/images/sound.png",
    soundList : [],
    subjectIndex:0,
    questionIndex:0,
    curQuestion:"",
    testArr:[1,2,3,4]
    
    
  },

  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },


  
  onLoad: function(query){
      let that = this
    //读取数据库中对应subject和question数据到本地
      const db=wx.cloud.database({
        env : "test-5ga1gsyad0e2c798"
      })

      this.subjectIndex = Number(query.subjIndex),
      this.questinonIndex = Number(query.quesIndex),
      console.log("debug  query" ,query)
      console.log("debug openid: ", app.globalData.openid)
      console.log("debug subjectIndex:  " ,this.subjectIndex)
      console.log("debug quesitonIndex: ", this.questinonIndex)
      console.log("debug app.globalData.recordingListData ",app.globalData.recordingListData)
    //   //不能通过app.globalData.recordingListData赋值得到soundList
    //   //因为app.globalData.recordingListData只是一开始从数据库中得到
    //   //实时录制的录音不能在app.globalData.recordingListData中得到更新
      
      // db.collection("RecordingData").get().then(res =>{
      //   var tmpArray = []
      //   console.log("debug res.data.length ",res.data.length)
      //   for(var i = 0; i<res.data.length;i++){
      //     tmpArray.push(res.data[i])
      //   }
      //   that.recordingListData = tmpArray
      //   app.globalData.recordingListData = tmpArray
      // })
      console.log("debug app.globalData.recordingListData  ",app.globalData.recordingListData)
      let tmpArr =[]
      for (var i=0;i<app.globalData.recordingListData.length; i++)
      {
        if(app.globalData.recordingListData[i].questionId==this.questinonIndex &&
          app.globalData.recordingListData[i].subjectId==this.subjectIndex )
          {
            tmpArr.push( app.globalData.recordingListData[i])

          }
      
      }
      console.log("debug tmpArr ",tmpArr)
      that.setData({
        soundList:tmpArr,
      curQuestion : app.QuestionDataArray[query.subjIndex][query.quesIndex].title
    })
      //    //读取RecordingList数据库数据
      //    var openidx = app.globalData.openid
      //    var subjectidx = this.subjectIndex
      //    var quesitonIdx = this.quesitonIndex
      // this.getRecordingData()  
      console.log("debug soundList ",that.soundList)
      console.log("debug curQuestion ",that.curQuestion)
    },





  onReady:function(){
  },
 







  getRecordingData:async function(){
    const db=wx.cloud.database({
      env : "test-5ga1gsyad0e2c798"
    })
    // console.log("debug openidx ",openidx)
    // console.log("debug subjectIdx ",subjectIdx)
    // console.log("debug questionIdx ",questionIdx)
    try {
      const res = await db.collection("RecordingData").where({
        openid:app.globalData.openid,
        subjectId:this.subjectIndex,
        questionId:this.quesitonIndex
      }).get().then(res=>{
        console.log("debug res",res)
      this.setData({
        soundList:res.data
      })
      return 0;
      })
    } catch (e) {
      console.log("读取RecordingData失败", e);
      return -1;
    }
  },
   sleep:function(numberMillis) { 
    var now = new Date(); 
    var exitTime = now.getTime() + numberMillis; 
    while (true) { 
    now = new Date(); 
    if (now.getTime() > exitTime) 
    return; 
    } 
  }

})