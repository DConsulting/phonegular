'use strict';

angular.module('phonegularTest', [
	'ngRoute',
	'ngTouch',
	'ngMaterial',
	'phonegular',

	'phonegularTest.controllers'
])
	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
			.otherwise({
				templateUrl: 'views/sound-manager.html'
			});
	}]);
