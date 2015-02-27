'use strict';
/* global controllers, TOOLSLIST, Tool, ACTIONSLIST, Action */

/* Home Controllers */
controllers.controller('HomeCtrl', ['$scope','UiHelper','Logger',function($scope, UiHelper, Logger) {

	/** ************* */
	/* Initialization */
	/** ************* */

	// var logger = Logger.getInstance('HomeCtrl');
	var init = function() {
		initTools();
		initActions();
	};

	/** ********* */
	/* UI Methods */
	/** ********* */

	$scope.onResize = function() {
		$scope.drawScreen();
	};

	/** ************* */
	/* Events Methods */
	/** ************* */

	/** ********* */
	/* Tools menu */
	/** ********* */

	var initTools = function() {
		var tool;
		var tools = [];
		for (var i = 0; i < TOOLSLIST.length; i++) {
			tool = new Tool({
				'index' : i,
				'title' : TOOLSLIST[i].title,
				'description' : TOOLSLIST[i].description,
				'image' : TOOLSLIST[i].image
			});
			tools.push(tool);
		}
		$scope.tools = tools;
	};

	/** *********** */
	/* Actions menu */
	/** *********** */

	var initActions = function() {
		var action;
		var actions = [];
		for (var i = 0; i < ACTIONSLIST.length; i++) {
			action = new Action({
				'index' : i,
				'title' : ACTIONSLIST[i].title,
				'description' : ACTIONSLIST[i].description,
				'image' : ACTIONSLIST[i].image
			});
			actions.push(action);
		}
		$scope.actions = actions;
	};

	init();
}]);