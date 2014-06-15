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
	this.getCurrentHeading = function getCurrentHeading() {
		var def = $q.defer();

		navigator.compass.getCurrentAcceleration(def.resolve, def.reject);
		return def.promise;
	};

	this.watchHeading = function watchHeading(compassSuccess, compasError, compassOptions) {
		var onSuccess = function() {
			$timeout(compassSuccess);
		};

		var onFail = function() {
			$timeout(compasError);
		};

		return navigator.compass.watchHeading(onSuccess, onFail, compassOptions);
	};

	this.clearWatch = function clearWatch(watchID) {
		navigator.compass.clearWatch(watchID);
	};
}])

/**
 * https://github.com/apache/cordova-plugin-dialogs/blob/master/doc/index.md
 */
.service('notification', ['$q', '$timeout' , function notification($q, $timeout) {
	this.alert = function alert(message, title, buttonName) {
		var def = $q.defer();

		if (navigator.notification) {
			navigator.notification.alert(message, function() {
				$timeout(def.resolve);
			}, title, buttonName);
		}
		else {
			window.alert(message);
			def.resolve();
		}

		return def.promise;
	};

	this.confirm = function confirm(message, title, buttonLabels) {
		var def = $q.defer();

		if (navigator.notification) {
			navigator.notification.confirm(message, function() {
				$timeout(def.resolve);
			}, title, buttonLabels);
		}
		else {
			var confirmResult = window.confirm(message);
			def.resolve(confirmResult ? 1 : 2);
		}

		return def.promise;
	};

	this.prompt = function prompt(message, title, buttonLabels, defaultText) {
		var def = $q.defer();

		if (navigator.notification) {
			navigator.notification.prompt(message, function() {
				$timeout(def.resolve);
			}, title, buttonLabels, defaultText);
		}
		else {
			var enteredVvalue = window.prompt(message, defaultText)

			def.resolve(enteredVvalue);
		}

		return def.promise;
	};

	this.beep = function beep(times) {
		navigator.notification.beep(times);
	}
}])

/**
 * https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md
 */
 .service('geolocation', [function geolocation(){
	this.getCurrentPosition = function getCurrentPosition(geolocationOptions) {
		var def = $q.defer();

		navigator.geolocation.getCurrentPosition(def.resolve, def.reject, geolocationOptions);
		return def.promise;
	};

	this.watchPosition = function watchPosition(geolocationSuccess, geolocationError, geolocationOptions) {
		var onSuccess = function() {
			$timeout(geolocationSuccess);
		};

		var onFail = function() {
			$timeout(geolocationError);
		};

		return navigator.geolocation.watchPosition(onSuccess, onFail, geolocationOptions);
	};

	this.clearWatch = function clearWatch(watchID) {
		navigator.geolocation.clearWatch(watchID);
	};
}])

 .service('globalization', ['$timeout', function globalization($timeout){
 	this.getPreferredLanguage = function getPreferredLanguage() {
 		var def = $q.defer();
 		navigator.globalization.getPreferredLanguage(def.resolve, def.reject);
 		return def.promise;
 	};

	this.getLocaleName = function getLocaleName() {
		var def = $q.defer();
		navigator.globalization.getLocaleName(def.resolve, def.reject);
		return def.promise;
	};

	this.dateToString = function dateToString(date, options) {
		var def = $q.defer();
		navigator.globalization.dateToString(date, def.resolve, def.reject, options);
		return def.promise;
	};

	this.getCurrencyPattern = function getCurrencyPattern(currencyCode) {
		var def = $q.defer();
		navigator.globalization.getCurrencyPattern(currencyCode, def.resolve, def.reject);
		return def.promise;
	};


	this.getDateNames = function getDateNames(options) {
		var def = $q.defer();
		navigator.globalization.getDateNames(def.resolve, def.reject, options);
		return def.promise;
	};

	this.getDatePattern = function getDatePattern(options) {
		var def = $q.defer();
		navigator.globalization.getDatePattern(def.resolve, def.reject, options);
		return def.promise;
	};

	this.getFirstDayOfWeek = function getFirstDayOfWeek() {
		var def = $q.defer();
		navigator.globalization.getFirstDayOfWeek(def.resolve, def.reject);
		return def.promise;
	};

	this.getNumberPattern = function getNumberPattern(options) {
		var def = $q.defer();
		navigator.globalization.getNumberPattern(def.resolve, def.reject, options);
		return def.promise;
	};

	this.isDayLightSavingsTime= function isDayLightSavingsTime(date) {
		var def = $q.defer();
		navigator.globalization.isDayLightSavingsTime(date, def.resolve, def.reject);
		return def.promise;
	};

	this.numberToString= function numberToString(number, options) {
		var def = $q.defer();
		navigator.globalization.numberToString(number, def.resolve, def.reject, options);
		return def.promise;
	};

	this.stringToDate= function stringToDate(dateString, options) {
		var def = $q.defer();
		navigator.globalization.stringToDate(dateString, def.resolve, def.reject, options);
		return def.promise;
	};

	this.stringToNumber= function stringToNumber(string, options) {
		var def = $q.defer();
		navigator.globalization.stringToNumber(string, def.resolve, def.reject, options);
		return def.promise;
	};
 }]);


// TODO: Complete