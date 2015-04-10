'use strict';
/* exported Tool, addClassname */

function Tool(t) {

	this.id = t.index;
	this.index = t.index;

	this.title = t.title;
	this.description = t.description;
	this.icon = t.icon;

	this.classname = t.classname;

	if (t.refreshPosition) {
		this.refreshPosition = t.refreshPosition.bind(this);
		this.position = t.refreshPosition(t.index);
	}

	if (t.touchStart) {
		this.touchStart = t.touchStart.bind(this);
	}
	if (t.touchEnd) {
		this.touchEnd = t.touchEnd.bind(this);
	}
	if (t.transform) {
		this.transform = t.transform.bind(this);
	}

	if (t.animate) {
		this.animate = t.animate.bind(this);
	}
}