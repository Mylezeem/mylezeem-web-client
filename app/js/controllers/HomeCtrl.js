'use strict';
/* global controllers, CONFIG, TOOLSLIST, Tool, ACTIONSLIST, Action */

/* Home Controllers */
controllers.controller('HomeCtrl', ['$scope','$famous','UiHelper','Logger',function($scope, $famous, UiHelper, Logger) {

	/** ***** */
	/* Famous */
	/** ***** */

	var Transitionable = $famous['famous/transitions/Transitionable'];
	var SnapTransition = $famous['famous/transitions/SnapTransition'];
	Transitionable.registerMethod('spring', SnapTransition);
	var Transform = $famous['famous/core/Transform'];
	var Timer = $famous['famous/utilities/Timer'];
	var EventHandler = $famous['famous/core/EventHandler'];

	/** ************* */
	/* Initialization */
	/** ************* */

	var logger = Logger.getInstance('HomeCtrl');

	var init = function() {
		initTools();
		initActions();
	};

	var dragTimer = null;

	var deltaX = null;
	var deltaY = null;
	var posX = null;
	var posY = null;

	$scope.myEventHandler = new EventHandler();

	$scope.tileOnDrag = null;
	$scope.tileOnHoverIndex = null;

	/** ********* */
	/* UI Methods */
	/** ********* */

	$scope.headerFooterLayoutOptions = {
		direction : 1,
		headerSize : $scope.headerHeight,
		footerSize : $scope.footerHeight
	};

	$scope.onResize = function() {
		$scope.drawScreen();
		$scope.headerFooterLayoutOptions.headerSize = $scope.headerHeight;
		$scope.headerFooterLayoutOptions.footerSize = $scope.footerHeight;
	};

	/** ************* */
	/* Events Methods */
	/** ************* */

	$scope.touchMove = function($event) {
		if ($scope.toolOnDrag !== null) {
			posY = $event.touches[0].clientY;
			posX = $event.touches[0].clientX;
			logger.info('touchMove [' + posX + ',' + posY + ']');
			$scope.toolOnDrag.position.set([posX + deltaX,posY + deltaY,20]);
			// $scope.tileOnHoverIndex = $scope.getIndex(posX + deltaX +
			// $scope.tileWidth / 2, posY + deltaY + $scope.tileWidth / 2,
			// $scope.tiles, $scope.addServiceTile);
		}
	};

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
				'image' : TOOLSLIST[i].image,
				'refreshPosition' : refreshToolPosition,
				'touchStart' : onTouchStartTool,
				'touchEnd' : onTouchEndTool,
				'transform' : transformTool,
				'animate' : animateTool
			});
			tools.push(tool);
		}
		$scope.tools = tools;
	};

	var refreshToolPosition = function(i) {
		var isInstanciated = this instanceof Tool;
		var transitionable = new Transitionable($scope.getPosition(isInstanciated ? this.index : i));

		if (isInstanciated) {
			this.position = transitionable;
		}
		return transitionable;
	};

	var transformTool = function() {
		var position = this.position.get();
		return Transform.translate(position[0], position[1], position[2]);
	};

	var animateTool = function() {
		logger.info('animateTool');
		this.position.set($scope.getPosition(this.index), {
			method : 'spring',
			period : 200,
			velocity : [0,0,0]
		}, function() {
			this.classname = 'draggable';
			this.clickable = true;
		}.bind(this));
	};

	var activateDragMode = function($event, t) {
		logger.info('activateDragMode');
		// navigator.vibrate(50);
		var position = t.position.get();
		deltaX = position[0] - $event.touches[0].clientX;
		deltaY = position[1] - $event.touches[0].clientY;
		$scope.myEventHandler = new EventHandler();
		$scope.toolOnDrag = t;
		$scope.toolOnDrag.classname = 'onDrag';
		$scope.toolOnDrag.position.set([position[0],position[1],position[2]]);
	};

	var onTouchStartTool = function($event) {
		logger.info('onTouchStartTool');
		var tool = this;
		dragTimer = Timer.setTimeout(function() {
			$scope.$apply(activateDragMode($event, tool));
		}, CONFIG.TIME_TO_DRAG);
	};

	var onTouchEndTool = function() {
		logger.info('onTouchEndTool');
		Timer.clear(dragTimer);
		if ($scope.toolOnDrag !== null) {
			if (($scope.toolOnHoverIndex === null) || ($scope.toolOnHoverIndex === $scope.toolOnDrag.index)) {
				$scope.toolOnDrag.animate();
			}
			$scope.toolOnHoverIndex = null;
			$scope.toolOnDrag = null;
		}
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