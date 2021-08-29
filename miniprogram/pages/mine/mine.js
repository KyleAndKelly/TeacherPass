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
          wx.cloud.callFunction({
            name:'getFolder',
            success:function(res){
              console.log('callFunction test result:',res)
              if(res.result.data[0]==null){
                appInstance.globalData.folders=[
                  { title:'熟练掌握',
                    renaming:false,
                    nameStatus:'重命名',
                   items:[]
                  }, 
                  {
                    title: '差强人意',
                    renaming:false,
                    nameStatus:'重命名',
                    items: []
                  }, {
                    title: '需要练习',
                    renaming:false,
                    nameStatus:'重命名',
                    items: []
                  }
                ]
              }else{
                let hashmap=appInstance.globalData.hashmap
                appInstance.globalData.folders=res.result.data[0].folders
                let folders=res.result.data[0].folders
                for (var i=0;i<folders.length;i++){
                  for(let j=0;j<folders[i].items.length;j++){
                    let key=folders[i].title+folders[i].items[j].subjectId+folders[i].items[j].questionId
                    hashmap[key]=true
                  }
                }
              }
            },fail:function(res){
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
    if(appInstance.loginStatus == false){
      wx.showToast({
        title: '还没有登录，不能使用哦”',
        icon: 'none',
        duration: 2000//持续的时间

      })
    }else{
      wx.navigateTo({
        //拼接参数到要跳转的页面"
          url: `/pages/collection/collection`
        })
    }
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
