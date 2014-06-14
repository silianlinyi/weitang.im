var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/**
 * 用户关系 Model
 * 
 * userId 发起关注用户ID
 * followId 被关注者用户ID
 * followUsername 被关注者用户名
 * followHeadimgurl被关注者用户头像
 */
var UserRelationSchema = new Schema({
	username: {
		type: String
	},
    userId: {
        type: ObjectId
    },
    followId: {
        type: ObjectId
    },
    followUsername: {
    	type: String
    },
    createTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserRelation', UserRelationSchema, 'wt_user_relations');