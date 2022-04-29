// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const operate = event.operate
  const userInfo = event.userInfo
  const userinfo = event.userinfo
  const identity = event.identity
  var openid = event.openid
  if (!openid) {
    openid = userInfo.openId
  }
  return new Promise((resolve, reject) => {
    switch (operate) {
      case 'get':
        db.collection('users').doc(openid).get()
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
        break
      case 'add/update':
        db.collection('users').add({
            data: {
              _id: openid,
              userinfo,
              identity,
            }
          }).then(res => {
            resolve(res)
            return
          }).catch(err => {
            return db.collection('users').doc(openid).update({
              data: {
                userinfo,
                identity,
              }
            })
          })
          .then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        break
      case 'get-name':
        db.collection('users').doc(openid).field({
            'userinfo.nickName': true
          })
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break;
      case 'gets-check_index':
        db.collection('users').field({
            _id: true,
            "userinfo.nickName": true,
            "userinfo.avatarUrl": true,
            "identity.name": true,
            "identity.university": true,
            "identity.school": true,
            "identity.grade": true,
            "identity.major": true,
            "identity.class": true,
            "identity.status": true,
          }).get()
          .then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        break
      default:
        reject({
          meg: "参数错误",
          event,
          openid: wxContext.OPENID,
          appid: wxContext.APPID,
          unionid: wxContext.UNIONID,
        })
    }
  })
}