'use strict';
/* exported Tool, addClassname */

function Tool(t) {

	this.id = t.id;
	this.index = t.index;

	this.title = t.title;
	this.description = t.description;
	this.icon = t.icon;

	this.classname = t.classname;

	this.position = t.position;
}