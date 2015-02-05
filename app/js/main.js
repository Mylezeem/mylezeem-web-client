'use strict';
/* exported onLoad, onBackButtonAction, exitApp */
/* global StatusBar, loaderUtils */

function onDeviceReady() {
	StatusBar.hide();
	setTimeout(function() {
		navigator.splashscreen.hide();
	}, 1500);
}

var onBackButtonAction = null;

var onBackButton = function(e) {
	if (typeof onBackButtonAction === 'function') {
		onBackButtonAction();
	} else {
		window.history.back();
	}
};

var onKeyDown = function(event) {
	if (event.keyCode === 8 && event.altKey) {
		event.preventDefault();
		onBackButton();
	}
};

var exitApp = function() {
	if (typeof navigator.app !== 'undefined') {
		navigator.app.exitApp();
	} else {
		window.alert('exit !');
	}
};

function onLoad() {
	document.addEventListener('deviceready', onDeviceReady, false);
	document.addEventListener('backbutton', onBackButton, false);
	document.addEventListener('keydown', onKeyDown, false);

	loaderUtils.generateLoading('loading-ws-bar', ['#157199','#1B91C4']);
}