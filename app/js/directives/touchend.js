'use strict';
/* global directives */
/* jshint evil: true */

directives.directive('ngTouchend', function() {
	return {
		controller : function($scope, $element, $attrs) {
			function onTouchEnd($event) {
				var method = eval('$scope.' + $element.attr('ng-touchend'));
				if (typeof method !== 'undefined') {
					$scope.$apply(function() {
						method($event);
					});
				}
			}
			$element.bind('touchend', onTouchEnd);
		}
	};
});