'use strict';
/* exported Action */

function Action(a) {

	this.id = a.index;
	this.index = a.index;

	this.title = a.title;
	this.description = a.description;
	this.image = a.image;

	this.classname = a.classname;

	if (a.refreshPosition) {
		this.refreshPosition = a.refreshPosition.bind(this);
		this.position = a.refreshPosition(a.index);
	}

	if (a.touchStart) {
		this.touchStart = a.touchStart.bind(this);
	}
	if (a.touchEnd) {
		this.touchEnd = a.touchEnd.bind(this);
	}
	if (a.transform) {
		this.transform = a.transform.bind(this);
	}

	if (a.animate) {
		this.animate = a.animate.bind(this);
	}
}