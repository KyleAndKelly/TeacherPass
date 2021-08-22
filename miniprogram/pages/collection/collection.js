// miniprogram/pages/collection.js
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
   folders:'',
   editing:false
  },
  longTap(e){
    let dataset=e.currentTarget.dataset
    this.setData({
      editing:true
    })
  },
  delete(e){
    let dataset=e.currentTarget.dataset
    let list=app.globalData.folders
    this.deleteByFolderTitleAndUserid(dataset.folder.title,dataset.UserId)
    list.splice(dataset.parentindex,1)
    app.globalData.folders=list
    this.setData({
      folders:list
    })
  },
  deleteByFolderTitleAndUserid(folderTitle,UserId){

  },
  newCollect(e){
   let dataset=  e.currentTarget.dataset
   let list=app.globalData.folders
   if (list.length>=8){
     wx.showToast({
       title: '收藏夹太多啦'
     });
     return;
   }
   list.push({ title: dataset.title,
   items:[]})
   this.addFolder(dataset.title,dataset.UserId)
   app.globalData.folders=list
   this.setData({
     folders:list
   })
  },
  addFolder(title,UserId){
        
  },
  cancelCollect(e){
    let dataset=e.currentTarget.dataset
    let list= app.globalData.folders
    list[dataset.parentindex].items.splice(dataset.childindex,1)
    this.deleteBySubjectQuestionAndCollectId(dataset.subjectIndex,dataset.questionIndex,dataset.parentindex)
    app.globalData.folders=list
    this.setData({
      folders:list
    })
  },
  deleteBySubjectQuestionAndCollectId(a,b,c){

  },
  //点击最外层列表展开收起
  listTap(e){
    let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
        list=app.globalData.folders;
    list[Index].show = !list[Index].show || false;//变换其打开、关闭的状态
    if (list[Index].show){//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      this.packUp(list,Index);
    }
    this.setData({
      folders:list
    });
    app.globalData.folders=list
  },
  //点击里面的子列表
  listItemTap(e){
    console.log(e)
      let dataset=e.currentTarget.dataset
    wx.navigateTo({
      //拼接参数到要跳转的页面
      url: `/pages/index/index?subjectId=`+Number(dataset.subjectIndex)+`&questionId=`+Number(dataset.questionIndex)
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
      this.setData({
        folders:app.globalData.folders
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
  onPullDownRefresh: function () {

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
