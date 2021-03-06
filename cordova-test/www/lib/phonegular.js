(function (angular) {

	// Create all modules and define dependencies to make sure they exist
	// and are loaded in the correct order to satisfy dependency injection
	// before all nested files are concatenated by Gulp

	// Config
	angular.module('phonegular.config', [])
		.value('phonegular.config', {
			debug: true
		});

	// Modules
	angular.module('phonegular.directives', []);
	angular.module('phonegular.filters', []);
	angular.module('phonegular.services', []);
	angular.module('phonegular',
		[
			'phonegular.config',
			'phonegular.directives',
			'phonegular.filters',
			'phonegular.services'
		])

		/**
		 * Adds a Phonegular global class instance
		 */
		.run(['PhonegularClass', function (PhonegularClass) {
			function Phonegular() {

			}

			/**
			 * @param {Function} subclass The subclass.
			 * @param {Function) superclass The superclass to extend.
			 * @return {Function} The new prototype
			 */
			Phonegular.prototype.extendClass = function (subclass, superclass) {
				var mix = subclass;
				mix.prototype = Object.create(superclass.prototype);
				mix.prototype.constructor = subclass;

				/**
				 * @param {Object} methods Key-value pair with objects
				 */
				mix.addMethods = function (methods) {
					for (var methodName in methods) {
						mix.prototype[methodName] = methods[methodName];
					}
				};

				return mix;
			};

			window.phonegular = new Phonegular();
		}]);

})(angular);

(function() {
	'use strict';

	/* jshint ignore:start */
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame =
			window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
	/* jshint ignore:end */
}) ();

/**
 * ECMA Script 6 Array polyfills. Code copied from MDN polyfill articles.
 */
(function() {
	'use strict';

	/* jshint ignore:start */
	if (!Array.of) {
		Array.of = function(varArgs) {
			return Array.prototype.slice.call(arguments);
		};
	}

	if (!Array.prototype.find) {
		Array.prototype.find = function(predicate) {
			if (this == null) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return value;
				}
			}
			return undefined;
		};
	}

	if (!Array.prototype.findIndex) {
		Array.prototype.findIndex = function(predicate) {
			if (this == null) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return i;
				}
			}
			return -1;
		};
	}
	/* jshint ignore:end */
}) ();

/**
 * ECMA Script 6 Array polyfills. Code copied from MDN polyfill articles.
 */
(function() {
	'use strict';

	/* jshint ignore:start */
	if (typeof Object.create != 'function') {
		Object.create = (function() {
			var Temp = function() {};
			return function (prototype) {
				if (arguments.length > 1) {
					throw Error('Second argument not supported');
				}
				if (typeof prototype != 'object') {
					throw TypeError('Argument must be an object');
				}
				Temp.prototype = prototype;
				var result = new Temp();
				Temp.prototype = null;
				return result;
			};
		})();
	}
	/* jshint ignore:end */
}) ();

angular.module('phonegular.services')
	/**
	 * Event dispatcher factory to use with your services.
	 */
	.factory('EventDispatcher', ['PhonegularClass', function(PhonegularClass) {

		/**
		 * @constructor
		 */
		function EventDispatcher() {
			PhonegularClass.call(this);
			this._listeners = {};
		}

		phonegular.extendClass(EventDispatcher, PhonegularClass);

		/**
		 * TODO: Add support for namespaces like we have in jQuery
		 * @param {String} eventType
		 * @param {Function} callback
		 */
		EventDispatcher.prototype.on = function(eventType, callback) {
			var listeners = this._listeners[eventType];

			if (!listeners) {
				this._listeners[eventType] = [callback];
			} else {
				if (listeners.indexOf(callback) <= 0) {
					listeners.push(callback);
				}
			}

			return this;
		};

		/**
		 * TODO: Add support for namespaces like we have in jQuery
		 * @param {String} eventType
		 * @param {Function} [callback]
		 */
		EventDispatcher.prototype.off = function(eventType, callback) {
			var listeners = this._listeners[eventType];

			if (!listeners) {
				return this;
			} else if (callback != null) {
				var callbackIndex = listeners.indexOf(callback);

				if (callbackIndex >= 0) {
					if (listeners.length <= 1) {
						this._listeners[eventType] = null;
					} else {
						listeners.splice(callbackIndex, 1);
					}
				}
			} else {
				// Remove all listeners
				this._listeners[eventType] = null;
			}

			return this;
		};

		/**
		 *
		 * @param {String|Event} event
		 * @param {Array|Object} extraParameter
		 * @returns {Timer}
		 */
		EventDispatcher.prototype.trigger = function(event, extraParameter, varArgs) {
			var parameters = Array.prototype.slice.call(arguments);
			var eventObject = event instanceof Event ? event : new CustomEvent(event, {detail: parameters});
			var listeners = this._listeners[eventObject.type];

			parameters[0] = eventObject;

			if (listeners) {
				for (var i = 0, len = listeners.length; i < len; i++) {
					listeners[i].apply(this, parameters);
				}
			}

			return this;
		};

		/**
		 * @param {String} type
		 * @return {Boolean}
		 */
		EventDispatcher.prototype.hasEventListener = function(type) {
			var typeListeners = this._listeners[type];
			return typeListeners != null && typeListeners.length > 0;
		};

		EventDispatcher.prototype.addEventListener = EventDispatcher.prototype.on;
		EventDispatcher.prototype.removeEventListener = EventDispatcher.prototype.off;
		EventDispatcher.prototype.dispatchEvent = EventDispatcher.prototype.trigger;

		return EventDispatcher;
	}]);

angular.module('phonegular.services')
	/**
	 * Base class for all phonegular services. This should be kept as simple as possible.
	 * It's up to you to call the parent constructors.
	 *
	 * Example:
	 * .factory('CustomClass', function() {
		 *     function CustomClass() {
		 *         CustomClass.call(this);
		 *     }
		 *
		 *     phonegular.extendClass(CustomClass, PhonegularClass);
		 *     return CustomClass;
		 * })
	 */
	.factory('PhonegularClass', [function() {
		function PhonegularClass() {

		}

		/**
		 * @param {Function} otherType
		 */
		PhonegularClass.prototype.is = function(otherType) {
			return this instanceof otherType;
		};

		return PhonegularClass;
	}]);

angular.module('phonegular.services')
	.run(['popupManager', function(popupManager) {
		if ('cordova' in window) {
			// Replaces only the alert function. Use popupManager for the other implementation

			/**
			 * @param {String} message
			 */
			window.alert = function(message) {
				popupManager.alert(message);
			};
		}
	}])

	.service('popupManager', ['$q', '$timeout', function popupManager($q, $timeout) {
		var self = this;

		/**
		 *
		 * @param {String} message
		 * @param {String} [title]
		 * @param {String} [buttonName]
		 * @return {Promise}
		 */
		this.alert = function alert(message, title, buttonName) {
			var def = $q.defer();

			if (navigator != null && navigator.notification != null) {
				navigator.notification.alert(message, function() {
					$timeout(def.resolve);
				}, title || 'Alert', buttonName);
			}
			else {
				window.alert(message);
				def.resolve();
			}

			return def.promise;
		};

		/**
		 *
		 * @param {String} message
		 * @param {String} [title]
		 * @return {Promise}
		 */
		this.error = function error(message, title) {
			return self.alert(message, title || 'Error');
		};

		/**
		 *
		 * @param {String} message
		 * @param {String} [title]
		 * @param {String} [okLabel]
		 * @param {String} [cancelLabel]
		 * @return {Promise}
		 */
		this.confirm = function confirm(message, title, okLabel, cancelLabel) {
			var def = $q.defer();

			function confirmCallback(buttonIndex) {
				if (buttonIndex === 1) {
					// OK was clicked
					def.resolve();
				}

				def.reject();
			}

			if (navigator != null && navigator.notification != null) {
				navigator.notification.confirm(message, confirmCallback, title || 'Confirm', [okLabel || 'OK', cancelLabel || 'Cancel']);
			}
			else {
				confirmCallback(window.confirm(message) ? 1 : 2);
			}

			return def.promise;
		}
	}]);

angular.module('phonegular.services')

	// TODO: Add desktop fallback to audio tag
	.service('soundManager', ['$q', '$log', '$timeout', function soundManager($q, $log, $timeout) {
		var nativeAudio = null;
		var self = this;

		this._preloadedSounds = {};

		/**
		 * @returns {*}
		 * @private
		 */
		this._getPlugin = function() {
			if (!nativeAudio) {
				nativeAudio = window.plugins && window.plugins.NativeAudio ? window.plugins.NativeAudio : null;
			}

			return nativeAudio;
		};

		this.isSupported = function() {
			self._getPlugin();

			return nativeAudio != null;
		};

		/**
		 * @param {String} assetPath
		 */
		this.preloadFX = function(assetPath) {
			var def = $q.defer();

			self._getPlugin();

			if (typeof assetPath === 'object') {
				assetPath = assetPath.src;
			}

			if (nativeAudio) {
				if (!self._preloadedSounds[assetPath]) {
					nativeAudio.preloadSimple(assetPath, assetPath,
						function onSuccess() {
							$timeout(function () {
								self._preloadedSounds[assetPath] = true;
								def.resolve(assetPath);
							});
						},
						function onFail() {
							$timeout(function () {
								def.reject(assetPath);
							});
						}
					);
				} else {
					$timeout(function () {
						def.resolve(assetPath);
					});
				}
			} else {
				def.reject();
			}

			return def.promise;
		};

		/**
		 * @param {String} assetPath
		 * @param {Number} volume
		 */
		this.preloadAudio = function(assetPath, volume) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (!self._preloadedSounds[url] && nativeAudio) {
				nativeAudio.preloadComplex(url, url, volume, 1, 0,
					function onSuccess() {
						$timeout(function () {
							self._preloadedSounds[url] = true;
							def.resolve(url);
						});
					},
					function onFail(message) {
						$timeout(function () {
							$log.error('soundService >> preloadAudio: ' + message);
							def.reject(url);
						});
					}
				);
			} else {
				$timeout(function () {
					def.resolve(url);
				});
			}

			return def.promise;
		};

		this.play = function(assetPath) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (!nativeAudio) {
				$timeout(function() {
					def.resolve(url);
				});
			} else if (self._preloadedSounds[url]) {
				nativeAudio.play(url, angular.noop,
					function onPlayError() {
						$timeout(function () {
							$log.error('soundService >> Failed to play "' + url + '".');
							def.reject(url);
						});
					},
					function onPlayComplete() {
						$timeout(function () {
							def.resolve(url);
						});
					}
				);
			} else {
				self.preloadFX(url).then(
					function onPreloadSuccess() {
						self.play(url).then(function() {
							self.unload(url).then(def.resolve);
						}, def.reject);
					},
					function onPreloadFail() {
						def.reject(url);
					}
				);
			}


			return def.promise;
		};

		this.stop = function(assetPath) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (nativeAudio) {
				nativeAudio.stop(url,
					function onStopSuccess() {
						$timeout(function() {
							def.resolve(url);
						});
					},
					function onStopError() {
						$timeout(function() {
							$log.error('soundService >> Failed to stop "' + url + '".');
							def.reject(url);
						});
					}
				);
			}

			return def.promise;
		};

		this.loop = function(assetPath) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (nativeAudio) {
				nativeAudio.loop(url);
				def.resolve();
			} else {
				def.resolve();
			}

			return def.promise;
		};

		this.unload = function(assetPath) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (self._preloadedSounds[url]) {
				nativeAudio.unload(url,
					function() {
						$timeout(function() {
							self._preloadedSounds[url] = false;
							def.resolve(url);
						});
					},
					function() {
						$timeout(function() {
							self._preloadedSounds[url] = false;
							def.reject(url);
						});
					}
				);
			} else {
				$timeout(function() {
					def.resolve(url);
				});
			}

			return def.promise;
		};
	}]);
