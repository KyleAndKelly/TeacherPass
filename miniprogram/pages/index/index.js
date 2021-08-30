// index.js
// 获取应用实例

const app = getApp()

Page({
  data: {
    optionList:[{title:'cs',star :true}],
    value:'所有',
    hideFlag: true,//true-隐藏  false-显示
    animationData: {},//
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
        subjectIndex:subjectId
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
        optionList:options
      })

      this.setData({
        title : app.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].title,
        answer : app.QuestionDataArray[this.data.subjectIndex][this.data.questionIndex].answer
      })
      console.log("debug:isShowCounting",this.data.isShowCounting)
      console.log("debug:changePageStatus",this.data.changePageStatus)
    }
    
  },

  showList:function(e){
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
})





  