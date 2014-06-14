var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 用户Model
 * 
 * nickname 昵称，用于显示
 * username 用户名，登录唯一用户名（唯一索引）
 * email 邮箱（唯一索引）
 * sex 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知，默认未知
 * createTime 注册时间
 * updateTime 最后个人信息修改时间
 * city 用户所在城市
 * country	 用户所在国家
 * province	 用户所在省份
 * language	 用户的语言，简体中文为zh_CN
 * headimgurl	 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空
 * followerNum 粉丝个数
 * followingNum 关注个数
 * signature 个性签名
 */
var UserSchema = new Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    nickname: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        index: true,
        unique: true
    },
    phone: {
        type: String
    },
    qq: {
        type: String
    },
    sex: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Number,
        default: Date.now
    },
    updateTime: {
        type: Number,
        default: Date.now
    },
    url: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    province: {
        type: String
    },
    language: {
        type: String
    },
    headimgurl: {
        type: String
    },
    followerNum: {
    	type: Number,
    	default: 0
    },
    followingNum: {
    	type: Number,
    	default: 0
    },
    signature: {
    	type: String,
    	default: ''
    },
    active: {
        type: Boolean,
        default: false
    },
    activeTicket: {
        type: Number,
        default: 0
    },
    activeToken: {
        type: String,
        default: ''
    },
    resetTicket: {
        type: Number,
        default: 0
    },
    resetToken: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', UserSchema, 'wt_users');