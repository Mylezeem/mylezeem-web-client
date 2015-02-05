'use strict';
/* global controllers */

/* Home Controllers */
controllers.controller('HomeCtrl', ['$scope','$famous','Logger',function($scope, $famous, Logger) {

	var logger = Logger.getInstance('HomeCtrl');
	logger.info('debut des logs');

}]);