define(function(require, exports, module) {
    require('../lib/jquery.base64.min');

    var Util = require('../angel/util');

    // page1 登录
    // -------------------------------------------
    var $username = $('.page1 .username'),
        $password = $('.page1 .password'),
        $signinBtn = $('.signin.button'),
        $warning = $('.page1 .warning');

    $('.inputPage1').focus(function() {
        $warning.hide();
    });

    $('.page1 .signup').click(function() {
        $('.main').moveDown();
        setTimeout(function() {
            $('.page2 .form').fadeIn();
            $('.labeled.signup.button').hide();
        }, 500);
    });
	
	// 登录
    $signinBtn.click(function() {
        var username = $username.val().trim(),
            password = $password.val().trim();

        if (!username) {
            $warning.html('<i class="icon attention"></i>请输入用户名').show();
            return;
        }
        if (!password) {
            $warning.html('<i class="icon attention"></i>请输入密码').show();
            return;
        }

        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: {
                username: username,
                password: $.base64.encode(password)
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    window.location.reload();
                } else {
                    $warning.html('<i class="icon attention"></i>' + data.msg).show();
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // page1登录按钮键盘事件监听(Enter)
	$('body').keydown(function(e) {
		if (e.keyCode === 13) {
			if ($('.page1').hasClass('active')) {// 说明用户当前处于page1
				$signinBtn.click();
			} else if ($('.page2').hasClass('active')) {
				$signup.click();
			}
		}
	}); 


    // page2 注册
    // -------------------------------------------
    $('.labeled.signup.button').click(function() {
        $('.page2 .form').fadeIn();
        $(this).hide();
    });

    var $signup = $('.page2 .submit.signup.button'),
        $newUsername = $('.page2 .username'),
        $newPassword = $('.page2 .password'),
        $newEmail = $('.page2 .email'),
        $captcha = $('.page2 .captcha'),
        $newWarning = $('.page2 .warning');

    $('.inputPage2').focus(function() {
        $newWarning.hide();
    });

    $('.codefield img').attr('src', '/api/captcha');

    $('.codefield img').click(function(e) {
        $(this).attr('src', '/api/captcha');
    });

    $('.codefield a').click(function(e) {
        $('.codefield img').attr('src', '/api/captcha');
    });

    $signup.click(function(e) {
        var username = $newUsername.val().trim(),
            password = $newPassword.val().trim(),
            email = $newEmail.val().trim(),
            captcha = $captcha.val().trim();

        if (!username) {
            $newWarning.html('<i class="icon attention"></i>用户名不能为空').show();
            return;
        }
        if (!/^\w{6,20}$/.test(username)) {
            $newWarning.html('<i class="icon attention"></i>用户名由6到20个英文、数字或下划线组成的字符').show();
            return;
        }
        if (!password) {
            $newWarning.html('<i class="icon attention"></i>密码不能为空').show();
            return;
        }
        if (!email) {
            $newWarning.html('<i class="icon attention"></i>邮箱地址不能为空').show();
            return;
        }
        if (!Util.isEmail(email)) {
            $newWarning.html('<i class="icon attention"></i>邮箱地址不合法').show();
            return;
        }
        if (!captcha) {
            $newWarning.html('<i class="icon attention"></i>验证码不能为空').show();
            return;
        }

        $.ajax({
            url: '/api/signup',
            type: 'POST',
            data: {
                username: username,
                password: $.base64.encode(password),
                email: email,
                captcha: captcha
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    window.location.href = '/registerSucc?email=' + email
                } else {
                    $newWarning.html('<i class="icon attention"></i>' + data.msg).show();
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });



});