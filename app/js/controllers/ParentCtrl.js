'use strict';
/* global controllers, onBackButtonAction:true, LABELS */

/* Parent Controller */
controllers.controller('ParentCtrl', ['$scope','$timeout',function($scope, $timeout) {

	$scope.exitApp = function() {
		$scope.$apply(function() {
			$scope.$emit('showPopover', {
				message : LABELS.QUIT_APP,
				confirmCallback : function() {
					if (typeof navigator.app !== 'undefined') {
						navigator.app.exitApp();
					} else {
						window.alert('exit !');
					}
				}
			});
		});
	};

	$scope.closePopover = function() {
		onBackButtonAction = $scope.onBackButtonActionSave;
		delete $scope.popover;
	};

	$scope.$on('showPopover', function(event, popover) {
		$scope.popover = popover;
		$scope.onBackButtonActionSave = onBackButtonAction;
		onBackButtonAction = function() {
			$scope.$apply($scope.closePopover);
		};
	});
}]);