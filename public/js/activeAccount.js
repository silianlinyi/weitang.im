define(function(require, exports, module) {

    var Util = require('../angel/util');

    var href = window.location.href;
    if (!href.split('?')[1]) { // 说明是没有token的
        $('.field2').show();
        $('#captchaImg').attr('src', '/api/captcha');
    } else {
        $('.field1').show();
    }

    $('div.field1 a').click(function() {
        $('.field1').hide();
        $('.field2').show();
        $('#captchaImg').attr('src', '/api/captcha');
    });

    var $email = $('#email'),
        $captcha = $('#captcha'),
        $captchaImg = $('#captchaImg'),
        $changeCaptcha = $('#changeCaptcha'),
        $warning = $('.warning.message');

    $('#activeAccount').on('click', function() {
        if ($(this).hasClass('disabled')) {
            return;
        }

        var email = $email.val().trim(),
            captcha = $captcha.val().trim();

        if (!email) {
            $warning.html('<i class="icon attention"></i>邮箱不能为空').show();
            return;
        }

        if (!Util.isEmail(email)) {
            $warning.html('<i class="icon attention"></i>请输入正确的邮箱地址').show();
            return;
        }

        if (!captcha) {
            $warning.html('<i class="icon attention"></i>验证码不能为空').show();
            return;
        }

        $('#activeAccount').html('正在发送...').addClass('disabled');

        $.ajax({
            url: '/api/activeMail/send',
            type: 'POST',
            data: {
                email: email,
                captcha: captcha
            },
            dataType: 'json',
            timeout: 15000,
            success: function(data, textStatus, jqXHR) {
                if (data.r === 0) {
                    $('.field2').hide();
                    $('.field3').show();
                    $('.field3 span').html(email)
                } else {
                    $warning.html('<i class="icon attention"></i>' + data.msg).show();
                    $('#activeAccount').html('重新发送').removeClass('disabled');
                    return;
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });

    });

    $captchaImg.click(function() {
        $(this).attr('src', '/api/captcha');
    });

    $changeCaptcha.click(function() {
        $captchaImg.attr('src', '/api/captcha');
    });

    $('input').focus(function() {
        $warning.hide();
    });



});