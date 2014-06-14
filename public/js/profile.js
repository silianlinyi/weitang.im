define(function(require, exports, module) {
	
	// 头像上传相关代码
	var config = require('./config');
    var QINIU_Bucket_Name = config.QINIU_Bucket_Name;
    
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: '/api/qiniuUptoken',
        // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://' + QINIU_Bucket_Name + '.qiniudn.com/',
        container: 'pickfilesContainer',
        max_file_size: '4mb',
        flash_swf_url: '../plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'pickfilesContainer',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {

                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情

            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
                $('#pickfiles').html('正在上传' + file.percent + '%');
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var sourceLink = domain + res.key;
                console.log(sourceLink);

                $('#headimgurl').attr('src', sourceLink);
                $('#pickfiles').html('上传头像');
            },
            'Error': function(up, err, errTip) {
                //上传出错时,处理相关的事情

            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情

            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效

                var key = "";
                // do something with key here
                return key
            }
        }
    });
    // --------------------------------
    
    var iAlert = require('../angel/iAlert');
    var area = require('../angel/area');
    
    var $provinceDropdown = $('#provinceDropdown');
    var $provinceDropdownMenu = $('#provinceDropdown .menu');
    var $cityDropdown = $('#cityDropdown');
    var $cityDropdownMenu = $('#cityDropdown .menu');
    
    var $headimgurl = $('#headimgurl');
    var $nickname = $('#nickname');
    var $sex = $('#sex');
    var $province = $('#province');
    var $city = $('#city');
    var $phone = $('#phone');
    var $qq = $('#qq');
    var $url = $('#url');
    var $signature = $('#signature');
    var $saveBtn = $('#saveBtn');
    
    var cities = area[user.province];
    if (cities) {
        for (var i = 0; i < cities.length; i++) {
            $cityDropdownMenu.append($('<div class="item" data-value="'+cities[i]+'">'+cities[i]+'</div>;'))
        }
    }
    $cityDropdown.dropdown({
    	on: 'hover'
    });
    $provinceDropdown.dropdown({
    	on: 'hover',
    	onChange: function(value, text) {
    		$('#cityDropdown .menu .item').remove();
    		var cities = area[value];
    		if(cities) {
    			for (var i = 0; i < cities.length; i++) {
			        $cityDropdownMenu.append($('<div class="item" data-value="'+cities[i]+'">'+cities[i]+'</div>;'))
			    }
    		}
    		$cityDropdown.dropdown({
		    	on: 'hover'
		    });
    	}
    });
    
    $saveBtn.on('click', function(e) {
    	var headimgurl = $headimgurl.attr('src');
    	var nickname = $nickname.val();
    	var sex = $sex.val();
    	var province = $province.val();
    	var city = $city.val();
    	var phone = $phone.val();
    	var qq = $qq.val();
    	var url = $url.val();
    	var signature = $signature.val();
    	
    	$.ajax({
			url : '/api/user/'+user._id+'/update',
			type : 'POST',
			data : {
				headimgurl: headimgurl,
				nickname: nickname,
				sex: Number(sex),
				province: province,
				city: city,
				phone: phone,
				qq: qq,
				url: url,
				signature: signature
			},
			dataType : 'json',
			timeout : 15000,
			success : function(data, textStatus, jqXHR) {
				console.log(data);
				if (data.r === 0) {
					iAlert('修改成功');
				} else {
					
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {

			}
		});
    	
    });
    
    

});
