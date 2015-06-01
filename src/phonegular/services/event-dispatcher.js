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
