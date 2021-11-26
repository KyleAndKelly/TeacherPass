// pages/mine/mine.js
var appInstance = getApp()
Page({


  data: {
    profileImageUrl : "../../common/images/login.png",
    nickName: "未登录",
    minePage_openid:'',
    recordingListData: []

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
          //获取openid

          wx.cloud.callFunction({
            name: 'getOpenid',
            success: res => {
              console.log(' openid: ', res.result.openid)
              console.log(' appid: ', res.result.appid)
             that.minePage_openid = res.result.openid
             appInstance.globalData.openid = that.minePage_openid
             console.log("debug:   that.minePage_openid: ", that.minePage_openid )
             console.log("debug:   appInstance.globalData.openid: ",  appInstance.globalData.openid )
            }
          })

          that.setData({
            profileImageUrl:res.userInfo.avatarUrl,
            nickName:res.userInfo.nickName,
          }),
          //设置登录标志位
          appInstance.loginStatus = true
          console.log("debug:loginStatus ",appInstance.loginStatus)
          
          //弹出加载收藏数据的窗口
          wx.showLoading({
            title: '加载收藏数据中',
          })
          
          setTimeout(function () {
            wx.hideLoading({
              success: (res) => {
                wx.showToast({
                  title: '加载成功',
                  duration:800
                })
              },
            })
          }, 2000)

          //利用云函数getFolder 加载收藏数据
          wx.cloud.callFunction({
            name:'getFolder',
            success:function(res){
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


          //读取录音记录数据
         
          var db  = wx.cloud.database()
          db.collection("RecordingData").get().then(res =>{
            var tmpArray = []
            for(var i = 0; i<res.data.length;i++){
              tmpArray.push(res.data[i])
            }
            that.recordingListData = tmpArray
            appInstance.globalData.recordingListData = tmpArray
            console.log("debug: recordingListData tmpArray",tmpArray)
            console.log("debug: recordingListData ",that.recordingListData)
            console.log("debug:  appInstance.globalData.recordingListData  ", appInstance.globalData.recordingListData )

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
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中',
    })
    wx.showNavigationBarLoading({
     
    })
    setTimeout(function () {
      wx.hideLoading({
        success: (res) => {wx.showToast({
          title: '刷新成功',
          duration:700
        })},
      }),
      wx.hideNavigationBarLoading({
        success: (res) => {},
      })
    }, 600)
  },




  getOpenid:function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: res => {
        console.log('openid: ', res.result.openid)
        console.log('appid: ', res.result.appid)
        return  res.result.openid

      }
    })
  },

})
