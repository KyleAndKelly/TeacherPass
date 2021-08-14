// pages/home/home.js
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据s
   */
  data: {
    subject: [],
    index: 0
  },


  onLoad: function (options) {
    var db = wx.cloud.database()
    db.collection("SubjectData").get(
    ).then(res =>{
      var tmpArray = []
      for(var i=0;i<res.data.length;i++){
        console.log("debug: res.data[i].subject",res.data[i].subject)
        tmpArray.push(res.data[i].subject)
      }
      console.log("debug: tmpArray",tmpArray)
      this.setData({
        subject:tmpArray
      })
    })


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
          //参数就在e里面，设置一个变量来得到参数。
      const subjectIndex =e.currentTarget.dataset.index
      console.log("subjectIndex ",this.data.subjectIndex)
      //执行跳转的js
      wx.navigateTo({
      //拼接参数到要跳转的页面"
        url: `/pages/index/index?subjectId=`+subjectIndex+"&questionId="+0
      })

    }

  },

})



