var express = require('express');
var router = express.Router();

var site = require('../api/controllers/site');
var user = require('../api/controllers/user');
var policies = require('../api/policies');

// 首页
router.get('/', policies.auth.userPageAuth, site.home);

// 注册成功提示页
router.get('/registerSucc', function(req, res) {
	var email = req.query.email;
	res.render('registerSucc', {
		email : email
	});
});

// 登录
router.get('/login', function(req, res) {
	res.render('login');
});

// 激活帐号
router.get('/activeAccount', user.activeAccount);

// 激活帐号成功提示页面
router.get('/activeAccountSucc', function(req, res) {
	res.render('activeAccountSucc');
});

// 重置密码
router.get('/resetPassword', function(req, res) {
	res.render('resetPassword');
});

// 设置新密码
router.get('/newPassword', user.showNewPassword);

// 用户主页
router.get('/user/:username', policies.auth.userPageAuth, user.showUserHomepage);

// 用户Followers
router.get('/user/:username/followers', policies.auth.userPageAuth, user.showUserFollowers);

// 用户Following
router.get('/user/:username/following', policies.auth.userPageAuth, user.showUserFollowing);

// 设置 profile
router.get('/settings/profile', policies.auth.userPageAuth, user.showProfilePage);

// 设置密码
router.get('/settings/password', policies.auth.userPageAuth, user.showPasswordPage);







router.get('/404', function(req, res) {
	res.render('404');
});

module.exports = router;
