// pages/regist.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: ['Male', 'Female', 'Non-binary'],
        value: -1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    myret: function(){
        wx.navigateBack({
          delta: 0,
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

    },
    bindPickerChange: function(e){
        this.setData({
            value: e.detail.value
          })
    },
    toRegister:function(data){
        var p= /^(?=.*\d)(?=.*[a-zA-Z]).{6,12}$/ 
        if(!p.test(data.detail.value.userPwd)){
            //提示一个错误，你的密码输入不符合规则
            console.log("提示一个错误，你的密码输入不符合规则")
            wx.showModal({
                title:'错误',
                content:'你的密码输入不符合规则',
            })
            return ;
        }
        if(data.detail.value.userPwd!=data.detail.value.userPwd1){
            //提示一个错误，你的密码两次输入不一致
            console.log("提示一个错误，你的密码两次输入不一致")
            wx.showModal({
                title:'错误',
                content:'你的密码两次输入不一致',
            })
            return ;
        }
        
        let gender=parseInt(this.data.value)+1
        app.Request("/users",app.ReqOpt.token).POST({
            tel:data.detail.value.phone,
            pass:data.detail.value.userPwd,
            name:data.detail.value.userName,
            email:data.detail.value.email,
            gender:gender,
        }).then(res =>{
            if(res.statusCode != 201)throw res
            return app.Request("/bind",app.ReqOpt.token).PUT({
                tel: data.detail.value.phone,
                pass:data.detail.value.userPwd
            })
        }).then(res => {
            console.log("后台自动成功绑定！");
        }).catch(err =>{
            wx.showModal({
                title:'错误',
                content:String(err.data.msg),
            })
        })
    }
})