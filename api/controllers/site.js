var policies = require('../policies');

var auth = policies.auth;

exports.home = function(req, res) {
	var signedCookies = auth.getSignedCookies(req, res);
	res.render('home', signedCookies);
}
