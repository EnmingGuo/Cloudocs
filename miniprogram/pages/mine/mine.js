import wj from "../../utils/wj"

const app = getApp();

Page({
  data: {
    userinfo: {},
    tel: 123,
    keyword: 23,
    situation: 0,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    const userinfo = wx.getStorageSync("userinfo");
    this.setData({
      userinfo: userinfo,
    })

    const getSit = () => {
      setTimeout(() => {
        console.log(app.globalData.situation);
        switch (app.globalData.situation) {
          case 0:
          case 2:
            getSit();
            break;
          default:
            this.setData({
              situation: app.globalData.situation
            })
            this.load()
        }
      }, 500);
    }
    getSit();
  },

  load() {

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

  },
  getTEL: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  getKEYWORD: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  regist:function(){
    wx.navigateTo({
      url: '../regist/regist'
    })
  },
  enterClicked: function () {
    let that = this
    //console.log(this.data.openID)
    app.Request("/bind", app.ReqOpt.token).PUT({
      openid: app.globalData.openid,
      tel: this.data.tel,
      pass: this.data.keyword,
      //tel: "17602498003",
      //pass: "123456",
    }).then(res => {
      //console.log(res);
      if(res.statusCode == 200)throw res
      let token = res.data.token
      wx.setStorageSync("token", token)
      console.log("登陆成功！");
      return wj.user().addup({
        userInfo: that.data.userinfo,
        tel: res.data.user.tel,
        cdid: res.data.user._id,
      })
    }).then(res => {
      app.globalData.situation = 4
      //console.log(res);
    }).catch(err => {
        wx.showModal({
          title:'错误',
          content:String(err.data.msg),
      })
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    })
      .then(res => {
        wx.setStorageSync("userinfo", res.userInfo)
        app.globalData.situation = 2
        this.setData({
          userinfo: res.userInfo
        })
      })
      .catch(err => {
        app.globalData.situation = 1
      })
  },

})