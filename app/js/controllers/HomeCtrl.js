'use strict';
/* global controllers, TOOLSLIST, Tool, ACTIONSLIST, Action, LABELS */

/* Home Controllers */
controllers.controller('HomeCtrl', ['$scope','UiHelper','Logger','$controller','$filter',function($scope, UiHelper, Logger, $controller, $filter) {

	/** ************* */
	/* Initialization */
	/** ************* */

	var logger = Logger.getInstance('HomeCtrl');

	// instantiate parent controller :: extends
	$controller('ParentCtrl', {
		$scope : $scope
	});

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

	$scope.onClickConfigButton = function() {
		$scope.$emit('showPopover', {
			message : LABELS.POPOVER_NOT_IMPLEMENTED
		});
	};

	$scope.onClickInfoButton = function() {
		$scope.$emit('showPopover', {
			message : LABELS.POPOVER_NOT_IMPLEMENTED
		});
	};

	$scope.onClickSaveButton = function() {
		$scope.$emit('showPopover', {
			message : LABELS.POPOVER_NOT_IMPLEMENTED
		});
	};

	$scope.onClickDeleteButton = function() {
		$scope.$emit('showPopover', {
			message : LABELS.POPOVER_NOT_IMPLEMENTED
		});
	};

	$scope.onClickActionButton = function(actionId) {
		$scope.$emit('showPopover', {
			message : LABELS.POPOVER_NOT_IMPLEMENTED
		});
	};

	/** ********* */
	/* Tools menu */
	/** ********* */

	var refreshToolPosition = function(i) {
		var isInstanciated = this instanceof Tool;
		var position = $scope.getToolPosition(isInstanciated ? this.index : i);
		if (isInstanciated) {
			this.position = position;
		}
		return position;
	};

	var initTools = function() {

		// Init template tools

		var tool;
		var tools = [];
		for (var i = 0; i < TOOLSLIST.length; i++) {
			tool = new Tool({
				'id' : i,
				'index' : i,
				'title' : TOOLSLIST[i].title,
				'description' : TOOLSLIST[i].description,
				'icon' : TOOLSLIST[i].icon,
				'classname' : 'white-color',
				'position' : $scope.getToolPosition(i)
			});
			tools.push(tool);
		}
		$scope.tools = tools;

		// Init selected tool elements

		$scope.toolElements = [];
	};

	$scope.onClickTool = function(toolIdx) {

		var elem;

		elem = new Tool({
			'id' : toolIdx + '-' + $filter('date')(new Date(), 'yyyyMMddsss'),
			'index' : toolIdx,
			'title' : TOOLSLIST[toolIdx].title,
			'description' : TOOLSLIST[toolIdx].description,
			'icon' : TOOLSLIST[toolIdx].icon,
			'classname' : 'default-color',
			'position' : $scope.getToolElementPosition()
		});

		logger.debug('onClickTool : create tool ' + elem.id);

		$scope.toolElements.push(elem);
	};

	$scope.onDropTool = function(data, event) {
		var toolElem = $filter('filter')($scope.toolElements, function(d) {
			return d.id === data['json/tool'].id;
		})[0];
		toolElem.position = [event.offsetX,event.offsetY,1];
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