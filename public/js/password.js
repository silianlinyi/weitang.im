define(function(require, exports, module) {
	
	require('../lib/jquery.base64.min');
	var iAlert = require('../angel/iAlert');

	var $oldPassword = $('#oldPassword');
	var $password = $('#password');
	var $rePassword = $('#rePassword');
	var $oldPasswordTip = $('#oldPasswordTip');
	var $passwordTip = $('#passwordTip');
	var $rePasswordTip = $('#rePasswordTip');
	var $saveBtn = $('#saveBtn');

	$saveBtn.on('click', function(e) {
		var oldPassword = $oldPassword.val().trim();
		var password = $password.val().trim();
		var rePassword = $rePassword.val().trim();

		if (!oldPassword) {
			$oldPasswordTip.html('不能为空').css('visibility', 'visible');
			return;
		}
		if (!password) {
			$passwordTip.html('不能为空').css('visibility', 'visible');
			return;
		}
		if (!rePassword) {
			$rePasswordTip.html('不能为空').css('visibility', 'visible');
			return;
		}
		if (password !== rePassword) {
			$rePasswordTip.html('两次输入的密码不一致').css('visibility', 'visible');
			return;
		}

		$.ajax({
			url : '/api/password/update',
			type : 'POST',
			data : {
				oldPassword : $.base64.encode(oldPassword),
				password : $.base64.encode(password)
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data, textStatus, jqXHR) {
				console.log(data);
				if (data.r === 0) {
					iAlert('修改成功');
				} else {
					if(data.errcode === 10022) {
						$oldPasswordTip.html(data.msg).css('visibility', 'visible');
					} else {
						iAlert(data.msg);
					}
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {

			}
		});

	});


	$('input').focus(function() {
		$('.pointing.label').css('visibility', 'hidden');
	});

});
