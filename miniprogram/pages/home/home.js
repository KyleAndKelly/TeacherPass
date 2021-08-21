// pages/home/home.js
// 导入util.js文件
const utilApi = require('../../utils/util.js')

var appInstance = getApp()

Page({

  /**
   * 页面的初始数据s
   */




  data: {
    subject: [],
    QuestionData1 : [],
    QuestionData２ : [],
    index: 0,
    
  },



  onLoad:  function (options) {
    var that = this
    var db  = wx.cloud.database()
    //从数据库获取SubjectData集合数据放到subject[]
    db.collection("SubjectData").get().then(res =>{
      var tmpArray = []
      for(var i=0;i<res.data.length;i++){
        console.log("debug: res.data[i].subject",res.data[i].subject)
        tmpArray.push(res.data[i].subject)
      }
      console.log("debug: tmpArray",tmpArray)
      that.setData({
        subject:tmpArray
      })
    })

    //从数据库获取QuestionData集合数据放到QuestionDataArray[]
        //从数据库读取数据
    //这里用async await 获取一下 集合中记录的总数 
    // const c = db.collection("QuestionData"); //获取集合中记录的总数
    // const total = await (await c.count()).total
    // const batchTimes = Math.ceil(total / 20)
    // console.log(batchTimes) //计算需要获取几次  比如你有36条数据就要获取两次 第一次20条第二次16条

    let tmpArray1 = []
    let tmpArray2 = []
    let tmpArrayData = []
    //这是一个标识每次循环就+1 当x等于batchTimes 说明已经到了最后一次获取数据的时候
    let x = 0 
    for (let i = 0; i < 16; i++) {
    //分组获取
      that.dbGetPromise("QuestionData",i*20).
      then(res=>{
        x += 1
        console.log("debug:res " ,res)
     // 20个20个的获取 最后一次不够20 那就是剩下的
      for (let j = 0; j < res.length; j++) {
      
       if(res[j].subjectId == Number(0)){
         console.log("debug: 进入if 赋值 ")
         tmpArray1.push(res[j])
        
       }else{
         console.log("debug: 进入else 赋值 ")
         tmpArray2.push(res[j])
        
       }
     }

     //判断是否是最后一次，如果是说明已经不用再继续获取了，这时候就可以赋值了
     if (x == 16) {

       tmpArray1.sort(that.up)
       tmpArray2.sort(that.up)
       console.log("debug:tmpArray1 ",tmpArray1)
       console.log("debug:tmpArray2 ",tmpArray2)
       tmpArrayData.push(tmpArray1)
       tmpArrayData.push(tmpArray2)
       appInstance.QuestionDataArray = tmpArrayData
     }
   })

    }

    
    console.log("debug:QuestionDataArray ",appInstance.QuestionDataArray)
    console.log("debug:loginStatus ",appInstance.loginStatus)
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

  gotoPage:function(e){
    console.log("appInstance.loginStatus",appInstance.loginStatus)
    if(appInstance.loginStatus == false){
      wx.showToast({
        title: '还没有登录，不能使用哦”',
        icon: 'none',
        duration: 2000//持续的时间
   
      })
    }else{
       
      const subjectIndex =e.currentTarget.dataset.index
      console.log("subjectIndex ",this.data.subjectIndex)
      //执行跳转的js
      wx.navigateTo({
      //拼接参数到要跳转的页面"
        url: `/pages/index/index?subjectId=`+subjectIndex+"&questionId="+0
      })

    }

  },
//按照升序排列
 up:function(x,y){
  return x.questionId-y.questionId
},

  
dbGetPromise(collectionName,skipNum){  //对数据库读取API同步化
  var db = wx.cloud.database()
  return new Promise(function(resolve,reject){ //异步操作接收购物车表数据
       db.collection(collectionName).skip(skipNum).get({
      success:res=>{
        console.log("读取成功")
       let result=res.data 
       console.log("debug: result",result)
       resolve(result);
      },
      fail:()=>{
        reject("获取失败！")
      }
    })
  })
},





})




