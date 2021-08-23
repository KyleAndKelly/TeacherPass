//app.js
App({


  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env:"test-5ga1gsyad0e2c798",
        traceUser: true,
      })
    }
    

    wx.login({
      success (res) {
        console.log("debug:res.code: " ,res.code)
        if (res.code) {
      
        }else {
        console.log('登录失败！' + res.errMsg)
        }
      }
    })


  },

  globalData:{
    folders:[
      { title:'熟练掌握',
        renaming:false,
        nameStatus:'重命名',
       items:[{
         itemName:'模拟-题目5',
         subjectIndex:0,
         questionIndex:1
       }, {
           itemName: '模拟-题目52',
           subjectIndex:0,
           questionIndex:1
       }, {
           itemName: '模拟-题目5',
           subjectIndex:0,
           questionIndex:1
       
       }]
      }, 
      {
        title: '差强人意',
        renaming:false,
        nameStatus:'重命名',
        items: [{
          itemName: '模拟-题目5',
          subjectIndex:0,
          questionIndex:1

        }, {
          itemName: '模拟-题目5',
          subjectIndex:0,
          questionIndex:1
        }, {
          itemName: '模拟-题目5',
          subjectIndex:0,
          questionIndex:1
        }]
      }, {
        title: '需要练习',
        renaming:false,
        nameStatus:'重命名',
        items: [{
          itemName: '模拟-题目3',
          subjectIndex:0,
          questionIndex:1
     
        }, {
          itemName: '模拟-题目5',
          subjectIndex:0,
          questionIndex:1
   
        }, {
          itemName: '模拟-题目5',
          subjectIndex:0,
          questionIndex:1
        }]
      }
    ]
  },
  loginStatus:false,
  QuestionDataArray:[],


  
})
