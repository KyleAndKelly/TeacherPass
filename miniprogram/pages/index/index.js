// index.js
// 获取应用实例

const appInstance = getApp()


Page({
  data: {
    isShowAnswer : "hidden",
    isShowCounting :"hidden",
    title:"",
    answer:"",
    questionIndex:Number(0),
    subjectIndex:Number(0),
    time:"180",
    collectImage :"/common/images/collect.png",
    listImage:"/common/images/list.png",
    collectStatus :false,
    changePageStatus:false,
    QuestionDataArray :[]
  },

  onLoad: function(query){
  
    let that = this  
    that.setData({
      subjectIndex : Number(query.subjectId),
      questionIndex :Number(query.questionId),
      
    })
    console.log("debug: this.data.subjectIndex ", that.data.subjectIndex)
    console.log("debug: this.data.questionIndex ",that.data.questionIndex)
    console.log("debug: appInstance.QuestionDataArray ",appInstance.QuestionDataArray)
    
      that.setData({
        title :appInstance.QuestionDataArray[query.subjectId][query.questionId].title,
        answer : appInstance.QuestionDataArray[query.subjectId][query.questionId].answer
      })          

  }, 

 
  setTimeCount:function(){
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
    

    
    console.log("debug:isShowCounting",this.data.isShowCounting)
    let time=this.data.time
    time--;
    if (time <= 0) {
    time = 0;
    }
    this.setData({
    time:time
    })

   
      setTimeout(this.setTimeCount,1000);
    
    


  
    },
  showAnswer:function(e){
    this.setData({
      isShowAnswer : "visible",
    })
    
  },
  collect:function(e){


    wx.showToast({
      title: '功能开发中，敬请期待',
      icon: 'none',
      duration: 2000//持续的时间
 
    })

  },

  prevQuestion:function(e){
  
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

      
      
      this.setData({
        changePageStatus:true,
        isShowAnswer:"hidden",
        isShowCounting :"hidden",
        time:180,
      })
      
        this.setData({
          title : appInstance.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].title,
          answer : appInstance.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].answer
        })



      console.log("debug:isShowCounting",this.data.isShowCounting)
      console.log("debug:changePageStatus",this.data.changePageStatus)

    }


       
   
    
  },

  nextQuestion:function(e){
    
    if(this.data.questionIndex >= appInstance.QuestionDataArray[this.data.subjectIndex].length - 1 ){
      console.log("进入了 if")
      wx.showToast({
        title: '已经是最后一个题了',
        icon: 'none',
        duration: 2000//持续的时间
   
      })
    }else{

      this.setData({
        questionIndex : this.data.questionIndex+1,
 
      })
      console.log("type of questionIndex",typeof(this.data.questionIndex))
      console.log("this.data.questionIndex",this.data.questionIndex)
    
      this.setData({
        changePageStatus:true,
        isShowAnswer:"hidden",
        isShowCounting :"hidden",
        time:180,
      })

      this.setData({
        title : appInstance.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].title,
        answer : appInstance.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].answer
      })



      console.log("debug:isShowCounting",this.data.isShowCounting)
      console.log("debug:changePageStatus",this.data.changePageStatus)
    }
    
  },

  showList:function(e){
        //参数就在e里面，设置一个变量来得到参数。
        const subjIndex = this.data.subjectIndex
        const questionNum = appInstance.QuestionDataArray[this.data.subjectIndex].length
        console.log("debug:subjIndex ",subjIndex)
        //执行跳转的js
        wx.navigateTo({
        //拼接参数到要跳转的页面
          url: `/pages/list/list?subjIndex=`+subjIndex+`&questionNum=`+questionNum
        })

  },
})





  