// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database({
  env : "test-5ga1gsyad0e2c798"
}
)
// 云函数入口函数
exports.main = async (event, context) => {
  let { OPENID } =cloud.getWXContext()
  console.log(OPENID)
     let{folders}=event
     
        return await db.collection('collectiondata').where({
          openid:OPENID
        }).update({
          data:{
            folders:folders
          }
        })
}