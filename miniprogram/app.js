import wj from "./utils/wj"
wj.init({
  url:`http://121.4.174.222:9000`,
})
const cloud = wx.cloud
wx.cloud.init()
const db = wx.cloud.database();
const url_base = `http://121.4.174.222:9000`;
var user;
var userGetTimeStamp = null;
var userUpdateTimeStamp = null;
App({
  globalData: {
    openid: "",
    token: "",
    situation: 0,
    /**
     * 0 未登录
     * 1 微信登录失败
     * 2 已进行微信登录
     * 3 已进行微信登录，但绑定失败
     * 4 绑定成功
     */
  },

  onLaunch() {
    wx.cloud.init({
      //环境id，不是环境名称哈
      traceUser: true,
    })
    this.getToken();
    this.getOpenid().then(() => {
      this.Request('/users/token', this.ReqOpt.token).GET().then((res) => {
        let prevOpenid = this.globalData.openid;
        let curOpenid = res.data.user.openid;
        if(prevOpenid===curOpenid){
          console.log('相同')
          this.globalData.situation =  4,
          console.log(this.situation)
        }
        else{
          console.log('butong')
          this.globalData.situation = 3
        }
      })
    })

  },
  getToken() {
    let token = wx.getStorageSync('token');
    if (token)
      this.globalData.token = token;
  },
  getOpenid() {
    return new Promise((resolve, reject) => {
      let that = this;
      wx.cloud.callFunction({ // 调用云函数
        name: 'login', // 函数名称
        data: {}, // 函数参数
        success: res => { // 调用成功时的回调函数
          console.log(res.result.openid)
          that.globalData.openid = res.result.openid;
          resolve(res);
          //console.log(that.globalData.openid)
        },
        fail: err => { // 调用失败时的回调函数
          console.error('[云函数] [login] 调用失败', err)
          that.setData({ // 设置页面绑定数据
            openID: '[云函数]获取openID失败' + err
          })
          reject(err);
        }
      })
    })


  },
  stringify(obj) {
    if (obj == null || obj == undefined) {
      return
    }
    let s = {}
    for (let [key, value] of Object.entries(obj)) {
      if (value.constructor == Number || value.constructor == Boolean || value.constructor == String) {
        s[key] = value
      } else {
        s[key] = JSON.stringify(value)
      }
    }
    console.log(s);
    return s
  },
  ReqOpt: {
    debug: 1,
    token: 2,
  },
  Request(api, options) {
    let that = this
    const request = (method, data) => {
      return new Promise((resolve, reject) => {
        let header = {
          'content-type': 'application/x-www-form-urlencoded',
        }
        if (options & this.ReqOpt.token) {
          header['Authorization'] = 'Bearer ' + this.globalData.token;
        }
        if (options & this.ReqOpt.debug) {
          resolve('debug')
          console.log({
            url: url_base + api,
            header,
            method,
            data: that.stringify(data),
          });
          return
        }
        wx.request({
          url: url_base + api,
          header,
          method,
          data: that.stringify(data),
          timeout: 100000,
          success: (res) => {
            resolve(res)
          },
          fail: (err) => {
            reject(err)
          },
        })
      })
    }
    return {
      GET(data) {
        return request('GET', data);
      },
      POST(data) {
        return request('POST', data);
      },
      PUT(data) {
        return request('PUT', data);
      }
    }
  },


  User(id) {
    var that = this;
    return {
      get(openid) {
        if (openid == null) {
          openid = id
        }
        return new Promise((resolve, reject) => {
          if (openid == null && userGetTimeStamp != null && (
              userUpdateTimeStamp == null ||
              userGetTimeStamp > userUpdateTimeStamp)) {
            userGetTimeStamp = that.getTimeStamp();
            resolve(user);
          } else {
            cloud.callFunction({
              name: 'userDB',
              data: {
                operate: 'get',
                openid
              }
            }).then(res => {
              if (openid == null) {
                user = res.result
                userGetTimeStamp = that.getTimeStamp();
              }
              resolve(res.result)
            }).catch(err => {
              reject(err)
            })
          }
        })
      },
      addup(userInfo,tel,cdid) {
        const _id = id
        return new Promise((resolve, reject) => {
          cloud.callFunction({
            name: 'userDB',
            data: {
              operate: 'add/update',
              _id,
              userInfo,
              tel,
              cdid,
            }
          }).then(res => {
            if (id == null) {
              userUpdateTimeStamp = that.getTimeStamp();
            }
            resolve({
              meg: '添加/更新成功',
              res
            })
          }).catch(err => {
            reject({
              meg: '添加/更新失败',
              err
            })
          })
        })
      },
      gets() {
        return {
          identity() {
            return new Promise((resolve, reject) => {
              cloud.callFunction({
                name: 'userDB',
                data: {
                  operate: 'gets-check_index',
                }
              }).then(res => {
                resolve(res)
              }).catch(err => {
                reject(err)
              })
            })
          }
        }
      },
      getField() {
        return {
          name() {
            return new Promise((resolve, reject) => {
              cloud.callFunction({
                name: 'userDB',
                data: {
                  operate: 'get-name',
                }
              }).then(res => {
                resolve(res.result.data)
              }).catch(err => {
                reject(err)
              })
            })
          },
        }
      }
    }
  },
})
