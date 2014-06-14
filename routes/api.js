var express = require('express');
var router = express.Router();

var user = require('../api/controllers/user');
var ccap = require('../api/services/ccap');
var qiniu = require('../api/services/qiniu');


router.get('/captcha', ccap.newCaptcha);

router.post('/signup', user.signup);
router.post('/login', user.login);
router.get('/logout', user.logout);

// 更新用户信息
router.post('/user/:_id/update', user.updateUserById);


router.post('/activeMail/send', user.sendActiveMail);
router.post('/password/reset', user.resetPassword);
router.post('/password/new', user.newPassword);
router.post('/password/update', user.updatePassword);

// 七牛token
router.get('/qiniuUptoken', function(req, res, next) {
    var token = qiniu.getToken();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
});

module.exports = router; 