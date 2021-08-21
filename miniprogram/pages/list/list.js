// pages/list/list.js
Page({

  data: {
    subjectIndex:0,
    questinonNum :0,
    QuestionArrayForLoop :[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    console.log("debug：query.id",query.id)
    this.setData({
      subjectIndex : Number(query.subjIndex),
      questinonNum : Number(query.questionNum),
      
    })
    
    console.log("debug:subjIndex " ,this.data.subjIndex,)
    console.log("debug:questionNum " ,this.data.questionNum,)
    var tmpArray = new Array(this.data.questinonNum).fill('1') 
    console.log("debug：tmpArray",tmpArray)

    this.setData({
      QuestionArrayForLoop : tmpArray,
    })
    console.log("debug：subjectIndex",this.data.subjectIndex)
    console.log("debug：questinonNum",this.data.questinonNum)
    console.log("debug：QuestionArrayForLoop length ",this.data.QuestionArrayForLoop.length)
    console.log("debug：QuestionArrayForLoop ",this.data.QuestionArrayForLoop)


  },


  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  chooseQuestion:function(e){
      const questionIndex =e.currentTarget.dataset.index;
      console.log("debug：e.currentTarget.dataset.index",e.currentTarget.dataset.index)
      console.log("debug：questionIndex",questionIndex)
      console.log("this.data.subjectIndex",this.data.subjectIndex)
      //执行跳转的js
      wx.navigateTo({
        //拼接参数到要跳转的页面
        url: `/pages/index/index?subjectId=`+Number(this.data.subjectIndex)+`&questionId=`+Number(questionIndex)
      })
    
  }
})




