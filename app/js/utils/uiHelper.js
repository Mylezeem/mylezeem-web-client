'use strict';
/* global services, UICONFIG */

services.factory('UiHelper', ['$rootScope','$location','$window',function($rootScope, $location, $window) {

	$rootScope.goTo = function(path) {
		$location.path(path);
	};

	$rootScope.goToHome = function() {
		$location.path('/home');
	};

	$rootScope.goToSettings = function() {
		$location.path('/settings');
	};

	$rootScope.drawScreen = function() {
		$rootScope.windowWidth = window.innerWidth;
		$rootScope.windowHeight = window.innerHeight;
		$rootScope.isPortrait = $rootScope.windowHeight > $rootScope.windowWidth;

		// Header / Footer
		var headerHeight = UICONFIG.STANDARD_HEADER_HEIGHT;
		var footerHeight = UICONFIG.STANDARD_FOOTER_HEIGHT;
		if ($rootScope.windowHeight < UICONFIG.MIN_WINDOW_HEIGHT_AS_STANDARD) {
			headerHeight = $rootScope.windowHeight * UICONFIG.SMALL_HEADER_HEIGHT_PERCENT / 100;
			if (headerHeight < UICONFIG.HEADER_MIN_HEIGHT) {
				headerHeight = UICONFIG.HEADER_MIN_HEIGHT;
			}
			footerHeight = $rootScope.windowHeight * UICONFIG.SMALL_FOOTER_HEIGHT_PERCENT / 100;
			if (footerHeight < UICONFIG.FOOTER_MIN_HEIGHT) {
				footerHeight = UICONFIG.FOOTER_MIN_HEIGHT;
			}
		}
		$rootScope.headerHeight = Math.floor(headerHeight);
		$rootScope.footerHeight = Math.floor(footerHeight);

		// Action / Tool menus
		var toolMenuWidth = UICONFIG.STANDARD_TOOL_MENU_WIDTH;
		var actionMenuWidth = UICONFIG.STANDARD_ACTION_MENU_WIDTH;
		if ($rootScope.windowWidth < UICONFIG.MIN_WINDOW_WIDTH_AS_STANDARD) {
			toolMenuWidth = $rootScope.windowWidth * UICONFIG.SMALL_TOOL_MENU_WIDTH_PERCENT / 100;
			if (toolMenuWidth < UICONFIG.TOOL_MENU_MIN_WIDTH) {
				toolMenuWidth = UICONFIG.TOOL_MENU_MIN_WIDTH;
			}
			actionMenuWidth = $rootScope.windowWidth * UICONFIG.SMALL_ACTION_MENU_WIDTH_PERCENT / 100;
			if (actionMenuWidth < UICONFIG.ACTION_MENU_MIN_WIDTH) {
				actionMenuWidth = UICONFIG.ACTION_MENU_MIN_WIDTH;
			}
		}
		$rootScope.toolMenuWidth = Math.floor(toolMenuWidth);
		$rootScope.actionMenuWidth = Math.floor(actionMenuWidth);
	};

	$rootScope.getPosition = function(i) {
		var x = 0;
		var y = i * 85;
		return [x,y,1];
	};

	$rootScope.drawScreen();

	return null;
}]);