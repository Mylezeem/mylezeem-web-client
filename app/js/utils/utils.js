'use strict';
/* exported utils */

function utils() {
}

/**
 * Test if param is null or undefined in web situation, undefined is an object
 * but in mobile undefined is a string
 */
utils.prototype.isNull = function(param) {
	return (param === null || param === undefined || param === 'undefined');
};

/**
 * Test if param is empty
 */
utils.prototype.isEmpty = function(param) {
	return utils.isNull(param) || param === '';
};

/**
 * Test if app is running on browser or device
 */
utils.prototype.isMobile = {
	Android : function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry : function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS : function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera : function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows : function() {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any : function() {
		return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
	}
};

utils.prototype.arraySwap = function(array, x, y) {
	var b = array[x];
	array[y].classname = 'onDrag';
	array[x] = array[y];
	array[y] = b;
	array[x].index = x;
	array[y].index = y;
	array[x].animate();
	array[y].animate();
	return array;
};

utils.prototype.arraySpliceAndAnimate = function(array, index) {
	array.splice(index, 1);
	for (var i = index; i < array.length; i++) {
		array[i].index -= 1;
		array[i].animate();
	}
	return array;
};

var utils = new utils();