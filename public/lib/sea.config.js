/**
 * 给Sea.js用的项目配置文件
 */
seajs.config({
	

	
	alias: {
		'jquery': {
			src: '/lib/jquery.js',
			exports: 'jQuery'
		},
		
		'jquery.onepage-scroll': {
			src: '/lib/jquery.onepage-scroll.min.js',
			deps: ['jquery']
		},

		'underscore': {
			src: '/lib/underscore.js',
			exports: '_'
		},

		'backbone': {
			src: '/lib/backbone.js',
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},

		'backbone.localStorage': {
			src: '/lib/backbone-localstorage.js',
			deps: ['backbone']
		},

		'json2': {
			src: '/lib/json2.js',
			exports: 'json2'
		}
	}
})