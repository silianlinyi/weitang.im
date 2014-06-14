var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session')
var mongoose = require('mongoose');

var site = require('./routes/site');
var api = require('./routes/api');
var config = require('./config/config');

// 数据库连接
mongoose.connect('mongodb://' + config.MONGODB_IP + '/' + config.MONGODB_DATABASE_NAME, function(err) {
	if(!err) {
		console.log('【日志】连接到数据库：' + config.MONGODB_DATABASE_NAME);
	} else {
		throw err;
	}
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('www.weitang.im'));
app.use(session({
	secret: 'www.weitang.im',
	cookie: {
		maxAge: 60000
	}
}))
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', site);
app.use('/api', api);



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
