var qiniu = require('qiniu');
var config = require('../../config/config');

qiniu.conf.ACCESS_KEY = config.QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.QINIU_SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(config.QINIU_Bucket_Name);

exports.getToken = function() {
	return uptoken.token();
}
