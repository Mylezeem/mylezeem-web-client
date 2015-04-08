'use strict';
/* global controllers, TOOLSLIST, Tool, ACTIONSLIST, Action, CONFIG */

/* Home Controllers */
controllers.controller('HomeCtrl', ['$scope','UiHelper','Logger',function($scope, UiHelper, Logger) {

	/** ************* */
	/* Initialization */
	/** ************* */

	var logger = Logger.getInstance('HomeCtrl');

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

	$scope.touchMove = function($event) {
		if ($scope.toolOnDrag !== null) {
			posY = $event.originalEvent.touches[0].clientY;
			posX = $event.originalEvent.touches[0].clientX;
			logger.debug('touchMove : ' + (posX + deltaX) + '/' + (posY + deltaY) + '/0');
			$scope.toolOnDrag.position = [posX + deltaX,posY + deltaY,0];
		}
	};

	/** ************* */
	/* Events Methods */
	/** ************* */

	/** ********* */
	/* Tools menu */
	/** ********* */

	var deltaX, deltaY, posX, posY;

	$scope.toolOnDrag = null;

	var dragTimer = null;

	var activateDragMode = function($event, t) {
		logger.debug('activateDragMode : ' + t.title);
		navigator.vibrate(50);
		var position = t.position;
		deltaX = position[0] - $event.originalEvent.touches[0].clientX;
		deltaY = position[1] - $event.originalEvent.touches[0].clientY;
		$scope.toolOnDrag = t;
		$scope.toolOnDrag.classname = 'onDrag';
		$scope.toolOnDrag.position = [position[0],position[1]];
	};

	var animateTool = function() {
		var position = $scope.getToolPosition(this.index);
		logger.debug('animateTool : \'' + this.title + '\' on position ' + position[0] + '/' + position[1]);
		$('#tool' + this.id).velocity({
			left : position[0],
			top : position[1] + $scope.headerHeight,
		}, {
			duration : 950,
			easing : 'spring',
			complete : function() {
				var t = this;
				$scope.$apply(function() {
					t.classname = 'draggable';
					t.clickable = true;
					t.position = position;
				});
			}.bind(this)
		});
	};

	var refreshToolPosition = function(i) {
		var isInstanciated = this instanceof Tool;
		var position = $scope.getToolPosition(isInstanciated ? this.index : i);
		if (isInstanciated) {
			this.position = position;
		}
		return position;
	};

	var onTouchStartTool = function($event) {
		logger.debug('onTouchStartTool');
		var tool = this;
		dragTimer = setTimeout(function() {
			$scope.$apply(activateDragMode($event, tool));
		}, CONFIG.TIME_TO_DRAG);
	};

	var onTouchEndTool = function() {
		logger.debug('onTouchEndTool');
		clearTimeout(dragTimer);
		if ($scope.toolOnDrag !== null) {
			var isAboveGrid = $scope.isAboveGrid($scope.toolOnDrag.position);
			logger.debug('is above grid : ' + isAboveGrid);
			if (isAboveGrid) {

			} else {
				$scope.toolOnDrag.animate();
			}
			$scope.toolOnDrag = null;
		}
	};

	var initTools = function() {
		var tool;
		var tools = [];
		for (var i = 0; i < TOOLSLIST.length; i++) {
			tool = new Tool({
				'index' : i,
				'title' : TOOLSLIST[i].title,
				'description' : TOOLSLIST[i].description,
				'image' : TOOLSLIST[i].image,
				'refreshPosition' : refreshToolPosition,
				'touchStart' : onTouchStartTool,
				'touchEnd' : onTouchEndTool,
				'animate' : animateTool
			});
			tools.push(tool);
		}
		$scope.tools = tools;
	};

	/** *********** */
	/* Actions menu */
	/** *********** */

	var refreshActionPosition = function(i) {
		var isInstanciated = this instanceof Action;
		var position = $scope.getActionPosition(isInstanciated ? this.index : i);
		if (isInstanciated) {
			this.position = position;
		}
		return position;
	};

	var initActions = function() {
		var action;
		var actions = [];
		for (var i = 0; i < ACTIONSLIST.length; i++) {
			action = new Action({
				'index' : i,
				'title' : ACTIONSLIST[i].title,
				'description' : ACTIONSLIST[i].description,
				'image' : ACTIONSLIST[i].image,
				'refreshPosition' : refreshActionPosition
			});
			actions.push(action);
		}
		$scope.actions = actions;
	};

	init();
}]);