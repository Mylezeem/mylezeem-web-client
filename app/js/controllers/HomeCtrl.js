'use strict';
/* global controllers */

/* Home Controllers */
controllers.controller('HomeCtrl', ['$scope','$famous','UiHelper','Logger',function($scope, $famous, UiHelper, Logger) {

	/** ************* */
	/* Initialization */
	/** ************* */

	var logger = Logger.getInstance('HomeCtrl');
	logger.info('debut des logs');

	/** ********* */
	/* UI Methods */
	/** ********* */

	$scope.headerFooterLayoutOptions = {
		direction : 1,
		headerSize : $scope.headerHeight,
		footerSize : $scope.footerHeight
	};

	$scope.contentLayoutOptions = {
		direction : 0,
		headerSize : $scope.toolMenuWidth,
		footerSize : $scope.actionMenuWidth
	};

	$scope.onResize = function() {
		$scope.drawScreen();
		$scope.headerFooterLayoutOptions.headerSize = $scope.headerHeight;
		$scope.headerFooterLayoutOptions.footerSize = $scope.footerHeight;
		$scope.contentLayoutOptions.headerSize = $scope.toolMenuWidth;
		$scope.contentLayoutOptions.footerSize = $scope.actionMenuWidth;
	};

}]);