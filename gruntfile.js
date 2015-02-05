'use strict';

// VERSION 1.1.1

function injectPath(config) {
	if (config.cordova.icons) {
		for ( var platform in config.cordova.icons) {
			config.cordova.icons[platform].src = '<%= project.resources %>/' + config.cordova.icons[platform].src;
			for ( var icon in config.cordova.icons[platform].dest) {
				config.cordova.icons[platform].dest[icon] = '<%= project.cordova.dist %>/' + config.cordova.icons[platform].dest[icon];

			}
		}
	}
	if (config.replaceTarget) {
		config.replaceTarget.src = '<%= project.target %>/' + config.replaceTarget.src;
	}
	if (config.replaceDist) {
		config.replaceDist.src = '<%= project.dist %>/' + config.replaceDist.src;
	}
	return config;
}

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	var appConfig = injectPath(require('./gruntfile.json'));

	grunt.initConfig({

		project : appConfig,

		connect : {
			options : {
				open : true,
				port : 9000,
				hostname : 'localhost',
				livereload : 35729
			},
			proxies : appConfig.proxies,
			livereload : {
				options : {
					middleware : function(connect) {
						if (appConfig.proxies) {
							var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];
							middlewares.push(connect.static(appConfig.target));
							middlewares.push(connect().use('/bower_components', connect.static('./bower_components')));
							return middlewares;
						} else {
							return [connect().use('/bower_components', connect.static('./bower_components')),connect.static(appConfig.target)];
						}
					}
				}
			},
			dist : {
				options : {
					middleware : function(connect) {
						if (appConfig.proxies) {
							var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
							return [proxy,connect.static(appConfig.dist),connect.directory(appConfig.dist)];
						} else {
							return [connect.static(appConfig.dist)];
						}
					}
				}
			}
		},

		cordovacli : {
			options : {
				path : '<%= project.cordova.dist %>'
			},
			cordova : {
				options : {
					command : ['create','plugin','platform'],
					platforms : ['android'],
					plugins : appConfig.cordova.plugins,
					id : appConfig.cordova.id,
					name : appConfig.cordova.name
				}
			},
			plugins : {
				options : {
					command : 'plugin',
					action : 'add',
					plugins : appConfig.cordova.plugins
				}
			},
			build : {
				options : {
					command : 'build',
					platforms : ['android']
				}
			},
			run : {
				options : {
					command : 'run',
					platforms : ['android']
				}
			}
		},

		bower : {
			install : {
				options : {
					copy : false
				}
			},
			dist : {
				options : {
					copy : true,
					targetDir : '<%= project.tmp %>'
				}
			}
		},

		copy : {
			dist : {
				files : [{
					expand : true,
					flatten : true,
					src : ['<%= project.tmp %>/**/*.{eot,ttf,woff,svg, otf}'],
					dest : '<%= project.dist %>/fonts/'
				}]
			}
		},

		watch : {
			options : {
				event : ['added','changed'],
			},
			remove : {
				files : ['<%= project.app %>/**'],
				tasks : ['sync:targetwithdelete','less:target','ngtemplates:target','injector:target'],
				options : {
					event : ['deleted']
				}
			},
			app : {
				files : ['<%= project.app %>/**','!<%= project.app %>/js/**/*.js','!<%= project.app %>/less/**/*.less','!<%= project.app %>/partials/**/*.html'],
				tasks : ['sync:target','injector:target']
			},
			appjs : {
				files : ['<%= project.app %>/js/**/*.js'],
				tasks : ['sync:target','verifjshint:target','injector:target']
			},
			appless : {
				files : ['<%= project.app %>/less/**/*.less'],
				tasks : ['less:target','injector:target']
			},
			apptemplate : {
				files : ['<%= project.app %>/partials/**/*.html'],
				tasks : ['ngtemplates:target','injector:target']
			},
			gruntfile : {
				files : ['gruntfile.js'],
				tasks : ['verifjshint:target']
			},
			bower : {
				files : ['bower.json'],
				tasks : ['bower:install','injector:target']
			},
			livereload : {
				options : {
					livereload : '<%= connect.options.livereload %>'
				},
				files : ['<%= project.target %>/**/*.html','<%= project.target %>/css/**/*.css','<%= project.target %>/js/**/*.js','<%= project.target %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}']
			}
		},

		clean : {
			target : {
				src : ['<%= project.target %>']
			},
			dist : {
				src : ['<%= project.dist %>','bower_components']
			},
			tmp : {
				src : ['<%= project.tmp %>','<%= project.dist %>/css','<%= project.dist %>/js','<%= project.dist %>/bower_components']
			},
			cordova : {
				src : ['<%= project.cordova.dist %>/{www,res}/*']
			},
			cordovadir : {
				src : ['<%= project.cordova.dist %>']
			}
		},

		sync : {
			target : {
				files : [{
					src : ['**','!less/**','!partials/**'],
					cwd : '<%= project.app %>',
					dest : '<%= project.target %>'
				}],
				verbose : false
			},
			targetwithdelete : {
				files : [{
					src : ['**','!less/**','!partials/**'],
					cwd : '<%= project.app %>',
					dest : '<%= project.target %>'
				}],
				verbose : false,
				updateAndDelete : true
			},
			dist : {
				files : [{
					src : ['**','!less/**','!partials/**'],
					cwd : '<%= project.app %>',
					dest : '<%= project.dist %>'
				},{
					src : ['bower_components/**'],
					cwd : '',
					dest : '<%= project.dist %>'
				}],
				verbose : false
			},
			cordova : {
				files : [{
					src : ['**'],
					cwd : '<%= project.dist %>',
					dest : '<%= project.cordova.dist %>/www'
				}],
				verbose : false
			},
			merges : {
				files : [{
					src : ['**'],
					cwd : '<%= project.merges %>',
					dest : '<%= project.cordova.dist %>/merges'
				}],
				verbose : false
			},
			splash : {
				files : [{
					src : ['**/screen*.png'],
					cwd : '<%= project.resources %>',
					dest : '<%= project.cordova.dist %>/res'
				}],
				verbose : false
			}
		},

		jshint : {
			options : {
				jshintrc : '.jshintrc',
				reporter : require('jshint-stylish'),
				ignores : ['**/js/lib/**/*.js','**/js/templates.js']
			},
			target : ['gruntfile.js','!<%= project.target %>/js/lib/**/*.js','<%= project.target %>/js/**/*.js'],
			dist : ['gruntfile.js','<%= project.dist %>/js/**/*.js']
		},

		useminPrepare : {
			html : '<%= project.dist %>/index.html',
			options : {
				staging : '<%= project.tmp %>'
			}
		},

		usemin : {
			html : ['<%= project.dist %>/**/*.html'],
			css : ['<%= project.dist %>/*.css'],
			options : {
				assetsDirs : ['<%= project.dist %>','<%= project.dist %>/img','<%= project.dist %>/img/*']
			}
		},

		replace : {
			css : {
				src : ['<%= project.dist %>/*.css'],
				overwrite : true,
				replacements : [{
					from : /(\.\.\/)*img/g,
					to : 'img'
				},{
					from : /(\.\.\/)*fonts/g,
					to : 'fonts'
				}]
			},
			target : appConfig.replaceTarget,
			dist : appConfig.replaceDist
		},

		filerev : {
			dist : {
				src : ['<%= project.dist %>/**/*.{png,jpg,jpeg,gif,webp,eot,ttf,woff,svg,otf,css,js}']
			}
		},

		ngAnnotate : {
			dist : {
				files : [{
					expand : true,
					cwd : '<%= project.tmp %>/concat',
					src : '*.js',
					dest : '<%= project.tmp %>/concat'
				}]
			}
		},

		htmlmin : {
			dist : {
				options : {
					collapseWhitespace : true,
					conservativeCollapse : true,
					collapseBooleanAttributes : true,
					removeCommentsFromCDATA : true,
					removeOptionalTags : true
				},
				files : [{
					expand : true,
					cwd : '<%= project.dist %>',
					src : '**/*.html',
					dest : '<%= project.dist %>'
				}]
			}
		},

		injector : {
			options : {
				addRootSlash : false
			},
			target : {
				options : {
					ignorePath : '<%= project.target %>'
				},
				files : {
					'<%= project.target %>/index.html' : ['bower.json','<%= project.target %>/js/**/*.js','<%= project.target %>/css/**/*.css']
				}
			},
			dist : {
				options : {
					ignorePath : '<%= project.dist %>'
				},
				files : {
					'<%= project.dist %>/index.html' : ['bower.json','<%= project.dist %>/js/**/main*.js','<%= project.dist %>/js/**/*.js','<%= project.dist %>/css/**/*.css']
				}
			}
		},

		less : {
			target : {
				options : {
					paths : ['<%= project.app %>/css']
				},
				files : {
					'<%= project.target %>/css/less.css' : '<%= project.app %>/less/**/*.less'
				}
			},
			dist : {
				options : {
					paths : ['<%= project.app %>/css']
				},
				files : {
					'<%= project.dist %>/css/less.css' : '<%= project.app %>/less/**/*.less'
				}
			}
		},

		multiresize : appConfig.cordova.icons,

		execute : {
			cordova : {
				src : ['customizeConfig.js']
			},
			crosswalk : {
				src : ['activateCrosswalk.js']
			}
		},

		ngtemplates : {
			target : {
				cwd : '<%= project.app %>',
				src : 'partials/**/*.html',
				dest : '<%= project.target %>/js/templates.js',
				options : {
					module : 'mylezeem'
				}
			},
			dist : {
				cwd : '<%= project.app %>',
				src : 'partials/**/*.html',
				dest : '<%= project.dist %>/js/templates.js',
				options : {
					module : 'mylezeem',
					usemin: 'all.js',
					htmlmin : {
						collapseBooleanAttributes : true,
						collapseWhitespace : true,
						removeAttributeQuotes : true,
						removeComments : true, // Only if you don't use comment directives! 
						removeEmptyAttributes : true,
						removeRedundantAttributes : true,
						removeScriptTypeAttributes : true,
						removeStyleLinkTypeAttributes : true
					}
				}
			}
		},
	});

	grunt.registerTask('fonts', 'Copy fonts', function() {
		grunt.task.run(['bower:dist','copy:dist']);
	});

	grunt.registerTask('help', 'List all available commands', function() {
		grunt.log.ok('');
		grunt.log.ok('Here are all available commands :');
		grunt.log.ok('');
		grunt.log.ok('\'grunt clean\' : clean all directories');
		grunt.log.ok('\'grunt build\' : build the web application');
		grunt.log.ok('\'grunt cordova\' : create new cordova project with plugins');
		grunt.log.ok('\'grunt crosswalk\' : add crosswalk to android cordova project');
		grunt.log.ok('\'grunt cordovacli:plugins\' : add new plugins to cordova project');
		grunt.log.ok('\'grunt build:cordova\' : build the cordova application (cordova project must be created)');
		grunt.log.ok('');
		grunt.log.ok('\'grunt start\' : deploy webapp and launch the http server in dev mode');
		grunt.log.ok('\'grunt start:dist\' : build webapp and launch the http server');
		grunt.log.ok('\'grunt start:cordova\' : build webapp and cordova app and launch in mobile (cordova project must be created)');
	});

	grunt.registerTask('crosswalk', 'Add crosswalk to android cordova project', function() {
		if (!grunt.file.isDir(appConfig.cordova.dist)) {
			grunt.fail.fatal('cordova application hasn\'t been created ! please launch "grunt cordova" first');
		}
		grunt.task.run(['execute:crosswalk']);
	});

	grunt.registerTask('deploy', 'Deploy application and launch http server', function() {
		grunt.task.run(['clean:target','bower:install','ngtemplates:target','sync:target','less:target','verifreplace:target','verifjshint:target','injector:target']);
	});

	grunt.registerTask('build', 'Build application', function(target, target2) {
		if (target === 'cordova') {
			if (!grunt.file.isDir(appConfig.cordova.dist)) {
				grunt.fail.fatal('cordova application hasn\'t been created ! please launch "grunt cordova" first');
			}
			if (!grunt.file.isDir(appConfig.dist)) {
				grunt.task.run(['build']);
			}
			grunt.task.run(['clean:cordova','sync:merges','multiresize','sync:splash','execute:cordova','sync:cordova']);
			if (target2 === 'run') {
				grunt.task.run(['cordovacli:run']);
			} else {
				grunt.task.run(['cordovacli:build']);
			}
		} else {
			grunt.task.run(['clean:dist','bower:install','sync:dist','less:dist','verifreplace:dist','verifjshint:dist','injector:dist','useminPrepare','ngtemplates:dist','concat','ngAnnotate',
					'cssmin','uglify','fonts','clean:tmp',/*'filerev',*/'usemin','replace:css','htmlmin']);
		}
	});

	grunt.registerTask('verifjshint', 'Verify if jshint is necessary', function(target) {
		if (appConfig.jshint) {
			grunt.task.run(['jshint:' + target]);
		}
	});

	grunt.registerTask('verifreplace', 'Verify if jshint is necessary', function(target) {
		if (target === 'target' && appConfig.replaceTarget) {
			grunt.task.run(['replace:target']);
		}
		if (target === 'dist' && appConfig.replaceDist) {
			grunt.task.run(['replace:dist']);
		}
	});

	grunt.registerTask('launchproxy', 'Verify if proxy is necessary', function(target) {
		if (appConfig.proxies) {
			grunt.task.run(['configureProxies:' + target]);
		}
	});

	grunt.registerTask('cordova', 'Create cordova application', function(target) {
		grunt.task.run(['clean:cordovadir','cordovacli:cordova']);
	});

	grunt.registerTask('start', 'Launch http application', function(target) {
		if (target === 'dist') {
			grunt.task.run(['build','launchproxy:dist','connect:dist:keepalive']);
		} else if (target === 'cordova') {
			grunt.task.run(['build','build:cordova:run']);
		} else {
			grunt.task.run(['deploy','launchproxy:livereload','connect:livereload','watch']);
		}
	});
};