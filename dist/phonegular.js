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
