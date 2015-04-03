'use strict';
/* global controllers, TOOLSLIST, Tool, ACTIONSLIST, Action, CONFIG */

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

	$scope.touchMove = function($event) {
		if ($scope.toolOnDrag !== null) {
			posY = $event.originalEvent.touches[0].clientY;
			posX = $event.originalEvent.touches[0].clientX;
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
		navigator.vibrate(50);
		var position = t.position;
		deltaX = position[0] - $event.originalEvent.touches[0].clientX;
		deltaY = position[1] - $event.originalEvent.touches[0].clientY;
		$scope.toolOnDrag = t;
		$scope.toolOnDrag.classname = 'onDrag';
		$scope.toolOnDrag.position = [position[0],position[1]];
	};

	var animateTool = function() {
		var position = $scope.getPosition(this.index);
		$('#tool' + this.id).velocity({
			left : position[0],
			top : position[1],
		}, {
			duration : 750,
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
		var position = $scope.getPosition(isInstanciated ? this.index : i);
		if (isInstanciated) {
			this.position = position;
		}
		return position;
	};

	var onTouchStartTool = function($event) {
		var tool = this;
		dragTimer = setTimeout(function() {
			$scope.$apply(activateDragMode($event, tool));
		}, CONFIG.TIME_TO_DRAG);
	};

	var onTouchEndTool = function() {
		clearTimeout(dragTimer);
		if ($scope.toolOnDrag !== null) {
			$scope.toolOnDrag.animate();
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