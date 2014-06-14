var config = require('../../config/config');
var ERRCODE = require('../../ERRCODE');

function getSignedCookie(req, name) {
	return req.signedCookies && req.signedCookies[config.COOKIE_NAME] && req.signedCookies[config.COOKIE_NAME][name];
}

function getSignedCookies(req, res) {
	return req.signedCookies && req.signedCookies[config.COOKIE_NAME];
}

// true 用户已登录 false 用户未登录
function userAuth(req, res) {
	var userId = getSignedCookie(req, 'userId');
	return !!userId;
}

function userPageAuth(req, res, next) {
	if (userAuth(req, res)) {
		console.log("[ >>> LOG >>> ]：用户验证成功");
		next();
	} else {
		console.log("[ >>> LOG >>> ]：用户验证失败");
		res.render('login');
	}
}

function userAjaxAuth(req, res) {
	if (userAuth(req, res)) {
		console.log("[ >>> LOG >>> ]：用户验证成功");
		next();
	} else {
		console.log("[ >>> LOG >>> ]：用户验证失败");
		res.json({
			"r" : 1,
			"errcode" : 10014,
			"msg" : ERRCODE[10014]
		});
		return;
	}
}

exports.getSignedCookie = getSignedCookie;
exports.getSignedCookies = getSignedCookies;
exports.userPageAuth = userPageAuth;
exports.userAjaxAuth = userAjaxAuth;