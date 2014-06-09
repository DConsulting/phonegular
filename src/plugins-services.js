'use strict';

angular.module('phonegular.plugins.services')
// 1. We probably want arguments to be 1-1 with the plugin methods
// 2. We don't want this to require rewrite on phonegap change, so not sure about #1.

/**
 * https://github.com/apache/cordova-plugin-dialogs/blob/master/doc/index.md
 */
.run(function dialogs() {
	if (notification.alert) window.alert = notification.alert;
})

/**
 * Battery Status
 * https://github.com/apache/cordova-plugin-battery-status/blob/master/doc/index.md
 */
 // Missing - no methods.
 // TODO: Dispatch notifications via the root scope.

/**
 * https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
 */
.service('camera', ['$q', '$timeout', function camera($q, $timeout) {

	this.getPicture = function getPicture(cameraOptions) {
		var def = $q.defer();

		var onSuccess = function(imageData) {
			$timeout(function() { // iOS alert issue fix
				def.resolve(imageData);
			});
		};

		var onFail = function(message) {
			$timeout(function() { // iOS alert issue fix
				def.reject(message);
			});
		};

		def.promise.popoverHandle = navigator.camera.getPicture(onSuccess, onFail, cameraOptions);

		return def.promise;
	};

	this.cleanup = function cleanup() {
		var def = $q.defer();

		var onSuccess = function() {
			$timeout(def.resolve);
		};

		var onFail = function(message) {
			$timeout(function() { def.reject(message); });
		};

		navigator.camera.cleanup(onSuccess, onFail);

		return def.promise;
	};
}])

/**
 * https://github.com/apache/cordova-plugin-contacts/blob/master/doc/index.md
 *
 * TODO: Wrap the contact object
 */

.service('contacts', ['$q', '$timeout', function contacts($q, $timeout) {

	// TODO: We prbably need a asynchronious version too.
	this.create = function create(contactData) {
		var newContant = navigator.contacts.create(contactData);

		return newContant;
	};

	this.find = function find(contactFields, contactFindOptions, filter, multiple) {
		// Update to match the default values
		if (filter === undefined) filter = '';
		if (multiple === undefined) multiple = false;

		var def = $q.defer();

		var onSuccess = function(contacts) {
			def.resolve(contacts);
		};

		var onFail = function(contactError) {
			def.reject(contactError);
		};

		navigator.contacts.find(onSuccess, onFail, contactFields, contactFindOptions, filter, multiple);

		return def.promise;
	};

	this.pickContact = function pickContact() {
		var def = $.defer();

		navigator.contacts.pickContact(def.resolve, def.reject);
		return def.promise;
	};
}])

/**
 * https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md
 */
.factory('device', [function device() {
	return window.device;
}])

/**
 * https://github.com/apache/cordova-plugin-device-motion/blob/master/doc/index.md
 */
.service('accelerometer', ['$q', '$timeout', function accelerometer($q, $timeout) {

	this.getCurrentAcceleration = function getCurrentAcceleration() {
		var def = $q.defer();

		navigator.accelerometer.getCurrentAcceleration(def.resolve, def.reject);
		return def.promise;
	};

	this.watchAcceleration = function watchAcceleration(accelerometerSuccess, accelerometerError, accelerometerOptions) {
		// TODO: Figure out method structure.

		var onSuccess = function() {
			$timeout(accelerometerSuccess);
		};

		var onFail = function() {
			$timeout(accelerometerError);
		};

		return navigator.accelerometer.watchAcceleration(onSuccess, onFail, accelerometerOptions);
	};

	this.clearWatch = function clearWatch(watchID) {
		navigator.accelerometer.clearWatch(watchID);
	};
}])

/**
 * https://github.com/apache/cordova-plugin-device-orientation/blob/master/doc/index.md
 */
.service('compass', [function compass(){
	this.getCurrentHeading = function() {
		var def = $q.defer();

		navigator.accelerometer.getCurrentAcceleration(def.resolve, def.reject);
		return def.promise;
	};

	this.watchHeading = function(compassSuccess, compasError, compassOptions) {
		var onSuccess = function() {
			$timeout(compassSuccess);
		};

		var onFail = function() {
			$timeout(compasError);
		};

		return navigator.compass.watchHeading(onSuccess, onFail, compassOptions);
	};

	this.clearWatch = function(watchID) {
		navigator.compass.clearWatch(watchID);
	};
}])

.service('notification', ['$q', '$timeout' , function notification($q, $timeout){
	
}])

// TODO: Complete