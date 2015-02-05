#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var domParser  = require('xmldom').DOMParser;

var gruntfile = path.join('gruntfile.json');
var appConfig = JSON.parse(fs.readFileSync(gruntfile, 'utf8'));

var androidManifestPath = path.join(appConfig.cordova.dist, 'platforms/android/AndroidManifest.xml');
var androidManifest = fs.readFileSync(androidManifestPath, 'utf8');
var doc = new domParser().parseFromString(androidManifest, 'text/xml');
var manifest = doc.getElementsByTagName("manifest")[0];

// ERASE AndroidManifest FILE
var usesPermissions = manifest.getElementsByTagName("uses-permission");
while (usesPermissions.length > 0) {
	manifest.removeChild(usesPermissions[0]);
}

// USES PERMISSIONS
var permissions = ['INTERNET', 'ACCESS_WIFI_STATE', 'ACCESS_NETWORK_STATE']
for (var i = 0; i < permissions.length; i++) {
	newUsesPermission = doc.createElement('uses-permission');
	newUsesPermission.setAttribute('android:name', 'android.permission.' + permissions[i]);
	manifest.appendChild(newUsesPermission);
}
fs.writeFileSync(androidManifestPath, doc, 'utf8');

require('shelljs/global');

rm(appConfig.cordova.dist + '/platforms/android/VERSION');
cp('../tools/' + appConfig.crosswalk + '/VERSION', appConfig.cordova.dist + '/platforms/android');
rm('-rf','cordova/platforms/android/CordovaLib/*');
cp('-r','../tools/' + appConfig.crosswalk + '/framework/*', appConfig.cordova.dist + '/platforms/android/CordovaLib');
cd(appConfig.cordova.dist + '/platforms/android/CordovaLib');
exec('android update project --subprojects --path . --target "android-19"');
cd('xwalk_core_library');
exec('ant debug');
cd('../');
exec('ant debug');