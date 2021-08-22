// pages/mine/mine.js
var appInstance = getApp()
Page({


  data: {
    profileImageUrl : "../../common/images/login.png",
    nickName: "未登录"
    
  },

  
  onLoad: function (options) {

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

  login:function(){
    var that = this
    if(appInstance.loginStatus ==false){
      wx.getUserProfile({
        desc:"授权登录",
        success(res){
          console.log("授权成功",res),
          that.setData({
            profileImageUrl:res.userInfo.avatarUrl,
            nickName:res.userInfo.nickName,
           
          }),
          appInstance.loginStatus = true
          console.log("debug:loginStatus ",appInstance.loginStatus)
        },
        fail(res){
          console.log("授权失败",res)
        }
      })
      
    }
   

  },


  collection:function(){
  
      wx.navigateTo({
        //拼接参数到要跳转的页面"
          url: `/pages/collection/collection`
        })
  },

  aboutMe:function(){
    //执行跳转的js
    wx.navigateTo({
      //拼接参数到要跳转的页面"
        url: `/pages/aboutme/aboutme`
      })
  },

  sharePage:function(){
    wx.showToast({
      title: '点击右上角，转发给朋友们吧~',
      icon: 'none',
      duration: 4000//持续的时间
 
    })
  },

  joinGroup:function(){
    wx.navigateTo({
      //拼接参数到要跳转的页面"
        url: `/pages/joingroup/joingroup`
      })
  },

  cheats:function(){
        //执行跳转的js
    wx.navigateTo({
      //拼接参数到要跳转的页面"
        url: `/pages/cheats/cheats`
      })
  }

})
