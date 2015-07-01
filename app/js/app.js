'use strict';
/* exported directives, controllers, services, providers */
/* global CONFIG, FastClick */

var directives = angular.module('mylezeem.directives', []);
var controllers = angular.module('mylezeem.controllers', []);
var services = angular.module('mylezeem.services', []);
var providers = angular.module('mylezeem.providers', []);

angular.module('mylezeem', ['mylezeem.services','mylezeem.controllers','mylezeem.directives','mylezeem.providers','ngRoute','ngSanitize','draganddrop'])

.config(['$routeProvider','$httpProvider','LoggerProvider',function($routeProvider, $httpProvider, LoggerProvider) {
	// Enable/Disable logs
	LoggerProvider.enabled(CONFIG.DEBUG);
	// App pages
	$routeProvider.when('/home', {
		templateUrl : 'partials/home.html',
		controller : 'HomeCtrl',
		resolve : {
			edit : function() {
				return false;
			}
		}
	})
	// Default page
	.otherwise({
		redirectTo : '/home'
	});
}]).run(function($rootScope, $location, LocalStorageHelper) {
	FastClick.attach(document.body);
}).filter('unsafe', function($sce) {
	return $sce.trustAsHtml;
});
