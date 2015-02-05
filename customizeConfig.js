#!/usr/bin/env node

function getPlatforms(icons, splashs) {
	var platforms = new Array();
	for (platform in icons) {
		platforms.push(platform);
	}
	for (platform in splashs) {
		platforms.push(platform);
	}
	return platforms.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
}

var fs = require('fs');
var path = require('path');
var domParser  = require('xmldom').DOMParser;

var gruntfile = path.join('gruntfile.json');
var appConfig = JSON.parse(fs.readFileSync(gruntfile, 'utf8'));
var icons = appConfig.cordova.icons;
var splashs = appConfig.cordova.splashs;

var configPath = path.join(appConfig.cordova.dist, 'config.xml');
var config = fs.readFileSync(configPath, 'utf8');
var doc = new domParser().parseFromString(config, 'text/xml');
var widget = doc.getElementsByTagName("widget")[0];

// ERASE CONFIG.XML FILE
var platforms = widget.getElementsByTagName("platform");
while (platforms.length > 0) {
    widget.removeChild(platforms[0]);
}
var preferencesTag = widget.getElementsByTagName("preference");
while (preferencesTag.length > 0) {
    widget.removeChild(preferencesTag[0]);
}
var accessTag = widget.getElementsByTagName("access");
while (accessTag.length > 0) {
    widget.removeChild(accessTag[0]);
}
var featureTag = widget.getElementsByTagName("feature");
while (featureTag.length > 0) {
    widget.removeChild(featureTag[0]);
}

//ATTRIBUTES
widget.setAttribute('version', appConfig.cordova.version);
widget.setAttribute('android-versionCode', appConfig.cordova.versionCode);

//PREFERENCES
var preferences = appConfig.cordova.preferences;
for (preference in preferences) {
	newPreference = doc.createElement("preference");
	newPreference.setAttribute('name', preferences[preference].name);
	newPreference.setAttribute('value', preferences[preference].value);
	widget.appendChild(newPreference);
}

//ACCESSES
var accesses = appConfig.cordova.access;
for (access in accesses) {
	var newAccess = doc.createElement("access");
	for (attribute in accesses[access].attributes){
		newAccess.setAttribute(accesses[access].attributes[attribute].name, accesses[access].attributes[attribute].value);
	}
	widget.appendChild(newAccess);
}

//FEATURES
var features = appConfig.cordova.features;
for (feature in features) {
	var newFeature = doc.createElement("feature");
	newFeature.setAttribute("name", features[feature].name);
	for (param in features[feature].params){
		var newParam = doc.createElement("param");
		newParam.setAttribute("name", features[feature].params[param].name);
		newParam.setAttribute("value", features[feature].params[param].value);
		newFeature.appendChild(newParam);
	}
	widget.appendChild(newFeature);
}

//PLATFORMS
var platform, newPlatform, newIcon, newSplash, iconSrc, iconSize, splashSrc, splashSize;

var platforms = getPlatforms(icons, splashs);
for (p in platforms) {
	platform = platforms[p];
	newPlatform = doc.createElement("platform");
	newPlatform.setAttribute('name', platform);
	
	if(typeof icons[platform] !== "undefined") {
		for (icon in icons[platform].dest) {
			iconSrc = icons[platform].dest[icon];
			if (fs.existsSync(path.join(appConfig.cordova.dist, iconSrc))) {
				newIcon = doc.createElement("icon");
				newIcon.setAttribute('src', iconSrc);
				if(platform==='android') {
					newIcon.setAttribute('density', iconSrc.split("-")[1].split(".")[0]);
				} else {
					iconSize = icons[platform].destSizes[icon];
					newIcon.setAttribute('width', iconSize.split("x")[0]);
					newIcon.setAttribute('height', iconSize.split("x")[1]);
				}
				newPlatform.appendChild(newIcon);
			}
		}
	}
	if(typeof splashs[platform] !== "undefined") {
		for (splash in splashs[platform].dest) {
			splashSrc = splashs[platform].dest[splash];
			if (fs.existsSync(path.join(appConfig.cordova.dist, splashSrc))) {
				newSplash = doc.createElement("splash");
				newSplash.setAttribute('src', splashSrc);
				if(platform==='android') {
					newSplash.setAttribute('density', splashs[platform].destSizes[splash]);
				} else {
					splashSize = splashs[platform].destSizes[splash];
					newSplash.setAttribute('width', splashSize.split("x")[0]);
					newSplash.setAttribute('height', splashSize.split("x")[1]);
				}
				newPlatform.appendChild(newSplash);
			}
		}
	}
	widget.appendChild(newPlatform);
}

fs.writeFileSync(configPath, doc, 'utf8');