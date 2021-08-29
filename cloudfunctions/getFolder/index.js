// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database({
  env : "test-5ga1gsyad0e2c798"
})
// 云函数入口函数
exports.main = async (event, context) => {
  
  let { OPENID } =cloud.getWXContext()
  console.log(OPENID)
       b(OPENID)
      return  await db.collection('collectiondata').where({
      openid:OPENID
   }).get()
}
async function b(OPENID){
  db.collection('collectiondata').where({
    openid:OPENID
 }).get().then(res=>{
  if(res.data.length==0){
   a(OPENID)
  }
   } 
 )
}


async function a(OPENID){
  let folders=[
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
 db.collection('collectiondata').add({
    data:{
      openid:OPENID,
      folders:folders
    }
  })
}