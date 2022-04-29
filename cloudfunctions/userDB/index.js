// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const operate = event.operate
  const userInfo = event.userInfo
  var openid = event.openid
  var tevent = JSON.parse(JSON.stringify(event));
  var data =  tevent.data;

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
      case 'addup':
        data['_id'] = openid
        db.collection('users').add({
            data,
          }).then(res => {
            resolve(res)
            return
          }).catch(err => {
            return db.collection('users').doc(openid).update({
              data: event.data
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
        reject("参数错误："+JSON.stringify(event))
    }
  })
}