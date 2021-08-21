const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}


// utils/utils.js
  /** 

  * requestPromise用于将wx.request改写成Promise方式 

  * @param：{string} myUrl 接口地址 

  * @return: Promise实例对象 

  */ 

 const requestPromise = myUrl => {
  // 返回一个Promise实例对象 
  return new Promise((resolve, reject) => {
    wx.request({
      url: myUrl,
      success: res => resolve(res)
    })
  })
}

const dbGetPromise = (collectionName, skipNum) => {
  return new Promise((resolve, reject) => {
    var db = wx.cloud.database()
    db.collection(collectionName).skip(skipNum).get({
      success: function (res) {
        console.log("debug: dbGetPromise success")
        res => resolve(res)
          }
    })
  })

    
}


module.exports = {
  requestPromise: requestPromise,
  dbGetPromise:dbGetPromise
}

module.exports = {
  formatTime
}
