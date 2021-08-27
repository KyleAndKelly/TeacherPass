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
    if(appInstance.loginStatus ==false){
      let that=this;
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
          let openid
          wx.cloud.callFunction({
            name:'openid',
            complete:res=>{
              console.log(res)
              appInstance.globalData.openid=res.result.openid
              openid=res.result.openid
              console.log(appInstance.globalData.openid)
            }
          })
          const db=wx.cloud.database()
          db.collection('CollectionTitle').where({
            openid: openid
          }).get({
            success:function(res){
              console.log(res)
            }
          })
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
