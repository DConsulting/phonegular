'use strict';

angular.module('phonegularTest', [
	'ngRoute',
	'ngTouch',
	'ngMaterial',
	'phonegular',

	'phonegularTest.controllers'
])
	.config(['$routeProvider', '$locationProvider', '$mdThemingProvider', function($routeProvider, $locationProvider, $mdThemingProvider) {
		// Apply theme colors
		$mdThemingProvider.definePalette(
			'docs-blue',
			$mdThemingProvider.extendPalette('blue', {
				50: '#DCEFFF',
				100: '#AAD1F9',
				200: '#7BB8F5',
				300: '#4C9EF1',
				400: '#1C85ED',
				500: '#106CC8',
				600: '#0159A2',
				700: '#025EE9',
				800: '#014AB6',
				900: '#013583',
				contrastDefaultColor: 'light',
				contrastDarkColors: '50 100 200 A100',
				contrastStrongLightColors: '300 400 A200 A400'
			})
		);

		$mdThemingProvider.definePalette('docs-red',
			$mdThemingProvider.extendPalette('red', {A100: '#DE3641'})
		);

		$mdThemingProvider.theme('docs-dark','default').primaryPalette('yellow').dark();
		$mdThemingProvider.theme('default').primaryPalette('docs-blue').accentPalette('docs-red');

		// Setup routing
		$routeProvider
			.otherwise({
				templateUrl: 'views/sound-manager.html'
			});
	}]);
