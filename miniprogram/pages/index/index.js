// index.js
// 获取应用实例

var app = getApp().globalData


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
  

    this.setData({
      subjectIndex : Number(query.subjectId),
      questionIndex :Number(query.questionId),
      
    })
    console.log("debug: this.data.subjectIndex ", this.data.subjectIndex)
    console.log("debug: this.data.questionIndex ",this.data.questionIndex)
    
    


    var db = wx.cloud.database()
    db.collection("QuestionData").where({
      subjectId : Number(this.data.subjectIndex),
    }).get().then(res =>{
       console.log("debug: res.data ", res.data)
      this.setData({
        QuestionDataArray:res.data,
      })

      console.log("debug: this.data.questionIndex ", this.data.questionIndex)
      this.setData({
        title : this.data.QuestionDataArray[this.data.questionIndex].title,
        answer : this.data.QuestionDataArray[this.data.questionIndex].answer
      })

      console.log("debug: QuestionDataArray ", this.data.QuestionDataArray)
      })


    // var db = wx.cloud.database()
    // db.collection("QuestionData").where({
    //   // subjectId : Number(this.data.subjectIndex),
    //   // questionId : Number(this.data.questionIndex)
    //   subjectId : Number(this.data.subjectIndex),
    //   questionId : Number(this.data.questionIndex),
    // }).get().then(res =>{
    //    console.log("debug: res.data ", res.data)
    //   this.setData({
    //     title : res.data[0].title,
    //     answer : res.data[0].answer
    //   })
    //   })


 

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
    // var url = "../../common/images/"
    // var status = this.data.collectStatus
    // if(status == false){
    //   this.setData({
    //     collectImage :url+ "collect_s.png",
    //     collectStatus:true
    //   })

    //   wx.showToast({
    //     title: '已收藏',
    //     icon: 'success',
    //     duration: 2000//持续的时间
   
    //   })

    //   console.log("debug:collectStatus",this.data.collectStatus)
    // }else{
    //   this.setData({
    //     collectImage :url+ "collect.png",
    //     collectStatus:false
    //   })

    //   wx.showToast({
    //     title: '取消收藏',
    //     icon: 'none',
    //     duration: 2000//持续的时间
        
    //   })
    //   console.log("debug:collectStatus",this.data.collectStatus)
    // }


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
          title : this.data.QuestionDataArray[this.data.questionIndex].title,
          answer : this.data.QuestionDataArray[this.data.questionIndex].answer
        })



      console.log("debug:isShowCounting",this.data.isShowCounting)
      console.log("debug:changePageStatus",this.data.changePageStatus)

    }


       
   
    
  },

  nextQuestion:function(e){
    
    if(this.data.questionIndex >= this.data.QuestionDataArray.length - 1 ){
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
        title : this.data.QuestionDataArray[this.data.questionIndex].title,
        answer : this.data.QuestionDataArray[this.data.questionIndex].answer
      })



      console.log("debug:isShowCounting",this.data.isShowCounting)
      console.log("debug:changePageStatus",this.data.changePageStatus)
    }
    
  },

  showList:function(e){
        //参数就在e里面，设置一个变量来得到参数。
        const subjIndex = this.data.subjectIndex
        const questionNum = this.data.QuestionDataArray.length
        console.log("debug:subjIndex ",subjIndex)
        //执行跳转的js
        wx.navigateTo({
        //拼接参数到要跳转的页面
          url: `/pages/list/list?subjIndex=`+subjIndex+`&questionNum=`+questionNum
        })

  },
})





  