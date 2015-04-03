'use strict';
/* global directives */
/* jshint evil: true */

directives.directive('ngTouchstart', function() {
	return {
		controller : function($scope, $element, $attrs) {
			function onTouchStart($event) {
				var method = eval('$scope.' + $element.attr('ng-touchstart'));
				if (typeof method !== 'undefined') {
					$scope.$apply(function() {
						method($event);
					});
				}
			}
			$element.bind('touchstart', onTouchStart);
		}
	};
});