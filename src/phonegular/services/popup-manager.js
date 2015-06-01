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
