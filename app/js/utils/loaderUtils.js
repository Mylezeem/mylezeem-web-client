'use strict';
/* global Spinner:false */
/* exported loaderUtils */

function LoaderUtils() {
}

/**
 * Generate the spin loader
 */
LoaderUtils.prototype.generateLoading = function(domElementId, spinnerColor) {

	var opts = {
		lines : 12, // The number of lines to draw
		length : 15, // The length of each line
		width : 15, // The line thickness
		radius : 30, // The radius of the inner circle
		corners : 1, // Corner roundness (0..1)
		rotate : 0, // The rotation offset
		direction : 1, // 1: clockwise, -1: counterclockwise
		color : spinnerColor, // #rgb or #rrggbb or array of colors
		speed : 1, // Rounds per second
		trail : 90, // Afterglow percentage
		shadow : true, // Whether to render a shadow
		hwaccel : true, // Whether to use hardware acceleration
		className : 'spinner', // The CSS class to assign to the spinner
		zIndex : 2e9, // The z-index (defaults to 2000000000)
		top : '50%', // Top position relative to parent in px
		left : '50%' // Left position relative to parent in px
	};

	new Spinner(opts).spin(document.getElementById(domElementId));
};

/**
 * show the loader
 */
LoaderUtils.prototype.showLoader = function() {
	$('#loading-ws-bar, #loading-ws-background-page').show();
};

/**
 * hide the loader
 */
LoaderUtils.prototype.hideLoader = function() {
	$('#loading-ws-bar, #loading-ws-background-page').hide();
};

var loaderUtils = new LoaderUtils();