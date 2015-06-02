'use strict';

angular.module('phonegularTest.controllers', [

])
	.controller('PhonegularTestCtrl', ['$scope', '$rootScope', '$mdMedia', '$mdSidenav', '$mdUtil', function PhonegularTestCtrl($scope, $rootScope, $mdMedia, $mdSidenav, $mdUtil) {
		$rootScope.$mdSidenav = $mdSidenav;
		$rootScope.$mgMedia = $mdMedia;
		$scope.toggleLeft = buildToggler('left');

		/**
		 * Build handler to open/close a SideNav; when animation finishes
		 * report completion in console
		 */
		function buildToggler(navID) {
			var debounceFn =  $mdUtil.debounce(function(){
				$mdSidenav(navID)
					.toggle()
					.then(function () {
						$log.debug("toggle " + navID + " is done");
					});
			},300);
			return debounceFn;
		}
	}])

	.controller('NavigationCtrl', ['$scope', '$mdSidenav', function($scope,  $mdSidenav) {
		this.close = function () {
			$mdSidenav('left').close();
		};
	}]);
