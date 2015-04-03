'use strict';
/* global directives */
/* jshint evil: true */

directives.directive('ngTouchmove', function() {
	return {
		controller : function($scope, $element, $attrs) {
			function onTouchMove($event) {
				var method = '$scope.' + $element.attr('ng-touchmove');
				$scope.$apply(function() {
					eval(method);
				});
			}
			$element.bind('touchmove', onTouchMove);
		}
	};
});