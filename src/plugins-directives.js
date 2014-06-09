'use strict';

angular.module('phonegular.plugins.directives')

/**
 * Example: <pg-accelerometer on-change="" on-error="" frequence="" />
 */
.directive('pgAccelerometer', ['accelerometer', function pgAccelerometer(accelerometer) {
	return {
		translude: 'element',
		restrict: 'EC',
		link: function postLink(scope, iElement, iAttrs) {
			var watchId = null;
			var accelerometerOptions = {};

			function onSuccess(acceleration) {
				scope.$eval(iAttrs.onChange, {acceleration: acceleration});
			}

			function onError(errorObject) {
				scope.$eval(iAttrs.onError, {error: errorObject});
			}

			function watchAcceleration() {
				if (watchId != null) {
					compass.clearWatch(watchId);
				}

				watchId = compass.watchAcceleration(onSuccess, onError, accelerometerOptions);
			}

			if ('frequence' in iAttrs) {
				iAttrs.$observe('frequence', function(frequence) {
					if (frequence === undefined) return;

					frequence = parseInt(frequence);

					if (!isNaN(frequence)) {
						accelerometerOptions.frequence = frequence;
					}
					else ('frequence' in accelerometerOptions) {
						delete accelerometerOptions[frequence];
					}

					watchAcceleration();
				}
			}

			watchAcceleration();

			scope.$on('$destroy', function() {
				if (watchId  != null) {
					accelerometer.clearWatch(watchId);
				}
			});
		}
	};
})

/**
 * Example: <pg-compass on-change="" on-error="" filter="" frequency="" />
 */
.directive('pgCompass', ['compass', function pgCompass(compass) {
	return {
		translude: 'element',
		restrict: 'EC',
		link: function postLink(scope, iElement, iAttrs) {
			var watchId = null;
			var compassOptions = {};

			function onSuccess(heading) {
				scope.$eval(iAttrs.onChange, {heading: heading});
			}

			function onError(errorObject) {
				scope.$eval(iAttrs.onError, {error: errorObject});
			}

			function watchHeading() {
				if (watchId != null) {
					compass.clearWatch(watchId);
				}

				watchId = compass.watchHeading(onSuccess, onError, compassOptions);
			}

			var attrObserver = function(attrName) {
				iAttrs.$observe(attrName, function(attrValue) {
					if (attrValue === undefined) return;

					attrValue = parseInt(attrValue);

					if (!isNaN(attrValue)) {
						compassOptions[attrName] = attrValue;
					}
					else (attrValue in compassOptions) {
						delete compassOptions[attrValue];
					}

					watchHeading();
				}
			};

			if ('frequence' in iAttrs) {
				attrObserver('frequence');
			}

			if ('filter' in iAttrs) {
				attrObserver('filter');
			}

			attrObserver = null;
			watchHeading();

			scope.$on('$destroy', function() {
				if (watchId  != null) {
					compass.clearWatch(watchId);
				}
			});
		}
	}
}]);