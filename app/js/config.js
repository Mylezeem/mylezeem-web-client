'use strict';

/* exported CONFIG, UICONFIG */

var CONFIG = {
	// Replace by 'true'(Target), 'false'(Dist) with grunt replace plugin
	DEBUG : 'ENABLE_DEBUG',
	LOCAL_STORAGE_MAX_MINUTES_TO_CACHE : '60',
	TIME_TO_DRAG : 500
};

var UICONFIG = {
	// Header / Footer
	MIN_WINDOW_HEIGHT_AS_STANDARD : 500,
	STANDARD_HEADER_HEIGHT : 50,
	STANDARD_FOOTER_HEIGHT : 20,
	SMALL_HEADER_HEIGHT_PERCENT : 10,
	SMALL_FOOTER_HEIGHT_PERCENT : 5,
	HEADER_MIN_HEIGHT : 25,
	FOOTER_MIN_HEIGHT : 15,
	// Action / Tool menus
	MIN_WINDOW_WIDTH_AS_STANDARD : 600,
	STANDARD_TOOL_MENU_WIDTH : 75,
	STANDARD_ACTION_MENU_WIDTH : 75,
	SMALL_TOOL_MENU_WIDTH_PERCENT : 10,
	SMALL_ACTION_MENU_WIDTH_PERCENT : 10,
	TOOL_MENU_MIN_WIDTH : 35,
	ACTION_MENU_MIN_WIDTH : 35
};