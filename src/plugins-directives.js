angular.module('phonegular.plugins.directives')

/**
 * Example: <pg-accelerometer on-change="" />
 */
.directive('pgAccelerometer', function pgAccelerometer() {
	return {
		translude: 'element',
		restrict: 'EC',
		link: function postLink(scope, iElement, iAttrs) {
		}
	};
})

/**
 * Example: <pg-compass on-change="" />
 */
.directive('pgCompass', function pgCompass() {
	return {
		translude: 'element',
		restrict: 'EC',
		link: function postLink(scope, iElement, iAttrs) {

		}
	}
});