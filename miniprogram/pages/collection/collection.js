// miniprogram/pages/collection.js
// miniprogram/pages/collection.js
// miniprogram/pages/collection.js
const app=getApp()
const db=wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
   folders:'',
   editing:false,
   building:false,
   editStatus:"编辑",
   buildStatus:"新建",
   newing:'',
   reNameNew:''
  },
  edit(e){
    let a=this.data.editing
    a=!a
    let folders=this.data.folders
    if(a){
      this.setData({
        editing:a,
        editStatus:"编辑完成",
        folders:folders
      })
    }else{
      for(var i=0;i<folders.length;i++){
        folders.renaming=false
        folders.nameStatus='重命名'
      }
      this.setData({
        editing:a,
        editStatus:"编辑",
        folders:folders
      })
    }
  },
  add(e){
   let list=this.data.folders
   if (list.length>=12){
     wx.showToast({
       title: '收藏夹太多啦',
       icon:'none'
     });
     return;
   }
   let building=this.data.building,buildStatus=this.data.buildStatus
   if(building){
     let title=this.data.newing
     if(title.length==0||title.length>8||this.repeat(title,list)){
       wx.showToast({
         title: '不要空白重名或太长哦(＾Ｕ＾)ノ~',
         icon:'none'
       })
     }else{
      list.push({ title: title,items:[],renaming:false,nameStatus:'重命名'})
      this.updateFolder()
     }
   
   }
   building=!building
   if(building){
     buildStatus="新建完成"
   }else{
     buildStatus="编辑完成"
   }
   this.setData({
     building,
     buildStatus,
     folders:list  
   })
   this.data.newing=''
  },
  repeat(title,list){
     for(var i = 0,len=list.length;i<len;i++){
       if(list[i].title==title){
         return true
       }
     }
     return false
  },
  rename(e){
   let dataset=e.currentTarget.dataset,index=dataset.parentindex
   for (var i=0;i<app.globalData.folders.length;i++){
     if(i!=index){
       this.data.folders[i].renaming=false
       this.data.folders[i].nameStatus='重命名'
     }
   }
   let target= this.data.folders[index],list=app.globalData.folders
   let title=this.data.reNameNew
   let renaming=this.data.folders[index].renaming 
   if(renaming){
    if(title.length==0||title.length>12||this.repeat(title,list)){
      wx.showToast({
        title: '不要空白重名或太长哦(＾Ｕ＾)ノ~',
        icon:'none'
      })
    }else{
      target.title=title
      app.globalData.folders[index].title=title 
    }
      target.renaming=false
      target.nameStatus='重命名'
      this.setData({
         folders:this.data.folders,
         reNameNew:''
      } )
      this.updateFolder()
   }else{
    target.renaming=true
    target.nameStatus='确定'
    this.setData({
       folders:this.data.folders,
    } )
    this.updateFolder()
   }
  },
  renaming(e){
     let reNameNew  =e.detail.value
     this.setData({
       reNameNew
     })
  },
  delete1(e){
    let dataset=e.currentTarget.dataset
    let list=app.globalData.folders
    list.splice(dataset.parentindex,1)
    this.setData({
      folders:list
    })
    this.updateFolder()
  },
 
  newCollect(e){
   let title=  e.detail.value
  
   this.setData({
     newing:title
   })
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
  cancelCollect(e){
    let dataset=e.currentTarget.dataset
    let list= app.globalData.folders
     var key =list[dataset.parentindex].title+list[dataset.parentindex].items[dataset.childindex].subjectId+list[dataset.parentindex].items[dataset.childindex].questionId
  
     app.globalData.hashmap[key]=false
            list[dataset.parentindex].items.splice(dataset.childindex,1)

    this.updateFolder()
    this.setData({
      folders:list
    })
  },

  //点击最外层列表展开收起
  listTap(e){
    let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
        list=this.data.folders;
    list[Index].show = !list[Index].show || false;//变换其打开、关闭的状态
    if (list[Index].show){//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      this.packUp(list,Index);
    }
    this.setData({
      folders:list
    });
  },
  //点击里面的子列表
  listItemTap(e){
    console.log(e)
      let dataset=e.currentTarget.dataset.item
    wx.navigateTo({
      //拼接参数到要跳转的页面
      url: `/pages/index/index?subjectId=`+Number(dataset.subjectId)+`&questionId=`+Number(dataset.questionId)
    })
  },
  //让所有的展开项，都变为收起
  packUp(data,index){
    for (let i = 0, len = data.length; i < len; i++) {//其他最外层列表变为关闭状态
      if(index!=i){
        data[i].show = false;
      }
    }
  },
  onLoad: function (options) {
    this.data.folders=app.globalData.folders
      for(var i=0;i<this.data.folders.length;i++){
        console.log(this.data.folders.length)
           this.data. folders[i].nameStatus="重命名"
           this.data. folders[i].renaming=false
      }

     console.log(this.data.folders)
     console.log(app.globalData.folders)
      this.setData({
        folders:this.data.folders
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onRefresh(){
    //在当前页面显示导航条加载动画
    this.getData();
  },
//网络请求，获取数据
getData(){
  wx.showNavigationBarLoading(); 
  //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
  wx.showLoading({
    title: '加载中',
  })
  
  setTimeout(function () {
    wx.hideLoading({
      success: (res) => {wx.showToast({
        title: '刷新成功',
        duration:700
      })},
    })
    wx.hideNavigationBarLoading({
      success: (res) => {},
    })
  }, 600)
 this.setData({
   folders:app.globalData.folders
 }) 

},
/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {
    //调用刷新时将执行的方法
  this.onRefresh();
},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
