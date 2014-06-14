var uuid = require('node-uuid');
var User = require('../models/User');
var UserRelation = require('../models/User_Relation');

var policies = require('../policies');
var auth = policies.auth;
var ccap = require('../services/ccap');
var mail = require('../services/mail');
var Util = require('../common/util');
var config = require('../../config/config');
var ERRCODE = require('../../ERRCODE');

/**
 * 验证邮箱
 */
function checkEmail(req, res, email) {
	if (!email) {
        res.json({
            "r": 1,
            "errcode": 10007,
            "msg": ERRCODE[10007]
        });
        return false;
    }
	if (!Util.isEmail(email)) {
        res.json({
            "r": 1,
            "errcode": 10008,
            "msg": ERRCODE[10008]
        });
        return false;
    }
	return true;
}

/**
 * 验证验证码
 */
function checkCaptcha(req, res, captcha) {
	if (!captcha) {
		res.json({
			"r" : 1,
			"errcode" : 10009,
			"msg" : ERRCODE[10009]
		});
		return false;
	}
	
	var _captcha = ccap.getCaptcha(req, res);
	if (_captcha.toLowerCase() !== captcha.toLowerCase()) {
		res.json({
			"r" : 1,
			"errcode" : 10010,
			"msg" : ERRCODE[10010]
		});
		return false;
	}
	return true;
}

/**
 * 验证用户名
 */
function checkUsername(req, res, username) {
	if (!username) {
		res.json({
			"r" : 1,
			"errcode" : 10004,
			"msg" : ERRCODE[10004]
		});
		return false;
	}
	if (!/^\w{6,20}$/.test(username)) {
		res.json({
			"r" : 1,
			"errcode" : 10005,
			"msg" : ERRCODE[10005]
		});
		return false;
	}
	return true;
}

/**
 * 验证密码
 */
function checkPassword(req, res, password) {
	if (!password) {
		res.json({
			"r" : 1,
			"errcode" : 10006,
			"msg" : ERRCODE[10006]
		});
		return false;
	}
	return true;
}

/**
 * 注册
 */
function signup(req, res) {
	var body = req.body;
	var username = body.username;
	var password = body.password;
	var email = body.email;
	var captcha = body.captcha;
	
	if(!checkUsername(req, res, username)) {
		return;
	}
	if(!checkPassword(req, res, password)) {
		return;
	}
	if(!checkEmail(req, res, email)) {
		return;
	}
	if(!checkCaptcha(req, res, captcha)) {
		return;		
	}

	User.findOne({
		'$or' : [{
			'username' : username
		}, {
			'email' : email
		}]
	}, function(err, doc) {
		if (err) {
			res.json({
				"r" : 1,
				"errcode" : 10011,
				"msg" : ERRCODE[10011]
			});
			return;
		}

		if (!!doc) {
			if (doc.username === username) {
				res.json({
					"r" : 1,
					"errcode" : 10012,
					"msg" : ERRCODE[10012]
				});
				return;
			} else if (doc.email === email) {
				res.json({
					"r" : 1,
					"errcode" : 10013,
					"msg" : ERRCODE[10013]
				});
				return;
			}
		}

		var user = new User({
			username : username,
			password : Util.md5(password),
			email : email,
			activeTicket: Date.now(),
			activeToken: uuid.v1()
		});

		user.save(function(err) {
			if (err) {
				res.json({
					"r" : 1,
					"errcode" : 10011,
					"msg" : ERRCODE[10011]
				});
				return;
			} else {
				res.json({
					"r" : 0,
					"msg" : "注册成功"
				});
				
				mail.sendActiveMail(email, user.activeToken, function(res) {
                    console.log('注册成功，成功发送了一份激活邮件');
                    console.log(res);
                });
				return;
			}
		});

	});
}

/**
 * 登录
 */
function login(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	if (!username || !password) {
		res.json({
			"r" : 1,
			"errcode" : 10000,
			"msg" : ERRCODE[10000]
		});
		return;
	}

	User.findOne({
		username : username
	}, function(err, doc) {
		if (err) {
			res.json({
				"r" : 1,
				"errcode" : 10001,
				"msg" : ERRCODE[10001]
			});
			return;
		}
		if (!doc) {
			res.json({
				"r" : 1,
				"errcode" : 10002,
				"msg" : ERRCODE[10002]
			});
			return;
		}

		password = Util.md5(password);
		if (password !== doc.password) {
			res.json({
				"r" : 1,
				"errcode" : 10003,
				"msg" : ERRCODE[10003]
			});
			return;
		}
		
		// 用户登录成功，记一个签名Cookie
		newSignedCookie(req, res, doc);

		res.json({
			"r" : 0,
			"msg" : "登录成功"
		});
		return;
	});
}

/**
 * 新建签名Cookie
 */
function newSignedCookie(req, res, user) {
	res.cookie(config.COOKIE_NAME, {
		userId: user._id,
		username: user.username,
		nickname: user.nickname
	}, {
		path: '/',
		maxAge: 1000 * 60 * 60 * 24 * 30,
		signed: true
	});
}

/**
 * 注销
 */
function logout(req, res) {
	res.clearCookie(config.COOKIE_NAME, {
		path : '/'
	});
	res.redirect('/');
}


function updateUserById(req, res) {
	var _id = req.params._id;
	var body = req.body;
	var headimgurl = body.headimgurl;
	var nickname = body.nickname;
	var sex = body.sex;
	var province = body.province;
	var city = body.city;
	var phone = body.phone;
	var qq = body.qq;
	var url = body.url;
	var signature = body.signature;
	
	User.findByIdAndUpdate(_id, {
		$set: {
			headimgurl: headimgurl,
			nickname: nickname,
			sex: Number(sex),
			province: province,
			city: city,
			phone: phone,
			qq: qq,
			url: url,
			signature: signature
		}
	}, function(err, doc) {
		if(err) {
			res.json({
				"r" : 1,
				"errcode" : 10023,
				"msg" : ERRCODE[10023]
			});
			return;
		}
		
		res.json({
			"r": 0,
			"msg": "修改成功"
		});
		return;
	});
	
}

/**
 * 激活帐号
 */
function activeAccount(req, res) {
	var token = req.query.token || '';

	if (!token) {// 没有token
		res.render('activeAccount');
	} else {// 有token
		var now = (new Date()).getTime();
		var ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
		var diff = now - ONE_DAY_MILLISECONDS;
		
		User.findOneAndUpdate({
			activeToken: token,
            activeTicket: {
                $gt: diff
            }
		}, {
			active: true,
            activeTicket: 0,
            activeToken: ''
		}, function(err, doc) {
			if(err) {
				res.render('activeAccount');
                return;
			}
			
			if(!doc) {
				res.render('activeAccount');
                return;
			}
			res.redirect('/activeAccountSucc');
		});
	}
}

/**
 * 重新发送激活邮件
 */
function sendActiveMail(req, res) {
	var email = req.body.email;
	var captcha = req.body.captcha;

	if(!checkEmail(req, res, email)) {
		return;
	}
	if(!checkCaptcha(req, res, captcha)) {
		return;	
	}

	var activeTicket = Date.now();
	var activeToken = uuid.v1();

	User.findOneAndUpdate({
		email : email
	}, {
		activeTicket : activeTicket,
		activeToken : activeToken
	}, function(err, doc) {
		if (err) {
			res.json({
				"r" : 1,
				"errcode" : 10015,
				"msg" : ERRCODE[10015]
			});
			return;
		}

		if (!!doc) {
			mail.sendActiveMail(email, activeToken, function(response) {
				console.log('重新发送了一份激活邮件');
				console.log(response);
				
				res.json({
					"r" : 0,
					"msg" : "发送成功"
				});
				return;
			});
		} else {
			res.json({
				"r" : 1,
				"errcode" : 10016,
				"msg" : ERRCODE[10016]
			});
			return;
		}
	});
}

/**
 * 重置密码（Ajax）
 */
function resetPassword(req, res) {
	var email = req.body.email;
	var captcha = req.body.captcha;
	
	if(!checkEmail(req, res, email)) {
		return;
	}
	if(!checkCaptcha(req, res, captcha)) {
		return;	
	}
	
	var resetTicket = Date.now();
    var resetToken = uuid.v1();
    
    User.findOneAndUpdate({
        email: email
    }, {
        resetTicket: resetTicket,
        resetToken: resetToken
    }, function(err, doc) {
        if (err) {
            res.json({
                "r": 1,
                "errcode": 10017,
                "msg": ERRCODE[10017]
            });
            return;
        }

        if ( !! doc) {
            mail.sendResetPassMail(email, resetToken, function(response) {
                console.log('发送了一份重设密码邮件');
                console.log(response);
                res.json({
                    "r": 0,
                    "msg": "发送成功"
                });
                return;
            });
        } else {
            res.json({
                "r": 1,
                "errcode": 10016,
                "msg": ERRCODE[10016]
            });
            return;
        }
    });
}

/**
 * 设置新密码（Ajax）
 */
function newPassword(req, res) {
	var password = req.param('password');
    var token = req.param('token');
    
    User.findOneAndUpdate({
        resetToken: token
    }, {
        resetTicket: 0,
        resetToken: '',
        password: Util.md5(password)
    }, function(err, doc) {
        if (err) {
            res.json({
                "r": 1,
                "errcode": 10018,
                "msg": ERRCODE[10018]
            });
            return;
        }

        if ( !! doc) {
            res.json({
                "r": 0,
                "msg": "设置新密码成功"
            });
        } else {
            res.json({
                "r": 1,
                "errcode": 10019,
                "msg": ERRCODE[10019]
            });
            return;
        }
    });
}

// 设置 - 重置密码
function updatePassword(req, res) {
	var body = req.body;
	var oldPassword = Util.md5(body.oldPassword);
	var password = body.password;
	var userId = auth.getSignedCookie(req, 'userId');

	User.findOne({
		_id : userId
	}, function(err, user) {
		if (err) {
			res.json({
				"r" : 1,
				"errcode" : 10021,
				"msg" : ERRCODE[10021]
			});
			return;
		}

		if (oldPassword !== user.password) {
			res.json({
				"r" : 1,
				"errcode" : 10022,
				"msg" : ERRCODE[10022]
			});
			return;
		}

		user.password = Util.md5(password);
		user.save(function(err, user) {
			if (err) {
				res.json({
					"r" : 1,
					"errcode" : 10021,
					"msg" : ERRCODE[10021]
				});
				return;
			}

			res.json({
				"r" : 0,
				"msg" : "修改成功"
			});
			return;
		});
	});
}


/**
 * 显示设置新密码页面（HTTP）
 */
function showNewPassword(req, res) {
	var token = req.query.token || '';
	var now = (new Date()).getTime();
    var ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
    var diff = now - ONE_DAY_MILLISECONDS;
	
	User.findOne({
        resetToken: token,
        resetTicket: {
            $gt: diff
        }
    }, function(err, doc) {
        if (err) {
            res.render('newPassword', {
                "r": 1,
                "errcode": 2007,
                "msg": "服务器错误，重置密码失败"
            });
            return;
        }

        // 没有找到
        if (!doc) {
            res.render('newPassword', {
                "r": 1,
                "errcode": 2008,
                "msg": "无效的链接地址"
            });
            return;
        }

        res.render('newPassword', {
            "r": 0,
            "doc": doc
        });
    });
}

function showUserHomepage(req, res) {
	var signedCookies = auth.getSignedCookies(req, res);
	var username = req.params.username;
	
	// {password: 0}表示不返回password这个属性
    User.findOne({
        username: username
    }, {
        password: 0
    }, function(err, doc) {
        if (err) {
            res.render('userHomepage', {
                "r": 1,
                "errcode": 10001,
                "msg": "服务器错误，调用findUserByName方法出错"
            });
        }
        if ( !! doc) {
            res.render('userHomepage', {
                "r": 0,
                "msg": "请求成功",
                "user": doc,
                "username": signedCookies.username,
                "userId": signedCookies.userId
            });
        } else {
            res.render('userHomepage', {
                "r": 1,
                "errcode": 10002,
                "msg": "用户不存在"
            });
        }
    });
}


function showUserFollowers(req, res) {
	var obj = auth.getSignedCookies(req, res);
	var username = req.params.username;
	
	UserRelation.find({
		followUsername: username
	}, {
		password : 0
	}, function(err, docs) {
		if(err) {
			obj.r = 1;
			obj.r = "服务器错误，查找关注者失败";
			res.render('userFollowers', obj);
			return;
		}
		
		obj.r = 0;
		obj.msg = "请求成功";
		obj.users = docs;
		res.render('userFollowers', obj);
	})
}

/**
 * 显示我关注的用户页面
 */
function showUserFollowing(req, res) {
	var obj = auth.getSignedCookies(req, res);
	var username = req.params.username;

	UserRelation.find({
		username : username
	}, {
		password : 0
	}, function(err, docs) {
		if (err) {
			obj.r = 1;
			obj.msg = "服务器错误，查找我关注的用户失败"
			res.render('userFollowing', obj);
			return;
		}
		
		obj.r = 0;
		obj.msg = "请求成功";
		obj.users = docs;
		res.render('userFollowing', obj);
	});
}

/**
 * 显示个人资料修改页面
 */
function showProfilePage(req, res) {
	var obj = auth.getSignedCookies(req, res);
	
	var userId = obj.userId;
	
	User.findOne({
		_id: userId
	}, {
		password: 0
	}, function(err, doc) {
		if(err) {
			obj.r = 1;
			obj.msg = "服务器错误，获取个人资料失败";
			res.render('profile', obj);
		}
		
		obj.r = 0;
		obj.msg = "请求成功";
		obj.user = doc;
		res.render('profile', obj);
	});
	
}


function showPasswordPage(req, res) {
	var obj = auth.getSignedCookies(req, res);
	
	res.render('password', obj);
}

module.exports = {
	signup : signup,
	login : login,
	logout : logout,
	updateUserById : updateUserById,
	activeAccount: activeAccount,
	sendActiveMail : sendActiveMail,
	resetPassword : resetPassword,
	newPassword : newPassword,
	showNewPassword : showNewPassword,
	showUserHomepage : showUserHomepage,
	showUserFollowers : showUserFollowers,
	showUserFollowing : showUserFollowing,
	showProfilePage : showProfilePage,
	showPasswordPage : showPasswordPage,
	updatePassword : updatePassword
};
