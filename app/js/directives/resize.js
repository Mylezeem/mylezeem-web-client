'use strict';
/* global directives */

directives.directive('resize', ['$window',function($window) {
	return {
		link : function(scope, elem, attrs) {
			angular.element($window).unbind('resize');
			angular.element($window).bind('resize', function() {
				scope.$apply(scope.onResize());
			});
		}
	};
}]);